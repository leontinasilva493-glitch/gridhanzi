"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, BookOpenCheck, SearchCheck } from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import type { HskLevel, HskSystem } from "../hsk";
import {
  analyzeHskText,
  buildHskCheckerWorksheetHref,
  getTermsAboveTarget,
} from "../hsk-text-analyzer";

const examples = [
  { label: "Beginner", text: "我喜欢学习中文，每天写几个汉字。" },
  { label: "Daily life", text: "下班以后我去超市买东西，然后坐地铁回家。" },
  { label: "Formal", text: "这个项目不仅需要专业知识，而且需要长期合作。" },
] as const;

const levelsBySystem: Record<HskSystem, HskLevel[]> = {
  "2.0": ["1", "2", "3", "4", "5", "6"],
  "3.0": ["1", "2", "3", "4", "5", "6", "7-9"],
};

export function HskLevelCheckerClient() {
  const [draft, setDraft] = useState<string>(examples[0].text);
  const [submittedText, setSubmittedText] = useState<string>(examples[0].text);
  const [system, setSystem] = useState<HskSystem>("3.0");
  const [targetLevel, setTargetLevel] = useState<HskLevel>("3");
  const analysis = useMemo(
    () => analyzeHskText(submittedText, system),
    [submittedText, system],
  );
  const aboveTarget = getTermsAboveTarget(analysis, targetLevel);
  const worksheetHref = buildHskCheckerWorksheetHref(analysis, targetLevel);

  function selectSystem(nextSystem: HskSystem) {
    setSystem(nextSystem);
    if (!levelsBySystem[nextSystem].includes(targetLevel)) {
      setTargetLevel(nextSystem === "2.0" ? "6" : "7-9");
    }
  }

  return (
    <section className="mt-8" aria-labelledby="checker-workspace-title">
      <div className="hs-card overflow-hidden border-[#cfc5b5]">
        <div className="grid gap-6 bg-[#fff9ed] p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <label htmlFor="hsk-checker-text" className="font-bold text-[#172b49]">
              Paste Chinese text
            </label>
            <textarea
              id="hsk-checker-text"
              value={draft}
              onChange={(event) => setDraft(event.target.value.slice(0, 2_000))}
              rows={7}
              className="mt-2 w-full resize-y rounded border border-[#cfc5b5] bg-white p-4 text-base leading-7 outline-none focus:border-[#24466e] focus:ring-2 focus:ring-[#24466e]/15"
              placeholder="Paste a sentence, lesson, article excerpt, or class reading…"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#6b7584]">Try a sample</span>
              {examples.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => {
                    setDraft(example.text);
                    setSubmittedText(example.text);
                  }}
                  className="rounded-full border border-[#d8d0c2] bg-white px-3 py-1.5 text-sm font-semibold text-[#42516a] hover:border-[#24466e]"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <fieldset>
              <legend className="text-sm font-bold text-[#172b49]">HSK version</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["3.0", "2.0"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => selectSystem(value)}
                    aria-pressed={system === value}
                    className={`min-h-11 rounded border px-3 font-bold ${system === value ? "border-[#b62822] bg-[#b62822] text-white" : "border-[#cfc5b5] bg-white text-[#42516a]"}`}
                  >
                    HSK {value}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-bold text-[#172b49]">
              My target level
              <select
                value={targetLevel}
                onChange={(event) => setTargetLevel(event.target.value as HskLevel)}
                className="mt-2 min-h-11 w-full rounded border border-[#cfc5b5] bg-white px-3 font-semibold"
              >
                {levelsBySystem[system].map((level) => (
                  <option key={level} value={level}>Level {level}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setSubmittedText(draft)}
              className="hs-primary-button min-h-12 w-full"
            >
              Analyze this text <SearchCheck className="size-4" />
            </button>
            <p className="text-xs leading-5 text-[#6b7584]">
              The analysis runs in your browser. The text is not uploaded or stored.
            </p>
          </div>
        </div>

        <div className="border-t border-[#ded7ca] p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hs-kicker">HSK {system} result</p>
              <h2 id="checker-workspace-title" className="hs-display mt-2 text-3xl font-bold">
                {analysis.totalHanCharacters ? `${analysis.coveragePercent}% classified by this list` : "Add Chinese text to begin"}
              </h2>
            </div>
            <Link href={worksheetHref} className="hs-primary-button min-h-12">
              Practise difficult items <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ResultStat icon={<BarChart3 className="size-5" />} value={analysis.totalHanCharacters} label="Hanzi occurrences" />
            <ResultStat icon={<BookOpenCheck className="size-5" />} value={analysis.matchedTerms.length} label="unique matched terms" />
            <ResultStat icon={<SearchCheck className="size-5" />} value={aboveTarget.length + analysis.unclassifiedCharacters.length} label="items above target or unclassified" />
          </div>

          {analysis.totalHanCharacters ? (
            <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
              <div>
                <h3 className="hs-display text-xl font-bold">Level distribution</h3>
                <div className="mt-4 space-y-3">
                  {analysis.distribution.map((item) => {
                    const width = analysis.matchedTerms.length
                      ? Math.max(4, (item.uniqueTerms / analysis.matchedTerms.length) * 100)
                      : 0;
                    return (
                      <div key={item.level} className="grid grid-cols-[74px_minmax(0,1fr)_72px] items-center gap-3 text-sm">
                        <Link href={`/hsk/${system.replace(".", "-")}/level-${item.level}`} className="font-bold text-[#24466e] hover:text-[#b62822]">
                          Level {item.level}
                        </Link>
                        <div className="h-2.5 overflow-hidden rounded-full bg-[#edf1f5]">
                          <div className="h-full rounded-full bg-[#b62822]" style={{ width: `${width}%` }} />
                        </div>
                        <span className="text-right text-[#617084]">{item.uniqueTerms} terms</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded border border-[#d8c49f] bg-[#fff9ed] p-5">
                <h3 className="hs-display text-xl font-bold">Focus above Level {targetLevel}</h3>
                {aboveTarget.length ? (
                  <ul className="mt-4 space-y-3">
                    {aboveTarget.slice(0, 12).map((term) => (
                      <li key={term.id} className="flex items-start justify-between gap-3 border-b border-[#e7dcc9] pb-3 last:border-0 last:pb-0">
                        <span><strong className="hs-hanzi-context text-lg text-[#172b49]">{term.hanzi}</strong><span className="ml-2 text-sm text-[#9d3c32]">{term.pinyin}</span><span className="mt-1 block text-xs text-[#617084]">{term.english}</span></span>
                        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold">L{term.level}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-[#566276]">No matched terms sit above this target in the selected HSK version.</p>
                )}
                {analysis.unclassifiedCharacters.length ? (
                  <div className="mt-5 border-t border-[#e3d6c1] pt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6b7584]">Outside this catalog</p>
                    <p className="hs-hanzi-context mt-2 text-2xl text-[#172b49]">
                      {analysis.unclassifiedCharacters.map((entry) => entry.character).join(" · ")}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ResultStat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded border border-[#d8d0c2] bg-white p-4">
      <span className="grid size-10 place-items-center rounded-full bg-[#f7efe3] text-[#9d3c32]">{icon}</span>
      <span><strong className="hs-display block text-2xl text-[#172b49]">{value}</strong><span className="text-xs text-[#617084]">{label}</span></span>
    </div>
  );
}
