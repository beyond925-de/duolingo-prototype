"use client";

interface MapPathsProps {
  pathData: string;
  completedPathData: string;
  accentColor: string;
  paddedWidth: number;
  totalHeight: number;
}

export function MapPaths({
  pathData,
  completedPathData,
  accentColor,
  paddedWidth,
  totalHeight,
}: MapPathsProps) {
  if (!pathData) return null;

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full"
      viewBox={`0 0 ${paddedWidth} ${totalHeight}`}
      preserveAspectRatio="none"
    >
      <path
        d={pathData}
        fill="none"
        stroke={accentColor}
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.15"
      />
      {completedPathData && (
        <>
          <path
            d={completedPathData}
            fill="none"
            stroke={accentColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d={completedPathData}
            fill="none"
            stroke={accentColor}
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.1"
            className="blur-sm"
          />
        </>
      )}
      <path
        d={pathData}
        fill="none"
        stroke={accentColor}
        strokeWidth="4"
        strokeDasharray="10 20"
        strokeLinecap="round"
        className="animate-flow opacity-40"
      />
      {completedPathData && (
        <path
          d={completedPathData}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="2 30"
          strokeLinecap="round"
          className="animate-flow opacity-60"
        />
      )}
    </svg>
  );
}
