import { login } from "@/lib/server/auth";
import { loginSchema } from "@/lib/server/authPolicy";
import { assertAuthThrottle } from "@/lib/server/authThrottle";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const input = loginSchema.parse(await req.json());
    await assertAuthThrottle(`auth:login:ip:${clientIp(req)}`, 30, 60 * 60 * 1000);
    await assertAuthThrottle(`auth:login:email:${input.email}`, 10, 15 * 60 * 1000);
    const result = await login(input);
    if (!result.ok) {
      return jsonError("device_limit", "Bạn đang đăng nhập 2 thiết bị. Hãy đăng xuất bớt 1 thiết bị.", 403);
    }
    return jsonOk({ sessionToken: result.sessionToken });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
