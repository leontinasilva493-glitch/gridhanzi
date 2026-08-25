"use client";

import { useId } from "react";
import type { CharacterJson } from "hanzi-writer";

import { getPointAtProgress, mapHanziMedianToSurface } from "../stroke-trace";

type TemplateTraceLayerProps = {
  characterData: CharacterJson | null;
  strokeIndex: number;
  progress: number;
  visible: boolean;
};

const SURFACE_SIZE = 300;
const SURFACE_PADDING = 18;
const HANZI_DATA_SIZE = 1024;
const HANZI_DATA_BOTTOM = -124;
const MASK_STROKE_WIDTH = 180;

export function TemplateTraceLayer({
  characterData,
  strokeIndex,
  progress,
  visible,
}: TemplateTraceLayerProps) {
  const id = useId().replaceAll(":", "");
  if (!visible || !characterData) return null;

  const scale = (SURFACE_SIZE - SURFACE_PADDING * 2) / HANZI_DATA_SIZE;
  const yOffset = SURFACE_PADDING - HANZI_DATA_BOTTOM * scale;
  const transform = `translate(${SURFACE_PADDING} ${SURFACE_SIZE - yOffset}) scale(${scale} ${-scale})`;
  const currentMedian = characterData.medians[strokeIndex];
  const currentStroke = characterData.strokes[strokeIndex];
  const medianPath = currentMedian
    ? currentMedian
        .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
        .join(" ")
    : "";
  const marker = currentMedian
    ? getPointAtProgress(mapHanziMedianToSurface(currentMedian), progress)
    : null;
  const revealedStrokes = characterData.strokes.slice(0, strokeIndex);
  const maskId = `trace-mask-${id}`;
  const glowId = `trace-glow-${id}`;
  const normalizedProgress = Math.max(0.001, Math.min(1, progress));

  return (
    <svg
      viewBox="0 0 300 300"
      data-testid="template-trace-layer"
      data-stroke-index={strokeIndex}
      data-progress={progress.toFixed(3)}
      className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="-150"
          y="-200"
          width="1400"
          height="1300"
        >
          <path
            d={medianPath}
            fill="none"
            stroke="white"
            strokeWidth={MASK_STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            strokeDasharray={`${normalizedProgress} 1`}
          />
        </mask>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <g transform={transform} fill="#91a9bf" opacity="0.28" filter={`url(#${glowId})`}>
        {revealedStrokes.map((stroke, index) => (
          <path key={`glow-${index}`} d={stroke} />
        ))}
        {currentStroke ? <path d={currentStroke} mask={`url(#${maskId})`} /> : null}
      </g>
      <g transform={transform} fill="#1d3b5c">
        {revealedStrokes.map((stroke, index) => (
          <path key={`stroke-${index}`} d={stroke} />
        ))}
        {currentStroke ? <path d={currentStroke} mask={`url(#${maskId})`} /> : null}
      </g>

      {marker ? (
        <g data-testid="trace-marker">
          <circle cx={marker.x} cy={marker.y} r="8" fill="white" opacity="0.9" />
          <circle cx={marker.x} cy={marker.y} r="5" fill="#c82924" />
        </g>
      ) : null}
    </svg>
  );
}
