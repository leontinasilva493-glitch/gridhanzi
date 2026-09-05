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
  templateSlug: "hsk-1" | "hsk-2" | "hsk-3" | "hsk-4" | "hsk-5" | null;
  featuredCharacters: readonly string[];
  highlights?: readonly { title: string; description: string }[];
  challenges?: readonly { title: string; guidance: string }[];
  practiceBrief?: {
    title: string;
    description: string;
    sampleTerms: readonly string[];
  };
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
  {
    system: "2.0",
    level: "4",
    title: "HSK 2.0 Level 4 Vocabulary List",
    description: "Study HSK 2.0 Level 4 vocabulary by Hanzi, Pinyin, English and topic, then select connected words for printable intermediate writing practice.",
    heading: "HSK 2.0 Level 4 vocabulary",
    eyebrow: "Classic intermediate bridge",
    intro: "Level 4 is where the classic HSK list stops feeling like a phrasebook. Connectors, attitudes, workplace language, and more precise descriptions begin carrying a full conversation or short written account.",
    focus: "Build clusters around a claim and its support rather than memorizing alphabetically. Words such as 不仅, 不但, 不管, 不过, 也许, and 于是 become useful when you practise the relationship they create between two clauses.",
    studyPlan: ["Collect connectors by the logical job they perform.", "Write one personal example before copying a second model.", "Mix concrete nouns with abstract verbs in recall practice."],
    templateSlug: "hsk-4",
    featuredCharacters: [],
    highlights: [
      { title: "Connected explanations", description: "Move from short statements to reasons, contrasts, conditions, and consequences." },
      { title: "Wider everyday range", description: "Discuss study, work, travel, health, media, and relationships with greater precision." },
      { title: "Phrase-level handwriting", description: "Practise two- to four-character chunks so function words stay attached to their partners." },
    ],
    challenges: [
      { title: "Near-synonymous connectors", guidance: "Record the sentence pattern beside each connector; translation alone hides its position and partner." },
      { title: "Neutral-tone endings", guidance: "Keep the written word intact while marking where spoken stress becomes lighter." },
      { title: "Formal-looking compounds", guidance: "Check whether a word belongs in conversation, a notice, or a more formal paragraph before reusing it." },
    ],
    practiceBrief: { title: "Build a connected paragraph", description: "Use a claim, a contrast, and a conclusion so every selected item has a job in one short text.", sampleTerms: ["一切", "不仅", "严格", "也许"] },
  },
  {
    system: "2.0",
    level: "5",
    title: "HSK 2.0 Level 5 Vocabulary List",
    description: "Explore HSK 2.0 Level 5 words for media, work and abstract discussion, with searchable meanings and configurable Chinese writing worksheets.",
    heading: "HSK 2.0 Level 5 vocabulary",
    eyebrow: "Reading beyond daily transactions",
    intro: "The classic Level 5 list opens the vocabulary of articles, interviews, professional life, and extended opinions. Many entries are familiar characters recombined into less predictable meanings.",
    focus: "Study collocations and register together. A word such as 一旦 sets up a condition, while 不见得 softens a judgment; copying them without the surrounding pattern makes both harder to retrieve accurately.",
    studyPlan: ["Save one authentic collocation with every abstract word.", "Separate spoken reactions from formal written transitions.", "Alternate character recall with a short summary task."],
    templateSlug: "hsk-5",
    featuredCharacters: [],
    highlights: [
      { title: "Media and workplace language", description: "Recognize words used in reports, interviews, instructions, and professional exchanges." },
      { title: "Abstract stance", description: "Express probability, evaluation, consequence, and attitude without relying on a basic adjective." },
      { title: "Reusable collocations", description: "Learn which verbs, nouns, and complements repeatedly travel together in formal Chinese." },
    ],
    challenges: [
      { title: "Literal character guesses", guidance: "Treat the whole compound as the learning unit when its meaning is not the sum of its characters." },
      { title: "Register mismatch", guidance: "Label items as conversational, neutral, or formal so a correct word does not sound misplaced." },
      { title: "Longer visual forms", guidance: "Break dense characters into stable left-right or top-bottom zones before writing from memory." },
    ],
    practiceBrief: { title: "Summarise an article", description: "Choose words for a condition, an action, a comparison, and a conclusion, then write a four-sentence summary.", sampleTerms: ["一旦", "下载", "不如", "专心"] },
  },
  {
    system: "2.0",
    level: "6",
    title: "HSK 2.0 Level 6 Vocabulary List",
    description: "Search the HSK 2.0 Level 6 vocabulary list, study advanced collocations and idioms, and create focused handwriting and recall worksheets.",
    heading: "HSK 2.0 Level 6 vocabulary",
    eyebrow: "Classic advanced reading range",
    intro: "Level 6 combines formal vocabulary, compact idiomatic expressions, and low-frequency distinctions needed for dense news, essays, literature, and professional discussion.",
    focus: "Do not give every entry equal practice time. Separate words you only need to recognize from expressions you intend to write, and capture the tone or rhetorical effect of four-character forms alongside their definitions.",
    studyPlan: ["Rank items by recognition, active use, and handwriting need.", "Learn idioms through a situation, not a word-for-word gloss.", "Review visually similar characters in mixed rather than blocked sets."],
    templateSlug: null,
    featuredCharacters: [],
    highlights: [
      { title: "Idiomatic compression", description: "Interpret four-character expressions as complete rhetorical units with a specific tone." },
      { title: "Formal precision", description: "Distinguish close verbs and nouns that divide academic, legal, economic, and social topics." },
      { title: "Selective production", description: "Choose a smaller active-writing set while keeping the wider list available for recognition." },
    ],
    challenges: [
      { title: "Rare senses", guidance: "Confirm the sense used in the target expression instead of memorizing the first English gloss in isolation." },
      { title: "Idiom overuse", guidance: "Record the situation and tone; an idiom can be correct in meaning but unnatural in a casual sentence." },
      { title: "Character density", guidance: "Mark the component that distinguishes a difficult character from its closest visual neighbor." },
    ],
    practiceBrief: { title: "Argue with controlled register", description: "Select two formal transitions and two idiomatic expressions, then decide which belong in an essay and which only in recognition review.", sampleTerms: ["一丝不苟", "一举两得", "一如既往", "不可思议"] },
  },
  {
    system: "3.0",
    level: "4",
    title: "HSK 3.0 Level 4 Vocabulary List",
    description: "Browse HSK 3.0 Level 4 vocabulary with Hanzi, Pinyin, English and usage-focused study notes, then make a custom writing worksheet.",
    heading: "HSK 3.0 Level 4 vocabulary",
    eyebrow: "Modern intermediate independence",
    intro: "HSK 3.0 Level 4 expands the learner's range from familiar routines to independent explanations about choices, work, public life, and changing situations.",
    focus: "Use the list to practise how an idea develops across sentences. Pair stance words with evidence, time expressions with change verbs, and formal compounds with the everyday phrase you would otherwise use.",
    studyPlan: ["Organize a set around one real communicative task.", "Contrast the formal item with its everyday alternative.", "Finish with a timed phrase-to-character recall pass."],
    templateSlug: "hsk-4",
    featuredCharacters: [],
    highlights: [
      { title: "Independent narration", description: "Explain changes, causes, plans, and outcomes without staying inside memorized dialogues." },
      { title: "Public-life vocabulary", description: "Work with terms for services, organizations, media, transport, and social situations." },
      { title: "Controlled comparison", description: "Choose between related adverbs and connectors according to emphasis and sentence position." },
    ],
    challenges: [
      { title: "Version confusion", guidance: "Keep HSK 3.0 labels separate from the older six-level list; the same word may sit at another level there." },
      { title: "Productive word order", guidance: "Copy the full frame around an adverb or complement before trying to write a new sentence." },
      { title: "Too many new compounds", guidance: "Reuse familiar characters to group words by family, then test the whole word rather than each character." },
    ],
    practiceBrief: { title: "Describe a change", description: "Build a short before-and-after account using repetition, consistency, a digital action, and a consequence.", sampleTerms: ["一再", "一律", "下载", "严重"] },
  },
  {
    system: "3.0",
    level: "5",
    title: "HSK 3.0 Level 5 Vocabulary List",
    description: "Study HSK 3.0 Level 5 vocabulary for extended reading and discussion, with searchable entries, learning contrasts and printable practice.",
    heading: "HSK 3.0 Level 5 vocabulary",
    eyebrow: "Nuanced intermediate expression",
    intro: "Level 5 adds the language needed to sustain an argument, describe reactions precisely, and move between personal experience and broader social or professional topics.",
    focus: "Notice scale and duration. Expressions such as 一下子, 一口气, 一向, and 一辈子 all shape time differently; a useful practice set makes those differences visible instead of filing them together under one English word.",
    studyPlan: ["Group time and degree expressions by the contrast they encode.", "Attach an abstract noun to the verb that naturally selects it.", "Rewrite one paragraph from neutral to more formal Chinese."],
    templateSlug: "hsk-5",
    featuredCharacters: [],
    highlights: [
      { title: "Time and degree nuance", description: "Control suddenness, continuity, frequency, duration, and strength more precisely." },
      { title: "Extended viewpoints", description: "Support opinions with causes, qualifications, examples, and concessions." },
      { title: "Formal paraphrase", description: "Replace a basic phrase with a concise neutral or formal expression when the context needs it." },
    ],
    challenges: [
      { title: "Similar time phrases", guidance: "Draw a small timeline and mark whether an expression describes a point, span, habit, or abrupt change." },
      { title: "Abstract collocations", guidance: "Learn the noun and its preferred verb together; a direct translation often permits combinations Chinese does not." },
      { title: "Passive recognition", guidance: "Move only a selected group into handwriting practice instead of trying to actively produce the whole level at once." },
    ],
    practiceBrief: { title: "Control the timeline", description: "Write one account that contrasts a sudden action, sustained effort, a long-standing habit, and a life-long commitment.", sampleTerms: ["一下子", "一口气", "一旦", "一辈子"] },
  },
  {
    system: "3.0",
    level: "6",
    title: "HSK 3.0 Level 6 Vocabulary List",
    description: "Explore HSK 3.0 Level 6 words for formal and professional communication, with Pinyin, meanings, character links and worksheet practice.",
    heading: "HSK 3.0 Level 6 vocabulary",
    eyebrow: "Upper-intermediate precision",
    intro: "HSK 3.0 Level 6 moves into denser professional, institutional, and cultural language while still expecting the learner to control ordinary speech with accuracy.",
    focus: "Practise shifts in register deliberately. Compare the wording of a conversation, a report, and an announcement, then choose a small handwriting set containing the characters most likely to slow down real writing.",
    studyPlan: ["Tag each word by context: spoken, neutral, professional, or literary.", "Study one morphology family across several compounds.", "Draft, check, and rewrite a short formal notice."],
    templateSlug: null,
    featuredCharacters: ["佛"],
    highlights: [
      { title: "Institutional language", description: "Read and write about organizations, policy, markets, public services, and professional roles." },
      { title: "Register switching", description: "Recognize when a concise formal term should replace a longer everyday explanation." },
      { title: "Morphological families", description: "Use repeated characters and components to organize a growing network of related compounds." },
    ],
    challenges: [
      { title: "Proper names and special readings", guidance: "Check whether capitalization or an alternate pronunciation marks a name, transcription, or fixed expression." },
      { title: "Written-style verbs", guidance: "Save an example subject and object so the verb's real argument pattern stays visible." },
      { title: "Dense character forms", guidance: "Select the hardest component transitions for tracing instead of repeatedly copying the easiest part." },
    ],
    practiceBrief: { title: "Rewrite for a formal audience", description: "Turn a casual update into a concise workplace notice while preserving time, consistency, and responsibility.", sampleTerms: ["一代", "一模一样", "一贯", "上班族"] },
  },
  {
    system: "3.0",
    level: "7-9",
    title: "HSK 3.0 Level 7-9 Vocabulary List",
    description: "Search HSK 3.0 Levels 7-9 vocabulary for advanced academic and professional reading, then build a selective Chinese writing review sheet.",
    heading: "HSK 3.0 Levels 7–9 vocabulary",
    eyebrow: "Advanced academic and professional range",
    intro: "The combined advanced band spans specialized argument, public affairs, literature, research, and idiomatic expression. Its size makes selective study more useful than treating it as one undifferentiated checklist.",
    focus: "Create separate recognition and production queues. Prioritize terms from your own field, record source sentences for idioms and technical language, and send only the characters you genuinely need to write into a worksheet.",
    studyPlan: ["Filter by a real reading or professional domain.", "Record provenance and register for specialized expressions.", "Build a weekly active-writing set of no more than twenty items."],
    templateSlug: null,
    featuredCharacters: ["经", "议"],
    highlights: [
      { title: "Domain selection", description: "Narrow the large band to academic, professional, literary, media, or public-affairs vocabulary." },
      { title: "Idiomatic control", description: "Learn fixed expressions with rhetorical force, source context, and restrictions on use." },
      { title: "Recognition-production split", description: "Maintain broad reading coverage while deliberately choosing a much smaller writing inventory." },
    ],
    challenges: [
      { title: "False productivity", guidance: "Knowing every character does not guarantee the compound is natural; preserve the attested phrase and context." },
      { title: "Domain-bound meanings", guidance: "A familiar-looking word may carry a technical sense in law, economics, science, or criticism." },
      { title: "Overloaded review", guidance: "Do not print thousands of items; filter by purpose and cap each active worksheet at a usable session size." },
    ],
    practiceBrief: { title: "Curate an advanced writing set", description: "Choose four expressions with different rhetorical jobs, verify their contexts, and explain why each belongs in active or recognition-only study.", sampleTerms: ["一举一动", "一塌糊涂", "一声不吭", "一应俱全"] },
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
  const level = levelSegment.match(/^level-(1|2|3|4|5|6|7-9)$/)?.[1];
  return system && level ? getHskPublicPage(system, level) : undefined;
}
