"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, Lock, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { config } from "../config";
import { Level } from "../types";
import { ApplyDialog } from "./ApplyDialog";

interface MapViewProps {
  jobTitle: string;
  levels: Level[];
  progress: number;
  onLevelClick: (level: Level) => void;
  onSettingsClick: () => void;
  onExpressApply: () => void;
  onBackToCampus: () => void;
}

const ROW_HEIGHT = 150;
const SVG_WIDTH = 600;
const CENTER_X = SVG_WIDTH / 2;
const OFFSET_X = 50;

function StartTooltip({ isFirst }: { isFirst: boolean }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(
      () => {
        setIsFading(true);
      },
      isFirst ? 5000 : 3000
    );

    const hideTimer = setTimeout(
      () => {
        setIsVisible(false);
      },
      isFirst ? 5500 : 3500 // Add 500ms for fade-out duration
    );

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [isFirst]);

  if (!isVisible || !isFirst) return null;

  return (
    <div
      className={cn(
        "absolute -top-12 z-10 animate-bounce whitespace-nowrap rounded-xl border-2 bg-white",
        "px-3 py-2.5 font-bold uppercase tracking-wide opacity-100 ",
        "transition-opacity duration-700",
        isFading ? "opacity-0" : ""
      )}
      style={{
        borderColor: config.company.primaryColor,
        color: config.company.primaryColor,
      }}
    >
      {isFirst ? "Start" : config.copy.continueButton}
      <div
        className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
        style={{ borderTopColor: config.company.primaryColor }}
        aria-hidden
      />
    </div>
  );
}

export function MapView({
  jobTitle,
  levels,
  progress,
  onLevelClick,
  onSettingsClick,
  onExpressApply,
  onBackToCampus,
}: MapViewProps) {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  // Create a map for quick level lookup
  const levelMap = new Map(levels.map((level) => [level.id, level]));

  // Determine if we're using graph structure (has row or nextLevelIds)
  const usesGraphStructure = levels.some(
    (level) => level.row !== undefined || level.nextLevelIds !== undefined
  );

  // Pre-calculate positions
  const levelPositions = levels.map((level, index) => {
    // Use row if provided, otherwise use index
    const row = level.row !== undefined ? level.row : index;

    // Calculate y position based on row
    const y = row * ROW_HEIGHT + 60; // Start with some padding

    // For x position: if using graph structure and multiple levels on same row, distribute them
    let x;
    if (usesGraphStructure && level.row !== undefined) {
      // Find all levels on the same row
      const levelsOnSameRow = levels.filter((l) => l.row === level.row);
      const indexInRow = levelsOnSameRow.findIndex((l) => l.id === level.id);

      if (levelsOnSameRow.length === 1) {
        // Single level on row, center it
        x = CENTER_X;
      } else {
        // Multiple levels on same row, distribute evenly
        const spacing = SVG_WIDTH / (levelsOnSameRow.length + 1);
        x = spacing * (indexInRow + 1);
      }
    } else {
      // Fallback to original zigzag pattern for backward compatibility
      const cycleLength = 8;
      const cycleIndex = index % cycleLength;
      let indentationLevel;

      if (cycleIndex <= 2) indentationLevel = cycleIndex;
      else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
      else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
      else indentationLevel = cycleIndex - 8;

      const xOffset = -indentationLevel * OFFSET_X;
      x = CENTER_X + xOffset;
    }

    return { level, x, y, index, row };
  });

  // Calculate total height based on max row
  const maxRow = usesGraphStructure
    ? Math.max(...levels.map((l) => l.row ?? 0), levels.length - 1)
    : levels.length - 1;
  const totalHeight = (maxRow + 1) * ROW_HEIGHT + 100;

  // Generate path data connecting levels based on graph structure
  const generatePathSegment = (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    const midY = (from.y + to.y) / 2;
    return ` C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
  };

  // Generate all paths (for base and completed)
  const allPaths: Array<{
    from: { level: Level; x: number; y: number };
    to: { level: Level; x: number; y: number };
  }> = [];

  if (usesGraphStructure) {
    // Use graph structure: follow nextLevelIds
    levelPositions.forEach((pos) => {
      const level = pos.level;
      if (level.nextLevelIds && level.nextLevelIds.length > 0) {
        level.nextLevelIds.forEach((nextId) => {
          const nextPos = levelPositions.find((p) => p.level.id === nextId);
          if (nextPos) {
            allPaths.push({ from: pos, to: nextPos });
          }
        });
      }
    });
  } else {
    // Fallback to sequential connections for backward compatibility
    for (let i = 0; i < levelPositions.length - 1; i++) {
      allPaths.push({
        from: levelPositions[i],
        to: levelPositions[i + 1],
      });
    }
  }

  // Generate path strings
  const pathSegments: string[] = [];
  const completedPathSegments: string[] = [];

  allPaths.forEach(({ from, to }) => {
    const segment = generatePathSegment(from, to);
    pathSegments.push(`M ${from.x} ${from.y}${segment}`);

    // Only add to completed path if the source level is completed
    if (from.level.status === "completed") {
      completedPathSegments.push(`M ${from.x} ${from.y}${segment}`);
    }
  });

  const pathData = pathSegments.join(" ");
  const completedPathData = completedPathSegments.join(" ");

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-slate-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* 1. Blueprint Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)", // Fade out at bottom
          }}
        />

        {/* 2. Atmosphere Glow - Wide gradient instead of blobs */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(100% 100% at 50% -10%, ${config.company.primaryColor}20 0%, transparent 60%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 60% at 90% 40%, ${config.company.primaryColor}10 0%, transparent 100%)`,
          }}
        />

        {/* 3. Floating Particles */}
        <div className="animate-float-slow pointer-events-none absolute right-10 top-20 select-none text-[150px] opacity-10 blur-[2px]">
          {config.company.logoUrl}
        </div>
        <div className="animate-float-slower pointer-events-none absolute bottom-40 left-10 select-none text-[100px] opacity-10 blur-[2px]">
          {config.company.logoUrl}
        </div>
      </div>

      <ApplyDialog
        isOpen={isApplyDialogOpen}
        onClose={() => setIsApplyDialogOpen(false)}
        onConfirm={onExpressApply}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex h-full flex-col">
        <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-6 pt-[20px] lg:pt-[50px]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToCampus}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </button>
            <button
              onClick={onSettingsClick}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition hover:bg-white"
            >
              <Settings className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <button
            onClick={() => setIsApplyDialogOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-slate-200 bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:bg-white"
          >
            <span>🏁</span>
            {config.copy.jobMerken}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto mt-2 h-full max-w-[912px] px-3">
            <h1 className="mb-5 text-center text-2xl font-bold text-neutral-700">
              {jobTitle}
            </h1>

            <div
              className="relative mx-auto w-full max-w-[600px]"
              style={{ height: totalHeight }}
            >
              {/* Connection Path */}
              <svg
                className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full"
                viewBox={`0 0 ${SVG_WIDTH} ${totalHeight}`}
                preserveAspectRatio="none"
              >
                {/* Base Path - Solid colored line (dimmed) */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={config.company.primaryColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.15"
                />

                {/* Progress Path - Solid fully opaque */}
                <path
                  d={completedPathData}
                  fill="none"
                  stroke={config.company.primaryColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Energy Flow Animation */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={config.company.primaryColor}
                  strokeWidth="4"
                  strokeDasharray="10 20"
                  strokeLinecap="round"
                  className="animate-flow opacity-40"
                />
              </svg>

              {/* Levels */}
              {levelPositions.map(({ level, x, y, index, row }) => {
                const isCompleted = level.status === "completed";
                const isLocked = level.status === "locked";
                const isUnlocked = level.status === "unlocked";
                // Find the first unlocked but not completed level to be the "current" one
                const firstUnlockedNotCompleted = levelPositions.find(
                  (pos) => {
                    const posCompleted = pos.level.status === "completed";
                    return pos.level.status === "unlocked" && !posCompleted;
                  }
                );
                const isCurrent =
                  isUnlocked &&
                  !isCompleted &&
                  firstUnlockedNotCompleted?.level.id === level.id;
                const isUnlockedButNotCurrent =
                  isUnlocked && !isCompleted && !isCurrent;
                // First level is the one with row 0 (or index 0 if not using graph structure)
                const isFirst =
                  usesGraphStructure
                    ? row === 0
                    : index === 0;

                return (
                  <div
                    key={level.id}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${(x / SVG_WIDTH) * 100}%`,
                      top: y - 35, // Position center of button at y
                      transform: "translateX(-50%)",
                      zIndex: 10,
                    }}
                  >
                    {isCurrent ? (
                      <>
                        <StartTooltip isFirst={isFirst} />
                        <Button
                          size="rounded"
                          className="h-[70px] w-[70px] border-b-8 shadow-xl transition-transform active:scale-95"
                          onClick={() => onLevelClick(level)}
                          style={{
                            backgroundColor: config.company.primaryColor,
                            borderColor: `${config.company.primaryColor}CC`, // Slightly transparent/darker for border
                          }}
                        >
                          <span className="text-3xl">{level.icon}</span>
                        </Button>
                        <div
                          className="mt-3 whitespace-nowrap rounded-xl border-2 bg-white px-3 py-1.5 text-center text-sm font-bold shadow-lg"
                          style={{
                            borderColor: `${config.company.primaryColor}40`, // 25% opacity
                            color: config.company.primaryColor,
                          }}
                        >
                          {level.title}
                        </div>
                      </>
                    ) : (
                      <>
                        <Button
                          size="rounded"
                          variant={isLocked ? "locked" : "secondary"}
                          className="h-[70px] w-[70px] border-b-8 bg-white shadow-md disabled:opacity-100"
                          onClick={() => onLevelClick(level)}
                          disabled={isLocked}
                          style={{
                            pointerEvents: isLocked ? "none" : "auto",
                            cursor: isCompleted ? "pointer" : undefined,
                            borderColor: isCompleted
                              ? config.company.primaryColor
                              : undefined,
                          }}
                        >
                          {isLocked ? (
                            <Lock className="h-10 w-10 fill-neutral-400 stroke-neutral-400 text-neutral-400" />
                          ) : isUnlockedButNotCurrent ? (
                            <span
                              className="text-3xl"
                              style={{
                                filter: "grayscale(100%) brightness(0) opacity(0.4)",
                              }}
                            >
                              {level.icon}
                            </span>
                          ) : (
                            <span className="text-3xl">{level.icon}</span>
                          )}
                        </Button>
                        {isCompleted && (
                          <div
                            className="absolute -right-1 -top-1 rounded-full p-1 shadow-sm"
                            style={{
                              backgroundColor: config.company.primaryColor,
                            }}
                          >
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "mt-3 whitespace-nowrap rounded-xl border-2 bg-white px-3 py-1.5 text-center text-sm font-bold shadow-lg",
                            isCompleted ? "" : "border-slate-300 text-slate-600"
                          )}
                          style={
                            isCompleted
                              ? {
                                  borderColor: `${config.company.primaryColor}40`,
                                  color: config.company.primaryColor,
                                }
                              : {}
                          }
                        >
                          {level.title}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
