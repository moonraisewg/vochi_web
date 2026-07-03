import { ImageResponse } from "next/og";
import { parseLang, parseStatsParams } from "@/lib/share/params";
import { loadOgFonts, loadPublicPngDataUri, OG_SIZE, StatsOgImage } from "@/lib/share/og";
import { jsonError, parseApiError, clientIp } from "@/lib/server/http";
import { assertRateLimit } from "@/lib/server/rateLimit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  let props: Parameters<typeof StatsOgImage>[0];
  let fonts: Awaited<ReturnType<typeof loadOgFonts>>;
  try {
    const { searchParams } = new URL(req.url);
    const stats = parseStatsParams({
      streak: searchParams.get("streak") ?? undefined,
      words: searchParams.get("words") ?? undefined,
      level: searchParams.get("level") ?? undefined,
    });
    const lang = parseLang(searchParams.get("lang") ?? undefined);
    assertRateLimit(`og-image:ip:${clientIp(req)}`, 60, 60 * 1000);

    const [loadedFonts, logo, book, level] = await Promise.all([
      loadOgFonts(),
      loadPublicPngDataUri("logo-bird.png"),
      loadPublicPngDataUri("icons", "book.png"),
      loadPublicPngDataUri("icons", "pet.png"),
    ]);
    fonts = loadedFonts;
    props = { stats, logo, lang, book, level };
  } catch (error) {
    const parsed = parseApiError(error);
    return jsonError(parsed.code, parsed.message, parsed.status);
  }

  return new ImageResponse(<StatsOgImage {...props} />, {
    ...OG_SIZE,
    fonts,
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
