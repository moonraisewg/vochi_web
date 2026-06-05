"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    title: "Câu hỏi thường gặp.",
    contact: "Không thấy câu hỏi của bạn? Gửi email cho mình.",
    items: [
      {
        q: "Nếu thú nhỏ chết thì sao?",
        a: "Nó sẽ không chết chỉ vì bạn bận vài ngày. Vô chi không dùng cảm giác tội lỗi để giữ chân bạn. Thú nhỏ chỉ ngủ và đợi bạn quay lại. Học vài từ là nó tỉnh dậy.",
      },
      {
        q: "App có chạy trên Windows không?",
        a: "Có. macOS 12 trở lên và Windows 10 trở lên đều được hỗ trợ. Bản Linux đang trong quá trình hoàn thiện.",
      },
      {
        q: "Thanh toán bằng cách nào, có an toàn không?",
        a: "Bạn quét mã VietQR trong app ngân hàng và chuyển khoản như bình thường. Không cần nhập số thẻ. Sau khi ngân hàng xác nhận (thường trong 30 giây đến 2 phút), license sẽ được gửi vào email.",
      },
      {
        q: "Thú nhỏ có hiển thị được trên fullscreen Chrome?",
        a: "Có. Thú nhỏ hiển thị trên cùng kể cả khi bạn xem Netflix, Chrome fullscreen hoặc trình chiếu Zoom.",
      },
      {
        q: "Dữ liệu của tôi có bị upload không?",
        a: "Không. Từ vựng và tiến độ học chỉ lưu trên máy của bạn. App chỉ gọi server một lần lúc xác thực license. Không telemetry, không thu thập, không dùng để huấn luyện AI.",
      },
      {
        q: "Chính sách hoàn tiền?",
        a: "Pro 14 ngày, Lifetime 30 ngày. Gửi email trong thời hạn để được hoàn 100%, không cần lý do.",
      },
      {
        q: "Có hỗ trợ ôn IELTS hoặc TOEIC không?",
        a: "Có. App có sẵn gần 5.300 từ chia theo cấp độ, phủ hầu hết từ thi IELTS và TOEIC. Bạn cũng có thể nhập thêm danh sách của riêng mình.",
      },
    ],
  },
  en: {
    title: "Frequently asked.",
    contact: "Question not here? Send me an email.",
    items: [
      {
        q: "What happens if my creature dies?",
        a: "It will not die just because you are busy for a few days. Vô chi does not use guilt to keep you around. The creature simply sleeps and waits for you to come back. A few words wake it right up.",
      },
      {
        q: "Does it run on Windows?",
        a: "Yes. macOS 12+ and Windows 10+ are both supported. A Linux build is in progress.",
      },
      {
        q: "How does payment work? Is it safe?",
        a: "Scan a VietQR code in your banking app and transfer as usual. No card details are entered anywhere. Once the bank confirms (typically 30 seconds to 2 minutes), the license is emailed to you.",
      },
      {
        q: "Does the creature really sit over fullscreen Chrome?",
        a: "Yes. The creature stays on top while you watch Netflix, browse Chrome in fullscreen, or present on Zoom.",
      },
      {
        q: "Is my data uploaded?",
        a: "No. Words and review history live on your device. The app only contacts the server once, to verify your license. No telemetry, no scraping, no AI training.",
      },
      {
        q: "Refund policy?",
        a: "Pro: 14 days. Lifetime: 30 days. Email within the window for a full refund, no questions asked.",
      },
      {
        q: "Can I drill IELTS or TOEIC vocab?",
        a: "Yes. The app includes nearly 5,300 words sorted by level, covering most IELTS and TOEIC vocabulary. You can also import your own list.",
      },
    ],
  },
};

export function FAQ({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <h2 className="font-display text-[34px] italic leading-[1.05] tracking-tight md:text-[56px] md:leading-[1.02]">
            {t.title}
          </h2>
          <div className="mt-8 text-[14px] text-[var(--color-ink-soft)]">
            {t.contact}
            <br />
            <a
              href="mailto:hi@vochi.xyz"
              className="mt-2 inline-block text-[var(--color-ink)] underline decoration-[var(--color-hairline-strong)] decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)]"
            >
              hi@vochi.xyz
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
