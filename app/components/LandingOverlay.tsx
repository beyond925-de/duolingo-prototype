import { Button } from "@/components/ui/button";

import { config } from "../config";

interface LandingOverlayProps {
  onStart: () => void;
}

export function LandingOverlay({ onStart }: LandingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 p-4 lg:flex-row">
        <div className="relative mb-8 flex h-[240px] w-[240px] items-center justify-center lg:mb-0 lg:h-[424px] lg:w-[424px]">
          <div className="text-9xl">{config.company.logoUrl}</div>
        </div>

        <div className="flex flex-col items-center gap-y-8">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-bold text-neutral-600 lg:text-2xl">
              {config.company.name}
            </h2>
            <p className="mb-4 text-sm text-neutral-500 lg:text-base">
              {config.company.industryVibe}
            </p>
          </div>

          <h1 className="max-w-[480px] text-center text-xl font-bold text-neutral-600 lg:text-3xl">
            {config.landing.headline}
            <br />
            <span className="text-green-500">{config.landing.subline}</span>
          </h1>

          <div className="flex w-full max-w-[330px] flex-col items-center gap-y-3">
            <Button size="lg" variant="secondary" className="w-full" onClick={onStart}>
              {config.landing.startButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

