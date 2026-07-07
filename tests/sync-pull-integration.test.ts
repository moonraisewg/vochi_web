import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/server/prisma";
import { pushEvents, pullChanges, SYNC_PULL_PAGE } from "../lib/server/sync";
import type { PushEventInput } from "../lib/server/syncPolicy";

const hasDb = !!process.env.TEST_DATABASE_URL;

async function reset() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "SyncEvent", "SyncVocabCard", "SyncCursor", "User" RESTART IDENTITY CASCADE',
  );
}

async function seedUser(email: string) {
  return prisma.user.create({ data: { email, passwordHash: "x", emailVerifiedAt: new Date() } });
}

function ev(id: string, over: Partial<PushEventInput> = {}): PushEventInput {
  return {
    eventId: id,
    eventType: "review",
    cardUid: "card-1",
    rating: 3,
    occurredAt: new Date().toISOString(),
    ...over,
  };
}

// Seed a SyncVocabCard the way the (not-yet-built) vocab push will: mint the usn
// from the SAME shared SyncCursor so usns stay globally unique + monotonic across
// both tables. Passing an explicit usn would collide with pushEvents' assignments
// (both start at 1) and break the shared-sequence invariant.
async function seedCard(userId: string, over: Record<string, unknown> = {}) {
  const cur = await prisma.syncCursor.upsert({
    where: { userId },
    create: { userId, usn: 1 },
    update: { usn: { increment: 1 } },
  });
  const usn = cur.usn;
  return prisma.syncVocabCard.create({
    data: {
      userId,
      cardUid: `vc-${usn}`,
      normalizedWord: `w${usn}`,
      language: "en",
      word: `w${usn}`,
      meaning: "m",
      usn,
      clientUpdatedAt: new Date(),
      ...over,
    },
  });
}

describe.skipIf(!hasDb)("pullChanges (integration)", () => {
  beforeEach(reset);

  it("returns all events + cards ordered by usn from since=0", async () => {
    const u = await seedUser("a@x.com");
    await pushEvents(u.id, "dev-1", [ev("e1"), ev("e2")]); // usn 1,2 (cursor → 2)
    await seedCard(u.id); // usn 3
    const res = await pullChanges(u.id, 0);
    expect(res.events.map((e) => e.usn)).toEqual([1, 2]);
    expect(res.cards.map((c) => c.usn)).toEqual([3]);
    expect(res.nextSince).toBe(3);
    expect(res.hasMore).toBe(false);
    // server-internal fields are not exposed
    const raw = res.events[0] as unknown as Record<string, unknown>;
    expect(raw.userId).toBeUndefined();
    expect(raw.receivedAt).toBeUndefined();
  });

  it("returns only records with usn > since (incremental)", async () => {
    const u = await seedUser("b@x.com");
    await pushEvents(u.id, "dev-1", [ev("e1"), ev("e2"), ev("e3")]); // usn 1,2,3
    const res = await pullChanges(u.id, 2);
    expect(res.events.map((e) => e.usn)).toEqual([3]);
    expect(res.nextSince).toBe(3);
    expect(res.hasMore).toBe(false);
  });

  it("paginates: exactly PAGE, hasMore, then the remainder", async () => {
    const u = await seedUser("c@x.com");
    const batch = Array.from({ length: SYNC_PULL_PAGE + 5 }, (_, i) => ev(`e${i}`));
    // pushEvents caps at 1000/call; this batch is 1005 → push in two calls
    await pushEvents(u.id, "dev-1", batch.slice(0, SYNC_PULL_PAGE));
    await pushEvents(u.id, "dev-1", batch.slice(SYNC_PULL_PAGE));
    const p1 = await pullChanges(u.id, 0);
    expect(p1.events.length).toBe(SYNC_PULL_PAGE);
    expect(p1.hasMore).toBe(true);
    expect(p1.nextSince).toBe(SYNC_PULL_PAGE); // usn of the 1000th record
    const p2 = await pullChanges(u.id, p1.nextSince);
    expect(p2.events.length).toBe(5);
    expect(p2.hasMore).toBe(false);
    expect(p2.nextSince).toBe(SYNC_PULL_PAGE + 5);
  });

  it("empty page keeps the cursor put", async () => {
    const u = await seedUser("d@x.com");
    await pushEvents(u.id, "dev-1", [ev("e1")]); // usn 1
    const res = await pullChanges(u.id, 1);
    expect(res.events).toEqual([]);
    expect(res.cards).toEqual([]);
    expect(res.hasMore).toBe(false);
    expect(res.nextSince).toBe(1); // unchanged, not 0
  });

  it("returns a soft-deleted card with deletedAt populated", async () => {
    const u = await seedUser("e@x.com");
    await seedCard(u.id, { deletedAt: new Date() });
    const res = await pullChanges(u.id, 0);
    expect(res.cards.length).toBe(1);
    expect(res.cards[0].deletedAt).not.toBeNull();
  });

  it("does not leak another user's rows (isolation)", async () => {
    const a = await seedUser("f@x.com");
    const b = await seedUser("g@x.com");
    await pushEvents(a.id, "dev-a", [ev("ea")]);
    await pushEvents(b.id, "dev-b", [ev("eb")]);
    const res = await pullChanges(b.id, 0);
    expect(res.events.map((e) => e.eventId)).toEqual(["eb"]);
  });

  it("nextSince is the single largest usn across both tables (largest in events)", async () => {
    const u = await seedUser("h@x.com");
    await seedCard(u.id); // usn 1 (card)
    await pushEvents(u.id, "dev-1", [ev("e1"), ev("e2")]); // usn 2,3 (events)
    const res = await pullChanges(u.id, 0);
    expect(res.cards.map((c) => c.usn)).toEqual([1]);
    expect(res.events.map((e) => e.usn)).toEqual([2, 3]);
    expect(res.nextSince).toBe(3); // largest overall is an event
    expect(res.hasMore).toBe(false);
  });
});
