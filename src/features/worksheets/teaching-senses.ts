/** Curated everyday teaching senses, separate from the upstream dictionary order.
 * Reviewed 2026-09-23. See VOCABULARY-LICENSE.md for scope and sources.
 * These are defaults for worksheets, not a claim that other senses are invalid.
 */
export const teachingSenses: Readonly<Record<string, { pinyin: string; english: string }>> = {
  "东西": { pinyin: "dōngxi", english: "thing; things; stuff" },
  "先生": { pinyin: "xiānsheng", english: "Mr.; gentleman; sir" },
  "便宜": { pinyin: "piányi", english: "inexpensive; cheap" },
  "妻子": { pinyin: "qīzi", english: "wife" },
  "地方": { pinyin: "dìfang", english: "place" },
  "多少": { pinyin: "duōshao", english: "how many; how much" },
  "意思": { pinyin: "yìsi", english: "meaning; idea" },
  "着": { pinyin: "zhe", english: "particle marking a continuing action or state" },
  "更": { pinyin: "gèng", english: "more; even more" },
};
