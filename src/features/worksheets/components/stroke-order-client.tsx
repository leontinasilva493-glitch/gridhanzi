"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  FilePlus2,
  Pencil,
  Play,
  RotateCcw,
  Search,
  SkipForward,
} from "lucide-react";
import type HanziWriterType from "hanzi-writer";
import type { CharacterJson } from "hanzi-writer";

import { Link } from "@/core/i18n/navigation";
import {
  advanceTraceProgress,
  getPointAtProgress,
  isTraceStrokeComplete,
  mapHanziMedianToSurface,
  projectPointToPolyline,
  type TracePoint,
} from "../stroke-trace";
import type { StrokeOrderCharacter } from "../stroke-order-characters";
import { resolveStrokeCount } from "../stroke-utils";

import { StrokeSequence } from "./stroke-sequence";
import { TemplateTraceLayer } from "./template-trace-layer";

const INK_COLOR = "#132844";
const RADICAL_COLOR = "#bd2c26";
const TRACE_TOLERANCE = 36;

type PracticeStatus = "idle" | "active" | "complete";
type TraceState = { strokeIndex: number; progress: number };

const EMPTY_TRACE: TraceState = { strokeIndex: 0, progress: 0 };

const characterInfo: Record<
  string,
  { pinyin: string; meaning: string; strokes: number }
> = {
  永: { pinyin: "yǒng", meaning: "forever · always", strokes: 5 },
  家: { pinyin: "jiā", meaning: "home · family", strokes: 10 },
  学: { pinyin: "xué", meaning: "study · learn", strokes: 8 },
  好: { pinyin: "hǎo", meaning: "good · well", strokes: 6 },
};

type StrokeOrderClientProps = {
  initialCharacter?: string;
  initialInfo?: Pick<StrokeOrderCharacter, "pinyin" | "meaning" | "strokes">;
  showSearch?: boolean;
  showGuidance?: boolean;
  autoStartPractice?: boolean;
  sessionMode?: boolean;
  onPracticeComplete?: (character: string) => void;
};

export function StrokeOrderClient({
  initialCharacter = "永",
  initialInfo,
  showSearch = true,
  showGuidance = true,
  autoStartPractice = false,
  sessionMode = false,
  onPracticeComplete,
}: StrokeOrderClientProps = {}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriterType | null>(null);
  const traceStateRef = useRef<TraceState>(EMPTY_TRACE);
  const isTracingRef = useRef(false);
  const lastPointerRef = useRef<TracePoint | null>(null);
  const [input, setInput] = useState(initialCharacter);
  const [character, setCharacter] = useState(initialCharacter);
  const [characterData, setCharacterData] = useState<CharacterJson | null>(null);
  const [strokeIndex, setStrokeIndex] = useState(0);
  const [traceState, setTraceState] = useState<TraceState>(EMPTY_TRACE);
  const [loadError, setLoadError] = useState(false);
  const [practiceStatus, setPracticeStatus] = useState<PracticeStatus>("idle");
  const [practiceMessage, setPracticeMessage] = useState("");
  const info =
    character === initialCharacter && initialInfo
      ? initialInfo
      : (characterInfo[character] ?? {
          pinyin: "—",
          meaning: "Meaning not listed",
          strokes: 0,
        });
  const resolvedStrokeCount = resolveStrokeCount(
    characterData?.strokes.length,
    info.strokes,
  );
  const strokeLabels = Array.from(
    { length: resolvedStrokeCount || 6 },
    (_, index) => `Stroke ${index + 1}`,
  );

  useEffect(() => {
    let active = true;
    if (!targetRef.current) return;

    targetRef.current.innerHTML = "";
    setCharacterData(null);
    traceStateRef.current = EMPTY_TRACE;
    isTracingRef.current = false;
    lastPointerRef.current = null;
    setTraceState(EMPTY_TRACE);
    setLoadError(false);
    setStrokeIndex(0);
    setPracticeStatus("idle");
    setPracticeMessage("");

    void import("hanzi-writer")
      .then(({ default: HanziWriter }) => {
        if (!active || !targetRef.current) return;
        writerRef.current = HanziWriter.create(targetRef.current, character, {
          width: 300,
          height: 300,
          padding: 18,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 260,
          strokeColor: "#132844",
          radicalColor: RADICAL_COLOR,
          outlineColor: "#ddd9d1",
          showOutline: true,
          onLoadCharDataSuccess: (data) => {
            setCharacterData(data);
          },
          onLoadCharDataError: () => setLoadError(true),
        });
      })
      .catch(() => setLoadError(true));

    return () => {
      active = false;
      writerRef.current = null;
      if (targetRef.current) targetRef.current.innerHTML = "";
    };
  }, [character]);

  function searchCharacter() {
    const next = Array.from(input.trim())[0];
    if (next) setCharacter(next);
  }

  async function beginPractice() {
    const writer = writerRef.current;
    const totalStrokes = characterData?.strokes.length ?? info.strokes;
    if (!writer || totalStrokes < 1) return;

    writer.cancelQuiz();
    traceStateRef.current = EMPTY_TRACE;
    isTracingRef.current = false;
    lastPointerRef.current = null;
    setTraceState(EMPTY_TRACE);
    setStrokeIndex(0);
    setPracticeStatus("active");
    setPracticeMessage("Start near the red dot and follow stroke 1.");

    await writer.hideCharacter({ duration: 0 });
  }

  async function leavePractice() {
    const writer = writerRef.current;
    traceStateRef.current = EMPTY_TRACE;
    isTracingRef.current = false;
    lastPointerRef.current = null;
    setTraceState(EMPTY_TRACE);
    setPracticeStatus("idle");
    setPracticeMessage("");
    writer?.cancelQuiz();
    if (writer) {
      await Promise.all([
        writer.updateColor("strokeColor", INK_COLOR, { duration: 0 }),
        writer.updateColor("radicalColor", RADICAL_COLOR, { duration: 0 }),
      ]);
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      practiceStatus !== "active" ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    const pointer = getSurfacePoint(event);
    const median = getCurrentMedian();
    if (!median) return;
    const requiredPoint = getPointAtProgress(median, traceStateRef.current.progress);
    if (distance(pointer, requiredPoint) > TRACE_TOLERANCE) {
      setPracticeMessage("Move closer to the red dot to continue this stroke.");
      return;
    }

    isTracingRef.current = true;
    lastPointerRef.current = pointer;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPracticeMessage(
      `Follow stroke ${traceStateRef.current.strokeIndex + 1}; the fill follows your cursor.`,
    );
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      practiceStatus !== "active" ||
      !event.isPrimary ||
      event.buttons === 0 ||
      !isTracingRef.current ||
      !lastPointerRef.current
    ) {
      return;
    }

    const pointer = getSurfacePoint(event);
    const median = getCurrentMedian();
    if (!median) return;
    const projection = projectPointToPolyline(pointer, median);
    const nextProgress = advanceTraceProgress({
      currentProgress: traceStateRef.current.progress,
      projection,
      cursorTravel: distance(pointer, lastPointerRef.current),
      tolerance: TRACE_TOLERANCE,
    });
    lastPointerRef.current = pointer;

    if (nextProgress === traceStateRef.current.progress) {
      if (projection.distance > TRACE_TOLERANCE) {
        setPracticeMessage("Stay near the outlined stroke to keep filling it.");
      }
      return;
    }

    const nextState = { ...traceStateRef.current, progress: nextProgress };
    traceStateRef.current = nextState;
    setTraceState(nextState);

    if (isTraceStrokeComplete(nextProgress)) {
      completeCurrentTraceStroke();
      return;
    }

    setPracticeMessage(
      `Stroke ${nextState.strokeIndex + 1}: ${Math.round(nextProgress * 100)}% filled.`,
    );
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    isTracingRef.current = false;
    lastPointerRef.current = null;
  }

  function completeCurrentTraceStroke() {
    const totalStrokes = characterData?.strokes.length ?? 0;
    const nextStrokeIndex = traceStateRef.current.strokeIndex + 1;
    const nextState = { strokeIndex: nextStrokeIndex, progress: 0 };
    traceStateRef.current = nextState;
    setTraceState(nextState);
    isTracingRef.current = false;
    lastPointerRef.current = null;

    if (nextStrokeIndex >= totalStrokes) {
      setPracticeStatus("complete");
      setPracticeMessage("Complete — the standard template character is fully filled.");
      onPracticeComplete?.(character);
      return;
    }

    setPracticeMessage(
      `Stroke ${nextStrokeIndex} complete. Start near the red dot for stroke ${nextStrokeIndex + 1}.`,
    );
  }

  function getCurrentMedian() {
    const median = characterData?.medians[traceStateRef.current.strokeIndex];
    return median ? mapHanziMedianToSurface(median) : null;
  }

  function getSurfacePoint(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * 300,
      y: ((event.clientY - bounds.top) / bounds.height) * 300,
    };
  }

  useEffect(() => {
    if (!autoStartPractice || !characterData || loadError) return;

    const frame = window.requestAnimationFrame(() => {
      void beginPractice();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [autoStartPractice, character, characterData, loadError]);

  return (
    <>
      {showSearch ? (
        <div className="mx-auto mt-5 flex max-w-2xl gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Chinese character</span>
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#6b7584]" />
            <input
              value={input}
              maxLength={2}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") searchCharacter();
              }}
              className="h-12 w-full rounded border border-[#d6cfc2] bg-white pl-11 pr-4 font-serif text-xl outline-none focus:border-[#315ed4] focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <button type="button" className="hs-primary-button" onClick={searchCharacter}>
            Show stroke order
          </button>
        </div>
      ) : null}

      <section
        className={`${sessionMode ? "mt-4" : "mt-7"} grid gap-4 lg:grid-cols-[0.95fr_1.05fr]`}
      >
        <div className="hs-card p-4">
          <div className="mx-auto aspect-square max-w-[300px] bg-white">
            <div
              data-testid="stroke-practice-surface"
              aria-label={`Trace ${character} stroke by stroke`}
              className={`relative size-full border border-[#d4cec3] ${
                practiceStatus === "active" ? "cursor-crosshair touch-none" : ""
              }`}
              onPointerDownCapture={handlePointerDown}
              onPointerMoveCapture={handlePointerMove}
              onPointerUpCapture={handlePointerUp}
              onPointerCancelCapture={handlePointerUp}
            >
              <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#dedbd5]" />
              <span className="absolute inset-y-0 left-1/2 border-l border-dashed border-[#dedbd5]" />
              {loadError ? (
                <div className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-[#a24b46]">
                  Stroke data is unavailable. Try another common character.
                </div>
              ) : (
                <div ref={targetRef} className="relative z-10 size-full" />
              )}
              <TemplateTraceLayer
                characterData={characterData}
                strokeIndex={traceState.strokeIndex}
                progress={traceState.progress}
                visible={practiceStatus !== "idle"}
              />
            </div>
          </div>
          {practiceStatus !== "idle" ? (
            <div
              className="mx-auto mt-3 flex max-w-[300px] items-center gap-2 rounded-md border border-[#d8d0c2] bg-[#fbf7ef] px-3 py-2 text-xs text-[#46566b]"
              aria-live="polite"
            >
              <span className="shrink-0 rounded-full bg-[#172b46] px-2 py-1 font-semibold text-white">
                Follow & fill
              </span>
              <span>{practiceMessage}</span>
            </div>
          ) : null}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <ControlButton
              icon={Play}
              label="Play"
              onClick={() => {
                void leavePractice().then(() => writerRef.current?.animateCharacter());
              }}
            />
            <ControlButton
              icon={SkipForward}
              label="Next stroke"
              onClick={() => {
                void leavePractice().then(() => {
                  void writerRef.current?.animateStroke(strokeIndex);
                  setStrokeIndex((current) =>
                    resolvedStrokeCount > 0
                      ? (current + 1) % resolvedStrokeCount
                      : current + 1,
                  );
                });
              }}
            />
            <ControlButton
              icon={RotateCcw}
              label="Restart"
              onClick={() => {
                if (practiceStatus === "idle") {
                  setStrokeIndex(0);
                  void writerRef.current?.animateCharacter();
                } else {
                  void beginPractice();
                }
              }}
            />
            <ControlButton
              icon={Pencil}
              label="Practice"
              active={practiceStatus !== "idle"}
              onClick={() => void beginPractice()}
            />
          </div>
        </div>

        <div className="hs-card grid gap-7 p-6 sm:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-5">
              <span className="font-serif text-8xl font-bold">{character}</span>
              <div>
                <h2 className="text-2xl font-bold">{info.pinyin}</h2>
                <p className="mt-2 text-[#566276]">{info.meaning}</p>
                <p className="mt-3 font-semibold">
                  {resolvedStrokeCount
                    ? `${resolvedStrokeCount} strokes`
                    : "Stroke count not listed"}
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <span className="rounded border border-[#70a88c] px-3 py-1.5 text-xs font-semibold text-[#267254]">
                Simplified
              </span>
              <span className="rounded border border-[#cfc8bc] px-3 py-1.5 text-xs">
                Traditional
              </span>
            </div>
            <Link
              href={`/generator?words=${encodeURIComponent(character)}`}
              className="hs-primary-button mt-6 w-full"
            >
              <FilePlus2 className="size-4" /> Add to worksheet
            </Link>
          </div>
          <div className="border-t border-[#ded7ca] pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <h3 className="font-semibold">Stroke sequence</h3>
            <p className="mt-2 text-xs leading-5 text-[#6b7584]">
              Stroke names differ between teaching systems. The animation shows
              where each stroke starts and how it moves.
            </p>
            <ol className="mt-4 space-y-3 text-sm">
              {strokeLabels.map((stroke, index) => (
                  <li key={stroke} className="flex gap-4">
                    <span className="font-bold text-[#b62822]">{index + 1}</span>
                    <span>{stroke}</span>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </section>

      {!sessionMode ? (
        <section className="hs-card mt-4 p-4">
          <h2 className="hs-display text-xl font-bold">Stroke-by-stroke</h2>
          <StrokeSequence character={character} limit={resolvedStrokeCount || 6} className="mt-4" />
        </section>
      ) : null}

      {showGuidance ? (
        <section className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="hs-card p-6">
            <h2 className="hs-display text-2xl font-bold">
              How to write {character}
            </h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#4e5d70]">
              <li>• Watch the full animation once.</li>
              <li>• Use Next stroke to check the direction and shape.</li>
              <li>• Choose Practice to write the character on screen.</li>
              <li>• Open the character in the worksheet generator when you are ready to print.</li>
            </ul>
          </article>
          <article className="hs-card grid items-center gap-5 p-6 sm:grid-cols-[1fr_190px]">
            <div>
              <h2 className="hs-display text-2xl font-bold">
                Practise this character
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5d6a7d]">
                Open a worksheet for {character} with tracing and blank writing grids.
              </p>
              <Link
                href={`/generator?words=${encodeURIComponent(character)}`}
                className="hs-primary-button mt-5"
              >
                Open worksheet
              </Link>
            </div>
            <StrokeSequence character={character} limit={1} />
          </article>
        </section>
      ) : null}
    </>
  );
}

function ControlButton({
  icon: Icon,
  label,
  onClick,
  active = false,
}: {
  icon: typeof Play;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`hs-secondary-button px-2 text-sm ${
        active ? "border-[#172b46] bg-[#172b46] text-white hover:bg-[#213b5d]" : ""
      }`}
      onClick={onClick}
      aria-pressed={active}
    >
      <Icon className="size-4" /> {label}
    </button>
  );
}

function distance(first: TracePoint, second: TracePoint) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}
