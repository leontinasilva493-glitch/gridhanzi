import catalog from "./hsk-catalog.json";
import {
  getHanziCharacters,
  paginateLearnUnits,
  paginatePracticeEntries,
  paginateTestEntries,
  resolveWorksheetLayout,
  splitEntryIntoCharacterUnits,
} from "./layout";
import type { WorksheetEntry, WorksheetSettings } from "./types";

export type HskSystem = "2.0" | "3.0";
export type HskLevel = "1" | "2" | "3" | "4" | "5" | "6" | "7-9";

export interface HskCatalogEntry {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  system: HskSystem;
  level: HskLevel;
  themes: string[];
}

export interface HskFilter {
  system?: HskSystem;
  level?: HskLevel;
  query?: string;
  theme?: string;
}

export interface HskSelectionSummary {
  wordCount: number;
  uniqueHanziCount: number;
  estimatedPageCount: number;
}

export const hskCatalog = catalog as HskCatalogEntry[];

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function filterHskCatalog(filter: HskFilter): HskCatalogEntry[] {
  const query = normalizeSearchText(filter.query ?? "");

  return hskCatalog.filter((entry) => {
    if (filter.system && entry.system !== filter.system) return false;
    if (filter.level && entry.level !== filter.level) return false;
    if (filter.theme && !entry.themes.includes(filter.theme)) return false;
    if (!query) return true;

    return [entry.hanzi, entry.pinyin, entry.english].some((value) =>
      normalizeSearchText(value).includes(query),
    );
  });
}

export function toWorksheetEntries(
  entries: readonly HskCatalogEntry[],
): WorksheetEntry[] {
  return entries.map(({ id, hanzi, pinyin, english }) => ({
    id,
    hanzi,
    pinyin,
    english,
    status: "complete",
  }));
}

function estimateWorksheetPages(
  entries: readonly HskCatalogEntry[],
  settings: WorksheetSettings,
): number {
  if (entries.length === 0) return 0;

  const layout = resolveWorksheetLayout(settings);
  const worksheetEntries = toWorksheetEntries(entries);
  if (settings.mode === "quiz") {
    return paginateTestEntries(worksheetEntries, layout).length;
  }

  if (settings.mode === "write") {
    return paginatePracticeEntries(
      worksheetEntries,
      layout,
      settings.extraBlankRows,
    ).length;
  }

  const units = worksheetEntries.flatMap((entry, index) =>
    splitEntryIntoCharacterUnits(entry, index + 1),
  );
  if (units.length === 0) return 0;

  // Detailed stroke data loads asynchronously in the renderer. For a stable
  // pre-preview estimate, budget two full stroke rows (16 strokes) per Hanzi;
  // paginateLearnUnits then applies the renderer's real weighting and page
  // breaks. Compact/off modes use their exact renderer weights.
  const conservativeStrokeCount = layout.strokeFramesPerRow * 2;
  const strokeCounts = new Map(
    units.map((unit) => [unit.character, conservativeStrokeCount]),
  );

  return paginateLearnUnits(
    units,
    strokeCounts,
    settings.strokeOrderMode,
    layout,
    settings.extraBlankRows,
  ).length;
}

export function summarizeHskSelection(
  entries: readonly HskCatalogEntry[],
  settings: WorksheetSettings,
): HskSelectionSummary {
  const uniqueHanzi = new Set(
    entries.flatMap((entry) => getHanziCharacters(entry.hanzi)),
  );

  return {
    wordCount: entries.length,
    uniqueHanziCount: uniqueHanzi.size,
    estimatedPageCount: estimateWorksheetPages(entries, settings),
  };
}
