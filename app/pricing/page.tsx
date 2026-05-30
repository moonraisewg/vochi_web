"use client";

import { PageShell } from "@/components/PageShell";
import { PricingTeaser } from "@/components/PricingTeaser";
import { FAQ } from "@/components/FAQ";
import { motion } from "motion/react";

const COMPARE = {
  vi: {
    title: "Bạn hợp gói nào?",
    headers: ["Tính năng", "Free", "Pro", "Lifetime"],
    rows: [
      ["Pet, Mode 1 (đi tự do)", "✓", "✓", "✓"],
      ["Mode 2 (pet ngủ có lịch)", "✓", "✓", "✓"],
      ["Số từ tối đa", "100 (sẵn)", "Không giới hạn", "Không giới hạn"],
      ["Đẩy CSV của bạn", "-", "✓", "✓"],
      ["Pet skin", "1 (mặc định)", "Tất cả hiện có", "Tất cả, cả tương lai"],
      ["Thiết bị", "1", "3", "5"],
      ["Streak calendar và stats", "-", "✓", "✓"],
      ["Hỗ trợ", "Discord", "Email dưới 48h", "Nhắn admin trực tiếp"],
      ["Cập nhật", "Năm hiện tại", "12 tháng", "Trọn đời"],
    ],
  },
  en: {
    title: "Which plan fits?",
    headers: ["Feature", "Free", "Pro", "Lifetime"],
    rows: [
      ["Pet, Mode 1 (free-roam)", "✓", "✓", "✓"],
      ["Mode 2 (scheduled wake-up)", "✓", "✓", "✓"],
      ["Word cap", "100 (seed)", "Unlimited", "Unlimited"],
      ["Bring your own CSV", "-", "✓", "✓"],
      ["Pet skins", "1 (default)", "All current", "All, future too"],
      ["Devices", "1", "3", "5"],
      ["Streak calendar and stats", "-", "✓", "✓"],
      ["Support", "Discord", "Email under 48h", "DM the maker"],
      ["Updates", "Current year", "12 months", "Lifetime"],
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
            <div className="mx-auto max-w-[1100px]">
              <div className="mb-10">
                <h2 className="font-display text-[32px] leading-[1.05] tracking-tight md:text-[48px]">
                  {COMPARE[lang].title}
                </h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] lift">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-hairline)]">
                      {COMPARE[lang].headers.map((h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-4 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)] ${
                            i === 2 ? "bg-[var(--color-tint)] text-[var(--color-ink)]" : ""
                          }`}
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
                        transition={{ duration: 0.35, delay: ri * 0.03 }}
                        className="border-t border-[var(--color-hairline)]"
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`px-5 py-4 text-[14px] ${
                              ci === 0
                                ? "font-display text-[15px] text-[var(--color-ink)]"
                                : "text-[var(--color-ink-soft)]"
                            } ${ci === 2 ? "bg-[var(--color-tint)]" : ""}`}
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
