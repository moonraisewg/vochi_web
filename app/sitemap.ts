import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/tips/posts";
import { postsForTopic, TOPICS, topicKeys } from "@/lib/tips/topics";
import { postUrl } from "@/lib/tips/urls";

const SITE_URL = "https://vochi.xyz";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** Ngày trang đổi nội dung lần cuối (YYYY-MM-DD).
   *
   *  CỐ Ý khai tay thay vì `new Date()`: một sitemap báo "cả site vừa đổi" sau
   *  mỗi lần deploy là cách nhanh nhất để Google học cách bỏ qua lastmod của
   *  mình. Sửa trang nào thì đổi ngày trang đó. Các trang do nội dung sinh ra
   *  (/tips, hub chủ đề, bài viết) lấy ngày từ chính bài, không khai ở đây. */
  lastModified: string;
};

/** Ngày của bài mới nhất trong danh sách — lastmod cho trang tổng hợp. */
function newestDate(posts: Array<{ publishedAt: string; updatedAt?: string }>): string | null {
  const dates = posts.map((p) => p.updatedAt ?? p.publishedAt).sort();
  return dates.length ? dates[dates.length - 1] : null;
}

const ENTRIES: Entry[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly", lastModified: "2026-08-27" },
  { path: "/download", priority: 0.9, changeFrequency: "weekly", lastModified: "2026-08-27" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-27" },
  { path: "/tips", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-08-27" },
  { path: "/docs", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-08-27" },
  { path: "/changelog", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-08-27" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-08-27" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-08-27" },
];

// Root path "" becomes "/" so the EN alt for the homepage is
// https://vochi.xyz/?lang=en (matches the canonical the page sets),
// not https://vochi.xyz?lang=en which mismatched and made Google flag the
// alternate/canonical pair as inconsistent.
const withSlash = (path: string): string => (path === "" ? "/" : path);
const enUrl = (path: string) => {
  const p = withSlash(path);
  return `${SITE_URL}${p}${p.includes("?") ? "&" : "?"}lang=en`;
};
const viUrl = (path: string) => `${SITE_URL}${withSlash(path)}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  // /tips liệt kê bài nên nó "đổi" khi có bài mới, không phải khi deploy.
  const newestPost = newestDate([...listPosts("vi"), ...listPosts("en")]);

  for (const { path, priority, changeFrequency, lastModified } of ENTRIES) {
    const languages = {
      "vi-VN": viUrl(path),
      "en-US": enUrl(path),
      "x-default": viUrl(path),
    };
    const stamp = path === "/tips" ? (newestPost ?? lastModified) : lastModified;
    entries.push({
      url: viUrl(path),
      lastModified: stamp,
      changeFrequency,
      priority,
      alternates: { languages },
    });
    entries.push({
      url: enUrl(path),
      lastModified: stamp,
      changeFrequency,
      priority: Math.max(0.1, priority - 0.1),
      alternates: { languages },
    });
  }

  // Trang tài liệu chỉ có bản tiếng Việt (PDF là nội dung tiếng Việt), nên phát
  // một URL duy nhất, không kèm alt ?lang=en — layout của nó đặt canonical là
  // "/tai-lieu", một alt EN sẽ lệch canonical đúng kiểu mà chú thích ở trên cảnh báo.
  entries.push({
    url: viUrl("/tai-lieu"),
    lastModified: "2026-08-17",
    changeFrequency: "monthly",
    priority: 0.8,
  });

  // Keyword-rich topic hubs. Single-lang, own canonical URL, no cross-lang alt.
  for (const key of topicKeys()) {
    const topic = TOPICS[key];
    const url =
      topic.lang === "en"
        ? `${SITE_URL}${topic.path}?lang=en`
        : `${SITE_URL}${topic.path}`;
    entries.push({
      url,
      lastModified: newestDate(postsForTopic(topic)) ?? "2026-08-27",
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Blog posts are single-lang (VI post or EN post). Emit each at its native
  // URL. Google understands the alt is the /tips index in the other lang,
  // not a machine-translated version we don't have.
  for (const post of [...listPosts("vi"), ...listPosts("en")]) {
    entries.push({
      url: postUrl(post),
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
