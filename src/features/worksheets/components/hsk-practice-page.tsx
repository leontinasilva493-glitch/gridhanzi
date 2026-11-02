"use client";

import { HskPracticeLesson } from "./hsk-practice-lesson";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/core/i18n/navigation";
import { envConfigs } from "@/config";
import { HSK_SYLLABUS_URL, getHskPracticeEntries, type Bilingual, type HskPracticePack } from "../hsk-practice-sets";
import { PublicPageShell } from "./site-shell";
import { WorksheetMiniature } from "./worksheet-miniature";
import { StructuredData } from "./structured-data";

export function HskPracticePage({ pack }: { pack: HskPracticePack }) {
  const locale = useLocale();
  const zh = locale === "zh";
  const t = (text: Bilingual) => text[zh ? 1 : 0];
  const [setId, setSetId] = useState(pack.sets[0].id);
  const set = pack.sets.find(item => item.id === setId)!;
  const entries = getHskPracticeEntries(pack.slug, setId)!;
  const editor = `/generator?template=${pack.slug}&practiceSet=${setId}`;
  const url = `${envConfigs.app_url.replace(/\/$/, "")}${zh ? "/zh" : ""}/templates/${pack.slug}`;
  return (
    <PublicPageShell active="templates">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "LearningResource", name: t(pack.title), description: t(pack.description), url, inLanguage: zh ? "zh-Hans" : "en", learningResourceType: "Worksheet", isAccessibleForFree: true }} />
      <main className="hs-container pb-16 pt-6" data-hsk-practice-pack={pack.level}>
        <nav aria-label={t(["Breadcrumb", "面包屑导航"])} className="text-sm text-[#617084]"><Link href="/templates">{t(["Templates", "字帖模板"])}</Link> / {t(pack.title)}</nav>
        <header className="mt-6 max-w-4xl">
          <p className="hs-kicker">{t(["2025 exam syllabus · selected vocabulary", "2025 年考试大纲 · 词汇选编"])}</p>
          <h1 className="hs-display mt-3 text-4xl font-bold sm:text-5xl">{t(pack.title)}</h1>
          <p className="mt-5 text-lg leading-8 text-[#566276]">{t(pack.description)}</p>
          <p className="mt-4 rounded border border-[#d8c49f] bg-[#fff9ed] p-4 text-sm leading-6">{t(["This is a 30-entry vocabulary practice selection, not the complete level or the official writing-character list. Level 1 has 300 vocabulary entries; Level 2 adds 200 (500 cumulative). Vocabulary membership does not mean every character must be handwritten at that level.", "这是一套 30 词的词汇练习选编，不是完整级别词表，也不是官方书写字表。一级有 300 条词汇，二级新增 200 条，累计 500 条。词汇属于某级，不代表其中每个字都必须在该级手写。 "])}</p>
          <p className="mt-3 text-sm leading-7 text-[#566276]">{t(["Working from a different word list?", "正在用另一份词表？"])} <Link className="font-semibold text-[#24466e] underline" href="/hsk/3-0-vs-2-0">{t(["Compare HSK editions before choosing practice.", "先对照 HSK 资料版本，再选择练习。 "])}</Link></p>
        </header>
        <section className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" aria-labelledby="practice-set-title">
          <div className="hs-card min-w-0 p-5 sm:p-7">
            <h2 id="practice-set-title" className="hs-display text-2xl font-bold">{t(["Choose a ten-word set", "选择一组 10 词"])}</h2>
            <div className="mt-4 flex flex-wrap gap-2">{pack.sets.map(item => <button type="button" key={item.id} aria-pressed={item.id === setId} onClick={() => setSetId(item.id)} className={item.id === setId ? "hs-primary-button" : "hs-secondary-button"}>{t(item.title)}</button>)}</div>
            <p className="mt-5 leading-7 text-[#566276]">{t(set.task)}</p>
            <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm">
              <caption className="sr-only">{t(set.title)}</caption>
              <thead><tr className="border-b"><th className="p-2">{t(["Word", "词语"])}</th><th className="p-2">{t(["Pinyin", "拼音"])}</th><th className="p-2">{t(["English cue", "英文提示"])}</th></tr></thead>
              <tbody>{entries.map(entry => <tr key={entry.id} className="border-b border-[#e9e2d6]"><td className="hs-hanzi-context p-2 text-xl">{entry.hanzi}</td><td className="p-2">{entry.pinyin}</td><td className="p-2">{entry.english}</td></tr>)}</tbody>
            </table></div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`${editor}&mode=trace`} className="hs-primary-button">{t(["Edit this set with stroke guides", "编辑本组：带笔顺学习"])}</Link>
              <Link href={`${editor}&mode=quiz`} className="hs-secondary-button">{t(["Edit this set for recall", "编辑本组：默写练习"])}</Link>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#617084]">{t(["Check the words and readings in the editor, choose A4 or US Letter, then open Preview and Download PDF. Recall mode uses cues; it does not include stroke-order guides or automatic marking.", "进入编辑器后可核对词语和读音、选择 A4 或美式信纸，再打开预览并下载 PDF。默写模式提供提示，不显示笔顺，也不自动批改。 "])}</p>
          </div>
          <aside className="min-w-0">
            <h2 className="hs-display mb-3 text-xl font-bold">{t(["Layout sample", "版式样张"])}</h2>
            <div className="overflow-hidden"><WorksheetMiniature entries={entries.slice(0, 2)} title={`HSK 3.0 L${pack.level}`} chineseTitle={t(set.title)} profile="adult" /></div>
            <p className="mt-3 text-xs leading-5 text-[#617084]">{t(["A two-word sample. Final pages depend on your settings.", "此处仅展示 2 词样张，实际页数由编辑设置决定。 "])}</p>
            <Link href={`/worksheet/preview?template=${pack.slug}`} className="hs-secondary-button mt-4 w-full">{t(["Preview all 30 selected words", "预览全部 30 个选编词"])}</Link>
          </aside>
        </section>
        <HskPracticeLesson level={pack.level} setId={setId} editor={editor} zh={zh} />
        <section className="hs-card mt-8 p-6">
          <h2 className="hs-display text-2xl font-bold">{t(["A short practice cycle", "怎样用这组词练习"])}</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7"><li>{t(["Read each word and check its meaning. Look up unfamiliar character sequences before copying.", "先读词、核对释义。遇到不熟悉的字，先查笔顺再抄写。 "])}</li><li>{t(["Trace once, then copy into blank cells. Keep names and dates optional when preparing the sheet.", "先描红，再在空白格临写。按需要填写标题、姓名和日期。 "])}</li><li>{t(["Use a separate recall sheet. Compare your writing with the model yourself and repeat only the items you missed.", "另做一份默写练习，自行对照示范检查，集中重练遗漏项。 "])}</li></ol>
          <p className="mt-4 text-sm leading-6">{t(["Source: November 2025 HSK exam syllabus, vocabulary section, printed pages 77–89 (PDF pages 80–92). Pinyin and level membership were checked on November 2, 2026. English cues are GridHanzi teaching glosses, not official translations.", "来源：2025 年 11 月《HSK 考试大纲》词汇部分，印刷页 77–89（PDF 第 80–92 页）。拼音和级别归属核对日期：2026 年 11 月 2 日。英文提示为 GridHanzi 教学释义，不是官方译文。 "])}</p>
          <a href={HSK_SYLLABUS_URL} target="_blank" rel="noreferrer" className="mt-3 inline-block min-h-11 py-2 font-semibold text-[#24466e] underline">{t(["Read the official syllabus PDF", "查看官方大纲 PDF"])}</a>
        </section>
        <nav className="mt-7 grid gap-4 md:grid-cols-2" aria-label={t(["Continue learning", "继续学习"])}>
          <div className="hs-card p-5"><p className="mb-3 text-sm leading-7 text-[#566276]">{pack.level === 1 ? t(["Comfortable with this selection? Try a different set of words introduced at Level 2; this is not a completion test for Level 1.", "这组选编词已经熟悉？可以尝试二级新增词中的另一组选编内容；这不代表已学完全部一级词汇。 "]) : t(["If the new words feel difficult, revisit a small Level 1 selection before returning to these contrasts.", "新增词还不熟悉时，可以先回顾一小组一级词汇，再回来做辨词与默写。 "])}</p>
          <Link className="hs-secondary-button" href={`/templates/hsk-3-0-level-${pack.level === 1 ? 2 : 1}-writing`}>{t([pack.level === 1 ? "Try Level 2 practice" : "Review Level 1 practice", pack.level === 1 ? "继续二级练习" : "回顾一级练习"])}</Link>
          </div><div className="hs-card p-5"><p className="mb-3 text-sm leading-7 text-[#566276]">{t(["Need to follow the official writing-character range? A vocabulary selection is different; check the separate writing groups first.", "需要按官方书写字范围练习？词汇选编与书写字表不同，应先查看单独的书写分组。 "])}</p>
          <Link className="hs-secondary-button" href="/hsk/3-0-handwriting-requirements">{t(["Reading vs writing requirements", "认读字与书写字要求"])}</Link>
          </div>
        </nav>
      </main>
    </PublicPageShell>
  );
}
