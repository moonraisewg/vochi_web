import { requireSession } from "@/lib/server/auth";
import { pushEventsSchema } from "@/lib/server/syncPolicy";
import { pushEvents } from "@/lib/server/sync";
import { jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await requireSession(req.headers.get("authorization"));
    const { events } = pushEventsSchema.parse(await req.json());
    // deviceIdHash is bound from the session, never the body.
    const result = await pushEvents(session.userId, session.deviceIdHash, events);
    return jsonOk(result); // { accepted, duplicates, clamped }
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
