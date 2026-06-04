"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Vì sao Vô chi tồn tại",
    lines: [
      ["25 năm trước,", "một con Tamagotchi", "treo trên móc khoá."],
      ["Nó chết hai lần.", "Tới giờ", "mình vẫn nhớ tên nó."],
      ["Vô chi đảo ngược", "câu chuyện đó.", ""],
      ["Bạn không cho pet ăn", "bằng việc bấm nút.", "Bạn cho nó ăn bằng từ vựng."],
      ["Mỗi từ bạn nhớ,", "một giọt mana", "rơi vào pet."],
      ["Pet lớn cùng nhịp", "với não bạn.", "Đủ."],
    ],
    caption: "Lấy cảm hứng từ Tamagotchi, 1996. Cảm ơn Bandai.",
  },
  en: {
    eyebrow: "Why Vô chi exists",
    lines: [
      ["Twenty-five years ago,", "a Tamagotchi", "hung on a keychain."],
      ["It died twice.", "I still remember", "its name."],
      ["Vô chi inverts", "that story.", ""],
      ["You do not feed the creature", "by tapping a button.", "You feed it with vocabulary."],
      ["Every word you remember,", "a drop of mana", "falls into the creature."],
      ["The creature grows", "at the pace of", "your mind."],
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
