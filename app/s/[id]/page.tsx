import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { after } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getBadgeMeta, isBadgeKey } from "@/lib/share/badges";
import { parseLang, type ShareLang } from "@/lib/share/params";
import { buildShareMetadata, shareContent, type ShareCardData } from "@/lib/share/meta";
import { isSocialCrawler } from "@/lib/share/shareLink";
import { ShareBadgeLanding, ShareStatsLanding } from "@/components/ShareLanding";

type Props = { params: Promise<{ id: string }> };

// cache() dedupes the lookup so generateMetadata + the page share ONE query.
const getCard = cache((id: string) => prisma.shareCard.findUnique({ where: { id } }));

type Card = NonNullable<Awaited<ReturnType<typeof getCard>>>;

// Row → the shape shareContent understands. Integrity is app-enforced, so guard
// defensively: a badge row without a valid key is treated as not-found.
function cardData(card: Card): ShareCardData | null {
  const lang: ShareLang = parseLang(card.lang);
  if (card.kind === "badge") {
    if (!card.badgeKey || !isBadgeKey(card.badgeKey)) return null;
    return { kind: "badge", badgeKey: card.badgeKey, lang };
  }
  return {
    kind: "stats",
    stats: { streak: card.streak ?? 0, words: card.words ?? 0, level: card.level ?? 0 },
    lang,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) return {};
  const data = cardData(card);
  if (!data) return {};
  // canonical = /s/<id> (this short link itself), never the layout's site root.
  return buildShareMetadata({ ...shareContent(data), canonical: `/s/${id}` });
}

export default async function ShareShortPage({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) notFound();
  const data = cardData(card);
  if (!data) notFound();

  // Count human opens only (skip social crawlers scraping OG tags). Run after
  // the response streams so it never blocks render, and survive serverless via
  // after(); a counter failure must not break the page.
  const ua = (await headers()).get("user-agent") ?? "";
  if (!isSocialCrawler(ua)) {
    after(async () => {
      try {
        await prisma.shareCard.update({
          where: { id },
          data: { clickCount: { increment: 1 } },
        });
      } catch {
        /* best-effort vanity counter */
      }
    });
  }

  return data.kind === "badge" ? (
    <ShareBadgeLanding badgeKey={data.badgeKey} meta={getBadgeMeta(data.badgeKey)} />
  ) : (
    <ShareStatsLanding stats={data.stats} />
  );
}
