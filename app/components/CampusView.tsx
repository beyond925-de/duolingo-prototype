import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import Carousel from "@/components/Carousel";

import { CompanyConfig, Job } from "../types";

interface CampusViewProps {
  config: CompanyConfig;
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  onSettingsClick: () => void;
}

export function CampusView({
  config,
  jobs,
  onJobSelect,
  onSettingsClick,
}: CampusViewProps) {
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
        <div className="pointer-events-none absolute right-10 top-20 animate-float-slow select-none text-[150px] opacity-10 blur-[2px]">
          {config.company.logoUrl}
        </div>
        <div className="pointer-events-none absolute bottom-40 left-10 animate-float-slower select-none text-[100px] opacity-10 blur-[2px]">
          {config.company.logoUrl}
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex h-[100dvh] flex-col">
        <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-6 pt-[20px] lg:pt-[50px]">
          <button
            onClick={onSettingsClick}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
          >
            <Settings className="h-5 w-5 text-slate-500" />
          </button>
          <div className="flex-1" />
        </header>

        <div className="flex-1 overflow-auto pb-6">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-8 text-center">
              <div className="mb-4 text-6xl">{config.company.logoUrl}</div>
              <h1 className="mb-2 text-2xl font-bold text-neutral-700 lg:text-3xl">
                {config.campus.headline}
              </h1>
              <p className="text-base text-neutral-600 lg:text-lg">
                {config.campus.subline}
              </p>
            </div>
          </div>

          <div className="mx-auto w-fit">
            <Carousel
              items={jobs}
              baseWidth={350}
              loop={false} // true would be nicer, but there is a bug when swiping quickly at the looping border
              renderItem={(job, index) => (
                <button
                  onClick={() => onJobSelect(job)}
                  className="group relative h-full w-full overflow-hidden rounded-3xl border-4 border-slate-200 bg-white p-6 text-left shadow-lg transition-all hover:border-slate-300 hover:shadow-xl"
                  style={{
                    borderColor: job.color,
                  }}
                >
                  {/* Dekorativer Hintergrund-Klecks */}
                  <div
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl"
                    style={{ backgroundColor: job.color }}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="mb-4 text-4xl">{job.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.title}
                    </h3>

                    {/* Skill Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold "
                          style={{
                            color: job.color,
                            backgroundColor: job.color + "20",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                      {job.description}
                    </p>

                    <button
                      className="mt-6 w-full rounded-lg py-2 font-bold text-white opacity-90 shadow-lg transition-all hover:opacity-100 active:opacity-100"
                      style={{ backgroundColor: job.color }}
                    >
                      Mission starten 🚀
                    </button>
                  </div>
                </button>
              )}
              getItemKey={(job) => job.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
