import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/server/prisma";

const hasDb = !!process.env.TEST_DATABASE_URL;

async function reset() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "SyncEvent", "SyncVocabCard", "SyncCursor", "User" RESTART IDENTITY CASCADE',
  );
}

async function seedUser(email: string) {
  return prisma.user.create({ data: { email, passwordHash: "x", emailVerifiedAt: new Date() } });
}

function reviewEvent(userId: string, usn: number, over: Record<string, unknown> = {}) {
  return {
    userId,
    eventId: `evt-${usn}`,
    eventType: "review" as const,
    cardUid: "card-1",
    rating: 3,
    occurredAt: new Date(),
    deviceIdHash: "dev-hash-1",
    usn,
    ...over,
  };
}

function userCard(userId: string, usn: number, over: Record<string, unknown> = {}) {
  return {
    userId,
    cardUid: `card-${usn}`,
    normalizedWord: "hello",
    language: "en",
    word: "hello",
    meaning: "xin chào",
    usn,
    clientUpdatedAt: new Date(),
    ...over,
  };
}

describe.skipIf(!hasDb)("sync schema (integration)", () => {
  beforeEach(reset);

  it("accepts a well-formed review event", async () => {
    const u = await seedUser("a@x.com");
    const e = await prisma.syncEvent.create({ data: reviewEvent(u.id, 1) });
    expect(e.eventType).toBe("review");
  });

  it("rejects a duplicate (userId, eventId) — idempotency", async () => {
    const u = await seedUser("b@x.com");
    await prisma.syncEvent.create({ data: reviewEvent(u.id, 1) });
    await expect(
      prisma.syncEvent.create({ data: reviewEvent(u.id, 2, { eventId: "evt-1" }) }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  it("cascade-deletes all sync rows when the user is deleted (right-to-erasure)", async () => {
    const u = await seedUser("c@x.com");
    await prisma.syncCursor.create({ data: { userId: u.id, usn: 5 } });
    await prisma.syncEvent.create({ data: reviewEvent(u.id, 1) });
    await prisma.syncVocabCard.create({ data: userCard(u.id, 2) });
    await prisma.user.delete({ where: { id: u.id } });
    expect(await prisma.syncEvent.count({ where: { userId: u.id } })).toBe(0);
    expect(await prisma.syncVocabCard.count({ where: { userId: u.id } })).toBe(0);
    expect(await prisma.syncCursor.count({ where: { userId: u.id } })).toBe(0);
  });

  // --- These two go RED until the constraints migration (raw SQL) is added ---

  it("rejects a review event with a null rating (CHECK)", async () => {
    const u = await seedUser("d@x.com");
    await expect(
      prisma.syncEvent.create({ data: reviewEvent(u.id, 1, { rating: null }) }),
    ).rejects.toThrow();
  });

  it("rejects a master event carrying a rating (CHECK)", async () => {
    const u = await seedUser("e@x.com");
    await expect(
      prisma.syncEvent.create({
        data: reviewEvent(u.id, 1, { eventType: "master", rating: 3 }),
      }),
    ).rejects.toThrow();
  });

  it("dedups live cards but lets a re-add after soft-delete (partial index)", async () => {
    const u = await seedUser("f@x.com");
    const first = await prisma.syncVocabCard.create({ data: userCard(u.id, 1) });
    // second LIVE card, same normalized word + language → rejected.
    // Use toThrow() (not a specific code): the partial index is raw SQL Prisma
    // doesn't model, so a violation may surface as P2002 OR a raw P2010 — either
    // is a correct rejection.
    await expect(
      prisma.syncVocabCard.create({ data: userCard(u.id, 2) }),
    ).rejects.toThrow();
    // soft-delete the first, then the same word can be added again
    await prisma.syncVocabCard.update({
      where: { id: first.id },
      data: { deletedAt: new Date() },
    });
    const readd = await prisma.syncVocabCard.create({ data: userCard(u.id, 3) });
    expect(readd.normalizedWord).toBe("hello");
  });
});
