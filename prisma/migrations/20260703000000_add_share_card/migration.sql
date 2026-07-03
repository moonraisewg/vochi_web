-- CreateTable
CREATE TABLE "ShareCard" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "badgeKey" TEXT,
    "streak" INTEGER,
    "words" INTEGER,
    "level" INTEGER,
    "lang" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShareCard_createdAt_idx" ON "ShareCard"("createdAt");
