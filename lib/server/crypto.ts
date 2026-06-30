import crypto from "crypto";
import * as ed from "@noble/ed25519";
import { serverEnv } from "./env";

const encoder = new TextEncoder();

export function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function base64Url(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64url");
}

export function bytesFromBase64Url(value: string) {
  return new Uint8Array(Buffer.from(value, "base64url"));
}

export function normalizeLicenseKey(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function hashLicenseKey(value: string) {
  return sha256Hex(normalizeLicenseKey(value));
}

export function hashDeviceId(value: string) {
  return sha256Hex(value.trim());
}

export function generateInvoiceNumber() {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomBytes(5).toString("hex").toUpperCase();
  return `VOCHI-${day}-${suffix}`;
}

export function generateLicenseKey() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const chars = Array.from(crypto.randomBytes(16), (byte) => alphabet[byte % alphabet.length]);
  return `VOCHI-${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars
    .slice(8, 12)
    .join("")}-${chars.slice(12, 16).join("")}`;
}

export function licensePrefix(licenseKey: string) {
  return normalizeLicenseKey(licenseKey).slice(0, 10);
}

/** Feature flag granting the paid "HSK nâng cao" pack (HSK 4/5/6). Must match
 *  the desktop app's `license::PACK_HSK_ADVANCED_FEATURE`. */
export const FEATURE_PACK_HSK_ADVANCED = "pack_hsk_advanced";
/** Pack id used as the key in the entitlement's `packKeys` map and as the AAD tag
 *  the app binds ciphertext to. Matches `license::PACK_HSK_ADVANCED_ID`. */
export const PACK_ID_HSK_ADVANCED = "hsk_advanced";

/** The `packKeys` map to embed in a signed entitlement, or `undefined` when the
 *  features don't include the pack (so non-pack entitlements stay byte-identical
 *  and existing signatures never change).
 *
 *  The value is the 32-byte MASTER key (base64url) the app build sealed HSK 4/5/6
 *  with (`VOCHI_PACK_KEY_HSK_ADVANCED`); the app derives the content subkey from
 *  it. Fails loud if a pack entitlement is requested without the key configured —
 *  shipping a keyless pack license would lock the buyer out of what they paid for. */
export function packKeysForFeatures(
  features: string[],
  hskAdvancedKey: string | undefined,
): Record<string, string> | undefined {
  if (!features.includes(FEATURE_PACK_HSK_ADVANCED)) return undefined;
  if (!hskAdvancedKey) {
    throw new Error(
      "PACK_KEY_HSK_ADVANCED is not configured but a pack_hsk_advanced entitlement was requested",
    );
  }
  return { [PACK_ID_HSK_ADVANCED]: hskAdvancedKey };
}

export function canonicalJson(value: unknown): string {
  if (value == null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.keys(value as Record<string, unknown>)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson((value as Record<string, unknown>)[key])}`)
    .join(",")}}`;
}

export async function signEntitlement(entitlement: unknown) {
  const privateKey = bytesFromBase64Url(serverEnv().LICENSE_SIGNING_PRIVATE_KEY);
  const payload = canonicalJson(entitlement);
  const signature = await ed.signAsync(encoder.encode(payload), privateKey);
  return { payload, signature: base64Url(signature) };
}

function encryptionKey() {
  return crypto.createHash("sha256").update(serverEnv().LICENSE_KEY_ENCRYPTION_SECRET).digest();
}

export function sealString(plainText: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${ciphertext.toString("base64url")}`;
}

export function openString(sealed: string) {
  const [ivB64, tagB64, ciphertextB64] = sealed.split(".");
  if (!ivB64 || !tagB64 || !ciphertextB64) throw new Error("Invalid sealed payload");
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextB64, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
