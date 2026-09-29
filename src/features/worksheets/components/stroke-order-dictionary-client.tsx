"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, RotateCcw, Search } from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import { trackDictionaryEvent } from "../analytics";
import {
  filterStrokeOrderDictionary,
  getStrokeOrderDictionaryFacets,
  type StrokeOrderDictionaryEntry,
} from "../stroke-order-dictionary";

const PAGE_SIZE = 24;

export function StrokeOrderDictionaryClient({
  entries,
}: {
  entries: readonly StrokeOrderDictionaryEntry[];
}) {
  const [query, setQuery] = useState("");
  const [radical, setRadical] = useState("");
  const [strokeCount, setStrokeCount] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const facets = useMemo(() => getStrokeOrderDictionaryFacets(entries), [entries]);
  const results = useMemo(
    () => filterStrokeOrderDictionary(entries, { query, radical, strokes: strokeCount }),
    [entries, query, radical, strokeCount],
  );
  const activeFilterCount = Number(Boolean(query.trim())) + Number(Boolean(radical)) + Number(strokeCount !== null);
  const visibleResults = results.slice(0, visibleCount);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) trackDictionaryEvent("dictionary_search", results.length, activeFilterCount);
    document.getElementById("dictionary-results")?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function chooseRadical(value: string) {
    setRadical(value);
    setVisibleCount(PAGE_SIZE);
    const count = filterStrokeOrderDictionary(entries, { query, radical: value, strokes: strokeCount }).length;
    trackDictionaryEvent("dictionary_filter_used", count,
      Number(Boolean(query.trim())) + Number(Boolean(value)) + Number(strokeCount !== null));
  }

  function chooseStrokeCount(value: string) {
    const nextCount = value ? Number(value) : null;
    setStrokeCount(nextCount);
    setVisibleCount(PAGE_SIZE);
    const count = filterStrokeOrderDictionary(entries, { query, radical, strokes: nextCount }).length;
    trackDictionaryEvent("dictionary_filter_used", count,
      Number(Boolean(query.trim())) + Number(Boolean(radical)) + Number(nextCount !== null));
  }

  function clearFilters() {
    setQuery("");
    setRadical("");
    setStrokeCount(null);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      <section aria-labelledby="dictionary-search-title" className="hs-card mt-8 border-[#d8c49f] bg-[#fffaf0] p-5 sm:p-7">
        <h2 id="dictionary-search-title" className="hs-display text-2xl font-bold text-[#172b49]">Find a character</h2>
        <p className="mt-2 text-sm leading-6 text-[#566276]">Search the reviewed guides by Hanzi, Pinyin, or English meaning. Combine a search with radical and stroke-count filters.</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(150px,1fr)_minmax(150px,1fr)]">
          <form onSubmit={submitSearch} role="search">
            <label htmlFor="dictionary-query" className="block text-sm font-bold text-[#172b49]">Hanzi, Pinyin, or meaning</label>
            <div className="mt-2 flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#6b7584]" />
                <input
                  id="dictionary-query"
                  type="search"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }}
                  placeholder="Try 爱, ai, or love"
                  autoComplete="off"
                  className="h-12 w-full rounded border border-[#cfc5b4] bg-white pl-11 pr-3 text-base outline-none focus:border-[#b62822] focus:ring-4 focus:ring-red-100"
                />
              </div>
              <button type="submit" className="hs-primary-button min-h-12 px-4">Search</button>
            </div>
          </form>
          <div>
            <label htmlFor="dictionary-radical" className="block text-sm font-bold text-[#172b49]">Radical</label>
            <select
              id="dictionary-radical"
              value={radical}
              onChange={(event) => chooseRadical(event.target.value)}
              className="mt-2 h-12 w-full rounded border border-[#cfc5b4] bg-white px-3 text-base text-[#172b49] outline-none focus:border-[#b62822] focus:ring-4 focus:ring-red-100"
            >
              <option value="">All radicals</option>
              {facets.radicals.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="dictionary-strokes" className="block text-sm font-bold text-[#172b49]">Stroke count</label>
            <select
              id="dictionary-strokes"
              value={strokeCount ?? ""}
              onChange={(event) => chooseStrokeCount(event.target.value)}
              className="mt-2 h-12 w-full rounded border border-[#cfc5b4] bg-white px-3 text-base text-[#172b49] outline-none focus:border-[#b62822] focus:ring-4 focus:ring-red-100"
            >
              <option value="">Any stroke count</option>
              {facets.strokeCounts.map((value) => <option key={value} value={value}>{value} {value === 1 ? "stroke" : "strokes"}</option>)}
            </select>
          </div>
        </div>
        {activeFilterCount > 0 ? (
          <button type="button" onClick={clearFilters} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#24466e] underline underline-offset-4 hover:text-[#b62822]">
            <RotateCcw aria-hidden="true" className="size-4" /> Clear search and filters
          </button>
        ) : null}
      </section>

      <section id="dictionary-results" aria-labelledby="dictionary-results-title" className="mt-10 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="hs-kicker">Reviewed character guides</p>
            <h2 id="dictionary-results-title" className="hs-display mt-2 text-3xl font-bold">Browse common Hanzi</h2>
            <p className="mt-2 text-sm text-[#647084]">Sorted by Pinyin</p>
          </div>
          <p role="status" aria-live="polite" aria-atomic="true" className="rounded-full bg-[#edf1f5] px-3 py-1.5 text-sm font-bold text-[#42516a]">
            {activeFilterCount > 0
              ? `${results.length} ${results.length === 1 ? "match" : "matches"} · showing ${visibleResults.length}`
              : `Showing ${visibleResults.length} of ${entries.length} characters`}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleResults.map((entry) => (
              <article key={entry.character} className="hs-card min-w-0 p-5">
                <div className="flex items-start gap-4">
                  <span aria-hidden="true" className="hs-hanzi-context shrink-0 text-5xl leading-none text-[#172b49]">{entry.character}</span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#172b49]">{entry.character} · {entry.pinyin}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#566276]">{entry.meaning}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs font-semibold text-[#647084]">Radical <span className="hs-hanzi-context text-base">{entry.radical}</span> · {entry.strokes} {entry.strokes === 1 ? "stroke" : "strokes"}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-[#e6e0d7] pt-4 text-sm font-bold">
                  <Link
                    href={`/stroke-order/${entry.character}`}
                    aria-label={`View ${entry.character} stroke guide`}
                    onClick={() => trackDictionaryEvent("dictionary_guide_open", results.length, activeFilterCount)}
                    className="inline-flex min-h-11 items-center gap-1 text-[#b62822] hover:underline"
                  >
                    <BookOpen aria-hidden="true" className="size-4" /> View stroke guide <ArrowRight aria-hidden="true" className="size-3" />
                  </Link>
                  <Link
                    href={`/generator?words=${encodeURIComponent(entry.character)}`}
                    aria-label={`Make a worksheet with ${entry.character}`}
                    onClick={() => trackDictionaryEvent("dictionary_worksheet_open", results.length, activeFilterCount)}
                    className="inline-flex min-h-11 items-center text-[#24466e] underline underline-offset-4 hover:text-[#b62822]"
                  >
                    Make a worksheet
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="hs-card mt-6 p-6 sm:p-8">
            <h3 className="hs-display text-xl font-bold">No matching reviewed guide</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#566276]">Try another spelling or clear a filter. If you know the Hanzi but it is not in this collection, the stroke-order tool can still show its animation.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={clearFilters} className="hs-secondary-button">Clear filters</button>
              <Link href="/stroke-order" className="hs-primary-button">Open single-character lookup <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        )}
        {results.length > visibleCount ? (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="hs-secondary-button mx-auto mt-6 flex min-h-12 px-6"
          >
            Show more characters <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </section>
    </>
  );
}
