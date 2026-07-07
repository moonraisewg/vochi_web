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
