"use client";

import { useEffect, useState } from "react";
import type { CharacterJson } from "hanzi-writer";

import { buildCumulativeStrokeFrames } from "../stroke-utils";

type TransformData = {
  transform: string;
};

export function WorksheetStrokeSequence({
  character,
  limit = 8,
}: {
  character: string;
  limit?: number;
}) {
  const [strokes, setStrokes] = useState<string[]>([]);
  const [transform, setTransform] = useState<TransformData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setStrokes([]);
    setTransform(null);
    setError(false);

    void import("hanzi-writer")
      .then(async ({ default: HanziWriter }) => {
        const data = (await HanziWriter.loadCharacterData(character)) as
          | CharacterJson
          | undefined;
        if (!active || !data) return;
        setStrokes(data.strokes);
        setTransform(HanziWriter.getScalingTransform(100, 100, 7));
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
      <span className="text-[0.36rem] text-[#a24b46] sm:text-[0.48rem]">
        Stroke data unavailable
      </span>
    );
  }

  if (!transform || strokes.length === 0) {
    return (
      <span
        className="h-1.5 w-20 animate-pulse rounded-full bg-[#ddd8cf]"
        data-stroke-loading="true"
        aria-label={`Loading stroke order for ${character}`}
      />
    );
  }

  const frames = buildCumulativeStrokeFrames(strokes, limit);

  return (
    <span
      className="grid flex-1 gap-[0.6%]"
      style={{
        gridTemplateColumns: `repeat(${frames.length}, minmax(0, 1fr))`,
      }}
      aria-label={`Stroke order for ${character}`}
    >
      {frames.map((frame, index) => (
        <span
          key={index}
          className="relative aspect-square overflow-hidden border border-[#d8d8d5] bg-white"
        >
          <svg
            viewBox="0 0 100 100"
            className="size-full"
            aria-label={`Stroke ${index + 1} of ${character}`}
          >
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="#ebe8e2"
              strokeDasharray="4 4"
            />
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="#ebe8e2"
              strokeDasharray="4 4"
            />
            <g transform={transform.transform}>
              {frame.map((path, pathIndex) => (
                <path
                  key={pathIndex}
                  d={path}
                  fill={pathIndex === frame.length - 1 ? "#bd2c26" : "#172942"}
                />
              ))}
            </g>
          </svg>
        </span>
      ))}
    </span>
  );
}
