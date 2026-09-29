import type { StrokeOrderCharacter } from "./stroke-order-characters";

export type StrokeOrderDictionaryEntry = Pick<
  StrokeOrderCharacter,
  "character" | "pinyin" | "meaning" | "radical" | "strokes"
>;

export type StrokeOrderDictionaryFilters = {
  query: string;
  radical: string;
  strokes: number | null;
};

export function toStrokeOrderDictionaryEntries(
  guides: readonly StrokeOrderCharacter[],
): StrokeOrderDictionaryEntry[] {
  return guides
    .map(({ character, pinyin, meaning, radical, strokes }) => ({
      character,
      pinyin,
      meaning,
      radical,
      strokes,
    }))
    .sort((left, right) =>
      normalizeSearch(left.pinyin).localeCompare(normalizeSearch(right.pinyin), "en") ||
      left.character.localeCompare(right.character, "zh-Hans"),
    );
}

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function filterStrokeOrderDictionary(
  entries: readonly StrokeOrderDictionaryEntry[],
  { query, radical, strokes }: StrokeOrderDictionaryFilters,
): StrokeOrderDictionaryEntry[] {
  const needle = normalizeSearch(query);
  return entries.filter((entry) => {
    if (radical && entry.radical !== radical) return false;
    if (strokes !== null && entry.strokes !== strokes) return false;
    if (!needle) return true;
    return [entry.character, entry.pinyin, entry.meaning].some((value) =>
      normalizeSearch(value).includes(needle),
    );
  });
}

export function getStrokeOrderDictionaryFacets(entries: readonly StrokeOrderDictionaryEntry[]) {
  return {
    radicals: Array.from(new Set(entries.map((entry) => entry.radical))).sort((left, right) =>
      left.localeCompare(right, "zh-Hans"),
    ),
    strokeCounts: Array.from(new Set(entries.map((entry) => entry.strokes))).sort((left, right) => left - right),
  };
}
