/**
 * Edge request guards: best-effort IP rate limiting + cross-site request rejection.
 *
 * Rate limiting is in-memory and therefore PER WORKER INSTANCE. It slows down
 * brute-force and scraping from a single client but is not a durable global
 * quota — serverless instances recycle and requests fan out across them.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

export type RateRule = {
  /** Path prefix this rule applies to. */
  prefix: string;
  /** Max requests allowed inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

/** Tightest rules first — the first matching prefix wins. */
export const RATE_RULES: RateRule[] = [
  // Auth-adjacent + password reset: brute-force surface.
  { prefix: "/api/public/auth", limit: 10, windowMs: 60_000 },
  // Server functions (AI calls, feedback, password reset, admin actions).
  { prefix: "/_serverFn", limit: 60, windowMs: 60_000 },
  // Any other HTTP API surface.
  { prefix: "/api/", limit: 90, windowMs: 60_000 },
];

function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function matchRule(pathname: string): RateRule | undefined {
  return RATE_RULES.find((r) => pathname.startsWith(r.prefix));
}

function sweep(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size >= MAX_BUCKETS) buckets.clear();
}

/**
 * Returns a 429 Response when the caller exceeded its quota, otherwise null.
 */
export function rateLimit(request: Request): Response | null {
  const url = new URL(request.url);
  const rule = matchRule(url.pathname);
  if (!rule) return null;

  const now = Date.now();
  sweep(now);

  const key = `${rule.prefix}|${clientIp(request)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + rule.windowMs });
    return null;
  }

  bucket.count += 1;
  if (bucket.count <= rule.limit) return null;

  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  return new Response(
    JSON.stringify({ error: "Too many requests. Please slow down and try again shortly." }),
    {
      status: 429,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "retry-after": String(retryAfter),
        "x-ratelimit-limit": String(rule.limit),
        "x-ratelimit-remaining": "0",
        "cache-control": "no-store",
      },
    },
  );
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * CSRF defense-in-depth: state-changing requests to internal endpoints must be
 * same-origin. Cross-site form posts and third-party fetches get a 403.
 * `/api/public/*` is exempt — those are designed for external callers and
 * authenticate via signatures/bearer tokens inside their handlers.
 */
export function rejectCrossSiteWrite(request: Request): Response | null {
  if (SAFE_METHODS.has(request.method)) return null;

  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/public/")) return null;

  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    return forbidden();
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== url.origin) return forbidden();
    } catch {
      return forbidden();
    }
  }

  return null;
}

function forbidden(): Response {
  return new Response(JSON.stringify({ error: "Cross-site request blocked." }), {
    status: 403,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
