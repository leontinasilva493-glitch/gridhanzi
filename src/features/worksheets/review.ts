import type { WorksheetEntry } from "./types";

export const WORKSHEET_EDITOR_SESSION_KEY = "gridhanzi:worksheet:editor-session:v1";

/** Do not trust a stale status flag after a user edits an imported row. */
export function missingWorksheetFields(entry: WorksheetEntry) {
  const missing: Array<"hanzi" | "pinyin" | "english"> = [];
  if (!/\p{Script=Han}/u.test(entry.hanzi)) missing.push("hanzi");
  if (!entry.pinyin.trim()) missing.push("pinyin");
  if (!entry.english.trim()) missing.push("english");
  return missing;
}

export function reviewWorksheetEntries(entries: WorksheetEntry[]) {
  return {
    ready: entries.filter((entry) => missingWorksheetFields(entry).length === 0),
    pending: entries.flatMap((entry, index) => {
      const missing = missingWorksheetFields(entry);
      return missing.length ? [{ entry, index, missing }] : [];
    }),
  };
}
