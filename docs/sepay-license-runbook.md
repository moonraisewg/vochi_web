# SePay + License Runbook

## Required setup

1. Create a Postgres database and set `DATABASE_URL`.
2. Set all variables from `.env.example`.
3. Generate Ed25519 keys for license entitlement signing and ship the public key to the desktop app as `VITE_LICENSE_PUBLIC_KEY`.
4. Configure SePay IPN URL to `https://<domain>/api/sepay/ipn` and set the same value in `SEPAY_IPN_SECRET_KEY`.
5. Run `pnpm db:migrate` before deploying application code.

## Release checklist

- `pnpm check` passes.
- `/api/checkout/create` creates a signed SePay checkout form in sandbox.
- SePay sandbox IPN marks an order `paid` and enqueues one `license_issued` email.
- `pnpm email:outbox` sends the license email.
- Desktop app is built with:
  - `VITE_LICENSE_API_BASE_URL=https://<domain>`
  - `VITE_LICENSE_PUBLIC_KEY=<base64url public key>`

## Support operations

- Lookup order/license: `pnpm admin:license lookup <email-or-invoice>`.
- Resend license email: `pnpm admin:license resend <licenseId>`.
- Revoke after refund: `pnpm admin:license revoke <licenseId> "<reason>"`.
- Extend a license: `pnpm admin:license extend <licenseId> <days>`.
- Reconcile missed IPN: `pnpm admin:reconcile <invoiceNumber>`.

## Safety rules

- Redirect pages never mark orders paid. IPN is the payment source of truth.
- Full license keys are only sent through email outbox/support resend.
- Duplicate IPNs must remain idempotent through `PaymentEvent.sepayTransactionId`.
- Refunds are manual in the bank/payment provider, then license status is changed by support script.
