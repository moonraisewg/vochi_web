CREATE TYPE "Plan" AS ENUM ('pro_annual', 'lifetime', 'student');
CREATE TYPE "OrderStatus" AS ENUM ('created', 'pending', 'paid', 'failed', 'cancelled', 'expired');
CREATE TYPE "LicenseStatus" AS ENUM ('active', 'revoked');
CREATE TYPE "EmailStatus" AS ENUM ('pending', 'sending', 'sent', 'failed');

CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "invoiceNumber" TEXT NOT NULL,
  "plan" "Plan" NOT NULL,
  "amountVnd" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'VND',
  "email" TEXT NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'created',
  "sepayOrderId" TEXT,
  "sepayTransactionId" TEXT,
  "rawIpnJson" JSONB,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentEvent" (
  "id" TEXT NOT NULL,
  "orderId" TEXT,
  "sepayTransactionId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "rawJson" JSONB NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "License" (
  "id" TEXT NOT NULL,
  "licenseKeyHash" TEXT NOT NULL,
  "licenseKeyPrefix" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "plan" "Plan" NOT NULL,
  "status" "LicenseStatus" NOT NULL DEFAULT 'active',
  "deviceLimit" INTEGER NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Activation" (
  "id" TEXT NOT NULL,
  "licenseId" TEXT NOT NULL,
  "deviceIdHash" TEXT NOT NULL,
  "deviceLabel" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Activation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailOutbox" (
  "id" TEXT NOT NULL,
  "dedupeKey" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "orderId" TEXT,
  "licenseId" TEXT,
  "payload" JSONB NOT NULL,
  "status" "EmailStatus" NOT NULL DEFAULT 'pending',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EmailOutbox_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "actor" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "orderId" TEXT,
  "licenseId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Order_invoiceNumber_key" ON "Order"("invoiceNumber");
CREATE INDEX "Order_email_idx" ON "Order"("email");
CREATE INDEX "Order_status_expiresAt_idx" ON "Order"("status", "expiresAt");

CREATE UNIQUE INDEX "PaymentEvent_sepayTransactionId_key" ON "PaymentEvent"("sepayTransactionId");

CREATE UNIQUE INDEX "License_licenseKeyHash_key" ON "License"("licenseKeyHash");
CREATE UNIQUE INDEX "License_orderId_key" ON "License"("orderId");
CREATE INDEX "License_email_idx" ON "License"("email");
CREATE INDEX "License_status_idx" ON "License"("status");

CREATE UNIQUE INDEX "Activation_licenseId_deviceIdHash_key" ON "Activation"("licenseId", "deviceIdHash");
CREATE INDEX "Activation_deviceIdHash_idx" ON "Activation"("deviceIdHash");

CREATE UNIQUE INDEX "EmailOutbox_dedupeKey_key" ON "EmailOutbox"("dedupeKey");
CREATE INDEX "EmailOutbox_status_createdAt_idx" ON "EmailOutbox"("status", "createdAt");

CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "License" ADD CONSTRAINT "License_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Activation" ADD CONSTRAINT "Activation_licenseId_fkey"
  FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EmailOutbox" ADD CONSTRAINT "EmailOutbox_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EmailOutbox" ADD CONSTRAINT "EmailOutbox_licenseId_fkey"
  FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_licenseId_fkey"
  FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE SET NULL ON UPDATE CASCADE;
