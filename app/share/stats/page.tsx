import type { Metadata } from "next";
import { parseLang, parseStatsParams, statsShareUrl } from "@/lib/share/params";
import { ShareStatsLanding } from "@/components/ShareLanding";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const raw = await searchParams;
  const stats = parseStatsParams(raw);
  const lang = parseLang(raw.lang);
  const title =
    lang === "en"
      ? `${stats.streak}-day streak · ${stats.words} words learned`
      : `Chuỗi ${stats.streak} ngày · ${stats.words} từ đã học`;
  const description =
    lang === "en"
      ? "Learning vocabulary with a tiny desktop pet on Vô chi."
      : "Học từ vựng cùng thú nhỏ trên màn hình với Vô chi.";
  const query = new URLSearchParams({
    streak: String(stats.streak),
    words: String(stats.words),
    level: String(stats.level),
    lang,
  });
  const ogImage = `/api/og/stats?${query.toString()}`;
  // Override the root layout's canonical (site root) with this page's own URL,
  // or Facebook unfurls the link into the homepage card instead of the stats card.
  const selfUrl = statsShareUrl(stats, lang);
  return {
    title,
    description,
    // Share pages are unfurl targets, not search content.
    robots: { index: false, follow: true },
    alternates: { canonical: selfUrl },
    openGraph: {
      type: "website",
      url: selfUrl,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ShareStatsPage({ searchParams }: Props) {
  const stats = parseStatsParams(await searchParams);
  return <ShareStatsLanding stats={stats} />;
}
