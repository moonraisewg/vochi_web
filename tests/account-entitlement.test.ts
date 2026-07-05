import { describe, it, expect } from "vitest";
import { computeEffectiveEntitlement, type ClaimedLicense } from "../lib/server/accountEntitlement";

// Injected feature lookup so the test doesn't depend on the real plan table.
const planFeatures = (plan: string): string[] =>
  plan === "lifetime" ? ["mode2", "skins", "stats"] : plan === "one_month" ? ["mode2", "skins"] : [];

const NOW = new Date("2026-07-05T00:00:00Z");
const noReferral = { until: null as Date | null, features: [] as string[] };
const lic = (id: string, plan: string, expiresAt: Date | null): ClaimedLicense => ({ id, plan, expiresAt });

describe("computeEffectiveEntitlement", () => {
  it("free account (no licenses, no referral) → no features, never-expires, synthetic id", () => {
    const e = computeEffectiveEntitlement("u1", [], noReferral, planFeatures, NOW);
    expect(e.features).toEqual([]);
    expect(e.expiresAt).toBeNull();
    expect(e.licenseId).toBe("account:u1");
    expect(e.plan).toBe("free");
  });

  it("one active timed license → its features + its expiry", () => {
    const exp = new Date("2026-08-01T00:00:00Z");
    const e = computeEffectiveEntitlement("u1", [lic("L1", "one_month", exp)], noReferral, planFeatures, NOW);
    expect(e.features.sort()).toEqual(["mode2", "skins"]);
    expect(e.expiresAt).toBe(exp.toISOString());
    expect(e.licenseId).toBe("L1");
  });

  it("lifetime license → never-expires wins over any timed expiry", () => {
    const timed = new Date("2026-08-01T00:00:00Z");
    const e = computeEffectiveEntitlement(
      "u1",
      [lic("L1", "one_month", timed), lic("L2", "lifetime", null)],
      noReferral,
      planFeatures,
      NOW,
    );
    expect(e.expiresAt).toBeNull();
    expect(e.features).toContain("stats"); // union includes lifetime's extra feature
  });

  it("excludes an already-expired license", () => {
    const past = new Date("2026-07-04T00:00:00Z");
    const e = computeEffectiveEntitlement("u1", [lic("L1", "one_month", past)], noReferral, planFeatures, NOW);
    expect(e.features).toEqual([]);
    expect(e.expiresAt).toBeNull();
    expect(e.licenseId).toBe("account:u1");
  });

  it("takes the latest expiry across two active timed licenses", () => {
    const near = new Date("2026-07-20T00:00:00Z");
    const far = new Date("2026-09-20T00:00:00Z");
    const e = computeEffectiveEntitlement("u1", [lic("L1", "one_month", near), lic("L2", "one_month", far)], noReferral, planFeatures, NOW);
    expect(e.expiresAt).toBe(far.toISOString());
  });

  it("referral premium (no license) contributes features + expiry (Phase 4-ready)", () => {
    const until = new Date("2026-07-10T00:00:00Z");
    const e = computeEffectiveEntitlement("u1", [], { until, features: ["mode2"] }, planFeatures, NOW);
    expect(e.features).toEqual(["mode2"]);
    expect(e.expiresAt).toBe(until.toISOString());
    expect(e.plan).toBe("referral");
  });

  it("ignores an expired referral premium", () => {
    const past = new Date("2026-07-01T00:00:00Z");
    const e = computeEffectiveEntitlement("u1", [], { until: past, features: ["mode2"] }, planFeatures, NOW);
    expect(e.features).toEqual([]);
    expect(e.plan).toBe("free");
  });
});
