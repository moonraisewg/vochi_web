#!/usr/bin/env bash
set -euo pipefail

# MANUAL FALLBACK. The primary path is automated: app CI uploads the DMG to R2
# and opens a vochi_web PR via .github/workflows/update-download-links.yml. Use
# this script only when CI is unavailable.
#
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

if [[ "$DMG_PATH" == "none" ]]; then DMG_PATH=""; fi
if [[ "$EXE_PATH" == "none" ]]; then EXE_PATH=""; fi

if [[ -z "$DMG_PATH" && -z "$EXE_PATH" ]]; then
  echo "Usage: $0 <path/to/app.dmg|none> <path/to/setup.exe|none>" >&2
  exit 1
fi

if [[ -n "$DMG_PATH" && ! -f "$DMG_PATH" ]]; then
  echo "error: DMG not found: $DMG_PATH" >&2; exit 1
fi
if [[ -n "$EXE_PATH" && ! -f "$EXE_PATH" ]]; then
  echo "error: EXE not found: $EXE_PATH" >&2; exit 1
fi

DMG_NAME=""
EXE_NAME=""
if [[ -n "$DMG_PATH" ]]; then DMG_NAME="$(basename "$DMG_PATH")"; fi
if [[ -n "$EXE_PATH" ]]; then EXE_NAME="$(basename "$EXE_PATH")"; fi

echo "==> Calculating SHA-256..."
DMG_SHA="null"
EXE_SHA="null"
if [[ -n "$DMG_PATH" ]]; then
  DMG_SHA="\"$(shasum -a 256 "$DMG_PATH" | awk '{print $1}')\""
  echo "    DMG: $DMG_SHA"
fi
if [[ -n "$EXE_PATH" ]]; then
  EXE_SHA="\"$(shasum -a 256 "$EXE_PATH" | awk '{print $1}')\""
  echo "    EXE: $EXE_SHA"
fi

echo "==> Uploading to R2..."
if [[ -n "$DMG_PATH" ]]; then
  npx wrangler r2 object put "vochi-releases/$DMG_NAME" --file "$DMG_PATH" --remote
fi
if [[ -n "$EXE_PATH" ]]; then
  npx wrangler r2 object put "vochi-releases/$EXE_NAME" --file "$EXE_PATH" --remote
fi

R2_BASE="https://pub-473da2442c814f8396ee4d39873e0829.r2.dev"
DMG_URL="null"
EXE_URL="null"
if [[ -n "$DMG_PATH" ]]; then DMG_URL="\"$R2_BASE/$DMG_NAME\""; fi
if [[ -n "$EXE_PATH" ]]; then EXE_URL="\"$R2_BASE/$EXE_NAME\""; fi

echo "==> Updating lib/releases.ts..."
# Strip the surrounding quotes ($DMG_URL etc. are quoted, or the literal "null"
# when a platform is skipped) and hand raw values to the editor via env — never
# interpolate them into a node -e string (that let bash eat the regex's $1).
RELEASES_TS="$RELEASES_TS" \
DMG_URL="${DMG_URL//\"/}" DMG_SHA="${DMG_SHA//\"/}" \
EXE_URL="${EXE_URL//\"/}" EXE_SHA="${EXE_SHA//\"/}" \
npx --yes tsx "$(dirname "$0")/update-releases.ts"

echo "==> Done."
echo "    DMG: $DMG_URL"
echo "    EXE: $EXE_URL"
echo ""
echo "Next: git add lib/releases.ts && git commit -m 'release: publish <version>' && git push"
