import { prisma } from "./prisma";
import { getPlan } from "./plans";
import { signedEntitlement } from "./licenses";
import { deviceLimitFor, selectEntitledDevices } from "./authPolicy";
import { audit } from "./authAudit";
import { ApiError } from "./http";

export interface ClaimedLicense {
  id: string;
  plan: string;
  expiresAt: Date | null;
}

export interface ReferralPremium {
  until: Date | null;
  features: string[];
}

export interface EffectiveEntitlement {
  licenseId: string;
  plan: string;
  features: string[];
  expiresAt: string | null;
}

/**
 * Pure: fold an account's active licenses (+ optional referral premium) into one
 * effective entitlement. Lifetime (null expiry) means never-expires and wins over any
 * timed expiry. Referral premium contributes its features + expiry only while unexpired.
 */
export function computeEffectiveEntitlement(
  userId: string,
  licenses: ClaimedLicense[],
  referral: ReferralPremium,
  planFeatures: (plan: string) => string[],
  now: Date,
): EffectiveEntitlement {
  const active = licenses.filter((l) => l.expiresAt == null || l.expiresAt.getTime() > now.getTime());
  const referralActive = referral.until != null && referral.until.getTime() > now.getTime();

  const features = Array.from(
    new Set([
      ...active.flatMap((l) => planFeatures(l.plan)),
      ...(referralActive ? referral.features : []),
    ]),
  );

  const hasLifetime = active.some((l) => l.expiresAt == null);
  let expiresAt: string | null = null;
  if (!hasLifetime) {
    const dates: Date[] = [
      ...active.map((l) => l.expiresAt as Date),
      ...(referralActive ? [referral.until as Date] : []),
    ];
    const max = dates.reduce<Date | null>((m, d) => (!m || d > m ? d : m), null);
    expiresAt = max ? max.toISOString() : null;
  }

  const primary = active[0];
  const licenseId = primary?.id ?? `account:${userId}`;
  const plan = primary?.plan ?? (referralActive ? "referral" : "free");

  return { licenseId, plan, features, expiresAt };
}

/**
 * Compute + sign the account's entitlement for one device. Bound to `deviceIdHash`
 * (which the caller must take from the authenticated session, NOT from the request body,
 * so a user cannot mint entitlements for arbitrary devices). Referral premium is null
 * here; Phase 4 supplies it.
 */
export async function issueAccountEntitlement(userId: string, deviceIdHash: string) {
  const licenses = await prisma.license.findMany({
    where: { userId, status: "active" },
    select: { id: true, plan: true, expiresAt: true, deviceLimit: true },
  });

  if (licenses.length > 0) {
    const limit = deviceLimitFor(licenses);
    const liveSessions = await prisma.session.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      select: { deviceIdHash: true, createdAt: true },
    });
    if (!selectEntitledDevices(liveSessions, limit).has(deviceIdHash)) {
      await audit("entitlement_device_limit_hit", { userId });
      throw new ApiError(
        "DeviceLimitExceeded",
        "Thiết bị này vượt quá giới hạn số máy của gói hiện tại.",
        403,
      );
    }
  }

  const effective = computeEffectiveEntitlement(
    userId,
    licenses,
    { until: null, features: [] }, // Phase 4: real referral premium
    (plan) => getPlan(plan)?.features ?? [],
    new Date(),
  );
  // Reuses the exact signer (notAfter=+7d, packKeys, Ed25519 signature).
  return signedEntitlement({
    licenseId: effective.licenseId,
    plan: effective.plan,
    deviceIdHash,
    features: effective.features,
    expiresAt: effective.expiresAt,
  });
}
