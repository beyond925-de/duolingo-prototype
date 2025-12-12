"use client";

import { CompanyConfig } from "../../types";

interface MapBackgroundProps {
  config: CompanyConfig;
}

export function MapBackground({ config }: MapBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), 
                          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      />
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
  );
}
