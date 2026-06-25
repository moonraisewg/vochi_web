/// Tauri updater manifest shape (the subset we validate). We pass the manifest
/// through verbatim — the per-platform `signature` fields must reach the updater
/// unchanged — so this only guards against serving a non-manifest (e.g. an R2
/// error page) as if it were valid.
export interface UpdaterManifest {
  version: string;
  platforms: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Parse + minimally validate an updater manifest fetched from storage. Throws if
 * the payload is not JSON or is missing `version`/`platforms`, so the proxy route
 * can return a 5xx and let the desktop updater fall back to the next endpoint
 * instead of treating a garbage body as "no update".
 */
export function parseUpdaterManifest(raw: string): UpdaterManifest {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("updater manifest is not valid JSON");
  }
  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as { version?: unknown }).version !== "string" ||
    typeof (data as { platforms?: unknown }).platforms !== "object" ||
    (data as { platforms?: unknown }).platforms === null
  ) {
    throw new Error("updater manifest missing version/platforms");
  }
  return data as UpdaterManifest;
}
