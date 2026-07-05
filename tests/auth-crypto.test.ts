import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, generateToken, hashToken } from "../lib/server/authCrypto";

describe("password hashing", () => {
  it("verifies a correct password", async () => {
    const stored = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", stored)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const stored = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("wrong password", stored)).toBe(false);
  });

  it("produces a different hash each time (random salt)", async () => {
    expect(await hashPassword("same")).not.toBe(await hashPassword("same"));
  });

  it("never stores the plaintext", async () => {
    const stored = await hashPassword("s3cr3t-plaintext");
    expect(stored.includes("s3cr3t-plaintext")).toBe(false);
  });

  it("returns false on a malformed stored value instead of throwing", async () => {
    expect(await verifyPassword("x", "not-a-valid-hash")).toBe(false);
  });
});

describe("token helpers", () => {
  it("generates URL-safe tokens with enough entropy", () => {
    const t = generateToken();
    expect(t).toMatch(/^[A-Za-z0-9_-]{40,}$/);
    expect(generateToken()).not.toBe(t);
  });

  it("hashes a token deterministically to hex", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });
});
