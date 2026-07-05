import { prisma } from "./prisma";

/** Enqueue an email-verification message. `dedupeKey` makes re-requests idempotent per token. */
export async function enqueueVerifyEmail(recipient: string, verifyUrl: string, token: string) {
  await prisma.emailOutbox.create({
    data: {
      dedupeKey: `account_verify:${token}`,
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
      dedupeKey: `account_reset:${token}`,
      type: "account_reset_password",
      recipient,
      payload: { resetUrl },
    },
  });
}
