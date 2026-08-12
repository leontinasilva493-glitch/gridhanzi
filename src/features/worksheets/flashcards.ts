import type { WorksheetEntry } from "./types";

export function paginateFlashcards(
  entries: WorksheetEntry[],
  perPage: 6 | 9,
): WorksheetEntry[][] {
  if (entries.length === 0) {
    return [];
  }

  return Array.from(
    { length: Math.ceil(entries.length / perPage) },
    (_, index) => entries.slice(index * perPage, (index + 1) * perPage),
  );
}
