import { prisma } from "../lib/server/prisma";
import { processEmailOutboxOnce } from "../lib/server/email";

const [command, value, extra] = process.argv.slice(2);

if (!command || !value) {
  console.error("Usage: pnpm admin:license <lookup|revoke|extend|resend> <email|licenseId> [days|reason]");
  process.exit(1);
}

if (command === "lookup") {
  const orders = await prisma.order.findMany({
    where: { OR: [{ email: value }, { invoiceNumber: value }] },
    include: { license: { include: { activations: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  console.log(JSON.stringify(orders, null, 2));
} else if (command === "revoke") {
  const license = await prisma.license.update({
    where: { id: value },
    data: {
      status: "revoked",
      audits: { create: { actor: "admin", action: "license.revoked", metadata: { reason: extra ?? null } } },
    },
  });
  console.log(JSON.stringify({ revoked: license.id }, null, 2));
} else if (command === "extend") {
  const days = Number(extra);
  if (!Number.isFinite(days) || days <= 0) throw new Error("extend requires a positive day count");
  const current = await prisma.license.findUniqueOrThrow({ where: { id: value } });
  const base = current.expiresAt && current.expiresAt > new Date() ? current.expiresAt : new Date();
  const license = await prisma.license.update({
    where: { id: value },
    data: {
      expiresAt: new Date(base.getTime() + days * 24 * 60 * 60 * 1000),
      audits: { create: { actor: "admin", action: "license.extended", metadata: { days } } },
    },
  });
  console.log(JSON.stringify({ extended: license.id, expiresAt: license.expiresAt }, null, 2));
} else if (command === "resend") {
  await prisma.emailOutbox.updateMany({
    where: { licenseId: value, type: "license_issued" },
    data: { status: "pending", lastError: null },
  });
  console.log(JSON.stringify(await processEmailOutboxOnce(1), null, 2));
} else {
  throw new Error(`Unknown command: ${command}`);
}
