import { activateLicense, activateLicenseSchema } from "@/lib/server/licenses";
import { assertRateLimit } from "@/lib/server/rateLimit";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";
import { licensePrefix } from "@/lib/server/crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const input = activateLicenseSchema.parse(await req.json());
    assertRateLimit(`license:ip:${clientIp(req)}`, 30, 60 * 60 * 1000);
    assertRateLimit(`license:key:${licensePrefix(input.licenseKey)}`, 10, 60 * 60 * 1000);
    const result = await activateLicense(input);
    return jsonOk(result);
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
