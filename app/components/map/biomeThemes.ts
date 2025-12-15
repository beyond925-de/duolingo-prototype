"use client";

import { CompanyInfo, Job } from "../../types";

type PatternPathElement = {
  type: "path";
  d: string;
  strokeWidth?: number;
  opacity?: number;
  strokeLinecap?: "round" | "butt" | "square";
};

type PatternCircleElement = {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
};

export type PatternElement = PatternPathElement | PatternCircleElement;

export interface BiomeTheme {
  id: string;
  label: string;
  background: string;
  patternColor: string;
  overlayColor: string;
  keywords: string[];
  patternRadius?: number;
  patternSize?: number;
  patternOpacity?: number;
  patternElements: PatternElement[];
}

export const BIOME_THEMES: BiomeTheme[] = [
  {
    id: "tech",
    label: "Tech",
    background: "#e0f2fe",
    patternColor: "#0ea5e9",
    overlayColor: "rgba(14, 165, 233, 0.12)",
    patternSize: 48,
    patternOpacity: 0.18,
    keywords: [
      "tech",
      "digital",
      "it",
      "software",
      "cad",
      "3d",
      "programm",
      "design",
    ],
    patternElements: [
      { type: "path", d: "M0 12 H48", strokeWidth: 1.5, opacity: 0.18 },
      { type: "path", d: "M24 0 V48", strokeWidth: 1.5, opacity: 0.18 },
      {
        type: "path",
        d: "M36 16 H48 V30 H36 Z",
        strokeWidth: 2,
        opacity: 0.22,
      },
      { type: "path", d: "M0 32 H14", strokeWidth: 1, opacity: 0.1 },
      { type: "circle", cx: 8, cy: 8, r: 2.5, opacity: 0.3 },
      { type: "circle", cx: 40, cy: 40, r: 2.5, opacity: 0.25 },
    ],
  },
  {
    id: "craft",
    label: "Craft",
    background: "#fff7ed",
    patternColor: "#f97316",
    overlayColor: "rgba(249, 115, 22, 0.15)",
    patternSize: 48,
    patternOpacity: 0.2,
    keywords: [
      "werkstatt",
      "handwerk",
      "metall",
      "mechanik",
      "industri",
      "maschinen",
      "fertigung",
      "techniker",
    ],
    patternElements: [
      {
        type: "path",
        d: "M10 0 H30 L40 10 L30 20 H10 L0 10 Z",
        strokeWidth: 1.8,
        opacity: 0.22,
      },
      {
        type: "path",
        d: "M10 20 H30 L40 30 L30 40 H10 L0 30 Z",
        strokeWidth: 1.8,
        opacity: 0.2,
      },
      {
        type: "path",
        d: "M5 10 L15 10 L20 18 L15 26 L5 26 L0 18 Z",
        strokeWidth: 1.2,
        opacity: 0.15,
      },
      { type: "circle", cx: 24, cy: 10, r: 3, opacity: 0.25 },
      { type: "circle", cx: 24, cy: 34, r: 3, opacity: 0.2 },
    ],
  },
  {
    id: "office",
    label: "Office",
    background: "#f5f3ff",
    patternColor: "#8b5cf6",
    overlayColor: "rgba(139, 92, 246, 0.12)",
    patternSize: 48,
    patternOpacity: 0.16,
    keywords: [
      "office",
      "kauf",
      "sales",
      "marketing",
      "planung",
      "büro",
      "service",
    ],
    patternElements: [
      { type: "path", d: "M0 0 L48 48", strokeWidth: 1.2, opacity: 0.18 },
      { type: "path", d: "M0 48 L48 0", strokeWidth: 1.2, opacity: 0.18 },
      { type: "path", d: "M12 0 L12 48", strokeWidth: 1.2, opacity: 0.12 },
      { type: "path", d: "M36 0 L36 48", strokeWidth: 1.2, opacity: 0.12 },
      { type: "circle", cx: 24, cy: 24, r: 3, opacity: 0.1 },
    ],
  },
  {
    id: "care",
    label: "Care",
    background: "#fdf2f8",
    patternColor: "#ec4899",
    overlayColor: "rgba(236, 72, 153, 0.12)",
    patternSize: 48,
    patternOpacity: 0.15,
    keywords: [
      "pflege",
      "gesundheit",
      "care",
      "team",
      "miteinander",
      "soziales",
    ],
    patternElements: [
      {
        type: "path",
        d: "M0 18 C8 6 16 30 24 18 C32 6 40 30 48 18",
        strokeWidth: 1.6,
        opacity: 0.25,
      },
      {
        type: "path",
        d: "M0 30 C8 18 16 42 24 30 C32 18 40 42 48 30",
        strokeWidth: 1.6,
        opacity: 0.2,
      },
      { type: "circle", cx: 10, cy: 10, r: 2, opacity: 0.18 },
      { type: "circle", cx: 38, cy: 10, r: 2, opacity: 0.18 },
    ],
  },
  {
    id: "default",
    label: "Default",
    background: "#f8fafc",
    patternColor: "#64748b",
    overlayColor: "rgba(100, 116, 139, 0.08)",
    patternSize: 48,
    patternOpacity: 0.1,
    keywords: [],
    patternElements: [
      { type: "path", d: "M0 12 H48", strokeWidth: 1, opacity: 0.08 },
      { type: "path", d: "M0 36 H48", strokeWidth: 1, opacity: 0.08 },
      { type: "path", d: "M12 0 V48", strokeWidth: 1, opacity: 0.08 },
      { type: "path", d: "M36 0 V48", strokeWidth: 1, opacity: 0.08 },
    ],
  },
];

const DEFAULT_THEME = BIOME_THEMES.find((theme) => theme.id === "default")!;

export function getBiomeTheme(job: Job, company: CompanyInfo): BiomeTheme {
  if (job.biomeThemeId) {
    const forcedTheme = BIOME_THEMES.find(
      (theme) => theme.id === job.biomeThemeId
    );
    if (forcedTheme) return forcedTheme;
  }

  const searchText = [
    job.title,
    job.description,
    company.industryVibe,
    ...(job.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  for (const theme of BIOME_THEMES) {
    if (theme.id === "default") continue;
    if (theme.keywords.some((keyword) => searchText.includes(keyword))) {
      return theme;
    }
  }

  return DEFAULT_THEME;
}
