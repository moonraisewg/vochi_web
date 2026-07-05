import { requireSession } from "@/lib/server/auth";
import { listLicenses } from "@/lib/server/accountLicenses";
import { jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const session = await requireSession(req.headers.get("authorization"));
    return jsonOk({ licenses: await listLicenses(session.userId) });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
