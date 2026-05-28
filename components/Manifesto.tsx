"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Tuyên ngôn · ờm hong đùa",
    lines: [
      ["Học tiếng Anh", "khum nên giống", "đi làm part-time."],
      ["Phải giống nuôi", "một con thú nhỏ", "trẩu trẩu."],
      ["Bạn ghost nó?", "Nó đói.", ""],
      ["Bạn xuất hiện?", "Pet xỉu up xỉu down.", ""],
      ["Rồi bạn nhớ từ", "vì bạn lỡ", "thương con pet rồi."],
    ],
  },
  en: {
    eyebrow: "Manifesto (chill version)",
    lines: [
      ["Learning a language", "shouldn't feel like", "a second job."],
      ["It should feel like", "raising a tiny", "weird little guy."],
      ["You ghost it?", "It starves.", ""],
      ["You show up?", "It beams.", ""],
      ["You remember the words", "because you remember", "the little guy."],
    ],
  },
};

export function Manifesto({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] px-6 py-28 text-[var(--color-cream)] md:py-40">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-[1100px]">
        <div className="mb-12 flex items-center gap-3 font-pixel text-[11px] uppercase tracking-[0.3em] text-[var(--color-lcd)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-lcd)] shadow-[0_0_10px_var(--color-lcd)]" />
          ▸ {t.eyebrow}
        </div>

        <div className="space-y-4 font-display text-[40px] leading-[1.05] tracking-[-0.02em] md:text-[64px]">
          {t.lines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-baseline gap-x-4"
            >
              <span>{line[0]}</span>
              <span className="italic text-[var(--color-lcd)]">{line[1]}</span>
              <span>{line[2]}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest text-[var(--color-cream)]/50">
          <span className="h-px w-12 bg-[var(--color-cream)]/40" />
          {lang === "vi" ? "Đạo nhẹ ý tưởng từ Tamagotchi, 1996 (xin lỗi Bandai)" : "Stolen from Tamagotchi, 1996 (sorry Bandai)"}
        </div>
      </div>
    </section>
  );
}
