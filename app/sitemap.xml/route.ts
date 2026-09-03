import { listPosts } from "@/lib/tips/posts";
import { postsForTopic, TOPICS, topicKeys } from "@/lib/tips/topics";
import { postUrl } from "@/lib/tips/urls";

// Handcrafted so element order strictly matches sitemaps.org 0.9 XSD
// (loc → lastmod → extension) instead of Next's built-in generator, which
// emits xhtml:link between <loc> and <lastmod> and fails strict validators.
// <changefreq> and <priority> are omitted on purpose — Google has ignored
// both since 2015 (see: developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping).

export const dynamic = "force-static";
export const revalidate = 3600;

const SITE_URL = "https://vochi.xyz";

type Entry = { path: string; lastModified: string };
const ENTRIES: Entry[] = [
  { path: "", lastModified: "2026-08-29" },
  { path: "/download", lastModified: "2026-08-27" },
  { path: "/pricing", lastModified: "2026-08-28" },
  { path: "/tips", lastModified: "2026-08-27" },
  { path: "/docs", lastModified: "2026-08-27" },
  { path: "/changelog", lastModified: "2026-08-27" },
  { path: "/privacy", lastModified: "2026-08-27" },
  { path: "/terms", lastModified: "2026-08-27" },
];

const withSlash = (p: string): string => (p === "" ? "/" : p);
const viUrl = (p: string) => `${SITE_URL}${withSlash(p)}`;
const enUrl = (p: string) => {
  const path = withSlash(p);
  return `${SITE_URL}${path}${path.includes("?") ? "&" : "?"}lang=en`;
};

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};
function xml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => XML_ESCAPES[c]);
}

type Alt = [hreflang: string, href: string];

function urlBlock(loc: string, lastmod: string, alts: Alt[] = []): string {
  const altLines = alts
    .map(
      ([lang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${xml(lang)}" href="${xml(href)}"/>`,
    )
    .join("\n");
  return `  <url>
    <loc>${xml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>${altLines ? "\n" + altLines : ""}
  </url>`;
}

function isoOfPost(publishedAt: string, updatedAt?: string): string {
  const raw = updatedAt ?? publishedAt;
  // Frontmatter usually has YYYY-MM-DD; keep the short form so the sitemap
  // does not lie about a sub-second precision that does not exist.
  return raw.length <= 10 ? raw : raw.slice(0, 10);
}

function newestDate(
  posts: Array<{ publishedAt: string; updatedAt?: string }>,
): string | null {
  const dates = posts.map((post) => isoOfPost(post.publishedAt, post.updatedAt)).sort();
  return dates.at(-1) ?? null;
}

export function buildSitemap(): string {
  const blocks: string[] = [];
  const allPosts = [...listPosts("vi"), ...listPosts("en")];
  const newestPost = newestDate(allPosts);

  for (const { path, lastModified } of ENTRIES) {
    const alts: Alt[] = [
      ["vi-VN", viUrl(path)],
      ["en-US", enUrl(path)],
      ["x-default", viUrl(path)],
    ];
    const stamp = path === "/tips" ? (newestPost ?? lastModified) : lastModified;
    blocks.push(urlBlock(viUrl(path), stamp, alts));
    blocks.push(urlBlock(enUrl(path), stamp, alts));
  }

  // This PDF page only exists in Vietnamese, so it has no EN alternate.
  blocks.push(urlBlock(viUrl("/tai-lieu"), "2026-08-17"));

  // Topic hubs are single-lang; no cross-lang alt exists.
  for (const key of topicKeys()) {
    const topic = TOPICS[key];
    const url =
      topic.lang === "en"
        ? `${SITE_URL}${topic.path}?lang=en`
        : `${SITE_URL}${topic.path}`;
    blocks.push(urlBlock(url, newestDate(postsForTopic(topic)) ?? "2026-08-27"));
  }

  // Blog posts: each in its own lang, native URL only.
  for (const post of allPosts) {
    blocks.push(urlBlock(postUrl(post), isoOfPost(post.publishedAt, post.updatedAt)));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join("\n")}
</urlset>
`;
}

export function GET() {
  return new Response(buildSitemap(), {
    headers: {
      "content-type": "application/xml; charset=UTF-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
