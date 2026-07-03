import { describe, expect, it } from "vitest";
import { shareContent, buildShareMetadata } from "../lib/share/meta";
import { getBadgeMeta } from "../lib/share/badges";

describe("shareContent", () => {
  it("builds badge content (vi) pointing at the badge OG image", () => {
    const c = shareContent({ kind: "badge", badgeKey: "streak_7", lang: "vi" });
    expect(c.title).toBe(`Mở khóa thành tựu: ${getBadgeMeta("streak_7").name.vi}`);
    expect(c.ogImage).toBe("/api/og/badge?key=streak_7&lang=vi");
    expect(c.alt).toBe(getBadgeMeta("streak_7").name.vi);
  });

  it("builds badge content (en)", () => {
    const c = shareContent({ kind: "badge", badgeKey: "streak_7", lang: "en" });
    expect(c.title).toBe(`Achievement unlocked: ${getBadgeMeta("streak_7").name.en}`);
    expect(c.ogImage).toBe("/api/og/badge?key=streak_7&lang=en");
  });

  it("builds stats content (vi) pointing at the stats OG image", () => {
    const c = shareContent({ kind: "stats", stats: { streak: 5, words: 42, level: 3 }, lang: "vi" });
    expect(c.title).toBe("Chuỗi 5 ngày · 42 từ đã học");
    expect(c.ogImage).toBe("/api/og/stats?streak=5&words=42&level=3&lang=vi");
  });

  it("builds stats content (en)", () => {
    const c = shareContent({ kind: "stats", stats: { streak: 5, words: 42, level: 3 }, lang: "en" });
    expect(c.title).toBe("5-day streak · 42 words learned");
  });
});

describe("buildShareMetadata", () => {
  it("self-canonicals and sets og:url to the page's own url", () => {
    const md = buildShareMetadata({
      title: "T",
      description: "D",
      ogImage: "/api/og/stats?streak=1",
      alt: "T",
      canonical: "/s/abc123",
    });
    expect(md.alternates?.canonical).toBe("/s/abc123");
    expect(md.openGraph?.url).toBe("/s/abc123");
    const images = md.openGraph?.images as Array<{ url: string }>;
    expect(images?.[0]?.url).toBe("/api/og/stats?streak=1");
    expect(md.twitter && "card" in md.twitter ? md.twitter.card : undefined).toBe(
      "summary_large_image",
    );
    expect(md.robots && typeof md.robots === "object" ? md.robots.index : undefined).toBe(false);
  });
});
