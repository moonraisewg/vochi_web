"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Một câu hỏi nhỏ",
    question: ["Có bao giờ ta quên", "những gì gắn bó nhất?"],
    whisper:
      "Có lẽ không. Có lẽ ta chỉ quên những điều mình chưa kịp gắn bó.",
    tail: "Để mỗi từ trở thành một điều ta gắn bó →",
  },
  en: {
    eyebrow: "A small question",
    question: ["Do we ever forget", "what we hold closest?"],
    whisper:
      "Perhaps not. Perhaps we only forget what we never quite held.",
    tail: "Let each word become something you hold →",
  },
};

export function Interlude({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="micro mb-10 text-[var(--color-ink-muted)] md:mb-0"
            >
              {t.eyebrow}
            </motion.div>
          </div>

          <div className="md:col-span-10">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic text-[36px] leading-[1.15] tracking-tight text-[var(--color-ink)] md:text-[68px] md:leading-[1.08]"
            >
              {t.question[0]}
              <br />
              <span className="text-[var(--color-ink-soft)]">{t.question[1]}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 max-w-[640px] text-[17px] leading-[1.6] text-[var(--color-ink-soft)] md:mt-14 md:text-[19px]"
            >
              {t.whisper}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-16 flex items-center gap-6 md:mt-24"
            >
              <span className="block h-px w-16 bg-[var(--color-hairline-strong)]" />
              <a
                href="#pricing"
                className="font-display text-[15px] italic tracking-tight text-[var(--color-accent-deep)] underline decoration-[var(--color-accent)]/40 decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)] md:text-[17px]"
              >
                {t.tail}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
