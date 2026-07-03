import { ImageResponse } from "next/og";
import { getBadgeMeta, isBadgeKey } from "@/lib/share/badges";
import { parseLang } from "@/lib/share/params";
import { BadgeOgImage, loadOgFonts, loadPublicPngDataUri, OG_SIZE } from "@/lib/share/og";
import { jsonError, parseApiError, clientIp } from "@/lib/server/http";
import { assertRateLimit } from "@/lib/server/rateLimit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  let props: Parameters<typeof BadgeOgImage>[0];
  let fonts: Awaited<ReturnType<typeof loadOgFonts>>;
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key") ?? "";
    if (!isBadgeKey(key)) return jsonError("NotFound", "Unknown badge", 404);
    const lang = parseLang(searchParams.get("lang") ?? undefined);
    assertRateLimit(`og-image:ip:${clientIp(req)}`, 60, 60 * 1000);

    const [loadedFonts, logo, badge] = await Promise.all([
      loadOgFonts(),
      loadPublicPngDataUri("logo-bird.png"),
      loadPublicPngDataUri("badges", `${key}.png`),
    ]);
    fonts = loadedFonts;
    props = { meta: getBadgeMeta(key), badge, logo, lang };
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }

  return new ImageResponse(<BadgeOgImage {...props} />, {
    ...OG_SIZE,
    fonts,
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
