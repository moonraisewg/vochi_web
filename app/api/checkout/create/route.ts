import { buildCheckout } from "@/lib/server/sepay";
import { createCheckoutSchema, createOrder } from "@/lib/server/orders";
import { assertRateLimit } from "@/lib/server/rateLimit";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";
import { isSameOrigin } from "@/lib/server/env";
import { getPlan } from "@/lib/server/plans";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!isSameOrigin(req.headers.get("origin"))) {
      return jsonError("CsrfRejected", "Checkout requests must originate from this site", 403);
    }
    const input = createCheckoutSchema.parse(await req.json());
    assertRateLimit(`checkout:ip:${clientIp(req)}`, 10, 60 * 60 * 1000);
    assertRateLimit(`checkout:email:${input.email}`, 5, 60 * 60 * 1000);

    const order = await createOrder(input);
    const plan = getPlan(order.plan);
    if (!plan) throw new Error("Unsupported plan");
    const checkout = buildCheckout({ id: order.id, invoiceNumber: order.invoiceNumber, email: order.email, plan, amountVnd: order.amountVnd });

    return jsonOk({ invoiceNumber: order.invoiceNumber, ...checkout });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
