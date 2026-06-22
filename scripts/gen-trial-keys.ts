// Usage: pnpm admin:gen-trial [count]
// Generates N trial_7days license keys directly in DB (no payment required).
// Default count: 100. Keys are printed to stdout, one per line.

import { prisma } from "../lib/server/prisma";
import { generateLicenseKey, hashLicenseKey, licensePrefix } from "../lib/server/crypto";
import { expiresAtForPlan, getPlan } from "../lib/server/plans";

async function main() {
  const count = Number(process.argv[2] ?? 100);
  if (!Number.isFinite(count) || count < 1 || count > 1000) {
    console.error("Usage: pnpm admin:gen-trial [count=100]  (max 1000)");
    process.exit(1);
  }

  const plan = getPlan("trial_7days")!;
  const now = new Date();
  const expiresAt = expiresAtForPlan(plan, now);
  const keys: string[] = [];

  for (let i = 0; i < count; i++) {
    const licenseKey = generateLicenseKey();
    await prisma.license.create({
      data: {
        email: "mocchaust64@gmail.com",
        plan: "trial_7days",
        status: "active",
        deviceLimit: plan.deviceLimit,
        expiresAt,
        licenseKeyHash: hashLicenseKey(licenseKey),
        licenseKeyPrefix: licensePrefix(licenseKey),
        audits: {
          create: {
            actor: "admin",
            action: "license.issued",
            metadata: { plan: plan.id, source: "gen-trial-keys" },
          },
        },
      },
    });
    keys.push(licenseKey);
  }

  console.log(`Generated ${keys.length} trial keys (expires ${expiresAt?.toISOString()}):\n`);
  keys.forEach((k, i) => console.log(`${String(i + 1).padStart(3, " ")}. ${k}`));
}

main().catch((err) => { console.error(err); process.exit(1); });
