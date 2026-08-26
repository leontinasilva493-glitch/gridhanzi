import {
  indexableStrokeOrderCharacters,
  type StrokeOrderCharacter,
} from "./stroke-order-characters";

export const DEFAULT_PRACTICE_CHARACTER = "一";

export const practiceGroups = [
  {
    id: "starter",
    label: "Starter 10",
    description: "Simple, useful characters for a first continuous session.",
    characters: ["一", "人", "我", "你", "来", "去", "学", "年", "爱", "牛"],
  },
  {
    id: "everyday",
    label: "Everyday core",
    description: "High-frequency characters that appear across everyday Chinese.",
    characters: ["的", "是", "在", "了", "说", "经"],
  },
  {
    id: "structure",
    label: "Shape builders",
    description: "More complex forms for careful balance and component practice.",
    characters: ["体", "议", "佛"],
  },
] as const;

export type PracticeGroupId = (typeof practiceGroups)[number]["id"];

const practiceCharacterMap = new Map<string, StrokeOrderCharacter>(
  indexableStrokeOrderCharacters.map((entry) => [entry.character, entry]),
);

const HANZI_CHARACTER_PATTERN = /^\p{Script=Han}$/u;

export function isHanziPracticeCharacter(character: string): boolean {
  return HANZI_CHARACTER_PATTERN.test(character);
}

export function getPracticeGroup(id: PracticeGroupId) {
  return practiceGroups.find((group) => group.id === id) ?? practiceGroups[0];
}

export function buildPracticeQueue(
  id: PracticeGroupId,
  firstCharacter?: string,
): string[] {
  const characters: string[] = [...getPracticeGroup(id).characters];
  if (!firstCharacter || !isHanziPracticeCharacter(firstCharacter)) {
    return characters;
  }

  if (!characters.includes(firstCharacter)) {
    return [firstCharacter, ...characters].slice(0, characters.length);
  }

  return [
    firstCharacter,
    ...characters.filter((character) => character !== firstCharacter),
  ];
}

export function getPracticeCharacter(
  character: string,
): StrokeOrderCharacter | undefined {
  return practiceCharacterMap.get(character);
}

export function resolveInitialPracticeCharacter(input?: string): string {
  const character = Array.from(input?.trim() ?? "")[0];
  return character && isHanziPracticeCharacter(character)
    ? character
    : DEFAULT_PRACTICE_CHARACTER;
}

export function getNextPracticeIndex(
  currentIndex: number,
  total: number,
  direction: 1 | -1,
): number {
  if (total < 1) return 0;
  return (currentIndex + direction + total) % total;
}

export function addRecentPracticeCharacter(
  recent: readonly string[],
  character: string,
  limit = 6,
): string[] {
  return [character, ...recent.filter((item) => item !== character)].slice(
    0,
    limit,
  );
}

export function buildPracticeHref(character: string): string {
  return `/practice?character=${encodeURIComponent(character)}`;
}
