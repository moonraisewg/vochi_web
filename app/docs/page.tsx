"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";

const COPY = {
  vi: {
    title: "Cẩm nang trong 3 phút.",
    sections: [
      {
        name: "Cài app",
        topics: ["Tải DMG / MSI", "Cấp quyền (macOS)", "Khởi động cùng máy"],
      },
      {
        name: "Hai mode",
        topics: ["Mode 1: pet đi tự do", "Mode 2: pet ngủ có lịch", "Đổi qua lại"],
      },
      {
        name: "Từ vựng",
        topics: ["100 từ có sẵn", "Đẩy CSV của bạn", "Sửa và xoá"],
      },
      {
        name: "Cách ôn",
        topics: ["Vì sao app biết bạn sắp quên", "Again / Hard / Good / Easy", "Streak và lapses"],
      },
      {
        name: "License",
        topics: ["Mua qua VietQR", "Kích hoạt", "Chuyển sang máy khác"],
      },
      {
        name: "Lỡ bug",
        topics: ["Pet không hiện trên fullscreen", "Bàn phím không nhập được", "Reset dữ liệu"],
      },
    ],
  },
  en: {
    title: "Set up in 3 minutes.",
    sections: [
      {
        name: "Install",
        topics: ["Download DMG / MSI", "Grant permissions (macOS)", "Launch at login"],
      },
      {
        name: "Two modes",
        topics: ["Mode 1: free-roam pet", "Mode 2: scheduled wake-up", "Swap between them"],
      },
      {
        name: "Vocab",
        topics: ["100 starter words", "Bring your own CSV", "Edit and delete"],
      },
      {
        name: "How reviews work",
        topics: ["Why the app knows you're forgetting", "Again / Hard / Good / Easy", "Streaks and lapses"],
      },
      {
        name: "License",
        topics: ["Buy via VietQR", "Activate", "Move to another device"],
      },
      {
        name: "Bug? Here.",
        topics: ["Pet missing on fullscreen", "Keyboard not typing", "Nuke all data"],
      },
    ],
  },
};

export default function DocsPage() {
  return (
    <PageShell>
      {(lang) => {
        const t = COPY[lang];
        return (
          <section className="relative px-6 py-16 md:py-24">
            <div className="mx-auto max-w-[1100px]">
              <h1 className="font-display text-[44px] italic leading-[1.02] tracking-tight md:text-[72px]">
                {t.title}
              </h1>

              <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-hairline)] lift md:grid-cols-3">
                {t.sections.map((s, idx) => (
                  <div
                    key={s.name}
                    className="group bg-[var(--color-surface)] p-7 transition-colors hover:bg-[var(--color-tint)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full border border-[var(--color-hairline-strong)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
                        WIP
                      </span>
                    </div>
                    <div className="mt-5 font-display text-[22px] tracking-tight">{s.name}</div>
                    <ul className="mt-3 space-y-1.5">
                      {s.topics.map((topic) => (
                        <li key={topic}>
                          <Link
                            href="#"
                            className="text-[14px] text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-accent-deep)]"
                          >
                            {topic}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }}
    </PageShell>
  );
}
