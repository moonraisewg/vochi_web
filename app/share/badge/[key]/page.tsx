import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBadgeMeta, isBadgeKey } from "@/lib/share/badges";
import { badgeShareUrl, parseLang } from "@/lib/share/params";
import { ShareBadgeLanding } from "@/components/ShareLanding";

type Props = {
  params: Promise<{ key: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { key } = await params;
  if (!isBadgeKey(key)) return {};
  const lang = parseLang((await searchParams).lang);
  const meta = getBadgeMeta(key);
  const title =
    lang === "en"
      ? `Achievement unlocked: ${meta.name.en}`
      : `Mở khóa thành tựu: ${meta.name.vi}`;
  const description =
    lang === "en"
      ? `${meta.desc.en} — learning vocabulary with a tiny desktop pet on Vô chi.`
      : `${meta.desc.vi} — học từ vựng cùng thú nhỏ trên màn hình với Vô chi.`;
  const ogImage = `/api/og/badge?key=${key}&lang=${lang}`;
  // Override the root layout's canonical (site root) with this page's own URL,
  // or Facebook unfurls the link into the homepage card instead of the badge.
  const selfUrl = badgeShareUrl(key, lang);
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.name[lang] }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ShareBadgePage({ params }: Props) {
  const { key } = await params;
  if (!isBadgeKey(key)) notFound();
  return <ShareBadgeLanding badgeKey={key} meta={getBadgeMeta(key)} />;
}
