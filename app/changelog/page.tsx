"use client";

import { PageShell } from "@/components/PageShell";
import { motion } from "motion/react";

const ENTRIES = [
  {
    v: "0.1.4",
    date: "2026-05-20",
    tag: "beta",
    title: "Mua qua VietQR + license tự bay vô mail",
    items: [
      "Quét QR là license tới mail liền, khum chờ đợi",
      "License xác thực offline · không cần mạng để mở app",
      "Trang Stats có lịch 90 ngày + streak hiện tại",
    ],
  },
  {
    v: "0.1.3",
    date: "2026-04-08",
    tag: "beta",
    title: "Mode 2: pet biết ngủ có giờ",
    items: [
      "Pet ngủ ngon khi chưa tới giờ học",
      "Đói quá thì pet tự thức dậy réo bạn",
      "Đổi mode trong Settings, khỏi restart app",
    ],
  },
  {
    v: "0.1.2",
    date: "2026-03-15",
    tag: "alpha",
    title: "Windows build chào sân",
    items: [
      "Có bản cài cho Windows 10 trở lên",
      "Pet không ăn focus của app khác",
      "Icon dưới khay system tray xinh xinh",
    ],
  },
  {
    v: "0.1.1",
    date: "2026-02-28",
    tag: "alpha",
    title: "Pet sống khoẻ trên fullscreen",
    items: [
      "Pet hiện đè được lên fullscreen mọi app",
      "Xử xong vụ pet biến mất khi đổi cửa sổ",
      "Pet siêu lì, không trốn nữa",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PageShell>
      {(lang) => (
        <section className="relative px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[900px]">
            <div className="font-pixel text-[11px] uppercase tracking-[0.3em] text-[var(--color-pop)]">
              ▸ {lang === "vi" ? "Cập nhật" : "Changelog"}
            </div>
            <h1 className="mt-3 font-display text-[44px] leading-[0.95] tracking-[-0.02em] md:text-[72px]">
              {lang === "vi" ? "Pet lớn từng tí." : "The pet levels up."}
            </h1>
            <p className="mt-5 max-w-[520px] text-[16px] leading-[1.55] text-[var(--color-ink-soft)]">
              {lang === "vi"
                ? "Tuần ra 1 bản. Sửa lỗi thì âm thầm; có tính năng mới thì lên đây hú."
                : "Roughly weekly. Quiet for fixes, loud for features."}
            </p>

            <div className="mt-14 space-y-10">
              {ENTRIES.map((e, idx) => (
                <motion.article
                  key={e.v}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="relative rounded-3xl border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] p-7 shadow-[5px_5px_0_var(--color-ink)]"
                >
                  <header className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[28px] italic leading-none">v{e.v}</span>
                      <span className="rounded-full border-[1.5px] border-[var(--color-ink)] bg-[var(--color-lcd)] px-2 py-0.5 font-pixel text-[9px] uppercase tracking-widest">
                        {e.tag}
                      </span>
                    </div>
                    <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--color-ink)]/55">
                      {e.date}
                    </span>
                  </header>
                  <h2 className="mt-3 font-display text-[24px] tracking-[-0.01em]">{e.title}</h2>
                  <ul className="mt-4 space-y-2">
                    {e.items.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-[15px] leading-[1.5]">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-sm bg-[var(--color-pop)]" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
