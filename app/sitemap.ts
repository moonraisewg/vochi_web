import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/tips/posts";
import { TOPICS, topicKeys } from "@/lib/tips/topics";

const SITE_URL = "https://vochi.xyz";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

const ENTRIES: Entry[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/download", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/tips", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/changelog", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

const enUrl = (path: string) => `${SITE_URL}${path}${path.includes("?") ? "&" : "?"}lang=en`;
const viUrl = (path: string) => `${SITE_URL}${path || "/"}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority, changeFrequency } of ENTRIES) {
    const languages = {
      "vi-VN": viUrl(path),
      "en-US": enUrl(path),
      "x-default": viUrl(path),
    };
    entries.push({
      url: viUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
    });
    entries.push({
      url: enUrl(path),
      lastModified: now,
      changeFrequency,
      priority: Math.max(0.1, priority - 0.1),
      alternates: { languages },
    });
  }

  // Keyword-rich topic hubs. Single-lang, own canonical URL, no cross-lang alt.
  for (const key of topicKeys()) {
    const topic = TOPICS[key];
    const url =
      topic.lang === "en"
        ? `${SITE_URL}${topic.path}?lang=en`
        : `${SITE_URL}${topic.path}`;
    entries.push({
      url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Blog posts are single-lang (VI post or EN post). Emit each at its native
  // URL. Google understands the alt is the /tips index in the other lang,
  // not a machine-translated version we don't have.
  for (const post of [...listPosts("vi"), ...listPosts("en")]) {
    const path = `/tips/${post.slug}`;
    entries.push({
      url: post.lang === "en" ? enUrl(path) : viUrl(path),
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
