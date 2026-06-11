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

// Derives the admin bearer token from a secret via a one-way HMAC with a
// domain-separation label. This gates the admin endpoint WITHOUT provisioning
// a new env var, and never puts the source secret on the wire: the token is
// irreversible (a leaked token cannot recover the key) and rotates by bumping
// ADMIN_TOKEN_LABEL.
//
// NOTE: we HMAC the FULL secret — never a substring, and we never mix in
// public values like APP_BASE_URL (those add zero entropy and only a false
// sense of security). The token's strength is exactly the secret's.
export function deriveAdminToken(secret: string) {
  return crypto.createHmac("sha256", secret).update(ADMIN_TOKEN_LABEL).digest("hex");
}

// The bearer token the admin endpoint expects.
//
// Seeded from LICENSE_SIGNING_PRIVATE_KEY because that keypair is pinned to the
// shipped desktop app (its public half ships as VITE_LICENSE_PUBLIC_KEY), so
// the value is guaranteed identical between local and production — unlike
// LICENSE_KEY_ENCRYPTION_SECRET, which had drifted. Trade-off: this widens
// where the signing key is read. Acceptable only because the HMAC is one-way —
// the raw key never leaves the server and the token can't reveal it. Prefer a
// dedicated JOB_SECRET if one is ever provisioned in prod.
export function adminToken() {
  return deriveAdminToken(serverEnv().LICENSE_SIGNING_PRIVATE_KEY);
}

// Gate for admin/job-only endpoints.
export function assertJobAuth(req: Request) {
  if (!secretsMatch(readJobSecret(req), adminToken())) {
    throw new ApiError("Unauthorized", "Invalid admin credentials", 401);
  }
}
