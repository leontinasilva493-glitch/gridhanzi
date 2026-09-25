import { defaultWorksheetSettings, type WorksheetEntry, type WorksheetSettings } from "./types";

export const WORKSHEET_EDITOR_SESSION_KEY = "gridhanzi:worksheet:editor-session:v1";

/** Do not trust a stale status flag after a user edits an imported row. */
export function missingWorksheetFields(entry: WorksheetEntry, settings: WorksheetSettings = defaultWorksheetSettings) {
  const missing: Array<"hanzi" | "pinyin" | "english"> = [];
  if (!/\p{Script=Han}/u.test(entry.hanzi)) missing.push("hanzi");
  // A quiz needs a readable clue; writing and learning need only valid Hanzi.
  if (settings.output === "worksheet" && settings.mode === "quiz" &&
      !entry.english.trim() && !(settings.showPinyin && entry.pinyin.trim())) {
    missing.push("english");
  }
  return missing;
}

export function reviewWorksheetEntries(entries: WorksheetEntry[], settings: WorksheetSettings = defaultWorksheetSettings) {
  return {
    ready: entries.filter((entry) => missingWorksheetFields(entry, settings).length === 0),
    pending: entries.flatMap((entry, index) => {
      const missing = missingWorksheetFields(entry, settings);
      return missing.length ? [{ entry, index, missing }] : [];
    }),
    warnings: entries.filter((entry) => !missingWorksheetFields(entry, settings).length && (
      ((settings.output === "flashcards" ? settings.flashcardShowPinyin : settings.showPinyin) && !entry.pinyin.trim()) ||
      ((settings.output === "flashcards" ? settings.flashcardShowEnglish : settings.mode === "trace") && !entry.english.trim())
    )),
  };
}
