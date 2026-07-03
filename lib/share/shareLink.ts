// Server helpers for DB-backed short share links (/s/<id>). Kept import-pure
// (only zod + node:crypto + sibling share helpers) so the tests can import it
// without pulling in next/server.
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { isBadgeKey } from "./badges";
import { parseLang, parseStatsParams, type ShareLang } from "./params";

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // 62
const ID_LEN = 8;

/** Short URL-safe id. Rejection sampling avoids modulo bias (256 % 62 ≠ 0). */
export function shortId(): string {
  let out = "";
  while (out.length < ID_LEN) {
    for (const byte of randomBytes(ID_LEN)) {
      if (byte < 248) {
        // 248 = floor(256 / 62) * 62 — bytes ≥ 248 would bias the low residues.
        out += ALPHABET[byte % 62];
        if (out.length === ID_LEN) break;
      }
    }
  }
  return out;
}

export interface ShareCardInput {
  kind: "badge" | "stats";
  badgeKey: string | null;
  streak: number | null;
  words: number | null;
  level: number | null;
  lang: ShareLang;
}

// Discriminated union so a bad kind / bad badge key fails as a ZodError, which
// parseApiError maps to a 400 — no need to import ApiError (and next/server).
const bodySchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("badge"),
    badgeKey: z.string().refine(isBadgeKey, "Unknown badge key"),
    lang: z.string().optional(),
  }),
  z.object({
    kind: z.literal("stats"),
    streak: z.number().optional(),
    words: z.number().optional(),
    level: z.number().optional(),
    lang: z.string().optional(),
  }),
]);

export function parseCreateInput(body: unknown): ShareCardInput {
  const parsed = bodySchema.parse(body);
  const lang = parseLang(parsed.lang);
  if (parsed.kind === "badge") {
    return { kind: "badge", badgeKey: parsed.badgeKey, streak: null, words: null, level: null, lang };
  }
  // Reuse the exact clamp/caps that guard the query-string /share/stats route.
  const stats = parseStatsParams({
    streak: parsed.streak === undefined ? undefined : String(parsed.streak),
    words: parsed.words === undefined ? undefined : String(parsed.words),
    level: parsed.level === undefined ? undefined : String(parsed.level),
  });
  return { kind: "stats", badgeKey: null, streak: stats.streak, words: stats.words, level: stats.level, lang };
}

// Vanity-counter heuristic: don't count a /s/<id> render as a human click when
// a social/link crawler is scraping OG tags. Not security.
const CRAWLER_RE = /facebookexternalhit|whatsapp|bot|crawler|spider|slurp/i;
export function isSocialCrawler(ua: string): boolean {
  return CRAWLER_RE.test(ua);
}
