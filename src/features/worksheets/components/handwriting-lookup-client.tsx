"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Check,
  Eraser,
  LoaderCircle,
  LockKeyhole,
  PencilLine,
  RotateCcw,
  Undo2,
} from "lucide-react";

import {
  addRecentHandwritingCharacter,
  extractHanziLookupMatches,
  normalizeCanvasPoint,
  sanitizeHandwritingMatches,
  simplifyHandwritingStroke,
  shouldRequestHandwritingRecognition,
  toHanziLookupStrokes,
  type HandwritingPoint,
  type HandwritingRecognitionStatus,
  type HandwritingStroke,
} from "../handwriting-input";
import { getStrokeOrderCharacter } from "../stroke-order-characters";

const RECENT_STORAGE_KEY = "gridhanzi:handwriting-recent:v1";
const SURFACE_SIZE = 1000;

type WorkerMessage =
  | { what: "loaded" }
  | { what: "lookup"; requestId?: number; matches?: unknown }
  | { what: "error"; requestId?: number };

export function HandwritingLookupClient({
  onSelectCharacter,
}: {
  onSelectCharacter: (character: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const strokesRef = useRef<HandwritingStroke[]>([]);
  const activeStrokeRef = useRef<HandwritingStroke | null>(null);
  const requestIdRef = useRef(0);
  const lastRequestedStrokeCountRef = useRef(-1);
  const recognitionTimerRef = useRef<number | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [status, setStatus] = useState<HandwritingRecognitionStatus>("loading");
  const [matches, setMatches] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  const renderStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const density = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(density, 0, 0, density, 0, 0);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "#172b49";
    context.lineWidth = Math.max(5, width / 58);
    context.lineCap = "round";
    context.lineJoin = "round";

    for (const stroke of [
      ...strokesRef.current,
      ...(activeStrokeRef.current ? [activeStrokeRef.current] : []),
    ]) {
      if (stroke.length === 0) continue;
      context.beginPath();
      context.moveTo(
        (stroke[0].x / SURFACE_SIZE) * width,
        (stroke[0].y / SURFACE_SIZE) * height,
      );
      for (const point of stroke.slice(1)) {
        context.lineTo(
          (point.x / SURFACE_SIZE) * width,
          (point.y / SURFACE_SIZE) * height,
        );
      }
      context.stroke();
    }
  }, []);

  const recognize = useCallback(() => {
    if (!workerRef.current || status === "loading" || status === "error") return;
    if (recognitionTimerRef.current !== null) {
      window.clearTimeout(recognitionTimerRef.current);
    }
    recognitionTimerRef.current = window.setTimeout(() => {
      if (!workerRef.current || activeStrokeRef.current || strokesRef.current.length === 0) return;
      requestIdRef.current += 1;
      lastRequestedStrokeCountRef.current = strokesRef.current.length;
      setStatus("recognizing");
      workerRef.current.postMessage({
        what: "lookup",
        requestId: requestIdRef.current,
        strokes: toHanziLookupStrokes(strokesRef.current),
        limit: 8,
      });
    }, 180);
  }, [status]);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        window.localStorage.getItem(RECENT_STORAGE_KEY) ?? "[]",
      );
      if (Array.isArray(stored)) {
        setRecent(sanitizeHandwritingMatches(stored, 6));
      }
    } catch {
      // Recent choices are optional; storage may be blocked by the browser.
    }

    const worker = new Worker("/handwriting/worker.js");
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.what === "loaded") {
        setStatus("ready");
        return;
      }
      if (message.what === "lookup") {
        if (message.requestId !== requestIdRef.current) return;
        setMatches(extractHanziLookupMatches(message.matches));
        setStatus("ready");
        return;
      }
      if (message.requestId === undefined || message.requestId === requestIdRef.current) {
        setStatus("error");
      }
    };
    worker.onerror = () => setStatus("error");
    worker.postMessage({
      what: "init",
      wasmUri: "/handwriting/hanzi_lookup_bg.wasm",
    });

    return () => {
      if (recognitionTimerRef.current !== null) {
        window.clearTimeout(recognitionTimerRef.current);
      }
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(renderStrokes);
    observer.observe(canvas);
    renderStrokes();
    return () => observer.disconnect();
  }, [renderStrokes]);

  useEffect(() => {
    if (!activeStrokeRef.current && shouldRequestHandwritingRecognition(
      status,
      strokesRef.current.length,
      lastRequestedStrokeCountRef.current,
    )) {
      recognize();
    }
  }, [matches.length, recognize, status]);

  function getPoint(event: ReactPointerEvent<HTMLCanvasElement>): HandwritingPoint {
    const bounds = event.currentTarget.getBoundingClientRect();
    return normalizeCanvasPoint({
      clientX: event.clientX,
      clientY: event.clientY,
      bounds,
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    activeStrokeRef.current = [getPoint(event)];
    invalidateRecognition();
    renderStrokes();
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!activeStrokeRef.current || !event.isPrimary || event.buttons === 0) return;
    event.preventDefault();
    activeStrokeRef.current.push(getPoint(event));
    renderStrokes();
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const activeStroke = activeStrokeRef.current;
    if (!activeStroke) return;
    activeStrokeRef.current = null;
    strokesRef.current = [
      ...strokesRef.current,
      simplifyHandwritingStroke(activeStroke),
    ];
    setStrokeCount(strokesRef.current.length);
    renderStrokes();
    recognize();
  }

  function undoLastStroke() {
    if (strokesRef.current.length === 0) return;
    invalidateRecognition();
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    setMatches([]);
    renderStrokes();
    if (strokesRef.current.length > 0) recognize();
  }

  function invalidateRecognition() {
    if (recognitionTimerRef.current !== null) {
      window.clearTimeout(recognitionTimerRef.current);
      recognitionTimerRef.current = null;
    }
    requestIdRef.current += 1;
    lastRequestedStrokeCountRef.current = -1;
    setMatches([]);
    setStatus((current) => current === "error" || current === "loading" ? current : "ready");
  }

  function clearHandwriting() {
    invalidateRecognition();
    strokesRef.current = [];
    activeStrokeRef.current = null;
    setStrokeCount(0);
    setMatches([]);
    setStatus((current) => current === "error" || current === "loading" ? current : "ready");
    renderStrokes();
  }

  function chooseCharacter(character: string) {
    onSelectCharacter(character);
    const next = addRecentHandwritingCharacter(recent, character);
    setRecent(next);
    try {
      window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the current session usable when persistence is unavailable.
    }
  }

  return (
    <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.85fr)]">
      <div>
        <div className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-xl border-2 border-[#b9cce2] bg-[#f2f7fb] shadow-[0_12px_30px_rgb(23_43_73_/_0.08)]">
          <span className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-[#cad7e5]" />
          <span className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-dashed border-[#cad7e5]" />
          <canvas
            ref={canvasRef}
            aria-label="Draw one Simplified Chinese character"
            aria-describedby="handwriting-canvas-help"
            className="absolute inset-0 size-full cursor-crosshair touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
          {strokeCount === 0 ? (
            <div className="pointer-events-none absolute inset-0 grid place-items-center px-8 text-center text-[#8190a3]">
              <div>
                <PencilLine className="mx-auto size-12 text-[#b8c9dc]" strokeWidth={1.5} />
                <p className="mt-3 font-semibold">Draw one character here</p>
                <p className="mt-1 text-xs">Write one stroke at a time</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="hs-secondary-button min-h-11 justify-center"
            onClick={undoLastStroke}
            disabled={strokeCount === 0}
            aria-label="Undo last stroke"
          >
            <Undo2 className="size-4" /> Undo
          </button>
          <button
            type="button"
            className="hs-secondary-button min-h-11 justify-center"
            onClick={clearHandwriting}
            disabled={strokeCount === 0}
            aria-label="Clear handwriting"
          >
            <Eraser className="size-4" /> Clear
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#e5eef7] px-3 py-1 text-xs font-bold text-[#315272]">
            Simplified Chinese
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#557061]">
            <LockKeyhole className="size-3.5" /> Your handwriting stays on this device
          </span>
        </div>
        <p id="handwriting-canvas-help" className="mt-3 text-sm leading-6 text-[#5d6878]">
          Write the character you cannot type. Choose the intended match to load its stroke order, guide, and worksheet tools below.
        </p>

        <div className="mt-5 min-h-32" aria-live="polite">
          {status === "loading" ? (
            <StatusMessage icon={LoaderCircle} spin text="Loading the private recognition model…" />
          ) : status === "recognizing" ? (
            <StatusMessage icon={LoaderCircle} spin text="Checking your latest strokes…" />
          ) : status === "error" ? (
            <div className="rounded border border-[#e0b7b2] bg-[#fff4f2] p-4 text-sm leading-6 text-[#8d3732]">
              Recognition is unavailable in this browser. Use the Type a character tab instead.
            </div>
          ) : matches.length > 0 ? (
            <div>
              <p className="text-sm font-bold text-[#172b49]">Choose the character you meant</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {matches.map((character, index) => {
                  const entry = getStrokeOrderCharacter(character);
                  return (
                    <button
                      key={character}
                      type="button"
                      onClick={() => chooseCharacter(character)}
                      className={`rounded-lg border bg-white p-3 text-left transition-transform hover:-translate-y-0.5 hover:border-[#b62822] ${
                        index === 0 ? "border-[#b62822] shadow-[0_6px_18px_rgb(182_40_34_/_0.12)]" : "border-[#d4cec3]"
                      }`}
                      aria-label={`Use ${character}${entry ? `, ${entry.pinyin}, ${entry.meaning}` : ""}`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="hs-hanzi-context text-3xl font-bold text-[#172b49]">{character}</span>
                        {index === 0 ? <Check className="size-4 text-[#b62822]" /> : null}
                      </span>
                      <span className="mt-1 block truncate text-[11px] text-[#6a7586]">
                        {entry ? `${entry.pinyin} · ${entry.meaning}` : "Open stroke order"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : strokeCount > 0 ? (
            <p className="rounded border border-[#d8d0c2] bg-white p-4 text-sm text-[#5d6878]">
              No confident match yet. Add another stroke, undo, or clear and try again.
            </p>
          ) : (
            <p className="rounded border border-[#d8d0c2] bg-white p-4 text-sm leading-6 text-[#5d6878]">
              Candidates will appear here after each completed stroke. Nothing is uploaded.
            </p>
          )}
        </div>

        {recent.length > 0 ? (
          <div className="mt-5 border-t border-[#ded7ca] pt-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#756b60]">
              <RotateCcw className="size-3.5" /> Recent choices
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {recent.map((character) => (
                <button
                  key={character}
                  type="button"
                  className="grid size-10 place-items-center rounded border border-[#d4cec3] bg-white text-xl text-[#172b49] hover:border-[#b62822]"
                  onClick={() => chooseCharacter(character)}
                >
                  {character}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatusMessage({
  icon: Icon,
  spin = false,
  text,
}: {
  icon: typeof LoaderCircle;
  spin?: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded border border-[#d8d0c2] bg-white p-4 text-sm text-[#5d6878]">
      <Icon className={`size-5 text-[#b62822] ${spin ? "animate-spin" : ""}`} />
      {text}
    </div>
  );
}
