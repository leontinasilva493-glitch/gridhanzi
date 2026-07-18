import type {
  GridDensity,
  WorksheetEntry,
} from "./types";

const HAN_CHARACTER = /\p{Script=Han}/u;
const TEST_ENTRIES_PER_PAGE = 10;
const LEARN_PAGE_WEIGHT = 8;

export interface CharacterPracticeUnit {
  id: string;
  entryId: string;
  entryNumber: number;
  character: string;
  characterIndex: number;
  word: string;
  pinyin: string;
  english: string;
  showContext: boolean;
}

export interface PracticeCell {
  kind: "model" | "trace" | "blank";
  value: string;
  traceLevel?: "medium" | "light";
}

export interface DensityLayout {
  columns: number;
  rowsPerPage: number;
}

const DENSITY_LAYOUTS: Record<GridDensity, DensityLayout> = {
  large: { columns: 6, rowsPerPage: 7 },
  standard: { columns: 8, rowsPerPage: 8 },
  compact: { columns: 10, rowsPerPage: 10 },
};

export function getHanziCharacters(value: string): string[] {
  return Array.from(value).filter((character) =>
    HAN_CHARACTER.test(character),
  );
}

export function splitEntryIntoCharacterUnits(
  entry: WorksheetEntry,
  entryNumber = 1,
): CharacterPracticeUnit[] {
  return getHanziCharacters(entry.hanzi).map((character, characterIndex) => ({
    id: `${entry.id}-character-${characterIndex + 1}`,
    entryId: entry.id,
    entryNumber,
    character,
    characterIndex,
    word: entry.hanzi,
    pinyin: entry.pinyin,
    english: entry.english,
    showContext: characterIndex === 0,
  }));
}

export function getDensityLayout(density: GridDensity): DensityLayout {
  return DENSITY_LAYOUTS[density];
}

export function buildPracticeCells(
  character: string,
  density: GridDensity,
): PracticeCell[] {
  const { columns } = getDensityLayout(density);
  return Array.from({ length: columns }, (_, index) => {
    if (index === 0) {
      return { kind: "model" as const, value: character };
    }
    if (index === 1) {
      return {
        kind: "trace" as const,
        value: character,
        traceLevel: "medium" as const,
      };
    }
    if (index === 2) {
      return {
        kind: "trace" as const,
        value: character,
        traceLevel: "light" as const,
      };
    }
    return { kind: "blank" as const, value: "" };
  });
}

export function paginatePracticeEntries(
  entries: WorksheetEntry[],
  density: GridDensity,
): CharacterPracticeUnit[][] {
  const capacity = getDensityLayout(density).rowsPerPage;
  const pages: CharacterPracticeUnit[][] = [];
  let currentPage: CharacterPracticeUnit[] = [];

  function flushPage() {
    if (currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
    }
  }

  for (const [entryIndex, entry] of entries.entries()) {
    const units = splitEntryIntoCharacterUnits(entry, entryIndex + 1);
    if (units.length === 0) continue;

    if (
      units.length <= capacity &&
      currentPage.length > 0 &&
      currentPage.length + units.length > capacity
    ) {
      flushPage();
    }

    let cursor = 0;
    while (cursor < units.length) {
      const remaining = capacity - currentPage.length;
      const chunk = units.slice(cursor, cursor + remaining).map(
        (unit, index) => ({
          ...unit,
          showContext: index === 0 && (cursor === 0 || currentPage.length === 0),
        }),
      );
      currentPage.push(...chunk);
      cursor += chunk.length;
      if (currentPage.length === capacity) flushPage();
    }
  }

  flushPage();
  return pages;
}

export function paginateTestEntries(
  entries: WorksheetEntry[],
): WorksheetEntry[][] {
  return Array.from(
    { length: Math.ceil(entries.length / TEST_ENTRIES_PER_PAGE) },
    (_, pageIndex) =>
      entries.slice(
        pageIndex * TEST_ENTRIES_PER_PAGE,
        (pageIndex + 1) * TEST_ENTRIES_PER_PAGE,
      ),
  );
}

export function getTestAnswerCharacters(entry: WorksheetEntry): string[] {
  return getHanziCharacters(entry.hanzi);
}

export function getLearnStrokeRowCount(strokeCount: number): number {
  if (!Number.isFinite(strokeCount) || strokeCount <= 0) return 0;
  return Math.ceil(strokeCount / 8);
}

function getLearnUnitWeight(
  unit: CharacterPracticeUnit,
  strokeCounts: ReadonlyMap<string, number>,
  showStrokeOrder: boolean,
): number {
  if (!showStrokeOrder) return 1;
  return 1 + Math.max(1, getLearnStrokeRowCount(strokeCounts.get(unit.character) ?? 0));
}

export function paginateLearnUnits(
  units: CharacterPracticeUnit[],
  strokeCounts: ReadonlyMap<string, number>,
  showStrokeOrder: boolean,
): CharacterPracticeUnit[][] {
  const pages: CharacterPracticeUnit[][] = [];
  let currentPage: CharacterPracticeUnit[] = [];
  let currentWeight = 0;

  for (const unit of units) {
    const weight = getLearnUnitWeight(unit, strokeCounts, showStrokeOrder);
    if (
      currentPage.length > 0 &&
      currentWeight + weight > LEARN_PAGE_WEIGHT
    ) {
      pages.push(currentPage);
      currentPage = [];
      currentWeight = 0;
    }
    currentPage.push(unit);
    currentWeight += weight;
  }

  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
}
