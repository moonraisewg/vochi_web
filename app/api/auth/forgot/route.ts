import { forgotPassword } from "@/lib/server/auth";
import { forgotSchema } from "@/lib/server/authPolicy";
import { assertRateLimit } from "@/lib/server/rateLimit";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const input = forgotSchema.parse(await req.json());
    assertRateLimit(`auth:forgot:ip:${clientIp(req)}`, 10, 60 * 60 * 1000);
    assertRateLimit(`auth:forgot:email:${input.email}`, 3, 60 * 60 * 1000);
    await forgotPassword(input.email);
    return jsonOk({ ok: true }, { status: 202 }); // generic
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
