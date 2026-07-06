import { describe, it, expect } from "vitest";
import {
  normalizeEmail,
  registerSchema,
  updateProfileSchema,
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
    const out = registerSchema.parse({
      email: " A@B.com ",
      password: "longenough1",
      name: "Moon",
      age: 25,
    });
    expect(out.email).toBe("a@b.com");
  });
  it("rejects a short password", () => {
    expect(() =>
      registerSchema.parse({ email: "a@b.com", password: "short", name: "Moon", age: 25 }),
    ).toThrow();
  });
  it("rejects a non-email", () => {
    expect(() =>
      registerSchema.parse({ email: "nope", password: "longenough1", name: "Moon", age: 25 }),
    ).toThrow();
  });
  it("trims the name and requires it non-empty", () => {
    const out = registerSchema.parse({
      email: "a@b.com",
      password: "longenough1",
      name: "  Moon  ",
      age: 25,
    });
    expect(out.name).toBe("Moon");
  });
  it("rejects an empty name", () => {
    expect(() =>
      registerSchema.parse({ email: "a@b.com", password: "longenough1", name: "   ", age: 25 }),
    ).toThrow();
  });
  it("rejects a name over 100 characters", () => {
    expect(() =>
      registerSchema.parse({
        email: "a@b.com",
        password: "longenough1",
        name: "a".repeat(101),
        age: 25,
      }),
    ).toThrow();
  });
  it("accepts a name at exactly 100 characters", () => {
    const out = registerSchema.parse({
      email: "a@b.com",
      password: "longenough1",
      name: "a".repeat(100),
      age: 25,
    });
    expect(out.name).toHaveLength(100);
  });
  it("rejects an age below 13", () => {
    expect(() =>
      registerSchema.parse({ email: "a@b.com", password: "longenough1", name: "Moon", age: 12 }),
    ).toThrow();
  });
  it("rejects an age above 120", () => {
    expect(() =>
      registerSchema.parse({ email: "a@b.com", password: "longenough1", name: "Moon", age: 121 }),
    ).toThrow();
  });
  it("accepts boundary ages 13 and 120", () => {
    expect(
      registerSchema.parse({ email: "a@b.com", password: "longenough1", name: "Moon", age: 13 })
        .age,
    ).toBe(13);
    expect(
      registerSchema.parse({ email: "a@b.com", password: "longenough1", name: "Moon", age: 120 })
        .age,
    ).toBe(120);
  });
  it("rejects a non-integer age", () => {
    expect(() =>
      registerSchema.parse({ email: "a@b.com", password: "longenough1", name: "Moon", age: 25.5 }),
    ).toThrow();
  });
});

describe("updateProfileSchema", () => {
  it("accepts a valid name + age", () => {
    const out = updateProfileSchema.parse({ name: "Moon", age: 30 });
    expect(out).toEqual({ name: "Moon", age: 30 });
  });
  it("rejects an empty name", () => {
    expect(() => updateProfileSchema.parse({ name: "  ", age: 30 })).toThrow();
  });
  it("rejects an out-of-range age", () => {
    expect(() => updateProfileSchema.parse({ name: "Moon", age: 200 })).toThrow();
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
