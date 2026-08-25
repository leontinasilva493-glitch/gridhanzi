import { ArrowRight, CheckCircle2, FilePlus2, Lightbulb, XCircle } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { getStrokeOrderCharacter } from "../stroke-order-characters";
import { getComparisonPage, type ComparisonPage } from "../comparison-pages";
import { StructuredData } from "./structured-data";
import { PublicPageShell } from "./site-shell";

export function ComparisonDetailPage({ page, locale }: { page: ComparisonPage; locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pathname = `/compare/${page.slug}`;
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}${pathname}`;
  const worksheetHref = `/generator?words=${encodeURIComponent(page.worksheetWords.join(","))}`;
  const characterGuides = page.characters.map((character) => getStrokeOrderCharacter(character)).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <PublicPageShell active="compare">
      <StructuredData data={[
        { "@context": "https://schema.org", "@type": "LearningResource", name: page.title, description: page.description, url: pageUrl, inLanguage: "en", learningResourceType: "Chinese comparison guide", teaches: page.characters.map((character) => `${character} usage and recognition`) },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${envConfigs.app_url}${localePrefix || "/"}` }, { "@type": "ListItem", position: 2, name: "Chinese Comparisons", item: `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/compare` }, { "@type": "ListItem", position: 3, name: page.characters.join(" vs "), item: pageUrl }] },
      ]} />
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]"><Link href="/">Home</Link> <span aria-hidden="true"> / </span><Link href="/compare">Comparisons</Link> <span aria-hidden="true"> / </span><span aria-current="page">{page.characters.join(" vs ")}</span></nav>
        <header className="mt-6 grid gap-7 border-b border-[#ded7ca] pb-9 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
          <div><p className="hs-kicker">{page.category}</p><h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">{page.heading}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">{page.intro}</p></div>
          <div className="flex min-h-52 items-center justify-center gap-4 rounded-full border border-[#d7cfc1] bg-[#f7efe3] px-8 shadow-[inset_0_0_0_10px_#fffaf2]">{page.characters.map((character, index) => <span key={character} className="contents"><span className="hs-hanzi-context text-6xl text-[#172b49]">{character}</span>{index < page.characters.length - 1 ? <span className="text-2xl text-[#9d3c32]">/</span> : null}</span>)}</div>
        </header>

        <section className="mt-8 rounded border border-[#d8c49f] bg-[#fff9ed] p-6 sm:p-8" aria-labelledby="decision-rule-title"><p className="hs-kicker">Fast decision rule</p><h2 id="decision-rule-title" className="hs-display mt-2 text-3xl font-bold">Choose by this signal</h2><p className="mt-4 max-w-4xl text-lg leading-8 text-[#4e5d70]">{page.decisionRule}</p><p className="mt-4 border-t border-[#e3d6c1] pt-4 text-sm leading-7 text-[#5a5f65]"><strong className="text-[#172b49]">How to practise the rule:</strong> {page.teachingAngle}</p></section>

        <section className="mt-9" aria-labelledby="compare-items-title"><p className="hs-kicker">Compare side by side</p><h2 id="compare-items-title" className="hs-display mt-2 text-3xl font-bold">Different jobs, visible signals</h2><div className={`mt-5 grid gap-5 ${page.items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>{page.items.map((item) => <article key={item.character} className="hs-card min-w-0 p-6"><div className="flex items-start justify-between gap-4"><div><p className="hs-hanzi-context text-6xl text-[#172b49]">{item.character}</p><p className="mt-2 font-bold text-[#9d3c32]">{item.pinyin}</p></div><span className="rounded-full bg-[#e8f2ec] px-3 py-1.5 text-xs font-bold text-[#267254]">{item.label}</span></div><p className="mt-5 leading-7 text-[#4e5d70]">{item.rule}</p><p className="mt-4 rounded bg-[#f7f1e7] p-3 text-sm font-bold text-[#24466e]">Signal: {item.signal}</p><ul className="mt-5 space-y-4">{item.examples.map((example) => <li key={example.hanzi} className="border-t border-[#ece5d9] pt-4 first:border-t-0 first:pt-0"><p className="hs-hanzi-context text-xl text-[#172b49]">{example.hanzi}</p><p className="mt-1 text-sm font-semibold text-[#9d3c32]">{example.pinyin}</p><p className="mt-1 text-sm text-[#566276]">{example.meaning}</p></li>)}</ul></article>)}</div></section>

        <section className="mt-9" aria-labelledby="corrections-title"><p className="hs-kicker">Correct the pattern</p><h2 id="corrections-title" className="hs-display mt-2 text-3xl font-bold">Common mistakes and why they fail</h2><div className="mt-5 grid gap-4 lg:grid-cols-3">{page.mistakes.map((mistake) => <article key={mistake.wrong} className="hs-card p-5"><p className="flex items-start gap-2 text-sm text-[#8f3530]"><XCircle className="mt-0.5 size-4 shrink-0" /><span className="hs-hanzi-context text-lg line-through decoration-[#b62822]/50">{mistake.wrong}</span></p><p className="mt-3 flex items-start gap-2 text-[#267254]"><CheckCircle2 className="mt-1 size-4 shrink-0" /><span className="hs-hanzi-context text-xl font-semibold">{mistake.correct}</span></p><p className="mt-4 text-sm leading-7 text-[#566276]">{mistake.explanation}</p></article>)}</div></section>

        <section className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]" aria-label="Memory and handwriting practice"><article className="hs-card p-6 sm:p-8"><div className="flex items-center gap-2 text-[#9d3c32]"><Lightbulb className="size-5" /><span className="text-sm font-bold uppercase tracking-[0.16em]">Memory cues</span></div><h2 className="hs-display mt-3 text-2xl font-bold">Make the distinction retrievable</h2><ul className="mt-4 space-y-3">{page.memoryTips.map((tip) => <li key={tip} className="flex gap-3 leading-7 text-[#4e5d70]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#267254]" />{tip}</li>)}</ul></article><aside className="rounded border border-[#233e62] bg-[#172b49] p-6 text-white"><FilePlus2 className="size-7 text-[#f4c9b7]" /><h2 className="hs-display mt-3 text-2xl font-bold !text-white">Practise the contrast on paper</h2><p className="mt-3 text-sm leading-7 text-blue-100/80">The worksheet maker opens with this guide's contrast words already filled in. Switch between trace, write, flashcard, and test modes.</p><Link href={worksheetHref} className="hs-primary-button mt-5 min-h-12">Create comparison worksheet <ArrowRight className="size-4" /></Link></aside></section>

        {characterGuides.length ? <section className="mt-10" aria-labelledby="character-guides-title"><p className="hs-kicker">Inspect each form</p><h2 id="character-guides-title" className="hs-display mt-2 text-3xl font-bold">Stroke order and usage guides</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{characterGuides.map((entry) => <Link key={entry.character} href={`/stroke-order/${entry.character}`} className="hs-card group flex items-center gap-4 p-5"><span className="hs-hanzi-context text-5xl text-[#172b49]">{entry.character}</span><span><span className="block font-bold">{entry.pinyin} · {entry.meaning}</span><span className="mt-1 block text-sm font-bold text-[#24466e] group-hover:text-[#b62822]">View character guide</span></span></Link>)}</div></section> : null}

        <section className="mt-10" aria-labelledby="faq-title"><p className="hs-kicker">Questions learners ask</p><h2 id="faq-title" className="hs-display mt-2 text-3xl font-bold">FAQ for {page.characters.join(", ")}</h2><div className="mt-5 grid gap-4 lg:grid-cols-2">{page.faqs.map((faq) => <article key={faq.question} className="hs-card p-6"><h3 className="hs-display text-xl font-bold">{faq.question}</h3><p className="mt-3 text-sm leading-7 text-[#566276]">{faq.answer}</p></article>)}</div></section>

        <section className="mt-10 border-t border-[#ded7ca] pt-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="hs-kicker">Keep comparing</p><h2 className="hs-display mt-2 text-2xl font-bold">Related distinctions</h2></div><Link href="/compare" className="hs-secondary-button">All comparisons</Link></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{page.relatedSlugs.map((slug) => { const related = getComparisonPage(slug); return related ? <Link key={slug} href={`/compare/${slug}`} className="hs-card group p-5"><span className="hs-hanzi-context text-3xl text-[#172b49]">{related.characters.join(" / ")}</span><span className="mt-2 block text-sm font-bold text-[#24466e] group-hover:text-[#b62822]">{related.heading}</span></Link> : null; })}</div></section>
      </main>
    </PublicPageShell>
  );
}
