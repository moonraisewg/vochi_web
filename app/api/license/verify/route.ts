import { createEntitlement, verifyLicenseSchema } from "@/lib/server/licenses";
import { assertRateLimit } from "@/lib/server/rateLimit";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const input = verifyLicenseSchema.parse(await req.json());
    assertRateLimit(`license-verify:ip:${clientIp(req)}`, 120, 60 * 60 * 1000);
    const result = await createEntitlement(input.licenseId, input.deviceId);
    return jsonOk(result);
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
