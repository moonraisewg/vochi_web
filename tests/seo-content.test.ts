import { describe, expect, it, vi } from "vitest";
import sitemap from "../app/sitemap";
import { loadAllPosts } from "../lib/tips/loader";
import { relatedPosts } from "../lib/tips/related";
import { ogImagePath, postUrl } from "../lib/tips/urls";

// Giới hạn Google cắt chuỗi trên SERP. Vượt là mất chữ, không phải lỗi build,
// nên không có test thì không ai thấy.
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

const posts = loadAllPosts();

describe("nội dung blog", () => {
  it("có bài để kiểm", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it.each(posts.map((p) => [p.slug, p] as const))("%s khai đủ frontmatter", (_slug, post) => {
    expect(post.title.trim()).not.toBe("");
    expect(post.description.trim()).not.toBe("");
    expect(post.bodyHtml.trim()).not.toBe("");
    expect(post.tags.length).toBeGreaterThan(0);
    expect(post.keywords.length).toBeGreaterThan(0);
    expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    if (post.updatedAt) {
      expect(post.updatedAt >= post.publishedAt).toBe(true);
    }
  });

  it.each(posts.map((p) => [p.slug, p] as const))("%s vừa khung SERP", (_slug, post) => {
    expect(post.metaTitle.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(post.metaDescription.length).toBeGreaterThanOrEqual(DESC_MIN);
    expect(post.metaDescription.length).toBeLessThanOrEqual(DESC_MAX);
  });

  it("không trùng slug, title hay description", () => {
    for (const key of ["slug", "title", "description"] as const) {
      const seen = posts.map((p) => p[key]);
      expect(new Set(seen).size, `trùng ${key}`).toBe(seen.length);
    }
  });
});

describe("liên kết nội bộ", () => {
  it.each(posts.map((p) => [p.slug, p] as const))("%s không mồ côi", (_slug, post) => {
    const related = relatedPosts(post, posts);
    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.every((r) => r.lang === post.lang)).toBe(true);
    expect(related.some((r) => r.slug === post.slug)).toBe(false);
  });
});

describe("ảnh OG", () => {
  it("mỗi bài một ảnh riêng", () => {
    const paths = posts.map(ogImagePath);
    expect(new Set(paths).size).toBe(posts.length);
    expect(paths.every((p) => p.startsWith("/og/tips/"))).toBe(true);
  });
});

describe("sitemap", () => {
  it("không có URL trùng", () => {
    const urls = sitemap().map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("có đủ mọi bài, đúng URL canonical của bài đó", () => {
    const urls = new Set(sitemap().map((e) => e.url));
    for (const post of posts) {
      expect(urls.has(postUrl(post)), `thiếu ${post.slug}`).toBe(true);
    }
  });

  it("lastmod của bài là ngày của bài, không phải lúc build", () => {
    const bySlug = new Map(sitemap().map((e) => [e.url, e.lastModified]));
    for (const post of posts) {
      const expected = post.updatedAt ?? post.publishedAt;
      expect(String(bySlug.get(postUrl(post))).startsWith(expected)).toBe(true);
    }
  });

  it("không đổi chỉ vì build lại lúc khác", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const first = JSON.stringify(sitemap());
      vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));
      const second = JSON.stringify(sitemap());
      expect(second).toBe(first);
    } finally {
      vi.useRealTimers();
    }
  });
});
