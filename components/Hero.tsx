"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { PetDevice } from "./PetDevice";
import type { Lang } from "./Nav";

const HERO_COPY = {
  vi: {
    badge: "MỚI TOANH · BETA · MAC + WIN · vô nhanh không hết slot nha trùm",
    titleA: "Cày từ vựng đi.",
    titleB: "Pet em đang",
    titleC: "ét o ét.",
    sub: "Pet ảo squat trên màn hình bạn 24/7. Bạn lười là pet đói. Pet đói là pet réo. App lén dạy bạn từ vựng dưới lớp vỏ Tamagotchi 90s. Học mà tưởng đang chill, ơ kìa.",
    ctaPrimary: "Cứu pet (free)",
    ctaSecondary: "Giá nhiêu trùm",
    micro: "Khum cần thẻ. Nhẹ tênh. macOS 12+ / Win 10+. Pet sẽ thương bạn nếu bạn về sớm.",
    pillA: "Ôn đúng lúc cần ôn",
    pillB: "Pet biết ngủ giờ giấc",
    pillC: "Đè được fullscreen luôn",
  },
  en: {
    badge: "JUST DROPPED · BETA · MAC + WIN · slots filling up fast",
    titleA: "Grind vocab.",
    titleB: "Pet is",
    titleC: "weeping rn.",
    sub: "Little creature squats on your screen 24/7. You slack, it starves. It starves, it whines. App sneakily drilling vocab into your head under a 90s Tamagotchi skin. You're studying. You think you're chilling. Plot twist.",
    ctaPrimary: "Save the pet (free)",
    ctaSecondary: "How much tho",
    micro: "No card. Featherlight. macOS 12+ / Win 10+. Pet will love you if you come back early.",
    pillA: "Reviews at the right time",
    pillB: "Pet sleeps on a schedule",
    pillC: "Climbs over fullscreen apps",
  },
};

export function Hero({ lang }: { lang: Lang }) {
  const t = HERO_COPY[lang];

  return (
    <section className="relative overflow-hidden pb-20 pt-10 md:pb-32 md:pt-14">
      {/* graph paper bg */}
      <div className="absolute inset-0 graph-paper opacity-50" />
      {/* corner decorations */}
      <Corners />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:gap-6">
        {/* LEFT — copy */}
        <div className="md:col-span-7">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-pop)] px-3 py-1.5 font-pixel text-[10px] uppercase tracking-widest text-[var(--color-cream)] shadow-[3px_3px_0_var(--color-ink)]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-lcd)] blink" />
            {t.badge}
          </motion.div>

          <h1 className="mt-7 font-display text-[12vw] leading-[0.92] tracking-[-0.02em] md:text-[88px]">
            <motion.span
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {t.titleA}
            </motion.span>
            <motion.span
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block italic"
            >
              {t.titleB}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{t.titleC}</span>
                <svg
                  viewBox="0 0 320 24"
                  className="absolute -bottom-1 left-0 z-0 w-full"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 18 Q 80 4, 160 14 T 318 10"
                    stroke="var(--color-pop)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-7 max-w-[560px] text-pretty text-[17px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[19px]"
          >
            {t.sub}
          </motion.p>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/download"
              className="group inline-flex items-center gap-3 rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-3.5 font-body text-[15px] font-medium text-[var(--color-cream)] shadow-[5px_5px_0_var(--color-pop)] transition-transform hover:-translate-y-[2px] hover:shadow-[7px_7px_0_var(--color-pop)]"
            >
              <span className="font-pixel text-[12px] uppercase tracking-widest">
                ▼ {t.ctaPrimary}
              </span>
              <span className="inline-flex h-6 items-center rounded-full bg-[var(--color-cream)] px-2 font-pixel text-[9px] uppercase tracking-widest text-[var(--color-ink)]">
                .dmg · .msi
              </span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] px-5 py-3.5 font-body text-[15px] font-medium text-[var(--color-ink)] shadow-[3px_3px_0_var(--color-ink)] transition-transform hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--color-ink)]"
            >
              {t.ctaSecondary}
              <span aria-hidden>→</span>
            </Link>
          </motion.div>

          <p className="mt-4 font-mono text-[12px] uppercase tracking-wider text-[var(--color-ink)]/55">
            {t.micro}
          </p>

          {/* pill row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {[t.pillA, t.pillB, t.pillC].map((p, i) => (
              <span
                key={p}
                className="inline-flex items-center gap-2 rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)]/80"
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background:
                      i === 0
                        ? "var(--color-lcd)"
                        : i === 1
                          ? "var(--color-pop)"
                          : "var(--color-stamp)",
                  }}
                />
                {p}
              </span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — pet device */}
        <div className="md:col-span-5">
          <div className="relative">
            <PetDevice />
            {/* annotation labels */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -left-2 top-32 hidden md:block"
            >
              <div className="font-display italic text-[15px] text-[var(--color-ink)]/70">
                ← {lang === "vi" ? "thanh sắp xỉu" : "starving meter"}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute -right-2 bottom-44 hidden text-right md:block"
            >
              <div className="font-display italic text-[15px] text-[var(--color-ink)]/70">
                {lang === "vi" ? "bấm B mớm cho pet" : "smash B to feed"} →
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* marquee strip */}
      <div className="relative mt-20 overflow-hidden border-y-[2px] border-[var(--color-ink)] bg-[var(--color-ink)] py-3">
        <div className="marquee flex shrink-0 gap-12 whitespace-nowrap font-pixel text-[14px] uppercase tracking-widest text-[var(--color-cream)]">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            [
              "ephemeral · phù du",
              "★",
              "serendipity · duyên may",
              "★",
              "nostalgia · hoài niệm",
              "★",
              "petrichor · mùi đất sau mưa",
              "★",
              "wanderlust · khao khát đi xa",
              "★",
              "linger · nán lại",
              "★",
              "resilient · kiên cường",
              "★",
            ].map((w, i) => (
              <span key={`${k}-${i}`}>{w}</span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}

function Corners() {
  return (
    <>
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink)]/45 md:left-10 md:top-10">
        N° 001 / vocabagotchi.app
      </div>
      <div className="pointer-events-none absolute right-6 top-6 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink)]/45 md:right-10 md:top-10">
        EST. 2026 · HANOI
      </div>
      <div className="pointer-events-none absolute left-6 hidden -translate-y-1/2 rotate-[-90deg] font-pixel text-[10px] uppercase tracking-widest text-[var(--color-ink)]/40 md:block md:left-3 md:top-1/2">
        ↓ kéo xuống coi tiếp
      </div>
    </>
  );
}
