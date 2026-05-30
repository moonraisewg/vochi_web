import { ApiError } from "./http";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const result = rateLimit(key, limit, windowMs);
  if (!result.ok) {
    throw new ApiError("RateLimited", "Rate limit exceeded. Please wait and try again.", 429);
  }
  return result;
}
