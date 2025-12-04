import { useState } from "react";

import { Button } from "@/components/ui/button";

import { config } from "../config";

interface LandingOverlayProps {
  onStart: () => void;
}

export function LandingOverlay({ onStart }: LandingOverlayProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

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

      {/* Content Layer */}
      <div className="relative z-10 h-[100dvh] w-full">
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
    </div>
  );
}
