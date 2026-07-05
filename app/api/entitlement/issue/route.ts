import { requireSession } from "@/lib/server/auth";
import { issueAccountEntitlement } from "@/lib/server/accountEntitlement";
import { jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await requireSession(req.headers.get("authorization"));
    // Bind to the SESSION's device, never the request body.
    const result = await issueAccountEntitlement(session.userId, session.deviceIdHash);
    return jsonOk(result); // { entitlement, signature }
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
