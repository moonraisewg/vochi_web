"use client";

import { PageShell } from "@/components/PageShell";
import { motion } from "motion/react";

const ENTRIES = [
  {
    v: "0.1.4",
    date: "2026-05-20",
    tag: "beta",
    title: "Mua qua VietQR, license gửi qua email",
    items: [
      "Quét QR, license được gửi vào email ngay sau khi xác nhận.",
      "License xác thực offline, không cần mạng để khởi động app.",
      "Trang thống kê hiển thị lịch 90 ngày và streak hiện tại.",
    ],
  },
  {
    v: "0.1.3",
    date: "2026-04-08",
    tag: "beta",
    title: "Thú nhỏ ngủ theo lịch",
    items: [
      "Thú nhỏ ngủ yên khi chưa tới giờ học.",
      "Tự động thức dậy khi cần ôn từ.",
      "Chuyển chế độ trong Settings, không cần khởi động lại.",
    ],
  },
  {
    v: "0.1.2",
    date: "2026-03-15",
    tag: "alpha",
    title: "Ra mắt bản Windows",
    items: [
      "Bản cài cho Windows 10 trở lên.",
      "Thú nhỏ không chiếm focus của app khác.",
      "Icon trong khay hệ thống.",
    ],
  },
  {
    v: "0.1.1",
    date: "2026-02-28",
    tag: "alpha",
    title: "Hỗ trợ hiển thị trên fullscreen",
    items: [
      "Thú nhỏ hiển thị trên cùng kể cả khi app khác ở fullscreen.",
      "Khắc phục lỗi thú nhỏ biến mất khi chuyển cửa sổ.",
      "Ổn định trên cả macOS và Windows.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PageShell>
      {(lang) => (
        <section className="relative px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[1280px]">
            <h1 className="font-display text-[34px] leading-[1.05] tracking-tight md:text-[72px] md:leading-[1.02]">
              {lang === "vi" ? "Cập nhật phát triển." : "Release notes."}
            </h1>
            <p className="mt-5 max-w-[520px] text-[16px] leading-[1.55] text-[var(--color-ink-soft)]">
              {lang === "vi"
                ? "Khoảng một bản mỗi tuần. Sửa lỗi nhỏ thì cập nhật im lặng, tính năng mới được công bố tại đây."
                : "Roughly one release a week. Small fixes ship quietly, new features are announced here."}
            </p>

            <div className="mt-14 max-w-[860px] space-y-6">
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
