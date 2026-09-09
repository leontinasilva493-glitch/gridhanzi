import { ConverterFactory } from "opencc-js/core";
import * as Cn2t from "opencc-js/preset/cn2t";
import * as T2cn from "opencc-js/preset/t2cn";

import type { CharacterStandard, WorksheetEntry } from "./types";

// Build only the converter actually used. Importing input-validation utilities
// through engine.ts must not eagerly initialize both OpenCC dictionaries.
let toTaiwanTraditional: ReturnType<typeof ConverterFactory> | undefined;
let toSimplified: ReturnType<typeof ConverterFactory> | undefined;

export function parseCharacterStandard(value: unknown): CharacterStandard {
  return value === "traditional-tw" ? value : "simplified";
}

export function convertChineseText(
  value: string,
  from: CharacterStandard,
  to: CharacterStandard,
): string {
  if (!value || from === to) return value;
  if (to === "traditional-tw") {
    toTaiwanTraditional ??= ConverterFactory(...Cn2t.from.cn, ...Cn2t.to.twp);
    return toTaiwanTraditional(value);
  }
  toSimplified ??= ConverterFactory(...T2cn.from.twp, ...T2cn.to.cn);
  return toSimplified(value);
}

export function convertWorksheetEntries(
  entries: readonly WorksheetEntry[],
  from: CharacterStandard,
  to: CharacterStandard,
): WorksheetEntry[] {
  if (from === to) return entries.map((entry) => ({ ...entry }));
  return entries.map((entry) => ({
    ...entry,
    hanzi: convertChineseText(entry.hanzi, from, to),
  }));
}
