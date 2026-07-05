import { prisma } from "./prisma";
import { ApiError } from "./http";
import { appUrl } from "./env";
import { hashPassword, verifyPassword, generateToken, hashToken } from "./authCrypto";
import { decideDeviceAdmission } from "./authPolicy";
import type { RegisterInput, LoginInput } from "./authPolicy";
import { enqueueVerifyEmail, enqueueResetPassword } from "./authEmail";
import { assertNotLocked, recordLoginFailure, clearLoginFailures } from "./authThrottle";

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TTL_MS = 60 * 60 * 1000; // 1h
const SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90d

function futureDate(ms: number) {
  return new Date(Date.now() + ms);
}

// Cached dummy argon2 hash: login always runs a verify (real or dummy) so response
// time does not reveal whether an email is registered (anti-enumeration).
let dummyHashPromise: Promise<string> | null = null;
function dummyHash(): Promise<string> {
  if (!dummyHashPromise) dummyHashPromise = hashPassword("timing-safe-dummy-password");
  return dummyHashPromise;
}

/** Create (or no-op for an existing email) an unverified user and enqueue a verify email.
 *  Always resolves the same way so callers cannot enumerate accounts. */
export async function register(input: RegisterInput): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    if (!existing.emailVerifiedAt) {
      await issueVerifyToken(existing.id, existing.email);
    }
    return; // verified accounts: silently do nothing (no enumeration)
  }
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash: await hashPassword(input.password) },
  });
  await issueVerifyToken(user.id, user.email);
}

async function issueVerifyToken(userId: string, email: string): Promise<void> {
  const token = generateToken();
  await prisma.authToken.create({
    data: {
      userId,
      purpose: "email_verify",
      tokenHash: hashToken(token),
      expiresAt: futureDate(VERIFY_TTL_MS),
    },
  });
  await enqueueVerifyEmail(email, appUrl(`/verify-email?token=${token}`), token);
}

/** Consume a verify token and mark the user's email verified. */
export async function verifyEmail(token: string): Promise<void> {
  const row = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!row || row.purpose !== "email_verify" || row.consumedAt || row.expiresAt < new Date()) {
    throw new ApiError("InvalidToken", "Liên kết xác nhận không hợp lệ hoặc đã hết hạn.", 400);
  }
  await prisma.$transaction([
    prisma.authToken.update({ where: { id: row.id }, data: { consumedAt: new Date() } }),
    prisma.user.update({ where: { id: row.userId }, data: { emailVerifiedAt: new Date() } }),
  ]);
}

export type LoginResult =
  | { ok: true; sessionToken: string }
  | { ok: false; code: "device_limit" };

/** Authenticate, enforce the device cap, and mint a session token (returned once). */
export async function login(input: LoginInput): Promise<LoginResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (user) assertNotLocked(user);

  // Always run an argon2 verify — dummy hash when the user is missing — so timing does
  // not leak whether the email exists. Uniform 401 hides which factor was wrong.
  const passwordOk = await verifyPassword(input.password, user?.passwordHash ?? (await dummyHash()));
  if (!user || user.status !== "active" || !passwordOk) {
    if (user) await recordLoginFailure(user.id);
    throw new ApiError("InvalidCredentials", "Email hoặc mật khẩu không đúng.", 401);
  }
  if (!user.emailVerifiedAt) {
    throw new ApiError("EmailUnverified", "Vui lòng xác nhận email trước khi đăng nhập.", 403);
  }

  const live = await prisma.session.findMany({
    where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
    select: { deviceIdHash: true },
  });
  if (decideDeviceAdmission(live, input.deviceIdHash) === "reject") {
    return { ok: false, code: "device_limit" };
  }

  const token = generateToken();
  const data = {
    userId: user.id,
    tokenHash: hashToken(token),
    deviceIdHash: input.deviceIdHash,
    deviceName: input.deviceName ?? null,
    expiresAt: futureDate(SESSION_TTL_MS),
    revokedAt: null,
    lastSeenAt: new Date(),
  };
  await prisma.session.upsert({
    where: { userId_deviceIdHash: { userId: user.id, deviceIdHash: input.deviceIdHash } },
    create: data,
    update: data, // new token + reset expiry/revoked for this device
  });
  await clearLoginFailures(user.id);
  return { ok: true, sessionToken: token };
}

/** Resolve a bearer token to a live session's user, or throw 401. Also bumps lastSeenAt. */
export async function requireSession(bearer: string | null) {
  const token = (bearer ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new ApiError("Unauthorized", "Thiếu phiên đăng nhập.", 401);
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    throw new ApiError("Unauthorized", "Phiên đăng nhập không hợp lệ.", 401);
  }
  await prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
  return session;
}

/** Revoke the caller's own session. */
export async function logout(bearer: string | null): Promise<void> {
  const session = await requireSession(bearer);
  await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
}

/** Start password reset. Always resolves the same way (no enumeration). */
export async function forgotPassword(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== "active") return;
  const token = generateToken();
  await prisma.authToken.create({
    data: {
      userId: user.id,
      purpose: "password_reset",
      tokenHash: hashToken(token),
      expiresAt: futureDate(RESET_TTL_MS),
    },
  });
  await enqueueResetPassword(user.email, appUrl(`/reset-password?token=${token}`), token);
}

/** Consume a reset token, set the new password, and revoke all of that user's sessions. */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const row = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!row || row.purpose !== "password_reset" || row.consumedAt || row.expiresAt < new Date()) {
    throw new ApiError("InvalidToken", "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.", 400);
  }
  const newHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.authToken.update({ where: { id: row.id }, data: { consumedAt: new Date() } }),
    prisma.user.update({ where: { id: row.userId }, data: { passwordHash: newHash } }),
    prisma.session.updateMany({
      where: { userId: row.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
}

export type DeviceView = {
  id: string;
  deviceName: string | null;
  lastSeenAt: string;
  current: boolean;
};

/** The account summary + live device list for the account screen. */
export async function getMe(bearer: string | null) {
  const session = await requireSession(bearer);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } });
  const devices = await listDevices(bearer);
  return {
    user: { id: user.id, email: user.email, emailVerified: !!user.emailVerifiedAt },
    devices,
  };
}

/** Live sessions as device rows for the current account. */
export async function listDevices(bearer: string | null): Promise<DeviceView[]> {
  const session = await requireSession(bearer);
  const rows = await prisma.session.findMany({
    where: { userId: session.userId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { lastSeenAt: "desc" },
    select: { id: true, deviceName: true, lastSeenAt: true },
  });
  return rows.map((r) => ({
    id: r.id,
    deviceName: r.deviceName,
    lastSeenAt: r.lastSeenAt.toISOString(),
    current: r.id === session.id,
  }));
}

/** Remotely revoke one of the caller's own sessions by session id. */
export async function logoutDevice(bearer: string | null, sessionId: string): Promise<void> {
  const session = await requireSession(bearer);
  const target = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!target || target.userId !== session.userId) {
    throw new ApiError("NotFound", "Không tìm thấy thiết bị.", 404);
  }
  await prisma.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
}
