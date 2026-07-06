import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/server/prisma";
import { resetAuthTables } from "./helpers/db";
import { login, register, getMe, updateProfile } from "../lib/server/auth";

// Guard: these only run when a disposable test DB is configured, so `pnpm test`
// (no DB) still passes. Run with:
//   TEST_DATABASE_URL=... DATABASE_URL=$TEST_DATABASE_URL pnpm test:int
const hasDb = !!process.env.TEST_DATABASE_URL;

describe.skipIf(!hasDb)("auth integration", () => {
  beforeEach(async () => {
    await resetAuthTables();
  });

  // The plaintext verify token isn't persisted, so tests mark the account verified
  // directly (the real token path is covered by the manual smoke test).
  async function seedVerified(email: string, passwordHash: string) {
    return prisma.user.create({
      data: { email, passwordHash, emailVerifiedAt: new Date() },
    });
  }

  it("logs in after verification and caps at 2 devices", async () => {
    // Reuse the real hasher so login's verify passes.
    const { hashPassword } = await import("../lib/server/authCrypto");
    await seedVerified("a@b.com", await hashPassword("longenough1"));

    const r1 = await login({ email: "a@b.com", password: "longenough1", deviceIdHash: "dev-1x" });
    const r2 = await login({ email: "a@b.com", password: "longenough1", deviceIdHash: "dev-2x" });
    const r3 = await login({ email: "a@b.com", password: "longenough1", deviceIdHash: "dev-3x" });
    expect(r1.ok && r2.ok).toBe(true);
    expect(r3).toEqual({ ok: false, code: "device_limit" });
  });

  it("frees a slot after a session is revoked", async () => {
    const { hashPassword } = await import("../lib/server/authCrypto");
    const user = await seedVerified("c@d.com", await hashPassword("longenough1"));
    await login({ email: "c@d.com", password: "longenough1", deviceIdHash: "dev-1y" });
    await login({ email: "c@d.com", password: "longenough1", deviceIdHash: "dev-2y" });
    await prisma.session.updateMany({
      where: { userId: user.id, deviceIdHash: "dev-2y" },
      data: { revokedAt: new Date() },
    });
    const r3 = await login({ email: "c@d.com", password: "longenough1", deviceIdHash: "dev-3y" });
    expect(r3.ok).toBe(true);
  });

  it("rejects a wrong password with a 401", async () => {
    const { hashPassword } = await import("../lib/server/authCrypto");
    await seedVerified("e@f.com", await hashPassword("longenough1"));
    await expect(
      login({ email: "e@f.com", password: "wrong-password", deviceIdHash: "dev-1z" }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it("rejects an unverified account with a 403", async () => {
    const { hashPassword } = await import("../lib/server/authCrypto");
    await prisma.user.create({
      data: { email: "unv@f.com", passwordHash: await hashPassword("longenough1") },
    });
    await expect(
      login({ email: "unv@f.com", password: "longenough1", deviceIdHash: "dev-u1" }),
    ).rejects.toMatchObject({ status: 403 });
  });

  it("persists name and age on a new registration", async () => {
    await register({ email: "g@h.com", password: "longenough1", name: "Moon", age: 25 });
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "g@h.com" } });
    expect(user.name).toBe("Moon");
    expect(user.age).toBe(25);
  });

  it("updates name/age when an unverified account re-registers", async () => {
    await register({ email: "i@j.com", password: "longenough1", name: "Moon", age: 25 });
    await register({ email: "i@j.com", password: "longenough1", name: "Sun", age: 30 });
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "i@j.com" } });
    expect(user.name).toBe("Sun");
    expect(user.age).toBe(30);
  });

  it("does not touch name/age for an already-verified account", async () => {
    const { hashPassword } = await import("../lib/server/authCrypto");
    await seedVerified("k@l.com", await hashPassword("longenough1"));
    await prisma.user.update({ where: { email: "k@l.com" }, data: { name: "Original", age: 40 } });
    await register({ email: "k@l.com", password: "longenough1", name: "Attacker", age: 99 });
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "k@l.com" } });
    expect(user.name).toBe("Original");
    expect(user.age).toBe(40);
  });

  it("updateProfile persists new name/age and getMe reflects them", async () => {
    await register({ email: "m@n.com", password: "longenough1", name: "Moon", age: 25 });
    await prisma.user.update({ where: { email: "m@n.com" }, data: { emailVerifiedAt: new Date() } });
    const loginResult = await login({
      email: "m@n.com",
      password: "longenough1",
      deviceIdHash: "dev-profile",
    });
    if (!loginResult.ok) throw new Error("expected login to succeed");
    await updateProfile(loginResult.sessionToken, { name: "Moon Updated", age: 26 });
    const me = await getMe(`Bearer ${loginResult.sessionToken}`);
    expect(me.user.name).toBe("Moon Updated");
    expect(me.user.age).toBe(26);
  });
});
