// `student` is kept in the backend (planned: .edu.vn verification) but is
// intentionally NOT surfaced on the pricing/teaser UI — see WEB_MERGE_PLAN.md.
export const PLAN_IDS = ["one_month", "three_months", "lifetime", "student"] as const;
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
  one_month: {
    id: "one_month",
    name: "1 month",
    amountVnd: 59_000,
    deviceLimit: 2,
    durationDays: 30,
    features: ["mode2", "unlimited_vocab", "skins", "stats"],
  },
  three_months: {
    id: "three_months",
    name: "3 months",
    amountVnd: 129_000,
    deviceLimit: 2,
    durationDays: 90,
    features: ["mode2", "unlimited_vocab", "skins", "stats"],
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime",
    amountVnd: 599_000,
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
