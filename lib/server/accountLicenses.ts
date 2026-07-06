import { prisma } from "./prisma";
import { ApiError } from "./http";
import { hashLicenseKey, normalizeLicenseKey } from "./crypto";

/** Attach every unclaimed, active license whose purchase email matches the (verified)
 *  account email. Returns how many were attached. Safe to call repeatedly (idempotent). */
export async function autoClaimByEmail(userId: string, email: string): Promise<number> {
  const res = await prisma.license.updateMany({
    where: { email, userId: null, status: "active" },
    data: { userId },
  });
  return res.count;
}

export interface BackfillCandidate {
  userId: string;
  email: string;
  licenseCount: number;
}

/** Accounts (verified, active) whose email matches an active, unclaimed license that
 *  has at least one real device Activation — people currently depending on the old
 *  key-activation flow who'd otherwise need to re-enter their key by hand once the
 *  accounts cutover removes it. Read-only. */
export async function findBackfillCandidates(): Promise<BackfillCandidate[]> {
  const activatedLicenses = await prisma.license.findMany({
    where: { status: "active", userId: null, activations: { some: {} } },
    select: { email: true },
    distinct: ["email"],
  });
  const emails = activatedLicenses.map((l) => l.email);
  if (emails.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { email: { in: emails }, emailVerifiedAt: { not: null }, status: "active" },
    select: { id: true, email: true },
  });

  const candidates: BackfillCandidate[] = [];
  for (const user of users) {
    const licenseCount = await prisma.license.count({
      where: { email: user.email, status: "active", userId: null },
    });
    candidates.push({ userId: user.id, email: user.email, licenseCount });
  }
  return candidates;
}

/** Runs the existing autoClaimByEmail for every candidate — attaches ALL of that
 *  email's active+unclaimed licenses, not just Activation-backed ones (the
 *  Activation filter in findBackfillCandidates only decides who gets processed).
 *  Idempotent: safe to re-run. */
export async function runBackfillAutoClaim(
  candidates: BackfillCandidate[],
): Promise<{ userId: string; email: string; attached: number }[]> {
  const results: { userId: string; email: string; attached: number }[] = [];
  for (const c of candidates) {
    const attached = await autoClaimByEmail(c.userId, c.email);
    results.push({ userId: c.userId, email: c.email, attached });
  }
  return results;
}

/** Manually attach a license by key (email-independent). Idempotent for the same owner. */
export async function claimLicense(userId: string, licenseKey: string): Promise<void> {
  const licenseKeyHash = hashLicenseKey(normalizeLicenseKey(licenseKey));
  const license = await prisma.license.findUnique({ where: { licenseKeyHash } });
  if (!license) throw new ApiError("LicenseNotFound", "License not found", 404);
  if (license.status !== "active") throw new ApiError("LicenseRevoked", "License has been revoked", 403);
  if (license.userId && license.userId !== userId)
    throw new ApiError("AlreadyClaimed", "License is already linked to another account", 409);
  if (license.userId === userId) return; // idempotent
  await prisma.license.update({ where: { id: license.id }, data: { userId } });
}

/** Detach a license from the caller's account (to transfer it elsewhere). */
export async function unclaimLicense(userId: string, licenseId: string): Promise<void> {
  const license = await prisma.license.findUnique({ where: { id: licenseId } });
  if (!license || license.userId !== userId)
    throw new ApiError("LicenseNotFound", "License not found", 404);
  await prisma.license.update({ where: { id: licenseId }, data: { userId: null } });
}

/** Licenses linked to the account (safe projection — no key material). */
export async function listLicenses(userId: string) {
  const rows = await prisma.license.findMany({
    where: { userId },
    select: { id: true, licenseKeyPrefix: true, plan: true, status: true, expiresAt: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((l) => ({
    id: l.id,
    licenseKeyPrefix: l.licenseKeyPrefix,
    plan: l.plan,
    status: l.status,
    expiresAt: l.expiresAt?.toISOString() ?? null,
  }));
}
