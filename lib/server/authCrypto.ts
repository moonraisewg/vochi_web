import { randomBytes, createHash } from "node:crypto";
import { hash as argon2Hash, verify as argon2Verify } from "@node-rs/argon2";

// OWASP argon2id profile. `@node-rs/argon2` defaults `algorithm` to Argon2id, so it is
// omitted here (its `Algorithm` is a const enum, unusable under isolatedModules). The
// params are embedded in the PHC string argon2 returns, so they can be raised later
// without breaking existing hashes.
const ARGON2_OPTS = {
  memoryCost: 19456, // KiB (19 MiB)
  timeCost: 2,
  parallelism: 1,
} as const;

/** Returns a PHC-format argon2id string (`$argon2id$...`). Never contains the plaintext. */
export async function hashPassword(plain: string): Promise<string> {
  return argon2Hash(plain, ARGON2_OPTS);
}

/** Verify a password. Returns false (never throws) on a malformed/invalid stored value. */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  try {
    return await argon2Verify(stored, plain);
  } catch {
    return false;
  }
}

/** 32 bytes of randomness, base64url (no padding) — used for verify/reset/session tokens. */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/** SHA-256 hex. Store only this server-side; compare hashes on lookup. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
