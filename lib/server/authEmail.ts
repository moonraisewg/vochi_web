import { prisma } from "./prisma";
import { hashToken } from "./authCrypto";

// The raw token must live only in the emailed URL. The queryable `dedupeKey` uses the
// token HASH so a DB/outbox read can't recover a live verify/reset token (which would
// otherwise allow email confirmation or password reset → account takeover). Keeps the
// "store only hashes" invariant that `AuthToken.tokenHash` maintains. See review #2.

/** Enqueue an email-verification message. `dedupeKey` makes re-requests idempotent per token. */
export async function enqueueVerifyEmail(recipient: string, verifyUrl: string, token: string) {
  await prisma.emailOutbox.create({
    data: {
      dedupeKey: `account_verify:${hashToken(token)}`,
      type: "account_verify_email",
      recipient,
      payload: { verifyUrl },
    },
  });
}

/** Enqueue a password-reset message. */
export async function enqueueResetPassword(recipient: string, resetUrl: string, token: string) {
  await prisma.emailOutbox.create({
    data: {
      dedupeKey: `account_reset:${hashToken(token)}`,
      type: "account_reset_password",
      recipient,
      payload: { resetUrl },
    },
  });
}
