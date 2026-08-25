import { ArrowRight, BookOpenCheck, Compass, Shapes } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { comparisonPages, type ComparisonCategory } from "../comparison-pages";
import { StructuredData } from "./structured-data";
import { PublicPageShell } from "./site-shell";

const categoryCopy: Record<ComparisonCategory, { title: string; description: string; icon: React.ReactNode }> = {
  "Grammar and usage": { title: "Choose by sentence role", description: "Use time, position, and neighboring words to resolve identical or similar sounds.", icon: <BookOpenCheck className="size-5" /> },
  "Direction and contrast": { title: "Map the relationship", description: "Anchor opposite meanings to a viewpoint, spatial axis, time line, or changed state.", icon: <Compass className="size-5" /> },
  "Shape and recognition": { title: "Watch the moving pen", description: "Separate look-alike characters through stroke order, crossing points, components, and word context.", icon: <Shapes className="size-5" /> },
};

export function ComparisonDirectoryPage({ locale }: { locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/compare`;

  return (
    <PublicPageShell active="compare">
      <StructuredData data={[
        { "@context": "https://schema.org", "@type": "CollectionPage", name: "Chinese Character and Grammar Comparisons", description: "Decision-focused guides for commonly confused Chinese characters, grammar markers, negatives, directions, and look-alike forms.", url: pageUrl, inLanguage: "en" },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${envConfigs.app_url}${localePrefix || "/"}` }, { "@type": "ListItem", position: 2, name: "Chinese Comparisons", item: pageUrl }] },
      ]} />
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]"><Link href="/">Home</Link> <span aria-hidden="true"> / </span> <span aria-current="page">Chinese Comparisons</span></nav>
        <header className="mt-6 border-b border-[#ded7ca] pb-10 text-center">
          <p className="hs-kicker">Make the decision, not a guess</p>
          <h1 className="hs-display mx-auto mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">Chinese characters learners confuse—and how to choose</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#566276]">Each guide owns one specific confusion: a sentence-position rule, a direction map, or a visible stroke cue. Correct the mistake, open the character guide, then practise the pair on paper.</p>
        </header>

        {(Object.keys(categoryCopy) as ComparisonCategory[]).map((category) => {
          const info = categoryCopy[category];
          const pages = comparisonPages.filter((page) => page.category === category);
          return (
            <section key={category} className="mt-10" aria-labelledby={`${category.replaceAll(" ", "-")}-title`}>
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f7efe3] text-[#9d3c32]">{info.icon}</span>
                <div><p className="hs-kicker">{category}</p><h2 id={`${category.replaceAll(" ", "-")}-title`} className="hs-display mt-1 text-3xl font-bold">{info.title}</h2><p className="mt-2 text-sm leading-7 text-[#566276]">{info.description}</p></div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {pages.map((page) => (
                  <Link key={page.slug} href={`/compare/${page.slug}`} className="hs-card group grid min-h-52 gap-4 p-6 sm:grid-cols-[auto_minmax(0,1fr)]">
                    <span className="hs-hanzi-context text-5xl leading-none text-[#172b49]">{page.characters.join(" · ")}</span>
                    <span className="min-w-0"><span className="hs-display block text-xl font-bold text-[#172b49]">{page.heading}</span><span className="mt-3 block text-sm leading-7 text-[#566276]">{page.intro}</span><span className="mt-4 inline-flex items-center gap-1 font-bold text-[#24466e] group-hover:text-[#b62822]">See rules and corrections <ArrowRight className="size-4" /></span></span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mt-11 grid gap-5 rounded border border-[#233e62] bg-[#172b49] p-7 text-white sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4c9b7]">Apply the distinction</p><h2 className="hs-display mt-2 text-3xl font-bold !text-white">Move from comparison to handwriting recall</h2><p className="mt-3 max-w-3xl leading-7 text-blue-100/80">Build a mixed worksheet from any comparison page, or choose a full HSK level and find these characters in a broader vocabulary context.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/generator" className="hs-primary-button min-h-12">Create worksheet</Link><Link href="/hsk" className="hs-secondary-button min-h-12 border-white/30 bg-transparent text-white hover:bg-white/10">Browse HSK lists</Link></div>
        </section>
      </main>
    </PublicPageShell>
  );
}
