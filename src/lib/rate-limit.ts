/**
 * Lightweight in-memory rate limiter for serverless environments.
 *
 * Uses a sliding window counter per IP. State lives in the function instance —
 * resets on cold start, which is acceptable for a gated beta. The beta gate
 * (SITE_PASSWORD cookie) is the first line of defense; this is the second.
 *
 * Usage:
 *   const { limited, remaining } = checkRateLimit(ip, "onboarding", 3, 86400000);
 *   if (limited) return NextResponse.json({ error: "..." }, { status: 429 });
 */

interface RateLimitEntry {
  timestamps: number[];
}

// In-memory store — shared across requests within a warm function instance
const store = new Map<string, RateLimitEntry>();

// Clean stale entries every 5 minutes to prevent memory leaks
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 min

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

/**
 * Check and record a request against the rate limit.
 *
 * @param ip        - Client IP (from x-forwarded-for)
 * @param endpoint  - Route identifier (e.g. "onboarding", "enrich")
 * @param limit     - Max requests per window
 * @param windowMs  - Window duration in ms (default: 24 hours)
 * @returns { limited: boolean, remaining: number }
 */
export function checkRateLimit(
  ip: string,
  endpoint: string,
  limit: number,
  windowMs: number = 24 * 60 * 60 * 1000
): { limited: boolean; remaining: number } {
  cleanup(windowMs);

  const key = `${ip}:${endpoint}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    return { limited: true, remaining: 0 };
  }

  // Record this request
  entry.timestamps.push(now);
  return { limited: false, remaining: limit - entry.timestamps.length };
}

/**
 * Extract client IP from request headers.
 * Vercel sets x-forwarded-for; falls back to x-real-ip.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
