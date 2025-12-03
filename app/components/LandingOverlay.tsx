import { useState } from "react";

import { Button } from "@/components/ui/button";

import { config } from "../config";

interface LandingOverlayProps {
  onStart: () => void;
}

export function LandingOverlay({ onStart }: LandingOverlayProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="h-[100dvh] w-full">
      <div className="relative mx-auto flex h-full w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 overflow-y-hidden p-4 lg:flex-row">
        <div className="flex h-full flex-col items-center gap-y-8 ">
          <div className="grid gap-y-4 text-center">
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.sollich.com%2Ffileadmin%2Fimages%2Fsollich-logo.png&f=1&nofb=1&ipt=8de60a20c164c16dceb58cf1273f841cdda463ddd61badc6ef65ec9b174d0335"
              alt=""
              className="w-full"
            />
            <p className="mb-4 text-sm text-neutral-500 lg:text-base">
              {config.company.industryVibe}
            </p>
          </div>

          {/*
          <h1 className="max-w-[480px] text-center text-xl font-bold text-neutral-600 lg:text-3xl">
            {config.landing.headline}
            <br />
            <span className="text-green-500">{config.landing.subline}</span>
          </h1>
          */}

          <div className="relative h-full md:h-2/3">
            {!videoLoaded && (
              <img
                src="https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGt0JJDlqTZ7VdmgwaGhY1XcyqSC4ArUIjzOfk"
                alt="Video placeholder"
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}
            <video
              src="https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxG39CYlDSu7t21r4oJbRUANXySaKckLzIV5hvl"
              className="h-full w-full object-contain"
              muted
              autoPlay
              loop
              onCanPlay={() => setVideoLoaded(true)}
            ></video>
          </div>
        </div>

        <div
          className="absolute bottom-0 flex w-full flex-col items-center gap-y-3 px-4 pt-12"
          style={{
            paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
          }}
        >
          {/* Gradient blur background */}
          <div
            className="absolute inset-0 bg-white/50 backdrop-blur-sm"
            style={{
              maskImage:
                "linear-gradient(to top, black 0%, rgba(0, 0, 0, 0.9) 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 0%, rgba(0, 0, 0, 0.9) 70%, transparent 100%)",
            }}
          />
          {/* Button on top */}
          <Button
            size="lg"
            variant="secondary"
            className="relative z-10 w-full"
            onClick={onStart}
          >
            {config.landing.startButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
