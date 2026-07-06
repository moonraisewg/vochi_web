import { z } from "zod";

export const DEVICE_CAP = 2;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Normalize (trim + lowercase) BEFORE validating, so "  A@B.com " passes and yields "a@b.com".
const email = z.preprocess((v) => (typeof v === "string" ? normalizeEmail(v) : v), z.string().email());
const password = z.string().min(8).max(200);
const deviceIdHash = z.string().min(8).max(200);
const deviceName = z.string().max(200).optional();
const displayName = z.string().trim().min(1).max(100);
const age = z.number().int().min(13).max(120);

export const registerSchema = z.object({ email, password, name: displayName, age });
export const verifyEmailSchema = z.object({ token: z.string().min(1) });
export const loginSchema = z.object({ email, password, deviceIdHash, deviceName });
export const forgotSchema = z.object({ email });
export const resetSchema = z.object({ token: z.string().min(1), password });
export const updateProfileSchema = z.object({ name: displayName, age });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/** Pure decision for the device cap. `rotate` = reuse this device's slot. */
export function decideDeviceAdmission(
  liveSessions: ReadonlyArray<{ deviceIdHash: string }>,
  deviceIdHash: string,
  cap: number = DEVICE_CAP,
): "rotate" | "admit" | "reject" {
  if (liveSessions.some((s) => s.deviceIdHash === deviceIdHash)) return "rotate";
  if (liveSessions.length >= cap) return "reject";
  return "admit";
}
