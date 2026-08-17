export const runtime = "nodejs";

// RETIRED 2026-08-17. The SePay IPN handler lives in vochi-api now:
//   POST https://api.vochi.xyz/api/sepay/ipn
//
// This app's Prisma schema is frozen at the pre-consolidation shape (it still
// declares Order.invoiceNumber and PaymentEvent), while the shared DB was
// migrated by vochi-api's 20260713010000_consolidate_orders_webhooks (column
// renamed to invoiceId, PaymentEvent folded into PaymentWebhookLog). A payment
// that lands here therefore gets confirmed with SePay and THEN dies on the DB
// write — SePay sees a 400, the order stays `pending`, and the customer pays
// for a license that is never issued. That happened in production.
//
// So this stays as a tombstone rather than a deleted file: if the SePay
// dashboard is ever pointed back at vochi.xyz, 410 makes the misconfiguration
// obvious instead of a bare 404 that reads like a typo. Do NOT re-wire
// processSepayIpn here — port anything missing to vochi-api instead.
export function POST() {
  console.error(JSON.stringify({ event: "sepay_ipn_retired_endpoint_hit" }));
  return Response.json(
    { error: { code: "Gone", message: "SePay IPN moved to https://api.vochi.xyz/api/sepay/ipn" } },
    { status: 410 },
  );
}
