import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRateLimiter() {
  if (ratelimit) return ratelimit;

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "gourmetquest",
    });
    return ratelimit;
  }

  return null;
}

export async function checkRateLimit(userId: string): Promise<{
  success: boolean;
  remaining: number;
}> {
  const limiter = getRateLimiter();

  if (!limiter) {
    // No rate limiter configured (dev mode) — allow all
    return { success: true, remaining: 999 };
  }

  const result = await limiter.limit(userId);
  return { success: result.success, remaining: result.remaining };
}
