import radicalData from "./radicals-data.json";
import pinyinData from "./pinyin-guides-data.json";
import chartData from "./pinyin-chart-data.json";
import type { WorksheetEntry } from "./types";

export interface LearningExample { character: string; pinyin: string; meaning: string }
export interface Radical {
  id: number; glyph: string; pinyin: string; meaning: string; strokes: number;
  variants: string; examples: LearningExample[]; slug?: string;
  shape?: string; usage?: string; practice?: string; componentSlug?: string;
  readingNote?: string;
}
export const radicals: Radical[] = radicalData;
export const radicalGuides = radicals.filter((r): r is Radical & { slug: string } => Boolean(r.slug));
export const pinyinGuides = pinyinData;
export const pinyinChart = chartData;
export const learningDirectoryPaths = ["/radicals", ...radicalGuides.map(r => `/radicals/${r.slug}`), "/pinyin", ...pinyinGuides.map(p => `/pinyin/${p.slug}`)];
export const radicalTitle = (r: Radical) => `${r.glyph} ${r.meaning[0].toUpperCase()}${r.meaning.slice(1)} Radical: Forms, Examples & Practice`;
export const radicalDescription = (r: Radical) => `Explore Kangxi radical ${r.id}, ${r.glyph} (${r.meaning}), through ${r.examples.map(e => e.character).join(", ")}. Compare its forms and create a worksheet with checked readings.`;
export const pinyinTitle = (p: typeof pinyinGuides[number]) => `${p.slug} Pinyin: Pronunciation, Tones & Character Practice`;
export const pinyinDescription = (p: typeof pinyinGuides[number]) => `Practise Mandarin ${p.slug} with ${p.examples.map(e => `${e.character} (${e.pinyin})`).join(", ")}. Learn the sound, contextual readings and make a character worksheet.`;
export function normalizePinyin(value: string): string {
  return value.toLowerCase().replace(/u:|v/g, "ü").normalize("NFD").replace(/[\u0300\u0301\u0304\u030c]/g, "").normalize("NFC").replace(/[1-5]/g, "").trim();
}
export function findRadical(glyph: string): Radical | undefined {
  if (!glyph.trim()) return undefined;
  return radicals.find(r => r.glyph === glyph || r.variants.split(" ").filter(Boolean).includes(glyph));
}
export function getPinyinGuidesForCharacter(character: string, defaultReading: string) {
  return pinyinGuides.filter(p => p.slug === normalizePinyin(defaultReading) || p.examples.some(e => e.character === character));
}

// Compare an actual shared sound or a stated contrast, rather than arbitrary neighbours.
const pinyinComparisonGroups = [
  ["ai", "mai", "lai"], ["ba", "ma", "da"], ["ben", "ren"],
  ["bu", "du"], ["chi", "shi"], ["de", "di"],
  ["ge", "he"], ["guo", "wo"], ["hao", "he", "hua", "hui"],
  ["ji", "jia", "jin"], ["kan", "ben", "ren"], ["ming", "jin"],
  ["ni", "ji"], ["shui", "shi", "hui"], ["xie", "ji"],
  ["zhong", "shi", "chi"],
];
export function getRelatedPinyinGuides(slug: string) {
  const candidates = new Set(pinyinComparisonGroups.filter(group => group.includes(slug)).flat());
  return pinyinGuides.filter(p => p.slug !== slug && candidates.has(p.slug)).slice(0, 4);
}
export function learningWorksheetEntries(key: unknown): WorksheetEntry[] | undefined {
  if (typeof key !== "string") return undefined;
  const parts = key.split(":");
  if (parts.length !== 2 || !parts[1]) return undefined;
  const [kind, slug] = parts;
  const lesson = kind === "radical" ? radicalGuides.find(r => r.slug === slug) : kind === "pinyin" ? pinyinGuides.find(p => p.slug === slug) : undefined;
  return lesson?.examples.map((e, i) => ({ id: `learning-${kind}-${slug}-${i}`, hanzi: e.character, pinyin: e.pinyin, english: e.meaning.replace(/-/g, " "), status: "complete" }));
}
export function learningWorksheetHref(kind: "radical" | "pinyin", slug: string): string {
  return `/generator?learning=${encodeURIComponent(`${kind}:${slug}`)}`;
}
