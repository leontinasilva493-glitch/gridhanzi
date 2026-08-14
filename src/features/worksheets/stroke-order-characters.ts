export interface StrokeOrderExampleWord {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface StrokeOrderExampleSentence {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface StrokeOrderComponent {
  character: string;
  explanation: string;
}

export interface StrokeOrderConfusableCharacter {
  character: string;
  guidance: string;
}

export type StrokeOrderPublicationStatus = "complete" | "draft";

export interface StrokeOrderCharacter {
  character: string;
  pinyin: string;
  meaning: string;
  strokes: number;
  radical: string;
  traditional: string;
  structure: string;
  hsk: Array<{
    system: string;
    level: string;
    note: string;
  }>;
  learningTier: string;
  importance: string;
  components: StrokeOrderComponent[];
  readingNotes: string;
  useNotes: string;
  usageTitle: string;
  usage: string;
  writingTip: string;
  examples: StrokeOrderExampleWord[];
  exampleSentences: StrokeOrderExampleSentence[];
  commonMistake: string;
  confusableCharacter: StrokeOrderConfusableCharacter;
  relatedCharacters: string[];
  publicationStatus: StrokeOrderPublicationStatus;
  seo: {
    title: string;
    description: string;
  };
}

type StrokeOrderPublicationCandidate = Pick<
  StrokeOrderCharacter,
  "publicationStatus"
>;

export function filterIndexableStrokeOrderCharacters<
  T extends StrokeOrderPublicationCandidate,
>(entries: readonly T[]): T[] {
  return entries.filter((entry) => entry.publicationStatus === "complete");
}

const strokeOrderCharacterEntries: StrokeOrderCharacter[] = [
  {
    character: "爱",
    pinyin: "ài",
    meaning: "to love; to like",
    strokes: 10,
    radical: "爫",
    traditional: "愛",
    structure: "Top-bottom",
    hsk: [
      {
        system: "HSK 2.0",
        level: "Level 1",
        note: "A foundation character used to express love, preference, and affection.",
      },
      {
        system: "HSK 3.0",
        level: "Level 1",
        note: "Introduced in beginner vocabulary and early recognition and writing practice.",
      },
    ],
    learningTier: "Foundation",
    importance:
      "爱 is a high-frequency beginner verb that learners need for preferences, family relationships, and everyday opinions.",
    components: [
      {
        character: "爫",
        explanation: "The upper claw-like component sets the compact top of the character.",
      },
      {
        character: "冖",
        explanation: "The cover sits below the top strokes and keeps the middle visually contained.",
      },
      {
        character: "友",
        explanation: "The lower component provides the broad finishing shape and final sweeping stroke.",
      },
    ],
    readingNotes:
      "爱 is read ài with a falling tone. Keep the tone clear in pairs such as 爱好 àihào, where the second character changes the phrase meaning.",
    useNotes:
      "Use 爱 before a person, activity, or thing: 爱家人, 爱音乐, 爱学习. For a regular preference, 喜欢 is often softer than 爱.",
    usageTitle: "Love, preference, and care",
    usage:
      "爱 is used for loving a person, liking an activity, or caring for something. It can stand alone as a verb, and it also combines with other characters to describe affection, hobbies, kindness, and protection.",
    writingTip:
      "Keep the short upper strokes compact and centred beneath the top hook. Leave enough space for 友 at the bottom so its sweeping final stroke can finish the character without crowding the middle.",
    examples: [
      { hanzi: "可爱", pinyin: "kě'ài", meaning: "cute; lovely" },
      { hanzi: "爱好", pinyin: "àihào", meaning: "hobby; interest" },
      { hanzi: "爱情", pinyin: "àiqíng", meaning: "romantic love" },
      { hanzi: "爱护", pinyin: "àihù", meaning: "to care for; to protect" },
    ],
    exampleSentences: [
      {
        hanzi: "我爱我的家人。",
        pinyin: "Wǒ ài wǒ de jiārén.",
        meaning: "I love my family.",
      },
      {
        hanzi: "她很爱看书。",
        pinyin: "Tā hěn ài kàn shū.",
        meaning: "She really likes reading.",
      },
      {
        hanzi: "请爱护小动物。",
        pinyin: "Qǐng àihù xiǎo dòngwù.",
        meaning: "Please care for small animals.",
      },
    ],
    commonMistake:
      "Do not write the bottom 友 too high or too narrow. Its final right-falling stroke needs room below the covered middle section.",
    confusableCharacter: {
      character: "受",
      guidance:
        "爱 and 受 share a similar top, but 爱 has 友 at the bottom. Check for the long final sweep of 友 before choosing 爱.",
    },
    relatedCharacters: ["年", "佛"],
    publicationStatus: "complete",
    seo: {
      title: "爱 (ài) Stroke Order: Meaning, Examples & Writing Guide",
      description:
        "Learn to write 爱 (ài) with stroke order, component notes, HSK context, common words, example sentences, and printable Chinese practice.",
    },
  },
  {
    character: "年",
    pinyin: "nián",
    meaning: "year",
    strokes: 6,
    radical: "干",
    traditional: "年",
    structure: "Top-bottom",
    hsk: [
      {
        system: "HSK 2.0",
        level: "Level 1",
        note: "A core time word used for dates, age, school years, and annual events.",
      },
      {
        system: "HSK 3.0",
        level: "Level 1",
        note: "Appears in beginner time expressions such as this year, next year, and New Year.",
      },
    ],
    learningTier: "Foundation",
    importance:
      "年 anchors essential time vocabulary for calendars, dates, age, school, and Spring Festival conversations.",
    components: [
      {
        character: "丿",
        explanation: "The short opening stroke establishes the left edge before the horizontal structure begins.",
      },
      {
        character: "三横",
        explanation: "Three horizontal levels create the central rhythm and should remain clearly separated.",
      },
      {
        character: "丨",
        explanation: "The final vertical stroke passes through the centre and extends below the lowest horizontal line.",
      },
    ],
    readingNotes:
      "年 is read nián with a rising tone. In dates, it follows the year number: 二〇二六年 èr líng èr liù nián.",
    useNotes:
      "Use 年 for calendar years and yearly periods. Pair it with 今, 明, 去, or 新 for common time expressions, rather than using it alone for a person's age.",
    usageTitle: "Years, dates, and annual events",
    usage:
      "年 names a calendar year or a yearly period. It follows a number when stating a year and appears in everyday time words for the previous, current, or following year, as well as New Year celebrations.",
    writingTip:
      "Keep the three horizontal levels clearly separated and make the middle horizontal stroke the visual anchor. The final vertical stroke should pass through the centre and finish below the lowest horizontal line.",
    examples: [
      { hanzi: "今年", pinyin: "jīnnián", meaning: "this year" },
      { hanzi: "明年", pinyin: "míngnián", meaning: "next year" },
      { hanzi: "去年", pinyin: "qùnián", meaning: "last year" },
      { hanzi: "新年", pinyin: "xīnnián", meaning: "New Year" },
    ],
    exampleSentences: [
      {
        hanzi: "我今年学中文。",
        pinyin: "Wǒ jīnnián xué Zhōngwén.",
        meaning: "I am studying Chinese this year.",
      },
      {
        hanzi: "明年我们去北京。",
        pinyin: "Míngnián wǒmen qù Běijīng.",
        meaning: "We are going to Beijing next year.",
      },
      {
        hanzi: "新年快乐！",
        pinyin: "Xīnnián kuàilè!",
        meaning: "Happy New Year!",
      },
    ],
    commonMistake:
      "Do not compress the three horizontal strokes into one dark block. Keep each level distinct and run the final vertical through the centre, not beside it.",
    confusableCharacter: {
      character: "午",
      guidance:
        "年 and 午 both have horizontal strokes and a central vertical. 年 has three horizontal levels and a longer, more layered top; 午 has a simpler two-level form.",
    },
    relatedCharacters: ["爱", "佛"],
    publicationStatus: "complete",
    seo: {
      title: "年 (nián) Stroke Order: Year Meaning & Writing Guide",
      description:
        "Practise writing 年 (nián), meaning year, with stroke order, component guidance, HSK context, calendar vocabulary, and example sentences.",
    },
  },
  {
    character: "佛",
    pinyin: "fó",
    meaning: "Buddha; Buddhist",
    strokes: 7,
    radical: "亻",
    traditional: "佛",
    structure: "Left-right",
    hsk: [
      {
        system: "HSK 3.0",
        level: "Levels 7–9",
        note: "The standalone character belongs to the advanced vocabulary band, while 仿佛 is commonly encountered earlier.",
      },
    ],
    learningTier: "Advanced extension",
    importance:
      "佛 introduces a high-value reading contrast: the religious reading fó and the common word 仿佛, where it is read fú.",
    components: [
      {
        character: "亻",
        explanation: "The person radical is written first, kept narrow, and signals a character related to a person or figure.",
      },
      {
        character: "弗",
        explanation: "The right component carries most of the width and contains the longer central vertical structure.",
      },
    ],
    readingNotes:
      "佛 is usually fó for Buddha or Buddhism. In 仿佛 fǎngfú, the same written character is read fú, so read the whole word rather than assigning fó automatically.",
    useNotes:
      "Use 佛 in Buddhist terms such as 佛教 and 佛寺. Treat 仿佛 as a fixed adverb meaning 'as if' or 'seemingly', not as a phrase about Buddhism.",
    usageTitle: "Buddhist terms and an alternate reading",
    usage:
      "佛 is usually read fó when it refers to the Buddha, Buddhism, or a Buddhist image or temple. In the common word 仿佛, meaning 'as if' or 'seemingly', the same character is read fú instead.",
    writingTip:
      "Write the narrow 亻 radical first and keep it close to the taller 弗 component. Let the right side carry most of the width, while aligning both sides along the same visual baseline.",
    examples: [
      { hanzi: "佛教", pinyin: "Fójiào", meaning: "Buddhism" },
      { hanzi: "佛像", pinyin: "fóxiàng", meaning: "Buddha statue" },
      { hanzi: "佛寺", pinyin: "fósì", meaning: "Buddhist temple" },
      { hanzi: "仿佛", pinyin: "fǎngfú", meaning: "as if; seemingly" },
    ],
    exampleSentences: [
      {
        hanzi: "这座佛寺很安静。",
        pinyin: "Zhè zuò fósì hěn ānjìng.",
        meaning: "This Buddhist temple is very quiet.",
      },
      {
        hanzi: "博物馆里有一尊佛像。",
        pinyin: "Bówùguǎn lǐ yǒu yì zūn fóxiàng.",
        meaning: "There is a Buddha statue in the museum.",
      },
      {
        hanzi: "远处的山仿佛在云里。",
        pinyin: "Yuǎnchù de shān fǎngfú zài yún lǐ.",
        meaning: "The distant mountains seem to be in the clouds.",
      },
    ],
    commonMistake:
      "Do not make 亻 as wide as 弗. Keep the left radical narrow, and avoid losing the interior horizontal strokes on the right component.",
    confusableCharacter: {
      character: "费",
      guidance:
        "佛 and 费 both contain 弗, but 佛 has the left-side person radical 亻. Look for that separate narrow left component before reading or writing the character.",
    },
    relatedCharacters: ["爱", "年"],
    publicationStatus: "complete",
    seo: {
      title: "佛 (fó) Stroke Order: Readings, Meaning & Writing Guide",
      description:
        "Learn 佛 (fó) stroke order with Buddhist vocabulary, the alternate fú reading in 仿佛, component notes, example sentences, and writing practice.",
    },
  },
];

export const indexableStrokeOrderCharacters =
  filterIndexableStrokeOrderCharacters(strokeOrderCharacterEntries);

// Existing consumers keep this stable name; it is intentionally publication-filtered.
export const strokeOrderCharacters = indexableStrokeOrderCharacters;

const strokeOrderCharacterByHanzi = new Map<string, StrokeOrderCharacter>(
  indexableStrokeOrderCharacters.map((entry) => [entry.character, entry]),
);

export function getStrokeOrderCharacter(
  character: string,
): StrokeOrderCharacter | undefined {
  try {
    return strokeOrderCharacterByHanzi.get(decodeURIComponent(character));
  } catch {
    return undefined;
  }
}
