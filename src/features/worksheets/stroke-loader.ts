export const STROKE_TIMEOUT_MS = 5000;

export function withDeadline<T>(task: Promise<T>, fallback: T, timeoutMs = STROKE_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), timeoutMs);
    task.then((value) => { clearTimeout(timer); resolve(value); }, () => {
      clearTimeout(timer);
      resolve(fallback);
    });
  });
}

/** Share in-flight requests and cache successes; failed/timed-out characters can retry. */
export function createStrokeLoader(load: (character: string, signal: AbortSignal) => Promise<string[] | null>, timeoutMs = STROKE_TIMEOUT_MS) {
  const cache = new Map<string, Promise<string[] | null>>();
  return (character: string) => {
    const existing = cache.get(character);
    if (existing) return existing;
    const controller = new AbortController();
    const result = withDeadline(Promise.resolve().then(() => load(character, controller.signal)), null, timeoutMs)
      .then((strokes) => {
        controller.abort(); // Free stalled connections before the next retry.
        if (!strokes?.length) { cache.delete(character); return null; }
        return strokes;
      });
    cache.set(character, result);
    return result;
  };
}

// Same pinned data source as HanziWriter, with cancellation on timeout.
export const loadCharacterStrokes = createStrokeLoader(async (character, signal) => {
  const response = await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(character)}.json`, { signal });
  if (!response.ok) return null;
  const data = await response.json() as { strokes?: unknown };
  return Array.isArray(data.strokes) && data.strokes.every((stroke) => typeof stroke === "string") ? data.strokes : null;
});
