"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Giá · nhẹ ví",
    title: "Trả một lần. Học vô tư.",
    sub: "Mua một lần. Chuyển khoản xong, key vô mail trong 30 giây. Đi nuôi thú thôi.",
    plans: [
      {
        name: "Free",
        price: "0đ",
        priceNote: "miễn phí, hong đùa",
        cta: "Lụm free",
        href: "/download",
        features: [
          "1 thú nhỏ, 100 từ sẵn",
          "Mode 1, 1 thiết bị",
          "Vô Discord chém gió",
        ],
        featured: false,
      },
      {
        name: "1 tháng",
        price: "59.000đ",
        priceNote: "thử trước khi chốt lâu dài",
        cta: "Thử 1 tháng",
        href: "/checkout?plan=one_month",
        features: [
          "Có hết của Free",
          "Mode 2, không giới hạn từ",
          "2 thiết bị",
        ],
        featured: false,
      },
      {
        name: "3 tháng",
        price: "129.000đ",
        priceNote: "khoảng 43k mỗi tháng",
        cta: "Thử 3 tháng",
        href: "/checkout?plan=three_months",
        features: [
          "Có hết của 1 tháng",
          "Tiết kiệm 48k so với mua lẻ từng tháng",
          "2 thiết bị",
        ],
        featured: true,
      },
      {
        name: "Lifetime",
        price: "599.000đ",
        priceNote: "trả 1 phát, giữ trọn đời",
        cta: "Chốt deal",
        href: "/checkout?plan=lifetime",
        features: [
          "Có hết của 3 tháng",
          "Mãi mãi, không hết hạn",
          "Thú mới tương lai free",
          "DM admin trực tiếp",
        ],
        featured: false,
      },
    ],
    badge: "Ai cũng chọn",
    student: "Nếu là sinh viên, điền mail .edu.vn lúc mua, giảm 50% đấy.",
  },
  en: {
    eyebrow: "Pricing · easy",
    title: "Pay once. Learn chill.",
    sub: "Buy once. Transfer done, key hits your inbox in 30 seconds. Go adopt.",
    plans: [
      {
        name: "Free",
        price: "0đ",
        priceNote: "free, like, forever",
        cta: "Try it",
        href: "/download",
        features: [
          "1 creature, 100 seed words",
          "Mode 1, 1 device",
          "Hang out on Discord",
        ],
        featured: false,
      },
      {
        name: "1 month",
        price: "59.000đ",
        priceNote: "try before you commit",
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
        name: "3 months",
        price: "129.000đ",
        priceNote: "about 43k a month",
        cta: "Try 3 months",
        href: "/checkout?plan=three_months",
        features: [
          "Everything in 1 month",
          "Save 48k vs monthly",
          "2 devices",
        ],
        featured: true,
      },
      {
        name: "Lifetime",
        price: "599.000đ",
        priceNote: "pay once, keep forever",
        cta: "Lock it in",
        href: "/checkout?plan=lifetime",
        features: [
          "Everything in 3 months",
          "Never expires",
          "Future creature skins free",
          "DM the maker directly",
        ],
        featured: false,
      },
    ],
    badge: "Most popular",
    student: "Use your student email (.edu.vn) at checkout — 50% off.",
  },
};

export function PricingTeaser({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section id="pricing" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="micro mb-4">{t.eyebrow}</div>
            <h2 className="font-display text-[40px] leading-[1.02] tracking-tight md:text-[64px]">
              {t.title}
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-6">
            <p className="max-w-[420px] text-[16px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[17px]">
              {t.sub}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
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
                <div className="font-display text-[30px] leading-none tracking-tight">
                  {plan.price}
                </div>
                <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  {plan.priceNote}
                </div>
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
                href={plan.href}
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
