import { describe, expect, it } from "vitest";
import { buildFeed } from "../lib/tips/feed";
import { listMdPosts } from "../lib/tips/loader";

describe("RSS feed", () => {
  it("liệt kê đủ bài của đúng ngôn ngữ đó", () => {
    const xml = buildFeed("vi");
    const items = xml.match(/<item>/g) ?? [];
    expect(items.length).toBe(listMdPosts("vi").length);
    for (const post of listMdPosts("vi")) {
      expect(xml).toContain(`https://vochi.xyz/tips/${post.slug}`);
    }
    expect(xml).not.toContain("?lang=en");
  });

  it("bản EN trỏ URL có ?lang=en", () => {
    const xml = buildFeed("en");
    expect(xml).toContain("?lang=en");
    expect((xml.match(/<item>/g) ?? []).length).toBe(listMdPosts("en").length);
  });

  it("escape ký tự XML thay vì đẻ ra feed hỏng", () => {
    const xml = buildFeed("vi");
    // Không còn & trần (đã thành &amp;) và không có < lọt khỏi thẻ.
    expect(xml).not.toMatch(/&(?!(amp|lt|gt|quot|apos);)/);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain("<rss version=\"2.0\"");
  });

  it("pubDate là RFC 822, thứ Google/RSS reader hiểu", () => {
    const xml = buildFeed("vi");
    const dates = xml.match(/<pubDate>([^<]+)<\/pubDate>/g) ?? [];
    expect(dates.length).toBeGreaterThan(0);
    for (const d of dates) {
      expect(d).toMatch(/<pubDate>\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/);
    }
  });
});
