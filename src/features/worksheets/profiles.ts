import type {
  GridStyle,
  PaperSize,
  WorksheetProfile,
} from "./types";

export interface WorksheetProfilePreset {
  id: WorksheetProfile;
  label: string;
  description: string;
  writingTool: string;
  size: {
    default: number;
    min: number;
    max: number;
    step: number;
    unit: "mm" | "px";
  };
  defaultGrid: GridStyle;
  pageFormats: readonly PaperSize[];
  modelCells: number;
  traceCells: number;
  minimumBlankCells: number;
  fixedColumns?: number;
  testEntriesPerPage: number;
}

export const worksheetProfilePresets: Record<
  WorksheetProfile,
  WorksheetProfilePreset
> = {
  kids: {
    id: "kids",
    label: "Kids",
    description: "Large, guided grids for early learners",
    writingTool: "HB / 2B pencil",
    size: { default: 22, min: 20, max: 24, step: 1, unit: "mm" },
    defaultGrid: "tian",
    pageFormats: ["a4", "letter"],
    modelCells: 1,
    traceCells: 2,
    minimumBlankCells: 3,
    testEntriesPerPage: 8,
  },
  adult: {
    id: "adult",
    label: "Adult",
    description: "Compact repetition for fluent handwriting",
    writingTool: "0.38–0.5 mm pen",
    size: { default: 14, min: 12, max: 16, step: 1, unit: "mm" },
    defaultGrid: "tian",
    pageFormats: ["a4", "letter"],
    modelCells: 1,
    traceCells: 1,
    minimumBlankCells: 5,
    testEntriesPerPage: 10,
  },
  tablet: {
    id: "tablet",
    label: "Tablet",
    description: "A 3:4 digital sheet for annotation apps",
    writingTool: "Apple Pencil / stylus",
    size: { default: 112, min: 96, max: 128, step: 8, unit: "px" },
    defaultGrid: "tian",
    pageFormats: ["tablet"],
    modelCells: 1,
    traceCells: 1,
    minimumBlankCells: 4,
    testEntriesPerPage: 6,
  },
  brush: {
    id: "brush",
    label: "Brush",
    description: "Spacious Mi Zi Ge for brush control",
    writingTool: "Chinese brush",
    size: { default: 40, min: 35, max: 45, step: 5, unit: "mm" },
    defaultGrid: "mi",
    pageFormats: ["a4", "letter"],
    modelCells: 1,
    traceCells: 1,
    minimumBlankCells: 2,
    fixedColumns: 4,
    testEntriesPerPage: 4,
  },
};

export function parseWorksheetProfile(
  value: string | null | undefined,
): WorksheetProfile {
  return value === "adult" ||
    value === "tablet" ||
    value === "brush" ||
    value === "kids"
    ? value
    : "kids";
}

export function getWorksheetProfilePreset(
  profile: WorksheetProfile,
): WorksheetProfilePreset {
  return worksheetProfilePresets[profile];
}

export function clampWorksheetCellSize(
  profile: WorksheetProfile,
  value: number,
): number {
  const { size } = getWorksheetProfilePreset(profile);
  if (!Number.isFinite(value)) return size.default;
  const clamped = Math.min(size.max, Math.max(size.min, value));
  const steps = Math.round((clamped - size.min) / size.step);
  return Math.min(size.max, size.min + steps * size.step);
}

export function getCompatiblePaperSize(
  profile: WorksheetProfile,
  current: PaperSize,
): PaperSize {
  const preset = getWorksheetProfilePreset(profile);
  if (preset.pageFormats.includes(current)) return current;
  return preset.pageFormats[0] ?? "a4";
}
