import { NextResponse, type NextRequest } from "next/server";

// The backend moved to vochi-api (api.vochi.xyz). Everything under /api/ here is
// a leftover from before that cutover, still running this app's pre-migration
// Prisma schema against the SAME production Postgres — a shape the DB no longer
// has. The SePay IPN route proved what that costs: SePay kept delivering here,
// the write blew up on a renamed column, and a paying customer got no license.
//
// So the door is closed by default and opened by name. A route file dropped into
// app/api/ later stays dead until someone adds it below on purpose, which is the
// property that was missing when the IPN route outlived its callers.
const API_ALLOWLIST = new Set([
  "/api/updates/latest", // baked into every shipped desktop binary — see src-tauri/tauri.conf.json
  "/api/og/badge", // OG images for the vochi.xyz/s/<id> share pages
  "/api/og/stats",
]);

// Language detection lives in resolveSeoLang / resolveHtmlLang — resolved per
// request from edge geo headers + Accept-Language, with the user's cookie
// overriding both. Middleware no longer writes the cookie: doing so collapsed
// "user picked" and "geo default" into the same key, so a user who toggled EN
// in Vietnam was flipped back to VI on next visit.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/") && !API_ALLOWLIST.has(pathname)) {
    console.error(JSON.stringify({ event: "legacy_api_blocked", path: pathname }));
    return NextResponse.json(
      { error: { code: "Gone", message: "This API moved to https://api.vochi.xyz" } },
      { status: 410 },
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
