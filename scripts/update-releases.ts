// Rewrites the mac/windows url + sha256 fields in lib/releases.ts.
//
// Called by scripts/publish-release.sh via `tsx`. Values arrive through the
// environment, NOT as positional args — the previous inline `node -e "...'\$1'..."`
// let bash expand `$1` (the dmg path) into the JS regex backreference, which
// corrupted the file (destroyed the `mac:`/`windows:` keys). A replacement
// *function* (not a `$1` string) sidesteps that class of bug entirely.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export interface ReleaseUpdate {
  dmgUrl?: string;
  dmgSha?: string;
  exeUrl?: string;
  exeSha?: string;
}

// "null"/empty means "this platform wasn't built this run" — leave it as-is.
function skip(value: string | undefined): boolean {
  return !value || value === "null";
}

export function updateReleases(content: string, v: ReleaseUpdate): string {
  const put = (re: RegExp, value: string | undefined): void => {
    if (skip(value)) return;
    content = content.replace(re, (_m, prefix: string) => `${prefix}"${value}"`);
  };
  // `[\s\S]*?` is lazy so each section anchors on its own key; `[^,\n]+` eats the
  // old quoted value up to the trailing comma.
  put(/(mac:\s*\{[\s\S]*?url:\s*)[^,\n]+/, v.dmgUrl);
  put(/(mac:\s*\{[\s\S]*?sha256:\s*)[^,\n]+/, v.dmgSha);
  put(/(windows:\s*\{[\s\S]*?url:\s*)[^,\n]+/, v.exeUrl);
  put(/(windows:\s*\{[\s\S]*?sha256:\s*)[^,\n]+/, v.exeSha);
  return content;
}

function main(): void {
  const file = process.env.RELEASES_TS;
  if (!file) {
    console.error("RELEASES_TS env var is required");
    process.exit(1);
  }
  const out = updateReleases(readFileSync(file, "utf8"), {
    dmgUrl: process.env.DMG_URL,
    dmgSha: process.env.DMG_SHA,
    exeUrl: process.env.EXE_URL,
    exeSha: process.env.EXE_SHA,
  });
  writeFileSync(file, out);
  console.log(`Updated ${file}`);
}

// Run main only when invoked directly (`tsx update-releases.ts`), not when the
// pure function is imported by a test.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
