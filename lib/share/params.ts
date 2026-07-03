// Query-param parsing for the public /share pages. Everything arriving here
// is attacker-controlled — clamp to bounded ranges so the OG image generator
// can never be fed absurd input.

export type ShareLang = "vi" | "en";

export interface ShareStats {
  streak: number;
  words: number;
  level: number;
}

type Param = string | string[] | undefined;

const CAPS: ShareStats = { streak: 3650, words: 99999, level: 999 };

function clampInt(value: Param, cap: number): number {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || !/^-?\d+(\.\d+)?$/.test(raw)) return 0;
  const n = Math.floor(Number(raw));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, cap);
}

export function parseStatsParams(params: Record<string, Param>): ShareStats {
  return {
    streak: clampInt(params.streak, CAPS.streak),
    words: clampInt(params.words, CAPS.words),
    level: clampInt(params.level, CAPS.level),
  };
}

export function parseLang(value: Param): ShareLang {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "en" ? "en" : "vi";
}

// Self-canonical URL for a share page. The root layout declares
// alternates.canonical = site root; a share page MUST override both
// alternates.canonical and openGraph.url with its own URL, otherwise Facebook
// honors the inherited root canonical and unfurls every link into the homepage
// OG card instead of the badge/stats card.
export function badgeShareUrl(key: string, lang: ShareLang): string {
  return `/share/badge/${key}?lang=${lang}`;
}

export function statsShareUrl(stats: ShareStats, lang: ShareLang): string {
  const query = new URLSearchParams({
    streak: String(stats.streak),
    words: String(stats.words),
    level: String(stats.level),
    lang,
  });
  return `/share/stats?${query.toString()}`;
}
