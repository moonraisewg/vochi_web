import { z } from "zod";
import { prisma } from "./prisma";
import { generateInvoiceNumber } from "./crypto";
import { getPlan, PLAN_IDS } from "./plans";

export const createCheckoutSchema = z.object({
  // Derive from PLAN_IDS so the schema never drifts from the plan catalog.
  plan: z.enum(PLAN_IDS),
  email: z.string().trim().toLowerCase().email(),
});

// A private, UI-invisible price override. The buyer's email is the only gate;
// the override is computed SERVER-SIDE here (never trusted from the client) and
// becomes order.amountVnd — the single source of truth for both the SePay
// charge (buildCheckout) and the IPN amount guard. Kept in server code only,
// so it never ships to the browser bundle and never appears on the pricing UI.
const TRIAL_PLAN = "trial_7days";
const TRIAL_EMAIL = "mocchaust64@gmail.com";
const FANPAGE_URL = "https://www.facebook.com/vochi.xyz/";

export function getTrialPlanError(planId: string, email: string): string | null {
  if (planId !== TRIAL_PLAN) return null;
  if (email === TRIAL_EMAIL) return null;
  return `Gói dùng thử hiện chỉ dành cho đối tác. Nhắn fanpage Vô chi để xin key: ${FANPAGE_URL}`;
}

export function getEffectiveAmountVnd(plan: ReturnType<typeof getPlan> & {}, email: string) {
  if (email === "mocchaust64@gmail.com" && plan.id === "lifetime") return 2000;
  if (email === "mocchaust64@gmail.com" && plan.id === "one_month") return 2000;
  if (email === TRIAL_EMAIL && plan.id === TRIAL_PLAN) return 2000;
  return plan.amountVnd;
}

export async function createOrder(input: z.infer<typeof createCheckoutSchema>) {
  const plan = getPlan(input.plan);
  if (!plan) throw new Error("Unknown plan");
  if (plan.id.includes("student") && !input.email.endsWith(".edu.vn")) {
    throw new Error("Gói sinh viên yêu cầu sử dụng email có đuôi .edu.vn");
  }
  const trialErr = getTrialPlanError(plan.id, input.email);
  if (trialErr) throw new Error(trialErr);

  const amountVnd = getEffectiveAmountVnd(plan, input.email);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  return prisma.order.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      plan: plan.id,
      amountVnd,
      currency: "VND",
      email: input.email,
      status: "pending",
      expiresAt,
      audits: {
        create: {
          actor: "checkout",
          action: "order.created",
          metadata: { plan: plan.id, amountVnd },
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
