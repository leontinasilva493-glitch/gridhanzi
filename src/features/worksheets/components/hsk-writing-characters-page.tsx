"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import catalog from "../hsk-writing-characters.json";

type Group = (typeof catalog.groups)[number];
const MAX_SELECTION = 30;

export function HskWritingCharactersPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const groups = useMemo(
    () =>
      catalog.groups.map((group) => ({
        ...group,
        characters: group.characters.filter(
          (character) => !query || character.includes(query),
        ),
      })),
    [query],
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
    <div className="mt-7">
      <div className="mb-4">
        <h2 className="hs-display text-2xl font-bold">
          Select HSK 3.0 writing characters for practice
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#617084]">
          Search by character, then choose up to 30 characters to make a custom worksheet.
        </p>
      </div>
      <div className="hs-card border-[#d8c49f] bg-[#fff9ed] p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-bold text-[#172b49]">
              Search the HSK 3.0 writing-character list
            </span>
            <span className="mt-2 flex min-h-12 items-center gap-2 rounded border border-[#cfc5b5] bg-white px-3 focus-within:border-[#24466e] focus-within:ring-2 focus-within:ring-[#24466e]/15">
              <Search className="size-4 shrink-0 text-[#617084]" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value.slice(0, 1))}
                placeholder="Enter one Chinese character"
                className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none"
              />
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="hs-secondary-button min-h-12"
              onClick={() => setSelected([])}
              disabled={!selected.length}
            >
              Clear selection
            </button>
            <button
              type="button"
              className="hs-secondary-button min-h-12"
              onClick={copySelected}
              disabled={!selected.length}
            >
              <Copy className="size-4" />
              {copied ? "Copied" : "Copy selected"}
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#e3d6c1] pt-5">
          <span className="rounded-full border border-[#d8d0c2] bg-white px-3 py-2 text-sm text-[#566276]">
            <strong className="text-[#172b49]">{selected.length}</strong> selected
            (up to {MAX_SELECTION})
          </span>
          <span className="text-sm text-[#617084]">
            Choose characters to make a printable writing worksheet.
          </span>
          {selected.length ? (
            <Link href={worksheetHref} className="hs-primary-button ml-auto min-h-12">
              Create a worksheet
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-7 grid gap-7">
        {groups.map((group) => (
          <WritingGroup
            key={group.level}
            group={group}
            selected={selected}
            onToggle={toggle}
          />
        ))}
      </div>
    </div>
  );
}

function WritingGroup({
  group,
  selected,
  onToggle,
}: {
  group: Group;
  selected: string[];
  onToggle: (character: string) => void;
}) {
  return (
    <section aria-labelledby={`writing-${group.level}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="hs-kicker">Syllabus group</p>
          <h2 id={`writing-${group.level}`} className="hs-display mt-1 text-2xl font-bold">
            {group.label}
          </h2>
        </div>
        <span className="text-sm text-[#617084]">{group.count} characters</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {group.characters.map((character) => {
          const checked = selected.includes(character);
          return (
            <button
              key={character}
              type="button"
              onClick={() => onToggle(character)}
              aria-pressed={checked}
              aria-label={`${checked ? "Remove" : "Select"} ${character}`}
              className={`hs-hanzi-context grid size-12 place-items-center rounded border text-2xl font-bold transition-colors ${checked ? "border-[#b62822] bg-[#b62822] text-white" : "border-[#d8d0c2] bg-white text-[#172b49] hover:border-[#b62822]"}`}
            >
              {checked ? (
                <span className="relative">
                  {character}
                  <Check className="absolute -right-3 -top-2 size-3" />
                </span>
              ) : (
                character
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
