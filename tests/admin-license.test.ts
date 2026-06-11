import { describe, expect, it } from "vitest";
import { deriveAdminToken, readJobSecret, secretsMatch } from "../lib/server/auth";
import { adminIssueLicenseSchema } from "../lib/server/licenses";

describe("admin job auth", () => {
  it("matches equal secrets in constant time", () => {
    expect(secretsMatch("super-secret-value-1234", "super-secret-value-1234")).toBe(true);
  });

  it("rejects mismatched, empty, and missing secrets", () => {
    expect(secretsMatch("wrong", "super-secret-value-1234")).toBe(false);
    expect(secretsMatch("", "super-secret-value-1234")).toBe(false);
    expect(secretsMatch(null, "super-secret-value-1234")).toBe(false);
    expect(secretsMatch(undefined, "super-secret-value-1234")).toBe(false);
    // Different length must not throw (digest equalises length before compare).
    expect(secretsMatch("short", "super-secret-value-1234")).toBe(false);
  });

  it("reads the secret from Authorization: Bearer (case-insensitive)", () => {
    const req = new Request("https://x.test", { headers: { authorization: "Bearer abc123" } });
    expect(readJobSecret(req)).toBe("abc123");
    const req2 = new Request("https://x.test", { headers: { authorization: "bearer  xyz789 " } });
    expect(readJobSecret(req2)).toBe("xyz789");
  });

  it("falls back to X-Job-Secret and returns null when absent", () => {
    const req = new Request("https://x.test", { headers: { "x-job-secret": "fallback-secret" } });
    expect(readJobSecret(req)).toBe("fallback-secret");
    expect(readJobSecret(new Request("https://x.test"))).toBeNull();
  });

  it("derives a deterministic, one-way token that is not the source secret", () => {
    const secret = "license-key-encryption-secret-32chars!!";
    const token = deriveAdminToken(secret);
    // Deterministic: same secret -> same token (so admin + server agree).
    expect(deriveAdminToken(secret)).toBe(token);
    // 64 hex chars (SHA-256) and never equal to the source secret.
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(token).not.toBe(secret);
    // Different secret -> different token.
    expect(deriveAdminToken(`${secret}x`)).not.toBe(token);
  });
});

describe("adminIssueLicenseSchema", () => {
  it("accepts a valid payload and normalises the email", () => {
    const parsed = adminIssueLicenseSchema.parse({ plan: "lifetime", email: " Admin@Example.COM " });
    expect(parsed.plan).toBe("lifetime");
    expect(parsed.email).toBe("admin@example.com");
  });

  it("accepts an optional idempotencyKey", () => {
    const parsed = adminIssueLicenseSchema.parse({
      plan: "one_month",
      email: "a@b.com",
      idempotencyKey: "retry-key-001",
    });
    expect(parsed.idempotencyKey).toBe("retry-key-001");
  });

  it("rejects unknown plans, bad emails, and too-short idempotency keys", () => {
    expect(() => adminIssueLicenseSchema.parse({ plan: "enterprise", email: "a@b.com" })).toThrow();
    expect(() => adminIssueLicenseSchema.parse({ plan: "lifetime", email: "not-an-email" })).toThrow();
    expect(() =>
      adminIssueLicenseSchema.parse({ plan: "lifetime", email: "a@b.com", idempotencyKey: "short" }),
    ).toThrow();
  });
});
