"use client";

import { Level } from "../../types";

interface MapProgressProps {
  levels: Level[];
  completedCount: number;
  accentColor: string;
}

export function MapProgress({
  levels,
  completedCount,
  accentColor,
}: MapProgressProps) {
  return (
    <div className="pointer-events-none  px-6 pb-4 pt-2">
      <div className="pointer-events-auto mx-auto mt-2 max-w-[960px]">
        <div className="mx-auto mb-3 max-w-md rounded-2xl bg-white/90 p-3 shadow-md backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Fortschritt</span>
            <div className="flex items-center gap-2">
              <span>
                {completedCount}/{levels.length} Levels
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                {levels.length > 0
                  ? Math.round((completedCount / levels.length) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-slate-200 shadow-inner">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${levels.length > 0 ? (completedCount / levels.length) * 100 : 0}%`,
                backgroundColor: accentColor,
                boxShadow: `0 0 10px ${accentColor}40`,
              }}
            >
              {completedCount > 0 && (
                <div className="absolute inset-0 animate-pulse rounded-full bg-white/20" />
              )}
            </div>
            {[25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className="absolute top-0 h-full w-0.5 bg-white/60"
                style={{
                  left: `${milestone}%`,
                }}
              >
                {levels.length > 0 &&
                  (completedCount / levels.length) * 100 >= milestone && (
                    <div
                      className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs"
                      style={{ color: accentColor }}
                    >
                      {milestone === 25 ? "🎯" : milestone === 50 ? "🔥" : "💎"}
                    </div>
                  )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Wir speichern deinen Spielstand automatisch. Du kannst jederzeit
            wechseln.
          </p>
        </div>
      </div>
    </div>
  );
}
