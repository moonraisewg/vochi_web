import { adminIssueLicenseSchema, issueAdminLicense } from "@/lib/server/licenses";
import { assertJobAuth } from "@/lib/server/auth";
import { assertRateLimit } from "@/lib/server/rateLimit";
import { clientIp, jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only: mint a production license directly (no paid order required).
// Gated by JOB_SECRET — see lib/server/auth.ts. The plaintext license key is
// returned in the response body (the only place it's ever exposed, since the
// DB stores only a hash). NEVER log the secret or the key.
export async function POST(req: Request) {
  try {
    assertJobAuth(req);
    assertRateLimit(`admin-license:ip:${clientIp(req)}`, 20, 60 * 60 * 1000);
    const input = adminIssueLicenseSchema.parse(await req.json());
    const result = await issueAdminLicense(input);
    console.log(
      JSON.stringify({
        event: "admin_license_issued",
        actor: "admin",
        licenseId: result.license?.id ?? null,
        plan: input.plan,
        email: input.email,
        alreadyIssued: result.alreadyIssued,
      }),
    );
    return jsonOk(result);
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
