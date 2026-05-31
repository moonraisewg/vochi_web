import { prisma } from "./prisma";
import { issueLicenseForOrder } from "./licenses";
import { getPlan } from "./plans";
import { sha256Hex } from "./crypto";
import { retrieveSepayOrder } from "./sepay";

type IpnEnvelope = {
  invoiceNumber: string | null;
  amountVnd: number | null;
  currency: string | null;
  eventType: string;
  status: string;
  sepayTransactionId: string;
  sepayOrderId: string | null;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getNested(payload: Record<string, unknown>, keys: string[]) {
  // SePay PG nests fields under order.* / transaction.* / customer.*; an older
  // shape used data.*. Check top-level + all known sub-objects so both parse.
  const order = asRecord(payload.order);
  const transaction = asRecord(payload.transaction);
  const customer = asRecord(payload.customer);
  const data = asRecord(payload.data);
  for (const key of keys) {
    if (payload[key] != null) return payload[key];
    if (order[key] != null) return order[key];
    if (transaction[key] != null) return transaction[key];
    if (customer[key] != null) return customer[key];
    if (data[key] != null) return data[key];
  }
  return null;
}

function getString(payload: Record<string, unknown>, keys: string[]) {
  const value = getNested(payload, keys);
  return value == null ? null : String(value);
}

function getAmount(payload: Record<string, unknown>) {
  const value = getNested(payload, ["order_amount", "amount", "transaction_amount", "payment_amount"]);
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function parseIpnPayload(payload: unknown): IpnEnvelope {
  const record = asRecord(payload);
  const raw = JSON.stringify(payload);
  const eventType =
    getString(record, ["notification_type", "event", "event_type", "type"]) ?? "unknown";
  const status =
    getString(record, ["transaction_status", "payment_status", "order_status", "status"]) ?? eventType;
  const invoiceNumber = getString(record, ["order_invoice_number", "invoice_number", "orderInvoiceNumber"]);
  // Prefer the explicit transaction_id; fall back to a hash so we always have a
  // stable idempotency key even on odd payloads. (Don't use bare "id" — that
  // would grab order.id and collide across the two sub-objects.)
  const transaction =
    getString(record, ["transaction_id", "payment_id", "reference_id"]) ?? `ipn:${sha256Hex(raw)}`;
  return {
    invoiceNumber,
    amountVnd: getAmount(record),
    currency: getString(record, ["currency", "order_currency"]) ?? "VND",
    eventType,
    status,
    sepayTransactionId: transaction,
    sepayOrderId: getString(record, ["order_id", "sepay_order_id"]),
  };
}

export function isPaidIpn(parsed: IpnEnvelope) {
  // Per SePay PG docs, a paid order is order_status=CAPTURED and/or
  // transaction_status=APPROVED; IPN notification_type is ORDER_PAID.
  const value = `${parsed.eventType} ${parsed.status}`.toUpperCase();
  return (
    value.includes("ORDER_PAID") ||
    value.includes("PAID") ||
    value.includes("SUCCESS") ||
    value.includes("APPROVED") ||
    value.includes("CAPTURED")
  );
}

/**
 * Server-to-server confirmation: ask SePay for the real order status instead of
 * trusting the (unauthenticated) IPN body. Returns the authoritative envelope or
 * throws if SePay can't confirm the order is paid.
 */
async function confirmWithSepay(invoiceNumber: string): Promise<IpnEnvelope> {
  const remote = await retrieveSepayOrder(invoiceNumber);
  const confirmed = parseIpnPayload(remote);
  if (!isPaidIpn(confirmed)) {
    throw new Error(
      `SePay did not confirm payment for ${invoiceNumber} (status: ${confirmed.status})`,
    );
  }
  return confirmed;
}

export async function processSepayIpn(payload: unknown) {
  const parsed = parseIpnPayload(payload);
  if (!parsed.invoiceNumber) throw new Error("IPN is missing order invoice number");
  const invoiceNumber = parsed.invoiceNumber;

  // Only the IPN trigger comes from the (unauthenticated) webhook. Before
  // touching anything financial, confirm the real status with SePay's API.
  // For a non-paid IPN we still confirm — SePay is the source of truth.
  const confirmed = await confirmWithSepay(invoiceNumber);

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { invoiceNumber } });
    if (!order) throw new Error(`Unknown order invoice: ${invoiceNumber}`);

    // Idempotency + persisted financials use the SePay-confirmed envelope.
    const existing = await tx.paymentEvent.findUnique({
      where: { sepayTransactionId: confirmed.sepayTransactionId },
    });
    if (existing) {
      await tx.auditLog.create({
        data: {
          actor: "sepay-ipn",
          action: "payment.duplicate_ipn",
          orderId: order.id,
          metadata: { sepayTransactionId: confirmed.sepayTransactionId },
        },
      });
      return { duplicate: true, orderId: order.id };
    }

    await tx.paymentEvent.create({
      data: {
        orderId: order.id,
        sepayTransactionId: confirmed.sepayTransactionId,
        eventType: confirmed.eventType,
        status: confirmed.status,
        rawJson: payload as object,
      },
    });

    // confirmWithSepay already guaranteed paid; keep currency/amount/expiry guards.
    if (order.status === "expired" || order.expiresAt.getTime() <= Date.now()) {
      await tx.order.update({ where: { id: order.id }, data: { status: "expired" } });
      throw new Error("Order has expired");
    }
    if (confirmed.currency && confirmed.currency !== "VND") {
      throw new Error(`Currency mismatch: ${confirmed.currency}`);
    }
    if (confirmed.amountVnd !== order.amountVnd) {
      await tx.auditLog.create({
        data: {
          actor: "sepay-ipn",
          action: "payment.amount_mismatch",
          orderId: order.id,
          metadata: { expected: order.amountVnd, actual: confirmed.amountVnd },
        },
      });
      throw new Error("Payment amount mismatch");
    }
    if (!getPlan(order.plan)) throw new Error(`Unsupported plan: ${order.plan}`);

    const paidAt = order.paidAt ?? new Date();
    const paidOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        paidAt,
        sepayOrderId: confirmed.sepayOrderId,
        sepayTransactionId: confirmed.sepayTransactionId,
        rawIpnJson: payload as object,
      },
    });

    const { license } = await issueLicenseForOrder(tx, paidOrder);
    await tx.auditLog.create({
      data: {
        actor: "sepay-ipn",
        action: "payment.paid",
        orderId: paidOrder.id,
        licenseId: license.id,
        metadata: { sepayTransactionId: confirmed.sepayTransactionId },
      },
    });

    return { duplicate: false, orderId: paidOrder.id, paid: true, licenseId: license.id };
  });
}
