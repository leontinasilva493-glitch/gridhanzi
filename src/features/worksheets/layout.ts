import { getWorksheetProfilePreset } from "./profiles";
import type {
  PracticeStrength,
  StrokeOrderMode,
  WorksheetEntry,
  WorksheetProfile,
  WorksheetSettings,
} from "./types";

const HAN_CHARACTER = /\p{Script=Han}/u;

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

export interface WorksheetLayoutSpec {
  profile: WorksheetProfile;
  unit: "mm" | "px";
  pageWidth: number;
  pageHeight: number;
  margin: number;
  usableWidth: number;
  contentHeight: number;
  cellSize: number;
  cellGap: number;
  rowGap: number;
  contextHeight: number;
  practiceColumns: number;
  rowsPerPage: number;
  testEntriesPerPage: number;
  learnPageWeight: number;
  strokeCellSize: number;
  strokeFramesPerRow: number;
}

const PAGE_METRICS = {
  a4: { width: 210, height: 297, unit: "mm" as const },
  letter: { width: 215.9, height: 279.4, unit: "mm" as const },
  tablet: { width: 1024, height: 1365.333, unit: "px" as const },
};

const PROFILE_VERTICAL_METRICS: Record<
  WorksheetProfile,
  {
    contextHeight: number;
    rowGap: number;
    headerHeight: number;
    footerHeight: number;
    strokeCellSize: number;
    learnPageWeight: number;
  }
> = {
  kids: {
    contextHeight: 5,
    rowGap: 3,
    headerHeight: 26,
    footerHeight: 8,
    strokeCellSize: 14,
    learnPageWeight: 8,
  },
  adult: {
    contextHeight: 4,
    rowGap: 2,
    headerHeight: 26,
    footerHeight: 8,
    strokeCellSize: 10,
    learnPageWeight: 12,
  },
  tablet: {
    contextHeight: 32,
    rowGap: 24,
    headerHeight: 120,
    footerHeight: 40,
    strokeCellSize: 64,
    learnPageWeight: 6,
  },
  brush: {
    contextHeight: 5,
    rowGap: 3,
    headerHeight: 26,
    footerHeight: 8,
    strokeCellSize: 20,
    learnPageWeight: 5,
  },
};

const PROFILE_MAX_PRACTICE_ROWS: Record<WorksheetProfile, number> = {
  kids: 8,
  adult: 10,
  tablet: 5,
  brush: 4,
};

export function resolveWorksheetLayout(
  settings: WorksheetSettings,
): WorksheetLayoutSpec {
  const preset = getWorksheetProfilePreset(settings.profile);
  const page = PAGE_METRICS[settings.paperSize];
  const isTablet = settings.profile === "tablet";
  const margin = isTablet
    ? settings.printMargin === "narrow"
      ? 28
      : 40
    : settings.printMargin === "narrow"
      ? 7
      : 11;
  const cellGap = isTablet ? 8 : settings.profile === "brush" ? 2 : 1.2;
  const usableWidth = page.width - margin * 2;
  const minimumColumns =
    preset.modelCells + preset.traceCells + preset.minimumBlankCells;
  const calculatedColumns = Math.floor(
    (usableWidth + cellGap) / (settings.cellSize + cellGap),
  );
  const practiceColumns =
    preset.fixedColumns ??
    (isTablet
      ? 6
      : Math.max(minimumColumns, calculatedColumns));
  const vertical = PROFILE_VERTICAL_METRICS[settings.profile];
  const contentHeight =
    page.height -
    margin * 2 -
    vertical.headerHeight -
    vertical.footerHeight;
  const calculatedRows = Math.max(
    1,
    Math.floor(
      contentHeight /
        (settings.cellSize + vertical.contextHeight + vertical.rowGap),
    ),
  );
  const rowsPerPage = Math.min(
    PROFILE_MAX_PRACTICE_ROWS[settings.profile],
    calculatedRows,
  );

  return {
    profile: settings.profile,
    unit: page.unit,
    pageWidth: page.width,
    pageHeight: page.height,
    margin,
    usableWidth,
    contentHeight,
    cellSize: settings.cellSize,
    cellGap,
    rowGap: vertical.rowGap,
    contextHeight: vertical.contextHeight,
    practiceColumns,
    rowsPerPage,
    testEntriesPerPage: preset.testEntriesPerPage,
    learnPageWeight: vertical.learnPageWeight,
    strokeCellSize: vertical.strokeCellSize,
    strokeFramesPerRow: 8,
  };
}

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

export function buildPracticeCells(
  character: string,
  layout: WorksheetLayoutSpec,
  strength: PracticeStrength = "balanced",
): PracticeCell[] {
  const preset = getWorksheetProfilePreset(layout.profile);
  const modelCells = Math.min(1, preset.modelCells);
  const traceCells =
    strength === "guided"
      ? Math.min(4, Math.max(0, layout.practiceColumns - modelCells - 1))
      : strength === "independent"
        ? 0
        : preset.traceCells;
  const teachingCells = modelCells + traceCells;

  return Array.from({ length: layout.practiceColumns }, (_, index) => {
    if (index < modelCells) {
      return { kind: "model" as const, value: character };
    }
    if (index < teachingCells) {
      const traceIndex = index - modelCells;
      return {
        kind: "trace" as const,
        value: character,
        traceLevel:
          traceIndex === 0 ? ("medium" as const) : ("light" as const),
      };
    }
    return { kind: "blank" as const, value: "" };
  });
}

export function paginatePracticeEntries(
  entries: WorksheetEntry[],
  layout: WorksheetLayoutSpec,
  extraBlankRows: 0 | 1 = 0,
): CharacterPracticeUnit[][] {
  const capacity = Math.max(
    1,
    Math.floor(layout.rowsPerPage / (1 + extraBlankRows)),
  );
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
  layout: WorksheetLayoutSpec,
): WorksheetEntry[][] {
  const capacity = layout.testEntriesPerPage;
  return Array.from(
    { length: Math.ceil(entries.length / capacity) },
    (_, pageIndex) =>
      entries.slice(pageIndex * capacity, (pageIndex + 1) * capacity),
  );
}

export function getTestAnswerCharacters(entry: WorksheetEntry): string[] {
  return getHanziCharacters(entry.hanzi);
}

export function formatTestPrompt(
  english: string,
  answerCharacters: readonly string[],
): string {
  const prompt = english.trim() || "Write the word";
  return answerCharacters.length > 1
    ? `${prompt} (${answerCharacters.length} characters)`
    : prompt;
}

export function getLearnStrokeRowCount(
  strokeCount: number,
  framesPerRow = 8,
): number {
  if (!Number.isFinite(strokeCount) || strokeCount <= 0) return 0;
  return Math.ceil(strokeCount / framesPerRow);
}

function getLearnUnitWeight(
  unit: CharacterPracticeUnit,
  strokeCounts: ReadonlyMap<string, number>,
  strokeOrderMode: StrokeOrderMode,
  framesPerRow: number,
  extraBlankRows: 0 | 1,
): number {
  const strokeWeight =
    strokeOrderMode === "off"
      ? 0
      : strokeOrderMode === "compact"
        ? 1
        : Math.max(
            1,
            getLearnStrokeRowCount(
              strokeCounts.get(unit.character) ?? 0,
              framesPerRow,
            ),
          );
  return 1 + strokeWeight + extraBlankRows;
}

export function paginateLearnUnits(
  units: CharacterPracticeUnit[],
  strokeCounts: ReadonlyMap<string, number>,
  strokeOrderMode: StrokeOrderMode,
  layout: WorksheetLayoutSpec,
  extraBlankRows: 0 | 1 = 0,
): CharacterPracticeUnit[][] {
  const pages: CharacterPracticeUnit[][] = [];
  let currentPage: CharacterPracticeUnit[] = [];
  let currentWeight = 0;

  for (const unit of units) {
    const weight = getLearnUnitWeight(
      unit,
      strokeCounts,
      strokeOrderMode,
      layout.strokeFramesPerRow,
      extraBlankRows,
    );
    if (
      currentPage.length > 0 &&
      currentWeight + weight > layout.learnPageWeight
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
