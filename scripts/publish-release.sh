#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/publish-release.sh <dmg-path> <exe-path>
# Requires CLOUDFLARE_API_TOKEN in .env.local or environment.

RELEASES_TS="$(dirname "$0")/../lib/releases.ts"
ENV_FILE="$(dirname "$0")/../.env.local"

# Load env if file exists
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a; source "$ENV_FILE"; set +a
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "error: CLOUDFLARE_API_TOKEN is not set" >&2
  exit 1
fi

DMG_PATH="${1:-}"
EXE_PATH="${2:-}"

if [[ -z "$DMG_PATH" || -z "$EXE_PATH" ]]; then
  echo "Usage: $0 <path/to/app.dmg> <path/to/setup.exe>" >&2
  exit 1
fi

if [[ ! -f "$DMG_PATH" ]]; then
  echo "error: DMG not found: $DMG_PATH" >&2; exit 1
fi
if [[ ! -f "$EXE_PATH" ]]; then
  echo "error: EXE not found: $EXE_PATH" >&2; exit 1
fi

DMG_NAME="$(basename "$DMG_PATH")"
EXE_NAME="$(basename "$EXE_PATH")"

echo "==> Calculating SHA-256..."
DMG_SHA=$(shasum -a 256 "$DMG_PATH" | awk '{print $1}')
EXE_SHA=$(shasum -a 256 "$EXE_PATH" | awk '{print $1}')
echo "    DMG: $DMG_SHA"
echo "    EXE: $EXE_SHA"

echo "==> Uploading to R2..."
wrangler r2 object put "vochi-releases/$DMG_NAME" --file "$DMG_PATH" --remote
wrangler r2 object put "vochi-releases/$EXE_NAME" --file "$EXE_PATH" --remote

R2_BASE="https://pub-473da2442c814f8396ee4d39873e0829.r2.dev"
DMG_URL="$R2_BASE/$DMG_NAME"
EXE_URL="$R2_BASE/$EXE_NAME"

echo "==> Updating lib/releases.ts..."
cat > "$RELEASES_TS" <<TSEOF
// Single source of truth for downloadable app artifacts.
//
// While artifacts are not built yet, keep \`url\` and \`sha256\` as \`null\` — the
// download page renders those cards as "coming soon" (disabled) instead of a
// dead \`href="#"\`. After a build:
//   1. Upload the DMG / MSI (e.g. a GitHub release asset).
//   2. Fill in \`url\` and the real SHA-256 digest below.
// Nothing else needs to change — the page reads everything from here.

export type ReleaseArtifact = {
  /** Absolute download URL, or \`null\` until the artifact is published. */
  url: string | null;
  /** Hex SHA-256 of the artifact, or \`null\` until known. */
  sha256: string | null;
};

export type Releases = {
  mac: ReleaseArtifact;
  windows: ReleaseArtifact;
};

export const RELEASES: Releases = {
  mac: {
    url: "$DMG_URL",
    sha256: "$DMG_SHA",
  },
  windows: {
    url: "$EXE_URL",
    sha256: "$EXE_SHA",
  },
};
TSEOF

echo "==> Done."
echo "    DMG: $DMG_URL"
echo "    EXE: $EXE_URL"
echo ""
echo "Next: git add lib/releases.ts && git commit -m 'release: publish <version>' && git push"
