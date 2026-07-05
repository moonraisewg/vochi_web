import { getMe } from "@/lib/server/auth";
import { jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const result = await getMe(req.headers.get("authorization"));
    return jsonOk(result);
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
