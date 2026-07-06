import { lookupLicenseEmail, verifyLicenseSchema } from "@/lib/server/licenses";
import { assertRateLimit } from "@/lib/server/rateLimit";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const input = verifyLicenseSchema.parse(await req.json());
    assertRateLimit(`license-lookup-email:ip:${clientIp(req)}`, 120, 60 * 60 * 1000);
    const email = await lookupLicenseEmail(input.licenseId, input.deviceId);
    return jsonOk({ email });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
