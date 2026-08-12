import catalog from "./hsk-catalog.json";
import {
  getHanziCharacters,
  resolveWorksheetLayout,
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
  if (settings.mode === "quiz") {
    return Math.ceil(entries.length / layout.testEntriesPerPage);
  }

  const characterCount = entries.reduce(
    (count, entry) => count + getHanziCharacters(entry.hanzi).length,
    0,
  );
  if (characterCount === 0) return 0;

  if (settings.mode === "write") {
    const rowsPerEntry = 1 + settings.extraBlankRows;
    const entriesPerPage = Math.max(
      1,
      Math.floor(layout.rowsPerPage / rowsPerEntry),
    );
    return Math.ceil(characterCount / entriesPerPage);
  }

  const strokeRows =
    settings.strokeOrderMode === "off"
      ? 0
      : settings.strokeOrderMode === "compact"
        ? 1
        : 2;
  const estimatedWeight = 1 + strokeRows + settings.extraBlankRows;
  const charactersPerPage = Math.max(
    1,
    Math.floor(layout.learnPageWeight / estimatedWeight),
  );
  return Math.ceil(characterCount / charactersPerPage);
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
