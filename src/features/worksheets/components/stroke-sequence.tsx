"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { CharacterJson } from "hanzi-writer";

type TransformData = {
  transform: string;
};

export function StrokeSequence({
  character,
  limit,
  className = "",
}: {
  character: string;
  limit?: number;
  className?: string;
}) {
  const [strokes, setStrokes] = useState<string[]>([]);
  const [transform, setTransform] = useState<TransformData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setStrokes([]);
    setError(false);

    void import("hanzi-writer")
      .then(async ({ default: HanziWriter }) => {
        const data = (await HanziWriter.loadCharacterData(character)) as
          | CharacterJson
          | undefined;
        if (!active || !data) return;
        setStrokes(data.strokes);
        setTransform(HanziWriter.getScalingTransform(100, 100, 6));
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
    };
  }, [character]);

  if (error) {
    return (
      <div className={`grid min-h-24 place-items-center text-xs text-[#a24b46] ${className}`}>
        Stroke data is unavailable for this character.
      </div>
    );
  }

  if (!transform || strokes.length === 0) {
    return (
      <div className={`grid min-h-24 place-items-center ${className}`}>
        <LoaderCircle className="size-5 animate-spin text-[#b62822]" />
      </div>
    );
  }

  const count = Math.min(limit ?? strokes.length, strokes.length);

  return (
    <div
      className={`grid gap-3 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${Math.min(count, 6)}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden border border-[#d6d1c8] bg-white"
        >
          <span className="absolute left-1.5 top-1.5 z-10 grid size-5 place-items-center rounded-full bg-[#b62822] text-[10px] font-bold text-white">
            {index + 1}
          </span>
          <svg
            viewBox="0 0 100 100"
            className="size-full"
            aria-label={`Stroke ${index + 1} of ${character}`}
          >
            <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e2dc" strokeDasharray="3 3" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#e5e2dc" strokeDasharray="3 3" />
            <line x1="0" y1="0" x2="100" y2="100" stroke="#eeeae3" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="#eeeae3" />
            <g transform={transform.transform}>
              {strokes.map((path, pathIndex) => (
                <path
                  key={pathIndex}
                  d={path}
                  fill={
                    pathIndex > index
                      ? "#e8e6e1"
                      : pathIndex === index
                        ? "#c22d27"
                        : "#14253f"
                  }
                />
              ))}
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}

