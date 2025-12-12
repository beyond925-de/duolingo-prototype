"use client";

import { ArrowLeft } from "lucide-react";
import { CompanyConfig, Job } from "../../types";

interface MapHeaderProps {
  config: CompanyConfig;
  job: Job;
  completedCount: number;
  accentColor: string;
  onBackToCampus: () => void;
  onExpressApply: () => void;
}

export function MapHeader({
  config,
  job,
  completedCount,
  accentColor,
  onBackToCampus,
  onExpressApply,
}: MapHeaderProps) {
  return (
    <div className=" bg-white/70 p-4 backdrop-blur-xl">
      <header className="pointer-events-auto mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCampus}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </button>
          <div
            className="flex items-center gap-2 rounded-full border-2 bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm"
            style={{
              borderColor: `${accentColor}40`,
            }}
          >
            <span className="text-sm">⭐</span>
            <div className="flex flex-col">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "#FFD700" }}
              >
                {completedCount * 100}&nbsp;XP
              </span>
            </div>
          </div>
        </div>
        <h1 className="hidden text-lg font-bold text-neutral-700 sm:block">
          {job.title}
        </h1>
        <button
          onClick={onExpressApply}
          className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-slate-200 bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:bg-white"
        >
          <span>📝</span>
          {config.copy.jobMerken}
        </button>
      </header>
      <h1 className="text-lg font-bold text-neutral-700 sm:hidden">
        {job.title}
      </h1>
    </div>
  );
}
