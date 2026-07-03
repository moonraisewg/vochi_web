// Single source of truth for share-page metadata (title/description/OG image)
// and the Next Metadata object, shared by /share/badge, /share/stats and
// /s/[id]. Centralizing this keeps the self-canonical fix (openGraph.url +
// alternates.canonical = the page's own url) applied everywhere — without it
// Facebook collapses shared links into the homepage OG card.
import type { Metadata } from "next";
import { getBadgeMeta } from "./badges";
import type { ShareLang, ShareStats } from "./params";

export type ShareCardData =
  | { kind: "badge"; badgeKey: string; lang: ShareLang }
  | { kind: "stats"; stats: ShareStats; lang: ShareLang };

export interface ShareContent {
  title: string;
  description: string;
  ogImage: string;
  alt: string;
}

/** Content (copy + OG image url) derived purely from the share payload. */
export function shareContent(data: ShareCardData): ShareContent {
  if (data.kind === "badge") {
    const meta = getBadgeMeta(data.badgeKey);
    const title =
      data.lang === "en"
        ? `Achievement unlocked: ${meta.name.en}`
        : `Mở khóa thành tựu: ${meta.name.vi}`;
    const description =
      data.lang === "en"
        ? `${meta.desc.en} — learning vocabulary with a tiny desktop pet on Vô chi.`
        : `${meta.desc.vi} — học từ vựng cùng thú nhỏ trên màn hình với Vô chi.`;
    return {
      title,
      description,
      ogImage: `/api/og/badge?key=${data.badgeKey}&lang=${data.lang}`,
      alt: meta.name[data.lang],
    };
  }
  const { streak, words, level } = data.stats;
  const title =
    data.lang === "en"
      ? `${streak}-day streak · ${words} words learned`
      : `Chuỗi ${streak} ngày · ${words} từ đã học`;
  const description =
    data.lang === "en"
      ? "Learning vocabulary with a tiny desktop pet on Vô chi."
      : "Học từ vựng cùng thú nhỏ trên màn hình với Vô chi.";
  const query = new URLSearchParams({
    streak: String(streak),
    words: String(words),
    level: String(level),
    lang: data.lang,
  });
  return { title, description, ogImage: `/api/og/stats?${query.toString()}`, alt: title };
}

/** Assemble the full Next Metadata, self-canonicaled to `canonical`. */
export function buildShareMetadata(input: ShareContent & { canonical: string }): Metadata {
  const { title, description, ogImage, alt, canonical } = input;
  return {
    title,
    description,
    // Share pages are unfurl targets, not search content.
    robots: { index: false, follow: true },
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}
