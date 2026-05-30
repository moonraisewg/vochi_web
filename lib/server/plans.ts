export const PLAN_IDS = ["pro_annual", "lifetime", "student"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export type PlanDefinition = {
  id: PlanId;
  name: string;
  amountVnd: number;
  deviceLimit: number;
  durationDays: number | null;
  features: string[];
};

export const PLANS: Record<PlanId, PlanDefinition> = {
  pro_annual: {
    id: "pro_annual",
    name: "Pro, 12 months",
    amountVnd: 990_000,
    deviceLimit: 3,
    durationDays: 365,
    features: ["mode2", "unlimited_vocab", "skins", "stats"],
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime",
    amountVnd: 1_990_000,
    deviceLimit: 5,
    durationDays: null,
    features: ["mode2", "unlimited_vocab", "skins", "stats", "future_skins"],
  },
  student: {
    id: "student",
    name: "Student, 12 months",
    amountVnd: 490_000,
    deviceLimit: 1,
    durationDays: 365,
    features: ["mode2", "unlimited_vocab", "skins", "stats"],
  },
};

export function getPlan(plan: string): PlanDefinition | null {
  return PLAN_IDS.includes(plan as PlanId) ? PLANS[plan as PlanId] : null;
}

export function expiresAtForPlan(plan: PlanDefinition, paidAt: Date): Date | null {
  if (plan.durationDays == null) return null;
  return new Date(paidAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
}
