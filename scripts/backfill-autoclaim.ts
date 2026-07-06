import { findBackfillCandidates, runBackfillAutoClaim } from "../lib/server/accountLicenses";

// Async IIFE, not top-level await — some tsx/esbuild setups transform this file as
// CJS, which doesn't support top-level await (confirmed pre-existing: scripts/admin-license.ts
// hits the same "Transform failed... Top-level await is currently not supported" error).
async function main() {
  const apply = process.argv.includes("--apply");
  const candidates = await findBackfillCandidates();

  if (!apply) {
    console.log(
      JSON.stringify({ dryRun: true, candidateCount: candidates.length, candidates }, null, 2),
    );
  } else {
    const results = await runBackfillAutoClaim(candidates);
    const totalAttached = results.reduce((sum, r) => sum + r.attached, 0);
    console.log(
      JSON.stringify({ dryRun: false, usersProcessed: results.length, totalAttached, results }, null, 2),
    );
  }
}

main();
