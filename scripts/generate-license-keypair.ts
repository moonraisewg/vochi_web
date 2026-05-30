import crypto from "crypto";
import * as ed from "@noble/ed25519";

// Generates a fresh Ed25519 keypair for license signing.
//
// Output is base64url-encoded (no padding), matching the format the server
// reads from LICENSE_SIGNING_PRIVATE_KEY / LICENSE_PUBLIC_KEY and that the
// desktop app embeds via VITE_LICENSE_PUBLIC_KEY. The private seed NEVER
// leaves the server; the public key is safe to embed in the client binary.
//
// Run:  pnpm tsx scripts/generate-license-keypair.ts

function base64Url(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64url");
}

async function main() {
  const seed = crypto.randomBytes(32);
  const publicKey = await ed.getPublicKeyAsync(seed);

  const privateB64 = base64Url(seed);
  const publicB64 = base64Url(publicKey);

  process.stdout.write(
    [
      "# Ed25519 license keypair — generated once, store securely.",
      "# Server .env (vocabochi_web):",
      `LICENSE_SIGNING_PRIVATE_KEY="${privateB64}"`,
      `LICENSE_PUBLIC_KEY="${publicB64}"`,
      "",
      "# Desktop app .env (vocabagotchi) — public key only:",
      `VITE_LICENSE_PUBLIC_KEY="${publicB64}"`,
      "",
    ].join("\n"),
  );
}

main().catch((err) => {
  process.stderr.write(`keypair generation failed: ${String(err)}\n`);
  process.exitCode = 1;
});
