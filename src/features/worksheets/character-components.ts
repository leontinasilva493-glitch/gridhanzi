export type CharacterComponentKind = "meaning" | "sound";

export interface CharacterComponentExample {
  character: string;
  pinyin: string;
  meaning: string;
  clue: string;
  guideCharacter?: string;
}

export interface CharacterComponentPage {
  slug: string;
  glyph: string;
  name: string;
  pinyin: string;
  kind: CharacterComponentKind;
  title: string;
  description: string;
  heading: string;
  intro: string;
  formation: string;
  reliability: string;
  writingTips: readonly string[];
  examples: readonly CharacterComponentExample[];
  practicePrompt: string;
}

export const characterComponentPages: readonly CharacterComponentPage[] = [
  {
    slug: "water-shui",
    glyph: "氵",
    name: "Water component",
    pinyin: "shuǐ",
    kind: "meaning",
    title: "氵 Water Component: Meaning, Hanzi & Writing",
    description: "Learn how the 氵 water component works in 河, 海, 洗, 没, 酒 and 清, with meaning clues, position tips, stroke order and worksheet practice.",
    heading: "氵: the water meaning component",
    intro: "Three small strokes can connect a river, the sea, washing, liquid, and clarity. 氵 is the left-side form of 水, compressed so another component can carry sound or add a more specific meaning on the right.",
    formation: "The full character 水 becomes 氵 when it occupies the narrow left column. Its dot, rising stroke, and lower falling stroke form a vertical rhythm; they are not three identical dots.",
    reliability: "氵 is a useful semantic clue, not a complete definition. It often points toward water, liquid, washing, flow, or a quality once described through water, but words such as 没 have developed grammatical meanings that the component alone cannot predict.",
    writingTips: ["Keep all three strokes inside a narrow left column.", "Let the middle rising stroke aim toward the right component without touching it.", "Place the lowest stroke far enough down to support, not crowd, the character."],
    examples: [
      { character: "河", pinyin: "hé", meaning: "river", clue: "Water category plus 可 as a sound clue." },
      { character: "海", pinyin: "hǎi", meaning: "sea", clue: "A large body of water; 每 contributes sound history." },
      { character: "洗", pinyin: "xǐ", meaning: "to wash", clue: "An action normally performed with water." },
      { character: "没", pinyin: "méi", meaning: "not have; not", clue: "The modern grammar meaning is not transparent from water.", guideCharacter: "没" },
      { character: "酒", pinyin: "jiǔ", meaning: "alcohol", clue: "A liquid category word with 酉 on the right." },
      { character: "清", pinyin: "qīng", meaning: "clear; clean", clue: "Water meaning plus 青 as the sound family." },
    ],
    practicePrompt: "Sort 河, 洗, 没, and 清 into literal-water and extended-meaning groups, then print the pair whose left column is hardest to balance.",
  },
  {
    slug: "person-ren",
    glyph: "亻",
    name: "Person component",
    pinyin: "rén",
    kind: "meaning",
    title: "亻 Person Component: Meaning, Hanzi & Writing",
    description: "Understand the 亻 person component in 你, 他, 们, 住, 做 and 休, including its narrow shape, human meaning clues and printable Hanzi practice.",
    heading: "亻: the person meaning component",
    intro: "亻 is 人 standing at the left edge of a larger character. It frequently marks people, roles, behavior, identity, or an action understood through what a person does.",
    formation: "人 uses two spreading strokes as a whole character. At the left, 亻 keeps the first falling stroke upright and the second stroke vertical so the right component receives most of the square.",
    reliability: "The human connection can be direct, as in 你 and 他, or historical and less obvious, as in 住. Use 亻 to form a question about the character's category, then confirm the whole word instead of inventing a meaning from the component.",
    writingTips: ["Start high with a short left-falling stroke.", "Keep the second stroke vertical rather than turning it into the spreading right stroke of 人.", "Leave roughly two-thirds of the square for the right component."],
    examples: [
      { character: "你", pinyin: "nǐ", meaning: "you", clue: "A person pronoun with 尔 on the right.", guideCharacter: "你" },
      { character: "他", pinyin: "tā", meaning: "he; him", clue: "A person pronoun using 也 as its sound family." },
      { character: "们", pinyin: "men", meaning: "plural marker for people", clue: "Attaches to human pronouns and some human nouns." },
      { character: "住", pinyin: "zhù", meaning: "to live; stay", clue: "A human action with 主 contributing the sound." },
      { character: "做", pinyin: "zuò", meaning: "to do; make", clue: "An action performed by a person." },
      { character: "休", pinyin: "xiū", meaning: "to rest", clue: "A person beside 木 creates a memorable meaning pattern." },
    ],
    practicePrompt: "Compare 人 and 亻 first, then write 你, 他, and 住 while keeping the left component identical in width across all three characters.",
  },
  {
    slug: "hand-shou",
    glyph: "扌",
    name: "Hand component",
    pinyin: "shǒu",
    kind: "meaning",
    title: "扌 Hand Component: Action Hanzi & Writing",
    description: "Learn the 扌 hand component through 打, 找, 推, 拉, 抱 and 提, with action clues, left-side proportions, common limits and writing practice.",
    heading: "扌: the hand and action component",
    intro: "扌 packages a physical hand into a compact left-side signal. It appears in many verbs for striking, searching, pushing, pulling, holding, lifting, and manipulating an object.",
    formation: "手 changes to 扌 on the left. The horizontal, vertical hook, and rising stroke interlock tightly; the final rising stroke points into the character without becoming a fourth stroke.",
    reliability: "扌 strongly suggests a hand-related action, yet the modern action may be abstract or idiomatic. 找 is not understood by translating each component separately, and 打 covers far more than physically hitting something.",
    writingTips: ["Keep the horizontal short so it does not invade the right side.", "Let the vertical hook establish a firm narrow spine.", "Finish with a rising stroke that stops before the neighboring component."],
    examples: [
      { character: "打", pinyin: "dǎ", meaning: "to hit; do; make", clue: "A broad family of hand actions." },
      { character: "找", pinyin: "zhǎo", meaning: "to look for", clue: "An action verb whose full meaning must be learned as a word." },
      { character: "推", pinyin: "tuī", meaning: "to push", clue: "A direct physical hand action." },
      { character: "拉", pinyin: "lā", meaning: "to pull", clue: "A direct action, opposite to pushing in many contexts." },
      { character: "抱", pinyin: "bào", meaning: "to hold; hug", clue: "Hands or arms hold something close." },
      { character: "提", pinyin: "tí", meaning: "to lift; mention", clue: "The physical action extends to an abstract speaking sense." },
    ],
    practicePrompt: "Pair 推 with 拉 and 抱 with 提. Say the action before writing it so the component becomes a retrieval clue, not decorative vocabulary trivia.",
  },
  {
    slug: "mouth-kou",
    glyph: "口",
    name: "Mouth component",
    pinyin: "kǒu",
    kind: "meaning",
    title: "口 Mouth Component: Speech, Food & Sound Hanzi",
    description: "Explore the 口 mouth component in 吃, 喝, 叫, 听, 唱 and 味, with speech and food meaning clues, square proportions and writing practice.",
    heading: "口: the mouth meaning component",
    intro: "口 can point to speaking, calling, singing, eating, drinking, taste, or an opening. Unlike the enclosure 囗, it is a small component with its own three-stroke square.",
    formation: "Write the vertical-turn first, add the inner/right vertical, and close with the baseline. When 口 sits on the left, it becomes smaller and higher so the sound-bearing right component can dominate.",
    reliability: "The mouth category is often easy to notice, but it does not reveal pronunciation and it can mark sound or an opening rather than a literal mouth. Always distinguish the small 口 from the full enclosure 囗.",
    writingTips: ["Use three strokes; do not draw a one-stroke box.", "Keep a left-side 口 compact and slightly above center.", "Close the baseline cleanly without extending it into the next component."],
    examples: [
      { character: "吃", pinyin: "chī", meaning: "to eat", clue: "A direct mouth and food action.", guideCharacter: "吃" },
      { character: "喝", pinyin: "hē", meaning: "to drink", clue: "A direct mouth and drink action.", guideCharacter: "喝" },
      { character: "叫", pinyin: "jiào", meaning: "to call; be called", clue: "The mouth marks a vocal action." },
      { character: "听", pinyin: "tīng", meaning: "to listen", clue: "The simplified form retains 口 although listening uses the ear." },
      { character: "唱", pinyin: "chàng", meaning: "to sing", clue: "A vocal action with 昌 contributing sound." },
      { character: "味", pinyin: "wèi", meaning: "taste; flavor", clue: "A mouth-related sense with 未 contributing sound." },
    ],
    practicePrompt: "Write 吃, 喝, 叫, and 唱 as a speech-and-food set, checking that every left-side 口 has the same compact height and three-stroke order.",
  },
  {
    slug: "qing-phonetic",
    glyph: "青",
    name: "Qing sound family",
    pinyin: "qīng",
    kind: "sound",
    title: "青 Qing Phonetic Family: 清, 请, 情, 晴 & More",
    description: "Use 青 as a Chinese phonetic clue across 清, 请, 情, 晴, 精 and 静, while learning tone shifts, meaning components and focused writing practice.",
    heading: "青: a productive qing sound family",
    intro: "青 does more than contribute its own meaning of blue-green or youth. Inside a larger character it often supplies a qing-like sound while the other component points toward water, speech, feeling, weather, or another meaning field.",
    formation: "In 清, 请, and 情, the left component changes the semantic category while 青 keeps the large right-hand form. In 晴, 日 occupies the left; in 精, 米 does. 静 adds 争 and shows a less transparent structure and shifted pronunciation.",
    reliability: "A phonetic component predicts a sound neighborhood, not an exact modern syllable and tone. 清 qīng, 请 qǐng, 情 qíng, and 晴 qíng stay close; 精 jīng and 静 jìng show the historical family can shift its initial and tone.",
    writingTips: ["Keep 青 tall enough to align its 月-like lower section.", "When 青 sits on the right, reserve more width for it than for the semantic side component.", "Compare the top horizontal spacing before adding a different left component."],
    examples: [
      { character: "清", pinyin: "qīng", meaning: "clear; clean", clue: "氵 supplies water meaning; 青 supplies the qing sound." },
      { character: "请", pinyin: "qǐng", meaning: "please; to request", clue: "讠 supplies speech meaning; 青 supplies the sound family." },
      { character: "情", pinyin: "qíng", meaning: "feeling; situation", clue: "忄 supplies mind or feeling; 青 supplies sound." },
      { character: "晴", pinyin: "qíng", meaning: "clear weather", clue: "日 supplies sun or weather; 青 supplies sound." },
      { character: "精", pinyin: "jīng", meaning: "essence; refined", clue: "米 supplies a historical meaning clue; the sound has shifted to jing." },
      { character: "静", pinyin: "jìng", meaning: "quiet; still", clue: "A related sound pattern with a changed initial and falling tone." },
    ],
    practicePrompt: "Build two rows: the close qing readings 清请情晴, then the shifted jing readings 精静. Mark tone changes before copying the forms.",
  },
  {
    slug: "ma-phonetic",
    glyph: "马",
    name: "Ma sound family",
    pinyin: "mǎ",
    kind: "sound",
    title: "马 Ma Phonetic Family: 妈, 吗, 码, 骂 & More",
    description: "Learn how 马 carries a ma sound clue through 妈, 吗, 码, 骂, 蚂 and 玛, with tone contrasts, semantic components and printable writing practice.",
    heading: "马: a beginner-friendly ma sound family",
    intro: "The simplified character 马 means horse on its own and becomes an easy sound anchor inside several high-frequency characters. The added component usually tells you whether the word concerns a woman, speech, stone, insects, or jade.",
    formation: "马 usually remains visually recognizable on the right or lower side. 妈, 吗, 码, 蚂, and 玛 change the left semantic component; 骂 places the sound-bearing horse form below two mouths in the simplified character.",
    reliability: "The family keeps the ma syllable unusually well but changes tone and grammatical behavior. 妈 is mā, 吗 is the neutral particle ma, 码 and 蚂 are mǎ, and 骂 is mà. The component cannot choose the tone for you.",
    writingTips: ["Keep a right-side 马 compact enough for the semantic component.", "Preserve the bend and final horizontal instead of flattening the lower form.", "When 马 sits below, as in 骂, center it under the upper component rather than stretching it sideways."],
    examples: [
      { character: "妈", pinyin: "mā", meaning: "mother", clue: "女 gives the meaning category; 马 gives the ma sound." },
      { character: "吗", pinyin: "ma", meaning: "question particle", clue: "口 marks speech; 马 supplies the neutral ma syllable." },
      { character: "码", pinyin: "mǎ", meaning: "code; number", clue: "石 is the semantic component; 马 supplies sound." },
      { character: "骂", pinyin: "mà", meaning: "to scold", clue: "Two mouths sit above the sound-bearing 马 in the simplified form." },
      { character: "蚂", pinyin: "mǎ", meaning: "ant, in 蚂蚁", clue: "虫 supplies the creature category; 马 supplies sound." },
      { character: "玛", pinyin: "mǎ", meaning: "agate, in 玛瑙", clue: "王/玉 supplies the material category; 马 supplies sound." },
    ],
    practicePrompt: "Write 妈吗码骂 as a four-tone contrast. Say mā, ma, mǎ, mà aloud and underline the semantic component that changes each meaning.",
  },
] as const;

export function getCharacterComponentPage(
  slug: string,
): CharacterComponentPage | undefined {
  return characterComponentPages.find((page) => page.slug === slug);
}
