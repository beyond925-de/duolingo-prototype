import { Check, Lock, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { config } from "../config";
import { Level } from "../types";

interface MapViewProps {
  levels: Level[];
  progress: number;
  onLevelClick: (level: Level) => void;
  onSettingsClick: () => void;
  onExpressApply: () => void;
}

export function MapView({
  levels,
  progress,
  onLevelClick,
  onSettingsClick,
  onExpressApply,
}: MapViewProps) {
  return (
    <div className="flex h-full flex-col">
      <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-6 pt-[20px] lg:pt-[50px]">
        <button
          onClick={onSettingsClick}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
        >
          <Settings className="h-5 w-5 text-slate-500" />
        </button>
        <button
          onClick={onExpressApply}
          className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <span>🏁</span>
          {config.copy.jobMerken}
        </button>
      </header>
      <div className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-4 pt-[20px] lg:pt-[50px]">
        <Progress value={progress} />
      </div>

      <div className="flex-1">
        <div className="mx-auto h-full max-w-[912px] px-3">
          <h1 className="mb-5 text-2xl font-bold text-neutral-700">
            {config.company.name}
          </h1>

          <div className="relative flex flex-col items-center">
            {levels.map((level, index) => {
              const isCompleted = level.status === "completed";
              const isLocked = level.status === "locked";
              const isCurrent = level.status === "unlocked" && !isCompleted;

              const cycleLength = 8;
              const cycleIndex = index % cycleLength;
              let indentationLevel;
              if (cycleIndex <= 2) indentationLevel = cycleIndex;
              else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
              else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
              else indentationLevel = cycleIndex - 8;
              const rightPosition = indentationLevel * 40;

              const isFirst = index === 0;

              return (
                <div
                  key={level.id}
                  className="relative flex flex-col items-center"
                  style={{
                    right: `${rightPosition}px`,
                    marginTop: isFirst && !isCurrent ? 60 : 24,
                  }}
                >
                  {isCurrent ? (
                    <>
                      <div className="absolute -top-6 z-10 animate-bounce rounded-xl border-2 bg-white px-3 py-2.5 font-bold uppercase tracking-wide text-green-500">
                        Start
                        <div
                          className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
                          aria-hidden
                        />
                      </div>
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
                        className="h-[70px] w-[70px] border-b-8"
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

