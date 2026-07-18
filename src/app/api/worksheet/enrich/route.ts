import { NextRequest, NextResponse } from "next/server";

import {
  buildWorksheetPrompt,
  fetchWithGeminiRetry,
  parseGeminiResponse,
  parseWorksheetEnrichmentRequest,
} from "@/features/worksheets/ai";
import { enrichVocabularyLocally } from "@/features/worksheets/engine";
import type { WorksheetDifficulty } from "@/features/worksheets/types";
import { enforceMinIntervalRateLimit } from "@/lib/rate-limit";

const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || "gemini-3.1-flash-lite";

async function enrichWithGemini(
  values: string[],
  difficulty: WorksheetDifficulty,
  apiKey: string,
) {
  const prompt = buildWorksheetPrompt(values, difficulty);
  const response = await fetchWithGeminiRetry(
    () =>
      fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: difficulty === "beginner" ? 0.1 : 0.25,
              responseMimeType: "application/json",
            },
          }),
          signal: AbortSignal.timeout(30_000),
        },
      ),
    { maxRetries: 2, delayMs: 300 },
  );

  if (!response.ok) return [];
  return parseGeminiResponse(await response.json());
}

export async function POST(request: NextRequest) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: Number(process.env.WORKSHEET_MIN_INTERVAL_MS || 2_000),
    keyPrefix: "worksheet-enrich",
  });
  if (limited) return limited;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = parseWorksheetEnrichmentRequest(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: parsed.error },
      { status: 400 },
    );
  }

  const { values, difficulty } = parsed;
  const localEntries = enrichVocabularyLocally(values);
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json({
      entries: localEntries,
      source: "local",
      fallbackReason: "not_configured",
    });
  }

  try {
    const aiEntries = await enrichWithGemini(values, difficulty, apiKey);
    if (aiEntries.length === values.length) {
      return NextResponse.json({ entries: aiEntries, source: "gemini" });
    }
  } catch (error) {
    console.error("Worksheet enrichment fell back to local data.", error);
  }

  return NextResponse.json({
    entries: localEntries,
    source: "local",
    fallbackReason: "model_unavailable",
  });
}
