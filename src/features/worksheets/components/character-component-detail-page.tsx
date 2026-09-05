import { ArrowRight, CheckCircle2, Info, Volume2 } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { characterComponentPages, type CharacterComponentPage } from "../character-components";
import { PublicPageShell } from "./site-shell";
import { StructuredData } from "./structured-data";

export function CharacterComponentDetailPage({ page, locale }: { page: CharacterComponentPage; locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pathname = `/components/${page.slug}`;
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}${pathname}`;
  const worksheetHref = `/generator?words=${encodeURIComponent(page.examples.map((example) => example.character).join(","))}`;
  const related = characterComponentPages.filter((candidate) => candidate.slug !== page.slug).sort((left, right) => Number(right.kind === page.kind) - Number(left.kind === page.kind)).slice(0, 3);

  return (
    <PublicPageShell active="stroke-order">
      <StructuredData data={[
        { "@context": "https://schema.org", "@type": "LearningResource", name: page.title, description: page.description, url: pageUrl, inLanguage: "en", educationalLevel: "Beginner to intermediate", learningResourceType: "Character component guide", teaches: `${page.glyph} as a Chinese character ${page.kind} component` },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${envConfigs.app_url}${localePrefix || "/"}` }, { "@type": "ListItem", position: 2, name: "Chinese Character Components", item: `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/chinese-character-components` }, { "@type": "ListItem", position: 3, name: page.name, item: pageUrl }] },
      ]} />
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]"><Link href="/">Home</Link> <span aria-hidden="true"> / </span><Link href="/chinese-character-components">Character Components</Link> <span aria-hidden="true"> / </span><span aria-current="page">{page.glyph}</span></nav>
        <header className="mt-6 grid gap-7 border-b border-[#ded7ca] pb-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
          <div className="grid aspect-square place-items-center rounded border border-[#d8c49f] bg-[#fff9ed]"><span className="hs-hanzi-context text-8xl text-[#172b49]">{page.glyph}</span></div>
          <div><p className="hs-kicker">{page.kind === "meaning" ? "Meaning component" : "Phonetic component"} · {page.pinyin}</p><h1 className="hs-display mt-3 text-4xl font-bold leading-tight sm:text-5xl">{page.heading}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">{page.intro}</p></div>
        </header>

        <section className="mt-9 grid gap-5 lg:grid-cols-2" aria-label="How the component works">
          <article className="hs-card p-6 sm:p-8"><p className="hs-kicker">Shape and position</p><h2 className="hs-display mt-2 text-2xl font-bold">How {page.glyph} fits into a character</h2><p className="mt-4 leading-8 text-[#4e5d70]">{page.formation}</p></article>
          <article className="rounded border border-[#d8c49f] bg-[#fff9ed] p-6 sm:p-8"><span className="grid size-10 place-items-center rounded-full bg-white text-[#9d3c32]"><Info className="size-5" /></span><h2 className="hs-display mt-4 text-2xl font-bold">What this clue cannot tell you</h2><p className="mt-4 leading-8 text-[#4e5d70]">{page.reliability}</p></article>
        </section>

        <section className="mt-11" aria-labelledby="family-examples-title"><p className="hs-kicker">Six characters, six decisions</p><h2 id="family-examples-title" className="hs-display mt-2 text-3xl font-bold">See the {page.glyph} family in context</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{page.examples.map((example) => <article key={example.character} className="hs-card p-5">{example.guideCharacter ? <Link href={`/stroke-order/${example.guideCharacter}`} className="hs-hanzi-context text-5xl text-[#172b49] hover:text-[#b62822]">{example.character}</Link> : <span className="hs-hanzi-context text-5xl text-[#172b49]">{example.character}</span>}<p className="mt-2 font-bold text-[#9d3c32]">{example.pinyin}</p><h3 className="mt-1 font-bold text-[#172b49]">{example.meaning}</h3><p className="mt-3 text-sm leading-7 text-[#566276]">{example.clue}</p></article>)}</div></section>

        <section className="mt-11 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]" aria-labelledby="writing-tips-title">
          <article className="hs-card p-6 sm:p-8"><p className="hs-kicker">Write the component consistently</p><h2 id="writing-tips-title" className="hs-display mt-2 text-3xl font-bold">Three placement checks</h2><ol className="mt-5 space-y-4">{page.writingTips.map((tip, index) => <li key={tip} className="flex gap-3 leading-7 text-[#4e5d70]"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#edf6f0] text-sm font-bold text-[#267254]">{index + 1}</span>{tip}</li>)}</ol></article>
          <aside className="rounded border border-[#233e62] bg-[#172b49] p-6 text-white"><Volume2 className="size-6 text-[#f4c9b7]" /><h2 className="hs-display mt-3 text-2xl font-bold !text-white">A focused family drill</h2><p className="mt-3 text-sm leading-7 text-blue-100/80">{page.practicePrompt}</p><Link href={worksheetHref} className="hs-primary-button mt-5 min-h-12">Practise these six Hanzi <ArrowRight className="size-4" /></Link></aside>
        </section>

        <section className="mt-11 border-t border-[#ded7ca] pt-9" aria-labelledby="related-components-title"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="hs-kicker">Continue the pattern</p><h2 id="related-components-title" className="hs-display mt-2 text-3xl font-bold">Related component guides</h2></div><Link href="/chinese-character-components" className="hs-secondary-button">All components</Link></div><div className="mt-5 grid gap-4 md:grid-cols-3">{related.map((candidate) => <Link key={candidate.slug} href={`/components/${candidate.slug}`} className="hs-card group flex items-center gap-4 p-5"><span className="hs-hanzi-context text-4xl text-[#172b49]">{candidate.glyph}</span><span><strong className="block text-[#172b49]">{candidate.name}</strong><span className="mt-1 block text-sm text-[#617084]">{candidate.kind === "meaning" ? "Meaning clue" : "Sound family"}</span></span><ArrowRight className="ml-auto size-4 text-[#b62822]" /></Link>)}</div></section>

        <section className="mt-10 flex flex-wrap gap-3 rounded border border-[#d8c49f] bg-[#fff9ed] p-6"><CheckCircle2 className="mt-2 size-5 text-[#267254]" /><div className="min-w-0 flex-1"><h2 className="hs-display text-xl font-bold">Connect components to the whole writing system</h2><p className="mt-2 text-sm leading-7 text-[#566276]">Review the order rules that govern complete characters, compare common radicals on paper, or build your own mixed list.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/chinese-stroke-order-rules" className="font-bold text-[#24466e] hover:text-[#b62822]">Stroke-order rules</Link><Link href="/templates/radicals" className="font-bold text-[#24466e] hover:text-[#b62822]">Radicals worksheet</Link><Link href="/generator" className="font-bold text-[#24466e] hover:text-[#b62822]">Custom worksheet</Link></div></div></section>
      </main>
    </PublicPageShell>
  );
}
