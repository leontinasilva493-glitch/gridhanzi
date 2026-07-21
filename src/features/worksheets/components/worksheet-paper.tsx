"use client";

import { useEffect, useMemo, useState } from "react";
import type { CharacterJson } from "hanzi-writer";

import { cn } from "@/lib/utils";

import {
  buildPracticeCells,
  formatTestPrompt,
  getHanziCharacters,
  getTestAnswerCharacters,
  paginateLearnUnits,
  paginatePracticeEntries,
  paginateTestEntries,
  resolveWorksheetLayout,
  splitEntryIntoCharacterUnits,
  type CharacterPracticeUnit,
  type PracticeCell,
  type WorksheetLayoutSpec,
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

function GridGuide({ grid }: { grid: GridStyle }) {
  return (
    <svg
      aria-hidden="true"
      className="hs-grid-guide"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      focusable="false"
    >
      <rect
        className="hs-grid-outline"
        x="1.5"
        y="1.5"
        width="97"
        height="97"
        vectorEffect="non-scaling-stroke"
      />
      <g className="hs-grid-guide-lines">
        <line
          x1="1.5"
          y1="50"
          x2="98.5"
          y2="50"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="50"
          y1="1.5"
          x2="50"
          y2="98.5"
          vectorEffect="non-scaling-stroke"
        />
        {grid === "mi" ? (
          <>
            <line
              x1="1.5"
              y1="1.5"
              x2="98.5"
              y2="98.5"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="98.5"
              y1="1.5"
              x2="1.5"
              y2="98.5"
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : null}
      </g>
    </svg>
  );
}

function HanziGlyph({ children }: { children?: React.ReactNode }) {
  if (children === null || children === undefined || children === "") {
    return null;
  }

  return (
    <svg
      aria-hidden="true"
      className="hs-grid-glyph"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
    >
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {children}
      </text>
    </svg>
  );
}

export function GridCell({
  children,
  grid,
  traceLevel,
  className,
  style,
}: {
  children?: React.ReactNode;
  grid: GridStyle;
  traceLevel?: PracticeCell["traceLevel"];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("hs-grid-cell", className)}
      data-grid={grid}
      data-trace={Boolean(traceLevel)}
      data-trace-level={traceLevel}
      style={style}
    >
      <GridGuide grid={grid} />
      <HanziGlyph>{children}</HanziGlyph>
    </span>
  );
}

export function WorksheetPaper({
  entries,
  settings,
  compact = false,
  showBackground = true,
  showAnswers = true,
  className,
  onPageCountChange,
}: {
  entries: WorksheetEntry[];
  settings: WorksheetSettings;
  compact?: boolean;
  showBackground?: boolean;
  showAnswers?: boolean;
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
  const strokeCharacterUnits = useMemo(
    () => (compact ? characterUnits.slice(0, 4) : characterUnits),
    [characterUnits, compact],
  );
  const uniqueCharacters = useMemo(
    () =>
      Array.from(
        new Set(strokeCharacterUnits.map((unit) => unit.character)),
      ),
    [strokeCharacterUnits],
  );
  const characterKey = uniqueCharacters.join("");
  const shouldLoadStrokes =
    settings.mode === "trace" && settings.showStrokeOrder && showAnswers;
  const layout = useMemo(
    () => resolveWorksheetLayout(settings),
    [settings],
  );
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
    let resolvedPages;
    if (settings.mode === "write") {
      resolvedPages = paginatePracticeEntries(entries, layout).map(
        (units) => ({ kind: "practice" as const, units }),
      );
    } else if (settings.mode === "quiz") {
      resolvedPages = paginateTestEntries(entries, layout).map((pageEntries) => ({
        kind: "test" as const,
        entries: pageEntries,
      }));
    } else {
      const strokeCounts = new Map(
        uniqueCharacters.map((character) => [
          character,
          strokesReady ? (strokeState.data.get(character)?.length ?? 0) : 0,
        ]),
      );
      resolvedPages = paginateLearnUnits(
        strokeCharacterUnits,
        strokeCounts,
        settings.showStrokeOrder && showAnswers,
        layout,
      ).map((units) => ({ kind: "learn" as const, units }));
    }

    return compact ? resolvedPages.slice(0, 1) : resolvedPages;
  }, [
    compact,
    entries,
    layout,
    settings.mode,
    settings.showStrokeOrder,
    showAnswers,
    strokeState.data,
    strokeCharacterUnits,
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
          layout={layout}
          pageNumber={pageIndex + 1}
          pageCount={renderedPages.length}
          className={className}
        >
          {page.kind === "practice" ? (
            <PracticeWorksheetPage
              units={page.units}
              settings={settings}
              compact={compact}
              layout={layout}
              showAnswers={showAnswers}
            />
          ) : page.kind === "test" ? (
            <TestWorksheetPage
              entries={page.entries}
              settings={settings}
              layout={layout}
              compact={compact}
              pageOffset={pageIndex * layout.testEntriesPerPage}
            />
          ) : (
            <LearnWorksheetPage
              units={page.units}
              settings={settings}
              strokesReady={strokesReady}
              strokeData={strokeState.data}
              transform={strokeState.transform}
              layout={layout}
              showAnswers={showAnswers}
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
  layout,
  pageNumber,
  pageCount,
  className,
  children,
}: {
  settings: WorksheetSettings;
  compact: boolean;
  showBackground: boolean;
  layout: WorksheetLayoutSpec;
  pageNumber: number;
  pageCount: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "hs-paper mx-auto w-full overflow-hidden",
        className,
      )}
      style={{
        aspectRatio: `${layout.pageWidth} / ${layout.pageHeight}`,
        padding: `${(layout.margin / layout.pageWidth) * 100}%`,
      }}
      aria-label={`Worksheet preview page ${pageNumber} of ${pageCount}`}
      data-compact={compact}
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
  layout,
  showAnswers,
}: {
  units: CharacterPracticeUnit[];
  settings: WorksheetSettings;
  compact: boolean;
  layout: WorksheetLayoutSpec;
  showAnswers: boolean;
}) {
  return (
    <div
      className={cn(
        "hs-practice-page space-y-[1.7%]",
        compact && "space-y-[2.2%]",
      )}
      data-profile={layout.profile}
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
              word={showAnswers ? unit.word : ""}
              showPinyin={settings.showPinyin}
              compact={compact}
            />
          ) : (
            <div className={cn("h-[0.32rem]", compact && "h-[0.18rem]")} />
          )}
          <div
            className="grid justify-center"
            style={getPracticeGridStyle(layout)}
          >
            {buildPracticeCells(unit.character, layout).map((cell, cellIndex) => (
              <GridCell
                key={`${unit.id}-${cellIndex}`}
                grid={settings.grid}
                traceLevel={cell.traceLevel}
              >
                {showAnswers ? cell.value : ""}
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
      <span className="hs-hanzi-context ml-auto text-[#6b7480]">{word}</span>
    </div>
  );
}

function LearnWorksheetPage({
  units,
  settings,
  strokesReady,
  strokeData,
  transform,
  layout,
  showAnswers,
}: {
  units: CharacterPracticeUnit[];
  settings: WorksheetSettings;
  strokesReady: boolean;
  strokeData: StrokeDataMap;
  transform: TransformData | null;
  layout: WorksheetLayoutSpec;
  showAnswers: boolean;
}) {
  return (
    <div className="hs-learn-page space-y-[1.8%]">
      {units.map((unit) => {
        const strokes = strokeData.get(unit.character);
        const frames =
          strokesReady && strokes ? buildCumulativeStrokeFrames(strokes) : [];
        const frameRows = chunk(frames, layout.strokeFramesPerRow);
        const strokeColumns = layout.strokeFramesPerRow + 1;

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
              word={
                showAnswers
                  ? `${unit.word} · ${unit.character}`
                  : ""
              }
              showPinyin={settings.showPinyin}
              compact={false}
            />

            {settings.showStrokeOrder && showAnswers ? (
              !strokesReady ? (
                <div
                  className="mb-[0.65%] grid gap-[0.55%]"
                  style={{
                    gridTemplateColumns: `repeat(${strokeColumns}, minmax(0, 1fr))`,
                  }}
                  data-stroke-loading="true"
                  aria-label={`Loading stroke order for ${unit.character}`}
                >
                  {Array.from({ length: strokeColumns }, (_, cellIndex) => (
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
                      className="grid gap-[0.55%]"
                      style={{
                        gridTemplateColumns: `repeat(${strokeColumns}, minmax(0, 1fr))`,
                      }}
                    >
                      <GridCell grid={settings.grid}>
                        {rowIndex === 0 ? unit.character : ""}
                      </GridCell>
                      {Array.from(
                        { length: layout.strokeFramesPerRow },
                        (_, frameIndex) => {
                        const frame = row[frameIndex];
                        return frame ? (
                          <StrokeFrameCell
                            key={frameIndex}
                            frame={frame}
                            character={unit.character}
                            strokeNumber={
                              rowIndex * layout.strokeFramesPerRow +
                              frameIndex +
                              1
                            }
                            transform={transform}
                            grid={settings.grid}
                          />
                        ) : (
                          <GridCell
                            key={frameIndex}
                            grid={settings.grid}
                          />
                        );
                        },
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-[0.65%] rounded border border-[#e4d8cf] bg-[#fbf8f3] px-2 py-1 text-[0.48rem] text-[#8b4c43]">
                  Stroke data unavailable for {unit.character}
                </p>
              )
            ) : null}

            <div
              className="grid justify-center"
              style={getPracticeGridStyle(layout)}
            >
              {buildPracticeCells(unit.character, layout).map((cell, cellIndex) => (
                <GridCell
                  key={cellIndex}
                  grid={settings.grid}
                  traceLevel={cell.traceLevel}
                >
                  {showAnswers ? cell.value : ""}
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
      <GridGuide grid={grid} />
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
  layout,
  compact,
}: {
  entries: WorksheetEntry[];
  settings: WorksheetSettings;
  pageOffset: number;
  layout: WorksheetLayoutSpec;
  compact: boolean;
}) {
  const columns =
    layout.profile === "brush" || layout.profile === "tablet" ? 1 : 2;
  const rows = Math.max(
    1,
    Math.ceil(layout.testEntriesPerPage / columns),
  );

  return (
    <div
      className="hs-test-page grid grid-flow-col gap-x-[4%] gap-y-[2.2%]"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
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
                {formatTestPrompt(entry.english, characters)}
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
                    style={{
                      maxWidth: compact ? "2.25rem" : "4.5rem",
                    }}
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

function getPracticeGridStyle(layout: WorksheetLayoutSpec) {
  const cellWidth = (layout.cellSize / layout.usableWidth) * 100;
  const columnGap = (layout.cellGap / layout.usableWidth) * 100;

  return {
    gridTemplateColumns: `repeat(${layout.practiceColumns}, minmax(0, ${cellWidth}%))`,
    columnGap: `${columnGap}%`,
  };
}

function chunk<T>(values: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(values.length / size) },
    (_, index) => values.slice(index * size, (index + 1) * size),
  );
}
