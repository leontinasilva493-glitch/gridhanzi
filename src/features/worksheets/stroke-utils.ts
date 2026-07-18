export function buildCumulativeStrokeFrames(
  strokes: string[],
  limit = strokes.length,
): string[][] {
  const count = Math.min(Math.max(0, limit), strokes.length);
  return Array.from({ length: count }, (_, index) =>
    strokes.slice(0, index + 1),
  );
}

