import { z } from "zod";
import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";
import {
  generateLicenseKey,
  hashDeviceId,
  hashLicenseKey,
  licensePrefix,
  packKeysForFeatures,
  sealString,
  signEntitlement,
} from "./crypto";
import { expiresAtForPlan, getPlan } from "./plans";
import { serverEnv } from "./env";
import { ApiError } from "./http";

type Tx = Prisma.TransactionClient | PrismaClient;

const BULK_EMAIL = "mocchaust64@gmail.com";

export function bulkCountForOrder(email: string, plan: string): number | null {
  if (email === BULK_EMAIL && plan === "one_month") return 30;
  if (email === BULK_EMAIL && plan === "trial_7days") return 50;
  return null;
}

export function isBulkLicenseOrder(email: string, plan: string): boolean {
  return bulkCountForOrder(email, plan) !== null;
}

export const activateLicenseSchema = z.object({
  licenseKey: z.string().min(16).max(64),
  deviceId: z.string().min(12).max(128),
  deviceLabel: z.string().trim().max(512).optional(),
});

export const verifyLicenseSchema = z.object({
  licenseId: z.string().min(8),
  deviceId: z.string().min(12).max(128),
});

async function issueBulkLicensesForOrder(tx: Tx, order: {
  id: string;
  email: string;
  plan: string;
  paidAt: Date | null;
}) {
  const existing = await tx.license.findUnique({ where: { orderId: order.id } });
  if (existing) return { license: existing, licenseKey: null };

  const plan = getPlan(order.plan);
  if (!plan) throw new Error(`Unsupported plan: ${order.plan}`);
  const paidAt = order.paidAt ?? new Date();
  const expiresAt = expiresAtForPlan(plan, paidAt);

  const count = bulkCountForOrder(order.email, order.plan) ?? 1;
  let primaryLicense: Awaited<ReturnType<typeof tx.license.create>> | null = null;
  const encryptedLicenseKeys: string[] = [];

  for (let i = 0; i < count; i++) {
    const licenseKey = generateLicenseKey();
    const license = await tx.license.create({
      data: {
        orderId: i === 0 ? order.id : undefined,
        email: order.email,
        plan: plan.id,
        status: "active",
        deviceLimit: plan.deviceLimit,
        expiresAt,
        licenseKeyHash: hashLicenseKey(licenseKey),
        licenseKeyPrefix: licensePrefix(licenseKey),
        audits: {
          create: {
            actor: "system",
            action: "license.issued",
            orderId: order.id,
            metadata: { plan: plan.id, bulk: true, index: i },
          },
        },
      },
    });
    if (i === 0) primaryLicense = license;
    encryptedLicenseKeys.push(sealString(licenseKey));
  }

  await tx.emailOutbox.create({
    data: {
      dedupeKey: `batch-license-issued:${order.id}`,
      type: "batch_license_issued",
      recipient: order.email,
      orderId: order.id,
      licenseId: primaryLicense!.id,
      payload: {
        plan: plan.name,
        encryptedLicenseKeys,
        expiresAt: expiresAt?.toISOString() ?? null,
      },
    },
  });

  return { license: primaryLicense!, licenseKey: null };
}

export async function issueLicenseForOrder(tx: Tx, order: {
  id: string;
  email: string;
  plan: string;
  paidAt: Date | null;
}) {
  if (isBulkLicenseOrder(order.email, order.plan)) {
    return issueBulkLicensesForOrder(tx, order);
  }

  const existing = await tx.license.findUnique({ where: { orderId: order.id } });
  if (existing) return { license: existing, licenseKey: null };

  const plan = getPlan(order.plan);
  if (!plan) throw new Error(`Unsupported plan: ${order.plan}`);
  const paidAt = order.paidAt ?? new Date();
  const licenseKey = generateLicenseKey();

  const license = await tx.license.create({
    data: {
      orderId: order.id,
      email: order.email,
      plan: plan.id,
      status: "active",
      deviceLimit: plan.deviceLimit,
      expiresAt: expiresAtForPlan(plan, paidAt),
      licenseKeyHash: hashLicenseKey(licenseKey),
      licenseKeyPrefix: licensePrefix(licenseKey),
      audits: {
        create: {
          actor: "system",
          action: "license.issued",
          orderId: order.id,
          metadata: { plan: plan.id },
        },
      },
    },
  });

  await tx.emailOutbox.create({
    data: {
      dedupeKey: `license-issued:${license.id}`,
      type: "license_issued",
      recipient: order.email,
      orderId: order.id,
      licenseId: license.id,
      payload: {
        plan: plan.name,
        encryptedLicenseKey: sealString(licenseKey),
        expiresAt: license.expiresAt?.toISOString() ?? null,
      },
    },
  });

  return { license, licenseKey };
}

export async function createEntitlement(licenseId: string, deviceId: string) {
  const deviceIdHash = hashDeviceId(deviceId);
  const license = await prisma.license.findUnique({
    where: { id: licenseId },
    include: { activations: true },
  });
  if (!license) throw new ApiError("LicenseNotFound", "License not found", 404);
  if (license.status !== "active")
    throw new ApiError("LicenseRevoked", "License has been revoked", 403);
  if (license.expiresAt && license.expiresAt.getTime() <= Date.now())
    throw new ApiError("LicenseExpired", "License has expired", 403);
  const activation = license.activations.find((a) => a.deviceIdHash === deviceIdHash);
  if (!activation)
    throw new ApiError("DeviceNotActivated", "Device is not activated for this license", 403);

  await prisma.activation.update({
    where: { id: activation.id },
    data: { lastSeenAt: new Date() },
  });

  return signedEntitlement({
    licenseId: license.id,
    plan: license.plan,
    deviceIdHash,
    features: getPlan(license.plan)?.features ?? [],
    expiresAt: license.expiresAt?.toISOString() ?? null,
  });
}

/** Purchase email for an activated license/device pair. The client only ever has
 *  `licenseId` (never the email), so this is the one place it can be recovered —
 *  gated on proof of possession, not just knowing the id. */
export async function lookupLicenseEmail(licenseId: string, deviceId: string): Promise<string> {
  const deviceIdHash = hashDeviceId(deviceId);
  const license = await prisma.license.findUnique({
    where: { id: licenseId },
    include: { activations: true },
  });
  if (!license) throw new ApiError("LicenseNotFound", "License not found", 404);
  const activation = license.activations.find((a) => a.deviceIdHash === deviceIdHash);
  if (!activation)
    throw new ApiError("DeviceNotActivated", "Device is not activated for this license", 403);
  return license.email;
}

export async function activateLicense(input: z.infer<typeof activateLicenseSchema>) {
  const licenseKeyHash = hashLicenseKey(input.licenseKey);
  const deviceIdHash = hashDeviceId(input.deviceId);

  const license = await prisma.license.findUnique({
    where: { licenseKeyHash },
    include: { activations: true },
  });
  if (!license) throw new ApiError("LicenseNotFound", "License not found", 404);
  if (license.status !== "active")
    throw new ApiError("LicenseRevoked", "License has been revoked", 403);
  if (license.expiresAt && license.expiresAt.getTime() <= Date.now())
    throw new ApiError("LicenseExpired", "License has expired", 403);

  const existing = license.activations.find((a) => a.deviceIdHash === deviceIdHash);
  if (!existing && license.activations.length >= license.deviceLimit) {
    await prisma.auditLog.create({
      data: {
        actor: "license-api",
        action: "license.activation_limit_exceeded",
        licenseId: license.id,
        metadata: { licenseKeyPrefix: license.licenseKeyPrefix },
      },
    });
    throw new ApiError("DeviceLimitExceeded", "Device limit exceeded", 409);
  }

  await prisma.activation.upsert({
    where: { licenseId_deviceIdHash: { licenseId: license.id, deviceIdHash } },
    create: {
      licenseId: license.id,
      deviceIdHash,
      deviceLabel: input.deviceLabel,
    },
    update: {
      lastSeenAt: new Date(),
      deviceLabel: input.deviceLabel,
    },
  });

  await prisma.auditLog.create({
    data: {
      actor: "license-api",
      action: existing ? "license.verified_existing_device" : "license.activated",
      licenseId: license.id,
    },
  });

  return signedEntitlement({
    licenseId: license.id,
    plan: license.plan,
    deviceIdHash,
    features: getPlan(license.plan)?.features ?? [],
    expiresAt: license.expiresAt?.toISOString() ?? null,
  });
}

export async function signedEntitlement(base: {
  licenseId: string;
  plan: string;
  deviceIdHash: string;
  features: string[];
  expiresAt: string | null;
}) {
  const issuedAt = new Date();
  // Attach the pack content key only for pack entitlements; omitted entirely
  // otherwise so existing (Pro-only) entitlement payloads stay byte-identical.
  const packKeys = packKeysForFeatures(base.features, serverEnv().PACK_KEY_HSK_ADVANCED);
  const entitlement = {
    ...base,
    issuedAt: issuedAt.toISOString(),
    notAfter: new Date(issuedAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ...(packKeys ? { packKeys } : {}),
  };
  const { signature } = await signEntitlement(entitlement);
  return { entitlement, signature };
}
