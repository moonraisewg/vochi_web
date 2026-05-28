"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Hỏi gì cũng được · ko ngại",
    title: "Bạn hỏi. Mình đáp tuốt.",
    items: [
      {
        q: "Có chạy trên Windows không hay chỉ Mac?",
        a: "Cả hai luôn. macOS 12+ và Windows 10+ chiến tốt. Linux đang trong nồi — build chạy được mà overlay chưa mượt, đợi xíu nha.",
      },
      {
        q: "Sepay là gì? An toàn không vậy?",
        a: "Sepay là cổng VietQR. Bạn mở app ngân hàng, quét cái mã, chuyển khoản như bình thường — không có vụ nhập số thẻ đâu. Ngân hàng confirm (~30s–2 phút) là license bay thẳng vô mail.",
      },
      {
        q: "Pet có lên được fullscreen Chrome không?",
        a: "Có chứ. Bạn mở Chrome fullscreen, xem Netflix toàn màn hình, hay Zoom họp full — pet vẫn nhảy đùng đùng trên đó. Tụi mình tốn khá nhiều đêm để xử vụ này, nên giờ pet siêu lì.",
      },
      {
        q: "Dữ liệu của em có bị upload đi đâu không?",
        a: "Không hề. Từ vựng với tiến độ học nằm im trên máy bạn. Chỉ có 1 lần gọi server lúc verify license thôi. Không telemetry, không train AI, không scrape gì hết. Đảm bảo bằng danh dự pet.",
      },
      {
        q: "Lỡ không thích, hoàn tiền được không?",
        a: "Được mà. Pro: 14 ngày. Lifetime: 30 ngày. Email cho mình trong thời hạn → hoàn 100%, mình không hỏi lý do (nhưng mình sẽ buồn xíu).",
      },
      {
        q: "Có open source không?",
        a: "Phần lõi sẽ mở mã nguồn khi lên v1.0 cho ai muốn mò code. App đóng gói (pet, skin, license) thì giữ closed, để còn có cái nuôi pet thật của mình.",
      },
      {
        q: "Lỡ pet chết thì sao? Có ám ảnh không?",
        a: "Pet khum chết được đâu, yên tâm. Hunger xuống 0 thì pet ngủ thôi, chờ bạn quay lại. Không có drama, không guilt-trip kiểu Tamagotchi cũ — mình hong nỡ.",
      },
      {
        q: "Có buff IELTS / TOEIC được không trùm?",
        a: "Được mà. Bạn đẩy file danh sách từ IELTS / TOEIC vô, pet ưu tiên ôn cho bạn. Một số bạn beta cày được 600 từ trong 3 tháng — không claim suông, log review thật.",
      },
    ],
  },
  en: {
    eyebrow: "Ask away",
    title: "Stuff you'll wonder.",
    items: [
      {
        q: "Mac only or Windows too?",
        a: "Both, friend. macOS 12+ and Windows 10+. Linux is in the oven — the build runs but the overlay's still rough.",
      },
      {
        q: "What's Sepay? Is it safe?",
        a: "Sepay is a VietQR gateway. Open your banking app, scan the code, transfer normally — no card details typed anywhere. Bank confirms (~30s–2min), license drops into your inbox.",
      },
      {
        q: "Does it really hover over fullscreen Chrome?",
        a: "Yep. Chrome fullscreen, Netflix, Zoom presenting — pet hops on top of all of them. Took a lot of late nights to get this right, so the pet is now stubbornly visible.",
      },
      {
        q: "Is my data uploaded somewhere?",
        a: "Nope. Words + reviews live on your disk. One network call: license verify on launch. No telemetry, no AI training, no scraping. Pet's honor.",
      },
      {
        q: "Refunds if I bail?",
        a: "Sure. Pro: 14 days. Lifetime: 30 days. Email within the window — full refund, no questions (but I'll be a little sad).",
      },
      {
        q: "Open source?",
        a: "The engine core goes open at v1.0 for tinkerers. The packaged app (pet, skins, license layer) stays closed — gotta feed my own pet too.",
      },
      {
        q: "What if my pet dies? Do I cry?",
        a: "It can't die. Hunger hits 0 → pet just sleeps and waits for you. Zero drama, zero guilt-trip.",
      },
    ],
  },
};

export function FAQ({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative px-6 py-24 md:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="font-pixel text-[11px] uppercase tracking-[0.3em] text-[var(--color-pop)]">
            ▸ {t.eyebrow}
          </div>
          <h2 className="mt-3 font-display text-[44px] italic leading-[0.95] tracking-[-0.02em] md:text-[72px]">
            {t.title}
          </h2>
          <div className="mt-8 hidden font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink)]/50 md:block">
            ↘ {lang === "vi" ? "không thấy câu của bạn? gửi mail nha" : "not here? shoot an email"}<br />
            <a href="mailto:hi@vocabagotchi.app" className="underline decoration-[var(--color-pop)] decoration-[3px] underline-offset-4">
              hi@vocabagotchi.app
            </a>
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="divide-y-[1.5px] divide-[var(--color-ink)] border-y-[1.5px] border-[var(--color-ink)]">
            {t.items.map((item, idx) => {
              const isOpen = open === idx;
              return (
                <div key={idx}>
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:bg-[var(--color-paper-dark)]/40"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono text-[12px] tabular-nums text-[var(--color-ink)]/45">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[20px] leading-tight tracking-[-0.01em] md:text-[24px]">
                        {item.q}
                      </span>
                    </div>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] font-pixel text-[14px] transition-transform ${
                        isOpen ? "rotate-45 bg-[var(--color-pop)] text-[var(--color-cream)]" : ""
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
                        <p className="pb-6 pl-12 pr-12 text-[16px] leading-[1.6] text-[var(--color-ink-soft)]">
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
