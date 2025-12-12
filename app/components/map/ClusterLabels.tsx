"use client";

import { ClusterLabel } from "./mapTypes";

interface ClusterLabelsProps {
  labels: ClusterLabel[];
  horizontalPadding: number;
  widthForPositioning: number;
}

export function ClusterLabels({
  labels,
  horizontalPadding,
  widthForPositioning,
}: ClusterLabelsProps) {
  return (
    <>
      {labels.map((label) => (
        <div
          key={label.id}
          className="absolute flex -translate-x-1/2 items-center gap-2 rounded-full border-2 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-md"
          style={{
            left: `${((label.x + horizontalPadding) / widthForPositioning) * 100}%`,
            top: label.y,
            borderColor: `${label.color}55`,
            color: label.color,
          }}
        >
          <span>{label.icon}</span>
          {label.title}
        </div>
      ))}
    </>
  );
}
