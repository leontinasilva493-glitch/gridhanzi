import { ArrowRight, CheckCircle2 } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { getHskPublicPath, type HskPublicPage } from "../hsk-pages";
import { getHskPublicEntries, summarizePublicHskEntries } from "../hsk-public-utils";
import { HskLevelBrowser } from "./hsk-level-browser";
import { StructuredData } from "./structured-data";
import { PublicPageShell } from "./site-shell";

export function HskLevelPage({ page, locale }: { page: HskPublicPage; locale: string }) {
  const entries = getHskPublicEntries(page.system, page.level);
  const summary = summarizePublicHskEntries(entries);
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pathname = getHskPublicPath(page);
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}${pathname}`;

  return (
    <PublicPageShell active="hsk">
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: page.title,
          description: page.description,
          url: pageUrl,
          inLanguage: "en",
          numberOfItems: summary.wordCount,
          about: [`HSK ${page.system}`, `HSK Level ${page.level}`, "Chinese vocabulary", "Chinese handwriting"],
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${envConfigs.app_url}${localePrefix || "/"}` },
            { "@type": "ListItem", position: 2, name: "HSK Vocabulary Lists", item: `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/hsk` },
            { "@type": "ListItem", position: 3, name: page.title, item: pageUrl },
          ],
        },
      ]} />
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link> <span aria-hidden="true"> / </span>
          <Link href="/hsk">HSK Vocabulary Lists</Link> <span aria-hidden="true"> / </span>
          <span aria-current="page">{page.system} Level {page.level}</span>
        </nav>

        <header className="mt-6 grid gap-7 border-b border-[#ded7ca] pb-9 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
          <div>
            <p className="hs-kicker">{page.eyebrow}</p>
            <h1 className="hs-display mt-3 text-4xl font-bold leading-tight sm:text-5xl">{page.heading}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">{page.intro}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Count value={summary.wordCount} label="words" />
            <Count value={summary.uniqueHanziCount} label="unique Hanzi" />
          </div>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]" aria-labelledby="study-focus-title">
          <article className="hs-card p-6 sm:p-8">
            <p className="hs-kicker">What makes this list different</p>
            <h2 id="study-focus-title" className="hs-display mt-2 text-3xl font-bold">Study focus for {page.system} Level {page.level}</h2>
            <p className="mt-4 leading-8 text-[#4e5d70]">{page.focus}</p>
          </article>
          <aside className="rounded border border-[#d8c49f] bg-[#fff9ed] p-6">
            <h2 className="hs-display text-xl font-bold">A practical three-step cycle</h2>
            <ol className="mt-4 space-y-3">
              {page.studyPlan.map((step) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-[#5a5f65]">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#267254]" /> {step}
                </li>
              ))}
            </ol>
          </aside>
        </section>

        {page.highlights && page.challenges && page.practiceBrief ? (
          <>
            <section className="mt-10" aria-labelledby="level-highlights-title">
              <p className="hs-kicker">What changes at this level</p>
              <h2 id="level-highlights-title" className="hs-display mt-2 text-3xl font-bold">
                Skills to build—not just words to collect
              </h2>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {page.highlights.map((highlight, index) => (
                  <article key={highlight.title} className="hs-card p-6">
                    <span className="text-sm font-bold text-[#b62822]">0{index + 1}</span>
                    <h3 className="hs-display mt-2 text-xl font-bold">{highlight.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#566276]">{highlight.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]" aria-labelledby="level-challenges-title">
              <article className="hs-card p-6 sm:p-8">
                <p className="hs-kicker">Common learner traps</p>
                <h2 id="level-challenges-title" className="hs-display mt-2 text-3xl font-bold">
                  Three challenges worth isolating
                </h2>
                <div className="mt-5 space-y-5">
                  {page.challenges.map((challenge) => (
                    <div key={challenge.title} className="border-l-2 border-[#b62822] pl-4">
                      <h3 className="font-bold text-[#172b49]">{challenge.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-[#566276]">{challenge.guidance}</p>
                    </div>
                  ))}
                </div>
              </article>
              <aside className="rounded border border-[#233e62] bg-[#172b49] p-6 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4c9b7]">Practice brief</p>
                <h2 className="hs-display mt-2 text-2xl font-bold !text-white">{page.practiceBrief.title}</h2>
                <p className="mt-3 text-sm leading-7 text-blue-100/80">{page.practiceBrief.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {page.practiceBrief.sampleTerms.map((term) => (
                    <span key={term} className="rounded-full border border-white/25 px-3 py-1.5 text-sm">{term}</span>
                  ))}
                </div>
                <Link
                  href={`/generator?words=${encodeURIComponent(page.practiceBrief.sampleTerms.join(","))}`}
                  className="hs-primary-button mt-5 min-h-12"
                >
                  Make this focused worksheet <ArrowRight className="size-4" />
                </Link>
              </aside>
            </section>
          </>
        ) : null}

        <section className="mt-9" aria-labelledby="vocabulary-title">
          <p className="hs-kicker">Search and select</p>
          <h2 id="vocabulary-title" className="hs-display mt-2 text-3xl font-bold">{page.title}: complete searchable list</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#566276]">
            Select a small review set or send the full level to the worksheet maker. Character names with published writing guides link directly to stroke order, usage, and graded examples.
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-6 text-[#6b7584]">
            Level labels follow the bundled HSK catalog. This study list helps organize vocabulary and handwriting; it does not predict an official exam score.
          </p>
          <HskLevelBrowser entries={entries} system={page.system} level={page.level} guideCharacters={[...page.featuredCharacters]} />
        </section>

        {page.featuredCharacters.length ? (
        <section className="mt-10" aria-labelledby="character-path-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hs-kicker">Go deeper than translation</p>
              <h2 id="character-path-title" className="hs-display mt-2 text-3xl font-bold">Character guides for this learning path</h2>
            </div>
            <Link href="/stroke-order" className="hs-secondary-button">All character guides</Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.featuredCharacters.map((character) => (
              <Link key={character} href={`/stroke-order/${character}`} className="hs-card group flex min-h-28 items-center gap-4 p-5">
                <span className="hs-hanzi-context text-5xl text-[#172b49]">{character}</span>
                <span className="font-bold text-[#24466e] group-hover:text-[#b62822]">Stroke order and usage <ArrowRight className="ml-1 inline size-4" /></span>
              </Link>
            ))}
          </div>
        </section>
        ) : null}

        <section className="mt-10 grid gap-4 lg:grid-cols-3" aria-label="Related learning tools">
          <Related title="Check your own Chinese text" text="Paste a passage, compare its HSK 2.0 and 3.0 profile, and isolate the words above your target level." href="/hsk-level-checker" label="Open level checker" />
          {page.templateSlug ? (
            <Related title="Start from a template" text={`Use the ready-made ${page.templateSlug.toUpperCase().replace("-", " ")} sequence with a tested worksheet layout.`} href={`/templates/${page.templateSlug}`} label="View template" />
          ) : (
            <Related title="Build a selective review" text="Open this full level in the worksheet maker, then filter it down to a practical active-writing set." href={`/generator?hskSystem=${page.system}&hskLevel=${page.level}`} label="Choose words in generator" />
          )}
          <Related title="Choose a printable grid" text="Match the practice stage with Tian Zi Ge, Mi Zi Ge, or blank writing paper." href="/grids" label="Browse grids" />
        </section>
      </main>
    </PublicPageShell>
  );
}

function Count({ value, label }: { value: number; label: string }) {
  return <div className="rounded border border-[#d8c49f] bg-[#fff9ed] p-5 text-center"><strong className="hs-display block text-3xl text-[#172b49]">{value}</strong><span className="mt-1 block text-sm text-[#617084]">{label}</span></div>;
}

function Related({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return <article className="hs-card flex flex-col p-6"><h2 className="hs-display text-xl font-bold">{title}</h2><p className="mt-3 flex-1 text-sm leading-7 text-[#566276]">{text}</p><Link href={href} className="mt-4 inline-flex items-center gap-1 font-bold text-[#24466e] hover:text-[#b62822]">{label} <ArrowRight className="size-4" /></Link></article>;
}
