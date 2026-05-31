"use client";

import { PageShell } from "@/components/PageShell";
import { PricingTeaser } from "@/components/PricingTeaser";
import { FAQ } from "@/components/FAQ";
import { motion } from "motion/react";

const COMPARE = {
  vi: {
    title: "Bạn hợp gói nào?",
    headers: ["Tính năng", "Free", "3 tháng", "6 tháng", "Lifetime"],
    rows: [
      ["Giá", "0đ", "129.000đ", "239.000đ", "599.000đ"],
      ["Thú nhỏ, Mode 1 (đi tự do)", "✓", "✓", "✓", "✓"],
      ["Mode 2 (thú ngủ có lịch)", "-", "✓", "✓", "✓"],
      ["Số từ tối đa", "100", "Không giới hạn", "Không giới hạn", "Không giới hạn"],
      ["Đẩy file của bạn", "-", "✓", "✓", "✓"],
      ["Skin thú nhỏ", "1", "Mặc định", "Tất cả hiện có", "Tất cả, cả tương lai"],
      ["Thiết bị", "1", "2", "3", "5"],
      ["Lịch streak và stats", "-", "✓", "✓", "✓"],
      ["Hỗ trợ", "Discord", "Email", "Email dưới 48h", "DM admin"],
      ["Thời hạn", "Mãi mãi", "3 tháng", "6 tháng", "Trọn đời"],
    ],
  },
  en: {
    title: "Which plan fits?",
    headers: ["Feature", "Free", "3 months", "6 months", "Lifetime"],
    rows: [
      ["Price", "0đ", "129.000đ", "239.000đ", "599.000đ"],
      ["Creature, Mode 1 (free-roam)", "✓", "✓", "✓", "✓"],
      ["Mode 2 (scheduled wake-up)", "-", "✓", "✓", "✓"],
      ["Word cap", "100", "Unlimited", "Unlimited", "Unlimited"],
      ["Bring your own file", "-", "✓", "✓", "✓"],
      ["Creature skins", "1", "Default only", "All current", "All, future too"],
      ["Devices", "1", "2", "3", "5"],
      ["Streak calendar and stats", "-", "✓", "✓", "✓"],
      ["Support", "Discord", "Email", "Email under 48h", "DM the maker"],
      ["Duration", "Forever", "3 months", "6 months", "Lifetime"],
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
                          className={`px-4 py-4 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)] ${
                            i === 3 ? "bg-[var(--color-tint)] text-[var(--color-ink)]" : ""
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
                            className={`px-4 py-4 text-[14px] ${
                              ci === 0
                                ? "font-display text-[15px] text-[var(--color-ink)]"
                                : "text-[var(--color-ink-soft)]"
                            } ${ci === 3 ? "bg-[var(--color-tint)]" : ""}`}
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
