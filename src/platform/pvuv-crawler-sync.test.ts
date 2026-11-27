import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPvuvCrawlerHit,
  isTrackableCrawlerPath,
  reportPvuvCrawlerHit,
} from "./pvuv-crawler-sync";

test("isTrackableCrawlerPath allows page routes and text/xml/md feeds while skipping APIs and static assets", () => {
  assert.equal(isTrackableCrawlerPath("/"), true);
  assert.equal(isTrackableCrawlerPath("/hsk/3-0-writing-characters/level-3"), true);
  assert.equal(isTrackableCrawlerPath("/sitemap.xml"), true);
  assert.equal(isTrackableCrawlerPath("/llms.txt"), true);
  assert.equal(isTrackableCrawlerPath("/guide.html"), true);
  assert.equal(isTrackableCrawlerPath("/notes.md"), true);

  assert.equal(isTrackableCrawlerPath("/api/worksheet/enrich"), false);
  assert.equal(isTrackableCrawlerPath("/_public-pages/index.html"), false);
  assert.equal(isTrackableCrawlerPath("/_next/static/chunk.js"), false);
  assert.equal(isTrackableCrawlerPath("/gridhanzi-icon-128.png"), false);
  assert.equal(isTrackableCrawlerPath("/downloads/blank.pdf"), false);
  assert.equal(isTrackableCrawlerPath("/assets/app.css"), false);
});

test("buildPvuvCrawlerHit matches AI and search crawlers on production hosts and drops query strings", () => {
  const request = new Request("https://gridhanzi.org/generator?words=private", {
    method: "GET",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)",
      "cf-connecting-ip": "20.171.1.2",
    },
  });

  assert.deepEqual(buildPvuvCrawlerHit(request, 200, 1761465600000), {
    ua: "Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)",
    path: "/generator",
    ip: "20.171.1.2",
    status: 200,
    ts: 1761465600000,
  });

  const headRequest = new Request("https://www.gridhanzi.org/sitemap.xml", {
    method: "HEAD",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "x-forwarded-for": "66.249.66.1, 10.0.0.1",
    },
  });
  assert.deepEqual(buildPvuvCrawlerHit(headRequest, 200, 1761465600000), {
    ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    path: "/sitemap.xml",
    ip: "66.249.66.1",
    status: 200,
    ts: 1761465600000,
  });
});

test("buildPvuvCrawlerHit ignores browsers, non-production hosts, and non-GET/HEAD requests", () => {
  assert.equal(
    buildPvuvCrawlerHit(
      new Request("https://gridhanzi.org/", {
        headers: { "user-agent": "Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36" },
      }),
      200,
    ),
    null,
  );
  assert.equal(
    buildPvuvCrawlerHit(
      new Request("https://gridhanzi.workers.dev/", {
        headers: { "user-agent": "ChatGPT-User/1.0" },
      }),
      200,
    ),
    null,
  );
  assert.equal(
    buildPvuvCrawlerHit(
      new Request("https://gridhanzi.org/", {
        method: "POST",
        headers: { "user-agent": "ChatGPT-User/1.0" },
      }),
      200,
    ),
    null,
  );
});

test("reportPvuvCrawlerHit posts to pvuv.ai with bearer auth and never rejects on network failure", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fakeFetch: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), init });
    return new Response(JSON.stringify({ accepted: 1 }), { status: 200 });
  };

  const request = new Request("https://gridhanzi.org/templates/hsk-1", {
    headers: {
      "user-agent": "PerplexityBot/1.0",
      "cf-connecting-ip": "1.2.3.4",
    },
  });

  // Skips when token or site id is absent.
  assert.equal(reportPvuvCrawlerHit(request, 200, { PVUV_SITE: "CfYvPpaZ" }, fakeFetch), null);
  assert.equal(calls.length, 0);

  await reportPvuvCrawlerHit(
    request,
    200,
    { PVUV_SITE: "CfYvPpaZ", PVUV_INGEST_TOKEN: "pvuv_test_token" },
    fakeFetch,
    1761465600000,
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0]!.url, "https://api.pvuv.ai/v1/sites/CfYvPpaZ/crawler_hits");
  assert.equal(calls[0]!.init?.method, "POST");
  assert.deepEqual(calls[0]!.init?.headers, {
    authorization: "Bearer pvuv_test_token",
    "content-type": "application/json",
  });
  assert.deepEqual(JSON.parse(String(calls[0]!.init?.body)), {
    hits: [
      {
        ua: "PerplexityBot/1.0",
        path: "/templates/hsk-1",
        ip: "1.2.3.4",
        status: 200,
        ts: 1761465600000,
      },
    ],
  });

  // Never rejects even if pvuv.ai is unreachable.
  const failingFetch: typeof fetch = async () => {
    throw new Error("network down");
  };
  await assert.doesNotReject(
    () =>
      reportPvuvCrawlerHit(
        request,
        500,
        { PVUV_SITE: "CfYvPpaZ", PVUV_INGEST_TOKEN: "pvuv_test_token" },
        failingFetch,
      )!,
  );
});
