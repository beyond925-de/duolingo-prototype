"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import { ArrowLeft, Check, Lock, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ApplyDialog } from "./ApplyDialog";
import { config } from "../config";
import { getPathModeConfig } from "../pathModes";
import { Job, Level, PathModeConfig } from "../types";

interface MapViewProps {
  job: Job;
  jobs: Job[];
  levels: Level[];
  onLevelClick: (level: Level) => void;
  onSettingsClick: () => void;
  onExpressApply: () => void;
  onBackToCampus: () => void;
}

const DEFAULT_ROW_HEIGHT = 150;
const DEFAULT_WIDTH = 600;
const DEFAULT_OFFSET_X = 50;

function StartTooltip({
  isFirst,
  accentColor,
}: {
  isFirst: boolean;
  accentColor: string;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(
      () => {
        setIsFading(true);
      },
      isFirst ? 5000 : 3000
    );

    const hideTimer = setTimeout(
      () => {
        setIsVisible(false);
      },
      isFirst ? 5500 : 3500 // Add 500ms for fade-out duration
    );

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [isFirst]);

  if (!isVisible || !isFirst) return null;

  return (
    <div
      className={cn(
        "absolute -top-12 z-10 animate-bounce whitespace-nowrap rounded-xl border-2 bg-white",
        "px-3 py-2.5 font-bold uppercase tracking-wide opacity-100 ",
        "transition-opacity duration-700",
        isFading ? "opacity-0" : ""
      )}
      style={{
        borderColor: accentColor,
        color: accentColor,
      }}
    >
      {isFirst ? "Start" : "Weiter"}
      <div
        className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
        style={{ borderTopColor: accentColor }}
        aria-hidden
      />
    </div>
  );
}

export function MapView({
  job,
  jobs,
  levels,
  onLevelClick,
  onSettingsClick,
  onExpressApply,
  onBackToCampus,
}: MapViewProps) {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  const pathMode = useMemo(
    () => getPathModeConfig(job.pathModeId),
    [job.pathModeId]
  );
  const isGlobalMode = pathMode.layoutStrategy === "global";
  const accentColor = job.color ?? config.company.primaryColor;
  const supportsZoom = isGlobalMode && Boolean(pathMode.zoom?.enabled);

  const [viewport, setViewport] = useState({
    scale: pathMode.zoom?.defaultScale ?? 1,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    setViewport({
      scale: pathMode.zoom?.defaultScale ?? 1,
      x: 0,
      y: 0,
    });
    setIsPanning(false);
  }, [job.id, pathMode.id, pathMode.zoom?.defaultScale]);

  const panStateRef = useRef<PanState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  const localLayout = useMemo(() => {
    if (isGlobalMode) return null;
    return buildLocalLayout(levels, pathMode, job);
  }, [isGlobalMode, levels, pathMode, job]);

  const globalLayout = useMemo(() => {
    if (!isGlobalMode) return null;
    const otherJobs = jobs.filter((candidate) => candidate.id !== job.id);
    return buildGlobalLayout(otherJobs, pathMode);
  }, [isGlobalMode, jobs, job.id, pathMode]);

  const layoutWidth =
    (isGlobalMode ? globalLayout?.width : localLayout?.width) ?? DEFAULT_WIDTH;
  const totalHeight =
    (isGlobalMode ? globalLayout?.height : localLayout?.height) ??
    DEFAULT_ROW_HEIGHT * 3;
  const levelPositions = useMemo<PositionedLevel[]>(
    () =>
      (isGlobalMode ? globalLayout?.positions : localLayout?.positions) ?? [],
    [isGlobalMode, globalLayout, localLayout]
  );
  const connections = useMemo<PathConnection[]>(
    () => (isGlobalMode ? globalLayout?.paths : localLayout?.paths) ?? [],
    [isGlobalMode, globalLayout, localLayout]
  );
  const clusterLabels = isGlobalMode ? (globalLayout?.labels ?? []) : [];
  const usesGraphStructure = localLayout?.usesGraph ?? false;

  const firstUnlockedNotCompleted = useMemo(() => {
    if (isGlobalMode) return undefined;
    return levelPositions.find((pos) => {
      const levelStatus = pos.level.status;
      if (levelStatus !== "unlocked") return false;
      const siblings = levelPositions.filter(
        (p) => p.row === pos.row && p.level.id !== pos.level.id
      );
      return siblings.length === 0;
    });
  }, [isGlobalMode, levelPositions]);

  const { pathData, completedPathData } = useMemo(() => {
    if (!connections.length) {
      return { pathData: "", completedPathData: "" };
    }
    const segments: string[] = [];
    const completedSegments: string[] = [];
    connections.forEach((connection) => {
      const segment = buildPathSegment(
        connection.from,
        connection.to,
        pathMode.connection.curvature ?? 0.5
      );
      segments.push(segment);
      if (connection.from.level.status === "completed") {
        completedSegments.push(segment);
      }
    });
    return {
      pathData: segments.join(" "),
      completedPathData: completedSegments.join(" "),
    };
  }, [connections, pathMode.connection.curvature]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!supportsZoom) return;
    event.preventDefault();
    setViewport((prev) => {
      const direction = event.deltaY > 0 ? -1 : 1;
      const scaleDelta = direction * 0.08;
      const nextScale = clamp(
        prev.scale + scaleDelta,
        pathMode.zoom?.min ?? 0.6,
        pathMode.zoom?.max ?? 1.8
      );
      return { ...prev, scale: Number(nextScale.toFixed(2)) };
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!supportsZoom) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    panStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: viewport.x,
      originY: viewport.y,
    };
    setIsPanning(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!supportsZoom || !isPanning) return;
    if (panStateRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();
    const deltaX = event.clientX - panStateRef.current.startX;
    const deltaY = event.clientY - panStateRef.current.startY;
    setViewport((prev) => ({
      ...prev,
      x: panStateRef.current.originX + deltaX,
      y: panStateRef.current.originY + deltaY,
    }));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!supportsZoom || !isPanning) return;
    if (panStateRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // ignore release failures (e.g. pointer already released)
    }
    panStateRef.current.pointerId = null;
    setIsPanning(false);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!supportsZoom || !isPanning) return;
    if (panStateRef.current.pointerId !== null) {
      try {
        event.currentTarget.releasePointerCapture(
          panStateRef.current.pointerId
        );
      } catch {
        // no-op
      }
      panStateRef.current.pointerId = null;
    }
    setIsPanning(false);
  };

  const containerStyle: CSSProperties = {
    height: totalHeight,
    width: isGlobalMode ? `${layoutWidth}px` : undefined,
    cursor:
      supportsZoom && isGlobalMode
        ? isPanning
          ? "grabbing"
          : "grab"
        : undefined,
    touchAction: supportsZoom ? "none" : undefined,
  };

  const containerClasses = cn(
    "relative mx-auto w-full",
    isGlobalMode ? "max-w-none" : "max-w-[600px]"
  );

  const widthForPositioning = layoutWidth || DEFAULT_WIDTH;

  const viewportStyle: CSSProperties | undefined = supportsZoom
    ? {
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
        transformOrigin: "center center",
        touchAction: "none",
      }
    : undefined;

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

      <ApplyDialog
        isOpen={isApplyDialogOpen}
        onClose={() => setIsApplyDialogOpen(false)}
        onConfirm={onExpressApply}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex h-full flex-col">
        <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-6 pt-[20px] lg:pt-[50px]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToCampus}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </button>
            <button
              onClick={onSettingsClick}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition hover:bg-white"
            >
              <Settings className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <button
            onClick={() => setIsApplyDialogOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-slate-200 bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:bg-white"
          >
            <span>🏁</span>
            {config.copy.jobMerken}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto mt-2 h-full max-w-[912px] px-3">
            <h1 className="mb-5 text-center text-2xl font-bold text-neutral-700">
              {job.title}
            </h1>

            <div
              className={containerClasses}
              style={containerStyle}
              onPointerDown={supportsZoom ? handlePointerDown : undefined}
              onPointerMove={supportsZoom ? handlePointerMove : undefined}
              onPointerUp={supportsZoom ? handlePointerUp : undefined}
              onPointerLeave={supportsZoom ? handlePointerLeave : undefined}
              onWheel={supportsZoom ? handleWheel : undefined}
            >
              <div
                className="absolute left-0 top-0 h-full w-full"
                style={viewportStyle}
              >
                <svg
                  className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full"
                  viewBox={`0 0 ${layoutWidth} ${totalHeight}`}
                  preserveAspectRatio="none"
                >
                  {pathData && (
                    <>
                      <path
                        d={pathData}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        opacity="0.15"
                      />
                      {completedPathData && (
                        <path
                          d={completedPathData}
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="8"
                          strokeLinecap="round"
                        />
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
                    </>
                  )}
                </svg>

                {isGlobalMode &&
                  clusterLabels.map((label) => (
                    <div
                      key={label.id}
                      className="absolute flex -translate-x-1/2 items-center gap-2 rounded-full border-2 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-md"
                      style={{
                        left: `${(label.x / widthForPositioning) * 100}%`,
                        top: label.y,
                        borderColor: `${label.color}55`,
                        color: label.color,
                      }}
                    >
                      <span>{label.icon}</span>
                      {label.title}
                    </div>
                  ))}

                {levelPositions.map((position) => {
                  const { level, x, y, index, row, jobMeta } = position;
                  const isCompleted = level.status === "completed";
                  const isLocked = level.status === "locked";
                  const isUnlocked = level.status === "unlocked";
                  const siblings = isGlobalMode
                    ? []
                    : levelPositions.filter(
                        (pos) => pos.row === row && pos.level.id !== level.id
                      );
                  const isPartOfBranch = !isGlobalMode && siblings.length > 0;
                  const isCurrent =
                    !isGlobalMode &&
                    isUnlocked &&
                    !isCompleted &&
                    !isPartOfBranch &&
                    firstUnlockedNotCompleted?.level.id === level.id;
                  const isUnlockedButNotCurrent =
                    !isGlobalMode &&
                    isUnlocked &&
                    !isCompleted &&
                    !isCurrent &&
                    !isPartOfBranch;
                  const isFirst = !isGlobalMode
                    ? usesGraphStructure
                      ? row === 0
                      : index === 0
                    : false;
                  const nodeAccent = isGlobalMode
                    ? (jobMeta?.color ?? accentColor)
                    : accentColor;
                  const buttonDisabled = isLocked || isGlobalMode;
                  const levelKey = `${jobMeta?.id ?? job.id}-${level.id}`;

                  return (
                    <div
                      key={levelKey}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: `${(x / widthForPositioning) * 100}%`,
                        top: y - 35,
                        transform: "translateX(-50%)",
                        zIndex: 10,
                      }}
                    >
                      {isCurrent ? (
                        <>
                          <StartTooltip
                            isFirst={isFirst}
                            accentColor={nodeAccent}
                          />
                          <Button
                            size="rounded"
                            className="h-[70px] w-[70px] border-b-8 shadow-xl transition-transform active:scale-95"
                            onClick={() => onLevelClick(level)}
                            style={{
                              backgroundColor: nodeAccent,
                              borderColor: `${nodeAccent}CC`,
                            }}
                          >
                            <span className="text-3xl">{level.icon}</span>
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="rounded"
                          variant={isLocked ? "locked" : "secondary"}
                          className="h-[70px] w-[70px] border-b-8 bg-white shadow-md disabled:opacity-100"
                          onClick={() => {
                            if (!buttonDisabled) onLevelClick(level);
                          }}
                          disabled={buttonDisabled}
                          style={{
                            pointerEvents: buttonDisabled ? "none" : "auto",
                            cursor: buttonDisabled ? "default" : "pointer",
                            borderColor:
                              isCompleted || isGlobalMode
                                ? nodeAccent
                                : undefined,
                          }}
                        >
                          {isLocked ? (
                            <Lock className="h-10 w-10 fill-neutral-400 stroke-neutral-400 text-neutral-400" />
                          ) : isUnlockedButNotCurrent ? (
                            <span
                              className="text-3xl"
                              style={{
                                filter:
                                  "grayscale(100%) brightness(0) opacity(0.4)",
                              }}
                            >
                              {level.icon}
                            </span>
                          ) : (
                            <span className="text-3xl">{level.icon}</span>
                          )}
                        </Button>
                      )}

                      {isCompleted && (
                        <div
                          className="absolute -right-1 -top-1 rounded-full p-1 shadow-sm"
                          style={{
                            backgroundColor: nodeAccent,
                          }}
                        >
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "mt-3 whitespace-nowrap rounded-xl border-2 bg-white px-3 py-1.5 text-center text-sm font-bold shadow-lg",
                          isCompleted || isCurrent
                            ? ""
                            : "border-slate-300 text-slate-600"
                        )}
                        style={
                          isGlobalMode
                            ? {
                                borderColor: `${nodeAccent}33`,
                                color: nodeAccent,
                              }
                            : isCompleted || isCurrent
                              ? {
                                  borderColor: `${nodeAccent}40`,
                                  color: nodeAccent,
                                }
                              : undefined
                        }
                      >
                        {level.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PositionedLevel {
  level: Level;
  x: number;
  y: number;
  row: number;
  index: number;
  jobMeta?: {
    id: string;
    title: string;
    color: string;
    icon: string;
  };
}

interface PathConnection {
  from: PositionedLevel;
  to: PositionedLevel;
}

interface ClusterLabel {
  id: string;
  title: string;
  icon: string;
  color: string;
  x: number;
  y: number;
}

interface LayoutResult {
  positions: PositionedLevel[];
  paths: PathConnection[];
  width: number;
  height: number;
  usesGraph: boolean;
}

interface GlobalLayoutResult {
  positions: PositionedLevel[];
  paths: PathConnection[];
  labels: ClusterLabel[];
  width: number;
  height: number;
}

interface PanState {
  pointerId: number | null;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

function buildLocalLayout(
  levels: Level[],
  pathMode: PathModeConfig,
  job?: Job
): LayoutResult {
  const width = pathMode.geometry.width ?? DEFAULT_WIDTH;
  const rowHeight = pathMode.geometry.rowHeight ?? DEFAULT_ROW_HEIGHT;
  const zigzagOffset = pathMode.geometry.zigzagOffset ?? DEFAULT_OFFSET_X;

  if (levels.length === 0) {
    return {
      positions: [],
      paths: [],
      width,
      height: rowHeight,
      usesGraph: false,
    };
  }

  const hasRows = levels.some((level) => level.row !== undefined);
  const hasEdges = levels.some(
    (level) => level.nextLevelIds && level.nextLevelIds.length > 0
  );
  const usesGraph =
    pathMode.layoutStrategy === "branching" && (hasRows || hasEdges);

  let maxRow = 0;
  const positions: PositionedLevel[] = levels.map((level, index) => {
    const row = level.row ?? index;
    maxRow = Math.max(maxRow, row);
    const y = row * rowHeight + 60;
    let x = width / 2;

    if (usesGraph && level.row !== undefined) {
      const levelsOnSameRow = levels.filter((l) => l.row === level.row);
      const indexInRow = levelsOnSameRow.findIndex((l) => l.id === level.id);
      if (levelsOnSameRow.length === 1) {
        x = width / 2;
      } else {
        const spacing = width / (levelsOnSameRow.length + 1);
        x = spacing * (indexInRow + 1);
      }
    } else {
      const cycleLength = 8;
      const cycleIndex = index % cycleLength;
      let indentationLevel;

      if (cycleIndex <= 2) indentationLevel = cycleIndex;
      else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
      else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
      else indentationLevel = cycleIndex - 8;

      const xOffset = -indentationLevel * zigzagOffset;
      x = width / 2 + xOffset;
    }

    return {
      level,
      x,
      y,
      row,
      index,
      jobMeta: job
        ? {
            id: job.id,
            title: job.title,
            color: job.color,
            icon: job.icon,
          }
        : undefined,
    };
  });

  const totalHeight = (maxRow + 1) * rowHeight + 100;

  const positionMap = new Map(levels.map((level, idx) => [level.id, idx]));
  const paths: PathConnection[] = [];

  if (usesGraph && hasEdges) {
    positions.forEach((pos) => {
      const nextIds = pos.level.nextLevelIds;
      if (!nextIds) return;
      nextIds.forEach((nextId) => {
        const targetIndex = positionMap.get(nextId);
        if (targetIndex === undefined) return;
        paths.push({
          from: pos,
          to: positions[targetIndex],
        });
      });
    });
  } else {
    for (let i = 0; i < positions.length - 1; i++) {
      paths.push({
        from: positions[i],
        to: positions[i + 1],
      });
    }
  }

  return {
    positions,
    paths,
    width,
    height: totalHeight,
    usesGraph,
  };
}

function buildGlobalLayout(
  jobs: Job[],
  pathMode: PathModeConfig
): GlobalLayoutResult {
  const globalSettings = pathMode.globalLayout ?? {
    columns: 2,
    columnGap: 200,
    rowGap: 240,
    clusterWidth: 720,
  };

  const clusters = jobs
    .filter((job) => job.levels.length > 0)
    .map((job) => {
      const jobMode = getPathModeConfig(job.pathModeId);
      return {
        job,
        ...buildLocalLayout(job.levels, jobMode, job),
      };
    });

  if (clusters.length === 0) {
    const baselineWidth =
      globalSettings.clusterWidth * globalSettings.columns +
      globalSettings.columnGap * Math.max(0, globalSettings.columns - 1);
    return {
      positions: [],
      paths: [],
      labels: [],
      width: baselineWidth,
      height: DEFAULT_ROW_HEIGHT * 2,
    };
  }

  const columns = Math.max(1, globalSettings.columns);
  const rowHeights: number[] = [];
  clusters.forEach((cluster, index) => {
    const row = Math.floor(index / columns);
    rowHeights[row] = Math.max(rowHeights[row] ?? 0, cluster.height);
  });

  const rowOffsets: number[] = [];
  rowHeights.forEach((height, row) => {
    if (row === 0) {
      rowOffsets[row] = 0;
    } else {
      rowOffsets[row] =
        rowOffsets[row - 1] + rowHeights[row - 1] + globalSettings.rowGap;
    }
  });

  const lastRowIndex = rowHeights.length - 1;
  const totalHeight =
    rowOffsets[lastRowIndex] + rowHeights[lastRowIndex] + globalSettings.rowGap;
  const totalWidth =
    columns * globalSettings.clusterWidth +
    (columns - 1) * globalSettings.columnGap;

  const positions: PositionedLevel[] = [];
  const paths: PathConnection[] = [];
  const labels: ClusterLabel[] = [];

  clusters.forEach((cluster, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const baseX =
      column * (globalSettings.clusterWidth + globalSettings.columnGap) +
      (globalSettings.clusterWidth - cluster.width) / 2;
    const baseY = rowOffsets[row];

    cluster.positions.forEach((pos) => {
      positions.push({
        ...pos,
        x: pos.x + baseX,
        y: pos.y + baseY,
      });
    });

    cluster.paths.forEach((connection) => {
      paths.push({
        from: {
          ...connection.from,
          x: connection.from.x + baseX,
          y: connection.from.y + baseY,
        },
        to: {
          ...connection.to,
          x: connection.to.x + baseX,
          y: connection.to.y + baseY,
        },
      });
    });

    labels.push({
      id: cluster.job.id,
      title: cluster.job.title,
      icon: cluster.job.icon,
      color: cluster.job.color,
      x: baseX + cluster.width / 2,
      y: Math.max(50, baseY - 30),
    });
  });

  return {
    positions,
    paths,
    labels,
    width: totalWidth,
    height: totalHeight,
  };
}

function buildPathSegment(
  from: PositionedLevel,
  to: PositionedLevel,
  curvature: number
) {
  const clampedCurvature = clamp(curvature, 0.2, 0.8);
  const midY = from.y + (to.y - from.y) * clampedCurvature;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
