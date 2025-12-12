import { Level, Job } from "../../types";

export interface PositionedLevel {
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

export interface PathConnection {
  from: PositionedLevel;
  to: PositionedLevel;
}

export interface ClusterLabel {
  id: string;
  title: string;
  icon: string;
  color: string;
  x: number;
  y: number;
}

export interface LayoutResult {
  positions: PositionedLevel[];
  paths: PathConnection[];
  width: number;
  height: number;
  usesGraph: boolean;
}

export interface GlobalLayoutResult {
  positions: PositionedLevel[];
  paths: PathConnection[];
  labels: ClusterLabel[];
  width: number;
  height: number;
}

export interface PanState {
  pointerId: number | null;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}
