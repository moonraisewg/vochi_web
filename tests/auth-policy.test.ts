import { describe, it, expect } from "vitest";
import {
  normalizeEmail,
  registerSchema,
  loginSchema,
  decideDeviceAdmission,
  DEVICE_CAP,
} from "../lib/server/authPolicy";

describe("normalizeEmail", () => {
  it("lowercases and trims", () => {
    expect(normalizeEmail("  Foo@Bar.COM ")).toBe("foo@bar.com");
  });
});

describe("registerSchema", () => {
  it("accepts a valid email + password and normalizes the email", () => {
    const out = registerSchema.parse({ email: " A@B.com ", password: "longenough1" });
    expect(out.email).toBe("a@b.com");
  });
  it("rejects a short password", () => {
    expect(() => registerSchema.parse({ email: "a@b.com", password: "short" })).toThrow();
  });
  it("rejects a non-email", () => {
    expect(() => registerSchema.parse({ email: "nope", password: "longenough1" })).toThrow();
  });
});

describe("loginSchema", () => {
  it("requires a deviceIdHash", () => {
    expect(() => loginSchema.parse({ email: "a@b.com", password: "longenough1" })).toThrow();
  });
  it("accepts a full login payload", () => {
    const out = loginSchema.parse({
      email: "a@b.com",
      password: "longenough1",
      deviceIdHash: "abc123def",
      deviceName: "Moon's Mac",
    });
    expect(out.deviceIdHash).toBe("abc123def");
  });
});

describe("decideDeviceAdmission", () => {
  it("rotates when the same device already has a session", () => {
    const sessions = [{ deviceIdHash: "dev-A" }, { deviceIdHash: "dev-B" }];
    expect(decideDeviceAdmission(sessions, "dev-A")).toBe("rotate");
  });
  it("admits a new device below the cap", () => {
    expect(decideDeviceAdmission([{ deviceIdHash: "dev-A" }], "dev-B")).toBe("admit");
  });
  it("rejects a new device at the cap", () => {
    const sessions = [{ deviceIdHash: "dev-A" }, { deviceIdHash: "dev-B" }];
    expect(decideDeviceAdmission(sessions, "dev-C")).toBe("reject");
  });
  it("uses a cap of 2", () => {
    expect(DEVICE_CAP).toBe(2);
  });
});
