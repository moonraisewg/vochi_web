import { describe, it, expect, beforeEach, vi } from "vitest";

// Hoisted so the vi.mock factory (also hoisted) can reference it.
const { verifyIdTokenMock } = vi.hoisted(() => ({ verifyIdTokenMock: vi.fn() }));
vi.mock("google-auth-library", () => ({
  // NOTE: implementation is a regular function, not an arrow — the code under test
  // calls `new OAuth2Client()`, and arrow functions cannot be constructed with `new`
  // (vi.fn(arrow) throws "is not a constructor"). A regular function is newable.
  OAuth2Client: vi.fn(function () {
    return { verifyIdToken: verifyIdTokenMock };
  }),
}));

import { verifyGoogleIdToken } from "../lib/server/googleIdToken";

const payload = (over: Record<string, unknown> = {}) => ({
  sub: "sub-1",
  email: "a@b.com",
  email_verified: true,
  name: "Alice",
  ...over,
});

beforeEach(() => {
  verifyIdTokenMock.mockReset();
  process.env.GOOGLE_IOS_CLIENT_ID = "ios.apps.googleusercontent.com";
  process.env.GOOGLE_ANDROID_CLIENT_ID = "android.apps.googleusercontent.com";
});

describe("verifyGoogleIdToken", () => {
  it("returns identity for a valid token", async () => {
    verifyIdTokenMock.mockResolvedValue({ getPayload: () => payload() });
    const id = await verifyGoogleIdToken("tok");
    expect(id).toEqual({ sub: "sub-1", email: "a@b.com", emailVerified: true, name: "Alice" });
  });

  it("passes only the non-empty audiences to the library", async () => {
    process.env.GOOGLE_ANDROID_CLIENT_ID = "";
    verifyIdTokenMock.mockResolvedValue({ getPayload: () => payload() });
    await verifyGoogleIdToken("tok");
    expect(verifyIdTokenMock).toHaveBeenCalledWith({
      idToken: "tok",
      audience: ["ios.apps.googleusercontent.com"],
    });
  });

  it("throws oauth_misconfigured when no audiences are configured", async () => {
    process.env.GOOGLE_IOS_CLIENT_ID = "";
    process.env.GOOGLE_ANDROID_CLIENT_ID = "";
    await expect(verifyGoogleIdToken("tok")).rejects.toMatchObject({
      code: "oauth_misconfigured",
      status: 500,
    });
    expect(verifyIdTokenMock).not.toHaveBeenCalled();
  });

  it("throws oauth_exchange_failed when the library rejects the token", async () => {
    verifyIdTokenMock.mockRejectedValue(new Error("Invalid token signature"));
    await expect(verifyGoogleIdToken("tok")).rejects.toMatchObject({
      code: "oauth_exchange_failed",
      status: 400,
    });
  });

  it("throws oauth_exchange_failed when the email claim is missing", async () => {
    verifyIdTokenMock.mockResolvedValue({ getPayload: () => payload({ email: undefined }) });
    await expect(verifyGoogleIdToken("tok")).rejects.toMatchObject({
      code: "oauth_exchange_failed",
      status: 400,
    });
  });

  it("maps a missing email_verified claim to emailVerified=false", async () => {
    verifyIdTokenMock.mockResolvedValue({ getPayload: () => payload({ email_verified: undefined }) });
    const id = await verifyGoogleIdToken("tok");
    expect(id.emailVerified).toBe(false);
  });
});
