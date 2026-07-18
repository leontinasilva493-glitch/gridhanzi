"use client";

import { useState } from "react";
import { FileSpreadsheet, Sparkles, Users } from "lucide-react";

import { useRouter } from "@/core/i18n/navigation";
import { MAX_VOCABULARY_CHARS } from "../engine";
import type { WorksheetDifficulty } from "../types";

const familyExample = ["family", "mother", "father", "younger sister"].join(
  "\n",
);

export function HomeWorkbench() {
  const router = useRouter();
  const [mode, setMode] = useState<"english" | "chinese" | "mixed">("english");
  const [value, setValue] = useState(familyExample);
  const [difficulty, setDifficulty] =
    useState<WorksheetDifficulty>("beginner");

  function submit() {
    if (!value.trim()) return;
    router.push(
      `/generator?words=${encodeURIComponent(value.trim())}&difficulty=${difficulty}&auto=1`,
    );
  }

  return (
    <div className="hs-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="hs-display text-xl font-bold">1. Add your vocabulary</h2>
        <span className="hidden text-xs font-medium text-[#4b7b64] sm:inline">
          Up to 40 rows
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-b border-[#ded7ca]">
        <div className="flex" role="tablist">
          {(["english", "chinese", "mixed"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={mode === tab}
              onClick={() => setMode(tab)}
              className={`relative px-4 pb-2 text-sm font-medium capitalize ${
                mode === tab
                  ? "text-[#b62822] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#b62822]"
                  : "text-[#4d5a6d]"
              }`}
            >
              {tab === "mixed" ? "Mixed list" : tab}
            </button>
          ))}
        </div>
        <div className="mb-2 flex rounded border border-[#d5cdbf] bg-white p-0.5">
          {(
            [
              ["beginner", "Beginner (HSK 1-2)"],
              ["advanced", "Advanced (Native)"],
            ] as const
          ).map(([option, label]) => (
            <button
              key={option}
              type="button"
              aria-pressed={difficulty === option}
              onClick={() => setDifficulty(option)}
              className={`rounded px-3 py-1.5 text-xs font-semibold ${
                difficulty === option
                  ? "bg-[#17304f] text-white"
                  : "text-[#4d5a6d]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <label className="sr-only" htmlFor="hero-vocabulary">
        Vocabulary list
      </label>
      <textarea
        id="hero-vocabulary"
        value={value}
        maxLength={MAX_VOCABULARY_CHARS}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submit();
        }}
        className="mt-3 min-h-44 w-full resize-y rounded-[5px] border border-[#315ed4] bg-white p-3 text-[15px] leading-7 shadow-inner outline-none focus:ring-4 focus:ring-blue-100"
        placeholder={
          mode === "chinese"
            ? "家庭\n妈妈\n爸爸"
            : mode === "mixed"
              ? "family, 家庭\nmother, 妈妈"
              : "family\nmother\nfather"
        }
      />
      <div className="mt-2 flex justify-between gap-4 text-xs text-[#657083]">
        <p>One word or phrase per line · Press Ctrl/⌘ + Enter to build</p>
        <span>{value.length}/{MAX_VOCABULARY_CHARS}</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-[auto_auto_1fr]">
        <button
          type="button"
          className="hs-secondary-button text-sm"
          onClick={() => {
            setMode("english");
            setValue(familyExample);
          }}
        >
          <Users className="size-4" />
          Try Family words
        </button>
        <button
          type="button"
          className="hs-secondary-button text-sm"
          onClick={() => setValue((current) => current || familyExample)}
        >
          <FileSpreadsheet className="size-4" />
          Paste from spreadsheet
        </button>
        <button
          type="button"
          className="hs-primary-button sm:justify-self-end"
          onClick={submit}
          disabled={!value.trim()}
        >
          <Sparkles className="size-4" />
          Build my worksheet
        </button>
      </div>
    </div>
  );
}
