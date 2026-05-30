import { prisma } from "./prisma";
import { issueLicenseForOrder } from "./licenses";
import { getPlan } from "./plans";
import { sha256Hex } from "./crypto";

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
  const data = asRecord(payload.data);
  for (const key of keys) {
    if (payload[key] != null) return payload[key];
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
  const eventType = getString(record, ["event", "event_type", "type"]) ?? "unknown";
  const status =
    getString(record, ["transaction_status", "payment_status", "order_status", "status"]) ?? eventType;
  const invoiceNumber = getString(record, ["order_invoice_number", "invoice_number", "orderInvoiceNumber"]);
  const transaction =
    getString(record, ["transaction_id", "payment_id", "reference_id", "id"]) ?? `ipn:${sha256Hex(raw)}`;
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
  const value = `${parsed.eventType} ${parsed.status}`.toUpperCase();
  return value.includes("ORDER_PAID") || value.includes("PAID") || value.includes("SUCCESS");
}

export async function processSepayIpn(payload: unknown) {
  const parsed = parseIpnPayload(payload);
  if (!parsed.invoiceNumber) throw new Error("IPN is missing order invoice number");
  const invoiceNumber = parsed.invoiceNumber;

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { invoiceNumber } });
    if (!order) throw new Error(`Unknown order invoice: ${invoiceNumber}`);

    const existing = await tx.paymentEvent.findUnique({
      where: { sepayTransactionId: parsed.sepayTransactionId },
    });
    if (existing) {
      await tx.auditLog.create({
        data: {
          actor: "sepay-ipn",
          action: "payment.duplicate_ipn",
          orderId: order.id,
          metadata: { sepayTransactionId: parsed.sepayTransactionId },
        },
      });
      return { duplicate: true, orderId: order.id };
    }

    await tx.paymentEvent.create({
      data: {
        orderId: order.id,
        sepayTransactionId: parsed.sepayTransactionId,
        eventType: parsed.eventType,
        status: parsed.status,
        rawJson: payload as object,
      },
    });

    if (!isPaidIpn(parsed)) {
      await tx.auditLog.create({
        data: { actor: "sepay-ipn", action: "payment.non_paid_event", orderId: order.id, metadata: parsed },
      });
      return { duplicate: false, orderId: order.id, paid: false };
    }

    if (order.status === "expired" || order.expiresAt.getTime() <= Date.now()) {
      await tx.order.update({ where: { id: order.id }, data: { status: "expired" } });
      throw new Error("Order has expired");
    }
    if (parsed.currency && parsed.currency !== "VND") throw new Error(`Currency mismatch: ${parsed.currency}`);
    if (parsed.amountVnd !== order.amountVnd) {
      await tx.auditLog.create({
        data: {
          actor: "sepay-ipn",
          action: "payment.amount_mismatch",
          orderId: order.id,
          metadata: { expected: order.amountVnd, actual: parsed.amountVnd },
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
        sepayOrderId: parsed.sepayOrderId,
        sepayTransactionId: parsed.sepayTransactionId,
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
        metadata: { sepayTransactionId: parsed.sepayTransactionId },
      },
    });

    return { duplicate: false, orderId: paidOrder.id, paid: true, licenseId: license.id };
  });
}
