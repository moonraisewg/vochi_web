import { prisma } from "../lib/server/prisma";
import { retrieveSepayOrder } from "../lib/server/sepay";
import { processSepayIpn } from "../lib/server/ipn";

const invoiceNumber = process.argv[2];
if (!invoiceNumber) {
  console.error("Usage: pnpm admin:reconcile <invoiceNumber>");
  process.exit(1);
}

const order = await prisma.order.findUnique({ where: { invoiceNumber } });
if (!order) throw new Error(`Local order not found: ${invoiceNumber}`);

const response = await retrieveSepayOrder(invoiceNumber);
const payload = response.data;
const result = await processSepayIpn({
  event: "ORDER_PAID_RECONCILIATION",
  order_invoice_number: invoiceNumber,
  order_amount: order.amountVnd,
  currency: order.currency,
  transaction_id: payload?.transaction_id ?? payload?.id ?? `reconcile:${invoiceNumber}`,
  order_id: payload?.order_id ?? payload?.id ?? null,
  data: payload,
});

console.log(JSON.stringify(result, null, 2));
