"use client";

import Image from "next/image";
import Link from "next/link";
import { PageShell } from "./PageShell";
import type { Lang } from "./Nav";
import type { BadgeMeta } from "@/lib/share/badges";
import type { ShareStats } from "@/lib/share/params";

const COPY = {
  vi: {
    badgeEyebrow: "Thành tựu trên Vô chi",
    statsEyebrow: "Hành trình trên Vô chi",
    statsTitle: "Một người bạn đang khoe hành trình học từ vựng",
    pitch:
      "Vô chi là thú nhỏ sống trên màn hình của bạn — trả lời flashcard để cho bé ăn, từ vựng tự vào đầu lúc nào không hay.",
    cta: "Tải Vô chi miễn phí",
    learnMore: "Tìm hiểu thêm",
    streak: "ngày liên tiếp",
    words: "từ đã học",
    level: "level thú cưng",
  },
  en: {
    badgeEyebrow: "Achievement on Vô chi",
    statsEyebrow: "A journey on Vô chi",
    statsTitle: "A friend is showing off their vocabulary journey",
    pitch:
      "Vô chi is a tiny pet living on your screen — answer flashcards to feed it and the words stick before you notice.",
    cta: "Download Vô chi free",
    learnMore: "Learn more",
    streak: "day streak",
    words: "words learned",
    level: "pet level",
  },
} as const;

function Actions({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-3">
      <Link
        href="/download"
        className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-[15px] font-medium text-white"
      >
        {copy.cta}
      </Link>
      <Link
        href="/"
        className="rounded-full border border-[var(--color-hairline-strong)] bg-white px-6 py-3 text-[15px] font-medium"
      >
        {copy.learnMore}
      </Link>
    </div>
  );
}

export function ShareBadgeLanding({ badgeKey, meta }: { badgeKey: string; meta: BadgeMeta }) {
  return (
    <PageShell>
      {(lang) => {
        const copy = COPY[lang];
        return (
          <section className="relative px-6 py-20 md:py-28">
            <div className="mx-auto max-w-[640px] text-center">
              <div className="micro mb-6">{copy.badgeEyebrow}</div>
              <div className="mx-auto w-fit rounded-[28px] border-2 border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-8 lift">
                <Image
                  src={`/badges/${badgeKey}.png`}
                  alt={meta.name[lang]}
                  width={220}
                  height={220}
                  priority
                />
              </div>
              <h1 className="mt-8 font-display text-[40px] leading-[1.05] tracking-tight md:text-[56px]">
                {meta.name[lang]}
              </h1>
              <p className="mt-3 text-[18px] text-[var(--color-ink-soft)]">{meta.desc[lang]}</p>
              <p className="mx-auto mt-8 max-w-[460px] text-[15px] leading-[1.6] text-[var(--color-ink-soft)]">
                {copy.pitch}
              </p>
              <Actions lang={lang} />
            </div>
          </section>
        );
      }}
    </PageShell>
  );
}

export function ShareStatsLanding({ stats }: { stats: ShareStats }) {
  return (
    <PageShell>
      {(lang) => {
        const copy = COPY[lang];
        const blocks = [
          { emoji: "🔥", value: stats.streak, label: copy.streak },
          { emoji: "📖", value: stats.words, label: copy.words },
          { emoji: "⭐", value: stats.level, label: copy.level },
        ];
        return (
          <section className="relative px-6 py-20 md:py-28">
            <div className="mx-auto max-w-[640px] text-center">
              <div className="micro mb-6">{copy.statsEyebrow}</div>
              <h1 className="font-display text-[36px] leading-[1.1] tracking-tight md:text-[48px]">
                {copy.statsTitle}
              </h1>
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {blocks.map((block) => (
                  <div
                    key={block.label}
                    className="rounded-[24px] border-2 border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-4 py-8 lift"
                  >
                    <div className="text-[34px]">{block.emoji}</div>
                    <div className="mt-2 font-display text-[40px] tracking-tight text-[#6d52c4]">
                      {block.value}
                    </div>
                    <div className="micro mt-1">{block.label}</div>
                  </div>
                ))}
              </div>
              <p className="mx-auto mt-10 max-w-[460px] text-[15px] leading-[1.6] text-[var(--color-ink-soft)]">
                {copy.pitch}
              </p>
              <Actions lang={lang} />
            </div>
          </section>
        );
      }}
    </PageShell>
  );
}
