import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/server/prisma";
import { resetAuthTables } from "./helpers/db";
import { linkOrCreateAccountByVerifiedEmail } from "../lib/server/auth";

const hasDb = !!process.env.TEST_DATABASE_URL;

describe.skipIf(!hasDb)("linkOrCreateAccountByVerifiedEmail", () => {
  beforeEach(async () => { await resetAuthTables(); });
  const g = (over = {}) => ({ provider: "google" as const, providerAccountId: "sub-1", email: "a@b.com", name: "Alice", ...over });

  it("creates a new verified user with no password", async () => {
    const u = await linkOrCreateAccountByVerifiedEmail(g());
    expect(u.email).toBe("a@b.com");
    expect(u.passwordHash).toBeNull();
    expect(u.emailVerifiedAt).not.toBeNull();
    const link = await prisma.oAuthAccount.findFirst({ where: { userId: u.id } });
    expect(link?.providerAccountId).toBe("sub-1");
  });

  it("returns the same user when the oauth link already exists (matched by sub, not email)", async () => {
    const first = await linkOrCreateAccountByVerifiedEmail(g());
    const again = await linkOrCreateAccountByVerifiedEmail(g({ email: "changed@b.com" }));
    expect(again.id).toBe(first.id);
  });

  it("links to an existing VERIFIED password user, keeping their password", async () => {
    const existing = await prisma.user.create({
      data: { email: "v@b.com", passwordHash: "hash", emailVerifiedAt: new Date() },
    });
    const u = await linkOrCreateAccountByVerifiedEmail(g({ email: "v@b.com" }));
    expect(u.id).toBe(existing.id);
    expect(u.passwordHash).toBe("hash");
  });

  it("links to an UNVERIFIED user, nulling password + verifying", async () => {
    await prisma.user.create({ data: { email: "u@b.com", passwordHash: "hash", emailVerifiedAt: null } });
    const u = await linkOrCreateAccountByVerifiedEmail(g({ email: "u@b.com" }));
    expect(u.passwordHash).toBeNull();
    expect(u.emailVerifiedAt).not.toBeNull();
  });
});
