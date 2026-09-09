export type HandwritingPoint = { x: number; y: number };
export type HandwritingStroke = HandwritingPoint[];
export type HandwritingRecognitionStatus =
  | "loading"
  | "ready"
  | "recognizing"
  | "error";

const HAN_CHARACTER_PATTERN = /^\p{Script=Han}$/u;
const NORMALIZED_SURFACE_SIZE = 1000;
const HANZI_LOOKUP_SURFACE_SIZE = 256;

export function resolveStrokeOrderLookupCharacter(input?: string): string {
  const character = Array.from(input?.trim() ?? "")[0];
  return character && HAN_CHARACTER_PATTERN.test(character) ? character : "永";
}

export function normalizeCanvasPoint({
  clientX,
  clientY,
  bounds,
}: {
  clientX: number;
  clientY: number;
  bounds: { left: number; top: number; width: number; height: number };
}): HandwritingPoint {
  const normalizedX = bounds.width > 0
    ? ((clientX - bounds.left) / bounds.width) * NORMALIZED_SURFACE_SIZE
    : 0;
  const normalizedY = bounds.height > 0
    ? ((clientY - bounds.top) / bounds.height) * NORMALIZED_SURFACE_SIZE
    : 0;

  return {
    x: Math.round(clamp(normalizedX, 0, NORMALIZED_SURFACE_SIZE)),
    y: Math.round(clamp(normalizedY, 0, NORMALIZED_SURFACE_SIZE)),
  };
}

export function simplifyHandwritingStroke(
  points: readonly HandwritingPoint[],
  tolerance = 6,
): HandwritingStroke {
  if (points.length <= 2) return points.map((point) => ({ ...point }));

  const first = points[0];
  const last = points[points.length - 1];
  let splitIndex = 0;
  let maxDistance = 0;

  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = distanceFromLine(points[index], first, last);
    if (distance > maxDistance) {
      maxDistance = distance;
      splitIndex = index;
    }
  }

  if (maxDistance <= tolerance) return [{ ...first }, { ...last }];

  const before = simplifyHandwritingStroke(
    points.slice(0, splitIndex + 1),
    tolerance,
  );
  const after = simplifyHandwritingStroke(points.slice(splitIndex), tolerance);
  return [...before.slice(0, -1), ...after];
}

export function sanitizeHandwritingMatches(
  matches: readonly string[],
  limit = 8,
): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const candidate of matches) {
    const character = candidate.trim();
    if (!HAN_CHARACTER_PATTERN.test(character) || seen.has(character)) continue;
    seen.add(character);
    result.push(character);
    if (result.length >= limit) break;
  }

  return result;
}

export function extractHanziLookupMatches(
  input: unknown,
  limit = 8,
): string[] {
  if (!Array.isArray(input)) return [];
  return sanitizeHandwritingMatches(
    input.flatMap((match) => {
      if (
        match &&
        typeof match === "object" &&
        "hanzi" in match &&
        typeof match.hanzi === "string"
      ) {
        return [match.hanzi];
      }
      return [];
    }),
    limit,
  );
}

export function toHanziLookupStrokes(
  strokes: readonly HandwritingStroke[],
): number[][][] {
  return strokes.map((stroke) =>
    stroke.map((point) => [
      Math.round((point.x / NORMALIZED_SURFACE_SIZE) * HANZI_LOOKUP_SURFACE_SIZE),
      Math.round((point.y / NORMALIZED_SURFACE_SIZE) * HANZI_LOOKUP_SURFACE_SIZE),
    ]),
  );
}

export function shouldRequestHandwritingRecognition(
  status: HandwritingRecognitionStatus,
  strokeCount: number,
  lastRequestedStrokeCount: number,
): boolean {
  return status === "ready" && strokeCount > 0 && strokeCount !== lastRequestedStrokeCount;
}

export function addRecentHandwritingCharacter(
  recent: readonly string[],
  character: string,
  limit = 6,
): string[] {
  return [character, ...recent.filter((item) => item !== character)].slice(
    0,
    limit,
  );
}

function distanceFromLine(
  point: HandwritingPoint,
  start: HandwritingPoint,
  end: HandwritingPoint,
): number {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const length = Math.hypot(deltaX, deltaY);
  if (length === 0) return Math.hypot(point.x - start.x, point.y - start.y);
  return Math.abs(
    (point.x - start.x) * deltaY - (point.y - start.y) * deltaX,
  ) / length;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
