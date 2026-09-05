import {
  filterHskCatalog,
  type HskCatalogEntry,
  type HskLevel,
  type HskSystem,
} from "./hsk";

export const publicHskPageSize = 60;

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function getHskPublicEntries(
  system: HskSystem,
  level: HskLevel,
): HskCatalogEntry[] {
  return filterHskCatalog({ system, level });
}

export function filterPublicHskEntries(
  entries: readonly HskCatalogEntry[],
  query: string,
): HskCatalogEntry[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [...entries];

  return entries.filter((entry) =>
    [entry.hanzi, entry.pinyin, entry.english].some((value) =>
      normalizeSearchText(value).includes(normalizedQuery),
    ),
  );
}

export function getVisiblePublicHskEntries(
  entries: readonly HskCatalogEntry[],
  visibleCount: number,
): HskCatalogEntry[] {
  return entries.slice(0, Math.max(0, visibleCount));
}

export function summarizePublicHskEntries(
  entries: readonly HskCatalogEntry[],
): { wordCount: number; uniqueHanziCount: number } {
  const uniqueHanzi = new Set(
    entries.flatMap((entry) =>
      Array.from(entry.hanzi).filter((character) => /\p{Script=Han}/u.test(character)),
    ),
  );

  return {
    wordCount: entries.length,
    uniqueHanziCount: uniqueHanzi.size,
  };
}

export function togglePublicHskSelection(
  current: ReadonlySet<string>,
  id: string,
): Set<string> {
  const next = new Set(current);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function selectVisiblePublicHskEntries(
  current: ReadonlySet<string>,
  entries: readonly Pick<HskCatalogEntry, "id">[],
  limit = 50,
): Set<string> {
  const next = new Set(current);
  entries.slice(0, limit).forEach((entry) => next.add(entry.id));
  return next;
}

export function buildPublicHskWorksheetHref(
  entries: readonly Pick<HskCatalogEntry, "hanzi">[],
  system: HskSystem,
  level: HskLevel,
): string {
  if (entries.length === 0) {
    return `/generator?hskSystem=${system}&hskLevel=${level}`;
  }

  return `/generator?words=${encodeURIComponent(entries.map((entry) => entry.hanzi).join(","))}`;
}
