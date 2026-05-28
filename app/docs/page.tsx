"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";

const COPY = {
  vi: {
    eyebrow: "Cẩm nang",
    title: "Setup trong 3 phút thôi.",
    sections: [
      { name: "Cài app", topics: ["Tải DMG / MSI", "Bấm cho quyền (macOS)", "Tự bật khi mở máy"] },
      { name: "Hai mode", topics: ["Mode 1: pet đi lông bông", "Mode 2: pet ngủ có lịch", "Đổi qua lại sao"] },
      { name: "Từ vựng", topics: ["100 từ có sẵn", "Đẩy CSV của bạn vô", "Sửa / xoá từ"] },
      { name: "Cách pet ôn từ", topics: ["Tại sao app biết bạn sắp quên", "4 nút Again / Hard / Good / Easy", "Streak với lapses là gì"] },
      { name: "License", topics: ["Mua qua VietQR", "Kích hoạt license", "Chuyển sang máy khác"] },
      { name: "Lỡ bug thì sao", topics: ["Pet không hiện trên fullscreen", "Gõ bàn phím không vô", "Reset hết dữ liệu"] },
    ],
  },
  en: {
    eyebrow: "Handbook",
    title: "Set up in 3 minutes.",
    sections: [
      { name: "Install", topics: ["Download DMG / MSI", "Grant permissions (macOS)", "Launch at login"] },
      { name: "Two modes", topics: ["Mode 1: free-roam pet", "Mode 2: scheduled naps", "Swap between them"] },
      { name: "Vocab", topics: ["100 starter words", "Bring your own CSV", "Edit / delete"] },
      { name: "How reviews work", topics: ["Why the app knows you're forgetting", "Again / Hard / Good / Easy", "Streaks & lapses, explained"] },
      { name: "License", topics: ["Buy via VietQR", "Activate", "Move to another device"] },
      { name: "Bug? Here.", topics: ["Pet missing on fullscreen", "Keyboard not typing", "Nuke all data"] },
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
              <div className="font-pixel text-[11px] uppercase tracking-[0.3em] text-[var(--color-pop)]">
                ▸ {t.eyebrow}
              </div>
              <h1 className="mt-3 font-display text-[44px] italic leading-[0.95] tracking-[-0.02em] md:text-[72px]">
                {t.title}
              </h1>

              <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border-[2px] border-[var(--color-ink)] bg-[var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] md:grid-cols-3">
                {t.sections.map((s, idx) => (
                  <div key={s.name} className="group bg-[var(--color-cream)] p-7 transition-colors hover:bg-[var(--color-paper-dark)]">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[42px] italic leading-none text-[var(--color-ink)]/15">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full border-[1.5px] border-[var(--color-ink)] px-2 py-0.5 font-pixel text-[9px] uppercase tracking-widest">
                        WIP
                      </span>
                    </div>
                    <div className="mt-4 font-display text-[22px] tracking-[-0.01em]">{s.name}</div>
                    <ul className="mt-3 space-y-1.5">
                      {s.topics.map((topic) => (
                        <li key={topic}>
                          <Link href="#" className="font-body text-[14px] underline decoration-transparent decoration-[2px] underline-offset-2 transition-colors hover:decoration-[var(--color-pop)]">
                            → {topic}
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
