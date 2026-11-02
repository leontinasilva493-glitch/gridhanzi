"use client";

import { useLocale } from "next-intl";
import { Link } from "@/core/i18n/navigation";
import { p1LearningPages } from "../p1-learning-pages";
import { hskPracticePacks } from "../hsk-practice-sets";

export function P1LearningLinks({ topic }: { topic: "stroke" | "hsk" }) {
  const zh = useLocale() === "zh";
  return <aside className="my-8 rounded border border-[#ded7ca] bg-[#fff9ed] p-5">
    <h2 className="text-xl font-bold">{topic === "hsk" ? (zh ? "先选对大纲，再安排练习" : "Choose your syllabus, then your practice") : (zh ? "先看笔画方向，再纠正写法" : "Check stroke direction and common mistakes")}</h2>
    {topic === "hsk" && <p className="mt-3 text-sm leading-7">{zh ? "本站原有 HSK 3.0 选词库采用社区整理版本（一级 506 词），不是 2025 年 11 月考试大纲（一级 300 词、二级新增 200 词）。新版练习包单独依据考试大纲选编；请按自己的课程和考点要求选择。" : "The existing HSK 3.0 word browser uses a community catalogue (506 Level 1 entries), not the November 2025 exam syllabus (300 Level 1 entries, plus 200 introduced at Level 2). The new practice packs use the exam syllabus. Follow your course and test centre's requirements."}</p>}
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-[#24466e]">
      {p1LearningPages.filter(page => topic === "hsk" ? page.path.startsWith("/hsk/") : !page.path.startsWith("/hsk/")).map(page => <li key={page.path}><Link className="underline underline-offset-4" href={page.path}>{page.title[zh ? 1 : 0]}</Link></li>)}
      {topic === "hsk" && hskPracticePacks.map(pack => <li key={pack.slug}><Link className="underline underline-offset-4" href={`/templates/${pack.slug}`}>{pack.title[zh ? 1 : 0]}</Link></li>)}
    </ul>
  </aside>;
}
