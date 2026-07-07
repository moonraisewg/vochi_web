import { describe, it, expect } from "vitest";
import { pushEventsSchema } from "../lib/server/syncPolicy";

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
