import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../lib/server/googleIdToken", () => ({ verifyGoogleIdToken: vi.fn() }));

import { prisma } from "../lib/server/prisma";
import { resetAuthTables } from "./helpers/db";
import { finishOAuthLogin } from "../lib/server/auth";
import type { GoogleIdentity } from "../lib/server/googleOAuth";

const hasDb = !!process.env.TEST_DATABASE_URL;
const identity = (over: Partial<GoogleIdentity> = {}): GoogleIdentity => ({
  sub: "sub-1",
  email: "a@b.com",
  emailVerified: true,
  name: "Alice",
  ...over,
});

describe.skipIf(!hasDb)("finishOAuthLogin", () => {
  beforeEach(async () => {
    await resetAuthTables();
  });

  it("creates a new account and issues a session", async () => {
    const r = await finishOAuthLogin(identity(), "device-hash-aaaa", "iPhone");
    expect(r).toMatchObject({ ok: true, email: "a@b.com" });
    if (r.ok) expect(r.sessionToken.length).toBeGreaterThan(0);
    const u = await prisma.user.findUnique({ where: { email: "a@b.com" } });
    expect(u?.passwordHash).toBeNull();
  });

  it("merges into the existing account by sub (no duplicate user)", async () => {
    await finishOAuthLogin(identity(), "device-hash-aaaa", "iPhone");
    await finishOAuthLogin(identity({ email: "changed@b.com" }), "device-hash-bbbb", "iPad");
    const count = await prisma.user.count();
    expect(count).toBe(1);
  });

  it("rejects an unverified email", async () => {
    await expect(
      finishOAuthLogin(identity({ emailVerified: false }), "device-hash-aaaa", null),
    ).rejects.toMatchObject({ code: "oauth_email_unverified", status: 400 });
  });
});
