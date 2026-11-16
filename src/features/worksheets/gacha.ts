import cards from "./gacha-cards.json";
import { createWorksheetEntryId } from "./ids";
import type { WorksheetEntry } from "./types";

export const GACHA_HANDOFF_KEY = "gridhanzi:gacha:handoff:v1";
export const GACHA_SELECTION_KEY = "gridhanzi:gacha:selection:v1";
export const GACHA_COLLECTION_KEY = "gridhanzi:gacha:collection:v1";
export const GACHA_LIMIT = 30;
export const gachaCards = cards;
export type GachaCard = (typeof cards)[number];
export type GachaRarity = "C" | "R" | "SR" | "SSR";

// A fixed, editorial game classification, not a claim about linguistic frequency.
const rarityCharacters: Record<Exclude<GachaRarity, "C">, string> = {
  SSR: "爱学龙福梦心星月山水",
  SR: "猫狗花雨云风雪天地火木金玉鸟鱼马书家国中",
  R: "爸妈哥姐父母你我人太阳春夏秋冬红蓝绿白茶电车"
};
export const rarityWeights: Record<GachaRarity, number> = { C: 8, R: 4, SR: 2, SSR: 1 };
export function getRarity(character: string): GachaRarity {
  for (const rarity of ["SSR", "SR", "R"] as const) {
    if (rarityCharacters[rarity].includes(character)) return rarity;
  }
  return "C";
}

export type Collection = Record<string, number>;
export function parseCollection(raw: string | null): Collection {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const known = new Set(cards.map((card) => card.character));
    return Object.fromEntries(Object.entries(value).filter(([character, count]) => known.has(character) && typeof count === "number" && Number.isSafeInteger(count) && count > 0 && count <= 1000000));
  } catch { return {}; }
}

export function drawCards(pool: readonly GachaCard[], count: number, random = Math.random): GachaCard[] {
  const remaining = [...pool];
  const drawn: GachaCard[] = [];
  while (remaining.length && drawn.length < count) {
    const weights = remaining.map((card) => rarityWeights[getRarity(card.character)]);
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let ticket = Math.max(0, Math.min(0.999999999, random())) * total;
    let index = 0;
    while (index < weights.length - 1 && ticket >= weights[index]) ticket -= weights[index++];
    drawn.push(remaining.splice(index, 1)[0]);
  }
  return drawn;
}

export function cardsToEntries(characters: unknown): WorksheetEntry[] {
  if (!Array.isArray(characters) || characters.length === 0 || characters.length > GACHA_LIMIT) return [];
  const unique = new Set<string>();
  const entries: WorksheetEntry[] = [];
  for (const character of characters) {
    if (typeof character !== "string" || unique.has(character)) return [];
    const card = cards.find((item) => item.character === character);
    if (!card) return [];
    unique.add(character);
    entries.push({ id: createWorksheetEntryId(), hanzi: card.character, pinyin: card.pinyin, english: card.meaning, status: "complete" });
  }
  return entries;
}
