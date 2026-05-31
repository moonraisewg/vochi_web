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

  it("parses the real SePay PG nested IPN payload (order.* / transaction.*)", () => {
    // Shape captured from a live SePay sandbox "Gửi test" notification.
    const parsed = parseIpnPayload({
      timestamp: 1780241667,
      notification_type: "ORDER_PAID",
      order: {
        id: "357aac63-5d06-11f1-b21a-a6006ab65aca",
        order_id: "TEST_ORDER_1780241667",
        order_status: "CAPTURED",
        order_currency: "VND",
        order_amount: 239000,
        order_invoice_number: "INV-20260531-063491",
      },
      transaction: {
        id: "357acdcc-5d06-11f1-b21a-a6006ab65aca",
        payment_method: "BANK_TRANSFER",
        transaction_id: "TEST_TXN_1780241667",
        transaction_status: "APPROVED",
        transaction_amount: 239000,
        transaction_currency: "VND",
      },
    });

    expect(parsed.invoiceNumber).toBe("INV-20260531-063491");
    expect(parsed.amountVnd).toBe(239000);
    expect(parsed.currency).toBe("VND");
    expect(parsed.eventType).toBe("ORDER_PAID");
    expect(parsed.status).toBe("APPROVED");
    // transaction_id, NOT order.id — idempotency key must be the real txn id
    expect(parsed.sepayTransactionId).toBe("TEST_TXN_1780241667");
    expect(parsed.sepayOrderId).toBe("TEST_ORDER_1780241667");
    expect(isPaidIpn(parsed)).toBe(true);
  });

  it("treats order.retrieve().data (CAPTURED, amount as decimal string) as paid", () => {
    // Shape captured from a live SePay sandbox order.retrieve() — nested under data,
    // order_status CAPTURED, amount "239000.00". This is the server-to-server confirm path.
    const parsed = parseIpnPayload({
      data: {
        order_invoice_number: "VOCHI-20260531-4724DE67B1",
        order_status: "CAPTURED",
        order_amount: "239000.00",
        order_currency: "VND",
      },
    });
    expect(parsed.invoiceNumber).toBe("VOCHI-20260531-4724DE67B1");
    expect(parsed.amountVnd).toBe(239000); // "239000.00" → 239000
    expect(parsed.status).toBe("CAPTURED");
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
    expect(getPlan("three_months")?.amountVnd).toBe(129000);
    expect(getPlan("six_months")?.amountVnd).toBe(239000);
    expect(getPlan("lifetime")?.amountVnd).toBe(599000);
    expect(getPlan("lifetime")?.deviceLimit).toBe(5);
    // student stays in the backend (hidden from UI) for the planned .edu.vn flow
    expect(getPlan("student")?.amountVnd).toBe(490000);
    // the retired plan must no longer resolve
    expect(getPlan("pro_annual")).toBeNull();
  });
});
