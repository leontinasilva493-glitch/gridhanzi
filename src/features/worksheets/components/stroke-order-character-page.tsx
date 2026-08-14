import { ArrowRight, FilePlus2, Lightbulb } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import {
  buildStrokeOrderLearningResourceData,
  getRelatedStrokeOrderCharacters,
  type StrokeOrderCharacter,
} from "../stroke-order-characters";
import { StructuredData } from "./structured-data";
import { StrokeOrderClient } from "./stroke-order-client";
import { PublicPageShell } from "./site-shell";

export function StrokeOrderCharacterPage({
  entry,
  locale,
}: {
  entry: StrokeOrderCharacter;
  locale: string;
}) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pathname = `${localePrefix}/stroke-order/${entry.character}`;
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${pathname}`;
  const worksheetHref = `/generator?words=${encodeURIComponent(entry.character)}`;
  const hskPickerHref = "/generator?hskSystem=2.0&hskLevel=1";
  const relatedCharacters = getRelatedStrokeOrderCharacters(entry);

  return (
    <PublicPageShell active="stroke-order">
      <StructuredData
        data={[
          buildStrokeOrderLearningResourceData(entry, pageUrl),
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${envConfigs.app_url}${localePrefix || "/"}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Chinese Stroke Order",
                item: `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/stroke-order`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: entry.character,
                item: pageUrl,
              },
            ],
          },
        ]}
      />

      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link>
          <span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <Link href="/stroke-order">Stroke Order</Link>
          <span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <span aria-current="page">{entry.character}</span>
        </nav>

        <header className="mt-6 grid items-center gap-7 border-b border-[#ded7ca] pb-9 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <p className="hs-kicker">Character writing guide</p>
            <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
              <span className="hs-hanzi-context">{entry.character}</span> ({entry.pinyin}): {entry.meaning} — Stroke Order &amp; Writing Guide
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">
              Watch every stroke, inspect the complete written sequence, learn
              where this character appears, and add it to a printable practice
              sheet.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#e8f2ec] px-3 py-1.5 text-sm font-bold text-[#267254]">
                {entry.learningTier}
              </span>
              <p className="max-w-2xl text-sm leading-6 text-[#4e5d70]">
                {entry.importance}
              </p>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="hs-hanzi-context grid aspect-square place-items-center rounded-full border border-[#d7cfc1] bg-[#f7efe3] text-[8rem] leading-none text-[#172b49] shadow-[inset_0_0_0_10px_#fffaf2]"
          >
            {entry.character}
          </div>
        </header>

        <section aria-label="Character facts" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Pinyin" value={entry.pinyin} />
          <Fact label="Stroke count" value={`${entry.strokes} strokes`} />
          <Fact label="Radical" value={entry.radical} hanzi />
          <Fact label="Structure" value={entry.structure} />
        </section>

        <section className="mt-8" aria-labelledby="components-title">
          <p className="hs-kicker">Character anatomy</p>
          <h2 id="components-title" className="hs-display mt-2 text-3xl font-bold">
            Components to notice in {entry.character}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entry.components.map((component) => (
              <article key={`${component.character}-${component.explanation}`} className="hs-card min-w-0 p-5">
                <p className="hs-hanzi-context text-4xl font-semibold text-[#172b49]">
                  {component.character}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#5d6878]">
                  {component.explanation}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="animation-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="hs-kicker">Watch and practise</p>
              <h2 id="animation-title" className="hs-display mt-1 text-3xl font-bold">
                Animated stroke order for {entry.character}
              </h2>
            </div>
            <span className="rounded-full border border-[#d1c8b9] bg-white px-3 py-1.5 text-xs font-semibold text-[#566276]">
              Traditional: <span className="hs-hanzi-context">{entry.traditional}</span>
            </span>
          </div>
          <StrokeOrderClient
            initialCharacter={entry.character}
            initialInfo={entry}
            showSearch={false}
            showGuidance={false}
          />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2" aria-label="Pronunciation and use guidance">
          <article className="hs-card p-6 sm:p-8">
            <p className="hs-kicker">Say it clearly</p>
            <h2 className="hs-display mt-2 text-3xl font-bold">
              Pronunciation notes
            </h2>
            <p className="mt-4 text-base leading-8 text-[#4e5d70]">
              {entry.readingNotes}
            </p>
          </article>

          <article className="hs-card border-[#d8c49f] bg-[#fff9ed] p-6 sm:p-8">
            <p className="hs-kicker">Use it in real life</p>
            <h2 className="hs-display mt-3 text-2xl font-bold">
              {entry.usageTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5a5f65]">
              {entry.useNotes}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#5a5f65]">
              {entry.usage}
            </p>
          </article>
        </section>

        <section className="mt-8" aria-labelledby="hsk-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hs-kicker">Level reference</p>
              <h2 id="hsk-title" className="hs-display mt-2 text-3xl font-bold">
                HSK information for {entry.character}
              </h2>
            </div>
            <Link href={hskPickerHref} className="hs-secondary-button">
              Browse HSK lists
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.8fr)]">
            <div className="grid gap-4 md:grid-cols-2">
              {entry.hsk.map((item) => (
                <article key={`${item.system}-${item.level}`} className="hs-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-[#172b49]">{item.system}</h3>
                    <span className="rounded-full bg-[#e8f2ec] px-3 py-1 text-xs font-bold text-[#267254]">
                      {item.level}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#5d6878]">{item.note}</p>
                </article>
              ))}
            </div>
            <article className="hs-card border-[#d8c49f] bg-[#fff9ed] p-5">
              <h3 className="font-bold text-[#172b49]">Need a full HSK list?</h3>
              <p className="mt-3 text-sm leading-6 text-[#5d6878]">
                Keep this character in the worksheet shortcut above, or open the
                HSK picker to choose a full HSK 2.0 or HSK 3.0 level list.
              </p>
              <Link
                href={hskPickerHref}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#24466e] hover:text-[#b62822]"
              >
                Browse HSK lists <ArrowRight className="size-4" />
              </Link>
            </article>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="examples-title">
          <p className="hs-kicker">Build vocabulary</p>
          <h2 id="examples-title" className="hs-display mt-2 text-3xl font-bold">
            Common words with {entry.character}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {entry.examples.map((example) => (
              <article key={example.hanzi} className="hs-card min-w-0 p-5">
                <p className="hs-hanzi-context text-4xl font-semibold text-[#172b49]">
                  {example.hanzi}
                </p>
                <p className="mt-3 font-semibold text-[#b62822]">{example.pinyin}</p>
                <p className="mt-1 text-sm leading-6 text-[#5d6878]">{example.meaning}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="sentences-title">
          <p className="hs-kicker">Read it in steps</p>
          <h2 id="sentences-title" className="hs-display mt-2 text-3xl font-bold">
            Graded sentences with {entry.character}
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {entry.exampleSentences.map((sentence) => (
              <article key={`${sentence.learningLabel}-${sentence.hanzi}`} className="hs-card min-w-0 p-5">
                <span className="inline-flex rounded-full bg-[#f7efe3] px-3 py-1 text-xs font-bold text-[#9d3c32]">
                  {sentence.learningLabel}
                </span>
                <p className="hs-hanzi-context mt-4 text-2xl leading-9 text-[#172b49]">
                  {sentence.hanzi}
                </p>
                <p className="mt-3 font-semibold text-[#b62822]">{sentence.pinyin}</p>
                <p className="mt-1 text-sm leading-6 text-[#5d6878]">{sentence.meaning}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2" aria-label="Mistake and confusable character guidance">
          <article className="hs-card border-[#d8c49f] bg-[#fff9ed] p-6">
            <p className="hs-kicker">Common mistake</p>
            <h2 className="hs-display mt-2 text-2xl font-bold">
              A writing check before you practise
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5a5f65]">
              {entry.commonMistake}
            </p>
          </article>
          <article className="hs-card border-[#cbd7e5] bg-[#f5f8fb] p-6">
            <p className="hs-kicker">Do not mix these up</p>
            <h2 className="hs-display mt-2 text-2xl font-bold">
              <span className="hs-hanzi-context">{entry.confusableCharacter.character}</span> and {entry.character}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5a5f65]">
              {entry.confusableCharacter.guidance}
            </p>
          </article>
        </section>

        <section className="mt-8 hs-card border-[#d8c49f] bg-[#fff9ed] p-6 sm:p-8" aria-labelledby="writing-tip-title">
          <div className="flex items-center gap-2 text-[#9d3c32]">
            <Lightbulb className="size-5" />
            <span className="text-sm font-bold uppercase tracking-[0.16em]">Writing tip</span>
          </div>
          <h2 id="writing-tip-title" className="hs-display mt-3 text-2xl font-bold">
            Keep {entry.character} balanced
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5a5f65]">
            {entry.writingTip}
          </p>
        </section>

        <section className="mt-9 grid items-center gap-6 rounded border border-[#233e62] bg-[#172b49] p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4c9b7]">
              Continue on paper
            </p>
            <h2 className="hs-display mt-2 text-3xl font-bold !text-white">
              Practise {entry.character} with tracing and writing grids
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#dce5ef]">
              Open the worksheet maker with {entry.character} already filled in,
              then choose a grid, cell size, and practice mode.
            </p>
          </div>
          <Link href={worksheetHref} className="hs-primary-button min-h-12 px-6">
            <FilePlus2 className="size-5" /> Add {entry.character} to a worksheet
          </Link>
        </section>

        <section className="mt-10 border-t border-[#ded7ca] pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="hs-kicker">Keep exploring</p>
              <h2 className="hs-display mt-2 text-2xl font-bold">More stroke-order guides</h2>
            </div>
            <Link href="/stroke-order" className="hs-secondary-button">
              Search another character <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedCharacters.map((related) => (
              <Link
                key={related.character}
                href={`/stroke-order/${related.character}`}
                className="hs-card flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5"
              >
                <span className="hs-hanzi-context text-5xl text-[#172b49]">{related.character}</span>
                <span className="min-w-0">
                  <span className="block font-bold">{related.pinyin} · {related.meaning}</span>
                  <span className="mt-1 block text-sm text-[#687487]">View stroke order and examples</span>
                </span>
                <ArrowRight className="ml-auto size-4 shrink-0 text-[#b62822]" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

function Fact({
  label,
  value,
  hanzi = false,
}: {
  label: string;
  value: string;
  hanzi?: boolean;
}) {
  return (
    <div className="hs-card px-5 py-4">
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#7a6f65]">{label}</p>
      <p className={`mt-2 text-xl font-bold text-[#172b49] ${hanzi ? "hs-hanzi-context" : ""}`}>
        {value}
      </p>
    </div>
  );
}
