import crypto from "crypto";
import { serverEnv } from "./env";
import { ApiError } from "./http";

// Constant-time secret comparison. Hashing both sides to a fixed-length digest
// before timingSafeEqual avoids leaking the secret's length and sidesteps the
// "inputs must be equal length" requirement of timingSafeEqual.
export function secretsMatch(provided: string | null | undefined, expected: string) {
  if (!provided) return false;
  const a = crypto.createHash("sha256").update(provided).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

// Reads the admin secret from `Authorization: Bearer <secret>` (preferred) or
// the `X-Job-Secret` header.
export function readJobSecret(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth) {
    const match = /^Bearer\s+(.+)$/i.exec(auth.trim());
    if (match) return match[1].trim();
  }
  return req.headers.get("x-job-secret")?.trim() ?? null;
}

const ADMIN_TOKEN_LABEL = "admin-license-issue/v1";

// Derives the admin bearer token from LICENSE_KEY_ENCRYPTION_SECRET via a
// one-way HMAC. This gates the admin endpoint WITHOUT provisioning a new env
// var, while never putting the source secret on the wire: the token is
// irreversible, so a leaked token cannot recover the encryption key, and it
// can be rotated by bumping ADMIN_TOKEN_LABEL. We deliberately do NOT derive
// from LICENSE_SIGNING_PRIVATE_KEY — that key stays confined to signEntitlement.
// (If a dedicated JOB_SECRET is ever provisioned in prod, switch to it here.)
export function deriveAdminToken(secret: string) {
  return crypto.createHmac("sha256", secret).update(ADMIN_TOKEN_LABEL).digest("hex");
}

// The bearer token the admin endpoint expects.
export function adminToken() {
  return deriveAdminToken(serverEnv().LICENSE_KEY_ENCRYPTION_SECRET);
}

// Gate for admin/job-only endpoints.
export function assertJobAuth(req: Request) {
  if (!secretsMatch(readJobSecret(req), adminToken())) {
    throw new ApiError("Unauthorized", "Invalid admin credentials", 401);
  }
}
