import { processSepayIpn } from "@/lib/server/ipn";
import { processEmailOutboxOnce } from "@/lib/server/email";
import { jsonError, jsonOk } from "@/lib/server/http";
import { serverEnv } from "@/lib/server/env";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = req.headers.get("x-secret-key");
  if (!secret || secret !== serverEnv().SEPAY_IPN_SECRET_KEY) {
    console.error(JSON.stringify({ event: "sepay_ipn_rejected", reason: "bad_secret" }));
    return jsonError("Unauthorized", "Invalid IPN secret", 401);
  }

  try {
    const payload = await req.json();
    const result = await processSepayIpn(payload);
    processEmailOutboxOnce(3).catch((error) => {
      console.error(JSON.stringify({ event: "email_outbox_async_failed", error: String(error) }));
    });
    return jsonOk({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ event: "sepay_ipn_failed", error: message }));
    return jsonError("IpnRejected", message, 400);
  }
}
