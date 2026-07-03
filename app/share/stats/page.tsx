import type { Metadata } from "next";
import { parseLang, parseStatsParams, statsShareUrl } from "@/lib/share/params";
import { buildShareMetadata, shareContent } from "@/lib/share/meta";
import { ShareStatsLanding } from "@/components/ShareLanding";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const raw = await searchParams;
  const stats = parseStatsParams(raw);
  const lang = parseLang(raw.lang);
  // canonical = this page's own URL (not the layout's site-root canonical),
  // else Facebook unfurls the link into the homepage card. See lib/share/meta.
  return buildShareMetadata({
    ...shareContent({ kind: "stats", stats, lang }),
    canonical: statsShareUrl(stats, lang),
  });
}

export default async function ShareStatsPage({ searchParams }: Props) {
  const stats = parseStatsParams(await searchParams);
  return <ShareStatsLanding stats={stats} />;
}
