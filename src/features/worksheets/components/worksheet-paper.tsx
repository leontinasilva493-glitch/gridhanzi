"use client";

import { useEffect, useMemo, useState } from "react";
import type { CharacterJson } from "hanzi-writer";

import { cn } from "@/lib/utils";

import {
  buildPracticeCells,
  getHanziCharacters,
  getTestAnswerCharacters,
  paginateLearnUnits,
  paginatePracticeEntries,
  paginateTestEntries,
  splitEntryIntoCharacterUnits,
  type CharacterPracticeUnit,
  type PracticeCell,
} from "../layout";
import { getWorksheetPaperAttributes } from "../print";
import { buildCumulativeStrokeFrames } from "../stroke-utils";
import type {
  GridStyle,
  WorksheetEntry,
  WorksheetSettings,
} from "../types";

type TransformData = {
  transform: string;
};

type StrokeDataMap = ReadonlyMap<string, string[] | null>;

export function GridCell({
  children,
  grid,
  traceLevel,
  className,
}: {
  children?: React.ReactNode;
  grid: GridStyle;
  traceLevel?: PracticeCell["traceLevel"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "hs-grid-cell text-[clamp(1.05rem,2.35vw,2rem)]",
        className,
      )}
      data-grid={grid}
      data-trace={Boolean(traceLevel)}
      data-trace-level={traceLevel}
    >
      <span className="relative z-10">{children}</span>
    </span>
  );
}

export function WorksheetPaper({
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
  const characterUnits = useMemo(
    () =>
      entries.flatMap((entry, entryIndex) =>
        splitEntryIntoCharacterUnits(entry, entryIndex + 1),
      ),
    [entries],
  );
  const uniqueCharacters = useMemo(
    () => Array.from(new Set(characterUnits.map((unit) => unit.character))),
    [characterUnits],
  );
  const characterKey = uniqueCharacters.join("");
  const shouldLoadStrokes =
    !compact && settings.mode === "trace" && settings.showStrokeOrder;
  const [strokeState, setStrokeState] = useState<{
    key: string;
    ready: boolean;
    data: StrokeDataMap;
    transform: TransformData | null;
  }>({
    key: "",
    ready: false,
    data: new Map(),
    transform: null,
  });

  useEffect(() => {
    if (!shouldLoadStrokes || uniqueCharacters.length === 0) {
      return;
    }

    let active = true;
    setStrokeState({
      key: characterKey,
      ready: false,
      data: new Map(),
      transform: null,
    });

    void import("hanzi-writer")
      .then(async ({ default: HanziWriter }) => {
        const results = await Promise.all(
          uniqueCharacters.map(async (character) => {
            try {
              const data = (await HanziWriter.loadCharacterData(character)) as
                | CharacterJson
                | undefined;
              return [character, data?.strokes ?? null] as const;
            } catch {
              return [character, null] as const;
            }
          }),
        );

        if (!active) return;
        setStrokeState({
          key: characterKey,
          ready: true,
          data: new Map(results),
          transform: HanziWriter.getScalingTransform(100, 100, 7),
        });
      })
      .catch(() => {
        if (!active) return;
        setStrokeState({
          key: characterKey,
          ready: true,
          data: new Map(
            uniqueCharacters.map((character) => [character, null]),
          ),
          transform: null,
        });
      });

    return () => {
      active = false;
    };
  }, [
    characterKey,
    shouldLoadStrokes,
    uniqueCharacters,
  ]);

  const strokesReady =
    !shouldLoadStrokes ||
    (strokeState.ready && strokeState.key === characterKey);

  const pages = useMemo(() => {
    if (compact) {
      const previewDensity =
        settings.mode === "write" ? settings.gridDensity : "standard";
      return [
        {
          kind: "practice" as const,
          units: paginatePracticeEntries(entries, previewDensity)
            .flat()
            .slice(0, 4),
        },
      ];
    }

    if (settings.mode === "write") {
      return paginatePracticeEntries(entries, settings.gridDensity).map(
        (units) => ({ kind: "practice" as const, units }),
      );
    }

    if (settings.mode === "quiz") {
      return paginateTestEntries(entries).map((pageEntries) => ({
        kind: "test" as const,
        entries: pageEntries,
      }));
    }

    if (!strokesReady) {
      return Array.from(
        { length: Math.max(1, Math.ceil(characterUnits.length / 2)) },
        (_, pageIndex) => ({
          kind: "learn" as const,
          units: characterUnits.slice(pageIndex * 2, pageIndex * 2 + 2),
        }),
      );
    }

    const strokeCounts = new Map(
      uniqueCharacters.map((character) => [
        character,
        strokeState.data.get(character)?.length ?? 0,
      ]),
    );
    return paginateLearnUnits(
      characterUnits,
      strokeCounts,
      settings.showStrokeOrder,
    ).map((units) => ({ kind: "learn" as const, units }));
  }, [
    characterUnits,
    compact,
    entries,
    settings.gridDensity,
    settings.mode,
    settings.showStrokeOrder,
    strokeState.data,
    strokesReady,
    uniqueCharacters,
  ]);

  const renderedPages =
    pages.length > 0
      ? pages
      : [
          settings.mode === "quiz"
            ? { kind: "test" as const, entries: [] }
            : { kind: "practice" as const, units: [] },
        ];

  useEffect(() => {
    onPageCountChange?.(renderedPages.length);
  }, [onPageCountChange, renderedPages.length]);

  return (
    <div className={cn("hs-paper-stack w-full", !compact && "space-y-6")}>
      {renderedPages.map((page, pageIndex) => (
        <WorksheetPageFrame
          key={`${page.kind}-${pageIndex}`}
          settings={settings}
          compact={compact}
          showBackground={showBackground}
          pageNumber={pageIndex + 1}
          pageCount={renderedPages.length}
          className={className}
        >
          {page.kind === "practice" ? (
            <PracticeWorksheetPage
              units={page.units}
              settings={settings}
              compact={compact}
            />
          ) : page.kind === "test" ? (
            <TestWorksheetPage
              entries={page.entries}
              settings={settings}
              pageOffset={pageIndex * 10}
            />
          ) : (
            <LearnWorksheetPage
              units={page.units}
              settings={settings}
              strokesReady={strokesReady}
              strokeData={strokeState.data}
              transform={strokeState.transform}
            />
          )}
        </WorksheetPageFrame>
      ))}
    </div>
  );
}

function WorksheetPageFrame({
  settings,
  compact,
  showBackground,
  pageNumber,
  pageCount,
  className,
  children,
}: {
  settings: WorksheetSettings;
  compact: boolean;
  showBackground: boolean;
  pageNumber: number;
  pageCount: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "hs-paper mx-auto aspect-[210/297] w-full overflow-hidden",
        compact
          ? "p-[5%]"
          : settings.printMargin === "narrow"
            ? "p-[3.5%]"
            : "p-[5.2%]",
        settings.paperSize === "letter" && "aspect-[8.5/11]",
        className,
      )}
      aria-label={`Worksheet preview page ${pageNumber} of ${pageCount}`}
      {...getWorksheetPaperAttributes(settings, showBackground)}
    >
      <header
        className={cn("text-center", pageNumber > 1 && "invisible")}
        aria-hidden={pageNumber > 1}
      >
        <svg
          viewBox="0 0 700 40"
          role="img"
          aria-label={settings.title}
          className={cn(
            "mx-auto block w-full overflow-visible",
            compact ? "h-[clamp(1.05rem,3vw,1.65rem)]" : "h-[1.75rem]",
          )}
        >
          <text
            x="350"
            y="30"
            textAnchor="middle"
            fill="#17233a"
            fontFamily="Georgia, 'Noto Serif SC', serif"
            fontSize="28"
            fontWeight="700"
          >
            {settings.title}
          </text>
        </svg>
        <div
          className={cn(
            "mt-[1.8%] flex justify-between text-[0.48rem] sm:text-[0.6rem]",
            compact && "opacity-90",
          )}
        >
          <span className="w-[60%] border-b border-[#8f9297] pb-1 text-left">
            Name: {settings.studentName}
          </span>
          <span className="w-[26%] border-b border-[#8f9297] pb-1 text-left">
            Date: {settings.date}
          </span>
        </div>
      </header>

      <div className={cn("mt-[2.7%]", compact && "mt-[3%]")}>{children}</div>

      <footer className="absolute inset-x-0 bottom-[1.5%] text-center text-[0.45rem] text-[#5b6573] sm:text-[0.55rem]">
        Page {pageNumber} of {pageCount}
      </footer>
    </article>
  );
}

function PracticeWorksheetPage({
  units,
  settings,
  compact,
}: {
  units: CharacterPracticeUnit[];
  settings: WorksheetSettings;
  compact: boolean;
}) {
  const density =
    compact && settings.mode !== "write"
      ? "standard"
      : settings.gridDensity;

  return (
    <div
      className={cn(
        "hs-practice-page space-y-[1.7%]",
        compact && "space-y-[2.2%]",
      )}
      data-density={density}
    >
      {units.map((unit) => (
        <section
          key={unit.id}
          className="hs-practice-unit break-inside-avoid"
          aria-label={`Practice ${unit.character} from ${unit.word}`}
        >
          {unit.showContext ? (
            <VocabularyContext
              itemNumber={unit.entryNumber}
              english={unit.english}
              pinyin={unit.pinyin}
              word={unit.word}
              showPinyin={settings.showPinyin}
              compact={compact}
            />
          ) : (
            <div className={cn("h-[0.32rem]", compact && "h-[0.18rem]")} />
          )}
          <div
            className="grid gap-[0.65%]"
            style={{
              gridTemplateColumns: `repeat(${buildPracticeCells(unit.character, density).length}, minmax(0, 1fr))`,
            }}
          >
            {buildPracticeCells(unit.character, density).map((cell, cellIndex) => (
              <GridCell
                key={`${unit.id}-${cellIndex}`}
                grid={settings.grid}
                traceLevel={cell.traceLevel}
                className={cn(
                  cell.kind === "model" && "font-bold",
                  density === "compact" && "text-[clamp(0.9rem,2vw,1.75rem)]",
                )}
              >
                {cell.value}
              </GridCell>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function VocabularyContext({
  itemNumber,
  english,
  pinyin,
  word,
  showPinyin,
  compact,
}: {
  itemNumber: number;
  english: string;
  pinyin: string;
  word: string;
  showPinyin: boolean;
  compact: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-[0.65%] flex items-baseline gap-2 font-sans text-[0.42rem] sm:text-[0.56rem]",
        compact && "text-[0.34rem] sm:text-[0.44rem]",
      )}
    >
      <strong>
        {itemNumber}. {english || "Review this word"}
      </strong>
      {showPinyin && pinyin ? <span>{pinyin}</span> : null}
      <span className="ml-auto text-[#6b7480]">{word}</span>
    </div>
  );
}

function LearnWorksheetPage({
  units,
  settings,
  strokesReady,
  strokeData,
  transform,
}: {
  units: CharacterPracticeUnit[];
  settings: WorksheetSettings;
  strokesReady: boolean;
  strokeData: StrokeDataMap;
  transform: TransformData | null;
}) {
  return (
    <div className="hs-learn-page space-y-[1.8%]">
      {units.map((unit) => {
        const strokes = strokeData.get(unit.character);
        const frames =
          strokesReady && strokes ? buildCumulativeStrokeFrames(strokes) : [];
        const frameRows = chunk(frames, 8);

        return (
          <section
            key={unit.id}
            className="hs-learn-module break-inside-avoid"
            aria-label={`Learn ${unit.character} from ${unit.word}`}
          >
            <VocabularyContext
              itemNumber={unit.entryNumber}
              english={unit.english}
              pinyin={unit.pinyin}
              word={`${unit.word} · ${unit.character}`}
              showPinyin={settings.showPinyin}
              compact={false}
            />

            {settings.showStrokeOrder ? (
              !strokesReady ? (
                <div
                  className="mb-[0.65%] grid grid-cols-9 gap-[0.55%]"
                  data-stroke-loading="true"
                  aria-label={`Loading stroke order for ${unit.character}`}
                >
                  {Array.from({ length: 9 }, (_, cellIndex) => (
                    <GridCell
                      key={cellIndex}
                      grid={settings.grid}
                      className="animate-pulse bg-[#f4f1eb]"
                    >
                      {cellIndex === 0 ? unit.character : ""}
                    </GridCell>
                  ))}
                </div>
              ) : frames.length > 0 && transform ? (
                <div className="mb-[0.65%] space-y-[0.55%]">
                  {frameRows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-9 gap-[0.55%]"
                    >
                      <GridCell
                        grid={settings.grid}
                        className="font-bold"
                      >
                        {rowIndex === 0 ? unit.character : ""}
                      </GridCell>
                      {Array.from({ length: 8 }, (_, frameIndex) => {
                        const frame = row[frameIndex];
                        return frame ? (
                          <StrokeFrameCell
                            key={frameIndex}
                            frame={frame}
                            character={unit.character}
                            strokeNumber={rowIndex * 8 + frameIndex + 1}
                            transform={transform}
                            grid={settings.grid}
                          />
                        ) : (
                          <GridCell
                            key={frameIndex}
                            grid={settings.grid}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-[0.65%] rounded border border-[#e4d8cf] bg-[#fbf8f3] px-2 py-1 text-[0.48rem] text-[#8b4c43]">
                  Stroke data unavailable for {unit.character}
                </p>
              )
            ) : null}

            <div className="grid grid-cols-9 gap-[0.55%]">
              {buildLearnWritingCells(unit.character).map((cell, cellIndex) => (
                <GridCell
                  key={cellIndex}
                  grid={settings.grid}
                  traceLevel={cell.traceLevel}
                  className={cell.kind === "model" ? "font-bold" : undefined}
                >
                  {cell.value}
                </GridCell>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function StrokeFrameCell({
  frame,
  character,
  strokeNumber,
  transform,
  grid,
}: {
  frame: string[];
  character: string;
  strokeNumber: number;
  transform: TransformData;
  grid: GridStyle;
}) {
  return (
    <span className="hs-grid-cell relative aspect-square" data-grid={grid}>
      <span className="absolute left-[4%] top-[3%] z-20 text-[0.38rem] font-bold text-[#a42b26]">
        {strokeNumber}
      </span>
      <svg
        viewBox="0 0 100 100"
        className="relative z-10 size-full"
        aria-label={`Stroke ${strokeNumber} of ${character}`}
      >
        <g transform={transform.transform}>
          {frame.map((path, pathIndex) => (
            <path
              key={pathIndex}
              d={path}
              fill={
                pathIndex === frame.length - 1 ? "#bd2c26" : "#172942"
              }
            />
          ))}
        </g>
      </svg>
    </span>
  );
}

function TestWorksheetPage({
  entries,
  settings,
  pageOffset,
}: {
  entries: WorksheetEntry[];
  settings: WorksheetSettings;
  pageOffset: number;
}) {
  return (
    <div className="hs-test-page grid grid-cols-2 grid-rows-5 grid-flow-col gap-x-[4%] gap-y-[2.2%]">
      {entries.map((entry, index) => {
        const characters = getTestAnswerCharacters(entry);
        return (
          <section
            key={entry.id}
            className="hs-test-prompt break-inside-avoid rounded-[2px] border border-[#cfd2d6] p-[4%]"
            aria-label={`Test item ${pageOffset + index + 1}`}
          >
            <div className="flex items-baseline gap-2 text-[0.6rem]">
              <strong>{pageOffset + index + 1}.</strong>
              <span className="font-semibold">
                {entry.english || "Write the word"}
              </span>
            </div>
            {settings.showPinyin && entry.pinyin ? (
              <p className="mt-[1%] text-[0.52rem] text-[#566273]">
                {entry.pinyin}
              </p>
            ) : null}
            <div
              className="mt-[4%] grid max-w-full gap-[1.4%]"
              style={{
                gridTemplateColumns: `repeat(${Math.max(1, Math.min(4, characters.length))}, minmax(0, 1fr))`,
              }}
            >
              {(characters.length > 0 ? characters : [""]).map(
                (_, characterIndex) => (
                  <GridCell
                    key={characterIndex}
                    grid={settings.grid}
                    className="max-w-[4.5rem]"
                  />
                ),
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function buildLearnWritingCells(character: string): PracticeCell[] {
  return Array.from({ length: 9 }, (_, index) => {
    if (index === 0) {
      return { kind: "model" as const, value: character };
    }
    if (index === 1) {
      return {
        kind: "trace" as const,
        value: character,
        traceLevel: "medium" as const,
      };
    }
    if (index === 2) {
      return {
        kind: "trace" as const,
        value: character,
        traceLevel: "light" as const,
      };
    }
    return { kind: "blank" as const, value: "" };
  });
}

function chunk<T>(values: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(values.length / size) },
    (_, index) => values.slice(index * size, (index + 1) * size),
  );
}
