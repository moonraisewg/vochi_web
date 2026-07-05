import { resetPassword } from "@/lib/server/auth";
import { resetSchema } from "@/lib/server/authPolicy";
import { assertAuthThrottle } from "@/lib/server/authThrottle";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const input = resetSchema.parse(await req.json());
    await assertAuthThrottle(`auth:reset:ip:${clientIp(req)}`, 20, 60 * 60 * 1000);
    await resetPassword(input.token, input.password);
    return jsonOk({ ok: true });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
