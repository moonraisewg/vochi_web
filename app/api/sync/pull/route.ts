import { requireSession } from "@/lib/server/auth";
import { pullChangesSchema } from "@/lib/server/syncPolicy";
import { pullChanges } from "@/lib/server/sync";
import { jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await requireSession(req.headers.get("authorization"));
    const { since } = pullChangesSchema.parse(await req.json());
    const result = await pullChanges(session.userId, since);
    return jsonOk(result); // { events, cards, nextSince, hasMore }
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
