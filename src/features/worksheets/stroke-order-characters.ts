export interface StrokeOrderExampleWord {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface StrokeOrderExampleSentence {
  learningLabel: "Starter" | "Developing" | "Stretch";
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
        learningLabel: "Starter",
      },
      {
        hanzi: "她很爱看书。",
        pinyin: "Tā hěn ài kàn shū.",
        meaning: "She really likes reading.",
        learningLabel: "Developing",
      },
      {
        hanzi: "请爱护小动物。",
        pinyin: "Qǐng àihù xiǎo dòngwù.",
        meaning: "Please care for small animals.",
        learningLabel: "Stretch",
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
        learningLabel: "Starter",
      },
      {
        hanzi: "明年我们去北京。",
        pinyin: "Míngnián wǒmen qù Běijīng.",
        meaning: "We are going to Beijing next year.",
        learningLabel: "Developing",
      },
      {
        hanzi: "新年快乐！",
        pinyin: "Xīnnián kuàilè!",
        meaning: "Happy New Year!",
        learningLabel: "Stretch",
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
        learningLabel: "Starter",
      },
      {
        hanzi: "博物馆里有一尊佛像。",
        pinyin: "Bówùguǎn lǐ yǒu yì zūn fóxiàng.",
        meaning: "There is a Buddha statue in the museum.",
        learningLabel: "Developing",
      },
      {
        hanzi: "远处的山仿佛在云里。",
        pinyin: "Yuǎnchù de shān fǎngfú zài yún lǐ.",
        meaning: "The distant mountains seem to be in the clouds.",
        learningLabel: "Stretch",
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

strokeOrderCharacterEntries.push(
  {
    character: "的", pinyin: "de", meaning: "possessive and descriptive particle", strokes: 8, radical: "白", traditional: "的", structure: "Left-right",
    hsk: [{ system: "HSK 2.0", level: "Level 1", note: "Listed as a standalone Level 1 grammar character." }, { system: "HSK 3.0", level: "Level 1", note: "Listed in the local Level 1 catalogue." }], learningTier: "High-frequency",
    importance: "的 connects a description or owner to the noun that follows, so it appears throughout beginner reading, listening, and personal introductions.",
    components: [{ character: "白", explanation: "The left component is the wider visual anchor and should stay upright." }, { character: "勺", explanation: "The right component is compact, with its final dot kept inside the character width." }],
    readingNotes: "The grammatical particle is neutral-tone de. Read 的 as dí in 的确 and dì in 目的; these lexical readings do not replace the everyday particle reading.",
    useNotes: "Use 的 after a modifier or possessor before a noun: 我的书, 红色的包. It marks noun modification and possession rather than joining two independent clauses.", usageTitle: "Possession and noun modification", usage: "的 makes the relationship before a noun easy to see. It can show who owns something, which person is meant, or what quality a thing has. In short familiar phrases it is sometimes omitted, but learners should first practise the clear modifier-plus-的-plus-noun pattern.", writingTip: "Set 白 on the left with clear inner spacing, then make 勺 narrower on the right. Keep the final dot low enough that it does not collide with the hook.",
    examples: [{ hanzi: "我的", pinyin: "wǒ de", meaning: "my" }, { hanzi: "你的", pinyin: "nǐ de", meaning: "your" }, { hanzi: "红色的", pinyin: "hóngsè de", meaning: "red; red-coloured" }, { hanzi: "的确", pinyin: "díquè", meaning: "indeed" }],
    exampleSentences: [{ learningLabel: "Starter", hanzi: "这是我的书。", pinyin: "Zhè shì wǒ de shū.", meaning: "This is my book." }, { learningLabel: "Developing", hanzi: "我喜欢蓝色的杯子。", pinyin: "Wǒ xǐhuan lánsè de bēizi.", meaning: "I like the blue cup." }, { learningLabel: "Stretch", hanzi: "老师问的是谁的笔记本。", pinyin: "Lǎoshī wèn de shì shéi de bǐjìběn.", meaning: "The teacher asked whose notebook it was." }],
    commonMistake: "Do not confuse the small right-side 勺 with a separate character or let its dot drift beyond the right edge.", confusableCharacter: { character: "白", guidance: "白 is the full left component of 的, but 的 adds the compact 勺 shape on its right." }, relatedCharacters: ["我", "你"], publicationStatus: "complete", seo: { title: "的 (de) Stroke Order: Possessive Particle Writing Guide", description: "Learn 的 (de) stroke order, neutral-tone grammar, possessive phrases, vocabulary, graded examples, and writing guidance." },
  },
  {
    character: "一", pinyin: "yī", meaning: "one", strokes: 1, radical: "一", traditional: "一", structure: "Single-component",
    hsk: [{ system: "HSK 2.0", level: "Level 1", note: "Listed as a standalone Level 1 number." }, { system: "HSK 3.0", level: "Level 1", note: "Listed in the local Level 1 catalogue." }], learningTier: "High-frequency",
    importance: "一 is the first number learners write and a building block for dates, quantities, clocks, and many common expressions.",
    components: [{ character: "一", explanation: "The single horizontal stroke is the complete character and should be level, calm, and slightly longer than tall characters' inner horizontals." }],
    readingNotes: "Its dictionary tone is yī. In normal speech it changes to yí before a fourth tone and to yì before a first, second, or third tone; these are tone changes, not three dictionary readings.",
    useNotes: "Use 一 for the number one, a single item, and set phrases such as 一个人. In speech, listen for the following syllable before choosing the usual tone-change pronunciation.", usageTitle: "One and everyday tone changes", usage: "一 names one item and starts many practical counting expressions. It also appears in quantities, dates, classroom instructions, and common phrases. Learn its written form as yī, then practise the predictable spoken tone changes in short words instead of memorising unrelated pronunciations.", writingTip: "Draw one steady horizontal line from left to right. Avoid making it too short, bowed, or heavy at either end.",
    examples: [{ hanzi: "一个", pinyin: "yí ge", meaning: "one; a" }, { hanzi: "一天", pinyin: "yì tiān", meaning: "one day" }, { hanzi: "一起", pinyin: "yìqǐ", meaning: "together" }, { hanzi: "第一", pinyin: "dìyī", meaning: "first" }],
    exampleSentences: [{ learningLabel: "Starter", hanzi: "我有一个苹果。", pinyin: "Wǒ yǒu yí ge píngguǒ.", meaning: "I have an apple." }, { learningLabel: "Developing", hanzi: "我们一起学习。", pinyin: "Wǒmen yìqǐ xuéxí.", meaning: "We study together." }, { learningLabel: "Stretch", hanzi: "第一节课八点开始。", pinyin: "Dì-yī jié kè bā diǎn kāishǐ.", meaning: "The first class starts at eight." }],
    commonMistake: "Do not add a hook or a second line: 一 is only one horizontal stroke.", confusableCharacter: { character: "二", guidance: "二 has two separate horizontal strokes, while 一 has only one." }, relatedCharacters: ["人", "年"], publicationStatus: "complete", seo: { title: "一 (yī) Stroke Order: Tone Changes and Writing Guide", description: "Practise 一 (yī) with one-stroke order, tone-change notes, useful vocabulary, graded sentences, and handwriting advice." },
  },
  {
    character: "是", pinyin: "shì", meaning: "to be; correct", strokes: 9, radical: "日", traditional: "是", structure: "Top-bottom",
    hsk: [{ system: "HSK 2.0", level: "Level 1", note: "Listed as a standalone Level 1 character." }, { system: "HSK 3.0", level: "Level 1", note: "Listed in the local Level 1 catalogue." }], learningTier: "High-frequency",
    importance: "是 supports identity, classification, confirmation, and many short question-and-answer patterns that beginners use every day.",
    components: [{ character: "日", explanation: "The top 日 is a balanced rectangle with a clear middle horizontal." }, { character: "疋", explanation: "The lower visual section widens gradually and finishes with a rightward foot." }],
    readingNotes: "是 is read shì with a falling tone. Keep its sound distinct from 十 shí, which differs by both vowel and tone.",
    useNotes: "Use 是 to identify or classify: 她是老师. Do not use it for location; Chinese normally uses 在 for where someone or something is.", usageTitle: "Identity, classification, and confirmation", usage: "是 links a subject with an identity, category, or description that is being asserted. It is useful in introductions, corrections, and yes-or-no questions. For physical location, choose 在 instead, even when English would use a form of 'to be'.", writingTip: "Write 日 compactly above, then leave room for the lower strokes to step down and finish with a clear final rightward stroke.",
    examples: [{ hanzi: "不是", pinyin: "bú shì", meaning: "is not" }, { hanzi: "可是", pinyin: "kěshì", meaning: "but" }, { hanzi: "也是", pinyin: "yě shì", meaning: "also is" }, { hanzi: "是否", pinyin: "shìfǒu", meaning: "whether or not" }],
    exampleSentences: [{ learningLabel: "Starter", hanzi: "他是老师。", pinyin: "Tā shì lǎoshī.", meaning: "He is a teacher." }, { learningLabel: "Developing", hanzi: "这是不是你的手机？", pinyin: "Zhè shì bú shì nǐ de shǒujī?", meaning: "Is this your phone?" }, { learningLabel: "Stretch", hanzi: "图书馆在学校旁边，不是在这里。", pinyin: "Túshūguǎn zài xuéxiào pángbiān, bú shì zài zhèlǐ.", meaning: "The library is beside the school, not here." }],
    commonMistake: "Do not flatten the lower section into a row of horizontals; keep the final foot extending to the right.", confusableCharacter: { character: "早", guidance: "Both begin with 日, but 早 has 十 below while 是 has a longer stepped lower section." }, relatedCharacters: ["在", "的"], publicationStatus: "complete", seo: { title: "是 (shì) Stroke Order: To Be and Correct Guide", description: "Learn 是 (shì) stroke order, identity versus location usage, common words, graded examples, and writing tips." },
  },
  {
    character: "在", pinyin: "zài", meaning: "at; in; be doing", strokes: 6, radical: "土", traditional: "在", structure: "Semi-enclosed",
    hsk: [{ system: "HSK 2.0", level: "Level 1", note: "Listed as a standalone Level 1 character." }, { system: "HSK 3.0", level: "Level 1", note: "Listed in the local Level 1 catalogue." }], learningTier: "High-frequency",
    importance: "在 lets learners say where people and objects are, then extends naturally to actions in progress.",
    components: [{ character: "𠂇", explanation: "The upper-left covering strokes frame the space without closing it." }, { character: "土", explanation: "The lower 土 provides the grounded base and should remain centred." }],
    readingNotes: "在 is read zài with a falling tone. Its pronunciation is stable in both location and progressive patterns.",
    useNotes: "Use 在 before a place for location: 在学校. Use 在 plus a verb for an action in progress: 在看书. It is not the same as 是, which identifies or classifies.", usageTitle: "Location and action in progress", usage: "在 has two central beginner jobs. It locates a person, object, or event, and it can stand before a verb to show an ongoing action. The surrounding words reveal which job it has, so practise each pattern in a full sentence.", writingTip: "Keep the upper cover open and light. Place 土 below it with a stable horizontal base rather than squeezing it into the left side.",
    examples: [{ hanzi: "在家", pinyin: "zài jiā", meaning: "at home" }, { hanzi: "现在", pinyin: "xiànzài", meaning: "now" }, { hanzi: "正在", pinyin: "zhèngzài", meaning: "right in the middle of" }, { hanzi: "在看书", pinyin: "zài kàn shū", meaning: "be reading" }],
    exampleSentences: [{ learningLabel: "Starter", hanzi: "妈妈在家。", pinyin: "Māma zài jiā.", meaning: "Mum is at home." }, { learningLabel: "Developing", hanzi: "我在看中文书。", pinyin: "Wǒ zài kàn Zhōngwén shū.", meaning: "I am reading a Chinese book." }, { learningLabel: "Stretch", hanzi: "老师正在教室里准备明天的课。", pinyin: "Lǎoshī zhèngzài jiàoshì lǐ zhǔnbèi míngtiān de kè.", meaning: "The teacher is preparing tomorrow's class in the classroom." }],
    commonMistake: "Do not write 土 too high; it belongs below the open upper strokes and needs a clear bottom horizontal.", confusableCharacter: { character: "左", guidance: "左 has 工 at the bottom, while 在 has 土 with a shorter upper horizontal and longer base." }, relatedCharacters: ["是", "学"], publicationStatus: "complete", seo: { title: "在 (zài) Stroke Order: Location and Progressive Guide", description: "Practise 在 (zài) with stroke order, location and progressive verb patterns, vocabulary, graded sentences, and writing guidance." },
  },
  {
    character: "了", pinyin: "le", meaning: "completion or change particle", strokes: 2, radical: "了", traditional: "了", structure: "Single-component",
    hsk: [{ system: "HSK 2.0", level: "Level 1", note: "Listed as a standalone Level 1 grammar character." }, { system: "HSK 3.0", level: "Level 1", note: "Listed in the local Level 1 catalogue." }], learningTier: "High-frequency",
    importance: "了 helps beginners express a finished action or a new situation, two meanings that must be learned through sentence context.",
    components: [{ character: "了", explanation: "The first stroke turns down into a hook, followed by a separate curved second stroke." }],
    readingNotes: "The particle is normally neutral-tone le. Read it with the sentence pattern instead of forcing it to mean one English tense.",
    useNotes: "After a verb, 了 can mark a completed action. At sentence end, 了 can mark a change of state: 下雨了 means 'It has started to rain,' not simply a completed verb.", usageTitle: "Completed actions and new situations", usage: "了 is short but carries important information. Put it after a verb when an action has been completed, and notice it at the end of a sentence when the situation has newly changed. These uses can occur together, but they should not be treated as identical.", writingTip: "Make the hook in the first stroke clear but small, then place the second curved stroke separately with open space between the two strokes.",
    examples: [{ hanzi: "来了", pinyin: "lái le", meaning: "has come" }, { hanzi: "看了", pinyin: "kàn le", meaning: "watched; read" }, { hanzi: "好了", pinyin: "hǎo le", meaning: "all right now; finished" }, { hanzi: "下雨了", pinyin: "xià yǔ le", meaning: "it has started raining" }],
    exampleSentences: [{ learningLabel: "Starter", hanzi: "我看了电影。", pinyin: "Wǒ kàn le diànyǐng.", meaning: "I watched a film." }, { learningLabel: "Developing", hanzi: "他来了，我们开始吧。", pinyin: "Tā lái le, wǒmen kāishǐ ba.", meaning: "He has arrived, so let us begin." }, { learningLabel: "Stretch", hanzi: "天黑了，孩子已经回家了。", pinyin: "Tiān hēi le, háizi yǐjīng huí jiā le.", meaning: "It has become dark, and the child has already gone home." }],
    commonMistake: "Do not join the two strokes into one long shape; the second stroke begins separately.", confusableCharacter: { character: "子", guidance: "子 has additional horizontal and lower strokes, while 了 has only the hook stroke and one separate curve." }, relatedCharacters: ["来", "去"], publicationStatus: "complete", seo: { title: "了 (le) Stroke Order: Completion and Change Guide", description: "Learn 了 (le) stroke order with completed-action and change-of-state patterns, vocabulary, graded examples, and handwriting tips." },
  },
);

type BatchGuideSeed = Omit<
  StrokeOrderCharacter,
  "hsk" | "publicationStatus"
> & { hskNote: string };

const batchHskCards: Record<string, StrokeOrderCharacter["hsk"]> = {
  "说": [
    { system: "HSK 2.0", level: "Level 1", note: "Word-family anchor: 说话 is listed at Level 1; it does not establish an official standalone level for everyday shuō." },
    { system: "HSK 3.0", level: "Level 1", note: "Word-family anchor: 说话 is listed at Level 1; the standalone shuì record is not evidence for everyday shuō." },
  ],
  "学": [
    { system: "HSK 2.0", level: "Level 1", note: "Word-family anchor: student and school vocabulary is listed at Level 1; this is not a standalone-character level claim." },
    { system: "HSK 3.0", level: "Level 1", note: "Exact 学 (xué) record is listed at Level 1." },
  ],
  "经": [
    { system: "HSK 2.0", level: "Level 2", note: "Word-family anchor: 已经 is listed at Level 2; this is not a standalone-character level claim." },
    { system: "HSK 3.0", level: "Level 2", note: "Word-family anchors: 经常 and 经过 are listed at Level 2; this is not a standalone-character level claim." },
  ],
  "体": [
    { system: "HSK 2.0", level: "Level 2", note: "Word-family anchor: 身体 is listed at Level 2; this is not a standalone-character level claim." },
    { system: "HSK 3.0", level: "Level 1", note: "Word-family anchor: 身体 is listed at Level 1; this is not a standalone-character level claim." },
  ],
  "议": [
    { system: "HSK 2.0", level: "Level 3", note: "Word-family anchor: 会议 is listed at Level 3; this is not a standalone-character level claim." },
    { system: "HSK 3.0", level: "Level 3", note: "Word-family anchor: 会议 is listed at Level 3; this is not a standalone-character level claim." },
  ],
  "我": [
    { system: "HSK 2.0", level: "Level 1", note: "Exact standalone Level 1 row." },
    { system: "HSK 3.0", level: "Level 1", note: "Exact standalone Level 1 row." },
  ],
  "你": [
    { system: "HSK 2.0", level: "Level 1", note: "Exact standalone Level 1 row." },
    { system: "HSK 3.0", level: "Level 1", note: "Exact standalone Level 1 row." },
  ],
  "人": [
    { system: "HSK 2.0", level: "Level 1", note: "Exact standalone Level 1 row." },
    { system: "HSK 3.0", level: "Level 1", note: "Exact standalone Level 1 row." },
  ],
  "来": [
    { system: "HSK 2.0", level: "Level 1", note: "Exact standalone Level 1 row." },
    { system: "HSK 3.0", level: "Level 1", note: "Exact standalone Level 1 row." },
  ],
  "去": [
    { system: "HSK 2.0", level: "Level 1", note: "Exact standalone Level 1 row." },
    { system: "HSK 3.0", level: "Level 1", note: "Exact standalone Level 1 row." },
  ],
};

function publishedBatchGuide({ hskNote: _hskNote, ...entry }: BatchGuideSeed): StrokeOrderCharacter {
  const hsk = batchHskCards[entry.character];
  if (!hsk) throw new Error(`Missing explicit HSK cards for ${entry.character}`);

  return {
    ...entry,
    hsk,
    publicationStatus: "complete",
  };
}

strokeOrderCharacterEntries.push(
  publishedBatchGuide({
    character: "说", pinyin: "shuō", meaning: "to say; speak", strokes: 9, radical: "讠", traditional: "說", structure: "Left-right", learningTier: "Beginner", hskNote: "说话 appears from Level 1; this note does not treat the standalone character as proof for every reading.",
    importance: "说 is central for reporting speech, asking questions, and practising everyday spoken Chinese.", components: [{ character: "讠", explanation: "The speech radical stays narrow on the left." }, { character: "兑", explanation: "The right component carries the wider body and final opening." }], readingNotes: "The everyday reading is shuō. In 说服 it is shuì; treat that as a word-specific reading rather than the default.", useNotes: "Use 说 before spoken content or with a listener: 说中文, 对老师说. For a conversation, 说话 is a common Level 1 word.", usageTitle: "Speaking and everyday conversation", usage: "说 helps learners express what someone says, asks, explains, or speaks. Start with short patterns such as 说中文 and 你说，然后 learn that set words can carry a less common reading without changing the ordinary shuō pronunciation.", writingTip: "Keep 讠 slender, then place 兑 slightly wider with a clear lower opening.", examples: [{ hanzi: "说话", pinyin: "shuōhuà", meaning: "to speak" }, { hanzi: "说中文", pinyin: "shuō Zhōngwén", meaning: "speak Chinese" }, { hanzi: "小说", pinyin: "xiǎoshuō", meaning: "novel" }, { hanzi: "说服", pinyin: "shuìfú", meaning: "persuade" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "我会说中文。", pinyin: "Wǒ huì shuō Zhōngwén.", meaning: "I can speak Chinese." }, { learningLabel: "Developing", hanzi: "请慢一点说。", pinyin: "Qǐng màn yìdiǎn shuō.", meaning: "Please speak a little more slowly." }, { learningLabel: "Stretch", hanzi: "老师说这个词可以有不同用法。", pinyin: "Lǎoshī shuō zhège cí kěyǐ yǒu bùtóng yòngfǎ.", meaning: "The teacher says this word can have different uses." }], commonMistake: "Do not confuse the narrow 讠 radical with the full 言 character.", confusableCharacter: { character: "谁", guidance: "Both begin with 讠, but 说 has 兑 on the right while 谁 has 隹." }, relatedCharacters: ["学", "人"], seo: { title: "说 (shuō) Stroke Order: Speak and Say Guide", description: "Learn 说 (shuō) stroke order, everyday speech patterns, the 说服 reading note, graded examples, and writing tips." },
  }),
  publishedBatchGuide({
    character: "学", pinyin: "xué", meaning: "to learn; study", strokes: 8, radical: "子", traditional: "學", structure: "Top-bottom", learningTier: "Beginner", hskNote: "The 学 word family appears from Level 1, including student and school vocabulary.",
    importance: "学 opens the student, school, and study word family that learners meet in introductions and classroom routines.", components: [{ character: "⺍", explanation: "The small upper strokes form an open roof." }, { character: "冖", explanation: "The middle cover separates the top from 子." }, { character: "子", explanation: "The lower child component forms the stable base." }], readingNotes: "学 is read xué with a rising tone. Keep the initial x sound light and forward rather than replacing it with sh.", useNotes: "Use 学 as a verb in 学中文 and in word-family terms such as 学生, 学校, and 学习. These words show the practical value of the character family.", usageTitle: "Study, students, and school", usage: "学 names learning as an action and supports a highly useful classroom word family. Learners can use it for subjects they study, people who study, and places where learning happens. The family gives repeated reading practice without claiming a standalone official level beyond the recorded words.", writingTip: "Stack the small top strokes, cover, and 子 with visible gaps so the character does not become a dark block.", examples: [{ hanzi: "学生", pinyin: "xuéshēng", meaning: "student" }, { hanzi: "学校", pinyin: "xuéxiào", meaning: "school" }, { hanzi: "学习", pinyin: "xuéxí", meaning: "study" }, { hanzi: "学中文", pinyin: "xué Zhōngwén", meaning: "study Chinese" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "我学中文。", pinyin: "Wǒ xué Zhōngwén.", meaning: "I study Chinese." }, { learningLabel: "Developing", hanzi: "她是一个学生。", pinyin: "Tā shì yí ge xuéshēng.", meaning: "She is a student." }, { learningLabel: "Stretch", hanzi: "学校的图书馆是学习的好地方。", pinyin: "Xuéxiào de túshūguǎn shì xuéxí de hǎo dìfang.", meaning: "The school library is a good place to study." }], commonMistake: "Do not let 子 touch the cover above it; the lower component needs its own clear space.", confusableCharacter: { character: "字", guidance: "Both contain 子, but 字 has 宀 above it while 学 has the small-stroke top and cover." }, relatedCharacters: ["人", "说"], seo: { title: "学 (xué) Stroke Order: Study and School Guide", description: "Practise 学 (xué) with stroke order, student and school word-family guidance, graded examples, and handwriting tips." },
  }),
  publishedBatchGuide({
    character: "经", pinyin: "jīng", meaning: "pass through; classics; experience word family", strokes: 8, radical: "纟", traditional: "經", structure: "Left-right", learningTier: "Advanced", hskNote: "已经 begins at HSK 2.0 Level 2; 经常 and 经过 begin at HSK 3.0 Level 2.",
    importance: "经 is best learned through its word family, where it contributes to time, movement, experience, and familiar higher-level vocabulary.", components: [{ character: "纟", explanation: "The silk radical is narrow and forms three compact left-side strokes." }, { character: "圣", explanation: "The right component supplies the taller vertical structure and grounded base." }], readingNotes: "经 is read jīng with a high level tone in common word-family items such as 已经 and 经常.", useNotes: "Treat 经 as word-family material rather than a beginner standalone sentence word. 已经, 经常, and 经过 have distinct patterns and recorded Level 2 anchors.", usageTitle: "A Level 2 word family", usage: "经 appears in useful words that learners encounter after the first beginner layer. Its word family connects completed time, regular frequency, and passing through a place. Practise the full words so the character gains meaning from a reliable context.", writingTip: "Keep 纟 narrow and separate from the taller right side; let the right-side bottom horizontal provide the base.", examples: [{ hanzi: "已经", pinyin: "yǐjīng", meaning: "already" }, { hanzi: "经常", pinyin: "jīngcháng", meaning: "often" }, { hanzi: "经过", pinyin: "jīngguò", meaning: "pass through" }, { hanzi: "经验", pinyin: "jīngyàn", meaning: "experience" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "我已经到了。", pinyin: "Wǒ yǐjīng dào le.", meaning: "I have already arrived." }, { learningLabel: "Developing", hanzi: "她经常在这里学习。", pinyin: "Tā jīngcháng zài zhèlǐ xuéxí.", meaning: "She often studies here." }, { learningLabel: "Stretch", hanzi: "我们经过学校以后去图书馆。", pinyin: "Wǒmen jīngguò xuéxiào yǐhòu qù túshūguǎn.", meaning: "After passing the school, we go to the library." }], commonMistake: "Do not merge the three strokes of 纟 into one zigzag; each has a distinct small turn.", confusableCharacter: { character: "轻", guidance: "Both use 纟, but 经 has 圣 on the right whereas 轻 has a different vehicle-related right side." }, relatedCharacters: ["体", "议"], seo: { title: "经 (jīng) Stroke Order: Word Family Writing Guide", description: "Learn 经 (jīng) stroke order through 已经, 经常, and 经过, with graded examples and handwriting guidance." },
  }),
  publishedBatchGuide({
    character: "体", pinyin: "tǐ", meaning: "body; form; system word family", strokes: 7, radical: "亻", traditional: "體", structure: "Left-right", learningTier: "Advanced", hskNote: "身体 begins at HSK 2.0 Level 2 and is the main early word-family anchor.",
    importance: "体 becomes practical through body, health, form, and system vocabulary rather than as an isolated beginner word.", components: [{ character: "亻", explanation: "The person radical stays narrow at the left." }, { character: "本", explanation: "The right component carries the width and includes a short base mark." }], readingNotes: "体 is read tǐ with a third tone. In 身体, say the full two-character word rather than treating the second character as a separate beginner claim.", useNotes: "Learn 体 through complete words such as 身体, 体育, and 体重. The local catalogue places 身体 from HSK 2.0 Level 2.", usageTitle: "Body and form word family", usage: "体 is a productive character for body-related and abstract form vocabulary. Its most useful early anchor is 身体, then words such as 体育 add new contexts. Keeping these words together prevents an advanced standalone guide from pretending to be a basic one-word lesson.", writingTip: "Make 亻 light and narrow, then place 本 wider with its central vertical aligned below the top horizontal.", examples: [{ hanzi: "身体", pinyin: "shēntǐ", meaning: "body; health" }, { hanzi: "体育", pinyin: "tǐyù", meaning: "physical education" }, { hanzi: "体重", pinyin: "tǐzhòng", meaning: "body weight" }, { hanzi: "整体", pinyin: "zhěngtǐ", meaning: "whole; overall" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "我的身体很好。", pinyin: "Wǒ de shēntǐ hěn hǎo.", meaning: "My health is good." }, { learningLabel: "Developing", hanzi: "今天我们有体育课。", pinyin: "Jīntiān wǒmen yǒu tǐyù kè.", meaning: "We have PE class today." }, { learningLabel: "Stretch", hanzi: "跑步以后喝水对身体很好。", pinyin: "Pǎobù yǐhòu hē shuǐ duì shēntǐ hěn hǎo.", meaning: "Drinking water after running is good for the body." }], commonMistake: "Do not make the left 亻 as wide as 本; the right component must remain the visual focus.", confusableCharacter: { character: "休", guidance: "Both use 亻, but 体 has 本 with a base mark while 休 has 木." }, relatedCharacters: ["经", "议"], seo: { title: "体 (tǐ) Stroke Order: Body Word Family Guide", description: "Practise 体 (tǐ) through 身体 and related words, with stroke order, graded examples, and writing tips." },
  }),
  publishedBatchGuide({
    character: "议", pinyin: "yì", meaning: "discuss; deliberate word family", strokes: 5, radical: "讠", traditional: "議", structure: "Left-right", learningTier: "Advanced", hskNote: "会议 appears at HSK 2.0 and HSK 3.0 Level 3; use it as a word-family anchor.",
    importance: "议 is most useful through formal discussion and meeting vocabulary, where it signals deliberation rather than casual beginner speech.", components: [{ character: "讠", explanation: "The speech radical is compact and written first." }, { character: "义", explanation: "The right component has an open diagonal shape and final crossing stroke." }], readingNotes: "议 is read yì with a falling tone in 会议, 议论, and 建议-related vocabulary.", useNotes: "Learn 议 in complete words such as 会议 and 议论. The recorded Level 3 meeting anchor supports word-family learning, not an unsupported standalone beginner level.", usageTitle: "Discussion and meeting word family", usage: "议 appears in language about discussing, proposing, and holding meetings. It is an advanced extension because learners normally meet it inside longer words. Practise the full word with its situation, such as a meeting or a suggestion, rather than using a bare character.", writingTip: "Write the narrow 讠 first, then keep 义 open enough for its crossing diagonal to remain visible.", examples: [{ hanzi: "会议", pinyin: "huìyì", meaning: "meeting" }, { hanzi: "议论", pinyin: "yìlùn", meaning: "discuss; comment" }, { hanzi: "建议", pinyin: "jiànyì", meaning: "suggestion" }, { hanzi: "议题", pinyin: "yìtí", meaning: "agenda topic" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "下午有一个会议。", pinyin: "Xiàwǔ yǒu yí ge huìyì.", meaning: "There is a meeting this afternoon." }, { learningLabel: "Developing", hanzi: "我们讨论这个问题。", pinyin: "Wǒmen tǎolùn zhège wèntí.", meaning: "We discuss this question." }, { learningLabel: "Stretch", hanzi: "会议开始前，请准备你的建议。", pinyin: "Huìyì kāishǐ qián, qǐng zhǔnbèi nǐ de jiànyì.", meaning: "Please prepare your suggestion before the meeting begins." }], commonMistake: "Do not write 讠 as full 言 or let the right-side diagonal close into a box.", confusableCharacter: { character: "义", guidance: "义 is the right component alone; 议 adds the speech radical 讠 on the left." }, relatedCharacters: ["经", "体"], seo: { title: "议 (yì) Stroke Order: Meeting Word Family Guide", description: "Learn 议 (yì) through 会议 and discussion vocabulary, with stroke order, graded examples, and writing guidance." },
  }),
);

strokeOrderCharacterEntries.push(
  publishedBatchGuide({ character: "我", pinyin: "wǒ", meaning: "I; me", strokes: 7, radical: "戈", traditional: "我", structure: "Single-component", learningTier: "High-frequency", hskNote: "Listed as a standalone Level 1 pronoun.", importance: "我 is the first-person pronoun for introductions, opinions, needs, and everyday conversation.", components: [{ character: "戈", explanation: "Crossing centre strokes lead into the long final right sweep." }], readingNotes: "我 is read wǒ with a third tone; it does not change shape for subject and object use.", useNotes: "Use 我 for the speaker: 我喜欢你 and 你看我. Add 们 to make 我们 when the group includes the speaker.", usageTitle: "Speaking about yourself", usage: "我 identifies the person speaking in names, preferences, family descriptions, study plans, and replies. It is different from 人, a general person word, and 你, the person being addressed.", writingTip: "Let the crossing strokes meet cleanly and leave space for the long final sweep below the centre.", examples: [{ hanzi: "我们", pinyin: "wǒmen", meaning: "we; us" }, { hanzi: "我的", pinyin: "wǒ de", meaning: "my" }, { hanzi: "我家", pinyin: "wǒ jiā", meaning: "my home" }, { hanzi: "自我", pinyin: "zìwǒ", meaning: "self" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "我是学生。", pinyin: "Wǒ shì xuéshēng.", meaning: "I am a student." }, { learningLabel: "Developing", hanzi: "我想去中国。", pinyin: "Wǒ xiǎng qù Zhōngguó.", meaning: "I want to go to China." }, { learningLabel: "Stretch", hanzi: "我和朋友常常在图书馆学习。", pinyin: "Wǒ hé péngyou chángcháng zài túshūguǎn xuéxí.", meaning: "My friends and I often study in the library." }], commonMistake: "Do not begin the final long stroke too high; it must sweep outward from the lower centre.", confusableCharacter: { character: "找", guidance: "找 has the separate hand radical 扌, while 我 is one integrated form." }, relatedCharacters: ["你", "人"], seo: { title: "我 (wǒ) Stroke Order: I and Me Writing Guide", description: "Practise 我 (wǒ) with first-person patterns, vocabulary, graded sentences, and stroke-order writing tips." } }),
  publishedBatchGuide({ character: "你", pinyin: "nǐ", meaning: "you", strokes: 7, radical: "亻", traditional: "你", structure: "Left-right", learningTier: "Beginner", hskNote: "Listed as a standalone Level 1 pronoun.", importance: "你 addresses one person in greetings, questions, invitations, and classroom exchanges.", components: [{ character: "亻", explanation: "The narrow person radical leaves width for the right component." }, { character: "尔", explanation: "The right component is wider with small upper strokes." }], readingNotes: "你 is read nǐ with a third tone; the dictionary reading stays nǐ even when speech tones interact.", useNotes: "Use 你 for one person in neutral settings. Use 您 where additional politeness is needed and 你们 for a group.", usageTitle: "Addressing one person", usage: "你 points to the listener in a greeting, question, or invitation. It pairs naturally with 我 for conversation practice, while 人 names people in general rather than the person directly addressed.", writingTip: "Keep 亻 narrow and upright, with a visible gap before the broader right component.", examples: [{ hanzi: "你好", pinyin: "nǐ hǎo", meaning: "hello" }, { hanzi: "你的", pinyin: "nǐ de", meaning: "your" }, { hanzi: "你们", pinyin: "nǐmen", meaning: "you plural" }, { hanzi: "爱你", pinyin: "ài nǐ", meaning: "love you" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "你好吗？", pinyin: "Nǐ hǎo ma?", meaning: "How are you?" }, { learningLabel: "Developing", hanzi: "你今天去学校吗？", pinyin: "Nǐ jīntiān qù xuéxiào ma?", meaning: "Are you going to school today?" }, { learningLabel: "Stretch", hanzi: "如果你有问题，可以问老师。", pinyin: "Rúguǒ nǐ yǒu wèntí, kěyǐ wèn lǎoshī.", meaning: "If you have a question, you can ask the teacher." }], commonMistake: "Do not widen 亻 until it matches the right side; it should remain slim.", confusableCharacter: { character: "他", guidance: "Both use 亻, but 你 has 尔 while 他 has 也." }, relatedCharacters: ["我", "人"], seo: { title: "你 (nǐ) Stroke Order: You Pronoun Writing Guide", description: "Learn 你 (nǐ) with pronoun use, vocabulary, graded example sentences, and left-right writing guidance." } }),
  publishedBatchGuide({ character: "人", pinyin: "rén", meaning: "person; people", strokes: 2, radical: "人", traditional: "人", structure: "Single-component", learningTier: "Beginner", hskNote: "Listed as a standalone Level 1 character.", importance: "人 names a person or people and builds family, job, nationality, and counting vocabulary.", components: [{ character: "人", explanation: "A short left fall opens into a longer right-falling stroke." }], readingNotes: "人 is read rén with a rising tone and becomes the left-side radical 亻 in many characters.", useNotes: "Use 人 after a number or description: 三个人 and 中国人. Unlike 我 and 你, it refers to people generally.", usageTitle: "People and person words", usage: "人 is a flexible word for an individual or people. It combines with countries, roles, and family words, and it can follow a number when counting people in an everyday setting.", writingTip: "Write the left-falling stroke shorter, then open the longer right-falling stroke for balance.", examples: [{ hanzi: "人们", pinyin: "rénmen", meaning: "people" }, { hanzi: "中国人", pinyin: "Zhōngguó rén", meaning: "Chinese person" }, { hanzi: "家人", pinyin: "jiārén", meaning: "family members" }, { hanzi: "别人", pinyin: "biérén", meaning: "other people" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "这里有三个人。", pinyin: "Zhèlǐ yǒu sān ge rén.", meaning: "There are three people here." }, { learningLabel: "Developing", hanzi: "我的家人都很好。", pinyin: "Wǒ de jiārén dōu hěn hǎo.", meaning: "My family are all well." }, { learningLabel: "Stretch", hanzi: "每个人都可以用自己的方式学习。", pinyin: "Měi ge rén dōu kěyǐ yòng zìjǐ de fāngshì xuéxí.", meaning: "Everyone can learn in their own way." }], commonMistake: "Do not make both strokes equal; the right-falling stroke must be longer and more open.", confusableCharacter: { character: "入", guidance: "人 opens left then right, while 入 begins with the longer crossing stroke from the other side." }, relatedCharacters: ["我", "你"], seo: { title: "人 (rén) Stroke Order: Person and People Guide", description: "Practise 人 (rén) with person vocabulary, counting patterns, graded sentences, and two-stroke handwriting guidance." } }),
  publishedBatchGuide({ character: "来", pinyin: "lái", meaning: "to come", strokes: 7, radical: "木", traditional: "來", structure: "Single-component", learningTier: "Beginner", hskNote: "Listed as a standalone Level 1 verb.", importance: "来 expresses movement toward a speaker or reference point in arrivals, invitations, and plans.", components: [{ character: "木", explanation: "The centred vertical and crossings form the balanced middle." }, { character: "人", explanation: "Lower spreading strokes create the simplified form's broad finish." }], readingNotes: "来 is read lái with a rising tone in words such as 来了 and 回来.", useNotes: "Use 来 for motion toward the speaker or stated reference point. Contrast 去 for motion away from that point; direction depends on the reference point.", usageTitle: "Coming toward a reference point", usage: "来 describes an arrival in the direction of the speaker, listener, or named place. It is useful in invitations and schedules, especially when paired with 去 so learners can compare relative direction.", writingTip: "Keep the central vertical straight and let the lower left and right strokes spread without becoming flat.", examples: [{ hanzi: "回来", pinyin: "huílái", meaning: "come back" }, { hanzi: "来了", pinyin: "lái le", meaning: "has come" }, { hanzi: "未来", pinyin: "wèilái", meaning: "future" }, { hanzi: "来学校", pinyin: "lái xuéxiào", meaning: "come to school" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "请来我家。", pinyin: "Qǐng lái wǒ jiā.", meaning: "Please come to my home." }, { learningLabel: "Developing", hanzi: "朋友明天来北京。", pinyin: "Péngyou míngtiān lái Běijīng.", meaning: "A friend is coming to Beijing tomorrow." }, { learningLabel: "Stretch", hanzi: "下课以后，你来图书馆找我吧。", pinyin: "Xià kè yǐhòu, nǐ lái túshūguǎn zhǎo wǒ ba.", meaning: "After class, come to the library to find me." }], commonMistake: "Do not omit the small upper strokes or squeeze the lower spreading strokes into the centre.", confusableCharacter: { character: "未", guidance: "未 has a simpler 木 base, while 来 has extra upper dots and a broader lower finish." }, relatedCharacters: ["去", "我"], seo: { title: "来 (lái) Stroke Order: Come Direction Guide", description: "Learn 来 (lái) with reference-point direction, vocabulary, graded examples, and clear stroke-order writing tips." } }),
  publishedBatchGuide({ character: "去", pinyin: "qù", meaning: "to go", strokes: 5, radical: "厶", traditional: "去", structure: "Top-bottom", learningTier: "Beginner", hskNote: "Listed as a standalone Level 1 verb.", importance: "去 is the core motion verb for travelling away from a speaker or reference point to a destination.", components: [{ character: "土", explanation: "The top earth component stays compact and level." }, { character: "厶", explanation: "The lower curved component remains open and distinct." }], readingNotes: "去 is read qù with a falling tone, distinct from 取 qǔ in sound and meaning.", useNotes: "Use 去 for movement away from the speaker or reference point: 我去学校. Contrast 来, which moves toward that point.", usageTitle: "Going away from a reference point", usage: "去 tells where someone is heading when the direction is away from the relevant location. It combines with destinations, activities, and plans, and is best learned alongside 来 so each direction has a reference point.", writingTip: "Build the top 土 first, then leave room below for the open curved 厶 component.", examples: [{ hanzi: "去年", pinyin: "qùnián", meaning: "last year" }, { hanzi: "去学校", pinyin: "qù xuéxiào", meaning: "go to school" }, { hanzi: "出去", pinyin: "chūqù", meaning: "go out" }, { hanzi: "回去", pinyin: "huíqu", meaning: "go back" }], exampleSentences: [{ learningLabel: "Starter", hanzi: "我去学校。", pinyin: "Wǒ qù xuéxiào.", meaning: "I am going to school." }, { learningLabel: "Developing", hanzi: "周末我们去公园吧。", pinyin: "Zhōumò wǒmen qù gōngyuán ba.", meaning: "Let us go to the park at the weekend." }, { learningLabel: "Stretch", hanzi: "老师说下课后可以去图书馆。", pinyin: "Lǎoshī shuō xià kè hòu kěyǐ qù túshūguǎn.", meaning: "The teacher said we can go to the library after class." }], commonMistake: "Do not close 厶 into a box; its curved stroke and final dot stay visibly open.", confusableCharacter: { character: "云", guidance: "云 has two top horizontals, while 去 has 土 above the lower 厶." }, relatedCharacters: ["来", "年"], seo: { title: "去 (qù) Stroke Order: Go Direction Writing Guide", description: "Practise 去 (qù) with reference-point direction, vocabulary, graded examples, and top-bottom handwriting guidance." } }),
);

const publishedCharacterOrder = [
  "\u7231", "\u5e74", "\u4f5b", "\u7684", "\u4e00", "\u662f", "\u5728", "\u4e86", "\u6211",
  "\u4f60", "\u4eba", "\u6765", "\u53bb", "\u8bf4", "\u5b66", "\u7ecf", "\u4f53", "\u8bae",
] as const;

export const indexableStrokeOrderCharacters = filterIndexableStrokeOrderCharacters(
  strokeOrderCharacterEntries,
).sort(
  (left, right) =>
    publishedCharacterOrder.indexOf(left.character as (typeof publishedCharacterOrder)[number]) -
    publishedCharacterOrder.indexOf(right.character as (typeof publishedCharacterOrder)[number]),
);

// Existing consumers keep this stable name; it is intentionally publication-filtered.
export const strokeOrderCharacters = indexableStrokeOrderCharacters;

const strokeOrderCharacterByHanzi = new Map<string, StrokeOrderCharacter>(
  indexableStrokeOrderCharacters.map((entry) => [entry.character, entry]),
);

export const strokeOrderLearningTiers = [
  "High-frequency",
  "Beginner",
  "Advanced",
  "Foundation",
] as const;

export type StrokeOrderLearningTier = (typeof strokeOrderLearningTiers)[number];

function getStrokeOrderLearningTier(
  entry: Pick<StrokeOrderCharacter, "learningTier">,
): StrokeOrderLearningTier {
  if (entry.learningTier === "High-frequency" || entry.learningTier === "Beginner") {
    return entry.learningTier;
  }

  return entry.learningTier === "Advanced" || entry.learningTier === "Advanced extension"
    ? "Advanced"
    : "Foundation";
}

export function groupStrokeOrderCharactersByTier(
  entries: readonly StrokeOrderCharacter[],
): Array<{ tier: StrokeOrderLearningTier; entries: StrokeOrderCharacter[] }> {
  return strokeOrderLearningTiers.map((tier) => ({
    tier,
    entries: entries.filter((entry) => getStrokeOrderLearningTier(entry) === tier),
  }));
}

export function getRelatedStrokeOrderCharacters(
  entry: Pick<StrokeOrderCharacter, "relatedCharacters">,
): StrokeOrderCharacter[] {
  return entry.relatedCharacters
    .map((character) => strokeOrderCharacterByHanzi.get(character))
    .filter((candidate): candidate is StrokeOrderCharacter => candidate !== undefined);
}

export function getStrokeOrderCharacter(
  character: string,
): StrokeOrderCharacter | undefined {
  try {
    return strokeOrderCharacterByHanzi.get(decodeURIComponent(character));
  } catch {
    return undefined;
  }
}
