"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    title: "Thú nhỏ vô tư.",
    titleItalic: "Bạn học nhẹ nhàng.",
    items: [
      {
        no: "01",
        name: "Sống cùng bạn trên màn hình",
        desc: "Một sinh vật nhỏ trong suốt, hiện trên mọi cửa sổ. Bạn xem phim, làm việc hay nghỉ ngơi, nó vẫn yên lặng đi quanh ở góc màn hình.",
      },
      {
        no: "02",
        name: "Ôn đúng từ, đúng lúc",
        desc: "Thuật toán nhận biết từ nào bạn sắp quên và nhắc trước. Không lặp lại các từ đã thuộc. Học từng đợt nhỏ, theo nhịp bạn tự đặt.",
      },
      {
        no: "03",
        name: "Hai chế độ học, tuỳ tâm trạng",
        desc: "Chế độ 1: thú nhỏ đi tự do và ghé chào khi có từ đến hạn. Chế độ 2: thú nhỏ chỉ thức dậy theo lịch để hỏi bạn vài từ.",
      },
      {
        no: "04",
        name: "5.300 từ sẵn, hoặc bộ riêng của bạn",
        desc: "Khởi động là có gần 5.300 từ chia theo cấp độ. Bạn có thể nhập thêm danh sách cho IELTS, TOEIC hay từ chuyên ngành.",
      },
      {
        no: "05",
        name: "Từ vựng là linh khí, không chỉ là streak",
        desc: "Trả lời đúng tạo ra linh khí. Linh khí nuôi pet, pet lên cấp và mở khoá hình hài mới. Bạn không học và nuôi pet riêng. Bạn học chính là bạn nuôi pet.",
      },
      {
        no: "06",
        name: "Offline. Dữ liệu là của bạn.",
        desc: "Từ vựng lưu trên máy của bạn. Không upload, không thu thập, không dùng để huấn luyện AI.",
      },
    ],
  },
  en: {
    title: "Carefree creatures.",
    titleItalic: "Gentle learning.",
    items: [
      {
        no: "01",
        name: "Lives quietly on your screen",
        desc: "A small translucent companion that floats above every window. While you work, watch, or rest, it wanders calmly in the corner.",
      },
      {
        no: "02",
        name: "Reviews the right word at the right time",
        desc: "An adaptive algorithm surfaces words just before you forget them, and skips the ones you already know. Learn in small, paced sessions.",
      },
      {
        no: "03",
        name: "Two learning modes",
        desc: "Mode 1: the creature roams freely and stops by when a word is due. Mode 2: it stays asleep and only wakes up on a schedule you set.",
      },
      {
        no: "04",
        name: "5,300 starter words, or bring your own",
        desc: "Boot up with nearly 5,300 words sorted by level. Import your own list for IELTS, TOEIC, or any specialized vocabulary.",
      },
      {
        no: "05",
        name: "Vocabulary is mana, not just a streak",
        desc: "Every correct answer mints mana. Mana feeds the creature, levels it up, and unlocks new forms. Learning and raising the creature are not two activities. They are the same activity.",
      },
      {
        no: "06",
        name: "Offline. Your data stays yours.",
        desc: "Words and progress live on your device. Nothing uploaded, nothing scraped, nothing used to train AI.",
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
            {t.title}
            <br />
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
