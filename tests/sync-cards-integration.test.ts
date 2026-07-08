import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/server/prisma";
import { pushCards } from "../lib/server/sync";
import type { CardPushInput } from "../lib/server/syncPolicy";

const hasDb = !!process.env.TEST_DATABASE_URL;

async function reset() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "SyncEvent", "SyncVocabCard", "SyncCursor", "User" RESTART IDENTITY CASCADE',
  );
}

async function seedUser(email: string) {
  return prisma.user.create({ data: { email, passwordHash: "x", emailVerifiedAt: new Date() } });
}

function card(over: Partial<CardPushInput> = {}): CardPushInput {
  return {
    cardUid: "u1",
    word: "hello",
    language: "en",
    meaning: "xin chào",
    clientUpdatedAt: new Date().toISOString(),
    ...over,
  };
}

async function cursorUsn(userId: string) {
  const c = await prisma.syncCursor.findUnique({ where: { userId } });
  return c?.usn ?? 0;
}

// Timestamps must stay within the ±5min skew window of server-now, else pushCards
// clamps them to now and their relative order is lost. Use small offsets from now.
const ago = (sec: number) => new Date(Date.now() - sec * 1000).toISOString();

describe.skipIf(!hasDb)("pushCards (integration)", () => {
  beforeEach(reset);

  it("applies a new card, assigns usn, advances the cursor", async () => {
    const u = await seedUser("a@x.com");
    const res = await pushCards(u.id, [card()]);
    expect(res.results).toEqual([{ cardUid: "u1", outcome: "applied" }]);
    const row = await prisma.syncVocabCard.findFirstOrThrow({ where: { userId: u.id } });
    expect(row.normalizedWord).toBe("hello");
    expect(row.usn).toBe(1);
    expect(await cursorUsn(u.id)).toBe(1);
  });

  it("supersedes a re-push of the identical card (idempotent)", async () => {
    const u = await seedUser("b@x.com");
    const c = card();
    await pushCards(u.id, [c]);
    const res = await pushCards(u.id, [c]);
    expect(res.results).toEqual([{ cardUid: "u1", outcome: "superseded" }]);
    expect(await cursorUsn(u.id)).toBe(1); // unchanged
  });

  it("applies a newer edit, supersedes an older one", async () => {
    const u = await seedUser("c@x.com");
    await pushCards(u.id, [card({ clientUpdatedAt: ago(180), meaning: "old" })]);
    const newer = await pushCards(u.id, [card({ clientUpdatedAt: ago(60), meaning: "new" })]);
    expect(newer.results[0].outcome).toBe("applied");
    let row = await prisma.syncVocabCard.findFirstOrThrow({ where: { userId: u.id } });
    expect(row.meaning).toBe("new");
    const older = await pushCards(u.id, [card({ clientUpdatedAt: ago(240), meaning: "older" })]);
    expect(older.results[0].outcome).toBe("superseded");
    row = await prisma.syncVocabCard.findFirstOrThrow({ where: { userId: u.id } });
    expect(row.meaning).toBe("new"); // unchanged
  });

  it("keeps a row deleted vs an older edit, then resurrects on a newer edit", async () => {
    const u = await seedUser("d@x.com");
    await pushCards(u.id, [card({ clientUpdatedAt: ago(240) })]);
    await pushCards(u.id, [card({ clientUpdatedAt: ago(180), deletedAt: ago(180) })]);
    const stale = await pushCards(u.id, [card({ clientUpdatedAt: ago(210), meaning: "zombie" })]);
    expect(stale.results[0].outcome).toBe("superseded");
    let row = await prisma.syncVocabCard.findFirstOrThrow({ where: { userId: u.id } });
    expect(row.deletedAt).not.toBeNull();
    const revive = await pushCards(u.id, [card({ clientUpdatedAt: ago(60), meaning: "back" })]);
    expect(revive.results[0].outcome).toBe("applied");
    row = await prisma.syncVocabCard.findFirstOrThrow({ where: { userId: u.id } });
    expect(row.deletedAt).toBeNull();
    expect(row.meaning).toBe("back");
  });

  it("clamps a clock-skewed clientUpdatedAt to server time", async () => {
    const u = await seedUser("e@x.com");
    const future = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const res = await pushCards(u.id, [card({ clientUpdatedAt: future })]);
    expect(res.clamped).toBe(1);
    const row = await prisma.syncVocabCard.findFirstOrThrow({ where: { userId: u.id } });
    expect(Math.abs(row.clientUpdatedAt.getTime() - Date.now())).toBeLessThan(5 * 60 * 1000);
  });

  it("reports a conflict for the same word under a different cardUid", async () => {
    const u = await seedUser("f@x.com");
    await pushCards(u.id, [card({ cardUid: "uidA", word: "hello" })]);
    const res = await pushCards(u.id, [card({ cardUid: "uidB", word: "hello" })]);
    expect(res.results).toEqual([{ cardUid: "uidB", outcome: "conflict", heldByCardUid: "uidA" }]);
    expect(await prisma.syncVocabCard.count({ where: { userId: u.id } })).toBe(1);
  });

  it("resolves two same-word cards in one batch deterministically", async () => {
    const u = await seedUser("g@x.com");
    const res = await pushCards(u.id, [
      card({ cardUid: "uidA", word: "hello" }),
      card({ cardUid: "uidB", word: "hello" }),
    ]);
    expect(res.results[0]).toEqual({ cardUid: "uidA", outcome: "applied" });
    expect(res.results[1]).toEqual({ cardUid: "uidB", outcome: "conflict", heldByCardUid: "uidA" });
  });

  it("normalizes server-side so ' Hello ' and 'hello' collide", async () => {
    const u = await seedUser("h@x.com");
    await pushCards(u.id, [card({ cardUid: "uidA", word: "hello" })]);
    const res = await pushCards(u.id, [card({ cardUid: "uidB", word: "  Hello  " })]);
    expect(res.results[0].outcome).toBe("conflict");
  });

  it("lets a card take a slot freed by deleting the holder", async () => {
    const u = await seedUser("i@x.com");
    await pushCards(u.id, [
      card({ cardUid: "uidA", word: "hello", clientUpdatedAt: "2026-07-07T10:00:00.000Z" }),
    ]);
    await pushCards(u.id, [
      card({
        cardUid: "uidA",
        word: "hello",
        deletedAt: "2026-07-07T10:30:00.000Z",
        clientUpdatedAt: "2026-07-07T10:30:00.000Z",
      }),
    ]);
    const res = await pushCards(u.id, [
      card({ cardUid: "uidB", word: "hello", clientUpdatedAt: "2026-07-07T11:00:00.000Z" }),
    ]);
    expect(res.results[0].outcome).toBe("applied");
  });

  it("does not touch another user's cards (isolation)", async () => {
    const a = await seedUser("j@x.com");
    const b = await seedUser("k@x.com");
    await pushCards(a.id, [card({ cardUid: "ua", word: "alpha" })]);
    await pushCards(b.id, [card({ cardUid: "ub", word: "beta" })]);
    const rows = await prisma.syncVocabCard.findMany({ where: { userId: b.id } });
    expect(rows.map((r) => r.cardUid)).toEqual(["ub"]);
  });
});
