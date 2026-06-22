-- Make License.orderId optional to support bulk license issuance
-- (multiple licenses per order for the bulk/reseller flow)
ALTER TABLE "License" ALTER COLUMN "orderId" DROP NOT NULL;
