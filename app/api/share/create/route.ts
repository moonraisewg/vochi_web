import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { parseCreateInput, shortId, type ShareCardInput } from "@/lib/share/shareLink";
import { assertRateLimit } from "@/lib/server/rateLimit";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

// Mints a short /s/<id> share link. Public + unauthenticated: payload is
// strictly validated + clamped (parseCreateInput) so rows are tiny and bounded,
// and throttled per IP. The IP limiter is in-memory (per-instance) — a courtesy
// throttle, not durable protection; see the spec's Security & abuse section.
export async function POST(req: Request) {
  try {
    const input = parseCreateInput(await req.json());
    assertRateLimit(`share-create:ip:${clientIp(req)}`, 30, 60 * 1000);
    const id = await insertWithRetry(input);
    return jsonOk({ id });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}

async function insertWithRetry(input: ShareCardInput): Promise<string> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const id = shortId();
    try {
      await prisma.shareCard.create({ data: { id, ...input } });
      return id;
    } catch (e) {
      const collision =
        e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
      if (collision && attempt < 2) continue;
      throw e;
    }
  }
  throw new Error("unreachable");
}
