export type ComparisonCategory = "Grammar and usage" | "Direction and contrast" | "Shape and recognition";

export interface ComparisonExample {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface ComparisonItem {
  character: string;
  pinyin: string;
  label: string;
  rule: string;
  signal: string;
  examples: ComparisonExample[];
}

export interface ComparisonMistake {
  wrong: string;
  correct: string;
  explanation: string;
}

export interface ComparisonPage {
  slug: string;
  category: ComparisonCategory;
  characters: string[];
  title: string;
  description: string;
  heading: string;
  intro: string;
  decisionRule: string;
  teachingAngle: string;
  items: ComparisonItem[];
  mistakes: ComparisonMistake[];
  memoryTips: string[];
  faqs: Array<{ question: string; answer: string }>;
  worksheetWords: string[];
  relatedSlugs: string[];
}

export const comparisonPages: readonly ComparisonPage[] = [
  {
    slug: "的-得-地", category: "Grammar and usage", characters: ["的", "得", "地"],
    title: "的 vs 得 vs 地: Chinese Grammar Guide with Examples",
    description: "Choose 的, 得, or 地 by sentence position: noun modifier, post-verb complement, or pre-verb manner. See corrected examples and practise all three.",
    heading: "的 vs 得 vs 地: the position rule that makes the choice easier",
    intro: "These three characters can all sound like neutral de, but they connect different parts of a sentence. Instead of memorizing English translations, look at the word immediately after or before the blank.",
    decisionRule: "Before a noun, choose 的. After a verb and before a complement, choose 得. Before a verb to describe how the action happens, choose 地.",
    teachingAngle: "Read outward from the blank: noun to the right points to 的; a completed verb on the left points to 得; a manner phrase flowing into a verb points to 地.",
    items: [
      { character: "的", pinyin: "de / dí / dì", label: "Noun modifier and possession", rule: "Neutral 的 connects an owner or description to a noun. Other readings belong to separate words such as 的确 and 目的.", signal: "Look right: is the next core word a noun?", examples: [{ hanzi: "我的书", pinyin: "wǒ de shū", meaning: "my book" }, { hanzi: "新的老师", pinyin: "xīn de lǎoshī", meaning: "the new teacher" }, { hanzi: "这是你的。", pinyin: "Zhè shì nǐ de.", meaning: "This is yours." }] },
      { character: "得", pinyin: "de / dé / děi", label: "Complement after a verb", rule: "Neutral 得 follows a verb and introduces degree or result. Dé means obtain; děi means must.", signal: "Look left: has the main action already appeared?", examples: [{ hanzi: "写得好", pinyin: "xiě de hǎo", meaning: "write well" }, { hanzi: "跑得很快", pinyin: "pǎo de hěn kuài", meaning: "run very fast" }, { hanzi: "我得走了。", pinyin: "Wǒ děi zǒu le.", meaning: "I have to go." }] },
      { character: "地", pinyin: "de / dì", label: "Manner before a verb", rule: "Neutral 地 turns a description into the manner of an action. Dì names ground, land, or place.", signal: "Look right: is a manner phrase leading into a verb?", examples: [{ hanzi: "慢慢地说", pinyin: "mànmàn de shuō", meaning: "speak slowly" }, { hanzi: "高兴地笑", pinyin: "gāoxìng de xiào", meaning: "smile happily" }, { hanzi: "地图在桌上。", pinyin: "Dìtú zài zhuō shàng.", meaning: "The map is on the table." }] },
    ],
    mistakes: [{ wrong: "我得书", correct: "我的书", explanation: "书 is a noun, so the possessive modifier uses 的." }, { wrong: "他说的很快", correct: "他说得很快", explanation: "说 is already the verb; 很快 is its degree complement." }, { wrong: "她高兴得走进来", correct: "她高兴地走进来", explanation: "高兴 describes the manner of the following action 走进来." }],
    memoryTips: ["的 points forward to a noun; imagine it placing a label on that noun.", "得 looks backward to a verb; 地 prepares the runway for a verb still to come."],
    faqs: [{ question: "Do 的, 得, and 地 always sound the same?", answer: "Their grammar-marker uses are commonly neutral de, but each character also has lexical readings in other words. Sentence role is more reliable than sound." }, { question: "Is 地 always required before an adverbial verb phrase?", answer: "No. Natural Mandarin often omits 地 with short or conventional adverbs. This guide explains where it is used, not a rule that every adverb must include it." }],
    worksheetWords: ["我的书", "写得好", "慢慢地说", "跑得快", "高兴地笑", "新的老师"], relatedSlugs: ["在-再", "不-没", "好-坏"],
  },
  {
    slug: "不-没", category: "Grammar and usage", characters: ["不", "没"],
    title: "不 vs 没: Chinese Negation Rules and Examples",
    description: "Learn when Mandarin uses 不 for habits, states, and intentions, and 没 for possession or unrealized past events, with a fast time-reference test.",
    heading: "不 vs 没: how to choose the right Chinese negative",
    intro: "Both words translate as ‘not’ in some sentences, but Mandarin separates general or intended negation from missing possession and events that did not occur.",
    decisionRule: "Choose 不 for a state, habit, judgment, or intention. Choose 没 or 没有 when something was not completed, has not happened, or is not possessed.",
    teachingAngle: "Ask whether the sentence rejects a general pattern or checks the record of an event. General pattern points to 不; absent record or possession points to 没.",
    items: [
      { character: "不", pinyin: "bù / bú", label: "General, present, or intended negation", rule: "不 normally sits before a verb or adjective and denies a recurring action, description, willingness, or future plan.", signal: "Habit, identity, quality, intention", examples: [{ hanzi: "我不喝咖啡。", pinyin: "Wǒ bù hē kāfēi.", meaning: "I do not drink coffee." }, { hanzi: "他今天不来。", pinyin: "Tā jīntiān bù lái.", meaning: "He is not coming today." }, { hanzi: "这个不贵。", pinyin: "Zhège bú guì.", meaning: "This is not expensive." }] },
      { character: "没", pinyin: "méi", label: "No possession or event completion", rule: "没 negates the occurrence of an action; 没有 negates possession or existence. It often works with 还 and past time phrases.", signal: "Did not, have not, do not have", examples: [{ hanzi: "我没有车。", pinyin: "Wǒ méiyǒu chē.", meaning: "I do not have a car." }, { hanzi: "他昨天没来。", pinyin: "Tā zuótiān méi lái.", meaning: "He did not come yesterday." }, { hanzi: "我还没吃饭。", pinyin: "Wǒ hái méi chīfàn.", meaning: "I have not eaten yet." }] },
    ],
    mistakes: [{ wrong: "我不有时间", correct: "我没有时间", explanation: "Possession with 有 is negated as 没有." }, { wrong: "我昨天不去", correct: "我昨天没去", explanation: "If the intended meaning is that the trip did not happen, 没 records the unrealized event." }, { wrong: "我没喜欢咖啡", correct: "我不喜欢咖啡", explanation: "A stable preference or general state normally takes 不." }],
    memoryTips: ["不 describes the rule; 没 checks the event log.", "有 has a fixed negative partner: 没有."],
    faqs: [{ question: "Can 不 ever refer to the future?", answer: "Yes. It frequently denies an intention or predicted future action, as in 明天不来. The key is planned/general negation, not simply calendar time." }, { question: "Why is 昨天不去 sometimes possible?", answer: "In a contrastive or reported-plan context it can mean ‘was not going’. For the plain fact that someone did not go, 昨天没去 is the normal beginner choice." }],
    worksheetWords: ["不好", "不是", "不来", "没有", "没去", "还没吃"], relatedSlugs: ["的-得-地", "在-再", "来-去"],
  },
  {
    slug: "来-去", category: "Direction and contrast", characters: ["来", "去"],
    title: "来 vs 去: Direction and Usage",
    description: "Choose 来 or 去 by locating the speaker or reference point. Compare arrivals, departures, compound directions, invitations, and common learner errors.",
    heading: "来 vs 去: direction depends on the reference point",
    intro: "English ‘come’ and ‘go’ are a useful start, but Mandarin direction becomes clearer when you mark the place the conversation treats as ‘here’.",
    decisionRule: "Movement toward the speaker or chosen reference point uses 来. Movement away from that point uses 去.",
    teachingAngle: "Draw two dots: the mover and the conversational ‘here’. An arrow ending at ‘here’ is 来; an arrow leaving it is 去.",
    items: [
      { character: "来", pinyin: "lái", label: "Motion toward here", rule: "来 describes an arrival toward the speaker, listener, or place adopted as the reference point.", signal: "The destination is ‘here’ in the conversation", examples: [{ hanzi: "请来我家。", pinyin: "Qǐng lái wǒ jiā.", meaning: "Please come to my home." }, { hanzi: "老师走进来了。", pinyin: "Lǎoshī zǒu jìnlái le.", meaning: "The teacher walked in (toward here)." }, { hanzi: "拿过来。", pinyin: "Ná guòlái.", meaning: "Bring it over here." }] },
      { character: "去", pinyin: "qù", label: "Motion away from here", rule: "去 sends motion away from the reference point toward another place or continuation outward.", signal: "The mover leaves ‘here’", examples: [{ hanzi: "我去学校。", pinyin: "Wǒ qù xuéxiào.", meaning: "I am going to school." }, { hanzi: "他跑出去了。", pinyin: "Tā pǎo chūqù le.", meaning: "He ran out (away from here)." }, { hanzi: "请把书拿过去。", pinyin: "Qǐng bǎ shū ná guòqù.", meaning: "Please take the book over there." }] },
    ],
    mistakes: [{ wrong: "[At home] 你明天去我家吧", correct: "[At home] 你明天来我家吧", explanation: "The speaker is at the destination, so the invited motion ends at the reference point." }, { wrong: "我从这里来学校", correct: "我从这里去学校", explanation: "The movement leaves the current ‘here’ for school." }, { wrong: "把水拿去（toward me）", correct: "把水拿来", explanation: "An object moving toward the speaker takes 来." }],
    memoryTips: ["来 lands here; 去 leaves here.", "For compound directions, decide the path first, then attach 来 or 去 according to the final viewpoint."],
    faqs: [{ question: "Can the listener be the reference point for 来?", answer: "Yes. A speaker can adopt the listener's location as ‘there with you’ and use 来 for motion toward that shared conversational point." }, { question: "What is the difference between 回来 and 回去?", answer: "Both mean return. 回来 returns toward the reference point; 回去 returns away from it to another place." }],
    worksheetWords: ["来学校", "去学校", "回来", "回去", "拿过来", "拿过去"], relatedSlugs: ["上-下", "在-再", "不-没"],
  },
  {
    slug: "在-再", category: "Grammar and usage", characters: ["在", "再"],
    title: "在 vs 再: Location, Ongoing Action, or Again?",
    description: "Separate the homophones 在 and 再 with sentence-position rules for location, progressive actions, future repetition, and step-by-step sequencing.",
    heading: "在 vs 再: same sound, different sentence jobs",
    intro: "Both characters are pronounced zài, so dictation cannot rely on sound. Their grammatical neighborhoods make the choice visible.",
    decisionRule: "Use 在 for location or an action in progress. Use 再 for doing something again, later, or after another step.",
    teachingAngle: "Try replacing the blank with ‘located/doing now’ or with ‘again/then’. Only one meaning should fit the surrounding sentence.",
    items: [
      { character: "在", pinyin: "zài", label: "Location and ongoing action", rule: "在 can be a location verb, a preposition before a place, or a progressive marker before an action.", signal: "Where? Or what is happening now?", examples: [{ hanzi: "我在家。", pinyin: "Wǒ zài jiā.", meaning: "I am at home." }, { hanzi: "书在桌上。", pinyin: "Shū zài zhuō shàng.", meaning: "The book is on the table." }, { hanzi: "她在看书。", pinyin: "Tā zài kàn shū.", meaning: "She is reading." }] },
      { character: "再", pinyin: "zài", label: "Again, later, or next step", rule: "再 usually comes before the action that will repeat or follow another action.", signal: "Another occurrence or the next action", examples: [{ hanzi: "请再说一次。", pinyin: "Qǐng zài shuō yí cì.", meaning: "Please say it again." }, { hanzi: "明天再来。", pinyin: "Míngtiān zài lái.", meaning: "Come again tomorrow." }, { hanzi: "吃完饭再去。", pinyin: "Chī wán fàn zài qù.", meaning: "Go after finishing the meal." }] },
    ],
    mistakes: [{ wrong: "我再学校", correct: "我在学校", explanation: "A location requires 在." }, { wrong: "请在说一次", correct: "请再说一次", explanation: "The requested action is a repetition." }, { wrong: "他再吃饭（right now）", correct: "他在吃饭", explanation: "An action currently in progress uses 在." }],
    memoryTips: ["在 contains 土 and anchors a place; 再 layers another occurrence.", "在 answers where/now; 再 answers again/next."],
    faqs: [{ question: "Does 再 only describe future repetition?", answer: "Its central beginner use looks forward to a repetition or next step. Repeated events already observed often use 又, although broader discourse has additional patterns." }, { question: "Can 在 appear twice in one sentence?", answer: "Yes. One may introduce location and another progressive action, though natural phrasing may avoid unnecessary repetition." }],
    worksheetWords: ["在家", "在看书", "再来", "再说一次", "现在", "再见"], relatedSlugs: ["来-去", "不-没", "的-得-地"],
  },
  {
    slug: "上-下", category: "Direction and contrast", characters: ["上", "下"],
    title: "上 vs 下: Meaning, Direction & Time",
    description: "Compare 上 and 下 across space, movement, schedules, vehicles, and previous/next time. Learn which side of a noun changes the meaning.",
    heading: "上 vs 下: one spatial pair, several useful extensions",
    intro: "The basic contrast is above versus below, but Mandarin reuses that orientation for movement, class schedules, vehicles, and time periods.",
    decisionRule: "Start with the physical axis—up versus down—then learn each extended pair as a complete frame: 上课/下课, 上车/下车, 上周/下周.",
    teachingAngle: "Do not translate the character alone. Box the full pair around it and ask whether the frame describes position, motion, routine, or time.",
    items: [
      { character: "上", pinyin: "shàng", label: "Above, upward, on, or previous", rule: "上 locates things on/above, directs movement upward, starts class or boards transport, and marks the previous time unit.", signal: "Higher, beginning/on, or one period back", examples: [{ hanzi: "桌上", pinyin: "zhuō shàng", meaning: "on the table" }, { hanzi: "上车", pinyin: "shàng chē", meaning: "get on a vehicle" }, { hanzi: "上个月", pinyin: "shàng ge yuè", meaning: "last month" }] },
      { character: "下", pinyin: "xià", label: "Below, downward, off, or next", rule: "下 locates things under/below, directs movement downward, ends class or exits transport, and marks the next time unit.", signal: "Lower, ending/off, or one period ahead", examples: [{ hanzi: "桌下", pinyin: "zhuō xià", meaning: "under the table" }, { hanzi: "下车", pinyin: "xià chē", meaning: "get off a vehicle" }, { hanzi: "下个月", pinyin: "xià ge yuè", meaning: "next month" }] },
    ],
    mistakes: [{ wrong: "书在桌下（book is on top）", correct: "书在桌上", explanation: "A surface supporting the book takes 上." }, { wrong: "到站以后请上车", correct: "到站以后请下车", explanation: "Leaving the vehicle at the stop is 下车." }, { wrong: "上周（intended next week）", correct: "下周", explanation: "The following time period uses 下; 上 points to the previous one." }],
    memoryTips: ["Place the pair on a vertical timeline: 上 is earlier and 下 is later.", "For vehicles and class, 上 joins/starts while 下 leaves/ends."],
    faqs: [{ question: "Why does 上周 mean last week rather than next week?", answer: "Mandarin maps the ordered timeline as earlier ‘above’ and later ‘below’. Learn 上周/下周 as a fixed directional pair." }, { question: "Is 桌上 different from 桌子上面?", answer: "Both can mean on the table. The longer form makes the location noun more explicit; context determines which sounds more natural." }],
    worksheetWords: ["桌上", "桌下", "上车", "下车", "上周", "下周"], relatedSlugs: ["来-去", "好-坏", "人-入"],
  },
  {
    slug: "好-坏", category: "Direction and contrast", characters: ["好", "坏"],
    title: "好 vs 坏: Quality, Readiness, and Broken States",
    description: "Compare 好 and 坏 beyond good/bad: quality judgments, completed readiness with 好, changed broken states with 坏了, and common word families.",
    heading: "好 vs 坏: more than a simple good-and-bad pair",
    intro: "The contrast begins with positive and negative evaluation, then expands into whether work is ready, equipment is broken, or food has spoiled.",
    decisionRule: "Use 好 for positive quality or successful readiness; use 坏 for negative quality, malfunction, spoilage, or harmful behavior. Add 了 when a new state has emerged.",
    teachingAngle: "Name the object and diagnose its state: quality judgment, task completion, machine failure, food spoilage, or behavior. That diagnosis chooses the useful pattern.",
    items: [
      { character: "好", pinyin: "hǎo / hào", label: "Positive quality or ready result", rule: "好 evaluates positively, completes actions in result complements, and signals that something is ready or settled.", signal: "Good, suitable, ready, successfully finished", examples: [{ hanzi: "很好", pinyin: "hěn hǎo", meaning: "very good" }, { hanzi: "写好了", pinyin: "xiě hǎo le", meaning: "finished writing" }, { hanzi: "准备好了", pinyin: "zhǔnbèi hǎo le", meaning: "ready" }] },
      { character: "坏", pinyin: "huài", label: "Negative quality or damaged state", rule: "坏 evaluates negatively and describes objects that break, food that spoils, weather that turns bad, or harmful conduct.", signal: "Bad, broken, spoiled, harmful", examples: [{ hanzi: "天气很坏", pinyin: "tiānqì hěn huài", meaning: "the weather is bad" }, { hanzi: "电脑坏了", pinyin: "diànnǎo huài le", meaning: "the computer broke" }, { hanzi: "牛奶坏了", pinyin: "niúnǎi huài le", meaning: "the milk spoiled" }] },
    ],
    mistakes: [{ wrong: "作业坏了", correct: "作业没写好", explanation: "An unfinished or poorly completed assignment is not normally a physically broken object." }, { wrong: "电脑不好了（intended broke）", correct: "电脑坏了", explanation: "For a clear equipment failure, 坏了 is the direct changed-state expression." }, { wrong: "饭写好了", correct: "饭做好了", explanation: "The result complement must attach to the action used to prepare the meal." }],
    memoryTips: ["好 can be the target result after an action; 坏 often diagnoses a failed or spoiled state.", "With 了, ask what changed: became ready or became broken."],
    faqs: [{ question: "Does 不好 always mean bad?", answer: "It can mean not good, unsuitable, unwell, or a polite negative evaluation. Context and tone make it softer than the direct 坏 in many situations." }, { question: "Can 好 mean ‘easy to’ or ‘pleasant to’?", answer: "In compounds such as 好吃 and 好看, it evaluates the experience positively. The exact English rendering follows the second character." }],
    worksheetWords: ["很好", "不好", "写好了", "准备好了", "坏了", "好坏"], relatedSlugs: ["不-没", "上-下", "的-得-地"],
  },
  {
    slug: "人-入", category: "Shape and recognition", characters: ["人", "入"],
    title: "人 vs 入: Stroke Order Differences",
    description: "Tell 人 (person) from 入 (enter) by stroke order, crossing position, opening shape, vocabulary context, and short handwriting drills.",
    heading: "人 vs 入: use the first stroke and crossing point",
    intro: "In some fonts these two-stroke characters look almost identical. Handwriting reveals the distinction through which stroke begins, which stroke is longer, and where the forms open.",
    decisionRule: "人 begins with the left-falling stroke and opens like a standing person. 入 begins with the shorter right-falling stroke, then a longer left-falling stroke crosses and covers it.",
    teachingAngle: "Watch the pen rather than the finished silhouette. Say the stroke direction aloud and mark the crossing point before increasing writing speed.",
    items: [
      { character: "人", pinyin: "rén", label: "Person or people", rule: "Write the left fall first and the right fall second. The finished form opens broadly below.", signal: "Person vocabulary and a wide lower opening", examples: [{ hanzi: "一个人", pinyin: "yí ge rén", meaning: "one person" }, { hanzi: "家人", pinyin: "jiārén", meaning: "family members" }, { hanzi: "中国人", pinyin: "Zhōngguó rén", meaning: "Chinese person" }] },
      { character: "入", pinyin: "rù", label: "Enter or join", rule: "Write the short right-falling stroke first, then the longer left-falling stroke across it. In print, the upper crossing is conspicuous.", signal: "Movement inward or joining", examples: [{ hanzi: "入口", pinyin: "rùkǒu", meaning: "entrance" }, { hanzi: "进入", pinyin: "jìnrù", meaning: "enter" }, { hanzi: "加入", pinyin: "jiārù", meaning: "join" }] },
    ],
    mistakes: [{ wrong: "入口 written with 人", correct: "入口", explanation: "An entrance uses 入 for movement inward, not 人 for a person." }, { wrong: "人 starts with the right fall", correct: "人 starts with the left fall", explanation: "Reversing the order removes the key handwriting cue." }, { wrong: "入 copied as a symmetrical V", correct: "入 has a short first stroke crossed by a longer second stroke", explanation: "The unequal strokes and crossing distinguish it from a generic symbol." }],
    memoryTips: ["人 stands open; 入 crosses inward.", "Use a meaning pair: 人 at the 入口—a person at the entrance."],
    faqs: [{ question: "Why do 人 and 入 look the same in some typefaces?", answer: "Font design can reduce the visible crossing and stroke-direction cues. Vocabulary context and learned stroke order remain dependable." }, { question: "Does 入 become a radical in other characters?", answer: "Yes, it appears as a component in characters such as 全, though historical component analysis and modern printed shapes may vary." }],
    worksheetWords: ["人", "入", "家人", "入口", "中国人", "进入"], relatedSlugs: ["牛-午", "上-下", "来-去"],
  },
  {
    slug: "牛-午", category: "Shape and recognition", characters: ["牛", "午"],
    title: "牛 vs 午: How to Tell Them Apart",
    description: "Distinguish 牛 (cow; impressive) from 午 (noon) by the central vertical, horizontal crossing, stroke sequence, word families, and guided practice.",
    heading: "牛 vs 午: check where the vertical crosses",
    intro: "牛 and 午 share four familiar strokes, but the central vertical behaves differently. That small structural cue separates cattle and slang from noon and time words.",
    decisionRule: "In 牛, the central vertical passes through both horizontals and extends below. In 午, the vertical starts below the short top stroke group and passes through the long central horizontal.",
    teachingAngle: "Highlight the long crossbar, then trace the vertical path. Meaning confirms the shape: animal or impressive uses 牛; noon and midday time uses 午.",
    items: [
      { character: "牛", pinyin: "niú", label: "Cow, ox, or impressive", rule: "The central vertical pierces both horizontal levels. Literal cattle vocabulary and informal praise use the same rising-tone reading.", signal: "Animal, beef, milk, or informal excellence", examples: [{ hanzi: "牛奶", pinyin: "niúnǎi", meaning: "milk" }, { hanzi: "牛肉", pinyin: "niúròu", meaning: "beef" }, { hanzi: "他很牛", pinyin: "tā hěn niú", meaning: "he is impressive" }] },
      { character: "午", pinyin: "wǔ", label: "Noon and midday periods", rule: "The upper left-falling stroke and short horizontal sit above the long crossbar; the vertical anchors the lower centre.", signal: "Noon, morning, afternoon", examples: [{ hanzi: "中午", pinyin: "zhōngwǔ", meaning: "noon" }, { hanzi: "上午", pinyin: "shàngwǔ", meaning: "morning" }, { hanzi: "下午", pinyin: "xiàwǔ", meaning: "afternoon" }] },
    ],
    mistakes: [{ wrong: "中牛", correct: "中午", explanation: "The time word for noon uses 午." }, { wrong: "午奶", correct: "牛奶", explanation: "Milk belongs to the cattle word family and uses 牛." }, { wrong: "牛 with a vertical stopping at the lower bar", correct: "牛's vertical extends through and below the crossing", explanation: "The extended central line is the clearest handwritten identity cue." }],
    memoryTips: ["牛 has horns crossed by a full central spine; 午 marks the middle of the day.", "Write 牛奶 at 上午 to place both characters in one meaningful memory sentence."],
    faqs: [{ question: "Does slang 牛 use a different character or tone?", answer: "No. Informal 牛 meaning impressive uses the same character and niú pronunciation as the animal; context supplies the slang sense." }, { question: "Is 午 used alone to say twelve o'clock?", answer: "Modern everyday speech normally uses 十二点. 午 is most visible in compounds such as 中午, 上午, and 下午." }],
    worksheetWords: ["牛", "午", "牛奶", "中午", "牛肉", "下午"], relatedSlugs: ["人-入", "上-下", "好-坏"],
  },
];

export function getComparisonPage(slug: string): ComparisonPage | undefined {
  try {
    const decoded = decodeURIComponent(slug);
    return comparisonPages.find((page) => page.slug === decoded);
  } catch {
    return undefined;
  }
}

export function getComparisonPagesForCharacter(character: string): ComparisonPage[] {
  return comparisonPages.filter((page) => page.characters.includes(character));
}
