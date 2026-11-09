import radicalData from "./radicals-data.json";
import pinyinData from "./pinyin-guides-data.json";
import chartData from "./pinyin-chart-data.json";
import type { WorksheetEntry } from "./types";

export interface LearningExample { character: string; pinyin: string; meaning: string }
export interface Radical {
  id: number; glyph: string; pinyin: string; meaning: string; strokes: number;
  variants: string; examples: LearningExample[]; slug?: string;
  shape?: string; usage?: string; practice?: string; componentSlug?: string;
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
  return radicals.find(r => r.glyph === glyph || r.variants.split(" ").includes(glyph));
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
