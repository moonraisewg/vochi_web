import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "vochi_lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

// Pick the visitor's default language from edge geo headers.
// Vercel adds `x-vercel-ip-country`; Cloudflare adds `cf-ipcountry`.
// VN -> Vietnamese, everyone else -> English. Existing cookie wins,
// so a user toggling EN inside Vietnam doesn't get reverted on next visit.
export function middleware(req: NextRequest) {
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
  // Skip static assets and API routes. Only run on user-facing pages.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|opengraph|og.png|robots.txt|sitemap.xml|manifest|api/).*)",
  ],
};
