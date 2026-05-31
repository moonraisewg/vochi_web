import { z } from "zod";
import { prisma } from "./prisma";
import { generateInvoiceNumber } from "./crypto";
import { getPlan, PLAN_IDS } from "./plans";

export const createCheckoutSchema = z.object({
  // Derive from PLAN_IDS so the schema never drifts from the plan catalog.
  plan: z.enum(PLAN_IDS),
  email: z.string().trim().toLowerCase().email(),
});

export async function createOrder(input: z.infer<typeof createCheckoutSchema>) {
  const plan = getPlan(input.plan);
  if (!plan) throw new Error("Unknown plan");
  if (plan.id === "student" && !input.email.endsWith(".edu.vn")) {
    throw new Error("Student plan requires a .edu.vn email address");
  }

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  return prisma.order.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      plan: plan.id,
      amountVnd: plan.amountVnd,
      currency: "VND",
      email: input.email,
      status: "pending",
      expiresAt,
      audits: {
        create: {
          actor: "checkout",
          action: "order.created",
          metadata: { plan: plan.id, amountVnd: plan.amountVnd },
        },
      },
    },
  });
}

export async function getPublicOrder(invoiceNumber: string) {
  const order = await prisma.order.findUnique({
    where: { invoiceNumber },
    select: {
      invoiceNumber: true,
      plan: true,
      status: true,
      paidAt: true,
      expiresAt: true,
      license: { select: { id: true, status: true } },
    },
  });
  if (!order) return null;
  return {
    invoiceNumber: order.invoiceNumber,
    plan: order.plan,
    status: order.status,
    paidAt: order.paidAt?.toISOString() ?? null,
    expiresAt: order.expiresAt.toISOString(),
    licenseIssued: order.license?.status === "active",
  };
}
