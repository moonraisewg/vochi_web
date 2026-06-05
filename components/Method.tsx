"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Phương pháp Vô chi",
    title: "Vì sao thú nhỏ",
    titleItalic: "giúp bạn nhớ lâu hơn.",
    proofTitle: "Được xây dựng dựa trên ghi nhớ ngắt quãng.",
    proofBullets: [
      "Nhắc lại đúng lúc trước khi quên.",
      "Lịch ôn theo trí nhớ của riêng bạn, không theo công thức chung.",
      "Học ít nhưng đều đặn.",
    ],
    pillars: [
      {
        no: "01",
        name: "Không cần học thật nhiều.",
        desc: "Mỗi ngày chỉ vài từ cũng đủ tạo nên khác biệt. Thay vì bắt bạn hoàn thành những bài học dài, thú nhỏ chỉ nhắc bạn quay lại một chút mỗi ngày. Việc học trở nên nhẹ nhàng hơn, và việc ghi nhớ cũng vậy.",
      },
      {
        no: "02",
        name: "Học khi bạn có thời gian.",
        desc: "Trong lúc chờ cà phê, đi thang máy hay nghỉ giữa hai công việc. Thú nhỏ luôn ở đó để bạn gặp lại một từ, học thêm một chút và tiếp tục ngày của mình. Không cần sắp xếp một khoảng thời gian riêng để học.",
      },
      {
        no: "03",
        name: "Mỗi từ đều có một người bạn.",
        desc: "Từ vựng không còn là những tấm thẻ khô khan. Mỗi từ bạn học đều góp phần giúp thú nhỏ lớn lên, khám phá thế giới mới và mở khoá những điều thú vị. Khi việc học gắn với một hành trình đáng yêu, việc ghi nhớ trở nên tự nhiên hơn.",
      },
    ],
  },
  en: {
    eyebrow: "The Vô chi method",
    title: "Why a tiny creature",
    titleItalic: "helps you remember longer.",
    proofTitle: "Built on spaced repetition.",
    proofBullets: [
      "Reviews land just before you would forget.",
      "Schedule follows your memory, not a one-size formula.",
      "Small sessions, kept up over time.",
    ],
    pillars: [
      {
        no: "01",
        name: "You don't need to study a lot.",
        desc: "A few words a day is enough to make a difference. Instead of forcing you through long lessons, the creature simply asks you to come back a little each day. Learning becomes lighter, and so does remembering.",
      },
      {
        no: "02",
        name: "Learn when you have time.",
        desc: "While waiting for coffee, riding the elevator, or pausing between tasks. The creature is always there for you to meet a word again, learn a little more, and carry on with your day. No need to carve out a separate study slot.",
      },
      {
        no: "03",
        name: "Every word has a companion.",
        desc: "Vocabulary stops being dry flashcards. Every word you learn helps the creature grow, discover new worlds, and unlock delightful things. When learning is tied to a lovely journey, remembering becomes natural.",
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

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid grid-cols-1 gap-6 rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-7 md:mt-20 md:grid-cols-12 md:gap-10 md:p-10 lift"
        >
          <div className="md:col-span-4">
            <div className="micro mb-3 text-[var(--color-accent-deep)]">
              {lang === "vi" ? "Bằng chứng nhỏ" : "Quiet proof"}
            </div>
            <p className="font-display text-[20px] leading-[1.2] tracking-tight md:text-[22px]">
              {t.proofTitle}
            </p>
          </div>
          <ul className="md:col-span-8 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
            {t.proofBullets.map((b, i) => (
              <li
                key={i}
                className="flex flex-col gap-2 border-t border-[var(--color-hairline)] pt-4 md:border-t-0 md:border-l md:pl-6 md:pt-0"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14.5px] leading-[1.45] text-[var(--color-ink)]">
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
