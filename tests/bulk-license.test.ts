import { describe, it, expect } from "vitest";
import { isBulkLicenseOrder, BULK_LICENSE_COUNT } from "../lib/server/licenses";

describe("bulk license issuance", () => {
  it("flags mocchaust64@gmail.com + one_month as a bulk order", () => {
    expect(isBulkLicenseOrder("mocchaust64@gmail.com", "one_month")).toBe(true);
  });

  it("does not flag other emails on one_month as bulk", () => {
    expect(isBulkLicenseOrder("someone@gmail.com", "one_month")).toBe(false);
  });

  it("does not flag mocchaust64@gmail.com on other plans as bulk", () => {
    expect(isBulkLicenseOrder("mocchaust64@gmail.com", "lifetime")).toBe(false);
    expect(isBulkLicenseOrder("mocchaust64@gmail.com", "three_months")).toBe(false);
  });

  it("bulk count is 30", () => {
    expect(BULK_LICENSE_COUNT).toBe(30);
  });
});
