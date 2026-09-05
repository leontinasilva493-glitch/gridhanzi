import { ArrowRight, Ear, Eye, Shapes } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { characterComponentPages } from "../character-components";
import { PublicPageShell } from "./site-shell";
import { StructuredData } from "./structured-data";

export function CharacterComponentsPage({ locale }: { locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/chinese-character-components`;
  const meaningPages = characterComponentPages.filter((page) => page.kind === "meaning");
  const soundPages = characterComponentPages.filter((page) => page.kind === "sound");

  return (
    <PublicPageShell active="stroke-order">
      <StructuredData data={[
        { "@context": "https://schema.org", "@type": "CollectionPage", name: "Chinese Character Components", description: "Curated guides to reusable meaning components and phonetic families in Chinese characters.", url: pageUrl, inLanguage: "en", numberOfItems: characterComponentPages.length },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${envConfigs.app_url}${localePrefix || "/"}` }, { "@type": "ListItem", position: 2, name: "Chinese Character Components", item: pageUrl }] },
      ]} />
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]"><Link href="/">Home</Link> <span aria-hidden="true"> / </span><span aria-current="page">Character Components</span></nav>
        <header className="mt-6 border-b border-[#ded7ca] pb-10 text-center">
          <p className="hs-kicker">Read the clues inside a character</p>
          <h1 className="hs-display mx-auto mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">Chinese Character Components</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#566276]">Some components suggest a meaning category. Others preserve a family resemblance in sound. Learn to ask which job a component performs before using it as a memory clue.</p>
        </header>

        <section className="mt-9 grid gap-5 lg:grid-cols-2" aria-label="Component types">
          <TypeCard icon={<Eye className="size-5" />} title="Meaning components" text="A semantic component narrows the topic: water, people, hand actions, speech, food, emotion, or another broad field. It rarely supplies the complete definition." example="氵 + 青 → 清: water/clarity category plus a qing sound clue" />
          <TypeCard icon={<Ear className="size-5" />} title="Sound components" text="A phonetic component connects characters to a historical sound family. Modern initials and tones can shift, so it predicts a neighborhood rather than an exact reading." example="青 → 清 qīng · 请 qǐng · 情 qíng · 精 jīng" />
        </section>

        <ComponentGroup title="Start with visible meaning clues" eyebrow="Four semantic families" pages={meaningPages} />
        <ComponentGroup title="Then compare sound neighborhoods" eyebrow="Two phonetic families" pages={soundPages} />

        <section className="mt-12 grid gap-6 rounded border border-[#233e62] bg-[#172b49] p-7 text-white sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4c9b7]">Components support writing</p><h2 className="hs-display mt-2 text-3xl font-bold !text-white">Use the clue, then verify the whole character</h2><p className="mt-3 max-w-3xl leading-7 text-blue-100/80">Follow a component family into stroke order, compare how its shape changes by position, and print a mixed set that makes the contrast visible.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/chinese-stroke-order-rules" className="hs-secondary-button min-h-12 border-white/30 bg-transparent text-white hover:bg-white/10">Review stroke rules</Link><Link href="/generator" className="hs-primary-button min-h-12">Create component worksheet <ArrowRight className="size-4" /></Link></div>
        </section>
      </main>
    </PublicPageShell>
  );
}

function TypeCard({ icon, title, text, example }: { icon: React.ReactNode; title: string; text: string; example: string }) {
  return <article className="hs-card p-6 sm:p-7"><span className="grid size-11 place-items-center rounded-full bg-[#f7efe3] text-[#9d3c32]">{icon}</span><h2 className="hs-display mt-4 text-2xl font-bold">{title}</h2><p className="mt-3 text-sm leading-7 text-[#566276]">{text}</p><p className="mt-4 rounded border border-[#ded7ca] bg-[#fffdf8] p-4 text-sm font-semibold leading-6 text-[#42516a]">{example}</p></article>;
}

function ComponentGroup({ title, eyebrow, pages }: { title: string; eyebrow: string; pages: typeof characterComponentPages }) {
  return (
    <section className="mt-11" aria-labelledby={`${eyebrow.replaceAll(" ", "-")}-title`}>
      <p className="hs-kicker">{eyebrow}</p><h2 id={`${eyebrow.replaceAll(" ", "-")}-title`} className="hs-display mt-2 text-3xl font-bold">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => <Link key={page.slug} href={`/components/${page.slug}`} className="hs-card group flex min-h-64 flex-col p-6"><span className="hs-hanzi-context text-6xl text-[#172b49]">{page.glyph}</span><span className="mt-3 text-sm font-bold text-[#9d3c32]">{page.pinyin} · {page.kind === "meaning" ? "meaning clue" : "sound family"}</span><h3 className="hs-display mt-2 text-xl font-bold">{page.name}</h3><span className="mt-3 line-clamp-3 text-sm leading-7 text-[#566276]">{page.intro}</span><span className="mt-auto inline-flex items-center gap-1 pt-5 font-bold text-[#24466e] group-hover:text-[#b62822]">Open guide <ArrowRight className="size-4" /></span></Link>)}
      </div>
    </section>
  );
}
