export interface StrokeOrderExampleWord {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface StrokeOrderCharacter {
  character: "爱" | "年" | "佛";
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
  usageTitle: string;
  usage: string;
  writingTip: string;
  examples: StrokeOrderExampleWord[];
}

export const strokeOrderCharacters: StrokeOrderCharacter[] = [
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
    usageTitle: "Love, preference, and care",
    usage:
      "爱 is used for loving a person, liking an activity, or caring for something. It can stand alone as a verb, and it also combines with other characters to describe affection, hobbies, kindness, and protection.",
    writingTip:
      "Keep the short upper strokes compact and centred beneath the top hook. Leave enough space for 友 at the bottom so its sweeping final stroke can finish the character without crowding the middle.",
    examples: [
      { hanzi: "可爱", pinyin: "kě ài", meaning: "cute; lovely" },
      { hanzi: "爱好", pinyin: "ài hào", meaning: "hobby; interest" },
      { hanzi: "爱情", pinyin: "ài qíng", meaning: "romantic love" },
      { hanzi: "爱护", pinyin: "ài hù", meaning: "to care for; to protect" },
    ],
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
    usageTitle: "Years, dates, and annual events",
    usage:
      "年 names a calendar year or a yearly period. It follows a number when stating a year and appears in everyday time words for the previous, current, or following year, as well as New Year celebrations.",
    writingTip:
      "Keep the three horizontal levels clearly separated and make the middle horizontal stroke the visual anchor. The final vertical stroke should pass through the centre and finish below the lowest horizontal line.",
    examples: [
      { hanzi: "今年", pinyin: "jīn nián", meaning: "this year" },
      { hanzi: "明年", pinyin: "míng nián", meaning: "next year" },
      { hanzi: "去年", pinyin: "qù nián", meaning: "last year" },
      { hanzi: "新年", pinyin: "xīn nián", meaning: "New Year" },
    ],
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
    usageTitle: "Buddhist terms and an alternate reading",
    usage:
      "佛 is usually read fó when it refers to the Buddha, Buddhism, or a Buddhist image or temple. In the common word 仿佛, meaning ‘as if’ or ‘seemingly’, the same character is read fú instead.",
    writingTip:
      "Write the narrow 亻 radical first and keep it close to the taller 弗 component. Let the right side carry most of the width, while aligning both sides along the same visual baseline.",
    examples: [
      { hanzi: "佛教", pinyin: "fó jiào", meaning: "Buddhism" },
      { hanzi: "佛像", pinyin: "fó xiàng", meaning: "Buddha statue" },
      { hanzi: "佛寺", pinyin: "fó sì", meaning: "Buddhist temple" },
      { hanzi: "仿佛", pinyin: "fǎng fú", meaning: "as if; seemingly" },
    ],
  },
];

const strokeOrderCharacterByHanzi = new Map(
  strokeOrderCharacters.map((entry) => [entry.character, entry]),
);

export function getStrokeOrderCharacter(
  character: string,
): StrokeOrderCharacter | undefined {
  return strokeOrderCharacterByHanzi.get(character);
}
