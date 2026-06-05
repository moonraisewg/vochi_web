"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Bảng giá",
    title: "Trả một lần. Học trọn đời.",
    sub: "",
    plans: [
      {
        id: "free",
        name: "Free",
        price: "0đ",
        priceNote: "miễn phí, dùng mãi mãi",
        cta: "Lụm free",
        href: "/download",
        features: [
          "1 thú nhỏ, 100 từ mẫu",
          "Chế độ 1, 1 thiết bị",
          "Tham gia cộng đồng Discord",
        ],
        featured: false,
      },
      {
        id: "one_month",
        name: "1 tháng",
        price: "59.000đ",
        priceNote: "thử trước khi chốt lâu dài",
        compare: "≈ 1 ly cà phê sữa Highlands",
        compareStudent: "≈ 1 ly trà chanh vỉa hè",
        cta: "Thử 1 tháng",
        href: "/checkout?plan=one_month",
        features: [
          "Đầy đủ tính năng của Free",
          "Chế độ 2, không giới hạn từ",
          "2 thiết bị cùng lúc",
        ],
        featured: false,
      },
      {
        id: "three_months",
        name: "3 tháng",
        price: "129.000đ",
        priceNote: "khoảng 43.000đ mỗi tháng",
        compare: "≈ 1 bữa cơm tấm sườn bì chả",
        compareStudent: "≈ 1 ly bạc xỉu Highlands",
        cta: "Thử 3 tháng",
        href: "/checkout?plan=three_months",
        features: [
          "Đầy đủ tính năng của gói 1 tháng",
          "Tiết kiệm 48.000đ so với mua từng tháng",
          "Mở khoá thêm 3 thú nhỏ (đã và sắp ra mắt)",
        ],
        featured: true,
      },
      {
        id: "lifetime",
        name: "Lifetime",
        price: "599.000đ",
        priceNote: "trả một lần, dùng trọn đời",
        compare: "≈ 1 buổi xem phim CGV cùng bắp nước",
        compareStudent: "≈ 2 buổi cà phê cuối tuần",
        cta: "Chốt deal",
        href: "/checkout?plan=lifetime",
        features: [
          "Đầy đủ tính năng của gói 3 tháng",
          "Không bao giờ hết hạn",
          "Tặng 10 bộ thú nhỏ đã và sắp ra mắt",
          "Hỗ trợ ưu tiên qua email",
        ],
        featured: false,
      },
    ],
    badge: "Ai cũng chọn",
    student: "Sinh viên có email .edu.vn được giảm thêm 50%, dùng mail .edu.vn khi mua hoặc liên hệ qua hi@vochi.xyz.",
  },
  en: {
    eyebrow: "Pricing",
    title: "Pay once. Learn for life.",
    sub: "",
    plans: [
      {
        id: "free",
        name: "Free",
        price: "0đ",
        priceNote: "free, forever",
        cta: "Try it",
        href: "/download",
        features: [
          "1 creature, 100 starter words",
          "Mode 1, 1 device",
          "Community Discord",
        ],
        featured: false,
      },
      {
        id: "one_month",
        name: "1 month",
        price: "59.000đ",
        priceNote: "try before you commit",
        compare: "≈ one coffee in town",
        compareStudent: "≈ one street-side iced tea",
        cta: "Try 1 month",
        href: "/checkout?plan=one_month",
        features: [
          "Everything in Free",
          "Mode 2, unlimited words",
          "2 devices",
        ],
        featured: false,
      },
      {
        id: "three_months",
        name: "3 months",
        price: "129.000đ",
        priceNote: "about 43k a month",
        compare: "≈ one cơm tấm lunch",
        compareStudent: "≈ one specialty drink",
        cta: "Get 3 months",
        href: "/checkout?plan=three_months",
        features: [
          "Everything in 1 month",
          "Save 48k vs monthly billing",
          "Unlock 3 creatures (current and upcoming)",
        ],
        featured: true,
      },
      {
        id: "lifetime",
        name: "Lifetime",
        price: "599.000đ",
        priceNote: "pay once, keep forever",
        compare: "≈ one movie night with snacks",
        compareStudent: "≈ two weekend café visits",
        cta: "Lock it in",
        href: "/checkout?plan=lifetime",
        features: [
          "Everything in 3 months",
          "Never expires",
          "10 creature skins included",
          "Priority email support",
        ],
        featured: false,
      },
    ],
    badge: "Most popular",
    student: "Students with a .edu.vn email get an extra 50% off; use your student email at checkout or contact hi@vochi.xyz.",
  },
};

export function PricingTeaser({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [isStudent, setIsStudent] = useState(false);

  return (
    <section id="pricing" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="micro mb-4">{t.eyebrow}</div>
            <h2 className="font-display text-[40px] leading-[1.02] tracking-tight md:text-[64px]">
              {t.title}
            </h2>
            <div className="mt-8 flex items-center">
              <label className="group flex cursor-pointer items-center gap-3 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] py-2 pl-3 pr-4 transition-all hover:border-[var(--color-ink)] hover:shadow-sm">
                <div
                  className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${
                    isStudent ? "bg-[var(--color-ink)]" : "bg-[var(--color-hairline-strong)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isStudent ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[14px] font-medium text-[var(--color-ink)]">
                    {lang === "vi" ? "Dành cho sinh viên" : "Student discount"}
                  </span>
                  <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-white">
                    -50%
                  </span>
                </div>
              </label>
            </div>
          </div>
          {t.sub && (
            <div className="md:col-span-5 md:pt-6">
              <p className="max-w-[420px] text-[16px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[17px]">
                {t.sub}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col rounded-2xl border p-6 transition-shadow ${
                plan.featured
                  ? "border-[var(--color-ink)] bg-[var(--color-surface)] lift-md"
                  : "border-[var(--color-hairline-strong)] bg-[var(--color-surface)] lift"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-6 rounded-full bg-[var(--color-ink)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-surface)]">
                  {t.badge}
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[20px] tracking-tight">{plan.name}</h3>
              </div>

              <div className="mt-5">
                {isStudent && plan.id !== "free" ? (
                  <>
                    <div className="font-display text-[20px] leading-none tracking-tight text-[var(--color-ink-muted)] line-through decoration-[var(--color-hairline-strong)]">
                      {plan.price}
                    </div>
                    <div className="mt-1 font-display text-[30px] leading-none tracking-tight text-[var(--color-accent)]">
                      {plan.id === "one_month" ? "29.000đ" :
                       plan.id === "three_months" ? "65.000đ" :
                       "249.000đ"}
                    </div>
                  </>
                ) : (
                  <div className="font-display text-[30px] leading-none tracking-tight">
                    {plan.price}
                  </div>
                )}
                <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  {plan.priceNote}
                </div>
                {(isStudent ? plan.compareStudent : plan.compare) && (
                  <div className="mt-2 text-[12.5px] italic leading-snug text-[var(--color-ink-soft)]">
                    {isStudent ? plan.compareStudent : plan.compare}
                  </div>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-2.5 border-t border-[var(--color-hairline)] pt-5 text-[13.5px] leading-[1.45] text-[var(--color-ink-soft)]">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={isStudent && plan.id !== "free" ? (
                  plan.id === "one_month" ? "/checkout?plan=one_month_student" :
                  plan.id === "three_months" ? "/checkout?plan=three_months_student" :
                  "/checkout?plan=student"
                ) : plan.href}
                className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors ${
                  plan.featured
                    ? "bg-[var(--color-ink)] text-[var(--color-surface)] hover:bg-[var(--color-accent-deep)]"
                    : "border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-tint)]"
                }`}
              >
                {plan.cta}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-hairline)] pt-6">
          <Link
            href="/pricing"
            className="text-[14px] text-[var(--color-ink-soft)] underline decoration-[var(--color-hairline-strong)] decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)]"
          >
            {t.student}
          </Link>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            VietQR · Vietcombank · Techcombank · MB · ACB
          </div>
        </div>
      </div>
    </section>
  );
}
