import type { HskLevel, HskSystem } from "./hsk";

export const HSK_PICKER_STORAGE_KEY = "gridhanzi:hsk-picker:v1";

export const HSK_LEVELS_BY_SYSTEM: Record<HskSystem, HskLevel[]> = {
  "2.0": ["1", "2", "3", "4", "5", "6"],
  "3.0": ["1", "2", "3", "4", "5", "6", "7-9"],
};

export const HSK_CURATED_THEME_IDS = [
  "hsk-3-apartment-home",
  "hsk-3-campus-life",
  "hsk-3-exams-grades",
  "hsk-3-health",
  "hsk-3-office-teamwork",
  "hsk-3-shopping-money",
  "hsk-3-technology",
] as const;

export interface HskPickerState {
  system: HskSystem;
  level: HskLevel;
  query: string;
  theme: string;
  selectedIds: string[];
}

type UnknownRecord = Record<string, unknown>;

type ParseHskPickerStateOptions = {
  validIds?: ReadonlySet<string>;
  validThemes?: ReadonlySet<string>;
  fallbackState?: Partial<HskPickerState>;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

export function getHskLevels(system: HskSystem): HskLevel[] {
  return [...HSK_LEVELS_BY_SYSTEM[system]];
}

function normalizeHskSystem(value: unknown, fallback: HskSystem): HskSystem {
  return value === "3.0" || value === "2.0" ? value : fallback;
}

function normalizeHskLevel(system: HskSystem, value: unknown): HskLevel {
  const levels = getHskLevels(system);
  return levels.includes(value as HskLevel) ? (value as HskLevel) : levels[0]!;
}

function normalizeTheme(
  system: HskSystem,
  value: unknown,
  validThemes: ReadonlySet<string>,
): string {
  if (system !== "3.0") return "";
  return typeof value === "string" && validThemes.has(value) ? value : "";
}

function normalizeSelectedIds(
  value: unknown,
  validIds?: ReadonlySet<string>,
): string[] {
  if (!Array.isArray(value)) return [];

  const deduped = new Set<string>();
  for (const item of value) {
    if (typeof item !== "string") continue;
    if (validIds && !validIds.has(item)) continue;
    deduped.add(item);
  }
  return [...deduped];
}

export function createHskPickerState(
  overrides: Partial<HskPickerState> = {},
): HskPickerState {
  const fallbackSystem = overrides.system === "3.0" ? "3.0" : "2.0";
  const fallbackThemes = new Set(HSK_CURATED_THEME_IDS);
  const system = normalizeHskSystem(overrides.system, fallbackSystem);
  const level = normalizeHskLevel(system, overrides.level);

  return {
    system,
    level,
    query: typeof overrides.query === "string" ? overrides.query : "",
    theme: normalizeTheme(system, overrides.theme, fallbackThemes),
    selectedIds: normalizeSelectedIds(overrides.selectedIds),
  };
}

export function parseHskPickerState(
  raw: string | null,
  options: ParseHskPickerStateOptions = {},
): HskPickerState {
  const fallback = createHskPickerState(options.fallbackState);
  if (!raw) return fallback;

  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return fallback;

    const validThemes = options.validThemes ?? new Set(HSK_CURATED_THEME_IDS);
    const system = normalizeHskSystem(value.system, fallback.system);
    const level = normalizeHskLevel(system, value.level);

    return {
      system,
      level,
      query: typeof value.query === "string" ? value.query : fallback.query,
      theme: normalizeTheme(system, value.theme, validThemes),
      selectedIds: normalizeSelectedIds(value.selectedIds, options.validIds),
    };
  } catch {
    return fallback;
  }
}
