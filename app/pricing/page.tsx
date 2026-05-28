"use client";

import { PageShell } from "@/components/PageShell";
import { PricingTeaser } from "@/components/PricingTeaser";
import { FAQ } from "@/components/FAQ";
import { motion } from "motion/react";

const COMPARE = {
  vi: {
    eyebrow: "So thử cho dễ chọn",
    title: "Bạn team nào?",
    headers: ["Có gì", "Free", "Pro", "Lifetime"],
    rows: [
      ["Pet · Mode 1 (đi lông bông)", "✓", "✓", "✓"],
      ["Mode 2 (pet ngủ có lịch)", "—", "✓", "✓"],
      ["Số từ chứa được", "100 (sẵn có)", "Vô tận", "Vô tận"],
      ["Đẩy CSV vào", "—", "✓", "✓"],
      ["Pet skin", "1 (em mặc định)", "Tất cả hiện có", "Tất cả · cả em mới ra"],
      ["Số máy xài cùng lúc", "1", "3", "5"],
      ["Lịch streak + thống kê xịn", "—", "✓", "✓"],
      ["Hỗ trợ", "Vô Discord chém", "Email <48h", "DM trực tiếp"],
      ["Update mới", "Trong năm này", "1 năm", "Tới khi mình chán"],
    ],
  },
  en: {
    eyebrow: "Side-by-side",
    title: "Which team you on?",
    headers: ["What you get", "Free", "Pro", "Lifetime"],
    rows: [
      ["Pet · Mode 1 (free-roam)", "✓", "✓", "✓"],
      ["Mode 2 (spaced ambush)", "—", "✓", "✓"],
      ["Word cap", "100 (seed)", "No cap", "No cap"],
      ["Drop in CSV", "—", "✓", "✓"],
      ["Pet skins", "1 (default lil guy)", "All current", "All · including future"],
      ["Devices at once", "1", "3", "5"],
      ["Streak calendar + fancy stats", "—", "✓", "✓"],
      ["Support", "Discord", "Email <48h", "DM the maker"],
      ["Updates", "Current year", "1 year", "Until I get bored"],
    ],
  },
};

export default function PricingPage() {
  return (
    <PageShell>
      {(lang) => (
        <>
          <PricingTeaser lang={lang} />
          <section className="relative px-6 pb-24">
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-10">
                <div className="font-pixel text-[11px] uppercase tracking-[0.3em] text-[var(--color-pop)]">
                  ▸ {COMPARE[lang].eyebrow}
                </div>
                <h2 className="mt-3 font-display text-[36px] italic leading-[0.95] tracking-[-0.02em] md:text-[56px]">
                  {COMPARE[lang].title}
                </h2>
              </div>
              <div className="overflow-hidden rounded-3xl border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] shadow-[6px_6px_0_var(--color-ink)]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                      {COMPARE[lang].headers.map((h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-4 text-left font-pixel text-[11px] uppercase tracking-widest ${
                            i === 2 ? "bg-[var(--color-lcd)] text-[var(--color-ink)]" : ""
                          } ${i === 3 ? "bg-[var(--color-pop)] text-[var(--color-cream)]" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE[lang].rows.map((row, ri) => (
                      <motion.tr
                        key={ri}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: ri * 0.03 }}
                        className="border-t-[1.5px] border-dashed border-[var(--color-ink)]/20"
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`px-5 py-4 text-[14.5px] ${
                              ci === 0 ? "font-display text-[16px]" : "font-mono"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          <FAQ lang={lang} />
        </>
      )}
    </PageShell>
  );
}
