import type { WorksheetEntry, WorksheetTemplate } from "./types";
import hskVocabulary from "./hsk-vocabulary.json";

type VocabularyRecord = {
  hanzi: string;
  pinyin: string;
  english: string;
};

type TemplateGuidance = Pick<
  WorksheetTemplate,
  "learningGoal" | "teachingTip" | "practiceActivity"
>;

type WorksheetTemplateSeed = Omit<WorksheetTemplate, keyof TemplateGuidance>;

const curatedVocabularyRecords: VocabularyRecord[] = [
  { hanzi: "家庭", pinyin: "jiātíng", english: "family" },
  { hanzi: "妈妈", pinyin: "māma", english: "mother" },
  { hanzi: "爸爸", pinyin: "bàba", english: "father" },
  { hanzi: "哥哥", pinyin: "gēge", english: "older brother" },
  { hanzi: "姐姐", pinyin: "jiějie", english: "older sister" },
  { hanzi: "弟弟", pinyin: "dìdi", english: "younger brother" },
  { hanzi: "妹妹", pinyin: "mèimei", english: "younger sister" },
  { hanzi: "爷爷", pinyin: "yéye", english: "grandfather" },
  { hanzi: "奶奶", pinyin: "nǎinai", english: "grandmother" },
  { hanzi: "外公", pinyin: "wàigōng", english: "maternal grandfather" },
  { hanzi: "外婆", pinyin: "wàipó", english: "maternal grandmother" },
  { hanzi: "儿子", pinyin: "érzi", english: "son" },
  { hanzi: "女儿", pinyin: "nǚ'ér", english: "daughter" },
  { hanzi: "丈夫", pinyin: "zhàngfu", english: "husband" },
  { hanzi: "妻子", pinyin: "qīzi", english: "wife" },
  { hanzi: "叔叔", pinyin: "shūshu", english: "uncle" },
  { hanzi: "阿姨", pinyin: "āyí", english: "aunt" },
  { hanzi: "表哥", pinyin: "biǎogē", english: "older male cousin" },
  { hanzi: "表姐", pinyin: "biǎojiě", english: "older female cousin" },
  { hanzi: "表弟", pinyin: "biǎodì", english: "younger male cousin" },
  { hanzi: "表妹", pinyin: "biǎomèi", english: "younger female cousin" },
  { hanzi: "父母", pinyin: "fùmǔ", english: "parents" },
  { hanzi: "孩子", pinyin: "háizi", english: "child" },
  { hanzi: "亲戚", pinyin: "qīnqi", english: "relative" },
  { hanzi: "一", pinyin: "yī", english: "one" },
  { hanzi: "二", pinyin: "èr", english: "two" },
  { hanzi: "三", pinyin: "sān", english: "three" },
  { hanzi: "四", pinyin: "sì", english: "four" },
  { hanzi: "五", pinyin: "wǔ", english: "five" },
  { hanzi: "六", pinyin: "liù", english: "six" },
  { hanzi: "七", pinyin: "qī", english: "seven" },
  { hanzi: "八", pinyin: "bā", english: "eight" },
  { hanzi: "九", pinyin: "jiǔ", english: "nine" },
  { hanzi: "十", pinyin: "shí", english: "ten" },
  { hanzi: "红色", pinyin: "hóngsè", english: "red" },
  { hanzi: "蓝色", pinyin: "lánsè", english: "blue" },
  { hanzi: "绿色", pinyin: "lǜsè", english: "green" },
  { hanzi: "黄色", pinyin: "huángsè", english: "yellow" },
  { hanzi: "黑色", pinyin: "hēisè", english: "black" },
  { hanzi: "白色", pinyin: "báisè", english: "white" },
  { hanzi: "你好", pinyin: "nǐ hǎo", english: "hello" },
  { hanzi: "早上好", pinyin: "zǎoshang hǎo", english: "good morning" },
  { hanzi: "谢谢", pinyin: "xièxie", english: "thank you" },
  { hanzi: "再见", pinyin: "zàijiàn", english: "goodbye" },
  { hanzi: "请", pinyin: "qǐng", english: "please" },
  { hanzi: "星期一", pinyin: "xīngqīyī", english: "Monday" },
  { hanzi: "星期二", pinyin: "xīngqī'èr", english: "Tuesday" },
  { hanzi: "一月", pinyin: "yīyuè", english: "January" },
  { hanzi: "今天", pinyin: "jīntiān", english: "today" },
  { hanzi: "米饭", pinyin: "mǐfàn", english: "rice" },
  { hanzi: "面条", pinyin: "miàntiáo", english: "noodles" },
  { hanzi: "水", pinyin: "shuǐ", english: "water" },
  { hanzi: "茶", pinyin: "chá", english: "tea" },
  { hanzi: "苹果", pinyin: "píngguǒ", english: "apple" },
  { hanzi: "猫", pinyin: "māo", english: "cat" },
  { hanzi: "狗", pinyin: "gǒu", english: "dog" },
  { hanzi: "熊猫", pinyin: "xióngmāo", english: "panda" },
  { hanzi: "兔子", pinyin: "tùzi", english: "rabbit" },
  { hanzi: "鸟", pinyin: "niǎo", english: "bird" },
  { hanzi: "我", pinyin: "wǒ", english: "I; me" },
  { hanzi: "你", pinyin: "nǐ", english: "you" },
  { hanzi: "他", pinyin: "tā", english: "he; him" },
  { hanzi: "她", pinyin: "tā", english: "she; her" },
  { hanzi: "是", pinyin: "shì", english: "to be" },
  { hanzi: "老师", pinyin: "lǎoshī", english: "teacher" },
  { hanzi: "学生", pinyin: "xuésheng", english: "student" },
  { hanzi: "中国", pinyin: "Zhōngguó", english: "China" },
  { hanzi: "中文", pinyin: "Zhōngwén", english: "Chinese language" },
];

const templateVocabularyRecords: VocabularyRecord[] = [
  { hanzi: "深", pinyin: "shēn", english: "deep; dark" },
  { hanzi: "浅", pinyin: "qiǎn", english: "shallow; light" },
  { hanzi: "您好", pinyin: "nín hǎo", english: "hello (polite)" },
  { hanzi: "星期三", pinyin: "xīngqīsān", english: "Wednesday" },
  { hanzi: "星期四", pinyin: "xīngqīsì", english: "Thursday" },
  { hanzi: "星期五", pinyin: "xīngqīwǔ", english: "Friday" },
  { hanzi: "星期六", pinyin: "xīngqīliù", english: "Saturday" },
  { hanzi: "二月", pinyin: "èryuè", english: "February" },
  { hanzi: "三月", pinyin: "sānyuè", english: "March" },
  { hanzi: "咖啡", pinyin: "kāfēi", english: "coffee" },
  { hanzi: "汤", pinyin: "tāng", english: "soup" },
  { hanzi: "马", pinyin: "mǎ", english: "horse" },
  { hanzi: "牛", pinyin: "niú", english: "cow" },
  { hanzi: "羊", pinyin: "yáng", english: "sheep" },
  { hanzi: "鸭", pinyin: "yā", english: "duck" },
  { hanzi: "老虎", pinyin: "lǎohǔ", english: "tiger" },
  { hanzi: "狮子", pinyin: "shīzi", english: "lion" },
  { hanzi: "猴子", pinyin: "hóuzi", english: "monkey" },
  { hanzi: "大象", pinyin: "dàxiàng", english: "elephant" },
  { hanzi: "洗脸", pinyin: "xǐliǎn", english: "wash one's face" },
  { hanzi: "刷牙", pinyin: "shuāyá", english: "brush one's teeth" },
  { hanzi: "吃早饭", pinyin: "chī zǎofàn", english: "eat breakfast" },
  { hanzi: "吃晚饭", pinyin: "chī wǎnfàn", english: "eat dinner" },
  { hanzi: "看电视", pinyin: "kàn diànshì", english: "watch television" },
  { hanzi: "做作业", pinyin: "zuò zuòyè", english: "do homework" },
  { hanzi: "暖和", pinyin: "nuǎnhuo", english: "warm" },
  { hanzi: "鼻子", pinyin: "bízi", english: "nose" },
  { hanzi: "耳朵", pinyin: "ěrduo", english: "ear" },
  { hanzi: "客厅", pinyin: "kètīng", english: "living room" },
  { hanzi: "卧室", pinyin: "wòshì", english: "bedroom" },
  { hanzi: "厨房", pinyin: "chúfáng", english: "kitchen" },
  { hanzi: "卫生间", pinyin: "wèishēngjiān", english: "bathroom" },
  { hanzi: "窗户", pinyin: "chuānghu", english: "window" },
  { hanzi: "冰箱", pinyin: "bīngxiāng", english: "refrigerator" },
  { hanzi: "沙发", pinyin: "shāfā", english: "sofa" },
  { hanzi: "火车站", pinyin: "huǒchēzhàn", english: "train station" },
  { hanzi: "行李", pinyin: "xíngli", english: "luggage" },
  { hanzi: "到达", pinyin: "dàodá", english: "arrive" },
  { hanzi: "城市", pinyin: "chéngshì", english: "city" },
  { hanzi: "裤子", pinyin: "kùzi", english: "trousers" },
  { hanzi: "现金", pinyin: "xiànjīn", english: "cash" },
  { hanzi: "点菜", pinyin: "diǎncài", english: "order dishes" },
  { hanzi: "服务员", pinyin: "fúwùyuán", english: "server" },
  { hanzi: "盘子", pinyin: "pánzi", english: "plate" },
  { hanzi: "结账", pinyin: "jiézhàng", english: "pay the bill" },
  { hanzi: "跑步", pinyin: "pǎobù", english: "run" },
  { hanzi: "游泳", pinyin: "yóuyǒng", english: "swim" },
  { hanzi: "足球", pinyin: "zúqiú", english: "football" },
  { hanzi: "羽毛球", pinyin: "yǔmáoqiú", english: "badminton" },
  { hanzi: "跳舞", pinyin: "tiàowǔ", english: "dance" },
  { hanzi: "画画", pinyin: "huàhuà", english: "draw pictures" },
  { hanzi: "拍照", pinyin: "pāizhào", english: "take a photo" },
  { hanzi: "红包", pinyin: "hóngbāo", english: "red envelope" },
  { hanzi: "灯笼", pinyin: "dēnglong", english: "lantern" },
  { hanzi: "年糕", pinyin: "niángāo", english: "New Year rice cake" },
  { hanzi: "团圆", pinyin: "tuányuán", english: "family reunion" },
  { hanzi: "拜年", pinyin: "bàinián", english: "give New Year greetings" },
  { hanzi: "烟花", pinyin: "yānhuā", english: "fireworks" },
  { hanzi: "龙", pinyin: "lóng", english: "dragon" },
  { hanzi: "舞狮", pinyin: "wǔshī", english: "lion dance" },
  { hanzi: "祝福", pinyin: "zhùfú", english: "good wishes" },
  { hanzi: "传统", pinyin: "chuántǒng", english: "tradition" },
  { hanzi: "老板", pinyin: "lǎobǎn", english: "boss" },
  { hanzi: "护士", pinyin: "hùshi", english: "nurse" },
  { hanzi: "工程师", pinyin: "gōngchéngshī", english: "engineer" },
  { hanzi: "职业", pinyin: "zhíyè", english: "occupation" },
];

const p0TemplateVocabularyRecords: VocabularyRecord[] = [
  { hanzi: "\u6a2a", pinyin: "heng", english: "horizontal stroke" },
  { hanzi: "\u7ad6", pinyin: "shu", english: "vertical stroke" },
  { hanzi: "\u6487", pinyin: "pie", english: "left-falling stroke" },
  { hanzi: "\u637a", pinyin: "na", english: "right-falling stroke" },
  { hanzi: "\u70b9", pinyin: "dian", english: "dot stroke" },
  { hanzi: "\u63d0", pinyin: "ti", english: "rising stroke" },
  { hanzi: "\u6298", pinyin: "zhe", english: "turning stroke" },
  { hanzi: "\u94a9", pinyin: "gou", english: "hook stroke" },
  { hanzi: "\u5f2f", pinyin: "wan", english: "curved stroke" },
  { hanzi: "\u659c\u94a9", pinyin: "xie gou", english: "slanting hook" },
  { hanzi: "\u7ad6\u94a9", pinyin: "shu gou", english: "vertical hook" },
  { hanzi: "\u6a2a\u6298", pinyin: "heng zhe", english: "horizontal turn" },
  { hanzi: "\u6a2a\u6487", pinyin: "heng pie", english: "horizontal left-falling stroke" },
  { hanzi: "\u70b9\u63d0", pinyin: "dian ti", english: "dot and rising stroke" },
  { hanzi: "\u7ad6\u5f2f\u94a9", pinyin: "shu wan gou", english: "vertical bend hook" },
  { hanzi: "\u5367\u94a9", pinyin: "wo gou", english: "lying hook" },
  { hanzi: "\u4ebb", pinyin: "ren", english: "person radical" },
  { hanzi: "\u6c35", pinyin: "shui", english: "water radical" },
  { hanzi: "\u624c", pinyin: "shou", english: "hand radical" },
  { hanzi: "\u8279", pinyin: "cao", english: "grass radical" },
  { hanzi: "\u5fc4", pinyin: "xin", english: "heart radical" },
  { hanzi: "\u8ba0", pinyin: "yan", english: "speech radical" },
  { hanzi: "\u5b80", pinyin: "mian", english: "roof radical" },
  { hanzi: "\u8fb6", pinyin: "chuo", english: "walk radical" },
  { hanzi: "\u9485", pinyin: "jin", english: "metal radical" },
  { hanzi: "\u7e9f", pinyin: "si", english: "silk radical" },
  { hanzi: "\u9963", pinyin: "shi", english: "food radical" },
  { hanzi: "\u72ad", pinyin: "quan", english: "dog radical" },
  { hanzi: "\u7592", pinyin: "bing", english: "sickness radical" },
  { hanzi: "\u8864", pinyin: "yi", english: "clothing radical" },
  { hanzi: "\u793b", pinyin: "shi", english: "spirit radical" },
  { hanzi: "\u961d", pinyin: "fu", english: "mound radical" },
  { hanzi: "\u6535", pinyin: "pu", english: "tap radical" },
  { hanzi: "\u5202", pinyin: "dao", english: "knife radical" },
  { hanzi: "\u51ab", pinyin: "bing", english: "ice radical" },
  { hanzi: "\u56d7", pinyin: "wei", english: "enclosure radical" },
  { hanzi: "\u6728", pinyin: "mu", english: "wood" },
  { hanzi: "\u706b", pinyin: "huo", english: "fire" },
  { hanzi: "\u7530", pinyin: "tian", english: "field" },
  { hanzi: "\u6625\u7720\u4e0d\u89c9\u6653", pinyin: "chun mian bu jue xiao", english: "spring sleep, unaware of dawn" },
  { hanzi: "\u5904\u5904\u95fb\u557c\u9e1f", pinyin: "chu chu wen ti niao", english: "birdsong is heard everywhere" },
  { hanzi: "\u591c\u6765\u98ce\u96e8\u58f0", pinyin: "ye lai feng yu sheng", english: "wind and rain sounded at night" },
  { hanzi: "\u82b1\u843d\u77e5\u591a\u5c11", pinyin: "hua luo zhi duo shao", english: "who knows how many flowers fell" },
  { hanzi: "\u5e8a\u524d\u660e\u6708\u5149", pinyin: "chuang qian ming yue guang", english: "bright moonlight before the bed" },
  { hanzi: "\u7591\u662f\u5730\u4e0a\u971c", pinyin: "yi shi di shang shuang", english: "it seems like frost on the ground" },
  { hanzi: "\u4e3e\u5934\u671b\u660e\u6708", pinyin: "ju tou wang ming yue", english: "raise the head and gaze at the moon" },
  { hanzi: "\u4f4e\u5934\u601d\u6545\u4e61", pinyin: "di tou si gu xiang", english: "lower the head and think of home" },
  { hanzi: "\u767d\u65e5\u4f9d\u5c71\u5c3d", pinyin: "bai ri yi shan jin", english: "the white sun sets beyond the hills" },
  { hanzi: "\u9ec4\u6cb3\u5165\u6d77\u6d41", pinyin: "huang he ru hai liu", english: "the Yellow River flows into the sea" },
  { hanzi: "\u6b32\u7a77\u5343\u91cc\u76ee", pinyin: "yu qiong qian li mu", english: "to see a thousand li farther" },
  { hanzi: "\u66f4\u4e0a\u4e00\u5c42\u697c", pinyin: "geng shang yi ceng lou", english: "climb one more storey" },
  { hanzi: "\u9504\u79be\u65e5\u5f53\u5348", pinyin: "chu he ri dang wu", english: "hoe grain under the noon sun" },
  { hanzi: "\u6c57\u6ef4\u79be\u4e0b\u571f", pinyin: "han di he xia tu", english: "sweat drops into the soil" },
  { hanzi: "\u8c01\u77e5\u76d8\u4e2d\u9910", pinyin: "shui zhi pan zhong can", english: "who knows the food in the bowl" },
  { hanzi: "\u7c92\u7c92\u7686\u8f9b\u82e6", pinyin: "li li jie xin ku", english: "every grain comes from hard work" },
];

const vocabularyRecords: VocabularyRecord[] = Array.from(
  new Map(
    [
      ...(hskVocabulary as VocabularyRecord[]),
      ...curatedVocabularyRecords,
      ...templateVocabularyRecords,
      ...p0TemplateVocabularyRecords,
    ].map(
      (record) => [record.hanzi, record],
    ),
  ).values(),
);

export const localVocabularySize = vocabularyRecords.length;

export const vocabularyByEnglish = new Map(
  vocabularyRecords.map((record) => [record.english.toLowerCase(), record]),
);

export const vocabularyByHanzi = new Map(
  vocabularyRecords.map((record) => [record.hanzi, record]),
);

function entriesFor(words: string[]): WorksheetEntry[] {
  return words.map((word, index) => {
    const record =
      vocabularyByHanzi.get(word) ?? vocabularyByEnglish.get(word.toLowerCase());

    return {
      id: `row-${index + 1}`,
      hanzi: record?.hanzi ?? word,
      pinyin: record?.pinyin ?? "",
      english: record?.english ?? "",
      status: record ? "complete" : "needs-review",
    };
  });
}

const familyWords = curatedVocabularyRecords
  .slice(0, 24)
  .map((item) => item.hanzi);

const baseWorksheetTemplates: WorksheetTemplateSeed[] = [
  {
    slug: "family",
    recommendedProfile: "kids",
    title: "Family",
    chineseTitle: "我的家人",
    description: "Practise words for parents, siblings, grandparents, and other close family members.",
    age: "Ages 4–8",
    level: "Beginner",
    wordCount: 24,
    category: "kids",
    entries: entriesFor(familyWords),
  },
  {
    slug: "numbers",
    recommendedProfile: "kids",
    title: "Numbers",
    chineseTitle: "数字",
    description: "Practise zero to ten, larger number units, and the Chinese word for number.",
    age: "Ages 4–8",
    level: "Beginner",
    wordCount: 20,
    category: "kids",
    entries: entriesFor(["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]),
  },
  {
    slug: "colors",
    recommendedProfile: "kids",
    title: "Colors",
    chineseTitle: "颜色",
    description: "Practise basic colour names, short forms such as 红 and 蓝, and words for light and dark shades.",
    age: "Ages 4–8",
    level: "Beginner",
    wordCount: 16,
    category: "topics",
    entries: entriesFor(["红色", "蓝色", "绿色", "黄色", "黑色", "白色"]),
  },
  {
    slug: "greetings",
    recommendedProfile: "adult",
    title: "Greetings",
    chineseTitle: "问候语",
    description: "Practise greetings, thanks, apologies, polite questions, and phrases for meeting someone.",
    age: "All ages",
    level: "Beginner",
    wordCount: 18,
    category: "topics",
    entries: entriesFor(["你好", "早上好", "谢谢", "再见", "请"]),
  },
  {
    slug: "days-months",
    recommendedProfile: "kids",
    title: "Days & Months",
    chineseTitle: "星期与月份",
    description: "Practise weekdays, early months, and time words such as today, tomorrow, and weekend.",
    age: "Ages 6+",
    level: "Elementary",
    wordCount: 20,
    category: "topics",
    entries: entriesFor(["星期一", "星期二", "一月", "今天"]),
  },
  {
    slug: "food-drinks",
    recommendedProfile: "kids",
    title: "Food & Drinks",
    chineseTitle: "食物与饮品",
    description: "Practise words for staple foods, drinks, fruit, and the three main meals of the day.",
    age: "Ages 6–10",
    level: "Elementary",
    wordCount: 28,
    category: "topics",
    entries: entriesFor(["米饭", "面条", "水", "茶", "苹果"]),
  },
  {
    slug: "animals-kids",
    recommendedProfile: "kids",
    title: "Animals for Kids",
    chineseTitle: "动物",
    description: "Practise familiar pets, farm animals, birds, and zoo animals with younger learners.",
    age: "Ages 4–8",
    level: "Beginner",
    wordCount: 24,
    category: "kids",
    entries: entriesFor(["猫", "狗", "熊猫", "兔子", "鸟"]),
  },
  {
    slug: "hsk-1",
    recommendedProfile: "adult",
    title: "HSK 1 Writing Practice",
    chineseTitle: "HSK 一级",
    description: "Practise a starter group of HSK 1 pronouns, verbs, people, places, and classroom words.",
    age: "Teens & Adults",
    level: "HSK 1",
    wordCount: 150,
    category: "hsk",
    entries: entriesFor(["我", "你", "他", "她", "是", "老师", "学生", "中国", "中文"]),
  },
];

const expandedTemplateWords: Record<string, string[]> = {
  numbers: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "百", "千", "万", "数字"],
  colors: ["红色", "蓝色", "绿色", "黄色", "黑色", "白色", "颜色", "红", "蓝", "绿", "黄", "黑", "白", "深", "浅"],
  greetings: ["你好", "早上好", "谢谢", "再见", "请", "不客气", "对不起", "没关系", "欢迎", "晚安", "您好", "早", "请问", "认识", "见面"],
  "days-months": ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日", "一月", "二月", "三月", "今天", "明天", "昨天", "日期", "周末"],
  "food-drinks": ["米饭", "面条", "水", "茶", "苹果", "菜", "水果", "鸡蛋", "牛奶", "咖啡", "面包", "肉", "鱼", "饺子", "汤", "早饭", "午饭", "晚饭"],
  "animals-kids": ["猫", "狗", "熊猫", "兔子", "鸟", "鱼", "马", "牛", "羊", "鸡", "鸭", "老虎", "狮子", "猴子", "大象"],
  "hsk-1": ["我", "你", "他", "她", "是", "有", "在", "好", "不", "人", "老师", "学生", "学校", "中国", "中文", "学习", "写", "读", "说", "听"],
};

type TemplateDraft = Omit<WorksheetTemplateSeed, "entries" | "wordCount"> & {
  words: string[];
};

const additionalTemplateDrafts: TemplateDraft[] = [
  {
    slug: "school-classroom",
    recommendedProfile: "kids",
    title: "School & Classroom",
    chineseTitle: "学校与教室",
    description: "Practise the people, objects, instructions, and tasks students meet in a Chinese classroom.",
    age: "Ages 6+",
    level: "Beginner",
    category: "kids",
    words: ["老师", "学生", "学校", "教室", "书", "本子", "笔", "桌子", "椅子", "学习", "写", "读", "说", "听", "问题", "回答", "作业", "考试"],
  },
  {
    slug: "daily-routine",
    recommendedProfile: "adult",
    title: "Daily Routine",
    chineseTitle: "日常生活",
    description: "Practise words for getting up, going to school, eating, and going to bed.",
    age: "Ages 8+",
    level: "Elementary",
    category: "topics",
    words: ["起床", "洗脸", "刷牙", "吃早饭", "上班", "上学", "下班", "回家", "吃晚饭", "睡觉", "休息", "洗澡", "看电视", "读书", "学习", "做作业"],
  },
  {
    slug: "weather-seasons",
    recommendedProfile: "kids",
    title: "Weather & Seasons",
    chineseTitle: "天气与季节",
    description: "Practise weather conditions, temperature words, and the names of all four seasons.",
    age: "Ages 6+",
    level: "Elementary",
    category: "topics",
    words: ["天气", "晴", "阴", "多云", "下雨", "下雪", "风", "热", "冷", "暖和", "凉快", "春天", "夏天", "秋天", "冬天", "温度"],
  },
  {
    slug: "body-health",
    recommendedProfile: "adult",
    title: "Body & Health",
    chineseTitle: "身体与健康",
    description: "Practise body parts, common health words, and vocabulary for doctors, hospitals, and rest.",
    age: "Ages 8+",
    level: "Elementary",
    category: "topics",
    words: ["头", "脸", "眼睛", "鼻子", "嘴", "耳朵", "手", "脚", "身体", "医生", "医院", "药", "生病", "疼", "健康", "运动", "休息"],
  },
  {
    slug: "home-rooms",
    recommendedProfile: "kids",
    title: "Home & Rooms",
    chineseTitle: "家与房间",
    description: "Practise rooms, furniture, appliances, and other objects children see around the home.",
    age: "Ages 6+",
    level: "Beginner",
    category: "kids",
    words: ["家", "房间", "客厅", "卧室", "厨房", "卫生间", "门", "窗户", "桌子", "椅子", "床", "灯", "电视", "冰箱", "沙发"],
  },
  {
    slug: "transportation",
    recommendedProfile: "adult",
    title: "Transportation",
    chineseTitle: "交通工具",
    description: "Practise vehicles, stations, travel verbs, and simple words for routes and departure.",
    age: "Ages 8+",
    level: "Elementary",
    category: "topics",
    words: ["车", "汽车", "公共汽车", "地铁", "火车", "飞机", "船", "自行车", "出租车", "车站", "机场", "路", "开", "走", "到", "出发"],
  },
  {
    slug: "travel",
    recommendedProfile: "adult",
    title: "Travel Chinese",
    chineseTitle: "旅行中文",
    description: "Practise the words needed for passports, tickets, hotels, luggage, directions, and arrival.",
    age: "Teens & Adults",
    level: "Elementary",
    category: "topics",
    words: ["旅行", "旅游", "护照", "地图", "酒店", "房间", "机场", "火车站", "票", "行李", "出发", "到达", "城市", "国家", "照片", "方向"],
  },
  {
    slug: "shopping",
    recommendedProfile: "adult",
    title: "Shopping Chinese",
    chineseTitle: "购物中文",
    description: "Practise prices, sizes, colours, clothes, and common words for paying in a shop.",
    age: "Teens & Adults",
    level: "Elementary",
    category: "topics",
    words: ["商店", "超市", "买", "卖", "钱", "元", "块", "贵", "便宜", "多少", "衣服", "鞋", "裤子", "颜色", "大", "小", "现金", "卡"],
  },
  {
    slug: "restaurant",
    recommendedProfile: "adult",
    title: "Restaurant Chinese",
    chineseTitle: "餐厅中文",
    description: "Practise menu words, tableware, ordering food, and paying the bill in a restaurant.",
    age: "Teens & Adults",
    level: "Elementary",
    category: "topics",
    words: ["饭馆", "菜单", "点菜", "服务员", "筷子", "碗", "盘子", "米饭", "面条", "菜", "肉", "鱼", "水", "茶", "好吃", "结账"],
  },
  {
    slug: "hobbies-sports",
    recommendedProfile: "adult",
    title: "Hobbies & Sports",
    chineseTitle: "爱好与运动",
    description: "Practise words for sport, music, films, reading, drawing, dancing, and taking photos.",
    age: "Ages 8+",
    level: "Elementary",
    category: "topics",
    words: ["喜欢", "爱好", "运动", "跑步", "游泳", "打球", "篮球", "足球", "羽毛球", "唱歌", "跳舞", "画画", "音乐", "电影", "读书", "拍照"],
  },
  {
    slug: "chinese-new-year",
    recommendedProfile: "adult",
    title: "Chinese New Year",
    chineseTitle: "春节",
    description: "Practise words for New Year greetings, family gatherings, food, and festival activities.",
    age: "All ages",
    level: "Elementary",
    category: "topics",
    words: ["春节", "新年", "快乐", "红包", "灯笼", "饺子", "年糕", "家庭", "团圆", "拜年", "烟花", "龙", "舞狮", "祝福", "传统"],
  },
  {
    slug: "jobs-work",
    recommendedProfile: "adult",
    title: "Jobs & Work",
    chineseTitle: "工作与职业",
    description: "Practise common occupations and the people, places, and roles found at work.",
    age: "Teens & Adults",
    level: "Elementary",
    category: "topics",
    words: ["工作", "公司", "办公室", "老板", "同事", "老师", "医生", "护士", "司机", "服务员", "工人", "商人", "经理", "工程师", "职业"],
  },
];

const p0TemplateDrafts: TemplateDraft[] = [
  {
    slug: "hsk-2",
    recommendedProfile: "adult",
    title: "HSK 2 Writing Practice",
    chineseTitle: "HSK \u4e8c\u7ea7",
    description: "Practise HSK 2 connectors, classroom actions, time words, and short sentence-building vocabulary.",
    age: "Teens & Adults",
    level: "HSK 2",
    category: "hsk",
    words: ["\u65f6\u95f4", "\u95ee\u9898", "\u56e0\u4e3a", "\u6240\u4ee5", "\u4f46\u662f", "\u89c9\u5f97", "\u77e5\u9053", "\u5e2e\u52a9", "\u51c6\u5907", "\u53ef\u80fd", "\u5e94\u8be5", "\u5982\u679c", "\u5df2\u7ecf", "\u4e00\u8d77", "\u516c\u53f8", "\u53bb\u5e74", "\u9ad8\u5174", "\u8fd0\u52a8"],
  },
  {
    slug: "hsk-3",
    recommendedProfile: "adult",
    title: "HSK 3 Writing Practice",
    chineseTitle: "HSK \u4e09\u7ea7",
    description: "Practise HSK 3 transition words, opinions, study terms, and everyday phrases for longer answers.",
    age: "Teens & Adults",
    level: "HSK 3",
    category: "hsk",
    words: ["\u867d\u7136", "\u800c\u4e14", "\u53c2\u52a0", "\u5dee\u4e0d\u591a", "\u6210\u7ee9", "\u51fa\u73b0", "\u6253\u7b97", "\u5730\u65b9", "\u53d1\u73b0", "\u653e\u5fc3", "\u6545\u4e8b", "\u8fc7\u53bb", "\u4e00\u5b9a", "\u6700\u8fd1", "\u7ecf\u5e38", "\u660e\u767d", "\u52aa\u529b", "\u76f8\u4fe1"],
  },
  {
    slug: "basic-strokes",
    recommendedProfile: "kids",
    title: "Basic Chinese Strokes",
    chineseTitle: "\u57fa\u672c\u7b14\u753b",
    description: "Practise the core Chinese writing strokes before learners copy full characters in a grid.",
    age: "Ages 4+",
    level: "Beginner",
    category: "kids",
    words: ["\u6a2a", "\u7ad6", "\u6487", "\u637a", "\u70b9", "\u63d0", "\u6298", "\u94a9", "\u5f2f", "\u659c\u94a9", "\u7ad6\u94a9", "\u6a2a\u6298", "\u6a2a\u6487", "\u70b9\u63d0", "\u7ad6\u5f2f\u94a9", "\u5367\u94a9"],
  },
  {
    slug: "radicals",
    recommendedProfile: "adult",
    title: "Chinese Radicals",
    chineseTitle: "\u6c49\u5b57\u90e8\u9996",
    description: "Practise common radical forms that help learners recognise meaning groups inside Chinese characters.",
    age: "Ages 8+",
    level: "Beginner",
    category: "topics",
    words: ["\u4ebb", "\u6c35", "\u624c", "\u8279", "\u5fc4", "\u8ba0", "\u5b80", "\u8fb6", "\u9485", "\u7e9f", "\u9963", "\u72ad", "\u7592", "\u8864", "\u793b", "\u961d", "\u6535", "\u5202", "\u51ab", "\u56d7"],
  },
  {
    slug: "pinyin-practice",
    recommendedProfile: "kids",
    title: "Pinyin and Hanzi Practice",
    chineseTitle: "\u62fc\u97f3\u4e0e\u6c49\u5b57",
    description: "Practise familiar Hanzi with Pinyin shown above each writing row for sound-form review.",
    age: "Ages 6+",
    level: "Beginner",
    category: "topics",
    words: ["\u7231", "\u7238\u7238", "\u676f\u5b50", "\u5317\u4eac", "\u5403", "\u5927", "\u7535\u8111", "\u7535\u89c6", "\u8bfb", "\u5de5\u4f5c", "\u6c49\u8bed", "\u4eca\u5929", "\u8001\u5e08", "\u660e\u5929", "\u670b\u53cb", "\u8bf7", "\u8ba4\u8bc6", "\u5b66\u751f"],
  },
  {
    slug: "stroke-order-practice",
    recommendedProfile: "kids",
    title: "Stroke Order Practice",
    chineseTitle: "\u7b14\u987a\u7ec3\u4e60",
    description: "Practise simple high-frequency characters with stroke-order guidance turned on by default in the worksheet generator.",
    age: "Ages 6+",
    level: "Beginner",
    category: "topics",
    words: ["\u4e00", "\u4e8c", "\u4e09", "\u5341", "\u4eba", "\u53e3", "\u65e5", "\u6708", "\u6728", "\u6c34", "\u706b", "\u5c71", "\u7530", "\u4e2d", "\u5927"],
  },
  {
    slug: "classical-poem-copying",
    recommendedProfile: "adult",
    title: "Classical Poem Copying",
    chineseTitle: "\u53e4\u8bd7\u6284\u5199",
    description: "Copy short classical Chinese poem lines in writing grids for handwriting rhythm and cultural reading practice.",
    age: "Ages 8+",
    level: "Elementary",
    category: "topics",
    words: ["\u6625\u7720\u4e0d\u89c9\u6653", "\u5904\u5904\u95fb\u557c\u9e1f", "\u591c\u6765\u98ce\u96e8\u58f0", "\u82b1\u843d\u77e5\u591a\u5c11", "\u5e8a\u524d\u660e\u6708\u5149", "\u7591\u662f\u5730\u4e0a\u971c", "\u4e3e\u5934\u671b\u660e\u6708", "\u4f4e\u5934\u601d\u6545\u4e61", "\u767d\u65e5\u4f9d\u5c71\u5c3d", "\u9ec4\u6cb3\u5165\u6d77\u6d41", "\u6b32\u7a77\u5343\u91cc\u76ee", "\u66f4\u4e0a\u4e00\u5c42\u697c", "\u9504\u79be\u65e5\u5f53\u5348", "\u6c57\u6ef4\u79be\u4e0b\u571f", "\u8c01\u77e5\u76d8\u4e2d\u9910", "\u7c92\u7c92\u7686\u8f9b\u82e6"],
  },
];

const templateGuidance: Record<string, TemplateGuidance> = {
  family: {
    learningGoal: "Learners recognise and write common family titles, then connect each Hanzi word with the person it describes in everyday introductions.",
    teachingTip: "Group the words by immediate and extended family before writing. This gives younger learners a simple meaning pattern instead of one long list to memorise.",
    practiceActivity: "Ask learners to draw a small family tree, label each person with one word from the sheet, and finish by introducing two relatives aloud.",
  },
  numbers: {
    learningGoal: "Learners write the core Chinese number characters accurately and use them as building blocks for larger numbers, dates, ages, and classroom counting.",
    teachingTip: "Practise zero to ten first, then combine familiar characters into new numbers. Say each number aloud before tracing so sound, meaning, and form stay connected.",
    practiceActivity: "Call out five numbers in a mixed order for students to write, then let them create a date, age, or price using the same characters.",
  },
  colors: {
    learningGoal: "Learners identify and write common Chinese colour words, including the shorter forms used when colours describe familiar classroom and household objects.",
    teachingTip: "Pair every colour with a real object or coloured card. Contrast two colours at a time so learners attach each written form to a visible meaning.",
    practiceActivity: "Students choose five objects nearby, write the matching colour beside each object name, and read the completed colour phrases to a partner.",
  },
  greetings: {
    learningGoal: "Learners write and distinguish greetings, thanks, apologies, and polite expressions they can reuse when meeting, helping, or leaving another speaker.",
    teachingTip: "Teach the phrases in short conversational pairs rather than isolation. Learners remember the writing more easily when each expression has a clear response.",
    practiceActivity: "Put learners in pairs to choose a greeting, a polite question, and a closing phrase, then copy and perform their three-line exchange.",
  },
  "days-months": {
    learningGoal: "Learners write weekday, month, and relative-time words and use them to recognise how Chinese dates and simple calendar statements are assembled.",
    teachingTip: "Keep a calendar visible while students write. Point out repeated components such as 星期 and 月 so the longer words feel like predictable combinations.",
    practiceActivity: "Students write today, tomorrow, and one planned date, then swap papers and read their partner's three calendar expressions aloud.",
  },
  "food-drinks": {
    learningGoal: "Learners recognise and write everyday foods, drinks, fruit, and meal words that support simple choices, preferences, and classroom menu conversations.",
    teachingTip: "Sort the vocabulary into food, drink, and meal groups before tracing. Invite learners to mark familiar items so the first practice round starts with meaning they know.",
    practiceActivity: "Learners design a three-item meal, copy the selected food and drink words, and use the finished list to tell a partner what they would choose.",
  },
  "animals-kids": {
    learningGoal: "Younger learners recognise and write familiar pet, farm, bird, and zoo animal words while connecting each written form to a concrete creature.",
    teachingTip: "Use animal pictures or sounds before showing the Hanzi. Let learners predict the animal, then trace its word while repeating the pronunciation slowly.",
    practiceActivity: "Students sort six animals into home, farm, or zoo groups, write one word in each group, and explain which animal they like best.",
  },
  "hsk-1": {
    learningGoal: "Beginning HSK learners build accurate recall of high-frequency pronouns, verbs, people, places, and classroom words required for basic reading and writing.",
    teachingTip: "Divide the list into small semantic sets and review one set at a time. Alternate tracing with no-model recall so recognition develops into independent writing.",
    practiceActivity: "Choose ten words for a timed review: trace each once, hide the model, write it again from Pinyin or English, and circle items needing another round.",
  },
  "school-classroom": {
    learningGoal: "Learners write the people, objects, instructions, and tasks they encounter in school, making classroom Chinese easier to recognise and use.",
    teachingTip: "Point to real classroom objects and actions while introducing their words. Physical context prevents similar-looking new characters from becoming an abstract list.",
    practiceActivity: "Students label five classroom objects, copy two instruction words, and use the completed sheet for a short classroom scavenger hunt.",
  },
  "daily-routine": {
    learningGoal: "Learners write common actions from waking to bedtime and organise them into a meaningful sequence for describing an ordinary day.",
    teachingTip: "Arrange the words chronologically before handwriting practice. Ask learners to compare the list with their own routine and replace unfamiliar activities when useful.",
    practiceActivity: "Students select six routine words, number them in personal order, write each one, and use the sequence to describe their day to a partner.",
  },
  "weather-seasons": {
    learningGoal: "Learners recognise and write weather conditions, temperature descriptions, and season names used in forecasts and everyday observations.",
    teachingTip: "Begin with the day's real weather and current season. Contrast hot with cold and rain with snow before adding less immediate forecast vocabulary.",
    practiceActivity: "Students create a three-day mini forecast by choosing weather and temperature words, writing them beside each day, and presenting the forecast aloud.",
  },
  "body-health": {
    learningGoal: "Learners write key body parts, health states, and care words needed to describe simple symptoms and understand basic help-seeking language.",
    teachingTip: "Separate body-part words from symptoms and places of care. Use neutral examples and allow learners to skip personal health details while practising the language.",
    practiceActivity: "Students match four body words with simple health statements, copy the key vocabulary, and role-play asking where something hurts.",
  },
  "home-rooms": {
    learningGoal: "Learners recognise and write rooms, furniture, appliances, and household objects used when describing where things are at home.",
    teachingTip: "Organise the list room by room and begin with the learner's own home. Spatial grouping makes the vocabulary easier to retrieve than alphabetical order.",
    practiceActivity: "Students sketch one room, label at least five objects with words from the sheet, and describe where two items are located.",
  },
  transportation: {
    learningGoal: "Learners write common vehicles, stations, travel actions, and route words used to discuss how someone leaves, travels, and arrives.",
    teachingTip: "Group vehicles separately from places and actions, then recombine them in short travel chains. Compare similar transport words only after each is familiar.",
    practiceActivity: "Students plan a simple journey with one vehicle, one station, and two action words, then copy and explain the route in sequence.",
  },
  travel: {
    learningGoal: "Learners write practical words for documents, tickets, hotels, luggage, directions, departure, and arrival during an everyday trip.",
    teachingTip: "Teach the vocabulary through a journey timeline from preparation to arrival. Let learners mark the words they would need at each travel stage.",
    practiceActivity: "Students pack a fictional trip by selecting eight words, writing them as a checklist, and using three of them in a short travel request.",
  },
  shopping: {
    learningGoal: "Learners write words for shops, prices, sizes, colours, clothing, and payment so they can follow a simple buying conversation.",
    teachingTip: "Use price tags and two contrasting items to practise choice language. Review number and colour characters before introducing the full shopping set.",
    practiceActivity: "Students create two product cards with item, colour, size, and price words, then exchange cards and practise asking which item a partner wants.",
  },
  restaurant: {
    learningGoal: "Learners write menu, tableware, ordering, food, drink, and payment words that appear during a basic restaurant visit.",
    teachingTip: "Arrange the words in service order: arrival, menu, order, meal, and bill. Rehearse only a few items at each stage before combining them.",
    practiceActivity: "Students make a small menu with one drink and three foods, write a sample order, and role-play requesting the bill after the meal.",
  },
  "hobbies-sports": {
    learningGoal: "Learners write activity words for sport, music, film, reading, art, dance, and photography when discussing personal interests.",
    teachingTip: "Ask learners to sort activities into like, dislike, and want-to-try groups. Personal choices create a stronger reason to remember each written word.",
    practiceActivity: "Students choose three hobbies they enjoy and one they want to try, write the four words, and compare their choices with a partner.",
  },
  "chinese-new-year": {
    learningGoal: "Learners write Chinese New Year greetings, foods, family gathering words, decorations, and festival activities in their cultural context.",
    teachingTip: "Introduce the vocabulary with photos or personal stories and distinguish greetings from objects and activities. Explain regional variation where it affects meaning.",
    practiceActivity: "Students design a small New Year card using one greeting and three festival words, then explain the meaning of each selected item.",
  },
  "jobs-work": {
    learningGoal: "Learners write common occupations, workplaces, colleagues, and role words used to ask about or describe what someone does.",
    teachingTip: "Group occupations by workplace or service instead of memorising a flat list. Point out when one person word can appear in several professional contexts.",
    practiceActivity: "Students select four occupations, match each with a workplace or task, write the pairs, and use one pair to describe a fictional person.",
  },
};

const p0TemplateGuidance: Record<string, TemplateGuidance> = {
  "hsk-2": {
    learningGoal: "Learners write common HSK 2 words accurately and use connectors such as because, therefore, but, and if to prepare for short sentence practice.",
    teachingTip: "Split the words into function words, study words, and daily-life words before writing. Learners should say one example sentence aloud before copying each connector.",
    practiceActivity: "Students choose six words, write each one twice, then combine at least two connectors into a short written answer about school, work, or last year.",
  },
  "hsk-3": {
    learningGoal: "Learners practise HSK 3 words that support opinions, transitions, plans, and study reflection so handwriting review also strengthens longer written responses.",
    teachingTip: "Pair similar functions together, such as although and also or plan and discover. Short comparison groups help learners remember usage while they trace the forms.",
    practiceActivity: "Ask learners to copy eight words, mark the ones they can use in a full sentence, and write two original HSK-style sentences after the tracing rows.",
  },
  "basic-strokes": {
    learningGoal: "Learners build control of the core Chinese stroke shapes before moving into complete Hanzi, improving direction, proportion, and grid placement.",
    teachingTip: "Demonstrate one stroke direction at a time and keep the first round slow. Stroke names are less important than starting point, ending point, and pressure rhythm.",
    practiceActivity: "Students trace each stroke, circle the one that feels hardest, and use three selected strokes to build a simple character such as one, ten, or big.",
  },
  radicals: {
    learningGoal: "Learners recognise common radical forms and practise writing them as reusable building blocks that appear inside many Chinese characters.",
    teachingTip: "Teach radicals as shape clues, not full definitions. Show one or two example characters beside each radical only after learners have copied the radical form.",
    practiceActivity: "Students sort radicals into meaning groups, write five selected radicals again, and then find one character on the worksheet or in class that uses each form.",
  },
  "pinyin-practice": {
    learningGoal: "Learners connect familiar Hanzi forms with Pinyin readings while handwriting, strengthening sound-form recall before they practise without Pinyin support.",
    teachingTip: "Read each row aloud before tracing. Keep Pinyin visible for the first pass, then open the generator and switch to a test-style page for recall practice.",
    practiceActivity: "Students cover the Hanzi column, read the Pinyin, write the character from memory, and compare their result with the model row after each attempt.",
  },
  "stroke-order-practice": {
    learningGoal: "Learners practise high-frequency simple characters with stroke-order support, building habits they can transfer to larger compound words and templates.",
    teachingTip: "Keep stroke order visible at first and ask learners to air-write the sequence before using the pencil. Remove the guide only after the sequence feels stable.",
    practiceActivity: "Students trace the model once, write the character twice with stroke order visible, then hide the guide and try one final blank-grid copy.",
  },
  "classical-poem-copying": {
    learningGoal: "Learners copy short classical poem lines in balanced writing grids, practising rhythm, spacing, and familiar cultural texts without needing a full poem lesson.",
    teachingTip: "Read one couplet aloud before handwriting and explain only the gist. The goal is controlled copying and line rhythm, not a detailed literary analysis.",
    practiceActivity: "Students choose one four-line poem section, copy each line slowly, then read the copied lines aloud and mark the character that needs the most review.",
  },
};

function addTemplateGuidance(
  template: WorksheetTemplateSeed,
): WorksheetTemplate {
  const guidance = templateGuidance[template.slug] ?? p0TemplateGuidance[template.slug];
  if (!guidance) {
    throw new Error(`Missing template guidance for ${template.slug}`);
  }
  return { ...template, ...guidance };
}

function buildTemplate(draft: TemplateDraft): WorksheetTemplate {
  const { words, ...metadata } = draft;
  const entries = entriesFor(words);
  return addTemplateGuidance({
    ...metadata,
    entries,
    wordCount: entries.length,
  });
}

export const worksheetTemplates: WorksheetTemplate[] = [
  ...baseWorksheetTemplates.map((template) => {
    const words = expandedTemplateWords[template.slug];
    if (!words) {
      return addTemplateGuidance({
        ...template,
        wordCount: template.entries.length,
      });
    }
    const entries = entriesFor(words);
    return addTemplateGuidance({
      ...template,
      entries,
      wordCount: entries.length,
    });
  }),
  ...additionalTemplateDrafts.map(buildTemplate),
  ...p0TemplateDrafts.map(buildTemplate),
];
