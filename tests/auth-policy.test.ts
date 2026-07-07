import { describe, it, expect } from "vitest";
import {
  normalizeEmail,
  registerSchema,
  updateProfileSchema,
  loginSchema,
  decideDeviceAdmission,
  deviceLimitFor,
  selectEntitledDevices,
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
    });
    expect(out.email).toBe("a@b.com");
  });
  it("rejects a short password", () => {
    expect(() =>
      registerSchema.parse({ email: "a@b.com", password: "short", name: "Moon" }),
    ).toThrow();
  });
  it("rejects a non-email", () => {
    expect(() =>
      registerSchema.parse({ email: "nope", password: "longenough1", name: "Moon" }),
    ).toThrow();
  });
  it("trims the name and requires it non-empty", () => {
    const out = registerSchema.parse({
      email: "a@b.com",
      password: "longenough1",
      name: "  Moon  ",
    });
    expect(out.name).toBe("Moon");
  });
  it("rejects an empty name", () => {
    expect(() =>
      registerSchema.parse({ email: "a@b.com", password: "longenough1", name: "   " }),
    ).toThrow();
  });
  it("rejects a name over 100 characters", () => {
    expect(() =>
      registerSchema.parse({
        email: "a@b.com",
        password: "longenough1",
        name: "a".repeat(101),
      }),
    ).toThrow();
  });
  it("accepts a name at exactly 100 characters", () => {
    const out = registerSchema.parse({
      email: "a@b.com",
      password: "longenough1",
      name: "a".repeat(100),
    });
    expect(out.name).toHaveLength(100);
  });
  it("registerSchema accepts a body without age", () => {
    const r = registerSchema.safeParse({ email: "a@b.com", password: "longenough1", name: "Alice" });
    expect(r.success).toBe(true);
  });
  it("registerSchema strips an unknown age field", () => {
    const r = registerSchema.parse({ email: "a@b.com", password: "longenough1", name: "Alice", age: 20 } as never);
    expect("age" in r).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  it("accepts a valid name", () => {
    const out = updateProfileSchema.parse({ name: "Moon" });
    expect(out).toEqual({ name: "Moon" });
  });
  it("rejects an empty name", () => {
    expect(() => updateProfileSchema.parse({ name: "  " })).toThrow();
  });
  it("strips an unknown age field", () => {
    const out = updateProfileSchema.parse({ name: "Moon", age: 30 } as never);
    expect("age" in out).toBe(false);
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

describe("deviceLimitFor", () => {
  it("falls back to DEVICE_CAP with no active licenses", () => {
    expect(deviceLimitFor([])).toBe(DEVICE_CAP);
  });
  it("uses the single license's deviceLimit", () => {
    expect(deviceLimitFor([{ deviceLimit: 5 }])).toBe(5);
  });
  it("uses the largest deviceLimit across multiple licenses", () => {
    expect(deviceLimitFor([{ deviceLimit: 1 }, { deviceLimit: 5 }])).toBe(5);
  });
});

describe("selectEntitledDevices", () => {
  const at = (ms: number) => new Date(ms);

  it("entitles everyone when the count is below the limit", () => {
    const sessions = [
      { deviceIdHash: "a", createdAt: at(1) },
      { deviceIdHash: "b", createdAt: at(2) },
    ];
    expect(selectEntitledDevices(sessions, 5)).toEqual(new Set(["a", "b"]));
  });
  it("entitles everyone at exactly the limit", () => {
    const sessions = [
      { deviceIdHash: "a", createdAt: at(1) },
      { deviceIdHash: "b", createdAt: at(2) },
    ];
    expect(selectEntitledDevices(sessions, 2)).toEqual(new Set(["a", "b"]));
  });
  it("keeps only the oldest `limit` sessions when over the limit", () => {
    const sessions = [
      { deviceIdHash: "newest", createdAt: at(3) },
      { deviceIdHash: "oldest", createdAt: at(1) },
      { deviceIdHash: "middle", createdAt: at(2) },
    ];
    expect(selectEntitledDevices(sessions, 2)).toEqual(new Set(["oldest", "middle"]));
  });
  it("returns an empty set for no sessions", () => {
    expect(selectEntitledDevices([], 2)).toEqual(new Set());
  });
});
