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
