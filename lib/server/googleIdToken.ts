import { OAuth2Client } from "google-auth-library";
import { ApiError } from "./http";
import type { GoogleIdentity } from "./googleOAuth";

/** iOS/Android Google client IDs accepted as id_token `aud`. Empty/undefined entries are
 *  dropped so an unconfigured platform never widens the allow-list. */
function allowedAudiences(): string[] {
  return [process.env.GOOGLE_IOS_CLIENT_ID, process.env.GOOGLE_ANDROID_CLIENT_ID].filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
}

/** Verify a Google id_token from the mobile Google Sign-In SDK. The library checks the
 *  JWKS signature, `iss`, `exp`, and `aud ∈ audience`. We additionally require the `email`
 *  claim. A library rejection (bad sig / expired / wrong aud) AND an infra failure (cert
 *  fetch) both surface as oauth_exchange_failed 400 — the library does not distinguish them
 *  (documented trade-off in the spec). */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleIdentity> {
  const audience = allowedAudiences();
  if (audience.length === 0) {
    throw new ApiError("oauth_misconfigured", "Mobile Google OAuth is not configured", 500);
  }

  let payload;
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({ idToken, audience });
    payload = ticket.getPayload();
  } catch {
    throw new ApiError("oauth_exchange_failed", "Google id_token verification failed", 400);
  }

  if (!payload || !payload.sub || typeof payload.email !== "string" || payload.email.length === 0) {
    throw new ApiError("oauth_exchange_failed", "Google id_token missing required claims", 400);
  }

  return {
    sub: payload.sub,
    email: payload.email.trim().toLowerCase(),
    emailVerified: payload.email_verified === true,
    name: typeof payload.name === "string" ? payload.name : null,
  };
}
