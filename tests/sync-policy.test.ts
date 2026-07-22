import { describe, it, expect } from "vitest";
import {
  pushEventsSchema,
  pullChangesSchema,
  cardsPushSchema,
  normalizeWord,
} from "../lib/server/syncPolicy";

function ev(over: Record<string, unknown> = {}) {
  return {
    eventId: "11111111-1111-1111-1111-111111111111",
    eventType: "review",
    cardUid: "card-1",
    rating: 3,
    occurredAt: "2026-07-07T10:00:00.000Z",
    ...over,
  };
}

describe("pushEventsSchema", () => {
  it("accepts a well-formed review batch", () => {
    const out = pushEventsSchema.parse({ events: [ev()] });
    expect(out.events[0].eventType).toBe("review");
  });

  it("accepts master/unmaster events without a rating", () => {
    expect(() =>
      pushEventsSchema.parse({ events: [ev({ eventType: "master", rating: undefined })] }),
    ).not.toThrow();
  });

  it("rejects a review event with no rating", () => {
    expect(() => pushEventsSchema.parse({ events: [ev({ rating: undefined })] })).toThrow();
  });

  it("rejects a master event carrying a rating", () => {
    expect(() =>
      pushEventsSchema.parse({ events: [ev({ eventType: "master", rating: 3 })] }),
    ).toThrow();
  });

  it("rejects a rating out of 1..4", () => {
    expect(() => pushEventsSchema.parse({ events: [ev({ rating: 5 })] })).toThrow();
  });

  it("rejects an unknown eventType", () => {
    expect(() => pushEventsSchema.parse({ events: [ev({ eventType: "delete" })] })).toThrow();
  });

  it("rejects an empty batch", () => {
    expect(() => pushEventsSchema.parse({ events: [] })).toThrow();
  });

  it("rejects a batch larger than 1000", () => {
    const events = Array.from({ length: 1001 }, (_, i) => ev({ eventId: `evt-${i}` }));
    expect(() => pushEventsSchema.parse({ events })).toThrow();
  });

  it("rejects a non-ISO occurredAt", () => {
    expect(() => pushEventsSchema.parse({ events: [ev({ occurredAt: "not-a-date" })] })).toThrow();
  });
});

describe("pullChangesSchema", () => {
  it("accepts since = 0", () => {
    expect(pullChangesSchema.parse({ since: 0 }).since).toBe(0);
  });
  it("accepts a positive integer since", () => {
    expect(pullChangesSchema.parse({ since: 42 }).since).toBe(42);
  });
  it("rejects a negative since", () => {
    expect(() => pullChangesSchema.parse({ since: -1 })).toThrow();
  });
  it("rejects a non-integer since", () => {
    expect(() => pullChangesSchema.parse({ since: 1.5 })).toThrow();
  });
  it("rejects a missing since", () => {
    expect(() => pullChangesSchema.parse({})).toThrow();
  });
});

describe("normalizeWord", () => {
  it("trims, lowercases, and NFC-normalizes", () => {
    expect(normalizeWord("  Hello  ")).toBe("hello");
    expect(normalizeWord("CAFÉ")).toBe("café");
  });
  it("is idempotent", () => {
    expect(normalizeWord(normalizeWord("  Hello "))).toBe("hello");
  });
});

describe("cardsPushSchema", () => {
  function card(over: Record<string, unknown> = {}) {
    return {
      cardUid: "u1",
      word: "hello",
      language: "en",
      meaning: "xin chào",
      clientUpdatedAt: "2026-07-07T10:00:00.000Z",
      ...over,
    };
  }
  it("accepts a well-formed batch", () => {
    expect(cardsPushSchema.parse({ cards: [card()] }).cards.length).toBe(1);
  });
  it("accepts a card with deletedAt (a delete)", () => {
    expect(() =>
      cardsPushSchema.parse({ cards: [card({ deletedAt: "2026-07-07T11:00:00.000Z" })] }),
    ).not.toThrow();
  });
  it("rejects an empty batch", () => {
    expect(() => cardsPushSchema.parse({ cards: [] })).toThrow();
  });
  it("rejects a batch larger than 1000", () => {
    const cards = Array.from({ length: 1001 }, (_, i) => card({ cardUid: `u${i}` }));
    expect(() => cardsPushSchema.parse({ cards })).toThrow();
  });
  it("rejects a missing clientUpdatedAt", () => {
    expect(() => cardsPushSchema.parse({ cards: [card({ clientUpdatedAt: undefined })] })).toThrow();
  });
  it("rejects a missing word", () => {
    expect(() => cardsPushSchema.parse({ cards: [card({ word: undefined })] })).toThrow();
  });
  it("strips a body-supplied normalizedWord (derived server-side)", () => {
    const out = cardsPushSchema.parse({ cards: [card({ normalizedWord: "HACKED" })] });
    expect((out.cards[0] as Record<string, unknown>).normalizedWord).toBeUndefined();
  });
});
