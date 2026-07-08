-- Dedup: a user cannot have two LIVE cards with the same normalized word+language,
-- but a tombstoned (soft-deleted) row must NOT block re-adding the same word later.
-- A partial unique index is the only correct fix for soft-delete + uniqueness.
CREATE UNIQUE INDEX "SyncVocabCard_userId_normalizedWord_language_live_key"
  ON "SyncVocabCard" ("userId", "normalizedWord", "language")
  WHERE "deletedAt" IS NULL;

-- rating must be present iff the event is a review, and in range 1..4 when present.
-- '::"SyncEventType"' casts the literal to the enum explicitly (no implicit-cast ambiguity).
ALTER TABLE "SyncEvent" ADD CONSTRAINT "SyncEvent_rating_review_only"
  CHECK (
    (("eventType" = 'review'::"SyncEventType") = ("rating" IS NOT NULL))
    AND ("rating" IS NULL OR ("rating" BETWEEN 1 AND 4))
  );
