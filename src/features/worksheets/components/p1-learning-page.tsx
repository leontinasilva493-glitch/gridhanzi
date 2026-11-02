import { Link } from "@/core/i18n/navigation";
import { envConfigs } from "@/config";
import { type Bilingual, hskPracticePacks } from "../hsk-practice-sets";
import { basicStrokeLessons, learningNextSteps, strokeMistakes, type LearningPage } from "../p1-learning-pages";
import { PublicPageShell } from "./site-shell";
import { StructuredData } from "./structured-data";

export function P1LearningPage({ page, locale }: { page: LearningPage; locale: string }) {
  const zh = locale === "zh";
  const t = (copy: Bilingual) => copy[zh ? 1 : 0];
  const strokes = page.path.startsWith("/chinese-");
  const nextSteps = learningNextSteps[page.path];
  const base = envConfigs.app_url.replace(/\/$/, "");
  const prefix = zh ? "/zh" : "";
  const url = `${base}${prefix}${page.path}`;
  const words = page.path === "/chinese-basic-strokes" ? "一\n十\n人\n大\n六\n地\n小\n口" : strokeMistakes.map(item => item.character).join("\n");
  return (
    <PublicPageShell active={strokes ? "stroke-order" : "hsk"}>
      <StructuredData data={[
        { "@context": "https://schema.org", "@type": "Article", headline: t(page.title), description: t(page.description), url, inLanguage: zh ? "zh-Hans" : "en", dateModified: "2026-11-02", author: { "@type": "Organization", name: "GridHanzi" } },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: t(["Home", "首页"]), item: `${base}${prefix}/` },
          { "@type": "ListItem", position: 2, name: strokes ? t(["Stroke order", "笔顺"]) : "HSK", item: `${base}${prefix}${strokes ? "/stroke-order" : "/hsk"}` },
          { "@type": "ListItem", position: 3, name: t(page.title), item: url },
        ] },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faqs.map(faq => ({ "@type": "Question", name: t(faq.question), acceptedAnswer: { "@type": "Answer", text: t(faq.answer) } })) },
      ]} />
      <main className="hs-container pb-16 pt-6" data-p1-guide>
        <nav aria-label={t(["Breadcrumb", "面包屑导航"])} className="text-sm text-[#617084]"><Link href={strokes ? "/stroke-order" : "/hsk"}>{strokes ? t(["Stroke order", "笔顺"]) : "HSK"}</Link> / {t(page.title)}</nav>
        <header className="mt-6 max-w-4xl">
          <p className="hs-kicker">{strokes ? t(["Notice · check · practise", "观察 · 核对 · 练习"]) : t(["Source-checked learning guide", "有来源的学习指南"])}</p>
          <h1 className="hs-display mt-3 text-4xl font-bold leading-tight sm:text-5xl">{t(page.title)}</h1>
          <p className="mt-5 text-lg leading-8 text-[#566276]">{t(page.intro)}</p>
          <p className="mt-4 text-xs text-[#617084]">{t(["Reviewed November 2, 2026 · GridHanzi", "核对日期：2026 年 11 月 2 日 · GridHanzi"])}</p>
        </header>
        <nav aria-label={t(["On this page", "本页目录"])} className="hs-card mt-7 flex flex-wrap gap-x-5 gap-y-2 p-5 text-sm font-semibold text-[#24466e]">
          {page.sections.map((section, index) => <a key={index} className="min-h-10 content-center underline" href={`#guide-section-${index}`}>{t(section.title)}</a>)}
        </nav>

        {page.path === "/chinese-basic-strokes" && <section className="mt-8" aria-labelledby="stroke-directions-title">
          <h2 id="stroke-directions-title" className="hs-display text-2xl font-bold">{t(["Eight common stroke families", "八类常见笔画"])}</h2>
          <p className="mt-2 text-sm leading-6 text-[#617084]">{t(["Arrows show movement direction. These diagrams illustrate the movement, not an exact printed glyph.", "箭头表示行笔方向，示意图用于解释动作，并非印刷规范字形。 "])}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{basicStrokeLessons.map(item => <article key={item.id} className="hs-card p-5">
            <svg viewBox="0 0 100 100" role="img" aria-label={t(item.name)} className="mx-auto size-28 border border-[#ded7ca] bg-[#fffdf9]">
              <defs><marker id={`direction-${item.id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#b62822" /></marker></defs>
              <path d="M50 0V100 M0 50H100" stroke="#ded7ca" strokeDasharray="3 3" fill="none" />
              <path d={item.path} stroke="#172b49" strokeWidth="4" fill="none" strokeLinecap="round" markerEnd={`url(#direction-${item.id})`} />
            </svg>
            <h3 className="hs-display mt-4 text-lg font-bold">{t(item.name)}</h3>
            <p className="mt-2 text-sm leading-6 text-[#566276]">{t(item.direction)}</p>
            <Link href={`/stroke-order?character=${encodeURIComponent(item.example)}`} className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-[#24466e] underline">{t(["Watch example", "查看例字"])} <span className="hs-hanzi-context text-2xl">{item.example}</span></Link>
          </article>)}</div>
        </section>}

        {page.path === "/chinese-stroke-order-mistakes" && <section className="mt-8" aria-labelledby="mistake-cases-title">
          <h2 id="mistake-cases-title" className="hs-display text-2xl font-bold">{t(["Ten cases: identify, correct, practise", "十个案例：找错、纠正、再练"])}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">{strokeMistakes.map((item, index) => <article key={item.character} className="hs-card p-5 sm:p-6">
            <span className="text-xs font-bold text-[#b62822]">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="hs-display mt-2 text-xl font-bold">{t(item.title)}</h3>
            <p className="mt-3 text-sm leading-7 text-[#566276]">{t(item.wrong)}</p>
            <p className="mt-3 border-l-2 border-[#b62822] pl-3 text-sm font-semibold leading-7">{t(item.correction)}</p>
            <p className="mt-3 text-sm leading-7 text-[#566276]">{t(item.drill)}</p>
            <Link href={`/stroke-order?character=${encodeURIComponent(item.character)}`} className="mt-3 inline-flex min-h-11 items-center font-semibold text-[#24466e] underline">{t([`Check ${item.character} stroke by stroke`, `逐笔核对“${item.character}”`])}</Link>
          </article>)}</div>
        </section>}

        {page.path === "/hsk/3-0-vs-2-0" && <div className="hs-card mt-8 overflow-x-auto p-5">
          <table className="w-full min-w-[520px] text-left text-sm leading-6"><caption className="mb-3 text-left text-lg font-bold">{t(["Beginner vocabulary counts: keep the editions separate", "入门词汇计数：不同版本分别说明"])}</caption>
            <thead><tr className="border-b"><th className="p-2">{t(["Dataset", "资料"])}</th><th className="p-2">{t(["Level 1", "一级"])}</th><th className="p-2">{t(["Level 2", "二级"])}</th></tr></thead>
            <tbody><tr className="border-b"><td className="p-2">{t(["Classic HSK 2.0", "旧版 HSK 2.0"])}</td><td className="p-2">150</td><td className="p-2">{t(["300 cumulative", "累计 300"])}</td></tr><tr className="border-b"><td className="p-2">{t(["November 2025 exam syllabus", "2025 年 11 月考试大纲"])}</td><td className="p-2">300</td><td className="p-2">{t(["200 new / 500 cumulative", "新增 200 / 累计 500"])}</td></tr><tr><td className="p-2">{t(["Existing community 3.0 catalogue", "既有社区 3.0 词库"])}</td><td className="p-2">{t(["506 catalogue rows", "词库行数 506"])}</td><td className="p-2">{t(["Not the new exam count", "不是新版考试计数"])}</td></tr></tbody>
          </table>
        </div>}

        {page.path === "/hsk/3-0-handwriting-requirements" && <div className="hs-card mt-8 overflow-x-auto p-5">
          <table className="w-full text-left text-sm leading-6"><caption className="mb-3 text-left text-lg font-bold">{t(["Official writing-character groups", "官方书写字分组"])}</caption>
            <thead><tr className="border-b"><th className="p-2">{t(["Group", "分组"])}</th><th className="p-2">{t(["New in group", "本组新增"])}</th><th className="p-2">{t(["Cumulative", "累计"])}</th></tr></thead>
            <tbody>{[["1–2", 100, 100], ["3", 150, 250], ["4", 150, 400], ["5", 150, 550], ["6", 150, 700], ["7–9", 500, 1200]].map(([group, count, total]) => <tr key={group} className="border-b"><td className="p-2">{group}</td><td className="p-2">{count}</td><td className="p-2">{total}</td></tr>)}</tbody>
          </table>
          <Link href="/hsk/3-0-writing-characters" className="hs-primary-button mt-4">{t(["Choose from the writing-character list", "从书写字表选字练习"])}</Link>
        </div>}

        <div className="mt-8 max-w-4xl space-y-8">{page.sections.map((section, index) => <section key={index} id={`guide-section-${index}`} className="scroll-mt-24">
          <h2 className="hs-display text-2xl font-bold">{t(section.title)}</h2>
          {section.paragraphs.map((paragraph, i) => <p key={i} className="mt-4 leading-8 text-[#566276]">{t(paragraph)}</p>)}
          {nextSteps.filter(step => step.afterSection === index).map(step => <aside key={step.href} className="mt-5 border-l-2 border-[#b62822] pl-4" data-contextual-next-step>
            <p className="text-sm leading-7 text-[#566276]">{t(step.reason)}</p>
            <Link href={step.href} className="mt-1 inline-flex min-h-11 items-center font-semibold text-[#24466e] underline">{t(step.title)}</Link>
          </aside>)}
        </section>)}</div>

        <section className="hs-card mt-9 border-[#d8c49f] bg-[#fff9ed] p-6" aria-labelledby="practice-next-title">
          <h2 id="practice-next-title" className="hs-display text-2xl font-bold">{t(["Put it into practice", "接着练一组"])}</h2>
          <p className="mt-3 leading-7 text-[#566276]">{strokes ? t(["Open the example characters in the editor, check the filled fields and choose a practice mode. Download is available from the preview, after you review the sheet.", "把本页例字带入编辑器，检查补全字段并选择练习模式。核对字帖并打开预览后，即可生成下载。 "]) : t(["Start with a selected ten-word set from the 2025 exam syllabus. These packs are learning material, not official mock examinations.", "从 2025 年考试大纲中选编的一组 10 词开始。这些是学习练习材料，不是官方模拟考试。 "])}</p>
          <div className="mt-4 flex flex-wrap gap-3">{strokes ? <>
            <Link className="hs-primary-button" href={`/generator?words=${encodeURIComponent(words)}&mode=trace`}>{t(["Make a worksheet with these examples", "用本页例字制作练习纸"])}</Link>
            <Link className="hs-secondary-button" href="/chinese-stroke-order-rules">{t(["Read the stroke-order rules", "查看笔顺规则"])}</Link>
          </> : hskPracticePacks.map(pack => <Link key={pack.slug} className="hs-primary-button" href={`/templates/${pack.slug}`}>{t(pack.title)}</Link>)}</div>
        </section>
        <section className="mt-9 max-w-4xl" aria-labelledby="guide-faq-title"><h2 id="guide-faq-title" className="hs-display text-2xl font-bold">{t(["Questions before you practise", "练习前常见问题"])}</h2>
          {page.faqs.map((faq, i) => <details key={i} className="mt-3 rounded border border-[#ded7ca] p-4"><summary className="cursor-pointer font-semibold">{t(faq.question)}</summary><p className="mt-3 leading-7 text-[#566276]">{t(faq.answer)}</p></details>)}
        </section>
        <section className="hs-card mt-8 p-5" aria-labelledby="guide-sources-title"><h2 id="guide-sources-title" className="font-bold">{t(["Sources and scope", "来源与适用范围"])}</h2><ul className="mt-3 space-y-2">{page.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="inline-block min-h-10 py-2 text-sm font-semibold text-[#24466e] underline">{t(source.label)}</a></li>)}</ul></section>
        <nav className="mt-8 max-w-4xl" aria-label={t(["Suggested next step", "建议的下一步"])}>{nextSteps.filter(step => step.afterSection === undefined).map(step => <div key={step.href} className="hs-card p-5">
          <p className="text-sm leading-7 text-[#566276]">{t(step.reason)}</p>
          <Link href={step.href} className="mt-2 inline-flex min-h-11 items-center font-semibold text-[#24466e] underline">{t(step.title)}</Link>
        </div>)}</nav>
      </main>
    </PublicPageShell>
  );
}
