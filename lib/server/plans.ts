// `student` is kept in the backend (planned: .edu.vn verification) but is
// intentionally NOT surfaced on the pricing/teaser UI — see WEB_MERGE_PLAN.md.
export const PLAN_IDS = ["one_month", "three_months", "lifetime", "student", "one_month_student", "three_months_student", "trial_7days", "hsk_advanced"] as const;
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
    name: "Student Lifetime",
    amountVnd: 249_000,
    deviceLimit: 5,
    durationDays: null,
    features: ["mode2", "unlimited_vocab", "skins", "stats", "future_skins"],
  },
  one_month_student: {
    id: "one_month_student",
    name: "1 month (Student)",
    amountVnd: 29_000,
    deviceLimit: 2,
    durationDays: 30,
    features: ["mode2", "unlimited_vocab", "skins", "stats"],
  },
  three_months_student: {
    id: "three_months_student",
    name: "3 months (Student)",
    amountVnd: 65_000,
    deviceLimit: 2,
    durationDays: 90,
    features: ["mode2", "unlimited_vocab", "skins", "stats"],
  },
  trial_7days: {
    id: "trial_7days",
    name: "Dùng thử 7 ngày",
    amountVnd: 0,
    deviceLimit: 1,
    durationDays: 7,
    features: ["mode2", "unlimited_vocab", "skins", "stats"],
  },
  // Separately-bought "HSK nâng cao" content pack (HSK 4/5/6). Grants ONLY the
  // pack feature — base Pro (Oxford / HSK 1-3 / skins / stats) is a separate buy.
  // Lifetime (mua đứt). TODO(giá): 50k là giá tạm — chốt lại trước khi mở bán.
  hsk_advanced: {
    id: "hsk_advanced",
    name: "HSK nâng cao",
    amountVnd: 50_000,
    deviceLimit: 1, // 1 key = 1 máy (đổi máy → admin:license reset-devices)
    durationDays: null,
    features: ["pack_hsk_advanced"],
  },
};

export function getPlan(plan: string): PlanDefinition | null {
  return PLAN_IDS.includes(plan as PlanId) ? PLANS[plan as PlanId] : null;
}

export function expiresAtForPlan(plan: PlanDefinition, paidAt: Date): Date | null {
  if (plan.durationDays == null) return null;
  return new Date(paidAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
}
