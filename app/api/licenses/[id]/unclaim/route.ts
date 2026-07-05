import { requireSession } from "@/lib/server/auth";
import { unclaimLicense } from "@/lib/server/accountLicenses";
import { jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession(req.headers.get("authorization"));
    const { id } = await ctx.params;
    await unclaimLicense(session.userId, id);
    return jsonOk({ ok: true });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
