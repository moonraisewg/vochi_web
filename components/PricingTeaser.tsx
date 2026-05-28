"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Giá nhiêu · không cắt cổ",
    title: "Trả 1 phát. Cày tới già.",
    sub: "Khum có subscription nhảm. Quét VietQR qua Sepay, 30 giây xong, license bay vô mail. Bạn ngồi cười.",
    plans: [
      {
        name: "Free",
        price: "0đ",
        priceNote: "free mãi mãi · ko đùa",
        cta: "Lụm free",
        href: "/download",
        accent: "var(--color-rice)",
        features: ["1 con pet · 100 từ sẵn", "Mode 1 (pet đi lông bông)", "1 thiết bị", "Vô Discord chém gió"],
        badge: null,
      },
      {
        name: "Pro · 1 năm",
        price: "990.000đ",
        priceNote: "~$39 · 12 tháng quẩy",
        cta: "Lên Pro nào trùm",
        href: "/checkout?plan=pro_annual",
        accent: "var(--color-lcd)",
        features: ["Có hết của Free", "Mode 2: pet ngủ có giờ giấc", "CSV không giới hạn", "3 thiết bị cùng lúc", "Mở khoá full skin pet", "Lịch streak xịn xò"],
        badge: "AI CŨNG CHỌN",
      },
      {
        name: "Lifetime",
        price: "1.990.000đ",
        priceNote: "~$79 · trả 1 lần · giữ trọn đời",
        cta: "Chốt deal lifetime",
        href: "/checkout?plan=lifetime",
        accent: "var(--color-pop)",
        features: ["Có hết của Pro", "Mãi mãi · không bao giờ hết hạn", "Pet skin tương lai free", "Vô beta sớm flex bạn bè", "DM admin trực tiếp"],
        badge: "500 SLOT · HẾT LÀ HẾT",
      },
    ],
    student: "Sinh viên? 490.000đ/năm với mail .edu.vn — rẻ hơn 1 ly Phúc Long mỗi tháng →",
  },
  en: {
    eyebrow: "Pricing (wallet-friendly)",
    title: "Pay once. Grind forever.",
    sub: "No subscription nonsense. Scan a VietQR via Sepay, 30 seconds, license drops in your inbox.",
    plans: [
      {
        name: "Free",
        price: "0đ",
        priceNote: "free, like, forever",
        cta: "Try it",
        href: "/download",
        accent: "var(--color-rice)",
        features: ["1 pet, 100 seed words", "Mode 1 (free-roam pet)", "1 device", "Hang out on Discord"],
        badge: null,
      },
      {
        name: "Pro · Annual",
        price: "990.000đ",
        priceNote: "~$39 · 12 months",
        cta: "Go Pro",
        href: "/checkout?plan=pro_annual",
        accent: "var(--color-lcd)",
        features: ["Everything in Free", "Mode 2: spaced ambush", "Unlimited CSV imports", "3 devices", "Unlock pet skins", "Streak calendar"],
        badge: "MOST PICKED",
      },
      {
        name: "Lifetime",
        price: "1.990.000đ",
        priceNote: "~$79 · pay once, keep forever",
        cta: "Lock it in",
        href: "/checkout?plan=lifetime",
        accent: "var(--color-pop)",
        features: ["Everything in Pro", "Never expires, like ever", "Future pet skins free", "Early beta access", "DM the maker directly"],
        badge: "500 SEATS ONLY",
      },
    ],
    student: "Student with a .edu.vn email? 490.000đ/yr — cheaper than monthly bubble tea →",
  },
};

export function PricingTeaser({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section id="pricing" className="relative px-6 py-24 md:py-36">
      {/* big background type */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-10 select-none text-center font-display text-[28vw] italic leading-none tracking-[-0.04em] text-[var(--color-ink)]/[0.045] md:top-0"
      >
        pricing
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-col items-start gap-4">
          <div className="font-pixel text-[11px] uppercase tracking-[0.3em] text-[var(--color-pop)]">
            ▸ {t.eyebrow}
          </div>
          <h2 className="font-display text-[44px] leading-[0.95] tracking-[-0.02em] md:text-[72px]">
            <span className="italic">{t.title.split(".")[0]}.</span>{" "}
            {t.title.split(".").slice(1).join(".").trim()}
          </h2>
          <p className="max-w-[540px] text-[16px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[18px]">
            {t.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {t.plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-6 z-10 rounded-full border-[2px] border-[var(--color-ink)] px-3 py-1 font-pixel text-[10px] uppercase tracking-widest text-[var(--color-ink)]"
                  style={{ background: plan.accent }}
                >
                  {plan.badge}
                </div>
              )}
              <div
                className={`relative h-full rounded-3xl border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] p-7 transition-transform hover:-translate-y-1 ${
                  idx === 1
                    ? "shadow-[8px_8px_0_var(--color-lcd)]"
                    : "shadow-[5px_5px_0_var(--color-ink)]"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-[26px] tracking-[-0.01em]">
                    {plan.name}
                  </h3>
                  <span
                    className="h-3 w-3 rounded-full border border-[var(--color-ink)]"
                    style={{ background: plan.accent }}
                  />
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-[42px] leading-none tracking-[-0.02em]">
                    {plan.price}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[12px] uppercase tracking-wider text-[var(--color-ink)]/55">
                  {plan.priceNote}
                </div>

                <ul className="mt-7 space-y-3 border-t-[1.5px] border-dashed border-[var(--color-ink)]/30 pt-6 text-[14.5px] leading-[1.4]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-1.5 inline-block h-2 w-2 rounded-sm bg-[var(--color-ink)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border-[2px] border-[var(--color-ink)] px-5 py-3 font-pixel text-[11px] uppercase tracking-widest transition-transform hover:-translate-y-[2px] ${
                    idx === 1
                      ? "bg-[var(--color-ink)] text-[var(--color-cream)] shadow-[3px_3px_0_var(--color-lcd)] hover:shadow-[5px_5px_0_var(--color-lcd)]"
                      : "bg-[var(--color-cream)] shadow-[3px_3px_0_var(--color-ink)] hover:shadow-[5px_5px_0_var(--color-ink)]"
                  }`}
                >
                  {plan.cta} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t-[1.5px] border-dashed border-[var(--color-ink)]/30 pt-6">
          <Link href="/pricing" className="font-display text-[18px] italic underline decoration-[var(--color-pop)] decoration-[3px] underline-offset-4">
            {t.student}
          </Link>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink)]/55">
            <span>VietQR</span>·<span>Vietcombank</span>·<span>Techcombank</span>·<span>MB</span>·<span>ACB</span>
          </div>
        </div>
      </div>
    </section>
  );
}
