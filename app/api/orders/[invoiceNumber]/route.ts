import { getPublicOrder } from "@/lib/server/orders";
import { jsonError, jsonOk } from "@/lib/server/http";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ invoiceNumber: string }> }) {
  const { invoiceNumber } = await params;
  const order = await getPublicOrder(invoiceNumber);
  if (!order) return jsonError("NotFound", "Order not found", 404);
  return jsonOk(order);
}
