import { describe, it, expect, beforeEach, vi } from "vitest";
vi.mock("../lib/server/googleOAuth", () => ({ exchangeCodeForGoogleIdentity: vi.fn() }));
import { prisma } from "../lib/server/prisma";
import { resetAuthTables } from "./helpers/db";
import { linkOrCreateAccountByVerifiedEmail, oauthLogin } from "../lib/server/auth";
import { exchangeCodeForGoogleIdentity } from "../lib/server/googleOAuth";

const asMock = exchangeCodeForGoogleIdentity as unknown as ReturnType<typeof vi.fn>;

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

describe.skipIf(!hasDb)("oauthLogin", () => {
  beforeEach(async () => { await resetAuthTables(); vi.clearAllMocks(); });
  const body = (over = {}) => ({ code: "c", codeVerifier: "v", redirectUri: "http://127.0.0.1:1/callback", deviceIdHash: "dev-1", ...over });

  it("issues a session + returns email for a verified identity", async () => {
    asMock.mockResolvedValue({ sub: "s1", email: "new@x.com", emailVerified: true, name: "N" });
    const r = await oauthLogin(body());
    expect(r.ok).toBe(true);
    if (r.ok) { expect(typeof r.sessionToken).toBe("string"); expect(r.email).toBe("new@x.com"); }
  });

  it("rejects an unverified google email", async () => {
    asMock.mockResolvedValue({ sub: "s2", email: "u@x.com", emailVerified: false, name: null });
    await expect(oauthLogin(body())).rejects.toMatchObject({ code: "oauth_email_unverified" });
  });

  it("enforces the device cap (free tier = 2)", async () => {
    asMock.mockResolvedValue({ sub: "s3", email: "cap@x.com", emailVerified: true, name: null });
    await oauthLogin(body({ deviceIdHash: "d1" }));
    await oauthLogin(body({ deviceIdHash: "d2" }));
    const r = await oauthLogin(body({ deviceIdHash: "d3" }));
    expect(r).toEqual({ ok: false, code: "device_limit" });
  });
});
