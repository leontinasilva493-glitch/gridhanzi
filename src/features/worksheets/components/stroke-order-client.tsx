"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilePlus2,
  Pencil,
  Play,
  RotateCcw,
  Search,
  SkipForward,
} from "lucide-react";
import type HanziWriterType from "hanzi-writer";

import { Link } from "@/core/i18n/navigation";
import type { StrokeOrderCharacter } from "../stroke-order-characters";

import { StrokeSequence } from "./stroke-sequence";

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
};

export function StrokeOrderClient({
  initialCharacter = "永",
  initialInfo,
  showSearch = true,
  showGuidance = true,
}: StrokeOrderClientProps = {}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriterType | null>(null);
  const [input, setInput] = useState(initialCharacter);
  const [character, setCharacter] = useState(initialCharacter);
  const [strokeIndex, setStrokeIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const info =
    character === initialCharacter && initialInfo
      ? initialInfo
      : (characterInfo[character] ?? {
          pinyin: "—",
          meaning: "Meaning not listed",
          strokes: 0,
        });
  const strokeLabels = Array.from(
    { length: info.strokes || 6 },
    (_, index) => `Stroke ${index + 1}`,
  );

  useEffect(() => {
    let active = true;
    if (!targetRef.current) return;

    targetRef.current.innerHTML = "";
    setLoadError(false);
    setStrokeIndex(0);

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
          radicalColor: "#bd2c26",
          outlineColor: "#ddd9d1",
          showOutline: true,
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

      <section className="mt-7 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hs-card p-4">
          <div className="mx-auto aspect-square max-w-[330px] bg-white">
            <div className="relative size-full border border-[#d4cec3]">
              <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#dedbd5]" />
              <span className="absolute inset-y-0 left-1/2 border-l border-dashed border-[#dedbd5]" />
              {loadError ? (
                <div className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-[#a24b46]">
                  Stroke data is unavailable. Try another common character.
                </div>
              ) : (
                <div ref={targetRef} className="relative z-10 size-full" />
              )}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <ControlButton
              icon={Play}
              label="Play"
              onClick={() => void writerRef.current?.animateCharacter()}
            />
            <ControlButton
              icon={SkipForward}
              label="Next stroke"
              onClick={() => {
                void writerRef.current?.animateStroke(strokeIndex);
                setStrokeIndex((current) =>
                  info.strokes > 0 ? (current + 1) % info.strokes : current + 1,
                );
              }}
            />
            <ControlButton
              icon={RotateCcw}
              label="Restart"
              onClick={() => {
                setStrokeIndex(0);
                void writerRef.current?.animateCharacter();
              }}
            />
            <ControlButton
              icon={Pencil}
              label="Practice"
              onClick={() => void writerRef.current?.quiz()}
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
                  {info.strokes ? `${info.strokes} strokes` : "Stroke count not listed"}
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

      <section className="hs-card mt-4 p-4">
        <h2 className="hs-display text-xl font-bold">Stroke-by-stroke</h2>
        <StrokeSequence character={character} limit={info.strokes || 6} className="mt-4" />
      </section>

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
}: {
  icon: typeof Play;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="hs-secondary-button px-2 text-sm" onClick={onClick}>
      <Icon className="size-4" /> {label}
    </button>
  );
}
