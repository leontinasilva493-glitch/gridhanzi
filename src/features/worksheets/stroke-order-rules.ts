export interface StrokeOrderRuleExample {
  character: string;
  caption: string;
  sequence: string;
  guideCharacter?: string;
}

export interface StrokeOrderRule {
  slug: string;
  label: string;
  title: string;
  summary: string;
  explanation: string;
  examples: readonly StrokeOrderRuleExample[];
  practice: string;
}

export const strokeOrderRules: readonly StrokeOrderRule[] = [
  {
    slug: "top-to-bottom",
    label: "Rule 1",
    title: "Write from top to bottom",
    summary: "Complete the upper part before the lower part when a character is stacked vertically.",
    explanation: "A top-bottom plan keeps the upper component compact and leaves enough room for the lower section. In 二, the short upper horizontal comes before the longer baseline; in 学, the upper dots and cover are completed before 子.",
    examples: [
      { character: "二", caption: "Upper line before lower line", sequence: "top horizontal → lower horizontal", guideCharacter: "二" },
      { character: "学", caption: "Upper section before 子", sequence: "top marks → cover → child", guideCharacter: "学" },
    ],
    practice: "Write 二, 学, and 家 in one column, pausing after each upper section to check the remaining vertical space.",
  },
  {
    slug: "left-to-right",
    label: "Rule 2",
    title: "Write from left to right",
    summary: "Finish the left component before moving into the right side of a horizontal structure.",
    explanation: "The left component usually sets the width and center line for everything that follows. In 你, 亻 stays narrow before 尔 is built; in 好, 女 must leave a stable right-hand space for 子 rather than spreading across the whole square.",
    examples: [
      { character: "你", caption: "亻 before 尔", sequence: "person side → right component", guideCharacter: "你" },
      { character: "好", caption: "女 before 子", sequence: "woman → child", guideCharacter: "好" },
    ],
    practice: "Compare 你 and 好 in a Tian Zi Ge grid: keep each left component narrow, then center the completed character as a whole.",
  },
  {
    slug: "horizontal-before-vertical",
    label: "Rule 3",
    title: "Write horizontal strokes before vertical strokes",
    summary: "When a horizontal and vertical cross, the horizontal commonly establishes the span first.",
    explanation: "A horizontal stroke often fixes the character's width before a vertical stroke crosses or anchors it. 十 is the clearest model. In 王, three horizontals are placed from top to bottom before the central vertical ties the form together.",
    examples: [
      { character: "十", caption: "Set the width, then cross it", sequence: "horizontal → vertical" },
      { character: "王", caption: "Place three levels before the center line", sequence: "horizontals → central vertical" },
    ],
    practice: "Practise 十 and 王 slowly, checking that the vertical crosses at the intended center instead of correcting the width afterward.",
  },
  {
    slug: "falling-strokes",
    label: "Rule 4",
    title: "Write left-falling before right-falling",
    summary: "In paired falling strokes, place the left-falling stroke before the right-falling or dot stroke.",
    explanation: "The left-falling stroke establishes the opening angle. The right-falling stroke can then balance its length and weight. 人 shows the pair directly; 大 adds a horizontal first, then uses the same left-before-right balance underneath it.",
    examples: [
      { character: "人", caption: "Open left, balance right", sequence: "left-falling → right-falling", guideCharacter: "人" },
      { character: "大", caption: "Horizontal, then the falling pair", sequence: "horizontal → left-falling → right-falling", guideCharacter: "大" },
    ],
    practice: "Write alternating rows of 人 and 大, keeping the right-falling stroke supportive rather than letting both strokes lean in the same direction.",
  },
  {
    slug: "outside-before-inside",
    label: "Rule 5",
    title: "Build the outside before the inside",
    summary: "Start an enclosing shape before placing the content that it contains.",
    explanation: "An enclosure defines the available writing area. In 同, the outer 冂 begins before the inner 一 and 口. In 问, 门 establishes the frame before 口 is placed inside, preventing the center from drifting too high or low.",
    examples: [
      { character: "同", caption: "Open the frame before filling it", sequence: "outer frame → inner strokes → finish" },
      { character: "问", caption: "门 creates the space for 口", sequence: "door frame → mouth" },
    ],
    practice: "Draw the open frame of 同 and 问 first, stop to inspect the margins, and only then add the centered content.",
  },
  {
    slug: "close-the-frame-last",
    label: "Rule 6",
    title: "Fill an enclosure before closing it",
    summary: "Leave the closing baseline until the content inside a full frame is complete.",
    explanation: "A full enclosure is normally opened, filled, and then sealed. In 国, 囗 begins with its left and upper-right frame, 玉 is written inside, and the bottom horizontal closes the box. 日 follows the same open-fill-close rhythm.",
    examples: [
      { character: "国", caption: "囗 opens, 玉 enters, bottom closes", sequence: "open frame → inside → closing stroke" },
      { character: "日", caption: "Middle line before the base", sequence: "open frame → middle → closing baseline" },
    ],
    practice: "Write 国 with a visible pause before the final baseline; confirm that the inner 玉 has breathing room on all four sides.",
  },
  {
    slug: "center-before-sides",
    label: "Rule 7",
    title: "Write the center before balanced sides",
    summary: "When two side strokes depend on a central axis, establish that axis first.",
    explanation: "Characters such as 小 and 水 are balanced around a central movement. Starting with the center gives the side strokes a reference for height, distance, and direction instead of asking the writer to guess the middle afterward.",
    examples: [
      { character: "小", caption: "Center hook before the side dots", sequence: "center → left dot → right dot", guideCharacter: "小" },
      { character: "水", caption: "Central hook anchors both sides", sequence: "center → left side → right side", guideCharacter: "水" },
    ],
    practice: "Mark the vertical center of the grid, write 小 and 水 from that axis, then compare the empty space on the left and right.",
  },
  {
    slug: "crossing-stroke-late",
    label: "Rule 8",
    title: "Add a major crossing stroke after its supports",
    summary: "Some characters place supporting strokes first and use a later stroke to organize or cross them.",
    explanation: "This rule prevents an early long stroke from blocking the structure that must sit around it. 年 builds its upper and middle horizontals before the final vertical completes the lower alignment; 车 likewise delays its central vertical until the horizontal levels are in place.",
    examples: [
      { character: "年", caption: "Build the levels, finish the vertical", sequence: "upper strokes → lower horizontal → final vertical", guideCharacter: "年" },
      { character: "车", caption: "Horizontals organize the central line", sequence: "upper turn → horizontals → vertical" },
    ],
    practice: "Trace 年 once with numbered strokes, then write it from memory while checking that the last vertical does not pull the lower half off center.",
  },
];

export const strokeOrderExceptions = [
  {
    title: "Movement component 辶 often finishes late",
    description: "In characters such as 这, 过, and 还, the inner element is normally written before the sweeping movement stroke wraps underneath it.",
    character: "这",
  },
  {
    title: "The heart side 忄 has its own dot order",
    description: "The left dot, central vertical, and right dot form a compact side component. Do not treat it as a miniature 心 written in the same order.",
    character: "快",
  },
  {
    title: "A component can change with its position",
    description: "水 becomes 氵 on the left and 手 becomes 扌 on the left. Learn the positioned form as a writing unit instead of squeezing the full character into the space.",
    character: "没",
  },
] as const;
