import type { Metadata } from "next";
import { buildPageMetadata, resolveSeoLang } from "@/lib/seo/pageMeta";
import HomeClient from "./page-client";

type Props = { searchParams: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = await resolveSeoLang((await searchParams).lang);
  return buildPageMetadata("home", "/", lang);
}

export default function Page() {
  return <HomeClient />;
}
