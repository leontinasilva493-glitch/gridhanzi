import { Link } from "@/core/i18n/navigation";
import type { Bilingual } from "../hsk-practice-sets";

export function HskPracticeLesson({ level, setId, editor, zh }: { level: 1 | 2; setId: string; editor: string; zh: boolean }) {
  const t = (copy: Bilingual) => copy[zh ? 1 : 0];
  if (level === 1) {
    const prompts: Record<string, { question: Bilingual; answer: Bilingual }[]> = {
      people: [
        { question: ["Which word means older brother?", "看到英文提示 older brother，能说出对应词语，再尝试写出来吗？"], answer: ["哥哥 · gēge. Compare it with 弟弟, younger brother.", "哥哥 · gēge。与表示 younger brother 的“弟弟”对照。"] },
        { question: ["Point to 老师 and 学生. Who teaches, and who learns?", "找出“老师”和“学生”，说说谁教、谁学。"], answer: ["老师 means teacher; 学生 means student. Read both whole words before copying.", "老师是 teacher，学生是 student。先读完整词语，再临写。"] },
      ],
      time: [
        { question: ["Put 昨天、今天、明天 in time order.", "把“昨天、今天、明天”按时间先后排列。"], answer: ["昨天 → 今天 → 明天: yesterday → today → tomorrow.", "昨天 → 今天 → 明天：yesterday → today → tomorrow。"] },
        { question: ["Which comes earlier: 上午 or 下午?", "“上午”和“下午”，哪个在前？"], answer: ["上午 comes before 下午. Notice that the two words share 午.", "上午在前，下午在后。留意两词共有的“午”。"] },
      ],
      food: [
        { question: ["Find three drinks in this group.", "找出本组中的三种饮品。"], answer: ["牛奶、水、茶: milk, water and tea.", "牛奶、水、茶：milk、water、tea。"] },
        { question: ["Which word names fruit in general, and which names an apple?", "哪个词泛指水果，哪个词专指苹果？"], answer: ["水果 means fruit; 苹果 means apple. An apple is one kind of fruit.", "水果是 fruit，苹果是 apple；苹果是水果的一种。"] },
      ],
    };
    return <section className="mt-8 rounded border border-[#d8c49f] bg-[#fff9ed] p-6" data-practice-lesson="recognition">
      <p className="hs-kicker">{t(["Level 1 · recognise before copying", "一级 · 先认词，再动笔"])}</p>
      <h2 className="hs-display mt-2 text-2xl font-bold">{t(["Can you connect each word to its meaning?", "看到词语，能想到它的意思吗？"])}</h2>
      <p className="mt-3 leading-7 text-[#566276]">{t(["Use these two prompts with your selected group. Try an answer before opening the explanation; nothing is scored or saved.", "用下面两个小问题检查所选词组。先自己回答，再展开参考说明；这里不打分，也不保存回答。 "])}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{prompts[setId].map((prompt, index) => <article key={`${setId}-${index}`} className="hs-card p-5">
        <h3 className="font-bold leading-7">{t(prompt.question)}</h3>
        <details className="mt-4"><summary className="cursor-pointer py-2 font-semibold text-[#24466e]">{t(["Check the explanation", "展开参考说明"])}</summary><p className="mt-2 text-sm leading-7">{t(prompt.answer)}</p></details>
      </article>)}</div>
      <p className="mt-5 text-sm leading-7">{t(["If the meaning is still unfamiliar, return to the word table. When you can identify the word, use its stroke guide and copy it once before trying recall.", "意思还不熟悉时，先回到上方词表；能认出词语后，再看笔顺、临写一遍，最后尝试默写。 "])}</p>
      <Link className="hs-primary-button mt-4" href={`${editor}&mode=trace`}>{t(["Practise this group with models", "带示范练习本组词语"])}</Link>
    </section>;
  }
  const contrasts: Record<string, { words: string; distinction: Bilingual; task: Bilingual }[]> = {
    study: [
      { words: "教 / 教室", distinction: ["教 (jiāo) is an action: to teach. 教室 (jiàoshì) is a place: classroom. The reading of 教 changes in this word.", "“教”（jiāo）表示传授；“教室”（jiàoshì）是上课的地方。留意“教”在这个词中的读音变化。"], task: ["Say the action and the place separately, then write the full two-character place name.", "先分别说出动作与地点，再完整写出两字地点词。"] },
      { words: "考 / 考试", distinction: ["These entries have related meanings. In this pack, 考 is cued as 'to take a test'; 考试 is cued as 'exam; to take an exam'. Follow the intended whole word.", "两者意思相关。本组用“参加测试”提示“考”，用“考试；参加考试”提示“考试”。练习时先确认目标是哪个完整词。"], task: ["Use the Pinyin and number of answer cells to distinguish the intended entry on a recall sheet.", "默写时结合拼音与答题格数量，区分题目要写的词。"] },
    ],
    travel: [
      { words: "机场 / 机票", distinction: ["机场 is the airport; 机票 is the air ticket. They share 机 but refer to a place and an item.", "“机场”是出发或抵达的地方，“机票”是乘机凭证。两词共有“机”，但所指不同。"], task: ["Cover the Chinese and recall both words from 'airport' and 'air ticket'. Check the second character.", "遮住汉字，根据 airport 与 air ticket 分别回忆，重点检查第二个字。"] },
      { words: "左边 / 右边", distinction: ["左边 is the left side; 右边 is the right side. The shared 边 does not tell you the direction.", "“左边”与“右边”分别表示两个方向，共有的“边”不能说明是哪一侧。"], task: ["Point to each side, say the word, then write both complete words from memory.", "先指方向、再读词，最后尝试凭记忆写出两个完整词语。"] },
    ],
    daily: [
      { words: "颜色 / 红色 / 绿色", distinction: ["颜色 names the category 'colour'; 红色 and 绿色 name red and green. Do not drop 色 when recalling the target words in this group.", "“颜色”是类别，“红色”和“绿色”是具体颜色。本组目标词带“色”，默写时不要只写首字。"], task: ["Choose an object near you, identify its colour, then recall the complete colour word.", "找身边一件物品，说出颜色，再回忆对应的完整颜色词。"] },
      { words: "运动 / 游泳", distinction: ["运动 means exercise or sport; 游泳 is swimming, one specific activity. They are not interchangeable in every sentence.", "“运动”是较宽泛的活动类别，“游泳”是具体项目，并非所有句子都能互换。"], task: ["Explain the broad activity and the specific activity before writing the two words from their cues.", "先说明哪个较宽泛、哪个更具体，再根据提示写出两个词。"] },
    ],
  };
  return <section className="hs-card mt-8 p-6" data-practice-lesson="contrast">
    <p className="hs-kicker">{t(["Level 2 · distinguish, then recall", "二级 · 先辨词，再默写"])}</p>
    <h2 className="hs-display mt-2 text-2xl font-bold">{t(["Keep related words separate", "相近的词，能分清并写完整吗？"])}</h2>
    <p className="mt-3 leading-7 text-[#566276]">{t(["These comparisons use words from your selected group. Check the changing character or meaning first, then use a separate recall sheet to practise complete words.", "下面只对照你所选组里的词。先看变化的字与意思，再用单独的默写纸练习完整词语。 "])}</p>
    <div className="mt-5 space-y-5">{contrasts[setId].map(item => <article key={item.words} className="border-l-2 border-[#b62822] pl-5">
      <h3 className="hs-hanzi-context text-2xl font-bold">{item.words}</h3>
      <p className="mt-2 leading-7 text-[#566276]">{t(item.distinction)}</p>
      <p className="mt-2 text-sm font-semibold leading-7">{t(item.task)}</p>
    </article>)}</div>
    <p className="mt-5 text-sm leading-7">{t(["Recall mode supplies English and Pinyin cues with answer cells. Check your own answers against the word table; it does not grade your handwriting.", "默写模式提供英文、拼音与答题格。完成后自行对照上方词表核查，不会自动批改手写内容。 "])}</p>
    <Link className="hs-primary-button mt-4" href={`${editor}&mode=quiz`}>{t(["Make a recall sheet for this group", "制作本组默写纸"])}</Link>
  </section>;
}

