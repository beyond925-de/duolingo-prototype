"use client";

import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Level } from "../../types";
import { PositionedLevel } from "./mapTypes";
import { StartTooltip } from "./StartTooltip";

interface CompletedLevelDecorationsProps {
  index: number;
  nodeAccent: string;
}

function CompletedLevelDecorations({
  index,
  nodeAccent,
}: CompletedLevelDecorationsProps) {
  return (
    <>
      <div className="pointer-events-none absolute -left-12 top-0 animate-pulse text-xl opacity-60">
        ✨
      </div>
      <div
        className="pointer-events-none absolute -right-10 top-4 animate-pulse text-sm opacity-50"
        style={{ animationDelay: "0.5s" }}
      >
        ⭐
      </div>
      {/* Floating skill badges for some completed levels */}
      {index % 3 === 0 && (
        <div
          className="pointer-events-none absolute -left-12 top-8 animate-float-slow whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold opacity-70 shadow-sm"
          style={{
            backgroundColor: `${nodeAccent}20`,
            color: nodeAccent,
            border: `1px solid ${nodeAccent}40`,
          }}
        >
          🎯 Skills
        </div>
      )}
      {index % 4 === 0 && (
        <div
          className="pointer-events-none absolute -right-16 top-12 animate-float-slower whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold opacity-70 shadow-sm"
          style={{
            backgroundColor: `${nodeAccent}20`,
            color: nodeAccent,
            border: `1px solid ${nodeAccent}40`,
          }}
        >
          🤝 Team
        </div>
      )}
      {index % 5 === 0 && (
        <div
          className="pointer-events-none absolute -right-16 -top-4 animate-float whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold opacity-70 shadow-sm"
          style={{
            backgroundColor: `${nodeAccent}20`,
            color: nodeAccent,
            border: `1px solid ${nodeAccent}40`,
          }}
        >
          💰 Benefits
        </div>
      )}
    </>
  );
}

interface LevelNodeProps {
  position: PositionedLevel;
  isGlobalMode: boolean;
  accentColor: string;
  nodeAccent: string;
  isCurrent: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  isUnlocked: boolean;
  isUnlockedButNotCurrent: boolean;
  isPartOfBranch: boolean;
  isFirst: boolean;
  isMilestone: boolean;
  buttonDisabled: boolean;
  levelKey: string;
  horizontalPadding: number;
  widthForPositioning: number;
  onLevelClick: (level: Level) => void;
}

export function LevelNode({
  position,
  isGlobalMode,
  accentColor,
  nodeAccent,
  isCurrent,
  isCompleted,
  isLocked,
  isUnlocked,
  isUnlockedButNotCurrent,
  isPartOfBranch,
  isFirst,
  isMilestone,
  buttonDisabled,
  levelKey,
  horizontalPadding,
  widthForPositioning,
  onLevelClick,
}: LevelNodeProps) {
  const { level, x, y, index } = position;

  return (
    <div
      key={levelKey}
      className="absolute flex flex-col items-center"
      style={{
        left: `${((x + horizontalPadding) / widthForPositioning) * 100}%`,
        top: y - 35,
        transform: "translateX(-50%)",
        zIndex: 10,
      }}
    >
      {/* Floating decorative spheres around the node */}
      {isCurrent && (
        <>
          <div
            className="pointer-events-none absolute -left-16 -top-4 h-8 w-8 animate-float-slow rounded-full opacity-30 blur-sm"
            style={{
              backgroundColor: nodeAccent,
            }}
          />
          <div
            className="pointer-events-none absolute -right-14 top-2 h-6 w-6 animate-float-slower rounded-full opacity-25 blur-sm"
            style={{
              backgroundColor: nodeAccent,
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-6 left-12 h-5 w-5 animate-float rounded-full opacity-20 blur-sm"
            style={{
              backgroundColor: nodeAccent,
            }}
          />
        </>
      )}

      {/* Sparkles for completed levels */}
      {isCompleted && (
        <CompletedLevelDecorations index={index} nodeAccent={nodeAccent} />
      )}

      {/* Glow ring for current level */}
      {isCurrent && (
        <>
          <div
            className="pointer-events-none absolute left-1/2 top-[35px] h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full opacity-20 blur-md"
            style={{
              backgroundColor: nodeAccent,
            }}
          />
          {/* Orbiting particles around current level */}
          <div
            className="pointer-events-none absolute left-1/2 top-[35px] h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: "spin 8s linear infinite",
            }}
          >
            <div
              className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full shadow-sm"
              style={{
                backgroundColor: nodeAccent,
                opacity: 0.4,
              }}
            />
            <div
              className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full shadow-sm"
              style={{
                backgroundColor: nodeAccent,
                opacity: 0.4,
              }}
            />
          </div>
        </>
      )}

      {/* Subtle glow for unlocked non-current levels */}
      {isUnlockedButNotCurrent && (
        <div
          className="pointer-events-none absolute left-1/2 top-[35px] h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full opacity-10 blur-lg"
          style={{
            backgroundColor: nodeAccent,
            animationDuration: "3s",
          }}
        />
      )}

      {isCurrent ? (
        <>
          <StartTooltip
            isFirst={isFirst}
            accentColor={nodeAccent}
            onLevelClick={() => onLevelClick(level)}
          />
          <Button
            size="rounded"
            className="h-[70px] w-[70px] border-b-8 shadow-xl transition-transform active:scale-95"
            onClick={() => onLevelClick(level)}
            style={{
              backgroundColor: nodeAccent,
              borderColor: `${nodeAccent}CC`,
            }}
          >
            <span className="text-3xl">{level.icon}</span>
          </Button>
        </>
      ) : (
        <Button
          size="rounded"
          variant={isLocked ? "locked" : "secondary"}
          className="relative h-[70px] w-[70px] border-b-8 bg-white shadow-md disabled:opacity-100"
          onClick={() => {
            if (!buttonDisabled) onLevelClick(level);
          }}
          disabled={buttonDisabled}
          style={{
            pointerEvents: buttonDisabled ? "none" : "auto",
            cursor: buttonDisabled ? "default" : "pointer",
            borderColor: isCompleted || isGlobalMode ? nodeAccent : undefined,
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

          {isCompleted && (
            <div
              className="absolute -right-2 -top-2 rounded-full p-1 shadow-sm"
              style={{
                backgroundColor: nodeAccent,
              }}
            >
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
        </Button>
      )}

      {isCompleted && (
        <>
          {/* Milestone badge for every 5th level */}
          {isMilestone && (
            <div className="pointer-events-none absolute -left-16 -top-6 animate-float-slow">
              <div
                className="flex items-center gap-1 rounded-full border-2 px-2 py-1 text-xs font-bold shadow-lg"
                style={{
                  backgroundColor: `${nodeAccent}15`,
                  borderColor: `${nodeAccent}60`,
                  color: nodeAccent,
                }}
              >
                <span>🏆</span>
                <span>Level {level.id}</span>
              </div>
            </div>
          )}
        </>
      )}

      <button
        className={cn(
          "mt-3 w-fit max-w-48 rounded-xl border-2 bg-white px-3 py-1.5 text-center text-sm font-bold shadow-lg",
          "relative",
          isCompleted || isCurrent ? "" : "border-slate-300 text-slate-600"
        )}
        onClick={() => onLevelClick(level)}
        style={
          isGlobalMode
            ? {
                borderColor: `${nodeAccent}33`,
                color: nodeAccent,
              }
            : isCompleted || isCurrent
              ? {
                  borderColor: `${nodeAccent}40`,
                  color: nodeAccent,
                }
              : undefined
        }
      >
        {level.title}
        {isCompleted && <XPBadge levelId={level.id} />}
      </button>
    </div>
  );
}

interface XPBadgeProps {
  levelId: number;
}

const XPBadge = ({ levelId }: XPBadgeProps) => {
  const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
  // Use levelId to deterministically select a corner (same level always gets same corner)
  const cornerIndex = levelId % corners.length;
  const corner = corners[cornerIndex];

  const cornerClass = {
    "top-left": "-left-8 -top-4 -rotate-12",
    "top-right": "-right-8 -top-4 rotate-12",
    "bottom-left": "-left-4 -bottom-4 rotate-12",
    "bottom-right": "-right-4 -bottom-4 -rotate-12",
  };

  return (
    <div
      className={cn(
        "absolute mt-1 flex rotate-12 items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs font-bold text-white shadow-sm backdrop-blur-sm",
        cornerClass[corner as keyof typeof cornerClass]
      )}
    >
      <span className="text-[10px]">⭐</span>
      <span>+100 XP</span>
    </div>
  );
};
