import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/server/prisma";
import { issueAccountEntitlement } from "../lib/server/accountEntitlement";
import { claimLicense, unclaimLicense, listLicenses, autoClaimByEmail } from "../lib/server/accountLicenses";
import { hashLicenseKey, normalizeLicenseKey } from "../lib/server/crypto";

const hasDb = !!process.env.TEST_DATABASE_URL;

async function reset() {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "License", "User" RESTART IDENTITY CASCADE');
}

async function seedUser(email: string) {
  return prisma.user.create({ data: { email, passwordHash: "x", emailVerifiedAt: new Date() } });
}

async function seedLicense(opts: {
  key: string;
  email: string;
  plan?: string;
  userId?: string | null;
  expiresAt?: Date | null;
  deviceLimit?: number;
}) {
  return prisma.license.create({
    data: {
      licenseKeyHash: hashLicenseKey(normalizeLicenseKey(opts.key)),
      licenseKeyPrefix: opts.key.slice(0, 8),
      email: opts.email,
      plan: (opts.plan as never) ?? ("lifetime" as never),
      status: "active",
      deviceLimit: opts.deviceLimit ?? 3,
      userId: opts.userId ?? null,
      expiresAt: opts.expiresAt ?? null,
    },
  });
}

async function seedSession(opts: { userId: string; deviceIdHash: string; createdAt: Date }) {
  return prisma.session.create({
    data: {
      userId: opts.userId,
      tokenHash: `tok-${opts.deviceIdHash}`,
      deviceIdHash: opts.deviceIdHash,
      createdAt: opts.createdAt,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
}

describe.skipIf(!hasDb)("account entitlement + claim (integration)", () => {
  beforeEach(reset);

  it("free account issues a signed entitlement with no features", async () => {
    const u = await seedUser("free@x.com");
    const { entitlement, signature } = await issueAccountEntitlement(u.id, "dev-hash-1");
    expect(entitlement.features).toEqual([]);
    expect(entitlement.deviceIdHash).toBe("dev-hash-1");
    expect(typeof signature).toBe("string");
    expect(entitlement.notAfter).toBeTruthy();
  });

  it("claim by key then issue reflects the plan's features", async () => {
    const u = await seedUser("buyer@x.com");
    await seedLicense({ key: "VOCHI-AAAA-BBBB", email: "someone-else@x.com", plan: "lifetime" });
    await claimLicense(u.id, "VOCHI-AAAA-BBBB");
    await seedSession({ userId: u.id, deviceIdHash: "dev-hash-2", createdAt: new Date() });
    const { entitlement } = await issueAccountEntitlement(u.id, "dev-hash-2");
    expect(entitlement.features.length).toBeGreaterThan(0);
    expect((await listLicenses(u.id)).length).toBe(1);
  });

  it("auto-claim attaches a matching-email license", async () => {
    const u = await seedUser("owner@x.com");
    await seedLicense({ key: "VOCHI-CCCC-DDDD", email: "owner@x.com", plan: "lifetime" });
    const n = await autoClaimByEmail(u.id, "owner@x.com");
    expect(n).toBe(1);
    expect((await listLicenses(u.id))[0].plan).toBe("lifetime");
  });

  it("cannot claim a license already owned by another account", async () => {
    const owner = await seedUser("a@x.com");
    const other = await seedUser("b@x.com");
    await seedLicense({ key: "VOCHI-EEEE-FFFF", email: "a@x.com", userId: owner.id });
    await expect(claimLicense(other.id, "VOCHI-EEEE-FFFF")).rejects.toMatchObject({ status: 409 });
  });

  it("unclaim detaches so it can be re-claimed elsewhere", async () => {
    const owner = await seedUser("c@x.com");
    const other = await seedUser("d@x.com");
    const lic = await seedLicense({ key: "VOCHI-GGGG-HHHH", email: "c@x.com", userId: owner.id });
    await unclaimLicense(owner.id, lic.id);
    await claimLicense(other.id, "VOCHI-GGGG-HHHH"); // now succeeds
    expect((await listLicenses(other.id)).length).toBe(1);
    expect((await listLicenses(owner.id)).length).toBe(0);
  });

  it("an expired claimed license grants no features", async () => {
    const u = await seedUser("exp@x.com");
    await seedLicense({
      key: "VOCHI-IIII-JJJJ",
      email: "exp@x.com",
      plan: "one_month",
      userId: u.id,
      expiresAt: new Date(Date.now() - 1000),
    });
    await seedSession({ userId: u.id, deviceIdHash: "dev-hash-3", createdAt: new Date() });
    const { entitlement } = await issueAccountEntitlement(u.id, "dev-hash-3");
    expect(entitlement.features).toEqual([]);
  });

  it("denies entitlement to a device beyond the license's deviceLimit", async () => {
    const u = await seedUser("capped@x.com");
    await seedLicense({
      key: "VOCHI-KKKK-LLLL",
      email: "capped@x.com",
      plan: "one_month",
      userId: u.id,
      deviceLimit: 2,
    });
    await seedSession({ userId: u.id, deviceIdHash: "dev-1", createdAt: new Date(1000) });
    await seedSession({ userId: u.id, deviceIdHash: "dev-2", createdAt: new Date(2000) });
    await seedSession({ userId: u.id, deviceIdHash: "dev-3", createdAt: new Date(3000) });
    await expect(issueAccountEntitlement(u.id, "dev-3")).rejects.toMatchObject({
      status: 403,
      code: "DeviceLimitExceeded",
    });
  });

  it("still issues entitlement to a device within the license's deviceLimit", async () => {
    const u = await seedUser("within@x.com");
    await seedLicense({
      key: "VOCHI-MMMM-NNNN",
      email: "within@x.com",
      plan: "one_month",
      userId: u.id,
      deviceLimit: 2,
    });
    await seedSession({ userId: u.id, deviceIdHash: "dev-1", createdAt: new Date(1000) });
    await seedSession({ userId: u.id, deviceIdHash: "dev-2", createdAt: new Date(2000) });
    await seedSession({ userId: u.id, deviceIdHash: "dev-3", createdAt: new Date(3000) });
    const { entitlement } = await issueAccountEntitlement(u.id, "dev-1");
    expect(entitlement.features.length).toBeGreaterThan(0);
  });

  it("never restricts a free account (no active license) by device count", async () => {
    const u = await seedUser("freecap@x.com");
    await seedSession({ userId: u.id, deviceIdHash: "dev-1", createdAt: new Date(1000) });
    await seedSession({ userId: u.id, deviceIdHash: "dev-2", createdAt: new Date(2000) });
    await seedSession({ userId: u.id, deviceIdHash: "dev-3", createdAt: new Date(3000) });
    const { entitlement } = await issueAccountEntitlement(u.id, "dev-3");
    expect(entitlement.features).toEqual([]);
  });
});
