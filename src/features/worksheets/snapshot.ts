import {
  clampWorksheetCellSize,
  getCompatiblePaperSize,
  getWorksheetProfilePreset,
  parseWorksheetProfile,
} from "./profiles";
import {
  defaultWorksheetSettings,
  type CharacterStandard,
  type GridStyle,
  type PaperSize,
  type PracticeStrength,
  type PrintMargin,
  type StrokeOrderMode,
  type WorksheetDifficulty,
  type WorksheetEntry,
  type WorksheetMode,
  type WorksheetOutput,
  type WorksheetProfile,
  type WorksheetSnapshot,
} from "./types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function normalizeEntries(value: unknown): WorksheetEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((entry, index) => {
    const hanzi = typeof entry.hanzi === "string" ? entry.hanzi : "";
    const pinyin = typeof entry.pinyin === "string" ? entry.pinyin : "";
    const english = typeof entry.english === "string" ? entry.english : "";
    return {
      id: typeof entry.id === "string" ? entry.id : `row-${index + 1}`,
      hanzi,
      pinyin,
      english,
      status:
        entry.status === "complete" &&
        Boolean(hanzi && pinyin && english)
          ? "complete"
          : "needs-review",
    };
  });
}

function legacyProfile(
  density: unknown,
): { profile: WorksheetProfile; cellSize: number } {
  if (density === "compact") return { profile: "adult", cellSize: 16 };
  if (density === "large") return { profile: "kids", cellSize: 24 };
  return { profile: "kids", cellSize: 22 };
}

function validMode(value: unknown): WorksheetMode {
  return value === "trace" || value === "quiz" || value === "write"
    ? value
    : defaultWorksheetSettings.mode;
}

function validCharacterStandard(value: unknown): CharacterStandard {
  return value === "traditional-tw" ? value : "simplified";
}

function validOutput(value: unknown): WorksheetOutput {
  return value === "flashcards" || value === "worksheet"
    ? value
    : defaultWorksheetSettings.output;
}

function validGrid(value: unknown, fallback: GridStyle): GridStyle {
  return value === "mi" || value === "tian" ? value : fallback;
}

function validPaper(value: unknown): PaperSize {
  return value === "letter" || value === "tablet" || value === "a4"
    ? value
    : defaultWorksheetSettings.paperSize;
}

function validDifficulty(value: unknown): WorksheetDifficulty {
  return value === "advanced" || value === "beginner"
    ? value
    : defaultWorksheetSettings.difficulty;
}

function validMargin(value: unknown): PrintMargin {
  return value === "narrow" || value === "normal"
    ? value
    : defaultWorksheetSettings.printMargin;
}

function validPracticeStrength(value: unknown): PracticeStrength {
  return value === "guided" || value === "independent" || value === "balanced"
    ? value
    : defaultWorksheetSettings.practiceStrength;
}

function validFlashcardsPerPage(value: unknown): 6 | 9 {
  return value === 9 ? 9 : 6;
}

function validStrokeOrderMode(
  value: unknown,
  legacyShowStrokeOrder: unknown,
): StrokeOrderMode {
  if (value === "compact" || value === "off" || value === "detailed") {
    return value;
  }
  return legacyShowStrokeOrder === false
    ? "off"
    : defaultWorksheetSettings.strokeOrderMode;
}

export function normalizeWorksheetSnapshot(value: unknown): WorksheetSnapshot {
  const snapshot = isRecord(value) ? value : {};
  const rawSettings = isRecord(snapshot.settings) ? snapshot.settings : {};
  const migrated =
    snapshot.version === 1
      ? legacyProfile(rawSettings.gridDensity)
      : {
          profile: parseWorksheetProfile(
            typeof rawSettings.profile === "string"
              ? rawSettings.profile
              : undefined,
          ),
          cellSize:
            typeof rawSettings.cellSize === "number" &&
            Number.isFinite(rawSettings.cellSize) &&
            rawSettings.cellSize > 0
              ? rawSettings.cellSize
              : Number.NaN,
        };
  const profile = migrated.profile;
  const preset = getWorksheetProfilePreset(profile);
  const cellSize = clampWorksheetCellSize(profile, migrated.cellSize);
  const output = validOutput(rawSettings.output);
  const compatiblePaperSize = getCompatiblePaperSize(
    profile,
    validPaper(rawSettings.paperSize),
  );
  const paperSize =
    output === "flashcards" && compatiblePaperSize === "tablet"
      ? "a4"
      : compatiblePaperSize;
  const strokeOrderMode = validStrokeOrderMode(
    rawSettings.strokeOrderMode,
    rawSettings.showStrokeOrder,
  );

  return {
    version: 3,
    entries: normalizeEntries(snapshot.entries),
    settings: {
      ...defaultWorksheetSettings,
      characterStandard: validCharacterStandard(rawSettings.characterStandard),
      profile,
      cellSize,
      output,
      mode: validMode(rawSettings.mode),
      grid: validGrid(rawSettings.grid, preset.defaultGrid),
      showPinyin:
        typeof rawSettings.showPinyin === "boolean"
          ? rawSettings.showPinyin
          : defaultWorksheetSettings.showPinyin,
      showStrokeOrder: strokeOrderMode !== "off",
      practiceStrength: validPracticeStrength(rawSettings.practiceStrength),
      extraBlankRows: rawSettings.extraBlankRows === 1 ? 1 : 0,
      strokeOrderMode,
      flashcardsPerPage: validFlashcardsPerPage(rawSettings.flashcardsPerPage),
      flashcardShowPinyin:
        typeof rawSettings.flashcardShowPinyin === "boolean"
          ? rawSettings.flashcardShowPinyin
          : defaultWorksheetSettings.flashcardShowPinyin,
      flashcardShowEnglish:
        typeof rawSettings.flashcardShowEnglish === "boolean"
          ? rawSettings.flashcardShowEnglish
          : defaultWorksheetSettings.flashcardShowEnglish,
      paperSize,
      difficulty: validDifficulty(rawSettings.difficulty),
      printMargin: validMargin(rawSettings.printMargin),
      title:
        typeof rawSettings.title === "string"
          ? rawSettings.title
          : defaultWorksheetSettings.title,
      studentName:
        typeof rawSettings.studentName === "string"
          ? rawSettings.studentName
          : defaultWorksheetSettings.studentName,
      date:
        typeof rawSettings.date === "string"
          ? rawSettings.date
          : defaultWorksheetSettings.date,
    },
  };
}
