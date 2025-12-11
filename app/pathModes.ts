import { PathModeConfig, PathModeId } from "./types";

const DEFAULT_WIDTH = 600;
const DEFAULT_ROW_HEIGHT = 150;
const DEFAULT_ZIGZAG_OFFSET = 50;

/**
 * Canonical registry for path presentation modes.
 * Each mode encodes layout intent so rendering logic can stay declarative.
 */
export const pathModes: Record<PathModeId, PathModeConfig> = {
  linear: {
    id: "linear",
    label: "Linear Trail",
    description:
      "Single trail that snakes down the page in a zig-zag pattern. Ideal for classic onboarding flows.",
    layoutStrategy: "linear",
    geometry: {
      width: DEFAULT_WIDTH,
      rowHeight: DEFAULT_ROW_HEIGHT,
      zigzagOffset: DEFAULT_ZIGZAG_OFFSET,
    },
    connection: {
      type: "bezier",
      curvature: 0.55,
    },
  },
  branching: {
    id: "branching",
    label: "Branching Nodes",
    description:
      "Graph layout with shared rows and explicit branches defined per level. Good for role trees.",
    layoutStrategy: "branching",
    geometry: {
      width: DEFAULT_WIDTH,
      rowHeight: DEFAULT_ROW_HEIGHT,
    },
    branch: {
      align: "justify",
    },
    connection: {
      type: "bezier",
      curvature: 0.45,
    },
  },
  "global-map": {
    id: "global-map",
    label: "Global Talent Atlas",
    description:
      "Nested multi-job map that plots every path onto a single zoomable canvas. Jobs become clusters with their own sub-layout.",
    layoutStrategy: "global",
    geometry: {
      width: DEFAULT_WIDTH,
      rowHeight: DEFAULT_ROW_HEIGHT,
    },
    globalLayout: {
      columns: 2,
      columnGap: 240,
      rowGap: 260,
      clusterWidth: 720,
    },
    connection: {
      type: "bezier",
      curvature: 0.35,
    },
    zoom: {
      enabled: true,
      min: 0.6,
      max: 1.8,
      defaultScale: 0.95,
    },
  },
};

export function getPathModeConfig(mode?: PathModeId): PathModeConfig {
  if (!mode) return pathModes.linear;
  return pathModes[mode] ?? pathModes.linear;
}
