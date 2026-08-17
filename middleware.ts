import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "vochi_lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

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

// Pick the visitor's default language from edge geo headers.
// Vercel adds `x-vercel-ip-country`; Cloudflare adds `cf-ipcountry`.
// VN -> Vietnamese, everyone else -> English. Existing cookie wins,
// so a user toggling EN inside Vietnam doesn't get reverted on next visit.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/") && !API_ALLOWLIST.has(pathname)) {
    console.error(JSON.stringify({ event: "legacy_api_blocked", path: pathname }));
    return NextResponse.json(
      { error: { code: "Gone", message: "This API moved to https://api.vochi.xyz" } },
      { status: 410 },
    );
  }

  const res = NextResponse.next();
  if (req.cookies.get(COOKIE)) return res;

  const country = (
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    ""
  )
    .trim()
    .toUpperCase();

  const lang = country === "VN" ? "vi" : "en";
  res.cookies.set(COOKIE, lang, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: [
    // Every /api/* request, so the allowlist above is the only way in.
    "/api/:path*",
    // User-facing pages (language cookie). Static assets skipped.
    "/((?!_next/static|_next/image|favicon.ico|icon|opengraph|og.png|robots.txt|sitemap.xml|manifest|api/).*)",
  ],
};
