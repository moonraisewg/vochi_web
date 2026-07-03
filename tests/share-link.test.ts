import { describe, expect, it } from "vitest";
import { shortId, parseCreateInput, isSocialCrawler } from "../lib/share/shareLink";

describe("shortId", () => {
  it("is 8 url-safe base62 chars", () => {
    expect(shortId()).toMatch(/^[0-9A-Za-z]{8}$/);
  });

  it("does not collide across many draws", () => {
    const ids = new Set(Array.from({ length: 2000 }, () => shortId()));
    expect(ids.size).toBe(2000);
  });
});

describe("parseCreateInput", () => {
  it("accepts a badge payload and nulls the stats fields", () => {
    expect(parseCreateInput({ kind: "badge", badgeKey: "streak_7", lang: "vi" })).toEqual({
      kind: "badge",
      badgeKey: "streak_7",
      streak: null,
      words: null,
      level: null,
      lang: "vi",
    });
  });

  it("rejects an unknown badge key", () => {
    expect(() => parseCreateInput({ kind: "badge", badgeKey: "../nope", lang: "vi" })).toThrow();
  });

  it("rejects a badge payload with no key", () => {
    expect(() => parseCreateInput({ kind: "badge", lang: "vi" })).toThrow();
  });

  it("accepts a stats payload untouched when in range", () => {
    expect(parseCreateInput({ kind: "stats", streak: 13, words: 74, level: 8, lang: "en" })).toEqual({
      kind: "stats",
      badgeKey: null,
      streak: 13,
      words: 74,
      level: 8,
      lang: "en",
    });
  });

  it("clamps a stats payload and defaults a bad lang to vi", () => {
    expect(
      parseCreateInput({ kind: "stats", streak: 999999, words: -3, level: 2.9, lang: "x" }),
    ).toEqual({
      kind: "stats",
      badgeKey: null,
      streak: 3650,
      words: 0,
      level: 2,
      lang: "vi",
    });
  });

  it("rejects an unknown kind", () => {
    expect(() => parseCreateInput({ kind: "video", lang: "vi" })).toThrow();
  });
});

describe("isSocialCrawler", () => {
  it("matches known social/link crawlers", () => {
    for (const ua of [
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "Twitterbot/1.0",
      "WhatsApp/2.23",
      "Slackbot-LinkExpanding 1.0",
      "Discordbot/2.0",
      "TelegramBot (like TwitterBot)",
      "LinkedInBot/1.0",
      "Mozilla/5.0 (compatible; SomeCrawler/2.1; +http://example.com)",
    ]) {
      expect(isSocialCrawler(ua)).toBe(true);
    }
  });

  it("treats a real browser UA as a human", () => {
    expect(
      isSocialCrawler(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ),
    ).toBe(false);
    expect(isSocialCrawler("")).toBe(false);
  });
});
