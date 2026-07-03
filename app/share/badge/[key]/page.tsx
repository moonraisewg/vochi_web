import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBadgeMeta, isBadgeKey } from "@/lib/share/badges";
import { badgeShareUrl, parseLang } from "@/lib/share/params";
import { buildShareMetadata, shareContent } from "@/lib/share/meta";
import { ShareBadgeLanding } from "@/components/ShareLanding";

type Props = {
  params: Promise<{ key: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { key } = await params;
  if (!isBadgeKey(key)) return {};
  const lang = parseLang((await searchParams).lang);
  // canonical = this page's own URL (not the layout's site-root canonical),
  // else Facebook unfurls the link into the homepage card. See lib/share/meta.
  return buildShareMetadata({
    ...shareContent({ kind: "badge", badgeKey: key, lang }),
    canonical: badgeShareUrl(key, lang),
  });
}

export default async function ShareBadgePage({ params }: Props) {
  const { key } = await params;
  if (!isBadgeKey(key)) notFound();
  return <ShareBadgeLanding badgeKey={key} meta={getBadgeMeta(key)} />;
}
