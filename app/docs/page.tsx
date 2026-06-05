"use client";

import { PageShell } from "@/components/PageShell";

const COPY = {
  vi: {
    title: "Cẩm nang sử dụng trong 3 phút.",
    sections: [
      {
        name: "Cài đặt",
        topics: ["Tải DMG hoặc MSI", "Cấp quyền cần thiết (macOS)", "Khởi động cùng hệ thống"],
      },
      {
        name: "Hai chế độ học",
        topics: ["Thú nhỏ đi tự do", "Thú nhỏ ngủ theo lịch", "Chuyển đổi hai nhịp"],
      },
      {
        name: "Từ vựng",
        topics: ["Khoảng 5.300 từ chia theo cấp độ", "Thêm từ của riêng bạn", "Chỉnh sửa và xoá"],
      },
      {
        name: "Cách nhớ",
        topics: ["Thuật toán FSRS, học ít nhớ lâu", "App nhắc lại đúng lúc bạn sắp quên", "Streak và lapses"],
      },
      {
        name: "License",
        topics: ["Mua qua VietQR, key gửi qua email", "Nhập key trong app để kích hoạt", "Chuyển sang máy khác"],
      },
      {
        name: "Khắc phục sự cố",
        topics: ["Thú nhỏ không hiển thị trên fullscreen", "Bàn phím không nhập được", "Reset dữ liệu"],
      },
    ],
  },
  en: {
    title: "Get set up in 3 minutes.",
    sections: [
      {
        name: "Install",
        topics: ["Download DMG or MSI", "Grant required permissions (macOS)", "Launch at login"],
      },
      {
        name: "Two modes",
        topics: ["Free-roam creature", "Scheduled wake-up", "Switching between them"],
      },
      {
        name: "Vocabulary",
        topics: ["About 5,300 words sorted by level", "Add your own words", "Edit and delete"],
      },
      {
        name: "How it sticks",
        topics: ["FSRS algorithm, less study and longer memory", "The app surfaces words just before you forget", "Streaks and lapses"],
      },
      {
        name: "License",
        topics: ["Buy via VietQR, key arrives by email", "Enter the key in the app to activate", "Transfer to another device"],
      },
      {
        name: "Troubleshooting",
        topics: ["Creature missing on fullscreen", "Keyboard not typing", "Reset data"],
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
                        <li key={topic} className="text-[14px] text-[var(--color-ink-soft)]">
                          {topic}
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
