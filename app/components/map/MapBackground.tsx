"use client";

import { BiomeTheme, getBiomeTheme } from "./biomeThemes";
import { CompanyConfig, Job } from "../../types";

interface MapBackgroundProps {
  config: CompanyConfig;
  job: Job;
}

export function MapBackground({ config, job }: MapBackgroundProps) {
  const theme = getBiomeTheme(job, config.company);

  return (
    <div className="absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: theme.background,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), 
                          linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      />
      <BiomePatternLayer theme={theme} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(100% 100% at 50% -10%, ${theme.overlayColor} 0%, transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 90% 40%, ${theme.overlayColor} 0%, transparent 100%)`,
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

function BiomePatternLayer({ theme }: { theme: BiomeTheme }) {
  const patternId = `biome-pattern-${theme.id}`;
  const patternSize = theme.patternSize ?? 48;

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox={`0 0 ${patternSize} ${patternSize}`}
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={patternSize}
            height={patternSize}
            patternUnits="userSpaceOnUse"
          >
            {theme.patternElements.map((element, index) =>
              element.type === "path" ? (
                <path
                  key={`${patternId}-path-${index}`}
                  d={element.d}
                  stroke={theme.patternColor}
                  strokeWidth={element.strokeWidth ?? 1}
                  fill="none"
                  strokeLinecap={element.strokeLinecap ?? "round"}
                  opacity={element.opacity ?? 0.2}
                />
              ) : (
                <circle
                  key={`${patternId}-circle-${index}`}
                  cx={element.cx}
                  cy={element.cy}
                  r={element.r}
                  fill={theme.patternColor}
                  opacity={element.opacity ?? 0.2}
                />
              )
            )}
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          opacity={theme.patternOpacity ?? 0.15}
        />
      </svg>
    </div>
  );
}
