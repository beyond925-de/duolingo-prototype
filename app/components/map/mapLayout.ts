import { Level, Job, PathModeConfig } from "../../types";
import {
  PositionedLevel,
  PathConnection,
  LayoutResult,
  GlobalLayoutResult,
  ClusterLabel,
} from "./mapTypes";
import { getPathModeConfig } from "../../pathModes";

const DEFAULT_ROW_HEIGHT = 150;
const DEFAULT_WIDTH = 750;
const DEFAULT_OFFSET_X = 50;

export function buildLocalLayout(
  levels: Level[],
  pathMode: PathModeConfig,
  job?: Job
): LayoutResult {
  const width = pathMode.geometry.width ?? DEFAULT_WIDTH;
  const rowHeight = pathMode.geometry.rowHeight ?? DEFAULT_ROW_HEIGHT;
  const zigzagOffset = pathMode.geometry.zigzagOffset ?? DEFAULT_OFFSET_X;
  const TOP_OFFSET = 260; // reserve space for overlay UI
  const BOTTOM_PADDING = 200; // reserve space for footer / progress overlay

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
    const y = row * rowHeight + TOP_OFFSET;
    let x = width / 2;

    if (usesGraph && level.row !== undefined) {
      const levelsOnSameRow = levels.filter((l) => l.row === level.row);
      const indexInRow = levelsOnSameRow.findIndex((l) => l.id === level.id);
      if (levelsOnSameRow.length === 1) {
        x = width / 2;
      } else {
        // Use 1.8x width for spacing calculation to spread nodes out more (especially on mobile)
        const effectiveWidth = width * 1.8;
        const spacing = effectiveWidth / (levelsOnSameRow.length + 1);
        x = spacing * (indexInRow + 1) - (effectiveWidth - width) / 2;
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

  const totalHeight = (maxRow + 1) * rowHeight + TOP_OFFSET + BOTTOM_PADDING;

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

export function buildGlobalLayout(
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
