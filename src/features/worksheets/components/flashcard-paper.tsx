"use client";

import { useEffect, useMemo } from "react";

import { cn } from "@/lib/utils";

import { paginateFlashcards } from "../flashcards";
import { getWorksheetPaperAttributes } from "../print";
import type { WorksheetEntry, WorksheetSettings } from "../types";

export function FlashcardPaper({
  entries,
  settings,
  compact = false,
  showBackground = true,
  className,
  onPageCountChange,
}: {
  entries: WorksheetEntry[];
  settings: WorksheetSettings;
  compact?: boolean;
  showBackground?: boolean;
  className?: string;
  onPageCountChange?: (pageCount: number) => void;
}) {
  const pages = useMemo(() => {
    const paginated = paginateFlashcards(entries, settings.flashcardsPerPage);
    if (compact) {
      return paginated.slice(0, 1);
    }
    return paginated;
  }, [compact, entries, settings.flashcardsPerPage]);

  const renderedPages =
    pages.length > 0 ? pages : [[] as WorksheetEntry[]];
  const columns = settings.flashcardsPerPage === 9 ? 3 : 2;
  const rows = settings.flashcardsPerPage / columns;

  useEffect(() => {
    onPageCountChange?.(renderedPages.length);
  }, [onPageCountChange, renderedPages.length]);

  return (
    <div className={cn("hs-paper-stack w-full", !compact && "space-y-6")}>
      {renderedPages.map((pageEntries, pageIndex) => (
        <article
          key={`flashcards-${pageIndex}`}
          className={cn("hs-paper mx-auto w-full overflow-hidden", className)}
          aria-label={`Flashcard preview page ${pageIndex + 1} of ${renderedPages.length}`}
          data-compact={compact}
          {...getWorksheetPaperAttributes(settings, showBackground)}
        >
          <header
            className={cn(
              "border-b border-[#d8d2c7] px-[5.4%] py-[4.4%]",
              compact && "py-[5%]",
            )}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#b62822]">
                  Flashcards
                </p>
                <h2 className="hs-display mt-1 text-[1.35rem] font-bold text-[#17233a] sm:text-[1.7rem]">
                  {settings.title}
                </h2>
              </div>
              <div className="text-right text-[0.6rem] text-[#59687a]">
                <p>Name: {settings.studentName || "________"}</p>
                <p>Date: {settings.date || "________"}</p>
              </div>
            </div>
          </header>

          <div
            className="hs-flashcard-grid px-[5.4%] py-[4.8%]"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: settings.flashcardsPerPage }, (_, slotIndex) => {
              const slotEntry = pageEntries[slotIndex] ?? null;
              const row = Math.floor(slotIndex / columns);
              const column = slotIndex % columns;

              return (
                <section
                  key={slotEntry?.id ?? `flashcards-${pageIndex}-empty-${slotIndex}`}
                  className={cn(
                    "hs-flashcard-cut-line hs-flashcard-card",
                    slotEntry === null && "hs-flashcard-card-empty",
                  )}
                  aria-hidden={slotEntry === null}
                  aria-label={
                    slotEntry
                      ? `Flashcard ${pageIndex * settings.flashcardsPerPage + slotIndex + 1} for ${slotEntry.hanzi}`
                      : undefined
                  }
                  data-empty={String(slotEntry === null)}
                  data-last-row={String(row === rows - 1)}
                  data-last-col={String(column === columns - 1)}
                >
                  {slotEntry ? (
                    <>
                      <div className="flex items-center justify-between gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#6e7684]">
                        <span>Card</span>
                        <span>
                          #{pageIndex * settings.flashcardsPerPage + slotIndex + 1}
                        </span>
                      </div>
                      <div className="mt-5 flex flex-1 items-center justify-center rounded border border-[#e4ded3] bg-[#fffdfa] px-4 py-4 text-center">
                        <span className="hs-hanzi-context text-[3.2rem] leading-none text-[#15233a] sm:text-[3.8rem]">
                          {slotEntry.hanzi}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2 text-center">
                        {settings.flashcardShowPinyin && slotEntry.pinyin ? (
                          <p className="text-[0.88rem] font-medium text-[#445469]">
                            {slotEntry.pinyin}
                          </p>
                        ) : null}
                        {settings.flashcardShowEnglish && slotEntry.english ? (
                          <p className="text-[0.82rem] leading-5 text-[#627084]">
                            {slotEntry.english}
                          </p>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </section>
              );
            })}
          </div>

          <footer className="border-t border-[#d8d2c7] px-[5.4%] py-[2.8%] text-center text-[0.58rem] text-[#5b6573]">
            Page {pageIndex + 1} of {renderedPages.length}
          </footer>
        </article>
      ))}
    </div>
  );
}
