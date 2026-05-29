"use client";

import { PageShell } from "@/components/PageShell";
import { motion } from "motion/react";

const ENTRIES = [
  {
    v: "0.1.4",
    date: "2026-05-20",
    tag: "beta",
    title: "Mua qua VietQR, license bay vô mail",
    items: [
      "Quét QR, license tới mail liền, không chờ đợi.",
      "License xác thực offline, không cần mạng để mở app.",
      "Stats panel có lịch 90 ngày và streak hiện tại.",
    ],
  },
  {
    v: "0.1.3",
    date: "2026-04-08",
    tag: "beta",
    title: "Mode 2: pet biết ngủ có giờ",
    items: [
      "Pet ngủ ngon khi chưa tới giờ học.",
      "Đói quá thì pet tự thức dậy gọi bạn.",
      "Đổi mode trong Settings, khỏi restart.",
    ],
  },
  {
    v: "0.1.2",
    date: "2026-03-15",
    tag: "alpha",
    title: "Windows build chào sân",
    items: [
      "Có bản cài cho Windows 10 trở lên.",
      "Pet không ăn focus của app khác.",
      "Icon dưới khay system tray.",
    ],
  },
  {
    v: "0.1.1",
    date: "2026-02-28",
    tag: "alpha",
    title: "Pet sống khoẻ trên fullscreen",
    items: [
      "Pet đè được lên fullscreen của mọi app.",
      "Xử xong vụ pet biến mất khi đổi cửa sổ.",
      "Pet siêu lì, không trốn nữa.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PageShell>
      {(lang) => (
        <section className="relative px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[900px]">
            <h1 className="font-display text-[44px] leading-[1.02] tracking-tight md:text-[72px]">
              {lang === "vi" ? "Pet lớn dần." : "The pet grows."}
            </h1>
            <p className="mt-5 max-w-[520px] text-[16px] leading-[1.55] text-[var(--color-ink-soft)]">
              {lang === "vi"
                ? "Mỗi tuần một bản. Sửa lỗi thì im im. Có tính năng mới thì lên đây hú."
                : "Roughly weekly. Quiet for fixes, louder for features."}
            </p>

            <div className="mt-14 space-y-6">
              {ENTRIES.map((e, idx) => (
                <motion.article
                  key={e.v}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: idx * 0.04 }}
                  className="rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-7 lift"
                >
                  <header className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[24px] tracking-tight">v{e.v}</span>
                      <span className="rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-tint)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
                        {e.tag}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                      {e.date}
                    </span>
                  </header>
                  <h2 className="mt-3 font-display text-[22px] tracking-tight">{e.title}</h2>
                  <ul className="mt-4 space-y-2">
                    {e.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-3 text-[15px] leading-[1.5] text-[var(--color-ink-soft)]"
                      >
                        <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
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
