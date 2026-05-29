"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    title: "Thú nhỏ vô tư.",
    titleItalic: "Bạn học chill chill.",
    items: [
      {
        no: "01",
        name: "Thú nhỏ sống chung màn hình",
        desc: "Một sinh vật bé tí trong veo, nổi trên mọi cửa sổ. Bạn xem phim, làm việc, scroll TikTok, nó vẫn ở góc đó, vô tư đi tới đi lui.",
      },
      {
        no: "02",
        name: "Nhâm nhi từ vựng, không cày",
        desc: "App tự biết từ nào bạn sắp quên rồi nhẹ nhàng nhắc trước. Khum spam mấy từ đã thuộc. Học vài từ rồi nghỉ, vài từ rồi nghỉ. Vô tư.",
      },
      {
        no: "03",
        name: "Hai mode chill, tuỳ tâm trạng",
        desc: "Mode 1: thú nhỏ đi lông bông, có từ tới hạn thì ghé chào bạn. Mode 2: thú nhỏ ngủ ngon, tới giờ mới thức dậy gọi bạn nhâm nhi vài từ.",
      },
      {
        no: "04",
        name: "100 từ free, bộ riêng của bạn",
        desc: "Mở app là có 100 từ chơi liền. Muốn ôn IELTS, lyric BTS, từ ngành dev, hay từ rảnh trên Twitter? Đẩy file của bạn vô, thú nhỏ học cùng.",
      },
      {
        no: "05",
        name: "Streak, level, exp, hết stress",
        desc: "Trả lời đúng, thú nhỏ vui, bạn lên cấp, mở thú mới. Không có vụ pet chết hay streak gãy ám ảnh. Hôm nay rảnh thì học, không rảnh thì thôi.",
      },
      {
        no: "06",
        name: "Offline. Data là của bạn.",
        desc: "Từ vựng nằm im trên máy bạn. Không upload, không AI scrape. Thú nhỏ là của bạn, không phải của Bezos.",
      },
    ],
  },
  en: {
    title: "Carefree creatures.",
    titleItalic: "You learn, chill.",
    items: [
      {
        no: "01",
        name: "Creature lives on your screen",
        desc: "A tiny see-through critter hovers over everything. Watching movies, working, scrolling TikTok, it stays in the corner, wandering carefree.",
      },
      {
        no: "02",
        name: "Nibble vocab, no grinding",
        desc: "App knows which word you're about to lose and gently surfaces it. Zero spam on words you nailed. A few words, a break, a few more. Carefree.",
      },
      {
        no: "03",
        name: "Two moods, your call",
        desc: "Mode 1: creature roams, says hi when a word is due. Mode 2: creature naps, wakes on schedule to nibble a few words with you.",
      },
      {
        no: "04",
        name: "100 free words, plus your own",
        desc: "Boot it up, 100 English words ready. Want IELTS, K-pop lyrics, dev jargon, random Twitter words? Drop your file, the creature joins in.",
      },
      {
        no: "05",
        name: "Streak, level, XP, zero stress",
        desc: "Right answer, creature smiles, you level up, unlock new creatures. No pet-death drama, no broken-streak guilt. Today's busy? Skip it. No one's mad.",
      },
      {
        no: "06",
        name: "Offline. Your data, period.",
        desc: "Words live on your machine. Nothing uploaded, no AI scraping. The creature is yours, not Bezos's.",
      },
    ],
  },
};

export function Features({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section id="features" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 max-w-[760px]">
          <h2 className="font-display text-[40px] leading-[1.02] tracking-tight md:text-[64px]">
            {t.title}{" "}
            <span className="italic text-[var(--color-ink-soft)]">{t.titleItalic}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-14 border-t border-[var(--color-hairline)] pt-14 md:grid-cols-3 md:gap-y-20">
          {t.items.map((item, idx) => (
            <motion.div
              key={item.no}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                {item.no}
              </div>
              <h3 className="mt-4 font-display text-[22px] leading-[1.15] tracking-tight md:text-[24px]">
                {item.name}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.55] text-[var(--color-ink-soft)]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
