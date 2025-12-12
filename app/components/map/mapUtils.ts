import { PositionedLevel } from "./mapTypes";

export function buildPathSegment(
  from: PositionedLevel,
  to: PositionedLevel,
  curvature: number
) {
  const clampedCurvature = clamp(curvature, 0.2, 0.8);
  const midY = from.y + (to.y - from.y) * clampedCurvature;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
