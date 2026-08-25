import { ArrowRight, BookOpen, ListChecks, Search } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { getHskPublicPath, hskPublicPages } from "../hsk-pages";
import { getHskPublicEntries, summarizePublicHskEntries } from "../hsk-public-utils";
import { StructuredData } from "./structured-data";
import { PublicPageShell } from "./site-shell";

export function HskDirectoryPage({ locale }: { locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/hsk`;

  return (
    <PublicPageShell active="hsk">
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "HSK Vocabulary Lists for Chinese Writing Practice",
          description: "Compare HSK 2.0 and HSK 3.0 beginner and intermediate vocabulary lists, then create custom handwriting worksheets.",
          url: pageUrl,
          inLanguage: "en",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${envConfigs.app_url}${localePrefix || "/"}` },
            { "@type": "ListItem", position: 2, name: "HSK Vocabulary Lists", item: pageUrl },
          ],
        },
      ]} />
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link> <span aria-hidden="true"> / </span> <span aria-current="page">HSK Vocabulary Lists</span>
        </nav>
        <header className="mt-6 grid gap-8 border-b border-[#ded7ca] pb-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="hs-kicker">Choose the right vocabulary path</p>
            <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
              HSK vocabulary lists for Chinese writing practice
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">
              Compare HSK 2.0 and HSK 3.0, search each level by Hanzi, Pinyin, or English, and send exactly the words you choose to a printable worksheet.
            </p>
          </div>
          <aside className="rounded border border-[#d8c49f] bg-[#fff9ed] p-6">
            <p className="text-sm font-bold text-[#9d3c32]">Not sure which version?</p>
            <p className="mt-3 text-sm leading-7 text-[#5a5f65]">
              Use HSK 2.0 for the familiar compact six-level path. Use HSK 3.0 for the broader current vocabulary framework. The lists stay separate so word membership is never blurred.
            </p>
          </aside>
        </header>

        <section className="mt-9" aria-labelledby="levels-title">
          <p className="hs-kicker">Six curated lists</p>
          <h2 id="levels-title" className="hs-display mt-2 text-3xl font-bold">Start with your system and level</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {hskPublicPages.map((page) => {
              const summary = summarizePublicHskEntries(getHskPublicEntries(page.system, page.level));
              return (
                <article key={`${page.system}-${page.level}`} className="hs-card flex min-w-0 flex-col p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-[#e8f2ec] px-3 py-1.5 text-xs font-bold text-[#267254]">{page.eyebrow}</span>
                    <span className="text-sm text-[#617084]">{summary.wordCount} words · {summary.uniqueHanziCount} Hanzi</span>
                  </div>
                  <h3 className="hs-display mt-4 text-2xl font-bold">{page.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-[#566276]">{page.intro}</p>
                  <Link href={getHskPublicPath(page)} className="mt-5 inline-flex items-center gap-1 font-bold text-[#24466e] hover:text-[#b62822]">
                    Browse and select words <ArrowRight className="size-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Study workflow">
          <Workflow icon={<Search className="size-5" />} title="Find the word" text="Search by the form you know: Chinese characters, tone-marked or plain Pinyin, or an English meaning." />
          <Workflow icon={<ListChecks className="size-5" />} title="Choose a focused set" text="Watch the selected word and unique-character counts so one worksheet stays teachable." />
          <Workflow icon={<BookOpen className="size-5" />} title="Learn, then write" text="Open character and comparison guides before switching to trace, write, flashcard, or test practice." />
        </section>

        <section className="mt-10 rounded border border-[#233e62] bg-[#172b49] p-7 text-white sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4c9b7]">Beyond the list</p>
          <h2 className="hs-display mt-2 text-3xl font-bold !text-white">Turn vocabulary into useful practice</h2>
          <p className="mt-3 max-w-3xl leading-7 text-blue-100/80">
            Use the character guides for stroke order, the comparison guides for words learners confuse, or begin with a ready-made HSK worksheet template.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/stroke-order" className="hs-secondary-button border-white/30 bg-white text-[#172b49]">Browse character guides</Link>
            <Link href="/compare" className="hs-secondary-button border-white/30 bg-transparent text-white hover:bg-white/10">Compare similar characters</Link>
            <Link href="/templates#hsk-worksheets" className="hs-secondary-button border-white/30 bg-transparent text-white hover:bg-white/10">Open HSK templates</Link>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

function Workflow({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="hs-card p-6">
      <span className="grid size-10 place-items-center rounded-full bg-[#f7efe3] text-[#9d3c32]">{icon}</span>
      <h2 className="hs-display mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-[#566276]">{text}</p>
    </article>
  );
}
