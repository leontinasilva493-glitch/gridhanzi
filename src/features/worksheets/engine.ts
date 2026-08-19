import {
  vocabularyByEnglish,
  vocabularyByHanzi,
  worksheetTemplates,
} from "./data";
import { convertChineseText, convertWorksheetEntries } from "./traditional";
import type { CharacterStandard, WorksheetEntry, WorksheetTemplate } from "./types";

const HANZI_PATTERN = /\p{Script=Han}/u;
export const WORKSHEET_ENTRIES_PER_PAGE = 4;
export const WORKSHEET_ENTRIES_PER_STROKE_PAGE = 3;
export const MAX_VOCABULARY_ROWS = 40;
export const MAX_VOCABULARY_CHARS = 600;
export const MAX_VOCABULARY_ROW_CHARS = 120;

export function containsUnsupportedInputScript(input: string): boolean {
  for (const character of input) {
    if (
      /^\p{Letter}$/u.test(character) &&
      !/^[\p{Script=Latin}\p{Script=Han}]$/u.test(character)
    ) {
      return true;
    }
  }

  return false;
}

export type VocabularyNormalizationResult =
  | { ok: true; values: string[] }
  | { ok: false; error: string };

export function parseVocabularyInput(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, MAX_VOCABULARY_ROWS);
}

export function normalizeVocabularyValues(
  input: string | string[],
): VocabularyNormalizationResult {
  const totalLength = Array.isArray(input)
    ? input.reduce((sum, value) => sum + value.length, 0)
    : input.length;
  if (totalLength > MAX_VOCABULARY_CHARS) {
    return {
      ok: false,
      error: `Keep the worksheet input under ${MAX_VOCABULARY_CHARS} characters.`,
    };
  }

  const values = (Array.isArray(input) ? input : input.split(/\r?\n/))
    .map((value) => value.trim())
    .filter(Boolean);

  if (values.length > MAX_VOCABULARY_ROWS) {
    return {
      ok: false,
      error: `Use no more than ${MAX_VOCABULARY_ROWS} rows per worksheet.`,
    };
  }

  if (values.some((value) => value.length > MAX_VOCABULARY_ROW_CHARS)) {
    return {
      ok: false,
      error: `Keep each row under ${MAX_VOCABULARY_ROW_CHARS} characters.`,
    };
  }

  return { ok: true, values };
}

function resolveMixedRow(value: string) {
  const labelledHanzi = value
    .match(/(?:chinese|hanzi)\s*[:：]\s*([^|,，;；\t/]+)/iu)?.[1]
    ?.trim();
  const labelledEnglish = value
    .match(/(?:english|meaning)\s*[:：]\s*([^|,，;；\t/]+)/iu)?.[1]
    ?.trim();
  const parts = value
    .replace(/\b(?:chinese|hanzi|pinyin|english|meaning)\s*[:：]\s*/giu, "")
    .replace(/[()（）\[\]]/g, ",")
    .split(/\s*(?:,|，|、|;|；|\t|\/|\||:|：|→|=>|—|–|\s+-\s+)\s*/u)
    .map((part) => part.trim())
    .filter(Boolean);

  const hanzi = labelledHanzi ?? parts.find((part) => HANZI_PATTERN.test(part));
  const english =
    labelledEnglish ?? parts.find((part) => !HANZI_PATTERN.test(part));

  return { hanzi, english };
}

export function enrichVocabularyLocally(
  values: string[],
  characterStandard: CharacterStandard = "simplified",
): WorksheetEntry[] {
  return values.map((value, index) => {
    const mixed = resolveMixedRow(value);
    const normalizedHanzi = mixed.hanzi
      ? convertChineseText(mixed.hanzi, "traditional-tw", "simplified")
      : undefined;
    const normalizedValue = convertChineseText(
      value,
      "traditional-tw",
      "simplified",
    );
    const record =
      (normalizedHanzi ? vocabularyByHanzi.get(normalizedHanzi) : undefined) ??
      (mixed.english
        ? vocabularyByEnglish.get(mixed.english.toLowerCase())
        : undefined) ??
      vocabularyByHanzi.get(normalizedValue) ??
      vocabularyByEnglish.get(value.toLowerCase());

    if (record) {
      return {
        id: `row-${index + 1}`,
        hanzi: convertChineseText(record.hanzi, "simplified", characterStandard),
        pinyin: record.pinyin,
        english: record.english,
        status: "complete",
      };
    }

    const isHanzi = HANZI_PATTERN.test(value);

    return {
      id: `row-${index + 1}`,
      hanzi: convertChineseText(
        isHanzi ? mixed.hanzi ?? value : mixed.hanzi ?? "",
        "simplified",
        characterStandard,
      ),
      pinyin: "",
      english: isHanzi ? mixed.english ?? "" : mixed.english ?? value,
      status: "needs-review",
    };
  });
}

export function getTemplateBySlug(
  slug: string | null | undefined,
): WorksheetTemplate | undefined {
  return worksheetTemplates.find((template) => template.slug === slug);
}

export function cloneTemplateEntries(
  slug: string,
  characterStandard: CharacterStandard = "simplified",
): WorksheetEntry[] {
  const template = getTemplateBySlug(slug);
  return convertWorksheetEntries(
    template?.entries.map((entry, index) => ({
      ...entry,
      id: `row-${index + 1}`,
    })) ?? [],
    "simplified",
    characterStandard,
  );
}

export function paginateWorksheetEntries(
  entries: WorksheetEntry[],
  pageSize = WORKSHEET_ENTRIES_PER_PAGE,
): WorksheetEntry[][] {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError("pageSize must be a positive integer.");
  }

  return Array.from(
    { length: Math.ceil(entries.length / pageSize) },
    (_, pageIndex) =>
      entries.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
  );
}

export function getWorksheetEntriesPerPage(showStrokeOrder: boolean): number {
  return showStrokeOrder
    ? WORKSHEET_ENTRIES_PER_STROKE_PAGE
    : WORKSHEET_ENTRIES_PER_PAGE;
}
