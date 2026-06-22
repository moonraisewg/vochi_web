import { describe, it, expect } from "vitest";
import { isBulkLicenseOrder, bulkCountForOrder } from "../lib/server/licenses";

describe("bulk license issuance", () => {
  it("flags mocchaust64@gmail.com + one_month as a bulk order", () => {
    expect(isBulkLicenseOrder("mocchaust64@gmail.com", "one_month")).toBe(true);
  });

  it("flags mocchaust64@gmail.com + trial_7days as a bulk order", () => {
    expect(isBulkLicenseOrder("mocchaust64@gmail.com", "trial_7days")).toBe(true);
  });

  it("does not flag other emails as bulk", () => {
    expect(isBulkLicenseOrder("someone@gmail.com", "one_month")).toBe(false);
    expect(isBulkLicenseOrder("someone@gmail.com", "trial_7days")).toBe(false);
  });

  it("does not flag mocchaust64@gmail.com on non-bulk plans as bulk", () => {
    expect(isBulkLicenseOrder("mocchaust64@gmail.com", "lifetime")).toBe(false);
    expect(isBulkLicenseOrder("mocchaust64@gmail.com", "three_months")).toBe(false);
  });

  it("one_month generates 30 keys", () => {
    expect(bulkCountForOrder("mocchaust64@gmail.com", "one_month")).toBe(30);
  });

  it("trial_7days generates 50 keys", () => {
    expect(bulkCountForOrder("mocchaust64@gmail.com", "trial_7days")).toBe(50);
  });

  it("returns null for non-bulk orders", () => {
    expect(bulkCountForOrder("mocchaust64@gmail.com", "lifetime")).toBeNull();
    expect(bulkCountForOrder("someone@gmail.com", "one_month")).toBeNull();
  });
});
