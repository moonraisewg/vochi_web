import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/server/prisma";
import { pushEvents } from "../lib/server/sync";
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

describe.skipIf(!hasDb)("pushEvents (integration)", () => {
  beforeEach(reset);

  it("accepts a fresh batch, assigns contiguous USNs from 1, advances the cursor", async () => {
    const u = await seedUser("a@x.com");
    const res = await pushEvents(u.id, "dev-1", [ev("e1"), ev("e2"), ev("e3")]);
    expect(res).toEqual({ accepted: 3, duplicates: 0, clamped: 0 });
    const rows = await prisma.syncEvent.findMany({
      where: { userId: u.id },
      orderBy: { usn: "asc" },
    });
    expect(rows.map((r) => r.usn)).toEqual([1, 2, 3]);
    expect(rows.every((r) => r.deviceIdHash === "dev-1")).toBe(true);
    const cursor = await prisma.syncCursor.findUniqueOrThrow({ where: { userId: u.id } });
    expect(cursor.usn).toBe(3);
  });

  it("is idempotent: re-pushing the same batch inserts nothing", async () => {
    const u = await seedUser("b@x.com");
    await pushEvents(u.id, "dev-1", [ev("e1"), ev("e2")]);
    const res = await pushEvents(u.id, "dev-1", [ev("e1"), ev("e2")]);
    expect(res).toEqual({ accepted: 0, duplicates: 2, clamped: 0 });
    expect(await prisma.syncEvent.count({ where: { userId: u.id } })).toBe(2);
    const cursor = await prisma.syncCursor.findUniqueOrThrow({ where: { userId: u.id } });
    expect(cursor.usn).toBe(2); // unchanged
  });

  it("handles a mixed batch (some new, some duplicate)", async () => {
    const u = await seedUser("c@x.com");
    await pushEvents(u.id, "dev-1", [ev("e1")]);
    const res = await pushEvents(u.id, "dev-1", [ev("e1"), ev("e2"), ev("e3")]);
    expect(res).toEqual({ accepted: 2, duplicates: 1, clamped: 0 });
    expect(await prisma.syncEvent.count({ where: { userId: u.id } })).toBe(3);
  });

  it("clamps a clock-skewed occurredAt to server time, keeps a fresh one", async () => {
    const u = await seedUser("d@x.com");
    const stale = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10 min ago
    const res = await pushEvents(u.id, "dev-1", [ev("e1", { occurredAt: stale }), ev("e2")]);
    expect(res.clamped).toBe(1);
    const e1 = await prisma.syncEvent.findFirstOrThrow({ where: { userId: u.id, eventId: "e1" } });
    // clamped → occurredAt equals receivedAt (both server 'now')
    expect(e1.occurredAt.getTime()).toBe(e1.receivedAt.getTime());
  });

  it("keeps USNs strictly increasing across two devices, no collision", async () => {
    const u = await seedUser("e@x.com");
    await pushEvents(u.id, "dev-1", [ev("e1"), ev("e2")]);
    await pushEvents(u.id, "dev-2", [ev("e3")]);
    const rows = await prisma.syncEvent.findMany({
      where: { userId: u.id },
      orderBy: { usn: "asc" },
    });
    expect(rows.map((r) => r.usn)).toEqual([1, 2, 3]);
    expect(rows.find((r) => r.eventId === "e3")!.deviceIdHash).toBe("dev-2");
  });

  it("stores a master event with a null rating", async () => {
    const u = await seedUser("f@x.com");
    const res = await pushEvents(u.id, "dev-1", [
      ev("e1", { eventType: "master", rating: undefined }),
    ]);
    expect(res.accepted).toBe(1);
    const row = await prisma.syncEvent.findFirstOrThrow({ where: { userId: u.id, eventId: "e1" } });
    expect(row.eventType).toBe("master");
    expect(row.rating).toBeNull();
  });
});
