"use client";

import { motion } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    title: "Những điều nhỏ bé",
    titleItalic: "cùng nhau lớn lên.",
    items: [
      {
        no: "01",
        name: "Sống cùng bạn trên màn hình",
        desc: "Một sinh vật nhỏ lặng lẽ sống ở góc màn hình. Khi bạn làm việc, xem phim hay chỉ đang nghỉ ngơi, nó vẫn ở đó: đi dạo, ngủ gật và chờ lần gặp tiếp theo.",
      },
      {
        no: "02",
        name: "Nhắc bạn ngay trước khi quên",
        desc: "Không cần ép mình học mỗi ngày. Vô chi ghi nhớ những từ bạn đã học và chỉ xuất hiện khi đã đến lúc cần nhớ lại.",
      },
      {
        no: "03",
        name: "Học theo nhịp của riêng bạn",
        desc: "Có ngày bạn muốn được nhắc bất chợt. Có ngày bạn chỉ muốn yên tĩnh. Thú nhỏ có thể đi cùng bạn cả ngày, hoặc chỉ ghé thăm vào những khung giờ bạn chọn.",
      },
      {
        no: "04",
        name: "Bắt đầu ngay, hoặc mang theo thế giới của riêng mình",
        desc: "Hơn 5.300 từ vựng được chuẩn bị sẵn theo cấp độ, mở khoá trọn bộ ở các gói trả phí. Hoặc bạn có thể mang theo danh sách của riêng mình: IELTS, TOEIC, công việc hay bất kỳ điều gì bạn đang theo đuổi.",
      },
      {
        no: "05",
        name: "Mỗi từ là một chút lớn lên",
        desc: "Ở Vô chi, từ vựng không biến thành điểm số. Mỗi từ bạn nhớ được trở thành linh khí nuôi dưỡng sinh vật nhỏ ấy. Bạn học một chút. Nó lớn lên một chút. Rồi một ngày nhìn lại, bạn có thêm một vốn từ. Và nó có thêm cả một cuộc đời.",
      },
      {
        no: "06",
        name: "Riêng tư, ngay cả khi không có mạng",
        desc: "Mọi dữ liệu đều nằm trên máy của bạn. Không đồng bộ lên máy chủ. Không thu thập dữ liệu học tập. Không dùng để huấn luyện AI. Chỉ có bạn, thú nhỏ, và hành trình của riêng mình.",
      },
    ],
  },
  en: {
    title: "Small things",
    titleItalic: "grow together.",
    items: [
      {
        no: "01",
        name: "Lives with you on your screen",
        desc: "A small creature lives quietly in the corner of your screen. When you work, watch a movie, or simply rest, it stays there: wandering, dozing, waiting for the next time you meet.",
      },
      {
        no: "02",
        name: "Reminds you right before you forget",
        desc: "No need to force yourself to study every day. Vô chi remembers the words you have learned and only shows up when it is time to recall them.",
      },
      {
        no: "03",
        name: "At your own rhythm",
        desc: "Some days you want little nudges throughout the day. Other days you want quiet. The creature can stay with you all day, or only visit during the hours you choose.",
      },
      {
        no: "04",
        name: "Start now, or bring your own world",
        desc: "Over 5,300 words are prepared by level, fully unlocked on paid plans. Or you can bring your own list: IELTS, TOEIC, work, or anything you are pursuing.",
      },
      {
        no: "05",
        name: "Every word is a little growth",
        desc: "In Vô chi, vocabulary does not turn into a score. Every word you remember becomes mana that nourishes the small creature. You learn a little. It grows a little. Then one day you look back: you have a richer vocabulary, and it has a whole life.",
      },
      {
        no: "06",
        name: "Private, even without internet",
        desc: "Everything stays on your device. Nothing synced to servers. No learning data collected. Not used to train AI. Just you, the creature, and your own journey.",
      },
    ],
  },
};

export function Features({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section id="features" className="relative px-6 py-16 md:py-24">
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
