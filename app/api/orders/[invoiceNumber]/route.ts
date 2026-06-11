import { getPublicOrder } from "@/lib/server/orders";
import { processEmailOutboxOnce } from "@/lib/server/email";
import { jsonError, jsonOk } from "@/lib/server/http";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ invoiceNumber: string }> }) {
  const { invoiceNumber } = await params;
  const order = await getPublicOrder(invoiceNumber);
  if (!order) return jsonError("NotFound", "Order not found", 404);

  // Reliable license-email delivery. The IPN webhook only kicks off the outbox
  // as fire-and-forget, which Vercel can freeze before the send completes. The
  // success page polls this endpoint after paying, so flush the outbox here
  // (awaited, best-effort) — this guarantees the license email goes out and
  // never lets a delivery failure break the status response.
  if (order.licenseIssued) {
    try {
      await processEmailOutboxOnce(5);
    } catch (error) {
      console.error(JSON.stringify({ event: "order_status_outbox_flush_failed", error: String(error) }));
    }
  }

  return jsonOk(order);
}
