import { prisma } from "./prisma";
import { ApiError } from "./http";

const LOCKOUT_THRESHOLD = 10; // consecutive failed logins
const LOCKOUT_MS = 15 * 60 * 1000; // 15 min temporary lock

/** Cross-instance rate limit backed by Postgres. Throws 429 when the bucket is exhausted. */
export async function assertAuthThrottle(key: string, limit: number, windowMs: number): Promise<void> {
  const now = new Date();
  const existing = await prisma.authThrottle.findUnique({ where: { key } });
  if (!existing || existing.resetAt <= now) {
    const resetAt = new Date(now.getTime() + windowMs);
    await prisma.authThrottle.upsert({
      where: { key },
      create: { key, count: 1, resetAt },
      update: { count: 1, resetAt },
    });
    return;
  }
  const updated = await prisma.authThrottle.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  if (updated.count > limit) {
    throw new ApiError("RateLimited", "Bạn thao tác quá nhanh. Vui lòng thử lại sau.", 429);
  }
}

/** Throw if the account is currently locked out. */
export function assertNotLocked(user: { lockedUntil: Date | null }): void {
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new ApiError("AccountLocked", "Tài khoản tạm khoá do đăng nhập sai nhiều lần. Thử lại sau.", 429);
  }
}

/** Increment the failure counter; lock the account after the threshold. */
export async function recordLoginFailure(userId: string): Promise<void> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { failedLoginCount: { increment: 1 } },
  });
  if (user.failedLoginCount >= LOCKOUT_THRESHOLD) {
    await prisma.user.update({
      where: { id: userId },
      data: { lockedUntil: new Date(Date.now() + LOCKOUT_MS), failedLoginCount: 0 },
    });
  }
}

/** Reset failure state after a successful login. */
export async function clearLoginFailures(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { failedLoginCount: 0, lockedUntil: null } });
}
