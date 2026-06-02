-- AlterEnum: replace six_months with one_month
BEGIN;
CREATE TYPE "Plan_new" AS ENUM ('one_month', 'three_months', 'lifetime', 'student');
ALTER TABLE "Order" ALTER COLUMN "plan" TYPE "Plan_new" USING ("plan"::text::"Plan_new");
ALTER TABLE "License" ALTER COLUMN "plan" TYPE "Plan_new" USING ("plan"::text::"Plan_new");
ALTER TYPE "Plan" RENAME TO "Plan_old";
ALTER TYPE "Plan_new" RENAME TO "Plan";
DROP TYPE "public"."Plan_old";
COMMIT;
