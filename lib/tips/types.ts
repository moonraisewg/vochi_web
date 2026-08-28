import type { SeoLang } from "@/lib/seo/pageMeta";

// Bodies are pre-rendered HTML strings (loader.ts owns the parse). Server pages
// dangerouslySetInnerHTML — no client-side markdown parser ships in the bundle.
export type Post = {
  slug: string;
  lang: SeoLang;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  tags: string[];
  bodyHtml: string;
};
