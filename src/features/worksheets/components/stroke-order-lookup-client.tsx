"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, Keyboard, PencilLine, Search } from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import { resolveStrokeOrderLookupCharacter } from "../handwriting-input";
import { getStrokeOrderCharacter } from "../stroke-order-characters";

import { StrokeOrderClient } from "./stroke-order-client";
import { HandwritingLookupClient } from "./handwriting-lookup-client";

type LookupMode = "type" | "draw";

export function StrokeOrderLookupClient({
  initialCharacter,
  initialMode = "type",
}: {
  initialCharacter: string;
  initialMode?: LookupMode;
}) {
  const [mode, setMode] = useState<LookupMode>(initialMode);
  const [input, setInput] = useState(initialCharacter);
  const [selectedCharacter, setSelectedCharacter] = useState(initialCharacter);
  const [inputError, setInputError] = useState("");
  const selectedEntry = getStrokeOrderCharacter(selectedCharacter);

  function submitTypedCharacter() {
    const nextCharacter = resolveStrokeOrderLookupCharacter(input);
    if (nextCharacter === "永" && input.trim() !== "永") {
      setInputError("Enter one Chinese character, or switch to handwriting input.");
      return;
    }

    setInputError("");
    selectCharacter(nextCharacter);
  }

  function selectCharacter(character: string) {
    setSelectedCharacter(character);
    setInput(character);

    const url = new URL(window.location.href);
    url.searchParams.set("character", character);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <>
      <section id="character-lookup" className="hs-card mx-auto mt-7 max-w-3xl scroll-mt-24 overflow-hidden border-[#d8c49f] bg-[#fffaf0]">
        <div className="border-b border-[#ded7ca] p-2">
          <div
            role="tablist"
            aria-label="Choose how to find a Chinese character"
            className="grid grid-cols-2 gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "type"}
              className={`flex min-h-11 items-center justify-center gap-2 rounded px-4 text-sm font-bold transition-colors ${
                mode === "type"
                  ? "bg-[#172b49] text-white"
                  : "bg-white text-[#4f5e72] hover:bg-[#f5efe4]"
              }`}
              onClick={() => setMode("type")}
            >
              <Keyboard className="size-4" /> Type a character
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "draw"}
              className={`flex min-h-11 items-center justify-center gap-2 rounded px-4 text-sm font-bold transition-colors ${
                mode === "draw"
                  ? "bg-[#172b49] text-white"
                  : "bg-white text-[#4f5e72] hover:bg-[#f5efe4]"
              }`}
              onClick={() => setMode("draw")}
            >
              <PencilLine className="size-4" /> Draw a character
            </button>
          </div>
        </div>

        {mode === "type" ? (
          <div role="tabpanel" className="p-5 sm:p-6">
            <label htmlFor="stroke-order-character-input" className="text-sm font-bold text-[#172b49]">
              Chinese character
            </label>
            <div className="mt-2 flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#6b7584]" />
                <input
                  id="stroke-order-character-input"
                  value={input}
                  maxLength={2}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitTypedCharacter();
                  }}
                  aria-describedby={inputError ? "stroke-order-input-error" : undefined}
                  className="h-12 w-full rounded border border-[#cfc5b4] bg-white pl-11 pr-4 text-xl outline-none focus:border-[#b62822] focus:ring-4 focus:ring-red-100"
                />
              </div>
              <button type="button" className="hs-primary-button" onClick={submitTypedCharacter}>
                Show stroke order
              </button>
            </div>
            {inputError ? (
              <p id="stroke-order-input-error" className="mt-2 text-sm font-semibold text-[#a4312b]">
                {inputError}
              </p>
            ) : null}
          </div>
        ) : (
          <div role="tabpanel">
            <HandwritingLookupClient onSelectCharacter={selectCharacter} />
          </div>
        )}
      </section>

      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center gap-3 rounded border border-[#d8d0c2] bg-white px-4 py-3">
        <p className="mr-auto text-sm text-[#5d6878]">
          <span className="font-bold text-[#172b49]">Selected character</span>
          <span className="mx-2 hs-hanzi-context text-xl text-[#172b49]">{selectedCharacter}</span>
          {selectedEntry ? `${selectedEntry.pinyin} · ${selectedEntry.meaning}` : "Ready for stroke-order lookup"}
        </p>
        {selectedEntry ? (
          <Link
            href={`/stroke-order/${selectedCharacter}`}
            className="hs-secondary-button min-h-10 px-3 py-2 text-sm"
          >
            <BookOpen className="size-4" /> Open {selectedCharacter} character guide
          </Link>
        ) : null}
        <Link
          href={`/practice?character=${encodeURIComponent(selectedCharacter)}`}
          className="hs-secondary-button min-h-10 px-3 py-2 text-sm"
        >
          Practise {selectedCharacter} <ArrowRight className="size-4" />
        </Link>
      </div>

      <StrokeOrderClient
        key={selectedCharacter}
        initialCharacter={selectedCharacter}
        initialInfo={selectedEntry}
        showSearch={false}
      />
    </>
  );
}
