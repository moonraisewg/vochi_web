// First-touch UTM capture for acquisition attribution. Pure functions take an
// injected Storage-like object + `now` so they unit-test without globals.

export const UTM_KEY = "vochi_utm";
export const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

export interface Utm {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

interface Stored {
  utm: Utm;
  savedAt: number;
}

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const KEYS: Array<[keyof Utm, string]> = [
  ["source", "utm_source"],
  ["medium", "utm_medium"],
  ["campaign", "utm_campaign"],
  ["term", "utm_term"],
  ["content", "utm_content"],
];

export function readUtmFromSearch(search: string): Utm {
  const params = new URLSearchParams(search);
  const utm: Utm = {};
  for (const [key, param] of KEYS) {
    const v = params.get(param);
    if (v) utm[key] = v;
  }
  return utm;
}

function isEmpty(utm: Utm): boolean {
  return Object.keys(utm).length === 0;
}

function readStored(store: StorageLike): Stored | null {
  const raw = store.getItem(UTM_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed?.savedAt === "number" && parsed.utm) return parsed;
  } catch {
    // Corrupt entry — treat as absent.
  }
  return null;
}

/** Persist UTM only if nothing valid (unexpired) is stored yet. */
export function storeUtmFirstTouch(utm: Utm, now: number, store: StorageLike): void {
  if (isEmpty(utm)) return;
  const existing = readStored(store);
  if (existing && now - existing.savedAt < TTL_MS) return; // first-touch wins
  const payload: Stored = { utm, savedAt: now };
  store.setItem(UTM_KEY, JSON.stringify(payload));
}

/** Return stored UTM if within TTL, else null. */
export function getStoredUtm(now: number, store: StorageLike): Utm | null {
  const existing = readStored(store);
  if (!existing) return null;
  if (now - existing.savedAt >= TTL_MS) return null;
  return existing.utm;
}
