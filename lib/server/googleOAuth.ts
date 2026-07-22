import { ApiError } from "./http";

export interface GoogleIdentity {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
}

/** Exchange a PKCE authorization code for the user's verified Google identity.
 *  redirectUri MUST equal the one the desktop app used in the auth request
 *  (Google validates it). Throws ApiError on any Google-side failure so the
 *  route surfaces a clean 400/500, never a 500 stack. */
export async function exchangeCodeForGoogleIdentity(input: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<GoogleIdentity> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new ApiError("oauth_misconfigured", "Google OAuth is not configured", 500);
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: input.code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: input.redirectUri,
      grant_type: "authorization_code",
      code_verifier: input.codeVerifier,
    }),
  });
  if (!tokenRes.ok) {
    throw new ApiError("oauth_exchange_failed", "Google code exchange failed", 400);
  }
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) {
    throw new ApiError("oauth_exchange_failed", "Google returned no access token", 400);
  }

  const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { authorization: `Bearer ${access_token}` },
  });
  if (!infoRes.ok) {
    throw new ApiError("oauth_exchange_failed", "Google userinfo failed", 400);
  }
  const info = (await infoRes.json()) as {
    sub?: string; email?: string; email_verified?: boolean; name?: string;
  };
  if (!info.sub || !info.email) {
    throw new ApiError("oauth_exchange_failed", "Google userinfo incomplete", 400);
  }
  return {
    sub: info.sub,
    email: info.email.trim().toLowerCase(),
    emailVerified: info.email_verified === true,
    name: info.name ?? null,
  };
}
