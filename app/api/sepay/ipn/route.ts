import { processSepayIpn } from "@/lib/server/ipn";
import { processEmailOutboxOnce } from "@/lib/server/email";
import { jsonError, jsonOk } from "@/lib/server/http";
import { serverEnv } from "@/lib/server/env";

export const runtime = "nodejs";

// Placeholder kept in .env when SECRET_KEY auth isn't configured on the SePay
// dashboard (e.g. the sandbox integration wizard doesn't expose it).
const IPN_SECRET_UNSET = "your-sepay-ipn-secret";

// Defense in depth, the way a payment webhook should be hardened:
//   Layer 1 (here): if an IPN secret is configured, reject requests whose
//     X-Secret-Key header doesn't match — cheap early spam/forgery filter.
//     When SePay's SECRET_KEY auth isn't set up, this layer is skipped.
//   Layer 2 (processSepayIpn): NEVER trust the webhook body — call SePay's
//     order API back to confirm CAPTURED + the real amount before issuing a
//     license. This is the authoritative check and holds even if Layer 1 is off.
//   Layers 3-4: idempotency on transaction id + amount/currency/expiry guards.
export async function POST(req: Request) {
  const configuredSecret = serverEnv().SEPAY_IPN_SECRET_KEY;
  if (configuredSecret && configuredSecret !== IPN_SECRET_UNSET) {
    const provided = req.headers.get("x-secret-key");
    if (provided !== configuredSecret) {
      console.error(JSON.stringify({ event: "sepay_ipn_rejected", reason: "bad_secret" }));
      return jsonError("Unauthorized", "Invalid IPN secret", 401);
    }
  }

  try {
    const payload = await req.json();
    const result = await processSepayIpn(payload);
    // Await the send: on serverless, fire-and-forget after the response can be
    // frozen before the email actually goes out. Best-effort — never fail the
    // IPN ack over an email hiccup (the order-status poll flushes as a backup).
    await processEmailOutboxOnce(3).catch((error) => {
      console.error(JSON.stringify({ event: "email_outbox_async_failed", error: String(error) }));
    });
    return jsonOk({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ event: "sepay_ipn_failed", error: message }));
    return jsonError("IpnRejected", message, 400);
  }
}
