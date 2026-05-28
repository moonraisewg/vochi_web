"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Hoạt động sao trùm",
    title: "Pet đói. Bạn cày.",
    titleItalic: "Lặp lại tới khi mlem.",
    items: [
      {
        no: "01",
        name: "Pet em squat màn hình 24/7",
        desc: "Pet trong veo, nổi trên mọi thứ. Bạn mở fullscreen xem phim hay tắt mọi cửa sổ? Pet vẫn đó. Bạn xem TikTok? Pet judgmental nhìn bạn từ góc màn hình.",
        tag: "Pet siêu mỏng",
      },
      {
        no: "02",
        name: "Ôn đúng từ đúng lúc",
        desc: "App tự biết từ nào bạn sắp quên, đẩy nó lên ôn trước. Khum spam mấy từ bạn đã thuộc. Khum đoán đại như app đời tống.",
        tag: "Lịch thông minh",
      },
      {
        no: "03",
        name: "Hai mode pet, tuỳ độ rảnh",
        desc: "Mode 1 — pet đi lông bông, có từ tới hạn thì réo bạn nhẹ nhàng. Mode 2 — pet ngủ ngon, tới giờ là thức dậy ụp câu hỏi vô mặt. Chill hay căng, bạn chọn.",
        tag: "2 mode",
      },
      {
        no: "04",
        name: "100 từ free + bộ riêng của bạn",
        desc: "Mở app phát có 100 từ chơi liền. Muốn cày IELTS, lyric BTS, từ chuyên ngành dev, hay từ rảnh trên Twitter? Đẩy file của bạn vô, pet xử hết.",
        tag: "Tự thêm từ",
      },
      {
        no: "05",
        name: "Streak, level, EXP — chuẩn farmer",
        desc: "Trả lời đúng → pet ăn no → bạn lên cấp → mở pet mới. Não bạn tưởng đang farm boss trong game. Plot twist: bạn vừa biết thêm 50 từ.",
        tag: "Gây nghiện hợp pháp",
      },
      {
        no: "06",
        name: "Offline. Data của bạn, hết chuyện.",
        desc: "Từ vựng + tiến độ học nằm im trên máy bạn. Không upload đâu hết. Không AI nào scrape. Pet là của bạn, không phải của Bezos.",
        tag: "Riêng tư xịn",
      },
    ],
  },
  en: {
    eyebrow: "How it works",
    title: "Pet whines. You grind.",
    titleItalic: "On repeat.",
    items: [
      {
        no: "01",
        name: "Pet lives rent-free on your screen",
        desc: "Transparent, hovers over everything. Fullscreen Netflix? Zen-mode editor? Pet hops over them. You doomscroll, pet judges you from the corner.",
        tag: "Super light",
      },
      {
        no: "02",
        name: "Reviews when you'd actually forget",
        desc: "App knows which words you're about to lose and schedules them first. Doesn't spam words you already nailed. Zero guesswork.",
        tag: "Smart timing",
      },
      {
        no: "03",
        name: "Two moods, pick your fighter",
        desc: "Mode 1: pet roams, taps you when a word is due. Mode 2: pet naps, wakes up to ambush you on schedule. Chill or boss, you choose.",
        tag: "2 modes",
      },
      {
        no: "04",
        name: "100 starter words + your own set",
        desc: "Boot up: 100 English words ready. Want IELTS? K-pop lyrics? Dev jargon? Random Twitter words? Drop your file, pet handles it.",
        tag: "Bring-your-own",
      },
      {
        no: "05",
        name: "Streak, level, EXP — actually fun",
        desc: "Correct answer → pet eats → you level up → unlock new pets. Your game-brain thinks it's farming. It's studying.",
        tag: "Addictive",
      },
      {
        no: "06",
        name: "Offline. Your data, period.",
        desc: "Words + progress sit on your machine. Nothing uploaded. No AI scraping. The pet is yours, not Bezos's.",
        tag: "Private",
      },
    ],
  },
};

export function Features({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section id="features" className="relative px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-pixel text-[11px] uppercase tracking-[0.3em] text-[var(--color-pop)]">
              ▸ {t.eyebrow}
            </div>
            <h2 className="mt-3 font-display text-[44px] leading-[0.95] tracking-[-0.02em] md:text-[72px]">
              {t.title} <span className="italic">{t.titleItalic}</span>
            </h2>
          </div>
          <div className="hidden font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink)]/50 md:block">
            §02 — 6 lý do bạn sẽ rén luôn
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border-[2px] border-[var(--color-ink)] bg-[var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] md:grid-cols-3">
          {t.items.map((item, idx) => (
            <motion.div
              key={item.no}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-[var(--color-cream)] p-7 transition-colors hover:bg-[var(--color-paper-dark)]"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-[44px] italic leading-none text-[var(--color-ink)]/15">
                  {item.no}
                </span>
                <span className="rounded-full border-[1.5px] border-[var(--color-ink)] px-2 py-0.5 font-pixel text-[9px] uppercase tracking-widest">
                  {item.tag}
                </span>
              </div>
              <h3 className="mt-6 font-display text-[24px] leading-[1.1] tracking-[-0.01em]">
                {item.name}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.55] text-[var(--color-ink-soft)]">
                {item.desc}
              </p>
              <div className="mt-6 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
                <span className="h-px w-6 bg-[var(--color-ink)]" />
                read more
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
