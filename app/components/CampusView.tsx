import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

import { config } from "../config";
import { Job } from "../types";

interface CampusViewProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  onSettingsClick: () => void;
}

export function CampusView({
  jobs,
  onJobSelect,
  onSettingsClick,
}: CampusViewProps) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-50 to-white">
      <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-6 pt-[20px] lg:pt-[50px]">
        <button
          onClick={onSettingsClick}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
        >
          <Settings className="h-5 w-5 text-slate-500" />
        </button>
        <div className="flex-1" />
      </header>

      <div className="flex-1 overflow-auto px-4 pb-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <div className="mb-4 text-6xl">{config.company.logoUrl}</div>
            <h1 className="mb-2 text-2xl font-bold text-neutral-700 lg:text-3xl">
              {config.campus.headline}
            </h1>
            <p className="text-base text-neutral-600 lg:text-lg">
              {config.campus.subline}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => onJobSelect(job)}
                className="group relative overflow-hidden rounded-3xl border-4 border-slate-200 bg-white p-6 text-left shadow-lg transition-all hover:scale-105 hover:border-slate-300 hover:shadow-xl"
                style={{
                  borderColor: job.color,
                }}
              >
                <div
                  className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10"
                  style={{ backgroundColor: job.color }}
                />
                <div className="relative">
                  <div className="mb-4 text-5xl">{job.icon}</div>
                  <h2 className="mb-2 text-xl font-bold text-neutral-700">
                    {job.title}
                  </h2>
                  <p className="text-sm text-neutral-600">{job.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                    <span style={{ color: job.color }}>Mission starten</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

