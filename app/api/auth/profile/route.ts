import { updateProfile } from "@/lib/server/auth";
import { updateProfileSchema } from "@/lib/server/authPolicy";
import { jsonError, jsonOk, parseApiError } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const input = updateProfileSchema.parse(await req.json());
    await updateProfile(req.headers.get("authorization"), input);
    return jsonOk({ ok: true });
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }
}
