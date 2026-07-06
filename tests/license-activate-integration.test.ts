import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/server/prisma";
import { activateLicense } from "../lib/server/licenses";
import { hashLicenseKey, normalizeLicenseKey } from "../lib/server/crypto";

const hasDb = !!process.env.TEST_DATABASE_URL;

async function reset() {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "License", "User" RESTART IDENTITY CASCADE');
}

async function seedUser(email: string) {
  return prisma.user.create({ data: { email, passwordHash: "x", emailVerifiedAt: new Date() } });
}

async function seedLicense(opts: { key: string; email: string; userId?: string | null }) {
  return prisma.license.create({
    data: {
      licenseKeyHash: hashLicenseKey(normalizeLicenseKey(opts.key)),
      licenseKeyPrefix: opts.key.slice(0, 8),
      email: opts.email,
      plan: "lifetime" as never,
      status: "active",
      deviceLimit: 5,
      userId: opts.userId ?? null,
    },
  });
}

describe.skipIf(!hasDb)("activateLicense (integration)", () => {
  beforeEach(reset);

  it("still activates an unclaimed license (regression guard)", async () => {
    await seedLicense({ key: "VOCHI-ACTV-AAAA", email: "buyer@x.com" });
    const { entitlement } = await activateLicense({
      licenseKey: "VOCHI-ACTV-AAAA",
      deviceId: "device-raw-1",
    });
    expect(entitlement.plan).toBe("lifetime");
  });

  it("rejects activation once the license has been claimed by an account", async () => {
    const u = await seedUser("buyer2@x.com");
    await seedLicense({ key: "VOCHI-ACTV-BBBB", email: "buyer2@x.com", userId: u.id });
    await expect(
      activateLicense({ licenseKey: "VOCHI-ACTV-BBBB", deviceId: "device-raw-2" }),
    ).rejects.toMatchObject({ status: 403, code: "LicenseClaimed" });
  });
});
