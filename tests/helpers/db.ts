import { prisma } from "../../lib/server/prisma";

/** Wipe auth tables between tests. Only run against TEST_DATABASE_URL (see the guard). */
export async function resetAuthTables() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Session", "AuthToken", "AuthThrottle", "User" RESTART IDENTITY CASCADE',
  );
}
