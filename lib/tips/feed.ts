import type { SeoLang } from "@/lib/seo/pageMeta";
import { listMdPosts } from "./loader";
import { SITE_URL, postUrl } from "./urls";

const CHANNEL = {
  vi: {
    title: "Vô chi · Mẹo học tiếng Anh",
    description: "Bài viết ngắn về học từ vựng, IELTS, TOEIC bằng spaced repetition.",
    language: "vi-VN",
  },
  en: {
    title: "Vô chi · Learn Chinese tips",
    description: "Short, actionable posts on HSK vocabulary, characters, and spaced repetition.",
    language: "en-US",
  },
} as const;

/** Escape cho nội dung text trong XML. Thiếu bước này là một dấu & trong tiêu đề
 *  đủ làm cả feed không parse được — và RSS reader im lặng bỏ qua, không báo lỗi. */
function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 muốn RFC 822; frontmatter chỉ có YYYY-MM-DD. */
function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function feedPath(lang: SeoLang): string {
  return lang === "en" ? "/feed.en.xml" : "/feed.xml";
}

export function buildFeed(lang: SeoLang): string {
  const channel = CHANNEL[lang];
  const posts = listMdPosts(lang);
  const self = `${SITE_URL}${feedPath(lang)}`;
  const items = posts
    .map((post) => {
      const url = postUrl(post);
      return [
        "    <item>",
        `      <title>${xml(post.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        `      <description>${xml(post.description)}</description>`,
        `      <pubDate>${rfc822(post.updatedAt ?? post.publishedAt)}</pubDate>`,
        ...post.tags.map((tag) => `      <category>${xml(tag)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${xml(channel.title)}</title>`,
    `    <link>${SITE_URL}/tips${lang === "en" ? "?lang=en" : ""}</link>`,
    `    <description>${xml(channel.description)}</description>`,
    `    <language>${channel.language}</language>`,
    `    <atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
