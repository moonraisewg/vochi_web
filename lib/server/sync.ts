import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { CLOCK_SKEW_LIMIT_MS, type PushEventInput } from "./syncPolicy";

export interface PushResult {
  accepted: number;
  duplicates: number;
  clamped: number;
}

/** Durably store a device's learning events under a per-account monotonic USN.
 *  Idempotent by (userId, eventId); clock-skewed occurredAt is clamped to server
 *  time. Runs in one transaction with a FOR UPDATE lock on the cursor row so
 *  concurrent pushes from two devices cannot collide on USN. Does NOT advance the
 *  client cursor — that happens on pull. */
export async function pushEvents(
  userId: string,
  deviceIdHash: string,
  events: PushEventInput[],
): Promise<PushResult> {
  return prisma.$transaction(async (tx) => {
    // 1. Ensure + lock the cursor row (serializes concurrent pushes).
    await tx.$executeRaw`INSERT INTO "SyncCursor" ("userId", "usn") VALUES (${userId}, 0)
                         ON CONFLICT ("userId") DO NOTHING`;
    const locked = await tx.$queryRaw<{ usn: number }[]>`
      SELECT "usn" FROM "SyncCursor" WHERE "userId" = ${userId} FOR UPDATE`;
    let usn = locked[0].usn;

    // 2. Dedupe by (userId, eventId).
    const ids = events.map((e) => e.eventId);
    const existing = await tx.syncEvent.findMany({
      where: { userId, eventId: { in: ids } },
      select: { eventId: true },
    });
    const seen = new Set(existing.map((e) => e.eventId));
    const fresh = events.filter((e) => !seen.has(e.eventId));

    // 3. Assign USN + clamp skew + stamp server/session fields.
    const now = new Date();
    let clamped = 0;
    const data = fresh.map((e) => {
      const occ = new Date(e.occurredAt);
      const skewed = Math.abs(occ.getTime() - now.getTime()) > CLOCK_SKEW_LIMIT_MS;
      if (skewed) clamped++;
      return {
        userId,
        deviceIdHash,
        eventId: e.eventId,
        eventType: e.eventType,
        cardUid: e.cardUid,
        rating: e.rating ?? null,
        occurredAt: skewed ? now : occ,
        usn: ++usn,
        receivedAt: now,
      };
    });
    if (data.length > 0) {
      await tx.syncEvent.createMany({ data });
      await tx.$executeRaw`UPDATE "SyncCursor" SET "usn" = ${usn} WHERE "userId" = ${userId}`;
    }

    return { accepted: data.length, duplicates: seen.size, clamped };
  });
}

export const SYNC_PULL_PAGE = 1000;

export interface PulledEvent {
  eventId: string;
  eventType: string;
  cardUid: string;
  rating: number | null;
  occurredAt: Date;
  deviceIdHash: string;
  usn: number;
}

export interface PulledCard {
  cardUid: string;
  normalizedWord: string;
  language: string;
  word: string;
  meaning: string;
  example: string | null;
  pos: string | null;
  pinyin: string | null;
  toneMarks: string | null;
  exampleVi: string | null;
  deletedAt: Date | null;
  clientUpdatedAt: Date;
  usn: number;
}

export interface PullResult {
  events: PulledEvent[];
  cards: PulledCard[];
  nextSince: number;
  hasMore: boolean;
}

/** Return the account's events + vocab cards (incl. tombstones) with usn > since,
 *  paginated over the shared USN sequence. Read in one RepeatableRead snapshot so
 *  the two-table read is consistent (usn order == commit order → a snapshot sees a
 *  gap-free prefix, so nextSince can never skip a record). Advances no server state;
 *  the client sets last_synced_usn = nextSince and repeats while hasMore. */
export async function pullChanges(userId: string, since: number): Promise<PullResult> {
  return prisma.$transaction(
    async (tx) => {
      const events = await tx.syncEvent.findMany({
        where: { userId, usn: { gt: since } },
        orderBy: { usn: "asc" },
        take: SYNC_PULL_PAGE + 1,
      });
      const cards = await tx.syncVocabCard.findMany({
        where: { userId, usn: { gt: since } },
        orderBy: { usn: "asc" },
        take: SYNC_PULL_PAGE + 1,
      });

      // k-way merge by the shared usn; take the globally-smallest PAGE.
      const tagged = [
        ...events.map((e) => ({ usn: e.usn, kind: "event" as const, row: e })),
        ...cards.map((c) => ({ usn: c.usn, kind: "card" as const, row: c })),
      ].sort((a, b) => a.usn - b.usn);
      const pageItems = tagged.slice(0, SYNC_PULL_PAGE);
      const hasMore = tagged.length > SYNC_PULL_PAGE;
      const nextSince = pageItems.length > 0 ? pageItems[pageItems.length - 1].usn : since;

      const outEvents: PulledEvent[] = pageItems
        .filter((i) => i.kind === "event")
        .map((i) => {
          const e = i.row as (typeof events)[number];
          return {
            eventId: e.eventId,
            eventType: e.eventType,
            cardUid: e.cardUid,
            rating: e.rating,
            occurredAt: e.occurredAt,
            deviceIdHash: e.deviceIdHash,
            usn: e.usn,
          };
        });
      const outCards: PulledCard[] = pageItems
        .filter((i) => i.kind === "card")
        .map((i) => {
          const c = i.row as (typeof cards)[number];
          return {
            cardUid: c.cardUid,
            normalizedWord: c.normalizedWord,
            language: c.language,
            word: c.word,
            meaning: c.meaning,
            example: c.example,
            pos: c.pos,
            pinyin: c.pinyin,
            toneMarks: c.toneMarks,
            exampleVi: c.exampleVi,
            deletedAt: c.deletedAt,
            clientUpdatedAt: c.clientUpdatedAt,
            usn: c.usn,
          };
        });

      return { events: outEvents, cards: outCards, nextSince, hasMore };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
  );
}
