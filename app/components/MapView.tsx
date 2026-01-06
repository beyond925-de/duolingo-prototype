"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { ApplyDialog } from "./ApplyDialog";
import { getPathModeConfig } from "../pathModes";
import { CompanyConfig, Job, Level } from "../types";
import { MapBackground } from "./map/MapBackground";
import { MapHeader } from "./map/MapHeader";
import { MapProgress } from "./map/MapProgress";
import { MapPaths } from "./map/MapPaths";
import { LevelNode } from "./map/LevelNode";
import { ClusterLabels } from "./map/ClusterLabels";
import { buildLocalLayout, buildGlobalLayout } from "./map/mapLayout";
import { buildPathSegment, clamp } from "./map/mapUtils";
import { PositionedLevel, PathConnection, PanState } from "./map/mapTypes";

const DEFAULT_ROW_HEIGHT = 150;
const DEFAULT_WIDTH = 750;

interface MapViewProps {
  config: CompanyConfig;
  job: Job;
  jobs: Job[];
  levels: Level[];
  onLevelClick: (level: Level) => void;
  onSettingsClick: () => void;
  onExpressApply: () => void;
  onBackToCampus: () => void;
  viewport?: { scale: number; x: number; y: number };
  scrollPosition?: number;
  onViewportChange?: (viewport: { scale: number; x: number; y: number }) => void;
  onScrollPositionChange?: (scrollPosition: number) => void;
}

export function MapView({
  config,
  job,
  jobs,
  levels,
  onLevelClick,
  onSettingsClick,
  onExpressApply,
  onBackToCampus,
  viewport: initialViewport,
  scrollPosition: initialScrollPosition,
  onViewportChange,
  onScrollPositionChange,
}: MapViewProps) {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const pathMode = useMemo(
    () => getPathModeConfig(job.pathModeId),
    [job.pathModeId]
  );
  const isGlobalMode = pathMode.layoutStrategy === "global";
  const accentColor = job.color ?? config.company.primaryColor;
  const supportsZoom = isGlobalMode && Boolean(pathMode.zoom?.enabled);

  const defaultViewport = useMemo(
    () => ({
      scale: pathMode.zoom?.defaultScale ?? 1,
      x: 0,
      y: 0,
    }),
    [pathMode.zoom?.defaultScale]
  );

  const [viewport, setViewport] = useState(
    initialViewport ?? defaultViewport
  );

  // Track if this is the initial mount for this job
  const jobMountRef = useRef<string | null>(null);

  // Restore viewport when job changes
  useEffect(() => {
    const isNewJob = jobMountRef.current !== job.id;
    jobMountRef.current = job.id;

    if (initialViewport) {
      setViewport(initialViewport);
    } else {
      setViewport(defaultViewport);
    }
    setIsPanning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id, pathMode.id]);

  // Notify parent when viewport changes (debounced to avoid too many updates)
  const viewportUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!onViewportChange || !supportsZoom) return;

    // Clear any pending update
    if (viewportUpdateTimeoutRef.current) {
      clearTimeout(viewportUpdateTimeoutRef.current);
    }

    // Debounce viewport updates to avoid excessive localStorage writes
    viewportUpdateTimeoutRef.current = setTimeout(() => {
      onViewportChange(viewport);
    }, 100);

    return () => {
      if (viewportUpdateTimeoutRef.current) {
        clearTimeout(viewportUpdateTimeoutRef.current);
      }
    };
  }, [viewport, onViewportChange, supportsZoom]);

  // Restore scroll position or center the scroll container horizontally on mount and when job changes
  useEffect(() => {
    if (!scrollContainerRef.current || isGlobalMode) return;

    const container = scrollContainerRef.current;
    
    // Use requestAnimationFrame to ensure DOM is fully laid out
    const restoreScroll = () => {
      if (initialScrollPosition !== undefined && initialScrollPosition >= 0) {
        // Restore saved scroll position
        container.scrollLeft = initialScrollPosition;
      } else {
        // Center horizontally if no saved position
        const scrollX = (container.scrollWidth - container.clientWidth) / 2;
        container.scrollLeft = scrollX;
      }
    };

    // Try immediately
    restoreScroll();
    
    // Also try after a short delay in case layout isn't ready yet
    const timeoutId = setTimeout(restoreScroll, 100);
    
    return () => clearTimeout(timeoutId);
  }, [job.id, isGlobalMode, initialScrollPosition]);

  // Track scroll position changes and notify parent (debounced)
  const scrollUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!scrollContainerRef.current || isGlobalMode || !onScrollPositionChange) return;

    const container = scrollContainerRef.current;
    const handleScroll = () => {
      // Clear any pending update
      if (scrollUpdateTimeoutRef.current) {
        clearTimeout(scrollUpdateTimeoutRef.current);
      }

      // Debounce scroll updates to avoid excessive localStorage writes
      scrollUpdateTimeoutRef.current = setTimeout(() => {
        onScrollPositionChange(container.scrollLeft);
      }, 100);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollUpdateTimeoutRef.current) {
        clearTimeout(scrollUpdateTimeoutRef.current);
      }
    };
  }, [isGlobalMode, onScrollPositionChange]);

  // Prevent scroll container from scrolling when panning is active
  useEffect(() => {
    if (!scrollContainerRef.current || !supportsZoom) return;

    const container = scrollContainerRef.current;

    const preventScroll = (e: Event) => {
      if (isPanning) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isPanning) {
      container.addEventListener("scroll", preventScroll, { passive: false });
      container.addEventListener("wheel", preventScroll, { passive: false });
      container.addEventListener("touchmove", preventScroll, {
        passive: false,
      });
    }

    return () => {
      container.removeEventListener("scroll", preventScroll);
      container.removeEventListener("wheel", preventScroll);
      container.removeEventListener("touchmove", preventScroll);
    };
  }, [isPanning, supportsZoom]);

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

  const HORIZONTAL_PADDING = 120;
  const paddedWidth = (layoutWidth || DEFAULT_WIDTH) + HORIZONTAL_PADDING * 2;

  const completedCount = useMemo(
    () => levels.filter((l) => l.status === "completed").length,
    [levels]
  );

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
        {
          ...connection.from,
          x: connection.from.x + HORIZONTAL_PADDING,
        },
        {
          ...connection.to,
          x: connection.to.x + HORIZONTAL_PADDING,
        },
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

    // Only handle primary pointer (left mouse button or first touch)
    // Ignore secondary pointers (right click, multi-touch)
    if (event.button !== 0 && event.button !== undefined) return;

    // Prevent default touch behaviors like scrolling and zooming
    event.preventDefault();
    event.stopPropagation();

    // Capture pointer for consistent tracking across moves
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch (e) {
      // Some browsers may not support pointer capture, continue anyway
    }

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

    // Prevent default to avoid scrolling while panning
    event.preventDefault();
    event.stopPropagation();

    const deltaX = event.clientX - panStateRef.current.startX;
    const deltaY = event.clientY - panStateRef.current.startY;
    setViewport((prev) => ({
      ...prev,
      x: panStateRef.current.originX + deltaX,
      y: panStateRef.current.originY + deltaY,
    }));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!supportsZoom) return;
    if (panStateRef.current.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // ignore release failures (e.g. pointer already released)
    }
    panStateRef.current.pointerId = null;
    setIsPanning(false);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!supportsZoom) return;
    if (panStateRef.current.pointerId !== event.pointerId) return;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // ignore release failures
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
    width: `${paddedWidth}px`,
    cursor:
      supportsZoom && isGlobalMode
        ? isPanning
          ? "grabbing"
          : "grab"
        : undefined,
    // Prevent default touch behaviors when zoom/pan is enabled
    touchAction: supportsZoom ? "none" : "pan-x pan-y",
    // Ensure smooth interaction on mobile
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    userSelect: "none",
  };

  const containerClasses = cn(
    "relative mx-auto",
    isGlobalMode ? "max-w-none" : "w-[750px] min-w-[750px]"
  );

  const widthForPositioning = paddedWidth;

  const viewportStyle: CSSProperties | undefined = supportsZoom
    ? {
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
        transformOrigin: "center center",
        touchAction: "none",
        // Ensure smooth transforms on mobile
        willChange: "transform",
        // Prevent text selection during pan
        WebkitUserSelect: "none",
        userSelect: "none",
      }
    : undefined;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-50">
      <MapBackground config={config} job={job} />

      <ApplyDialog
        config={config}
        isOpen={isApplyDialogOpen}
        onClose={() => setIsApplyDialogOpen(false)}
        onConfirm={onExpressApply}
      />

      {/* Overlay UI (keeps header/progress fixed while canvas scrolls) */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between">
        <MapHeader
          config={config}
          job={job}
          completedCount={completedCount}
          accentColor={accentColor}
          onBackToCampus={onBackToCampus}
          onExpressApply={() => setIsApplyDialogOpen(true)}
        />

        <MapProgress
          levels={levels}
          completedCount={completedCount}
          accentColor={accentColor}
        />
      </div>

      {/* Scrollable canvas (2D) */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 h-full w-full overflow-auto scroll-smooth [-webkit-overflow-scrolling:touch]"
        style={{
          // When zoom/pan is enabled, prevent native scrolling interference
          touchAction: supportsZoom ? "none" : "pan-x pan-y",
        }}
      >
        {/* Side fades fixed, not scrolling with canvas */}
        <div className="pointer-events-none fixed left-0 top-0 z-20 h-full w-8 bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="pointer-events-none fixed right-0 top-0 z-20 h-full w-8 bg-gradient-to-l from-slate-50 to-transparent" />

        <div
          className={containerClasses}
          style={containerStyle}
          onPointerDown={supportsZoom ? handlePointerDown : undefined}
          onPointerMove={supportsZoom ? handlePointerMove : undefined}
          onPointerUp={supportsZoom ? handlePointerUp : undefined}
          onPointerCancel={supportsZoom ? handlePointerCancel : undefined}
          onPointerLeave={supportsZoom ? handlePointerLeave : undefined}
          onWheel={supportsZoom ? handleWheel : undefined}
          // Prevent context menu on long press (mobile)
          onContextMenu={(e) => {
            if (supportsZoom) {
              e.preventDefault();
            }
          }}
        >
          <div
            className="absolute left-0 top-0 h-full w-full"
            style={viewportStyle}
          >
            <MapPaths
              pathData={pathData}
              completedPathData={completedPathData}
              accentColor={accentColor}
              paddedWidth={paddedWidth}
              totalHeight={totalHeight}
            />

            {isGlobalMode && (
              <ClusterLabels
                labels={clusterLabels}
                horizontalPadding={HORIZONTAL_PADDING}
                widthForPositioning={widthForPositioning}
              />
            )}

            {levelPositions.map((position) => {
              const { level, row, index, jobMeta } = position;
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
              const isMilestone = level.id % 5 === 0 && isCompleted;

              return (
                <LevelNode
                  key={levelKey}
                  position={position}
                  isGlobalMode={isGlobalMode}
                  accentColor={accentColor}
                  nodeAccent={nodeAccent}
                  isCurrent={isCurrent}
                  isCompleted={isCompleted}
                  isLocked={isLocked}
                  isUnlocked={isUnlocked}
                  isUnlockedButNotCurrent={isUnlockedButNotCurrent}
                  isPartOfBranch={isPartOfBranch}
                  isFirst={isFirst}
                  isMilestone={isMilestone}
                  buttonDisabled={buttonDisabled}
                  levelKey={levelKey}
                  horizontalPadding={HORIZONTAL_PADDING}
                  widthForPositioning={widthForPositioning}
                  onLevelClick={onLevelClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
