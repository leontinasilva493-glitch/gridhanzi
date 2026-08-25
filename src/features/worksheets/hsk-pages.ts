import type { HskLevel, HskSystem } from "./hsk";

export interface HskPublicPage {
  system: HskSystem;
  level: HskLevel;
  title: string;
  description: string;
  heading: string;
  eyebrow: string;
  intro: string;
  focus: string;
  studyPlan: readonly string[];
  templateSlug: "hsk-1" | "hsk-2" | "hsk-3";
  featuredCharacters: readonly string[];
}

export const hskPublicPages: readonly HskPublicPage[] = [
  {
    system: "2.0",
    level: "1",
    title: "HSK 2.0 Level 1 Vocabulary List",
    description: "Study the classic HSK 1 vocabulary list with searchable Hanzi, Pinyin, English meanings, character guides, and printable writing practice.",
    heading: "HSK 2.0 Level 1 vocabulary",
    eyebrow: "Classic beginner syllabus",
    intro: "Start with the compact HSK 2.0 beginner list: everyday people, numbers, places, actions, and question words selected for a manageable first study cycle.",
    focus: "Use this level to build reliable recognition before expanding sentence length. Prioritize accurate tones, balanced character proportions, and short patterns you can reuse immediately.",
    studyPlan: ["Learn 10–15 words by topic.", "Trace unfamiliar characters before writing from memory.", "Finish each set with a mixed recall worksheet."],
    templateSlug: "hsk-1",
    featuredCharacters: ["好", "不", "有", "上", "下", "大", "小", "家", "水", "书"],
  },
  {
    system: "3.0",
    level: "1",
    title: "HSK 3.0 Level 1 Vocabulary List",
    description: "Explore HSK 3.0 Level 1 with searchable beginner vocabulary, Pinyin and English, usage-focused character notes, and custom worksheet practice.",
    heading: "HSK 3.0 Level 1 vocabulary",
    eyebrow: "Broader modern foundation",
    intro: "HSK 3.0 Level 1 starts with a wider foundation than the older syllabus, adding more practical words for routines, descriptions, directions, and classroom communication.",
    focus: "Treat the larger list as several small learning paths. Group words by what you can say with them, then compare near-neighbors such as 在 and 再 before they become habits.",
    studyPlan: ["Filter one real-life theme at a time.", "Pair new verbs with a person or place word.", "Review sound, meaning, and handwriting in separate passes."],
    templateSlug: "hsk-1",
    featuredCharacters: ["没", "吃", "喝", "二", "再", "地", "坏", "来"],
  },
  {
    system: "2.0",
    level: "2",
    title: "HSK 2.0 Level 2 Vocabulary List",
    description: "Review HSK 2.0 Level 2 vocabulary by Hanzi, Pinyin, or English, then turn selected words into focused Chinese writing worksheets.",
    heading: "HSK 2.0 Level 2 vocabulary",
    eyebrow: "Beginner expansion",
    intro: "Level 2 extends the classic foundation with language for schedules, movement, weather, comparison, and everyday needs—useful material for complete short sentences.",
    focus: "Shift from isolated recognition to word partnerships. Study where a word sits in a sentence and record the classifier, complement, or time phrase it commonly attracts.",
    studyPlan: ["Review Level 1 words that appear inside new phrases.", "Practice one sentence pattern across five words.", "Use blank rows only after guided tracing feels stable."],
    templateSlug: "hsk-2",
    featuredCharacters: ["再", "得"],
  },
  {
    system: "3.0",
    level: "2",
    title: "HSK 3.0 Level 2 Vocabulary List",
    description: "Search HSK 3.0 Level 2 vocabulary and study each word through meaning, Pinyin, contrast notes, character links, and printable practice.",
    heading: "HSK 3.0 Level 2 vocabulary",
    eyebrow: "Productive beginner language",
    intro: "HSK 3.0 Level 2 moves beyond survival vocabulary toward describing experiences, making choices, and connecting actions across a short conversation.",
    focus: "Build productive control by sorting words into sentence roles. Pay special attention to 得 after verbs and to high-frequency words whose pronunciation changes by context.",
    studyPlan: ["Search for one grammar role, not only one topic.", "Read examples aloud before copying them.", "Create a small contrast set for every confusing pair."],
    templateSlug: "hsk-2",
    featuredCharacters: ["得"],
  },
  {
    system: "2.0",
    level: "3",
    title: "HSK 2.0 Level 3 Vocabulary List",
    description: "Study HSK 2.0 Level 3 vocabulary with searchable meanings, intermediate usage cues, character breakdowns, and configurable handwriting sheets.",
    heading: "HSK 2.0 Level 3 vocabulary",
    eyebrow: "Intermediate transition",
    intro: "The classic Level 3 list is the bridge from short practical exchanges to connected narration, opinions, and more precise descriptions.",
    focus: "Write for accuracy at the phrase level. Separate characters that share a sound, note which words are formal or conversational, and recycle vocabulary across several contexts.",
    studyPlan: ["Mix new words with familiar sentence frames.", "Use test mode for sound-to-character recall.", "Keep an error list organized by confusion type."],
    templateSlug: "hsk-3",
    featuredCharacters: ["地", "坏"],
  },
  {
    system: "3.0",
    level: "3",
    title: "HSK 3.0 Level 3 Vocabulary List",
    description: "Browse HSK 3.0 Level 3 by Hanzi, Pinyin, and English, with usage distinctions, related guides, and printable recall practice.",
    heading: "HSK 3.0 Level 3 vocabulary",
    eyebrow: "Connected intermediate expression",
    intro: "HSK 3.0 Level 3 broadens the vocabulary needed to explain reasons, sequence events, describe change, and follow longer everyday texts.",
    focus: "Move from collecting translations to choosing the right word under pressure. Compare alternatives, write original sentences, and use spaced mixed review instead of copying one item repeatedly.",
    studyPlan: ["Select 12–20 words around one communicative task.", "Add a contrast note beside ambiguous words.", "Alternate guided practice with timed recall."],
    templateSlug: "hsk-3",
    featuredCharacters: ["牛"],
  },
];

export function getHskPublicPage(
  system: string,
  level: string,
): HskPublicPage | undefined {
  return hskPublicPages.find(
    (page) => page.system === system && page.level === level,
  );
}

export function getHskSystemSlug(system: HskSystem): "2-0" | "3-0" {
  return system === "2.0" ? "2-0" : "3-0";
}

export function getHskPublicPath(
  page: Pick<HskPublicPage, "system" | "level">,
): string {
  return `/hsk/${getHskSystemSlug(page.system)}/level-${page.level}`;
}

export function getHskPublicPageFromRoute(
  systemSegment: string,
  levelSegment: string,
): HskPublicPage | undefined {
  const system = systemSegment === "2-0" ? "2.0" : systemSegment === "3-0" ? "3.0" : undefined;
  const level = levelSegment.match(/^level-(1|2|3)$/)?.[1];
  return system && level ? getHskPublicPage(system, level) : undefined;
}
