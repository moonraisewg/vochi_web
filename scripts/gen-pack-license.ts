// Usage: pnpm admin:gen-pack [email]
// Creates ONE active lifetime "HSK nâng cao" (hsk_advanced) license directly in
// the DB — no payment — and prints the key. For testing the pack end-to-end:
// activate the printed key in the desktop app to unlock HSK 4/5/6.
//
// Revoke afterwards with:  pnpm admin:license revoke <licenseId|email> [reason]

import { prisma } from "../lib/server/prisma";
import { generateLicenseKey, hashLicenseKey, licensePrefix } from "../lib/server/crypto";
import { expiresAtForPlan, getPlan } from "../lib/server/plans";

async function main() {
  const email = process.argv[2] ?? "pack-test@vochi.app";
  const plan = getPlan("hsk_advanced")!;
  const expiresAt = expiresAtForPlan(plan, new Date()); // null — lifetime

  const licenseKey = generateLicenseKey();
  const license = await prisma.license.create({
    data: {
      email,
      plan: "hsk_advanced",
      status: "active",
      deviceLimit: plan.deviceLimit,
      expiresAt,
      licenseKeyHash: hashLicenseKey(licenseKey),
      licenseKeyPrefix: licensePrefix(licenseKey),
      audits: {
        create: {
          actor: "admin",
          action: "license.issued",
          metadata: { plan: plan.id, source: "gen-pack-license" },
        },
      },
    },
  });

  console.log(`\nhsk_advanced license for ${email} (lifetime, id ${license.id}):\n`);
  console.log(`  ${licenseKey}\n`);
  console.log("→ Nhập key này vào tab License trong app để mở HSK 4/5/6.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
