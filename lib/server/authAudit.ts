import { prisma } from "./prisma";

export type AuthEvent =
  | "login_success"
  | "login_failed"
  | "email_verified"
  | "password_reset"
  | "session_revoked"
  | "device_limit_hit"
  | "entitlement_device_limit_hit"
  | "account_deleted";

/** Fire-and-forget audit write. Never throws into the caller — auditing must not break auth.
 *  Reuses the existing `AuditLog` (actor = userId or "anon"); userId/ip/note go in metadata. */
export async function audit(event: AuthEvent, opts: { userId?: string; ip?: string; note?: string } = {}) {
  try {
    await prisma.auditLog.create({
      data: {
        actor: opts.userId ?? "anon",
        action: `auth.${event}`,
        metadata: { userId: opts.userId ?? null, ip: opts.ip ?? null, note: opts.note ?? null },
      },
    });
  } catch (err) {
    console.error(JSON.stringify({ event: "audit_write_failed", auth: event, error: String(err) }));
  }
}
