export function buildCumulativeStrokeFrames(
  strokes: string[],
  limit = strokes.length,
): string[][] {
  const count = Math.min(Math.max(0, limit), strokes.length);
  return Array.from({ length: count }, (_, index) =>
    strokes.slice(0, index + 1),
  );
}

export function selectStrokeFrames<T>(
  frames: readonly T[],
  mode: "detailed" | "compact" | "off",
  compactLimit = 4,
): T[] {
  if (mode === "off" || frames.length === 0) return [];
  if (mode === "detailed" || frames.length <= compactLimit) return [...frames];

  const count = Math.max(1, compactLimit);
  if (count === 1) return [frames[frames.length - 1]!];
  const indexes = Array.from({ length: count }, (_, index) =>
    Math.round((index * (frames.length - 1)) / (count - 1)),
  );
  return indexes.map((index) => frames[index]!);
}
