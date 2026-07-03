import { describe, expect, it } from "vitest";
import { parseStatsParams, parseLang, badgeShareUrl, statsShareUrl } from "../lib/share/params";
import { BADGE_KEYS, isBadgeKey, getBadgeMeta } from "../lib/share/badges";

describe("badge catalog", () => {
  it("contains all 30 badge keys", () => {
    expect(BADGE_KEYS).toHaveLength(30);
  });

  it("accepts known keys and rejects unknown ones", () => {
    expect(isBadgeKey("streak_7")).toBe(true);
    expect(isBadgeKey("comeback")).toBe(true);
    expect(isBadgeKey("nope")).toBe(false);
    expect(isBadgeKey("../etc/passwd")).toBe(false);
    expect(isBadgeKey("")).toBe(false);
  });

  it("has bilingual name and description for every key", () => {
    for (const key of BADGE_KEYS) {
      const meta = getBadgeMeta(key);
      expect(meta.name.en.length).toBeGreaterThan(0);
      expect(meta.name.vi.length).toBeGreaterThan(0);
      expect(meta.desc.en.length).toBeGreaterThan(0);
      expect(meta.desc.vi.length).toBeGreaterThan(0);
    }
  });
});

describe("parseStatsParams", () => {
  it("passes through valid values", () => {
    expect(parseStatsParams({ streak: "5", words: "42", level: "3" })).toEqual({
      streak: 5,
      words: 42,
      level: 3,
    });
  });

  it("defaults missing or non-numeric values to 0", () => {
    expect(parseStatsParams({})).toEqual({ streak: 0, words: 0, level: 0 });
    expect(parseStatsParams({ streak: "abc", words: undefined, level: "1e3" })).toEqual({
      streak: 0,
      words: 0,
      level: 0,
    });
  });

  it("clamps negatives to 0 and huge values to the caps", () => {
    expect(parseStatsParams({ streak: "-4", words: "-1", level: "-9" })).toEqual({
      streak: 0,
      words: 0,
      level: 0,
    });
    expect(parseStatsParams({ streak: "999999", words: "99999999", level: "5000" })).toEqual({
      streak: 3650,
      words: 99999,
      level: 999,
    });
  });

  it("floors fractional values", () => {
    expect(parseStatsParams({ streak: "5.9", words: "1.2", level: "2.5" })).toEqual({
      streak: 5,
      words: 1,
      level: 2,
    });
  });

  it("takes the first value when a param repeats (string array)", () => {
    expect(parseStatsParams({ streak: ["7", "9"], words: "1", level: "1" })).toEqual({
      streak: 7,
      words: 1,
      level: 1,
    });
  });
});

describe("parseLang", () => {
  it("accepts en and vi, defaults everything else to vi", () => {
    expect(parseLang("en")).toBe("en");
    expect(parseLang("vi")).toBe("vi");
    expect(parseLang("fr")).toBe("vi");
    expect(parseLang(undefined)).toBe("vi");
    expect(parseLang(["en", "vi"])).toBe("en");
  });
});

// Self-canonical URLs. The root layout sets alternates.canonical = site root;
// share pages MUST override it (and set og:url) to their own URL, or Facebook
// collapses every shared link back to the homepage OG card.
describe("share self-URLs (canonical / og:url)", () => {
  it("badge self-url points to the badge page, never the site root", () => {
    expect(badgeShareUrl("streak_7", "vi")).toBe("/share/badge/streak_7?lang=vi");
    expect(badgeShareUrl("master_1", "en")).toBe("/share/badge/master_1?lang=en");
  });

  it("stats self-url carries the stat params so each card is its own object", () => {
    expect(statsShareUrl({ streak: 5, words: 42, level: 3 }, "vi")).toBe(
      "/share/stats?streak=5&words=42&level=3&lang=vi",
    );
    expect(statsShareUrl({ streak: 0, words: 0, level: 0 }, "en")).toBe(
      "/share/stats?streak=0&words=0&level=0&lang=en",
    );
  });
});
