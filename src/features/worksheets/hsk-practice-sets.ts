import official from "./hsk-2025-beginner-source.json";
import type { WorksheetEntry, WorksheetTemplate } from "./types";

export const HSK_SYLLABUS_URL = official.sourceUrl;
export const HSK_LAUNCH_URL = "https://old.chinesetest.cn/gonewcontent.do?flag=kdnew&id=51336883";
export type Bilingual = readonly [string, string];
export type PracticeSet = { id: string; title: Bilingual; task: Bilingual; words: readonly (readonly [string, string])[] };
export type HskPracticePack = { slug: string; level: 1 | 2; title: Bilingual; description: Bilingual; sets: PracticeSet[] };

export const hskPracticePacks: HskPracticePack[] = [
  {
    slug: "hsk-3-0-level-1-writing", level: 1,
    title: ["HSK 3.0 Level 1 Writing Worksheets", "HSK 3.0 一级书写练习纸"],
    description: ["Practise 30 selected HSK 3.0 Level 1 words from the 2025 exam syllabus. Choose a ten-word set, review Pinyin and meanings, then edit and export a PDF.", "从 2025 年 11 月考试大纲的一级词汇中选编 30 词。选择一组 10 词，核对拼音和释义，再编辑并生成 PDF。"],
    sets: [
      { id: "people", title: ["People and family", "人物与家庭"], task: ["Cover the meanings and identify each family member before writing. Note the neutral final syllables in 爸爸 and 妈妈.", "先遮住释义，认出各个家庭成员，再练习书写。留意“爸爸、妈妈”等词的轻声。"], words: [["爸爸", "father"], ["妈妈", "mother"], ["哥哥", "older brother"], ["姐姐", "older sister"], ["弟弟", "younger brother"], ["妹妹", "younger sister"], ["家人", "family members"], ["孩子", "child"], ["老师", "teacher"], ["学生", "student"]] },
      { id: "time", title: ["Days and time", "日期与时间"], task: ["Read each time expression, then arrange 今天、明天、昨天 in a timeline. Write the full word rather than an isolated character.", "读出时间词，把“今天、明天、昨天”放到时间线上。练习完整词语，不只抄写其中一个字。"], words: [["今天", "today"], ["明天", "tomorrow"], ["昨天", "yesterday"], ["上午", "morning"], ["下午", "afternoon"], ["晚上", "evening"], ["早上", "early morning"], ["现在", "now"], ["时候", "time; moment"], ["时间", "time"]] },
      { id: "food", title: ["Food and drink", "食物与饮品"], task: ["Group foods separately from drinks. After tracing, use a blank row to recall one item without looking at its model.", "把食物与饮品分开归类。描红后，在空白行尝试不看示范写出一个词。"], words: [["米饭", "cooked rice"], ["吃", "to eat"], ["包子", "steamed bun"], ["饺子", "dumpling"], ["鸡蛋", "egg"], ["牛奶", "milk"], ["水果", "fruit"], ["苹果", "apple"], ["水", "water"], ["茶", "tea"]] },
    ],
  },
  {
    slug: "hsk-3-0-level-2-writing", level: 2,
    title: ["HSK 3.0 Level 2 Writing Worksheets", "HSK 3.0 二级书写练习纸"],
    description: ["Practise 30 words introduced at HSK 3.0 Level 2 in the 2025 exam syllabus. Choose study, travel or daily descriptions, then create a writing PDF.", "从 2025 年 11 月考试大纲二级新增词汇中选编 30 词，分为学习、出行和日常描述三组，每组 10 词，不重复一级练习包。"],
    sets: [
      { id: "study", title: ["Study and classroom", "学习与课堂"], task: ["Separate objects such as 本子 and 笔 from actions such as 教 and 介绍. Here 教 is jiāo, to teach.", "把“本子、笔”等物品词与“教、介绍”等动作词分开。这里“教”读 jiāo，表示传授。"], words: [["教室", "classroom"], ["本子", "notebook"], ["笔", "pen; writing instrument"], ["词", "word"], ["教", "to teach"], ["介绍", "to introduce"], ["记得", "to remember"], ["开学", "to start a school term"], ["考", "to take a test"], ["考试", "exam; to take an exam"]] },
      { id: "travel", title: ["Getting around", "交通与出行"], task: ["Distinguish 机场 from 机票 and 左边 from 右边. Keep the two characters of each place or direction term together.", "区分“机场”与“机票”、“左边”与“右边”。留意地点词和方位词的完整字形。"], words: [["车站", "station"], ["地铁", "subway"], ["公交车", "city bus"], ["机场", "airport"], ["机票", "air ticket"], ["酒店", "hotel"], ["旅游", "to travel"], ["路", "road"], ["左边", "left side"], ["右边", "right side"]] },
      { id: "daily", title: ["Descriptions and activity", "描述与活动"], task: ["Use the colour words to label familiar objects. Review the whole words 身体 and 运动 before attempting recall mode.", "用颜色词描述身边的物品。在默写前，先核对“身体、运动”等完整词语。"], words: [["颜色", "colour"], ["白色", "white"], ["黑色", "black"], ["红色", "red"], ["绿色", "green"], ["裤子", "trousers"], ["身体", "body; health"], ["眼睛", "eyes"], ["运动", "exercise; sport"], ["游泳", "to swim"]] },
    ],
  },
];

export function getHskPracticePack(slug: string | undefined) {
  return hskPracticePacks.find(pack => pack.slug === slug);
}

export function getHskPracticeEntries(slug: string, setId?: string): WorksheetEntry[] | undefined {
  const pack = getHskPracticePack(slug);
  if (!pack) return undefined;
  const sets = setId ? pack.sets.filter(set => set.id === setId) : pack.sets;
  if (!sets.length) return undefined;
  return sets.flatMap(set => set.words.map(([hanzi, english]) => {
    const row = official.entries.find(entry => entry.level === pack.level && entry.hanzi === hanzi);
    if (!row) throw new Error(`Unverified exam vocabulary: ${hanzi}`);
    return { id: `${pack.slug}-${row.number}`, hanzi, pinyin: row.pinyin, english, status: "complete" as const };
  }));
}

export const hskPracticeTemplates: WorksheetTemplate[] = hskPracticePacks.map(pack => ({
  slug: pack.slug, recommendedProfile: "adult", title: `HSK 3.0 Level ${pack.level}`, chineseTitle: `${pack.level === 1 ? "一级" : "二级"}词汇选编`,
  seoTitle: `HSK 3.0 Level ${pack.level} Writing: 30 Words`, description: pack.description[0],
  learningGoal: `Review 30 selected Level ${pack.level} vocabulary entries through guided writing and recall; this teaching selection does not cover the whole syllabus.`,
  teachingTip: `Start with one Level ${pack.level} ten-word group, check its readings and English teaching cues, and edit any wording to match your classroom before printing.`,
  practiceActivity: `Trace the Level ${pack.level} models first, then make a separate recall sheet. Cover the model, write each complete word from its cue, and compare your own answers.`,
  age: "Teens & Adults", level: `HSK 3.0 Level ${pack.level} · 2025 exam syllabus`, category: "hsk", wordCount: 30,
  entries: getHskPracticeEntries(pack.slug)!,
}));
