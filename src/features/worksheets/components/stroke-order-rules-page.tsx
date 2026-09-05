import { AlertTriangle, ArrowRight, CheckCircle2, PenLine } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { strokeOrderExceptions, strokeOrderRules } from "../stroke-order-rules";
import { PublicPageShell } from "./site-shell";
import { StructuredData } from "./structured-data";

export function StrokeOrderRulesPage({ locale }: { locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/chinese-stroke-order-rules`;

  return (
    <PublicPageShell active="stroke-order">
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "Chinese Stroke Order Rules",
          description: "Eight practical Chinese stroke-order rules with worked examples, exceptions, and printable writing practice.",
          url: pageUrl,
          inLanguage: "en",
          educationalLevel: "Beginner to intermediate",
          learningResourceType: "Writing guide",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${envConfigs.app_url}${localePrefix || "/"}` },
            { "@type": "ListItem", position: 2, name: "Chinese Stroke Order", item: `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/stroke-order` },
            { "@type": "ListItem", position: 3, name: "Stroke Order Rules", item: pageUrl },
          ],
        },
      ]} />
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link> <span aria-hidden="true"> / </span>
          <Link href="/stroke-order">Chinese Stroke Order</Link> <span aria-hidden="true"> / </span>
          <span aria-current="page">Rules</span>
        </nav>

        <header className="mt-6 grid gap-7 border-b border-[#ded7ca] pb-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <p className="hs-kicker">Plan the structure before the details</p>
            <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">Chinese Stroke Order Rules</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">
              These eight patterns explain how most characters are organized: where the pen starts, which component sets the space, and which stroke waits until the structure is ready.
            </p>
          </div>
          <aside className="rounded border border-[#d8c49f] bg-[#fff9ed] p-5">
            <PenLine className="size-6 text-[#b62822]" />
            <h2 className="hs-display mt-3 text-xl font-bold">Rules guide; animation confirms</h2>
            <p className="mt-2 text-sm leading-7 text-[#566276]">
              General rules help you predict a sequence. A character-specific animation is the final check when components change form or a familiar rule has an exception.
            </p>
            <Link href="/stroke-order" className="mt-4 inline-flex items-center gap-1 font-bold text-[#24466e] hover:text-[#b62822]">Open the stroke-order tool <ArrowRight className="size-4" /></Link>
          </aside>
        </header>

        <section className="mt-10" aria-labelledby="rules-title">
          <p className="hs-kicker">Eight working patterns</p>
          <h2 id="rules-title" className="hs-display mt-2 text-3xl font-bold">Learn each rule through a spatial decision</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {strokeOrderRules.map((rule) => (
              <article key={rule.slug} id={rule.slug} className="hs-card scroll-mt-24 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f7efe3] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#9d3c32]">{rule.label}</span>
                  <span className="text-xs text-[#6b7584]">Predict → verify → practise</span>
                </div>
                <h3 className="hs-display mt-4 text-2xl font-bold">{rule.title}</h3>
                <p className="mt-2 font-semibold leading-7 text-[#42516a]">{rule.summary}</p>
                <p className="mt-3 text-sm leading-7 text-[#566276]">{rule.explanation}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {rule.examples.map((example) => (
                    <div key={example.character} className="rounded border border-[#ded7ca] bg-[#fffdf8] p-4">
                      {example.guideCharacter ? (
                        <Link href={`/stroke-order/${example.guideCharacter}`} className="hs-hanzi-context text-5xl text-[#172b49] hover:text-[#b62822]">{example.character}</Link>
                      ) : (
                        <span className="hs-hanzi-context text-5xl text-[#172b49]">{example.character}</span>
                      )}
                      <p className="mt-2 text-sm font-bold text-[#172b49]">{example.caption}</p>
                      <p className="mt-1 text-xs leading-5 text-[#617084]">{example.sequence}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-l-2 border-[#267254] pl-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#267254]">Practice check</p>
                  <p className="mt-1 text-sm leading-7 text-[#566276]">{rule.practice}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="exceptions-title">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fff1e8] text-[#b04a22]"><AlertTriangle className="size-5" /></span>
            <div>
              <p className="hs-kicker">Patterns that deserve a separate memory</p>
              <h2 id="exceptions-title" className="hs-display mt-1 text-3xl font-bold">Do not force one rule onto every component</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#566276]">Positioned components and enclosures have their own established sequences. Treat these as reusable writing units.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {strokeOrderExceptions.map((exception) => (
              <article key={exception.title} className="rounded border border-[#e1c9ad] bg-[#fff9ed] p-6">
                <span className="hs-hanzi-context text-4xl text-[#9d3c32]">{exception.character}</span>
                <h3 className="hs-display mt-3 text-xl font-bold">{exception.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#566276]">{exception.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 rounded border border-[#233e62] bg-[#172b49] p-7 text-white sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4c9b7]">Put the rules into one session</p>
            <h2 className="hs-display mt-2 text-3xl font-bold !text-white">Trace once, hide the model, then compare</h2>
            <p className="mt-3 max-w-3xl leading-7 text-blue-100/80">Start with individual strokes, notice the components that control the layout, and build a short worksheet instead of copying one character for an entire page.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/templates/basic-strokes" className="hs-secondary-button min-h-12 border-white/30 bg-transparent text-white hover:bg-white/10">Practise basic strokes</Link>
            <Link href="/chinese-character-components" className="hs-secondary-button min-h-12 border-white/30 bg-transparent text-white hover:bg-white/10">Explore components</Link>
            <Link href="/generator" className="hs-primary-button min-h-12">Make a worksheet <ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
