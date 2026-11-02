import { HSK_LAUNCH_URL, HSK_SYLLABUS_URL, type Bilingual } from "./hsk-practice-sets";

export type LearningSection = { title: Bilingual; paragraphs: Bilingual[] };
export type LearningPage = {
  path: string; seoTitle?: Bilingual; title: Bilingual; description: Bilingual; intro: Bilingual;
  sections: LearningSection[];
  faqs: { question: Bilingual; answer: Bilingual }[];
  sources: { label: Bilingual; href: string }[];
};
const examSources = [
  { label: ["Official HSK exam syllabus (November 2025)", "官方《HSK 考试大纲》（2025 年 11 月）"] as Bilingual, href: HSK_SYLLABUS_URL },
  { label: ["CTI: December 13, 2026 global launch", "汉考国际：2026 年 12 月 13 日全球开考公告"] as Bilingual, href: HSK_LAUNCH_URL },
];
const strokeSources = [{ label: ["Hanzi Writer character-data source and attribution", "Hanzi Writer 字形数据来源与署名"] as Bilingual, href: "https://github.com/chanind/hanzi-writer-data" }];

export const basicStrokeLessons: { id: string; name: Bilingual; direction: Bilingual; example: string; path: string }[] = [
  { id: "horizontal", name: ["Horizontal · héng", "横 · héng"], direction: ["Move from left to right. Keep the line controlled rather than sweeping upward.", "从左向右行笔，控制斜度，不要一路向上挑。"], example: "一", path: "M16 50 L82 46" },
  { id: "vertical", name: ["Vertical · shù", "竖 · shù"], direction: ["Move downward. A vertical stroke does not automatically end with a hook.", "从上向下行笔。并非所有竖画都需要收成钩。"], example: "十", path: "M50 15 L50 84" },
  { id: "left-falling", name: ["Left-falling · piě", "撇 · piě"], direction: ["Begin toward the upper right and move down-left. Compare its direction with a right-falling stroke.", "从右上向左下行笔，注意与捺的方向相反。"], example: "人", path: "M64 17 Q60 53 19 81" },
  { id: "right-falling", name: ["Right-falling · nà", "捺 · nà"], direction: ["Move down-right and open the lower space. Do not mirror the left-falling stroke mechanically.", "向右下展开，为字的下部留出空间，不要把捺简单画成撇的镜像。"], example: "大", path: "M35 20 Q49 57 83 80" },
  { id: "dot", name: ["Dot · diǎn", "点 · diǎn"], direction: ["Use a short directed movement, not a circular spot. A dot's position depends on the whole character.", "点是短促且有方向的笔画，不是画一个圆点。点的位置由整个字决定。"], example: "六", path: "M42 28 Q58 40 60 56" },
  { id: "rising", name: ["Rising · tí", "提 · tí"], direction: ["Move from lower left toward upper right. It rises rather than falling like 撇.", "从左下向右上行笔，与向左下的撇不同。"], example: "地", path: "M20 76 L77 31" },
  { id: "hook", name: ["Hook family · vertical-hook example", "钩类 · 以竖钩为例"], direction: ["Continue from a vertical into a short hook as one stroke. Other hook shapes follow different paths.", "竖向下后接短钩，整体算一笔。其他钩类笔画的形状和方向不同。"], example: "小", path: "M55 15 L55 78 Q55 88 39 76" },
  { id: "turn", name: ["Turning family · horizontal-turn example", "折类 · 以横折为例"], direction: ["Move right, turn, then continue downward without lifting. A turn is not two separately counted strokes.", "向右行笔后转折向下，中途不抬笔。横折不能拆成两笔计算。"], example: "口", path: "M20 25 L79 25 L76 82" },
];

export const strokeMistakes: { character: string; title: Bilingual; wrong: Bilingual; correction: Bilingual; drill: Bilingual }[] = [
  { character: "我", title: ["我: leaving out the final dot", "我：漏掉最后一点"], wrong: ["The top strokes look familiar, so the small final dot gets omitted or added in the wrong place.", "写完主体后，容易漏掉最后一点，或把它挤到错误的位置。"], correction: ["Follow all seven strokes in the animation. The final stroke is a dot; it is not an extra left-falling stroke.", "逐笔核对完整的七画。最后一笔是点，不是再加一撇。"], drill: ["Trace once, then cover the model and count the strokes in your own copy.", "描红一遍，再盖住示范，边临写边自行数笔画。"] },
  { character: "水", title: ["水: treating every side as a separate straight line", "水：把两侧拆成几条直线"], wrong: ["Breaking the left folded stroke apart creates an extra stroke and disrupts the spacing.", "把左侧横撇拆开写，会多算笔画，也容易破坏间距。"], correction: ["Write the central vertical hook first. Watch the left folded movement as a connected stroke, then compare the two right-side strokes.", "先写中间竖钩，再看清左侧横撇的连贯动作，最后核对右侧两笔。"], drill: ["Pause after the centre stroke and leave balanced space for both sides.", "写完中间一笔后暂停，检查两侧是否留出了空间。"] },
  { character: "小", title: ["小: drawing the side marks first", "小：先写两侧，挤掉中间的位置"], wrong: ["Starting with the sides can leave too little room for the central vertical hook.", "先画两侧，容易让中间竖钩没有合适的位置。"], correction: ["Place the central vertical hook first, followed by the left and right side strokes.", "先定位中间竖钩，再写左、右两侧笔画。"], drill: ["Compare 小 with 水 to notice a shared central-first decision, not an identical full sequence.", "与“水”对照，找出先定位中间的共同点，不要把两个字的完整笔顺混为一谈。"] },
  { character: "国", title: ["国: sealing the box too early", "国：过早封口"], wrong: ["Closing the outer frame before 玉 makes the inner part cramped.", "里面的“玉”尚未写好就封口，会把内部空间挤窄。"], correction: ["Start the enclosing frame, write 玉 inside it, and close the bottom last.", "先写外框的起始部分，再写里面的“玉”，最后写底横封口。"], drill: ["Stop just before the bottom line and check the position of 玉.", "底横落笔前暂停，检查“玉”在框中的位置。"] },
  { character: "中", title: ["中: starting with the long middle vertical", "中：先写贯穿的竖"], wrong: ["The visible centre line tempts you to apply 'centre first' to the whole character.", "看到中间的长竖，容易把“先中间”机械套用到整个字。"], correction: ["Complete 口 first, then draw the vertical through it. General rules need character-specific checks.", "先写“口”，再写贯穿的竖。通用规则仍要用具体字的笔顺核对。"], drill: ["Watch 中 and 小 side by side; explain why 'centre first' does not give the same sequence.", "对照“中”与“小”，说明为什么不能对两字一律先写中间。"] },
  { character: "女", title: ["女: splitting the first stroke", "女：拆开第一笔"], wrong: ["Treating the first bent movement as two strokes changes the sequence and proportions.", "把第一笔的转向拆开写，会改变笔画数和比例。"], correction: ["Keep the first 撇点 connected, then write 撇 and the final 横.", "第一笔撇点保持连贯，然后写撇，最后写横。"], drill: ["Compare independent 女 with the narrower 女 on the left of 好.", "比较独体“女”与“好”左侧较窄的女字旁。"] },
  { character: "口", title: ["口: making a four-line rectangle", "口：把方框写成四条独立线"], wrong: ["A rectangle has four sides, but 口 is not written with four separate strokes.", "方框有四条边，但“口”不是四个独立笔画。"], correction: ["Write 竖, then the connected 横折, then the bottom 横: three strokes.", "依次写竖、连贯的横折、底横，共三画。"], drill: ["Trace the turning stroke without lifting, then copy a row of 口.", "横折处不抬笔描一遍，再临写一行“口”。"] },
  { character: "十", title: ["十: reversing the crossing strokes", "十：颠倒交叉笔画"], wrong: ["Writing the vertical first reverses the usual sequence for this character.", "先竖后横，会颠倒这个字的正确顺序。"], correction: ["Write the horizontal first and the vertical second. Keep their intersection near the centre.", "先横后竖，让交叉点靠近字的中心。"], drill: ["Check the order separately from the proportions: both can need correction.", "分别检查顺序与比例，不能只看两条线是否相交。"] },
  { character: "书", title: ["书: forgetting the final dot", "书：遗漏最后一点"], wrong: ["The crossing structure looks finished before the small dot is added.", "交叉的主体写好后，容易误以为整个字已经完成。"], correction: ["Check the four-stroke simplified form and add the dot in its proper position at the end.", "核对简体“书”的四画，最后把点写在正确的位置。"], drill: ["Compare the last stroke of 书 and 我 without assuming the rest of the sequence is shared.", "比较“书”和“我”的最后一笔，同时分别核对各自的其余笔顺。"] },
  { character: "心", title: ["心: writing every dot before the curved stroke", "心：把所有点都提前写完"], wrong: ["A rule such as 'dots last' or 'top first' cannot replace the full sequence.", "“点最后写”或“从上往下”不能替代完整笔顺。"], correction: ["Write the left dot, then 卧钩, then the remaining dots. Keep the dots attached visually to the same structure.", "先写左点，再写卧钩，接着写其余两点。各点的位置要与主体呼应。"], drill: ["Pause after each stroke in the animation and compare the empty spaces.", "逐笔暂停动画，比较各笔之间留下的空白。"] },
];

export const p1LearningPages: LearningPage[] = [
  {
    path: "/chinese-basic-strokes",
    seoTitle: ["Chinese Basic Strokes: Directions & Practice", "汉字基本笔画：方向、例字与练习"],
    title: ["Chinese Basic Strokes: Directions, Examples & Practice", "汉字基本笔画：方向、例字与练习"],
    description: ["Learn eight common Chinese stroke families with direction diagrams and examples. Check turns and pen lifts, then practise the complete characters.", "通过八类常见笔画的方向示意和例字，区分一笔与笔内转折，再用完整汉字进行屏幕或纸上练习。"],
    intro: ["Start with the movement, then check how it works inside a character. The diagrams below show eight common teaching families; they are not an exhaustive list of compound strokes or a calligraphy standard.", "先看清笔画怎样行进，再观察它在具体汉字中的位置。下面展示八类常见教学分组，并非全部复合笔画的穷尽分类，也不是书法规范字样。"],
    sections: [
      { title: ["A stroke is one connected movement", "一笔是一次连贯的行笔"], paragraphs: [["Count pen lifts, not just visible straight lines. In 口, the upper horizontal and right side form one 横折. Drawing each side separately would change a three-stroke character into four marks.", "数笔画时要看是否抬笔，不能只数看得见的直线。“口”的上横与右边组成一笔横折；四边分别画，就会把三画写成四笔。"], ["A hook is part of a stroke such as 竖钩, not an extra tick added after the rest of the character. Use the complete character animation to check when a movement turns or hooks.", "钩可以是竖钩等笔画的一部分，不是在字写完后额外补一个记号。用完整汉字动画检查转折和出钩发生在哪里。"]] },
      { title: ["Practise shape before speed", "先练形，再练速度"], paragraphs: [["Follow the arrow once, then write the example character slowly. Use the centre lines to compare height, width and empty space. A repeated wrong movement is a reason to stop and check, not to fill another page.", "先沿箭头看一遍，再慢写例字。借助中心线比较高低、宽窄和留白。如果同一个动作反复出错，先停下核对，再继续练习。"], ["Choose a small set such as 一、人、大、小、口. In the worksheet editor, Learn mode supplies stroke guides; Practice mode changes the tracing and blank space. A PDF is created only after you open the preview and choose Download PDF.", "可以从“一、人、大、小、口”这样的小组开始。编辑器的新字精学模式提供笔顺提示，描红临写模式调整练习引导。打开预览并点击下载后才会生成 PDF。"]] },
      { title: ["Use the character to settle exceptions", "用具体汉字核对例外"], paragraphs: [["Stroke direction and stroke order are different questions. Knowing how a vertical is drawn does not tell you whether it comes first in 中 or 小. Compare the character animation with the general stroke-order rules.", "笔画方向与笔顺是两个问题。知道竖怎样写，不代表能直接判断它在“中”或“小”里何时写。把单字动画与通用笔顺规则一起看。"]] },
    ],
    faqs: [
      { question: ["Are there only eight Chinese strokes?", "汉字只有八种笔画吗？"], answer: ["No. These are eight common teaching families. Compound strokes, hook shapes and classification systems have more detail; check the exact character rather than using the eight labels as a complete inventory.", "不是。这里是八类常见教学分组，复合笔画、不同钩形及不同分类体系还有更细的区别，具体书写要核对字形。"] },
      { question: ["Can I print isolated stroke diagrams?", "可以直接打印这些单笔画示意吗？"], answer: ["This page illustrates directions. The worksheet link creates practice with complete example characters; it does not claim to generate isolated-stroke calligraphy sheets.", "本页用示意说明方向。字帖入口制作的是完整例字练习，不承诺生成单笔画书法练习纸。"] },
      { question: ["Is a turn counted as another stroke?", "笔画中的转折要另算一笔吗？"], answer: ["Not when it is a connected compound stroke such as 横折. Check where the pen lifts in the character animation.", "横折等连贯复合笔画的转折不另算一笔，可用单字动画核对抬笔位置。"] },
    ], sources: strokeSources,
  },
  {
    path: "/chinese-stroke-order-mistakes",
    seoTitle: ["Chinese Stroke Order: 10 Mistakes to Fix", "汉字笔顺纠错：10 个具体案例与练习"],
    title: ["Chinese Stroke Order Mistakes: 10 Cases to Practise", "汉字笔顺纠错：10 个具体案例与练习"],
    description: ["Correct ten Chinese stroke-order mistakes with specific examples. Check each sequence, follow the correction, and create a focused writing worksheet.", "从“国”过早封口到“口”拆成四笔，逐项检查十个笔顺案例，对照动画确认改法，再制作小组纠错练习纸。"],
    intro: ["If a character looks almost right, separate three checks: the number of strokes, their order, and the space each one occupies. These are selected teaching cases, not a ranking of the hardest characters or measured user errors.", "字形看起来差不多时，可以分三步检查：笔画数、先后顺序、每笔占据的空间。这里是选编教学案例，不是最难汉字排名，也不是实际用户错误频率统计。"],
    sections: [
      { title: ["Find the first point of disagreement", "找到第一处不同"], paragraphs: [["Watch one stroke, pause, and compare your copy. If the first two strokes agree but the third does not, practise that transition rather than copying the whole character many more times. A missing dot is not fixed by making the other strokes darker.", "看一笔、暂停一次，再对照自己的字。前两笔相同而第三笔不同，就集中练这个衔接，不必盲目多抄整字。漏点也不能靠把其他笔画加重来解决。"]] },
      { title: ["Turn corrections into a small drill", "把改法变成小练习"], paragraphs: [["Choose two or three cases, check their animations, then make a Learn-mode sheet. Leave room for one unaided copy and compare it with the model yourself. The site supplies guides and practice space, not an exam handwriting score.", "每次选两三个案例，核对动画后制作新字精学练习纸。留一处不看示范临写，再自行与示范对照。网站提供提示和练习空间，不给出考试书写评分。"], ["When the problem is distinguishing two similar characters rather than their sequence, use the comparison guides. When you need the general pattern behind a case, return to the stroke-order rules page.", "如果问题是认不清两个形近字，可转到对比页；如果想理解案例背后的通用规律，再看笔顺规则页。"]] },
      { title: ["Keep the writing standard consistent", "保持字形标准一致"], paragraphs: [["The cases here use simplified characters. Traditional forms and regional standards can differ. Do not transfer a simplified stroke count to a different traditional form, and follow the materials specified by your teacher or exam centre.", "本页案例使用简体字。繁体字形与不同地区标准可能有差异，不要直接把简体笔画数套到另一种繁体字形上；考试或课程应遵循指定资料。"]] },
    ],
    faqs: [
      { question: ["Does a correct-looking character prove correct stroke order?", "字形看起来正确，就代表笔顺正确吗？"], answer: ["No. The final shape does not reveal every pen movement. Compare the sequence, then check the proportions separately.", "不代表。完成后的字形无法显示每一步行笔，顺序和比例需要分别核对。"] },
      { question: ["Can the page automatically grade my handwriting?", "本页会自动批改我的手写字吗？"], answer: ["No. It offers character animations, on-screen practice and printable worksheet links. You compare the examples and your writing yourself.", "不会。本页提供单字动画、屏幕练习和字帖入口，需自行对照示范检查。"] },
      { question: ["Should I always write dots last?", "所有点都最后写吗？"], answer: ["No. For example, 心 begins with its left dot. General rules are useful hints, while a character-specific sequence resolves the actual case.", "不是。例如“心”以左点起笔。通用规则是提示，实际案例还要看具体字的完整笔顺。"] },
    ], sources: strokeSources,
  },
  {
    path: "/hsk/3-0-vs-2-0",
    seoTitle: ["HSK 3.0 vs 2.0: Vocabulary & Syllabus", "HSK 3.0 与 2.0：怎样选词表和练习资料"],
    title: ["HSK 3.0 vs 2.0: Choose the Right Lists and Practice", "HSK 3.0 与 2.0：怎样选词表和练习资料"],
    description: ["Compare classic HSK vocabulary, the 2021 standard and the 2025 exam syllabus. Check beginner word counts and choose practice for your course.", "区分旧版 HSK 词表、2021 年等级标准与 2025 年 11 月考试大纲，核对日期和词汇计数，再选择版本明确的书写练习。"],
    intro: ["A file labelled 'HSK 3.0' is not enough to identify its content. Check the document edition, whether counts are new or cumulative, and which test or textbook you are using before making a study list.", "资料只写“HSK 3.0”，还不足以说明它采用什么内容。先看文档版本、词数是新增还是累计，再核对自己使用的考试或教材。"],
    sections: [
      { title: ["Three labels that need separating", "先分清三类资料"], paragraphs: [["Classic HSK 2.0 learning resources follow the familiar six-level path. The 2021 Chinese proficiency standard is a broader framework. The November 2025 exam syllabus is a separate published exam document; do not merge all three into one unlabelled list.", "旧版 HSK 2.0 学习资料采用熟悉的六级路径。2021 年《国际中文教育中文水平等级标准》是较广的能力框架；2025 年 11 月考试大纲则是另行发布的考试文件。三者不能不加说明地混成一个词表。"], ["A textbook lesson can include review vocabulary or teaching extensions. Its lesson word count does not need to equal the number of new entries in the exam syllabus. Record both the book edition and lesson when preparing classroom sheets.", "教材课次可能包括复习词和教学扩展，课次词数不必等于考试大纲的本级新增词数。备课练习纸应记录书名、版次和课次。"]] },
      { title: ["New entries are not cumulative totals", "新增条目与累计总量不同"], paragraphs: [["In the November 2025 syllabus, Level 1 lists entries 1–300. Level 2 adds entries 301–500: 200 new entries and 500 cumulative. A Level 2 pack can focus on new items while a mixed review sheet also includes Level 1 words.", "2025 年 11 月大纲中，一级列第 1–300 条，二级增加第 301–500 条：新增 200 条，累计 500 条。因此二级练习可以专练新增内容，也可以另做含一级词汇的混合复习。"], ["Our older community vocabulary browser shows 506 Level 1 rows under its 3.0 label. That third-party catalogue is retained for existing learning lists; the count is not the current exam syllabus total. The two new beginner packs use selections checked directly against the 2025 syllabus.", "既有社区词库在 3.0 一级下有 506 行，保留供原有学习流程使用；这个数字不是新版考试大纲的一级总量。本次新增的一、二级练习包采用直接对照 2025 年大纲核准的选词。"]] },
      { title: ["Separate the syllabus date from the exam date", "大纲实施日期与开考日期分别核对"], paragraphs: [["The syllabus cover says published November 2025, implemented July 2026. CTI's current global-launch notice names December 13, 2026 as the exam date. These dates refer to different arrangements; July on the cover does not by itself tell you which test your centre offers.", "大纲封面写明 2025 年 11 月发布、2026 年 7 月实施；汉考国际当前全球开考公告列出的考试日是 2026 年 12 月 13 日。两种日期对应不同安排，不能只凭封面上的 7 月判断当地考点提供哪种考试。"], ["The launch notice lists registration deadlines of November 16 for paper-based tests and December 3 for computer-based tests (Beijing Time). Check the linked notice and your centre before registering; availability depends on local arrangements.", "该开考公告列明报名截止时间：纸笔考为 11 月 16 日，机网考为 12 月 3 日，均按北京时间。报名前查看原公告并向当地考点确认具体安排。"]] },
      { title: ["Pick the practice that matches your task", "按这次任务选择练习"], paragraphs: [["For a teacher's lesson, use that lesson's actual words. For the 2025 exam syllabus, start with a source-labelled selection and check whether you need recognition or written production. For general handwriting, practise a small group without claiming it is a complete exam course.", "课堂练习用本课实际词表；按 2025 年考试大纲备考时，选来源明确的资料，并分清要认读还是要写出。日常练字则可先练一个小组，不必把它称为完整考试课程。"]] },
    ],
    faqs: [
      { question: ["Is a 506-row Level 1 list the same as the new 300-entry syllabus?", "506 行一级词库与新版 300 条考试词表相同吗？"], answer: ["No. They are differently sourced lists. Count and label the selected dataset before calling it a complete exam list.", "不同。它们来自不同资料，需核对采用的数据和版本后，才能称为完整考试词表。"] },
      { question: ["Should I discard my older textbook?", "旧教材需要直接弃用吗？"], answer: ["First check your course and exam arrangements. Older vocabulary can still be useful for learning; use a verified comparison rather than assuming every old item maps to the same new level.", "先核对课程与考试安排。旧词汇仍可用于学习，但不能假定它在新版里仍属于同一级，应依据核准资料对照。"] },
      { question: ["Does GridHanzi provide a complete HSK exam course?", "GridHanzi 提供完整 HSK 考试课程吗？"], answer: ["No. It provides vocabulary selection, character guides and writing worksheets. The beginner packs are selected practice material, not official mock tests or a full course.", "不提供。本工具提供选词、汉字学习与书写练习；入门练习包是选编材料，不是官方模拟题或完整课程。"] },
    ], sources: examSources,
  },
  {
    path: "/hsk/3-0-handwriting-requirements",
    seoTitle: ["HSK 3.0 Handwriting: Reading vs Writing", "HSK 3.0 认读字与书写字：要求及练习选择"],
    title: ["HSK 3.0 Reading vs Writing Characters: Requirements", "HSK 3.0 认读字与书写字：要求及练习选择"],
    description: ["Understand HSK 3.0 vocabulary, reading and writing requirements. Check the official writing-character groups before choosing a practice worksheet.", "区分 2025 年 HSK 大纲中的认读字与书写字，理解合并级别、词汇归属和考试形式，再选择合适的书写练习。"],
    intro: ["Recognising a word, knowing its characters and writing it from a cue are different tasks. The exam syllabus separates vocabulary, reading characters and writing characters; one list cannot stand in for the others.", "认识一个词、认出其中的汉字，以及根据提示把它写出，是不同任务。考试大纲把词汇、认读字和书写字分别列出，不能用其中一张表代替其余几张。"],
    sections: [
      { title: ["What each list tells you", "每张表分别说明什么"], paragraphs: [["The vocabulary list contains entries such as 爸爸 or 机票, with readings and word classes. The reading-character list concerns recognising individual Hanzi. The writing-character list gives a separate set for written production. A word's level alone does not prove that all of its characters belong to the writing list at that level.", "词汇表包含“爸爸、机票”等条目，并列读音和词性；认读字表针对单字的识读；书写字表另列书写范围。一个词属于某级，不足以证明其中所有字都在该级书写范围内。"]] },
      { title: ["Preserve the combined writing groups", "保留官方合并分组"], paragraphs: [["The syllabus writing list has 1,200 entries: Levels 1–2 together have 100; Levels 3, 4, 5 and 6 each add 150; Levels 7–9 together add 500. These are group additions, not a separate 100-character list for both Level 1 and Level 2.", "大纲书写字共 1,200 字：一至二级合并 100 字；三、四、五、六级各新增 150 字；七至九级合并新增 500 字。这是分组新增量，不能把一至二级的 100 字拆成两份各 100 字。"], ["The published writing section is on printed pages 374–381 (PDF pages 377–384). The linked GridHanzi list keeps the combined groups and lets you choose up to 30 characters for a worksheet.", "原书写字部分位于印刷页 374–381（PDF 第 377–384 页）。下方现有字表保留合并分组，可选最多 30 字制作练习纸。"]] },
      { title: ["Check what your test format asks you to produce", "再看考试形式需要怎样作答"], paragraphs: [["A writing-character inventory does not mean every level has the same handwriting question. Consult the official sample paper and your test centre for the level, paper-based or computer-based format, and any speaking registration. Do not infer 'no writing required' just because a lower-level test has no identical writing section.", "有书写字表，不代表各级都有相同的手写题。应查看相应级别的官方样题，并向考点核对纸笔或机网考形式、口语报名安排；也不能因为某级没有同样的书写题，就断言该级没有任何书写学习要求。"], ["Practise recognition by reading the model; practise written recall by covering it and writing from a cue. Our recall worksheets provide English or Pinyin cues, not official examination questions or automatic grading.", "认读练习可先看示范识字；书写回忆练习则盖住示范，根据提示写出。本站默写纸提供英文或拼音提示，不是官方试题，也不自动批改。"]] },
      { title: ["Build a small practice set", "选一小组开始练"], paragraphs: [["Choose 5–10 unfamiliar characters from the appropriate writing group. Check each sequence, make a Learn-mode sheet, then try a separate recall sheet. Record mistakes on your own copy and repeat the missed items. No account or cloud progress record is needed.", "从对应书写分组中选 5–10 个不熟悉的字，逐字核对笔顺，先做新字精学，再另做默写纸。把错误记在自己的练习纸上，集中重练，无需账户或云端学习记录。"]] },
    ],
    faqs: [
      { question: ["Must I handwrite all vocabulary entries at my level?", "本级所有词汇都必须手写吗？"], answer: ["Do not infer that from vocabulary membership. Check the separate writing-character list and the actual test format.", "不能仅凭词汇归属推断。应同时核对书写字表和实际考试形式。"] },
      { question: ["Can the Levels 1–2 writing list be split automatically?", "能自动把一至二级书写字拆成两个官方清单吗？"], answer: ["No. The source publishes one combined 100-character group. Any teaching split needs to be labelled as a teacher's selection, not an official split.", "不能。来源发布的是合并 100 字；教学拆分应标明为自选安排，不能称为官方拆分。"] },
      { question: ["Are the new 30-word packs the official writing-character list?", "新建的 30 词练习包就是官方书写字表吗？"], answer: ["No. They are selections from the vocabulary section. Use the separate 1,200-character list when your goal is writing-character coverage.", "不是。它们选自词汇部分；需要按书写字范围练习时，请使用单独的 1,200 字表。"] },
    ], sources: [...examSources, { label: ["Official syllabus and sample-paper directory", "官方大纲与样题入口"], href: "https://www.chinesetest.cn/syllabus" }],
  },
];

export const p1GuidePaths = p1LearningPages.map(page => page.path);
export const p1BilingualPaths = [...p1GuidePaths, "/templates/hsk-3-0-level-1-writing", "/templates/hsk-3-0-level-2-writing"];

export const learningNextSteps: Record<string, { href: string; title: Bilingual; reason: Bilingual; afterSection?: number }[]> = {
  "/chinese-basic-strokes": [
    { href: "/chinese-stroke-order-rules", title: ["Decide which stroke comes first", "再判断哪一笔先写"], reason: ["You now know the movement of each stroke. Use the order rules to see how those movements form a complete character.", "看懂单笔的行进方向后，再用笔顺规则理解这些笔画怎样组成完整汉字。"], afterSection: 0 },
    { href: "/chinese-stroke-order-mistakes", title: ["Check ten concrete writing mistakes", "用十个案例检查写法"], reason: ["If the direction seems right but the character still feels wrong, compare pen lifts, enclosure closure and the position of the final dot.", "方向看似正确，字却仍不对时，再检查抬笔、封口顺序及末点位置。"] },
  ],
  "/chinese-stroke-order-mistakes": [
    { href: "/chinese-basic-strokes", title: ["Check the stroke movement itself", "回看笔画本身怎样行进"], reason: ["If a folded stroke or hook gets split apart, review the direction diagrams before repeating the character.", "如果总把折或钩拆开写，先看方向示意，再重复练习完整汉字。"], afterSection: 0 },
    { href: "/chinese-stroke-order-rules", title: ["Connect the cases to general order rules", "把具体案例与通用规则对照"], reason: ["Use the rules to explain a sequence, then check the exact character whenever a general rule is not enough.", "用规则理解顺序；规则不足以判断时，仍要回到具体汉字核对。"] },
  ],
  "/hsk/3-0-vs-2-0": [
    { href: "/hsk/3-0-handwriting-requirements", title: ["Check what needs written recall", "再看哪些内容需要书写练习"], reason: ["After choosing a vocabulary edition, distinguish knowing a word from recognising or writing its characters.", "选定词表版本后，再分清会用一个词、认识其中的字，以及能把字写出。"], afterSection: 1 },
    { href: "/hsk/3-0-exam-guide", title: ["Confirm your exam arrangements", "核对本次考试安排"], reason: ["If you are preparing for a test, check the launch notice and local registration arrangements before setting a study deadline.", "如果目标是备考，先核对开考公告与当地报名安排，再制定复习截止时间。"] },
  ],
  "/hsk/3-0-handwriting-requirements": [
    { href: "/hsk/3-0-writing-characters", title: ["Choose characters from the official writing groups", "从官方书写分组选字"], reason: ["The existing character browser preserves the combined level groups and lets you select the characters for your own worksheet.", "现有选字页保留官方合并级别，可按自己的需要勾选汉字制作练习纸。"], afterSection: 1 },
    { href: "/hsk/3-0-vs-2-0", title: ["Unsure which vocabulary edition you have?", "还不确定手里的词表是哪一版？"], reason: ["Compare the source editions and beginner counts before treating a word list as your exam coverage target.", "先对照来源版本和入门词数，再把某份词表当作考试覆盖目标。"] },
  ],
};
