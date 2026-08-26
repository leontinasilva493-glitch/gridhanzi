"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Dice5,
  Search,
  Sparkles,
} from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import {
  addRecentPracticeCharacter,
  buildPracticeQueue,
  getNextPracticeIndex,
  getPracticeCharacter,
  isHanziPracticeCharacter,
  practiceGroups,
  type PracticeGroupId,
} from "../practice-session";

import { StrokeOrderClient } from "./stroke-order-client";

const RECENT_STORAGE_KEY = "gridhanzi:practice-recent:v1";

export function PracticePageClient({
  initialCharacter,
}: {
  initialCharacter: string;
}) {
  const initialGroup = practiceGroups.find((group) =>
    (group.characters as readonly string[]).includes(initialCharacter),
  ) ?? practiceGroups[0];
  const [groupId, setGroupId] = useState<PracticeGroupId>(initialGroup.id);
  const [queue, setQueue] = useState<string[]>(() =>
    buildPracticeQueue(initialGroup.id, initialCharacter),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [recent, setRecent] = useState<string[]>([]);
  const [input, setInput] = useState(initialCharacter);
  const [inputError, setInputError] = useState("");
  const advanceTimerRef = useRef<number | null>(null);

  const character = queue[currentIndex] ?? queue[0] ?? initialCharacter;
  const entry = getPracticeCharacter(character);

  useEffect(() => {
    try {
      const parsed = JSON.parse(
        window.localStorage.getItem(RECENT_STORAGE_KEY) ?? "[]",
      );
      if (Array.isArray(parsed)) {
        setRecent(
          parsed
            .filter(
              (item): item is string =>
                typeof item === "string" && isHanziPracticeCharacter(item),
            )
            .slice(0, 6),
        );
      }
    } catch {
      window.localStorage.removeItem(RECENT_STORAGE_KEY);
    }
  }, []);

  useEffect(
    () => () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    },
    [],
  );

  function cancelAutoAdvance() {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }

  function move(direction: 1 | -1) {
    cancelAutoAdvance();
    setCurrentIndex((index) =>
      getNextPracticeIndex(index, queue.length, direction),
    );
  }

  function selectGroup(nextGroupId: PracticeGroupId) {
    cancelAutoAdvance();
    setGroupId(nextGroupId);
    setQueue(buildPracticeQueue(nextGroupId));
    setCurrentIndex(0);
    setCompleted(new Set());
    setInputError("");
  }

  function selectCharacter(nextCharacter: string) {
    const nextGroup = practiceGroups.find((group) =>
      (group.characters as readonly string[]).includes(nextCharacter),
    ) ?? practiceGroups[0];

    cancelAutoAdvance();
    setGroupId(nextGroup.id);
    setQueue(buildPracticeQueue(nextGroup.id, nextCharacter));
    setCurrentIndex(0);
    setInput(nextCharacter);
    setInputError("");
  }

  function submitCharacter() {
    const nextCharacter = Array.from(input.trim())[0];
    if (!nextCharacter || !isHanziPracticeCharacter(nextCharacter)) {
      setInputError("Enter one Chinese character, or choose a recommendation below.");
      return;
    }
    selectCharacter(nextCharacter);
  }

  function handlePracticeComplete(completedCharacter: string) {
    setCompleted((current) => new Set(current).add(completedCharacter));
    setRecent((current) => {
      const next = addRecentPracticeCharacter(current, completedCharacter);
      window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    cancelAutoAdvance();
    advanceTimerRef.current = window.setTimeout(() => move(1), 850);
  }

  function chooseRandomCharacter() {
    if (queue.length < 2) return;
    const offset = 1 + Math.floor(Math.random() * (queue.length - 1));
    cancelAutoAdvance();
    setCurrentIndex((index) => (index + offset) % queue.length);
  }

  return (
    <>
      <section className="hs-card mt-7 overflow-hidden border-[#d8c49f] bg-[#fffaf0]">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <label
              htmlFor="practice-character-input"
              className="text-sm font-bold text-[#172b49]"
            >
              Practise any single Hanzi
            </label>
            <div className="mt-2 flex max-w-xl gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#6b7584]" />
                <input
                  id="practice-character-input"
                  value={input}
                  maxLength={2}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitCharacter();
                  }}
                  className="h-12 w-full rounded border border-[#cfc5b4] bg-white pl-11 pr-4 text-xl outline-none focus:border-[#b62822] focus:ring-4 focus:ring-red-100"
                  aria-describedby={inputError ? "practice-input-error" : undefined}
                />
              </div>
              <button type="button" className="hs-primary-button" onClick={submitCharacter}>
                Practise
              </button>
            </div>
            {inputError ? (
              <p id="practice-input-error" className="mt-2 text-sm font-semibold text-[#a4312b]">
                {inputError}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button type="button" className="hs-secondary-button" onClick={() => move(-1)}>
              <ArrowLeft className="size-4" /> Previous
            </button>
            <button type="button" className="hs-secondary-button" onClick={chooseRandomCharacter}>
              <Dice5 className="size-4" /> Random
            </button>
            <button type="button" className="hs-primary-button" onClick={() => move(1)}>
              Next <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-[#dfd3bd] bg-white/75 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#172b49]">
              <Sparkles className="size-4 text-[#b62822]" />
              {practiceGroups.find((group) => group.id === groupId)?.label}
              <span className="font-normal text-[#677386]">
                · {currentIndex + 1} of {queue.length}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#687487]">
              Completed strokes move to the next character automatically.
            </span>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Current practice queue">
            {queue.map((queueCharacter, index) => (
              <button
                key={queueCharacter}
                type="button"
                onClick={() => {
                  cancelAutoAdvance();
                  setCurrentIndex(index);
                  setInput(queueCharacter);
                }}
                aria-current={index === currentIndex ? "step" : undefined}
                aria-label={`Practise ${queueCharacter}, item ${index + 1} of ${queue.length}`}
                className={`relative grid size-11 shrink-0 place-items-center rounded border text-2xl transition-colors ${
                  index === currentIndex
                    ? "border-[#172b49] bg-[#172b49] text-white"
                    : "border-[#d5cdbf] bg-white text-[#172b49] hover:border-[#b62822]"
                }`}
              >
                {queueCharacter}
                {completed.has(queueCharacter) ? (
                  <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#2e7d5b] text-white">
                    <Check className="size-3" />
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      <StrokeOrderClient
        key={`${groupId}-${character}`}
        initialCharacter={character}
        initialInfo={entry}
        showSearch={false}
        showGuidance={false}
        autoStartPractice
        sessionMode
        onPracticeComplete={handlePracticeComplete}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded border border-[#d8d0c2] bg-white px-4 py-3">
        <p className="text-sm text-[#5d6878]">
          <strong className="text-[#172b49]">{character}</strong>
          {entry ? ` · ${entry.pinyin} · ${entry.meaning}` : " · Custom Hanzi practice"}
        </p>
        <div className="flex flex-wrap gap-2">
          {entry ? (
            <Link href={`/stroke-order/${entry.character}`} className="hs-secondary-button min-h-10 py-2 text-sm">
              <BookOpen className="size-4" /> Open character guide
            </Link>
          ) : (
            <Link href="/stroke-order" className="hs-secondary-button min-h-10 py-2 text-sm">
              <BookOpen className="size-4" /> Open stroke-order tool
            </Link>
          )}
          <Link
            href={`/generator?words=${encodeURIComponent(character)}`}
            className="hs-secondary-button min-h-10 py-2 text-sm"
          >
            Print practice sheet
          </Link>
        </div>
      </div>

      {recent.length > 0 ? (
        <section className="mt-8" aria-labelledby="recent-practice-title">
          <h2 id="recent-practice-title" className="hs-display text-2xl font-bold">
            Recently completed
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {recent.map((recentCharacter) => (
              <button
                key={recentCharacter}
                type="button"
                className="hs-secondary-button min-w-12 px-3 text-xl"
                onClick={() => selectCharacter(recentCharacter)}
              >
                {recentCharacter}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10" aria-labelledby="recommended-practice-title">
        <p className="hs-kicker">Recommended next</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="recommended-practice-title" className="hs-display text-3xl font-bold">
              Choose a character practice set
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d6878]">
              Every recommended Hanzi has a complete GridHanzi character guide with stroke order, meaning, examples, and writing notes.
            </p>
          </div>
          <Link href="/stroke-order" className="hs-secondary-button">
            Browse all character guides <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {practiceGroups.map((group) => (
            <article
              key={group.id}
              className={`hs-card p-5 ${group.id === groupId ? "border-[#b62822] shadow-[0_12px_32px_rgb(182_40_34_/_0.1)]" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="hs-display text-xl font-bold">{group.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#657083]">{group.description}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-sm font-bold text-[#b62822] hover:text-[#8f1f1a]"
                  onClick={() => selectGroup(group.id)}
                >
                  Start set
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.characters.map((recommendedCharacter) => (
                  <button
                    key={recommendedCharacter}
                    type="button"
                    onClick={() => selectCharacter(recommendedCharacter)}
                    className="grid size-11 place-items-center rounded border border-[#d7cfc1] bg-[#fffaf2] text-2xl text-[#172b49] hover:border-[#b62822] hover:bg-white"
                    aria-label={`Start practising ${recommendedCharacter}`}
                  >
                    {recommendedCharacter}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
