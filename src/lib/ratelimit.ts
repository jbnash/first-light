import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Fail-open if Upstash isn't configured (local dev, preview deploys without env).
// Vercel's Upstash integration injects vars under an UPSTASH_REDIS_KV_* prefix
// (the "UPSTASH_REDIS" custom prefix set when connecting the database, stacked
// on Upstash's own KV_* suffixes). Fall back to the canonical names so a
// hand-set .env still works locally.
const url =
  process.env.UPSTASH_REDIS_KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.UPSTASH_REDIS_KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const ratelimit = url && token
  ? new Ratelimit({
      redis: new Redis({ url, token }),
      // 10 analyses per IP per hour. Tune as traffic shape becomes clear.
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "firstlight:analyze",
    })
  : null;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!ratelimit) {
    // No store configured — allow all traffic but log once per process so
    // production misconfiguration is visible.
    if (!hasWarned) {
      console.warn("[ratelimit] Upstash env vars not set; allowing all requests.");
      hasWarned = true;
    }
    return { success: true, limit: Infinity, remaining: Infinity, reset: 0 };
  }
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
  return { success, limit, remaining, reset };
}

let hasWarned = false;
