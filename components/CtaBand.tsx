"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Lang } from "./Nav";

type Variant = "soft" | "convert";

const COPY: Record<Lang, Record<Variant, { title: string; sub: string; primary: string; secondary: string }>> = {
  vi: {
    soft: {
      title: "Sẵn sàng để gặp thú nhỏ?",
      sub: "Tải về và chơi thử miễn phí. Không cần tài khoản, không cần thẻ.",
      primary: "Tải miễn phí",
      secondary: "Xem bảng giá",
    },
    convert: {
      title: "Thấy hợp lý? Chọn gói phù hợp với bạn.",
      sub: "Bằng 1 ly cà phê sữa, bạn có thể nuôi một thú nhỏ và học hàng nghìn từ.",
      primary: "Xem bảng giá",
      secondary: "Tải free, dùng thử trước",
    },
  },
  en: {
    soft: {
      title: "Ready to meet your creature?",
      sub: "Download and try it free. No account, no card.",
      primary: "Download free",
      secondary: "See pricing",
    },
    convert: {
      title: "Sold? Pick the plan that fits.",
      sub: "For the price of a coffee, raise a tiny creature and learn thousands of words.",
      primary: "See pricing",
      secondary: "Try free first",
    },
  },
};

export function CtaBand({ lang, variant }: { lang: Lang; variant: Variant }) {
  const t = COPY[lang][variant];
  const primaryHref = variant === "convert" ? "#pricing" : "/download";
  const secondaryHref = variant === "convert" ? "/download" : "#pricing";

  return (
    <section className="relative px-6 py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 rounded-3xl border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-7 md:flex-row md:items-center md:gap-10 md:p-10 lift-md"
      >
        <div className="max-w-[560px]">
          <h3 className="font-display text-[24px] leading-[1.15] tracking-tight md:text-[32px]">
            {t.title}
          </h3>
          <p className="mt-2 text-[14.5px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[15.5px]">
            {t.sub}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-[14px] font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-accent-deep)]"
          >
            {t.primary}
            <span aria-hidden className="text-[15px] leading-none">
              {variant === "convert" ? "→" : "↓"}
            </span>
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-ink)] underline decoration-[var(--color-hairline-strong)] decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)]"
          >
            {t.secondary}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
