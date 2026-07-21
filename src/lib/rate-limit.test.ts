import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { enforceMinIntervalRateLimit } from "./rate-limit";

const projectFile = (path: string) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("rotating cookies cannot bypass the per-IP minimum interval", async () => {
  const url = "https://example.com/api/worksheet/enrich";
  const firstRequest = new Request(url, {
    method: "POST",
    headers: {
      "cf-connecting-ip": "203.0.113.10",
      cookie: "session=first",
    },
  });
  const rotatedCookieRequest = new Request(url, {
    method: "POST",
    headers: {
      "cf-connecting-ip": "203.0.113.10",
      cookie: "session=second",
    },
  });
  const options = {
    intervalMs: 60_000,
    keyPrefix: `cookie-rotation-${crypto.randomUUID()}`,
  };

  assert.equal(await enforceMinIntervalRateLimit(firstRequest, options), null);
  assert.equal(
    (await enforceMinIntervalRateLimit(rotatedCookieRequest, options))?.status,
    429,
  );
});

test("Cloudflare client IP cannot be bypassed with a spoofed forwarded header", async () => {
  const url = "https://example.com/api/worksheet/enrich";
  const request = (spoofedIp: string) =>
    new Request(url, {
      method: "POST",
      headers: {
        "cf-connecting-ip": "203.0.113.40",
        "x-forwarded-for": spoofedIp,
      },
    });
  const options = {
    intervalMs: 60_000,
    keyPrefix: `spoofed-xff-${crypto.randomUUID()}`,
  };

  assert.equal(await enforceMinIntervalRateLimit(request("198.51.100.1"), options), null);
  assert.equal(
    (await enforceMinIntervalRateLimit(request("198.51.100.2"), options))?.status,
    429,
  );
});

test("a shared binding can reject a stable per-IP route key", async () => {
  let receivedKey = "";
  const binding = {
    async limit({ key }: { key: string }) {
      receivedKey = key;
      return { success: false };
    },
  };

  const response = await enforceMinIntervalRateLimit(
    new Request("https://example.com/api/worksheet/enrich", {
      method: "POST",
      headers: {
        "cf-connecting-ip": "203.0.113.20",
        cookie: "attacker-controlled=value",
      },
    }),
    {
      intervalMs: 2_000,
      keyPrefix: "worksheet-enrich",
      binding,
      retryAfterSeconds: 60,
    },
  );

  assert.equal(receivedKey, "worksheet-enrich|POST|/api/worksheet/enrich|203.0.113.20");
  assert.equal(response?.status, 429);
  assert.equal(response?.headers.get("retry-after"), "60");
});

test("a shared binding failure blocks paid traffic with a retryable response", async () => {
  const response = await enforceMinIntervalRateLimit(
    new Request("https://example.com/api/worksheet/enrich", {
      method: "POST",
      headers: { "cf-connecting-ip": "203.0.113.30" },
    }),
    {
      intervalMs: 2_000,
      binding: {
        async limit() {
          throw new Error("binding unavailable");
        },
      },
      retryAfterSeconds: 60,
    },
  );

  assert.equal(response?.status, 503);
  assert.equal(response?.headers.get("retry-after"), "60");
  assert.deepEqual(await response?.json(), {
    error: "rate_limit_unavailable",
    message: "Paid enrichment is temporarily unavailable. Please retry later.",
  });
});

test("Cloudflare config provides a shared worksheet rate-limit binding", async () => {
  const config = JSON.parse(await projectFile("wrangler.jsonc"));

  assert.deepEqual(config.ratelimits, [
    {
      name: "WORKSHEET_RATE_LIMITER",
      namespace_id: "145052251",
      simple: { limit: 10, period: 60 },
    },
  ]);
});

test("the worksheet route spends rate-limit capacity only before a paid call", async () => {
  const source = await projectFile("src/app/api/worksheet/enrich/route.ts");
  const validationIndex = source.indexOf("parseWorksheetEnrichmentRequest(body)");
  const apiKeyIndex = source.indexOf("const apiKey = process.env.GEMINI_API_KEY");
  const limiterIndex = source.indexOf("await enforceMinIntervalRateLimit");

  assert.ok(validationIndex >= 0);
  assert.ok(apiKeyIndex > validationIndex);
  assert.ok(limiterIndex > apiKeyIndex);
  assert.match(source, /binding:\s*await getWorksheetRateLimitBinding\(\)/);
});
