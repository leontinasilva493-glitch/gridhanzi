/** Course-specific labels; do not use these as global dictionary replacements. */
export const templateSenses: Readonly<Record<string, Readonly<Record<string, {
  pinyin: string;
  english: string;
}>>>> = {
  "basic-strokes": {
    "点": { pinyin: "diǎn", english: "dot stroke" },
  },
  "stroke-order-practice": {
    "点": { pinyin: "diǎn", english: "dot stroke" },
  },
  greetings: {
    "早": { pinyin: "zǎo", english: "Good morning! (informal greeting)" },
  },
  "school-classroom": {
    "本子": { pinyin: "běnzi", english: "notebook; exercise book" },
    "考试": { pinyin: "kǎoshì", english: "exam; to take an exam" },
  },
};
