import { listDevices } from "@/lib/server/auth";
import { jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const devices = await listDevices(req.headers.get("authorization"));
    return jsonOk({ devices });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
