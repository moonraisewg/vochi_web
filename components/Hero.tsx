"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { PetDevice } from "./PetDevice";
import type { Lang } from "./Nav";
import {
  trackDownloadClick,
  useDownloadTarget,
  type DownloadPlatform,
} from "@/lib/useDownloadHref";

const HERO_COPY = {
  vi: {
    eyebrow: "Beta · macOS + Windows",
    titleA: "Học ngoại ngữ bằng cách",
    titleB: ["nuôi một thú nhỏ."],
    sub: "Mỗi từ bạn nhớ được sẽ nuôi lớn một sinh vật sống trên màn hình. Bạn học một chút. Nó lớn lên một chút.",
    ctaPrimary: {
      unknown: "Tải miễn phí cho Mac & Windows",
      mac: "Tải miễn phí cho macOS",
      windows: "Tải miễn phí cho Windows",
      ios: "Tải trên App Store",
      android: "Tải trên App Store",
    } satisfies Record<DownloadPlatform, string>,
    ctaSecondary: "Xem bảng giá",
    micro: "Không cần tài khoản. 28MB. Beta.",
  },
  en: {
    eyebrow: "Beta · macOS + Windows",
    titleA: "Learn a language by",
    titleB: ["raising a tiny creature."],
    sub: "Every word you remember feeds a small creature living on your screen. You learn a little. It grows a little.",
    ctaPrimary: {
      unknown: "Download free for Mac & Windows",
      mac: "Download free for macOS",
      windows: "Download free for Windows",
      ios: "Get it on the App Store",
      android: "Get it on the App Store",
    } satisfies Record<DownloadPlatform, string>,
    ctaSecondary: "See pricing",
    micro: "No account required. 28MB. Beta.",
  },
};

export function Hero({ lang }: { lang: Lang }) {
  const t = HERO_COPY[lang];
  const download = useDownloadTarget();

  return (
    <section id="top" className="relative pb-16 pt-10 md:pb-20 md:pt-14">
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

          <h1 className="mt-7 font-display text-[40px] leading-[1.05] tracking-tight text-balance md:text-[72px] md:leading-[1.02]">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {t.titleA}
            </motion.span>
            {t.titleB.map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.08 + i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block italic text-[var(--color-ink-soft)]"
              >
                {line}
              </motion.span>
            ))}
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
              href={download.href}
              onClick={() => trackDownloadClick(download, "hero")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-[14px] font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-accent-deep)] sm:w-auto sm:justify-start"
            >
              {t.ctaPrimary[download.platform]}
              <span aria-hidden className="text-[16px] leading-none">↓</span>
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-ink)] underline decoration-[var(--color-hairline-strong)] decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)]"
            >
              {t.ctaSecondary}
              <span aria-hidden>→</span>
            </a>
          </motion.div>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            {t.micro}
          </p>
        </div>

        {/* right column: pet device */}
        <div className="md:col-span-5">
          <div className="float-y">
            <PetDevice lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}
