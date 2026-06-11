import { SePayPgClient, type OnetimePaymentCheckoutFields } from "sepay-pg-node";
import { appUrl, serverEnv } from "./env";
import type { PlanDefinition } from "./plans";

export function sepayClient() {
  const env = serverEnv();
  return new SePayPgClient({
    env: env.SEPAY_ENV,
    merchant_id: env.SEPAY_MERCHANT_ID,
    secret_key: env.SEPAY_SECRET_KEY,
  });
}

export function buildCheckout(order: {
  invoiceNumber: string;
  id: string;
  email: string;
  plan: PlanDefinition;
  // The actual amount to charge — order.amountVnd, the single source of truth.
  // May differ from plan.amountVnd (e.g. a private per-buyer price override).
  amountVnd: number;
}) {
  const client = sepayClient();
  const fields: OnetimePaymentCheckoutFields = {
    operation: "PURCHASE",
    payment_method: "BANK_TRANSFER",
    order_invoice_number: order.invoiceNumber,
    order_amount: order.amountVnd,
    currency: "VND",
    order_description: `Vô chi ${order.plan.name}`,
    customer_id: order.email,
    success_url: appUrl(`/checkout/success?invoice=${encodeURIComponent(order.invoiceNumber)}`),
    error_url: appUrl(`/checkout/error?invoice=${encodeURIComponent(order.invoiceNumber)}`),
    cancel_url: appUrl(`/checkout/cancel?invoice=${encodeURIComponent(order.invoiceNumber)}`),
    custom_data: JSON.stringify({ order_id: order.id, plan: order.plan.id }),
  };

  return {
    checkoutUrl: client.checkout.initCheckoutUrl(),
    fields: client.checkout.initOneTimePaymentFields(fields) as Record<string, string | number>,
  };
}

export async function retrieveSepayOrder(invoiceNumber: string) {
  // SDK returns a full AxiosResponse (which has circular req/res refs). Return
  // only the JSON body so callers can safely parse/stringify it.
  const response = await sepayClient().order.retrieve(invoiceNumber);
  return response.data;
}
