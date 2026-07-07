import { requireSession } from "@/lib/server/auth";
import { cardsPushSchema } from "@/lib/server/syncPolicy";
import { pushCards } from "@/lib/server/sync";
import { jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await requireSession(req.headers.get("authorization"));
    const { cards } = cardsPushSchema.parse(await req.json());
    const result = await pushCards(session.userId, cards);
    return jsonOk(result); // { results, clamped }
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
