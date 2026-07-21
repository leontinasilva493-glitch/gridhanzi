type MinIntervalOptions = {
  intervalMs: number;
  keyPrefix?: string;
  extraKey?: string;
  binding?: RateLimitBinding;
  retryAfterSeconds?: number;
};

export type RateLimitBinding = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

type Store = Map<string, number>;

declare global {
  var __minIntervalRateLimitStore: Store | undefined;
}

function getClientIpFromRequest(request: Request): string {
  const cloudflareIp = request.headers.get('cf-connecting-ip')?.trim();
  if (cloudflareIp) return cloudflareIp;
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || '';
  return request.headers.get('x-real-ip')?.trim() || '';
}

function getStore(): Store {
  if (!globalThis.__minIntervalRateLimitStore) {
    globalThis.__minIntervalRateLimitStore = new Map();
  }
  return globalThis.__minIntervalRateLimitStore;
}

function buildKey(request: Request, opts: MinIntervalOptions): string {
  const url = new URL(request.url);
  const ip = getClientIpFromRequest(request);
  const prefix = opts.keyPrefix || 'min-interval';
  const extra = opts.extraKey ? `|${opts.extraKey}` : '';
  return `${prefix}|${request.method}|${url.pathname}|${ip}${extra}`;
}

function tooManyRequestsResponse(retryAfterSeconds: number): Response {
  return Response.json(
    {
      error: 'too_many_requests',
      message: `Please retry after ${retryAfterSeconds}s.`,
    },
    {
      status: 429,
      headers: {
        'cache-control': 'no-store',
        'retry-after': String(retryAfterSeconds),
      },
    },
  );
}

export async function enforceMinIntervalRateLimit(
  request: Request,
  opts: MinIntervalOptions,
): Promise<Response | null> {
  const intervalMs = Math.max(0, Number(opts.intervalMs) || 0);
  const key = buildKey(request, opts);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil(opts.retryAfterSeconds ?? intervalMs / 1000),
  );

  if (opts.binding) {
    try {
      const { success } = await opts.binding.limit({ key });
      return success ? null : tooManyRequestsResponse(retryAfterSeconds);
    } catch {
      return Response.json(
        {
          error: 'rate_limit_unavailable',
          message:
            'Paid enrichment is temporarily unavailable. Please retry later.',
        },
        {
          status: 503,
          headers: {
            'cache-control': 'no-store',
            'retry-after': String(retryAfterSeconds),
          },
        },
      );
    }
  }

  if (!intervalMs) return null;
  const now = Date.now();
  const store = getStore();
  const last = store.get(key);
  if (typeof last === 'number') {
    const delta = now - last;
    if (delta >= 0 && delta < intervalMs) {
      return tooManyRequestsResponse(
        Math.max(1, Math.ceil((intervalMs - delta) / 1000)),
      );
    }
  }
  store.set(key, now);
  return null;
}
