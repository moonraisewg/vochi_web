import { serverEnv } from "@/lib/server/env";
import { jsonError, jsonOk } from "@/lib/server/http";
import { parseUpdaterManifest } from "@/lib/server/updater";

export const runtime = "nodejs";
// Never statically cache the manifest — clients must always see the latest.
export const dynamic = "force-dynamic";

/**
 * Stable updater endpoint. Desktop apps bake this URL (vochi.xyz) instead of the
 * raw R2 bucket URL, so the storage behind it can change without re-shipping
 * apps. Proxies the manifest from R2 verbatim (signatures must be untouched).
 *
 * On any upstream problem returns 502 so the Tauri updater falls through to its
 * fallback endpoint (the raw R2 URL) rather than treating a bad body as valid.
 */
export async function GET() {
  try {
    const source = serverEnv().UPDATER_MANIFEST_SOURCE;
    const res = await fetch(source, { cache: "no-store" });
    if (!res.ok) {
      return jsonError("UpstreamUnavailable", `manifest source returned ${res.status}`, 502);
    }
    const manifest = parseUpdaterManifest(await res.text());
    return jsonOk(manifest, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to fetch manifest";
    return jsonError("UpstreamUnavailable", message, 502);
  }
}
