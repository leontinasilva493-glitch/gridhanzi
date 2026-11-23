"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import type { HskWritingBatch } from "../hsk-writing-groups";

const MAX_SELECTION = 30;

export function HskWritingGroupBrowser({
  shortLabel,
  characters,
  batches,
  curatedStrokeSet,
}: {
  shortLabel: string;
  characters: string[];
  batches: HskWritingBatch[];
  curatedStrokeSet: string[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const curatedLookup = useMemo(() => new Set(curatedStrokeSet), [curatedStrokeSet]);
  const visibleCharacters = useMemo(
    () => characters.filter((character) => !query || character.includes(query)),
    [characters, query],
  );
  const worksheetHref = `/generator?words=${encodeURIComponent(selected.join("\n"))}`;

  function toggle(character: string) {
    setSelected((current) =>
      current.includes(character)
        ? current.filter((item) => item !== character)
        : current.length >= MAX_SELECTION
          ? current
          : [...current, character],
    );
  }

  function selectFirstBatch() {
    setSelected(visibleCharacters.slice(0, MAX_SELECTION));
  }

  async function copySelected() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(selected.join(""));
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mt-8 space-y-8">
      <section aria-labelledby="quick-sets-heading" className="hs-card border-hs-line bg-hs-paper p-5 sm:p-6">
        <p className="hs-kicker">Ready-to-print sets</p>
        <h2 id="quick-sets-heading" className="hs-display mt-1 text-2xl font-bold text-hs-ink">
          Open {shortLabel} in 30-character worksheet sets
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-hs-muted">
          Each button opens the worksheet generator pre-filled with that batch so you can adjust grids, Pinyin, and tracing before printing an A4 or US Letter PDF.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {batches.map((batch) => (
            <Link
              key={batch.index}
              href={batch.worksheetHref}
              className="hs-secondary-button min-h-11 text-sm"
            >
              {batch.label}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="custom-picker-heading">
        <div className="mb-4">
          <p className="hs-kicker">Interactive character list</p>
          <h2 id="custom-picker-heading" className="hs-display mt-1 text-2xl font-bold text-hs-ink">
            Select characters for a custom {shortLabel} worksheet
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-hs-muted">
            Click up to {MAX_SELECTION} characters to build a focused practice sheet, or open any character&apos;s stroke-order guide.
          </p>
        </div>

        <div className="hs-card border-hs-line bg-hs-paper p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label className="block">
              <span className="text-sm font-bold text-hs-ink">
                Find a character in {shortLabel}
              </span>
              <span className="mt-2 flex min-h-12 items-center gap-2 rounded border border-hs-line bg-white px-3 focus-within:border-hs-link focus-within:ring-2 focus-within:ring-hs-link/15">
                <Search className="size-4 shrink-0 text-hs-muted" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value.slice(0, 1))}
                  placeholder="Enter one Chinese character"
                  className="min-w-0 flex-1 bg-transparent py-3 text-base text-hs-ink outline-none"
                />
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="hs-secondary-button min-h-12"
                onClick={selectFirstBatch}
                disabled={!visibleCharacters.length}
              >
                Select first {Math.min(MAX_SELECTION, visibleCharacters.length)}
              </button>
              <button
                type="button"
                className="hs-secondary-button min-h-12"
                onClick={() => setSelected([])}
                disabled={!selected.length}
              >
                Clear
              </button>
              <button
                type="button"
                className="hs-secondary-button min-h-12"
                onClick={copySelected}
                disabled={!selected.length}
              >
                <Copy className="size-4" aria-hidden="true" />
                {copied ? "Copied" : "Copy selected"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-hs-line pt-5">
            <span className="rounded-full border border-hs-line bg-white px-3 py-2 text-sm text-hs-muted">
              <strong className="text-hs-ink">{selected.length}</strong> selected (up to {MAX_SELECTION})
            </span>
            {selected.length === 1 ? (
              <Link
                href={
                  curatedLookup.has(selected[0]!)
                    ? `/stroke-order/${encodeURIComponent(selected[0]!)}`
                    : `/stroke-order?character=${encodeURIComponent(selected[0]!)}`
                }
                className="text-sm font-semibold text-hs-link underline underline-offset-4 hover:text-hs-seal"
              >
                View stroke order for {selected[0]}
              </Link>
            ) : (
              <span className="text-sm text-hs-muted">
                Choose characters below, then open the worksheet generator.
              </span>
            )}
            {selected.length ? (
              <Link href={worksheetHref} className="hs-primary-button ml-auto min-h-12">
                Create worksheet ({selected.length})
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {visibleCharacters.map((character) => {
            const checked = selected.includes(character);
            return (
              <button
                key={character}
                type="button"
                onClick={() => toggle(character)}
                aria-pressed={checked}
                aria-label={`${checked ? "Remove" : "Select"} ${character}`}
                className={`hs-hanzi-context grid size-12 place-items-center rounded border text-2xl font-bold transition-colors ${
                  checked
                    ? "border-hs-seal bg-hs-seal text-white"
                    : "border-hs-line bg-white text-hs-ink hover:border-hs-seal"
                }`}
              >
                {checked ? (
                  <span className="relative">
                    {character}
                    <Check className="absolute -right-3 -top-2 size-3.5" aria-hidden="true" />
                  </span>
                ) : (
                  character
                )}
              </button>
            );
          })}
        </div>
        {!visibleCharacters.length ? (
          <p className="mt-4 text-sm text-hs-muted">
            No matching character in {shortLabel}. Try searching the{" "}
            <Link href="/hsk/3-0-writing-characters" className="text-hs-link underline">
              full 1,200-character HSK 3.0 writing list
            </Link>
            .
          </p>
        ) : null}
      </section>
    </div>
  );
}
