import type { WorksheetEntry, WorksheetTemplate } from "./types";
import hskVocabulary from "./hsk-vocabulary.json";

type VocabularyRecord = {
  hanzi: string;
  pinyin: string;
  english: string;
};

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

const vocabularyRecords: VocabularyRecord[] = Array.from(
  new Map(
    [
      ...(hskVocabulary as VocabularyRecord[]),
      ...curatedVocabularyRecords,
      ...templateVocabularyRecords,
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

const baseWorksheetTemplates: WorksheetTemplate[] = [
  {
    slug: "family",
    recommendedProfile: "kids",
    title: "Family",
    chineseTitle: "我的家人",
    description: "Essential family words for early bilingual learners.",
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
    description: "Write and recognize Chinese numbers from one to ten.",
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
    description: "Common colors with tracing and writing practice.",
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
    description: "Useful greetings for the first weeks of class.",
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
    description: "Calendar vocabulary for classroom routines.",
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
    description: "Everyday food words for home and classroom practice.",
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
    description: "Friendly animal vocabulary for younger children.",
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
    description: "A starter set of high-frequency HSK vocabulary.",
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

type TemplateDraft = Omit<WorksheetTemplate, "entries" | "wordCount"> & {
  words: string[];
};

const additionalTemplateDrafts: TemplateDraft[] = [
  {
    slug: "school-classroom",
    recommendedProfile: "kids",
    title: "School & Classroom",
    chineseTitle: "学校与教室",
    description: "Useful classroom words for instructions, objects, and daily lessons.",
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
    description: "Build a reusable worksheet around everyday actions and routines.",
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
    description: "Weather, temperature, and season vocabulary for classroom calendars.",
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
    description: "High-utility body and health words for home and beginner classes.",
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
    description: "Name rooms, furniture, and familiar objects around the home.",
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
    description: "Practise common transport, stations, and movement words.",
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
    description: "A practical travel set for tickets, hotels, directions, and arrival.",
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
    description: "Price, size, colour, and payment vocabulary for practical dialogues.",
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
    description: "Make ordering food and paying the bill easier to practise.",
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
    description: "Talk about favourite activities, sports, music, and creative hobbies.",
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
    description: "A seasonal worksheet for Spring Festival traditions and greetings.",
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
    description: "Common jobs and workplace vocabulary for older learners.",
    age: "Teens & Adults",
    level: "Elementary",
    category: "topics",
    words: ["工作", "公司", "办公室", "老板", "同事", "老师", "医生", "护士", "司机", "服务员", "工人", "商人", "经理", "工程师", "职业"],
  },
];

function buildTemplate(draft: TemplateDraft): WorksheetTemplate {
  const { words, ...metadata } = draft;
  const entries = entriesFor(words);
  return { ...metadata, entries, wordCount: entries.length };
}

export const worksheetTemplates: WorksheetTemplate[] = [
  ...baseWorksheetTemplates.map((template) => {
    const words = expandedTemplateWords[template.slug];
    if (!words) {
      return { ...template, wordCount: template.entries.length };
    }
    const entries = entriesFor(words);
    return { ...template, entries, wordCount: entries.length };
  }),
  ...additionalTemplateDrafts.map(buildTemplate),
];
