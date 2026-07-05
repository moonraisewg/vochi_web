import { verifyEmail } from "@/lib/server/auth";
import { verifyEmailSchema } from "@/lib/server/authPolicy";
import { assertAuthThrottle } from "@/lib/server/authThrottle";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const input = verifyEmailSchema.parse(await req.json());
    await assertAuthThrottle(`auth:verify:ip:${clientIp(req)}`, 30, 60 * 60 * 1000);
    await verifyEmail(input.token);
    return jsonOk({ ok: true });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
