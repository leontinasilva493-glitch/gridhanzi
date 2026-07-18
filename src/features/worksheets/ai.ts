import type { WorksheetDifficulty, WorksheetEntry } from "./types";
import { normalizeVocabularyValues } from "./engine";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function buildWorksheetPrompt(
  values: string[],
  difficulty: WorksheetDifficulty,
): string {
  const difficultyInstruction =
    difficulty === "beginner"
      ? "Use common simplified Chinese suitable for HSK 1-2 learners. Avoid rare characters and prefer short, easy-to-write wording."
      : "Use concise, natural native-level simplified Chinese while preserving the meaning and tone.";

  return [
    "You prepare Mandarin Chinese worksheets for teachers and parents.",
    difficultyInstruction,
    "Convert every input row into concise JSON with exactly these string keys:",
    "hanzi, pinyin (tone marks), english.",
    "Preserve the order. Return one output row for every input row.",
    "Treat a complete sentence as one row: translate it naturally and do not split it into separate vocabulary items.",
    "Do not invent facts or omit ambiguous input; keep the closest literal English meaning for teacher review.",
    "Return a JSON array only.",
    `Input rows: ${JSON.stringify(values)}`,
  ].join("\n");
}

export function isRetryableGeminiStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

export type WorksheetEnrichmentRequest =
  | {
      ok: true;
      values: string[];
      difficulty: WorksheetDifficulty;
    }
  | {
      ok: false;
      error: string;
    };

export function parseWorksheetEnrichmentRequest(
  body: unknown,
): WorksheetEnrichmentRequest {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const input =
    typeof body.input === "string"
      ? body.input
      : Array.isArray(body.values) &&
          body.values.every((value) => typeof value === "string")
        ? body.values
        : [];
  const normalized = normalizeVocabularyValues(input);
  if (!normalized.ok) return normalized;
  if (normalized.values.length === 0) {
    return { ok: false, error: "Add at least one word or phrase." };
  }

  const difficulty =
    body.difficulty === "advanced" ? "advanced" : "beginner";

  return {
    ok: true,
    values: normalized.values,
    difficulty,
  };
}

export async function fetchWithGeminiRetry(
  request: () => Promise<Response>,
  {
    maxRetries = 2,
    delayMs = 250,
  }: {
    maxRetries?: number;
    delayMs?: number;
  } = {},
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await request();
      if (
        !isRetryableGeminiStatus(response.status) ||
        attempt === maxRetries
      ) {
        return response;
      }
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) throw error;
    }

    if (delayMs > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * (attempt + 1)),
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini request failed.");
}

export function sanitizeAIEntries(value: unknown): WorksheetEntry[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item, index) => {
    if (!isRecord(item)) return [];

    const hanzi = typeof item.hanzi === "string" ? item.hanzi.trim() : "";
    const pinyin = typeof item.pinyin === "string" ? item.pinyin.trim() : "";
    const english =
      typeof item.english === "string" ? item.english.trim() : "";

    if (!hanzi && !english) return [];

    return [
      {
        id: `row-${index + 1}`,
        hanzi,
        pinyin,
        english,
        status:
          hanzi && pinyin && english ? "complete" : "needs-review",
      } satisfies WorksheetEntry,
    ];
  });
}

export function extractJsonArray(text: string): unknown[] {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? text;
  const start = fenced.indexOf("[");
  const end = fenced.lastIndexOf("]");

  if (start < 0 || end <= start) return [];

  try {
    const parsed: unknown = JSON.parse(fenced.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseGeminiResponse(value: unknown): WorksheetEntry[] {
  if (!isRecord(value) || !Array.isArray(value.candidates)) return [];

  const candidate = value.candidates[0];
  if (!isRecord(candidate) || !isRecord(candidate.content)) return [];

  const parts = candidate.content.parts;
  if (!Array.isArray(parts)) return [];

  const text = parts
    .filter(isRecord)
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("\n");

  return sanitizeAIEntries(extractJsonArray(text));
}
