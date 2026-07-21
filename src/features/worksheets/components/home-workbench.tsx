"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useLocale } from "next-intl";

import { useRouter } from "@/core/i18n/navigation";
import { MAX_VOCABULARY_CHARS } from "../engine";
import { localize } from "../i18n";
import type { WorksheetDifficulty } from "../types";

const familyExample = ["family", "mother", "father", "younger sister"].join(
  "\n",
);

export function HomeWorkbench() {
  const router = useRouter();
  const locale = useLocale();
  const t = (english: string, chinese: string) =>
    localize(locale, english, chinese);
  const [mode, setMode] = useState<"english" | "chinese" | "mixed">("english");
  const [value, setValue] = useState("");
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
        <h2 className="hs-display text-xl font-bold">
          {t("1. Paste your word list", "1. 粘贴词汇表")}
        </h2>
        <span className="hidden text-xs font-medium text-[#4b7b64] sm:inline">
          {t("Up to 40 rows", "最多 40 行")}
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
              {tab === "mixed"
                ? t("Mixed list", "混合词表")
                : tab === "english"
                  ? t("English", "英文")
                  : t("Chinese", "中文")}
            </button>
          ))}
        </div>
        <div className="mb-2 flex rounded border border-[#d5cdbf] bg-white p-0.5">
          {(
            [
              ["beginner", t("Beginner (HSK 1-2)", "入门（HSK 1-2）")],
              ["advanced", t("Advanced (Native)", "进阶（母语级）")],
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
        {t("Vocabulary list", "词汇表")}
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
        <p>
          {t(
            "One item per line; tab-separated spreadsheet rows also work. Press Ctrl/⌘ + Enter to continue.",
            "每行一个词条；也支持粘贴以制表符分隔的表格内容。按 Ctrl/⌘ + Enter 继续。",
          )}
        </p>
        <span>{value.length}/{MAX_VOCABULARY_CHARS}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {!value.trim() ? (
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded px-1 text-sm font-semibold text-[#24466e] underline decoration-[#9eacbc] underline-offset-4 transition-colors hover:text-[#b62822] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#b62822]/20"
            onClick={() => {
              setMode("english");
              setValue(familyExample);
            }}
          >
            {t("Use a family example", "使用家庭词汇示例")}
          </button>
        ) : null}
        <button
          type="button"
          className="hs-primary-button ml-auto"
          onClick={submit}
          disabled={!value.trim()}
        >
          <Sparkles className="size-4" />
          {t("Build my worksheet", "生成我的字帖")}
        </button>
      </div>
    </div>
  );
}
