"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Vì sao Vô chi tồn tại",
    lines: [
      ["25 năm trước,", "một con Tamagotchi", "treo trên móc khoá."],
      ["Nó chết hai lần.", "Tới giờ", "mình vẫn nhớ tên nó."],
      ["Các app học từ vựng", "không muốn bạn", "yêu từ."],
      ["Chúng muốn", "bạn sợ", "mất streak."],
      ["Vô chi là phản đề.", "Một thú nhỏ vô tư,", "sống cùng bạn. Đủ."],
    ],
    caption: "Lấy cảm hứng từ Tamagotchi, 1996. Cảm ơn Bandai.",
  },
  en: {
    eyebrow: "Why Vô chi exists",
    lines: [
      ["Twenty-five years ago,", "a Tamagotchi", "hung on a keychain."],
      ["It died twice.", "I still remember", "its name."],
      ["Vocab apps don't want", "you to love", "the words."],
      ["They want", "you afraid.", "Afraid to break a streak."],
      ["Vô chi flips that.", "One small carefree creature,", "living with you. Enough."],
    ],
    caption: "Borrowed from Tamagotchi, 1996. Thank you, Bandai.",
  },
};

export function Manifesto({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="relative bg-[var(--color-tint)] px-6 py-32 md:py-44">
      <div className="mx-auto max-w-[1000px]">
        <div className="micro mb-10 text-[var(--color-ink-soft)]">{t.eyebrow}</div>
        <div className="space-y-3 font-display text-[36px] leading-[1.1] tracking-tight md:text-[52px]">
          {t.lines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-baseline gap-x-3"
            >
              <span>{line[0]}</span>
              <span className="italic text-[var(--color-ink-soft)]">{line[1]}</span>
              <span>{line[2]}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]"
        >
          <span className="h-px w-10 bg-[var(--color-hairline-strong)]" />
          {t.caption}
        </motion.div>
      </div>
    </section>
  );
}
