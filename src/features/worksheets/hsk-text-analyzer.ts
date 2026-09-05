import {
  hskCatalog,
  type HskCatalogEntry,
  type HskLevel,
  type HskSystem,
} from "./hsk";

const HAN_CHARACTER = /\p{Script=Han}/u;

export const hskLevelOrder: readonly HskLevel[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7-9",
];

export interface HskTextMatch extends HskCatalogEntry {
  occurrences: number;
}

export interface HskTextAnalysis {
  system: HskSystem;
  totalHanCharacters: number;
  matchedHanCharacters: number;
  coveragePercent: number;
  matchedTerms: HskTextMatch[];
  distribution: Array<{
    level: HskLevel;
    termOccurrences: number;
    uniqueTerms: number;
  }>;
  unclassifiedCharacters: Array<{
    character: string;
    occurrences: number;
  }>;
}

interface HskLookup {
  byHanzi: Map<string, HskCatalogEntry>;
  maxTermLength: number;
}

const lookupBySystem = new Map<HskSystem, HskLookup>();

function getLookup(system: HskSystem): HskLookup {
  const cached = lookupBySystem.get(system);
  if (cached) return cached;

  const byHanzi = new Map<string, HskCatalogEntry>();
  let maxTermLength = 1;
  for (const entry of hskCatalog) {
    if (entry.system !== system) continue;
    const length = Array.from(entry.hanzi).length;
    maxTermLength = Math.max(maxTermLength, length);
    const current = byHanzi.get(entry.hanzi);
    if (
      !current ||
      hskLevelOrder.indexOf(entry.level) < hskLevelOrder.indexOf(current.level)
    ) {
      byHanzi.set(entry.hanzi, entry);
    }
  }

  const lookup = { byHanzi, maxTermLength };
  lookupBySystem.set(system, lookup);
  return lookup;
}

export function analyzeHskText(
  text: string,
  system: HskSystem,
): HskTextAnalysis {
  const characters = Array.from(text);
  const totalHanCharacters = characters.filter((character) =>
    HAN_CHARACTER.test(character),
  ).length;
  const { byHanzi, maxTermLength } = getLookup(system);
  const matched = new Map<string, HskTextMatch>();
  const unclassified = new Map<string, number>();
  let matchedHanCharacters = 0;

  for (let index = 0; index < characters.length; ) {
    const character = characters[index];
    if (!character || !HAN_CHARACTER.test(character)) {
      index += 1;
      continue;
    }

    let entry: HskCatalogEntry | undefined;
    for (
      let length = Math.min(maxTermLength, characters.length - index);
      length >= 1;
      length -= 1
    ) {
      const candidate = characters.slice(index, index + length).join("");
      entry = byHanzi.get(candidate);
      if (entry) break;
    }

    if (!entry) {
      unclassified.set(character, (unclassified.get(character) ?? 0) + 1);
      index += 1;
      continue;
    }

    const existing = matched.get(entry.id);
    if (existing) existing.occurrences += 1;
    else matched.set(entry.id, { ...entry, occurrences: 1 });

    const termLength = Array.from(entry.hanzi).length;
    matchedHanCharacters += termLength;
    index += termLength;
  }

  const matchedTerms = [...matched.values()];
  const availableLevels = hskLevelOrder.filter(
    (level) => system === "3.0" || level !== "7-9",
  );

  return {
    system,
    totalHanCharacters,
    matchedHanCharacters,
    coveragePercent:
      totalHanCharacters === 0
        ? 0
        : Math.round((matchedHanCharacters / totalHanCharacters) * 1000) / 10,
    matchedTerms,
    distribution: availableLevels.map((level) => {
      const levelTerms = matchedTerms.filter((term) => term.level === level);
      return {
        level,
        termOccurrences: levelTerms.reduce(
          (total, term) => total + term.occurrences,
          0,
        ),
        uniqueTerms: levelTerms.length,
      };
    }),
    unclassifiedCharacters: [...unclassified].map(
      ([unclassifiedCharacter, occurrences]) => ({
        character: unclassifiedCharacter,
        occurrences,
      }),
    ),
  };
}

export function getTermsAboveTarget(
  analysis: HskTextAnalysis,
  targetLevel: HskLevel,
): HskTextMatch[] {
  const targetIndex = hskLevelOrder.indexOf(targetLevel);
  return analysis.matchedTerms.filter(
    (term) => hskLevelOrder.indexOf(term.level) > targetIndex,
  );
}

export function buildHskCheckerWorksheetHref(
  analysis: HskTextAnalysis,
  targetLevel: HskLevel,
): string {
  const words = [
    ...getTermsAboveTarget(analysis, targetLevel).map((term) => term.hanzi),
    ...analysis.unclassifiedCharacters.map((entry) => entry.character),
  ];

  if (words.length === 0) {
    return `/generator?hskSystem=${analysis.system}&hskLevel=${targetLevel}`;
  }

  return `/generator?words=${encodeURIComponent(words.join(","))}`;
}
