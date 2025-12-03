"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, Lock, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { config } from "../config";
import { Level } from "../types";

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

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "absolute -top-12 z-10 whitespace-nowrap rounded-xl border-2 bg-white px-3 py-2.5 font-bold uppercase tracking-wide text-green-500 transition-opacity duration-500",
        isFading ? "opacity-0" : "animate-bounce opacity-100"
      )}
    >
      {isFirst ? "Start" : "Weiter"}
      <div
        className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
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
  // Pre-calculate positions
  const levelPositions = levels.map((level, index) => {
    const cycleLength = 8;
    const cycleIndex = index % cycleLength;
    let indentationLevel;

    if (cycleIndex <= 2) indentationLevel = cycleIndex;
    else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
    else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
    else indentationLevel = cycleIndex - 8;

    // Calculate x offset (negative because original 'right' property moved it left)
    const xOffset = -indentationLevel * OFFSET_X;

    const x = CENTER_X + xOffset;
    const y = index * ROW_HEIGHT + 60; // Start with some padding

    return { level, x, y, index };
  });

  const totalHeight = levels.length * ROW_HEIGHT + 100;

  // Generate path data connecting the centers
  let pathData = "";
  let completedPathData = "";

  if (levelPositions.length > 1) {
    const startPos = levelPositions[0];
    pathData = `M ${startPos.x} ${startPos.y}`;
    completedPathData = `M ${startPos.x} ${startPos.y}`;

    for (let i = 0; i < levelPositions.length - 1; i++) {
      const curr = levelPositions[i];
      const next = levelPositions[i + 1];
      const midY = (curr.y + next.y) / 2;
      const segment = ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;

      pathData += segment;

      if (curr.level.status === "completed") {
        completedPathData += segment;
      }
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-6 pt-[20px] lg:pt-[50px]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCampus}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </button>
          <button
            onClick={onSettingsClick}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
          >
            <Settings className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <button
          onClick={onExpressApply}
          className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
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
              {/* Gray Background Path */}
              <path
                d={pathData}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
                strokeDasharray="12 12"
                strokeLinecap="round"
              />
              {/* Green Completed Path */}
              <path
                d={completedPathData}
                fill="none"
                stroke="#4ade80"
                strokeWidth="10"
                strokeDasharray="12 12"
                strokeLinecap="round"
              />
            </svg>

            {/* Levels */}
            {levelPositions.map(({ level, x, y, index }) => {
              const isCompleted = level.status === "completed";
              const isLocked = level.status === "locked";
              const isCurrent = level.status === "unlocked" && !isCompleted;
              const isFirst = index === 0;

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
                        variant={isLocked ? "locked" : "secondary"}
                        className="h-[70px] w-[70px] border-b-8"
                        onClick={() => onLevelClick(level)}
                      >
                        <span className="text-3xl">{level.icon}</span>
                      </Button>
                      <div
                        className={cn(
                          "mt-3 whitespace-nowrap rounded-xl border-2 bg-white px-3 py-1.5 text-center text-sm font-bold shadow-lg",
                          "border-green-300 text-green-600"
                        )}
                      >
                        {level.title}
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        size="rounded"
                        variant={isLocked ? "locked" : "secondary"}
                        className="h-[70px] w-[70px] border-b-8 disabled:opacity-100"
                        onClick={() => onLevelClick(level)}
                        disabled={isLocked}
                        style={{
                          pointerEvents: isLocked ? "none" : "auto",
                          cursor: isCompleted ? "pointer" : undefined,
                        }}
                      >
                        {isLocked ? (
                          <Lock className="h-10 w-10 fill-neutral-400 stroke-neutral-400 text-neutral-400" />
                        ) : (
                          <span className="text-3xl">{level.icon}</span>
                        )}
                      </Button>
                      {isCompleted && (
                        <div className="absolute -right-1 -top-1 rounded-full bg-green-500 p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "mt-3 whitespace-nowrap rounded-xl border-2 bg-white px-3 py-1.5 text-center text-sm font-bold shadow-lg",
                          isCompleted
                            ? "border-green-300 text-green-600"
                            : "border-slate-300 text-slate-600"
                        )}
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
  );
}
