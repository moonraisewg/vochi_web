"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Phương pháp Vô chi",
    title: "Học theo cách não muốn,",
    titleItalic: "không theo cách app muốn.",
    pillars: [
      {
        no: "01",
        name: "Học ít. Gặp thường.",
        desc: "Não nhớ từ tốt nhất khi gặp lại ngay trước lúc sắp quên. 5 từ mỗi ngày đánh bại 50 từ một lần một tháng. Thú nhỏ biết khi nào nên ghé.",
      },
      {
        no: "02",
        name: "Không streak. Không stress.",
        desc: "Quên hôm nay? Mai gặp lại. Thú nhỏ khum chết, streak khum gãy. Áp lực rời đi, não mở ra, từ vào nhẹ tênh.",
      },
      {
        no: "03",
        name: "Học trong kẽ rảnh.",
        desc: "Thú nhỏ sống trên màn hình mọi lúc. 30 giây giữa hai task, nó ghé chào, bạn nhâm nhi một từ, đi tiếp. 5 phút mỗi ngày, không cảm giác như đã học.",
      },
      {
        no: "04",
        name: "Nhớ qua thương.",
        desc: "Bạn còn nhớ con Tamagotchi hồi tiểu học vì bạn thương nó. Bạn sẽ nhớ ephemeral cũng vì lý do đó. Cảm xúc gắn từ, từ ở lại lâu.",
      },
    ],
  },
  en: {
    eyebrow: "The Vô chi method",
    title: "Learn how the brain wants,",
    titleItalic: "not how the app wants.",
    pillars: [
      {
        no: "01",
        name: "Small bites. Often.",
        desc: "The brain locks in a word best right before it forgets. Five words a day beats fifty words once a month. The creature knows when to nudge.",
      },
      {
        no: "02",
        name: "No streak. No stress.",
        desc: "Forgot today? It comes back tomorrow. The creature doesn't die, the streak doesn't snap. Pressure off, brain open, words land soft.",
      },
      {
        no: "03",
        name: "Learn in the gaps.",
        desc: "The creature lives on your screen all the time. Thirty seconds between tasks, it says hi, you nibble one word, you move on. Five minutes a day, never feels like study.",
      },
      {
        no: "04",
        name: "Remember through love.",
        desc: "You still remember your childhood Tamagotchi because you loved it. You'll remember ephemeral the same way. Emotion glues the word in.",
      },
    ],
  },
};

export function Method({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="micro mb-4">{t.eyebrow}</div>
            <h2 className="font-display text-[40px] leading-[1.02] tracking-tight md:text-[60px]">
              {t.title}{" "}
              <span className="italic text-[var(--color-ink-soft)]">{t.titleItalic}</span>
            </h2>
          </div>
        </div>

        <ol className="border-t border-[var(--color-hairline)]">
          {t.pillars.map((p, idx) => (
            <motion.li
              key={p.no}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-4 border-b border-[var(--color-hairline)] py-9 md:grid-cols-12 md:gap-10 md:py-11"
            >
              <div className="md:col-span-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                  {p.no}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-display text-[22px] leading-[1.15] tracking-tight md:text-[28px]">
                  {p.name}
                </h3>
              </div>
              <div className="md:col-span-6">
                <p className="text-[15.5px] leading-[1.6] text-[var(--color-ink-soft)] md:text-[16.5px]">
                  {p.desc}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
