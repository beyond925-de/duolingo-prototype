import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CompanyConfig } from "../types";

interface LandingOverlayProps {
  config: CompanyConfig;
  onStart: () => void;
}

export function LandingOverlay({ config, onStart }: LandingOverlayProps) {
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
        {config.company.signatureEmoji && (
          <>
            <div className="pointer-events-none absolute right-10 top-20 animate-float-slow select-none text-[150px] opacity-10 blur-[2px]">
              {config.company.signatureEmoji}
            </div>
            <div className="pointer-events-none absolute bottom-40 left-10 animate-float-slower select-none text-[100px] opacity-10 blur-[2px]">
              {config.company.signatureEmoji}
            </div>
          </>
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-[100dvh] w-full">
        <div className="relative mx-auto flex h-full w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 overflow-y-hidden p-4 lg:flex-row">
          <div className="flex h-full flex-col items-center gap-y-8 ">
            <div className="grid gap-y-4 text-center">
              {config.company.logoImageUrl ? (
                <img
                  src={config.company.logoImageUrl}
                  alt={config.company.name}
                  className="mx-auto w-full max-w-md"
                />
              ) : config.company.logoUrl.startsWith("http") ? (
                <img
                  src={config.company.logoUrl}
                  alt={config.company.name}
                  className="mx-auto w-full max-w-md"
                />
              ) : (
                <div className="mb-2 text-6xl font-bold">
                  {config.company.logoUrl} {config.company.name}
                </div>
              )}
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
                playsInline
                webkit-playsinline="true"
                controls={false}
                controlsList="nodownload nofullscreen noplaybackrate"
                disablePictureInPicture
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
