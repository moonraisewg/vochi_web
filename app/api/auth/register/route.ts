import { register } from "@/lib/server/auth";
import { registerSchema } from "@/lib/server/authPolicy";
import { assertAuthThrottle } from "@/lib/server/authThrottle";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const input = registerSchema.parse(await req.json());
    await assertAuthThrottle(`auth:register:ip:${clientIp(req)}`, 10, 60 * 60 * 1000);
    await assertAuthThrottle(`auth:register:email:${input.email}`, 5, 60 * 60 * 1000);
    await register(input);
    return jsonOk({ ok: true }, { status: 202 }); // generic: never reveals existence
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
