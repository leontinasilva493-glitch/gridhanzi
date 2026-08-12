import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWorksheetPrompt,
  fetchWithGeminiRetry,
  isRetryableGeminiStatus,
  parseWorksheetEnrichmentRequest,
  parseGeminiResponse,
  sanitizeAIEntries,
} from "./ai";

test("sanitizeAIEntries accepts only well-shaped worksheet rows", () => {
  assert.deepEqual(
    sanitizeAIEntries([
      {
        hanzi: "老师",
        pinyin: "lǎoshī",
        english: "teacher",
      },
      {
        hanzi: 123,
        pinyin: null,
        english: {},
      },
    ]),
    [
      {
        id: "row-1",
        hanzi: "老师",
        pinyin: "lǎoshī",
        english: "teacher",
        status: "complete",
      },
    ],
  );
});

test("sanitizeAIEntries marks incomplete strings for review", () => {
  assert.deepEqual(
    sanitizeAIEntries([{ hanzi: "学生", pinyin: "", english: "student" }]),
    [
      {
        id: "row-1",
        hanzi: "学生",
        pinyin: "",
        english: "student",
        status: "needs-review",
      },
    ],
  );
});

test("sanitizeAIEntries rejects non-array responses", () => {
  assert.deepEqual(sanitizeAIEntries({ entries: [] }), []);
});

test("parseGeminiResponse extracts and sanitizes fenced JSON", () => {
  const response = {
    candidates: [
      {
        content: {
          parts: [
            {
              text: '```json\n[{"hanzi":"朋友","pinyin":"péngyou","english":"friend"}]\n```',
            },
          ],
        },
      },
    ],
  };

  assert.deepEqual(parseGeminiResponse(response), [
    {
      id: "row-1",
      hanzi: "朋友",
      pinyin: "péngyou",
      english: "friend",
      status: "complete",
    },
  ]);
});

test("parseGeminiResponse returns an empty list for malformed responses", () => {
  assert.deepEqual(parseGeminiResponse({ candidates: [] }), []);
});

test("buildWorksheetPrompt applies beginner vocabulary constraints", () => {
  const prompt = buildWorksheetPrompt(["The quick brown fox"], "beginner");

  assert.match(prompt, /HSK 1-2/i);
  assert.match(prompt, /common simplified Chinese/i);
  assert.match(prompt, /complete sentence as one row/i);
  assert.match(prompt, /do not split/i);
  assert.match(prompt, /The quick brown fox/);
});

test("buildWorksheetPrompt allows concise native wording for advanced users", () => {
  const prompt = buildWorksheetPrompt(["The quick brown fox"], "advanced");

  assert.match(prompt, /natural native-level/i);
  assert.doesNotMatch(prompt, /HSK 1-2/i);
});

test("buildWorksheetPrompt requests Taiwan Traditional Chinese when selected", () => {
  const prompt = buildWorksheetPrompt(
    ["software", "bicycle"],
    "beginner",
    "traditional-tw",
  );

  assert.match(prompt, /Taiwan Traditional Chinese/i);
  assert.match(prompt, /Taiwan-localized word choices/i);
  assert.doesNotMatch(prompt, /common simplified Chinese/i);
});

test("parseWorksheetEnrichmentRequest carries the selected script", () => {
  const parsed = parseWorksheetEnrichmentRequest({
    values: ["family"],
    difficulty: "advanced",
    characterStandard: "traditional-tw",
  });

  assert.equal(parsed.ok, true);
  if (parsed.ok) assert.equal(parsed.characterStandard, "traditional-tw");
});

test("parseWorksheetEnrichmentRequest defaults unknown scripts to Simplified", () => {
  const parsed = parseWorksheetEnrichmentRequest({
    values: ["family"],
    characterStandard: "unknown",
  });

  assert.equal(parsed.ok, true);
  if (parsed.ok) assert.equal(parsed.characterStandard, "simplified");
});

test("isRetryableGeminiStatus retries throttling and server failures only", () => {
  assert.equal(isRetryableGeminiStatus(408), true);
  assert.equal(isRetryableGeminiStatus(429), true);
  assert.equal(isRetryableGeminiStatus(503), true);
  assert.equal(isRetryableGeminiStatus(400), false);
  assert.equal(isRetryableGeminiStatus(401), false);
});

test("parseWorksheetEnrichmentRequest validates values and difficulty", () => {
  assert.deepEqual(
    parseWorksheetEnrichmentRequest({
      values: [" family ", "妈妈"],
      difficulty: "advanced",
      characterStandard: "simplified",
    }),
    {
      ok: true,
      values: ["family", "妈妈"],
      difficulty: "advanced",
      characterStandard: "simplified",
    },
  );

  assert.deepEqual(parseWorksheetEnrichmentRequest({ values: [], difficulty: "expert" }), {
    ok: false,
    error: "Add at least one word or phrase.",
  });
});

test("fetchWithGeminiRetry retries twice after retryable responses", async () => {
  let attempts = 0;
  const response = await fetchWithGeminiRetry(
    async () => {
      attempts += 1;
      return new Response("{}", { status: attempts < 3 ? 503 : 200 });
    },
    { maxRetries: 2, delayMs: 0 },
  );

  assert.equal(response.status, 200);
  assert.equal(attempts, 3);
});

test("fetchWithGeminiRetry does not retry non-retryable responses", async () => {
  let attempts = 0;
  const response = await fetchWithGeminiRetry(
    async () => {
      attempts += 1;
      return new Response("{}", { status: 400 });
    },
    { maxRetries: 2, delayMs: 0 },
  );

  assert.equal(response.status, 400);
  assert.equal(attempts, 1);
});
