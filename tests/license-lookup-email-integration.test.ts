import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/server/prisma";
import { lookupLicenseEmail } from "../lib/server/licenses";
import { hashLicenseKey, normalizeLicenseKey, hashDeviceId } from "../lib/server/crypto";

const hasDb = !!process.env.TEST_DATABASE_URL;

async function reset() {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "License" RESTART IDENTITY CASCADE');
}

async function seedLicense(opts: { key: string; email: string }) {
  return prisma.license.create({
    data: {
      licenseKeyHash: hashLicenseKey(normalizeLicenseKey(opts.key)),
      licenseKeyPrefix: opts.key.slice(0, 8),
      email: opts.email,
      plan: "lifetime" as never,
      status: "active",
      deviceLimit: 3,
    },
  });
}

describe.skipIf(!hasDb)("lookupLicenseEmail (integration)", () => {
  beforeEach(reset);

  it("returns the purchase email for a device with a real Activation", async () => {
    const lic = await seedLicense({ key: "VOCHI-LKEM-AAAA", email: "buyer@x.com" });
    await prisma.activation.create({
      data: { licenseId: lic.id, deviceIdHash: hashDeviceId("device-raw-1") },
    });
    const email = await lookupLicenseEmail(lic.id, "device-raw-1");
    expect(email).toBe("buyer@x.com");
  });

  it("rejects a device with no Activation on that license", async () => {
    const lic = await seedLicense({ key: "VOCHI-LKEM-BBBB", email: "buyer2@x.com" });
    await expect(lookupLicenseEmail(lic.id, "some-other-device")).rejects.toMatchObject({
      status: 403,
      code: "DeviceNotActivated",
    });
  });

  it("rejects an unknown licenseId", async () => {
    await expect(lookupLicenseEmail("nonexistent-id", "device-raw-1")).rejects.toMatchObject({
      status: 404,
      code: "LicenseNotFound",
    });
  });
});
