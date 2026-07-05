import { z } from "zod";
import { requireSession } from "@/lib/server/auth";
import { claimLicense } from "@/lib/server/accountLicenses";
import { assertRateLimit } from "@/lib/server/rateLimit";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ licenseKey: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const session = await requireSession(req.headers.get("authorization"));
    const { licenseKey } = schema.parse(await req.json());
    assertRateLimit(`license:claim:ip:${clientIp(req)}`, 20, 60 * 60 * 1000);
    await claimLicense(session.userId, licenseKey);
    return jsonOk({ ok: true });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
