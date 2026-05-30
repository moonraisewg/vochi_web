"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Giá · nhẹ ví",
    title: "Trả một lần. Học vô tư.",
    sub: "Khỏi sub mệt mỏi. Quét VietQR qua Sepay, 30 giây sau license bay vô mail. Xong, đi nuôi thú nhỏ.",
    plans: [
      {
        name: "Free",
        price: "0đ",
        priceNote: "miễn phí mãi mãi, hong đùa",
        cta: "Lụm free",
        href: "/download",
        features: [
          "1 thú nhỏ, 100 từ có sẵn",
          "Mode 1 + Mode 2 (ngủ có lịch)",
          "1 thiết bị",
          "Vô Discord chém gió",
        ],
        featured: false,
      },
      {
        name: "Pro",
        price: "990.000đ",
        priceNote: "12 tháng quẩy",
        cta: "Lên Pro nào trùm",
        href: "/checkout?plan=pro_annual",
        features: [
          "Có hết của Free",
          "Không giới hạn từ",
          "Đẩy CSV của bạn",
          "3 thiết bị",
          "Mở khoá skin thú nhỏ",
          "Lịch streak xinh xinh",
        ],
        featured: true,
      },
      {
        name: "Lifetime",
        price: "1.990.000đ",
        priceNote: "trả 1 phát, giữ trọn đời",
        cta: "Chốt deal lifetime",
        href: "/checkout?plan=lifetime",
        features: [
          "Có hết của Pro",
          "Mãi mãi, không hết hạn",
          "Thú mới tương lai free",
          "Vô beta sớm",
          "DM admin trực tiếp",
        ],
        featured: false,
      },
    ],
    student: "Sinh viên? 490.000đ/năm với mail .edu.vn, rẻ hơn ly trà sữa mỗi tháng.",
  },
  en: {
    eyebrow: "Pricing · easy",
    title: "Pay once. Learn chill.",
    sub: "No subscription. Scan VietQR via Sepay, license drops into your inbox in 30 seconds. Then go adopt a creature.",
    plans: [
      {
        name: "Free",
        price: "0đ",
        priceNote: "free forever",
        cta: "Download free",
        href: "/download",
        features: [
          "1 creature, 100 seed words",
          "Mode 1 + Mode 2 (scheduled wake-up)",
          "1 device",
          "Community Discord",
        ],
        featured: false,
      },
      {
        name: "Pro",
        price: "990.000đ",
        priceNote: "12 months",
        cta: "Go Pro",
        href: "/checkout?plan=pro_annual",
        features: [
          "Everything in Free",
          "Unlimited words",
          "Bring your own CSV",
          "3 devices",
          "Unlock creature skins",
          "Streak calendar",
        ],
        featured: true,
      },
      {
        name: "Lifetime",
        price: "1.990.000đ",
        priceNote: "pay once, keep forever",
        cta: "Get lifetime",
        href: "/checkout?plan=lifetime",
        features: [
          "Everything in Pro",
          "Never expires",
          "All future creature skins free",
          "Early beta access",
          "DM the maker directly",
        ],
        featured: false,
      },
    ],
    student: "Student with .edu.vn email? 490.000đ a year.",
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col rounded-2xl border p-7 transition-shadow ${
                plan.featured
                  ? "border-[var(--color-ink)] bg-[var(--color-surface)] lift-md"
                  : "border-[var(--color-hairline-strong)] bg-[var(--color-surface)] lift"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-7 rounded-full bg-[var(--color-ink)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-surface)]">
                  Ai cũng chọn
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[22px] tracking-tight">{plan.name}</h3>
              </div>

              <div className="mt-6">
                <div className="font-display text-[36px] leading-none tracking-tight">
                  {plan.price}
                </div>
                <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  {plan.priceNote}
                </div>
              </div>

              <ul className="mt-7 flex-1 space-y-2.5 border-t border-[var(--color-hairline)] pt-6 text-[14px] leading-[1.45] text-[var(--color-ink-soft)]">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-7 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-[13px] font-medium transition-colors ${
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
