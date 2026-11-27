import { isProductionAnalyticsHost } from "../components/analytics/host";

export const PVUV_CRAWLER_PATTERN =
  /chatgpt-user|oai-searchbot|gptbot|perplexity-user|perplexitybot|claude-user|claude-searchbot|claudebot|bingbot|googlebot|applebot|duckduckbot|duckassistbot|yandexbot|meta-externalagent|bytespider/i;

const STATIC_ASSET_PATTERN = /\.(?!(?:html?|txt|xml|md)$)[a-z0-9]{1,8}$/i;

export interface PvuvCrawlerEnv {
  PVUV_SITE?: string;
  PVUV_INGEST_TOKEN?: string;
}

export interface PvuvCrawlerHit {
  ua: string;
  path: string;
  ip?: string;
  status: number;
  ts: number;
}

export function isTrackableCrawlerPath(pathname: string): boolean {
  if (pathname.startsWith("/api/") || pathname.startsWith("/_")) return false;
  return !STATIC_ASSET_PATTERN.test(pathname);
}

export function buildPvuvCrawlerHit(
  request: Request,
  status: number,
  now = Date.now(),
): PvuvCrawlerHit | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  const url = new URL(request.url);
  if (!isProductionAnalyticsHost(url.hostname)) return null;
  if (!isTrackableCrawlerPath(url.pathname)) return null;

  const ua = request.headers.get("user-agent") ?? "";
  if (!PVUV_CRAWLER_PATTERN.test(ua)) return null;

  const ip =
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    undefined;

  return {
    ua,
    path: url.pathname,
    ...(ip ? { ip } : {}),
    status,
    ts: now,
  };
}

export function reportPvuvCrawlerHit(
  request: Request,
  status: number,
  env: PvuvCrawlerEnv,
  fetchImpl: typeof fetch = fetch,
  now = Date.now(),
): Promise<void> | null {
  const siteId = typeof env.PVUV_SITE === "string" ? env.PVUV_SITE.trim() : "";
  const token = typeof env.PVUV_INGEST_TOKEN === "string" ? env.PVUV_INGEST_TOKEN.trim() : "";
  if (!siteId || !token) return null;

  const hit = buildPvuvCrawlerHit(request, status, now);
  if (!hit) return null;

  const signal = typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
    ? AbortSignal.timeout(3000)
    : undefined;

  return fetchImpl(`https://api.pvuv.ai/v1/sites/${encodeURIComponent(siteId)}/crawler_hits`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ hits: [hit] }),
    ...(signal ? { signal } : {}),
  })
    .then(() => undefined)
    .catch(() => undefined);
}
