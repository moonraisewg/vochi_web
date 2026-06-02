"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    title: "Hỏi gì cũng được.",
    contact: "Không thấy câu của bạn? Mail mình nha.",
    items: [
      {
        q: "Có chạy trên Windows không?",
        a: "Có. macOS 12 trở lên và Windows 10 trở lên đều chạy mượt. Linux đang trong nồi, build chạy được nhưng overlay chưa hoàn thiện.",
      },
      {
        q: "Sepay là gì, có an toàn không?",
        a: "Sepay là cổng VietQR. Bạn mở app ngân hàng, quét mã, chuyển khoản như bình thường. Không nhập số thẻ ở đâu cả. Sau khi ngân hàng xác nhận (khoảng 30 giây đến 2 phút), license sẽ gửi vào email.",
      },
      {
        q: "Thú nhỏ có thật sự đè được fullscreen Chrome?",
        a: "Có. Mở Chrome fullscreen, xem Netflix toàn màn hình, Zoom họp full, thú nhỏ vẫn vô tư đi loanh quanh trên đó. Tụi mình tốn khá nhiều đêm để xử vụ này.",
      },
      {
        q: "Dữ liệu của tôi có bị upload?",
        a: "Không. Từ vựng và tiến độ học nằm im trên máy. Chỉ có 1 lần gọi server lúc verify license thôi. Không telemetry, không train AI, không scrape.",
      },
      {
        q: "Hoàn tiền?",
        a: "Pro 14 ngày. Lifetime 30 ngày. Email mình trong thời hạn, hoàn 100%, không hỏi lý do.",
      },
      {
        q: "Có buff IELTS hay TOEIC không?",
        a: "Có. App có sẵn gần 5.300 từ chia theo cấp độ, trong đó phủ hầu hết từ thi IELTS và TOEIC. Bạn cũng có thể đẩy thêm file của riêng mình vào.",
      },
      {
        q: "Lỡ thú nhỏ chết thì sao?",
        a: "Thú nhỏ khum chết được đâu. Hunger xuống 0 thì nó ngủ thôi, chờ bạn quay lại. Không drama, không guilt-trip kiểu Tamagotchi cũ. Vô tư là vô tư.",
      },
    ],
  },
  en: {
    title: "Questions, maybe.",
    contact: "Question not here?",
    items: [
      {
        q: "Does it run on Windows?",
        a: "Yes. macOS 12+ and Windows 10+ run smoothly. Linux is in the oven, the build runs but the overlay isn't polished.",
      },
      {
        q: "What is Sepay, and is it safe?",
        a: "Sepay is a VietQR gateway. Open your banking app, scan the code, transfer normally. No card details entered anywhere. After the bank confirms (30 seconds to 2 minutes), the license lands in your inbox.",
      },
      {
        q: "Does the creature really sit over fullscreen Chrome?",
        a: "Yes. Chrome fullscreen, Netflix, Zoom presenting, the creature carefree wanders over all of them. Took a lot of late nights to get this right.",
      },
      {
        q: "Is my data uploaded?",
        a: "No. Words and review history sit on your machine. One network call: license verify on launch. No telemetry, no AI training, no scraping.",
      },
      {
        q: "Refunds?",
        a: "Pro: 14 days. Lifetime: 30 days. Email within the window for a full refund, no questions asked.",
      },
      {
        q: "Can I drill IELTS or TOEIC vocab?",
        a: "Yes. The app comes with nearly 5,300 words sorted by level, covering most IELTS and TOEIC vocab. You can also drop in your own list.",
      },
      {
        q: "What happens if my creature dies?",
        a: "It can't. Hunger hits 0 and the creature just sleeps waiting for you. Zero drama, zero guilt-trip. Carefree means carefree.",
      },
    ],
  },
};

export function FAQ({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative px-6 py-28 md:py-40">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <h2 className="font-display text-[40px] italic leading-[1.02] tracking-tight md:text-[56px]">
            {t.title}
          </h2>
          <div className="mt-8 text-[14px] text-[var(--color-ink-soft)]">
            {t.contact}
            <br />
            <a
              href="mailto:hi@vochi.app"
              className="mt-2 inline-block text-[var(--color-ink)] underline decoration-[var(--color-hairline-strong)] decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)]"
            >
              hi@vochi.app
            </a>
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="border-t border-[var(--color-hairline)]">
            {t.items.map((item, idx) => {
              const isOpen = open === idx;
              return (
                <div key={idx} className="border-b border-[var(--color-hairline)]">
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="flex w-full items-baseline justify-between gap-6 py-6 text-left transition-colors hover:text-[var(--color-accent-deep)]"
                  >
                    <span className="font-display text-[19px] leading-[1.25] tracking-tight md:text-[22px]">
                      {item.q}
                    </span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-hairline-strong)] text-[14px] transition-all ${
                        isOpen
                          ? "rotate-45 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-surface)]"
                          : "text-[var(--color-ink-soft)]"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-12 text-[15px] leading-[1.6] text-[var(--color-ink-soft)]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
