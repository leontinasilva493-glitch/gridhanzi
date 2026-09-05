import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { HskLevelCheckerClient } from "./hsk-level-checker-client";
import { PublicPageShell } from "./site-shell";
import { StructuredData } from "./structured-data";

export function HskLevelCheckerPage({ locale }: { locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/hsk-level-checker`;

  return (
    <PublicPageShell active="hsk">
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "HSK Level Checker for Chinese Text",
          description: "Analyze Chinese text against HSK 2.0 and HSK 3.0 classifications, then create a worksheet from difficult terms.",
          url: pageUrl,
          applicationCategory: "EducationalApplication",
          operatingSystem: "Any",
          inLanguage: "en",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${envConfigs.app_url}${localePrefix || "/"}` },
            { "@type": "ListItem", position: 2, name: "HSK Vocabulary Lists", item: `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/hsk` },
            { "@type": "ListItem", position: 3, name: "HSK Level Checker", item: pageUrl },
          ],
        },
      ]} />
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link> <span aria-hidden="true"> / </span>
          <Link href="/hsk">HSK Vocabulary Lists</Link> <span aria-hidden="true"> / </span>
          <span aria-current="page">Level Checker</span>
        </nav>

        <header className="mt-6 grid gap-7 border-b border-[#ded7ca] pb-9 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <p className="hs-kicker">Turn a reading into a study list</p>
            <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
              HSK Level Checker for Chinese Text
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">
              Paste a lesson, article excerpt, or message. Compare its HSK 2.0 and 3.0 vocabulary profile, isolate terms above your target, and send the difficult set into a printable writing worksheet.
            </p>
          </div>
          <div className="rounded border border-[#d8c49f] bg-[#fff9ed] p-5">
            <ShieldCheck className="size-6 text-[#267254]" />
            <h2 className="hs-display mt-3 text-xl font-bold">A study aid, not a score</h2>
            <p className="mt-2 text-sm leading-7 text-[#566276]">
              The report classifies catalog matches. It does not predict an official exam score, comprehension, grammar control, or speaking ability.
            </p>
          </div>
        </header>

        <HskLevelCheckerClient />

        <section className="mt-12" aria-labelledby="report-title">
          <p className="hs-kicker">Read the result correctly</p>
          <h2 id="report-title" className="hs-display mt-2 text-3xl font-bold">What this HSK text report tells you</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <Explanation icon={<BookOpen className="size-5" />} title="Catalog coverage" text="Coverage is the share of Hanzi occurrences inside terms matched by the selected HSK list. Punctuation, numbers, and Latin text are ignored." />
            <Explanation icon={<GraduationCap className="size-5" />} title="Version-specific levels" text="The same term can sit at a different level in HSK 2.0 and 3.0. Switch versions before deciding whether a reading fits your course." />
            <Explanation icon={<ShieldCheck className="size-5" />} title="Honest limits" text="Names, specialist vocabulary, traditional forms, and segmentation ambiguity can appear outside the catalog even when a human reader knows them." />
          </div>
        </section>

        <section className="mt-11 grid gap-6 rounded border border-[#233e62] bg-[#172b49] p-7 text-white sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4c9b7]">From diagnosis to handwriting</p>
            <h2 className="hs-display mt-2 text-3xl font-bold !text-white">Practise the gap, not the whole dictionary</h2>
            <p className="mt-3 max-w-3xl leading-7 text-blue-100/80">
              Use the checker to find a manageable difficult set, review its level pages, then print only the words you need for the next lesson or reading.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/hsk" className="hs-secondary-button min-h-12 border-white/30 bg-transparent text-white hover:bg-white/10">Browse HSK lists</Link>
            <Link href="/generator" className="hs-primary-button min-h-12">Create worksheet <ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

function Explanation({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="hs-card p-6">
      <span className="grid size-10 place-items-center rounded-full bg-[#f7efe3] text-[#9d3c32]">{icon}</span>
      <h3 className="hs-display mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#566276]">{text}</p>
    </article>
  );
}
