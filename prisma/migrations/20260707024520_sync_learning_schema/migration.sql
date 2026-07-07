-- CreateEnum
CREATE TYPE "SyncEventType" AS ENUM ('review', 'master', 'unmaster');

-- CreateTable
CREATE TABLE "SyncCursor" (
    "userId" TEXT NOT NULL,
    "usn" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SyncCursor_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "SyncEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" "SyncEventType" NOT NULL,
    "cardUid" TEXT NOT NULL,
    "rating" INTEGER,
    "occurredAt" TIMESTAMPTZ(3) NOT NULL,
    "deviceIdHash" TEXT NOT NULL,
    "usn" INTEGER NOT NULL,
    "receivedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncVocabCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardUid" TEXT NOT NULL,
    "normalizedWord" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "example" TEXT,
    "pos" TEXT,
    "pinyin" TEXT,
    "toneMarks" TEXT,
    "exampleVi" TEXT,
    "usn" INTEGER NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "clientUpdatedAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncVocabCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SyncEvent_userId_usn_idx" ON "SyncEvent"("userId", "usn");

-- CreateIndex
CREATE INDEX "SyncEvent_userId_cardUid_idx" ON "SyncEvent"("userId", "cardUid");

-- CreateIndex
CREATE UNIQUE INDEX "SyncEvent_userId_eventId_key" ON "SyncEvent"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncEvent_userId_usn_key" ON "SyncEvent"("userId", "usn");

-- CreateIndex
CREATE INDEX "SyncVocabCard_userId_usn_idx" ON "SyncVocabCard"("userId", "usn");

-- CreateIndex
CREATE UNIQUE INDEX "SyncVocabCard_userId_cardUid_key" ON "SyncVocabCard"("userId", "cardUid");

-- CreateIndex
CREATE UNIQUE INDEX "SyncVocabCard_userId_usn_key" ON "SyncVocabCard"("userId", "usn");

-- AddForeignKey
ALTER TABLE "SyncCursor" ADD CONSTRAINT "SyncCursor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncEvent" ADD CONSTRAINT "SyncEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncVocabCard" ADD CONSTRAINT "SyncVocabCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
