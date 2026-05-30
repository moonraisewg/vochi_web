import { describe, expect, it } from "vitest";
import { parseIpnPayload, isPaidIpn } from "../lib/server/ipn";
import { canonicalJson, generateLicenseKey, hashLicenseKey, normalizeLicenseKey } from "../lib/server/crypto";
import { getPlan } from "../lib/server/plans";

describe("payment helpers", () => {
  it("parses common SePay IPN shapes", () => {
    const parsed = parseIpnPayload({
      event: "ORDER_PAID",
      data: {
        order_invoice_number: "VOCHI-20260529-ABC",
        order_amount: "990000",
        currency: "VND",
        transaction_id: "txn-1",
      },
    });

    expect(parsed.invoiceNumber).toBe("VOCHI-20260529-ABC");
    expect(parsed.amountVnd).toBe(990000);
    expect(parsed.currency).toBe("VND");
    expect(parsed.sepayTransactionId).toBe("txn-1");
    expect(isPaidIpn(parsed)).toBe(true);
  });

  it("keeps license key hashing insensitive to formatting", () => {
    expect(hashLicenseKey("vochi-abcd-1234")).toBe(hashLicenseKey("VOCHI ABCD 1234"));
    expect(normalizeLicenseKey("vochi-abcd-1234")).toBe("VOCHIABCD1234");
  });

  it("generates Vô chi license keys with the public prefix", () => {
    expect(generateLicenseKey()).toMatch(/^VOCHI-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
  });

  it("canonicalizes JSON for stable entitlement signatures", () => {
    expect(canonicalJson({ b: 2, a: 1 })).toBe(canonicalJson({ a: 1, b: 2 }));
  });

  it("defines production paid plans", () => {
    expect(getPlan("pro_annual")?.amountVnd).toBe(990000);
    expect(getPlan("lifetime")?.deviceLimit).toBe(5);
    expect(getPlan("student")?.amountVnd).toBe(490000);
  });
});
