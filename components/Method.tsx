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
        name: "Học ít, gặp thường.",
        desc: "Não ghi nhớ từ tốt nhất khi gặp lại ngay trước lúc sắp quên. 5 từ mỗi ngày hiệu quả hơn 50 từ một lần một tháng. Thú nhỏ chọn đúng thời điểm để nhắc bạn.",
      },
      {
        no: "02",
        name: "Học trong khoảng nghỉ.",
        desc: "Thú nhỏ luôn hiện trên màn hình. Ba mươi giây giữa hai công việc đã đủ ôn một từ. Năm phút mỗi ngày cộng dồn, không cần ngồi xuống học chính thức.",
      },
      {
        no: "03",
        name: "Nhớ qua cảm xúc.",
        desc: "Bạn vẫn nhớ con Tamagotchi từng nuôi vì gắn bó cảm xúc. Vô chi áp dụng nguyên tắc đó: cảm xúc gắn với từ, từ ở lại trong trí nhớ lâu hơn.",
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
        name: "Small bites, frequent visits.",
        desc: "The brain retains a word best when reviewed just before forgetting. Five words a day outperforms fifty words once a month. The creature picks the right moment.",
      },
      {
        no: "02",
        name: "Learn in the gaps.",
        desc: "The creature is always present on your screen. Thirty seconds between tasks is enough to review a word. Five minutes a day adds up without a formal study session.",
      },
      {
        no: "03",
        name: "Remember through emotion.",
        desc: "You still recall the Tamagotchi you raised as a child because of the bond you formed. Vô chi applies the same principle: emotion anchors vocabulary in long-term memory.",
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
