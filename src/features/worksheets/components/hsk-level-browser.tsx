"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Search, X } from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import type { HskCatalogEntry, HskLevel, HskSystem } from "../hsk";
import {
  buildPublicHskWorksheetHref,
  filterPublicHskEntries,
  selectVisiblePublicHskEntries,
  summarizePublicHskEntries,
  togglePublicHskSelection,
} from "../hsk-public-utils";

export function HskLevelBrowser({
  entries,
  system,
  level,
  guideCharacters,
}: {
  entries: HskCatalogEntry[];
  system: HskSystem;
  level: HskLevel;
  guideCharacters: string[];
}) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const filteredEntries = useMemo(
    () => filterPublicHskEntries(entries, query),
    [entries, query],
  );
  const selectedEntries = useMemo(
    () => entries.filter((entry) => selectedIds.has(entry.id)),
    [entries, selectedIds],
  );
  const summary = summarizePublicHskEntries(selectedEntries);
  const worksheetHref = buildPublicHskWorksheetHref(
    selectedEntries,
    system,
    level,
  );

  function toggleEntry(id: string) {
    setSelectedIds((current) => togglePublicHskSelection(current, id));
  }

  function selectVisible() {
    setSelectedIds((current) =>
      selectVisiblePublicHskEntries(current, filteredEntries),
    );
  }

  return (
    <div className="mt-6">
      <div className="hs-card border-[#d8c49f] bg-[#fff9ed] p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-bold text-[#172b49]">
              Search this level by Hanzi, Pinyin, or English
            </span>
            <span className="mt-2 flex min-h-12 items-center gap-2 rounded border border-[#cfc5b5] bg-white px-3 focus-within:border-[#24466e] focus-within:ring-2 focus-within:ring-[#24466e]/15">
              <Search className="size-4 shrink-0 text-[#617084]" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try 爱, xue sheng, or teacher"
                className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="grid size-8 place-items-center rounded hover:bg-[#f1ece3]"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={selectVisible} className="hs-secondary-button min-h-12">
              Select first {Math.min(filteredEntries.length, 50)} results
            </button>
            {selectedIds.size ? (
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="min-h-12 rounded px-4 text-sm font-bold text-[#9d3c32] hover:bg-[#f7efe3]"
              >
                Clear selection
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#e3d6c1] pt-5">
          <Stat label="Matches" value={filteredEntries.length} />
          <Stat label="Selected words" value={summary.wordCount} />
          <Stat label="Unique Hanzi" value={summary.uniqueHanziCount} />
          <Link href={worksheetHref} className="hs-primary-button ml-auto min-h-12 px-5">
            {selectedEntries.length ? "Practise selected words" : "Open full level in generator"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded border border-[#d8d0c2] bg-white">
        <div className="grid min-w-[620px] grid-cols-[44px_minmax(92px,0.75fr)_minmax(120px,0.9fr)_minmax(150px,1.6fr)] gap-3 border-b border-[#ded7ca] bg-[#f7f1e7] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#566276]">
          <span className="sr-only">Select</span>
          <span>Hanzi</span>
          <span>Pinyin</span>
          <span>English</span>
        </div>
        <ul className="min-w-[620px] divide-y divide-[#ece5d9]">
          {filteredEntries.map((entry) => {
            const checked = selectedIds.has(entry.id);
            const hasGuide = guideCharacters.includes(entry.hanzi);
            return (
              <li key={entry.id} className={checked ? "bg-[#fff9ed]" : undefined}>
                <div className="grid min-h-16 grid-cols-[44px_minmax(92px,0.75fr)_minmax(120px,0.9fr)_minmax(150px,1.6fr)] items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleEntry(entry.id)}
                    className={`grid size-8 place-items-center rounded border ${checked ? "border-[#b62822] bg-[#b62822] text-white" : "border-[#cfc5b5] bg-white"}`}
                    aria-label={`${checked ? "Remove" : "Select"} ${entry.hanzi}`}
                    aria-pressed={checked}
                  >
                    {checked ? <Check className="size-4" /> : null}
                  </button>
                  <div>
                    {hasGuide ? (
                      <Link href={`/stroke-order/${entry.hanzi}`} className="hs-hanzi-context text-2xl font-bold text-[#172b49] hover:text-[#b62822]">
                        {entry.hanzi}
                      </Link>
                    ) : (
                      <span className="hs-hanzi-context text-2xl font-bold text-[#172b49]">{entry.hanzi}</span>
                    )}
                  </div>
                  <span className="font-semibold text-[#9d3c32]">{entry.pinyin}</span>
                  <span className="text-sm leading-6 text-[#4e5d70]">{entry.english}</span>
                </div>
              </li>
            );
          })}
        </ul>
        {filteredEntries.length === 0 ? (
          <div className="px-5 py-12 text-center text-[#617084]">
            No words match this search. Try Hanzi, untoned Pinyin, or a shorter English meaning.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full border border-[#d8d0c2] bg-white px-3 py-2 text-sm text-[#566276]">
      <strong className="text-[#172b49]">{value}</strong> {label}
    </span>
  );
}
