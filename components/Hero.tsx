"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { PetDevice } from "./PetDevice";
import type { Lang } from "./Nav";

const HERO_COPY = {
  vi: {
    eyebrow: "Beta · macOS + Windows",
    titleA: "Học ngoại ngữ, nuôi từng thú nhỏ,",
    titleB: "cùng vô chill trong thế giới mới bao la.",
    sub: "Những điều lớn lao được nuôi bằng những điều nhỏ bé. Hãy để những thú cưng nhỏ bé lớn lên cùng thế giới ngoại ngữ của bạn.",
    ctaPrimary: "Nuôi thú nhỏ ngay",
    ctaSecondary: "Xem cách hoạt động",
    micro: "Miễn phí. Không cần tài khoản. 28MB.",
  },
  en: {
    eyebrow: "Beta · macOS + Windows",
    titleA: "Learn languages, raise tiny creatures,",
    titleB: "drift carefree through a vast new world.",
    sub: "Great things are grown from small ones. Let tiny creatures grow alongside the new world of language you are learning.",
    ctaPrimary: "Adopt one now",
    ctaSecondary: "See how it works",
    micro: "Free. No account required. 28MB.",
  },
};

export function Hero({ lang }: { lang: Lang }) {
  const t = HERO_COPY[lang];

  return (
    <section className="relative pb-24 pt-16 md:pb-32 md:pt-20">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-12 md:gap-10">
        {/* left column: copy */}
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-3 py-1.5"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
              {t.eyebrow}
            </span>
          </motion.div>

          <h1 className="mt-7 font-display text-[44px] leading-[1.02] tracking-tight text-balance md:text-[72px]">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {t.titleA}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-[var(--color-ink-soft)]"
            >
              {t.titleB}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-7 max-w-[520px] text-pretty text-[17px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[18px]"
          >
            {t.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/download"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-[14px] font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-accent-deep)]"
            >
              {t.ctaPrimary}
              <span aria-hidden className="text-[16px] leading-none">↓</span>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-ink)] underline decoration-[var(--color-hairline-strong)] decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)]"
            >
              {t.ctaSecondary}
            </a>
          </motion.div>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            {t.micro}
          </p>
        </div>

        {/* right column: pet device */}
        <div className="md:col-span-5">
          <div className="float-y">
            <PetDevice />
          </div>
        </div>
      </div>
    </section>
  );
}
