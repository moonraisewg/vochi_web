"use client";

import Link from "next/link";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    cta: "Cứu pet. Cày từ vựng.",
    sub: "macOS · Windows · Beta · 28MB · chill nhẹ · free luôn",
    download: "Tải free",
    pricing: "Coi giá",
    legal: "Pháp lý xíu",
    privacy: "Riêng tư",
    terms: "Điều khoản",
    contact: "Liên hệ",
    address: "Hà Nội · Việt Nam · ☕",
    rights: "Vocabagotchi · 2026 · Pet team status: vẫn còn nguyên đội hình",
    newsletter: "Newsletter",
    newsletterSub: "1 mail / tháng. Có pet mới thì kêu. Không spam, hứa.",
    newsletterCta: "Đăng ký",
  },
  en: {
    cta: "Adopt a pet. Grind words.",
    sub: "macOS · Windows · Beta · 28MB · chill",
    download: "Download free",
    pricing: "Pricing",
    legal: "Legal stuff",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    address: "Hanoi · Vietnam · ☕",
    rights: "Vocabagotchi · 2026 · No pets harmed",
    newsletter: "Newsletter",
    newsletterSub: "One email a month. When a new pet ships. Zero spam, promise.",
    newsletterCta: "Subscribe",
  },
};

export function Footer({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <footer className="relative">
      {/* big CTA */}
      <div className="relative overflow-hidden border-t-[2px] border-[var(--color-ink)] bg-[var(--color-pop)] px-6 py-24 text-[var(--color-cream)] md:py-32">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-[44px] leading-[0.95] tracking-[-0.02em] md:text-[88px]">
              <span className="italic">{t.cta.split(".")[0]}.</span>
            </h2>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-widest text-[var(--color-cream)]/80">
              {t.sub}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/download"
              className="inline-flex items-center gap-3 rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-3.5 font-pixel text-[11px] uppercase tracking-widest text-[var(--color-cream)] shadow-[5px_5px_0_var(--color-cream)] transition-transform hover:-translate-y-[2px] hover:shadow-[7px_7px_0_var(--color-cream)]"
            >
              ▼ {t.download}
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] px-5 py-3.5 font-pixel text-[11px] uppercase tracking-widest text-[var(--color-ink)] shadow-[3px_3px_0_var(--color-ink)] transition-transform hover:-translate-y-[2px]"
            >
              {t.pricing} →
            </Link>
          </div>
        </div>
      </div>

      {/* main footer */}
      <div className="border-t-[2px] border-[var(--color-ink)] bg-[var(--color-paper-dark)] px-6 py-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border-[2px] border-[var(--color-ink)] bg-[var(--color-lcd)] shadow-[3px_3px_0_var(--color-ink)]">
                <div className="m-1 grid place-items-center rounded-md bg-[#cfe0a4] lcd-scanlines font-pixel text-[10px] text-[var(--color-lcd-shadow)] aspect-square">
                  V
                </div>
              </div>
              <span className="font-display text-[22px] italic">Vocabagotchi</span>
            </div>
            <p className="mt-4 max-w-[300px] text-[14px] leading-[1.55] text-[var(--color-ink-soft)]">
              {lang === "vi"
                ? "Pet ăn từ vựng. Bạn học mà tưởng đang chill. Đẻ ra trong một căn gác Hà Nội, nuôi bằng trà sữa, làm bằng tình yêu."
                : "A pet that eats vocab. Learn English without realizing. Built in a Hanoi attic, fueled by milk tea and love."}
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink)]/55">
              {t.address}
            </p>
          </div>

          <div>
            <div className="font-pixel text-[10px] uppercase tracking-widest text-[var(--color-ink)]/60">
              {lang === "vi" ? "Sản phẩm" : "Product"}
            </div>
            <ul className="mt-4 space-y-2 text-[14px]">
              <li><Link href="/download" className="hover:underline">{t.download}</Link></li>
              <li><Link href="/pricing" className="hover:underline">{t.pricing}</Link></li>
              <li><Link href="/changelog" className="hover:underline">{lang === "vi" ? "Cập nhật" : "Changelog"}</Link></li>
              <li><Link href="/docs" className="hover:underline">{lang === "vi" ? "Hướng dẫn" : "Docs"}</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-pixel text-[10px] uppercase tracking-widest text-[var(--color-ink)]/60">{t.legal}</div>
            <ul className="mt-4 space-y-2 text-[14px]">
              <li><Link href="/privacy" className="hover:underline">{t.privacy}</Link></li>
              <li><Link href="/terms" className="hover:underline">{t.terms}</Link></li>
              <li><a href="mailto:hi@vocabagotchi.app" className="hover:underline">hi@vocabagotchi.app</a></li>
            </ul>
          </div>

          <div>
            <div className="font-pixel text-[10px] uppercase tracking-widest text-[var(--color-ink)]/60">{t.newsletter}</div>
            <p className="mt-4 text-[13px] leading-[1.5] text-[var(--color-ink-soft)]">{t.newsletterSub}</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex gap-2"
            >
              <input
                type="email"
                placeholder="email@..."
                className="w-full rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] px-3 py-2 font-mono text-[12px] outline-none focus:shadow-[3px_3px_0_var(--color-pop)]"
              />
              <button className="rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-ink)] px-3 py-2 font-pixel text-[10px] uppercase tracking-widest text-[var(--color-cream)] shadow-[3px_3px_0_var(--color-pop)]">
                →
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto mt-14 flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t-[1.5px] border-dashed border-[var(--color-ink)]/30 pt-6 font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink)]/55">
          <span>© {t.rights}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-lcd)] blink" />
            {lang === "vi" ? "Pet đang xem bạn scroll · vẫn còn sống nhé" : "Pet is watching you scroll · still alive"}
          </span>
        </div>
      </div>
    </footer>
  );
}
