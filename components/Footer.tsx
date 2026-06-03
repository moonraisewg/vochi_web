"use client";

import Image from "next/image";
import Link from "next/link";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    cta: "Nuôi một thú nhỏ vô tư.",
    sub: "macOS, Windows. 28MB. Miễn phí.",
    download: "Tải miễn phí",
    pricing: "Xem bảng giá",
    product: "Sản phẩm",
    legal: "Pháp lý",
    company: "Công ty",
    privacy: "Quyền riêng tư",
    terms: "Điều khoản",
    contact: "Liên hệ",
    docs: "Cẩm nang",
    changelog: "Cập nhật",
    address: "Hà Nội, Việt Nam",
    rights: "Vô chi, 2026.",
    tagline:
      "Thú nhỏ ăn từ vựng. Bạn học mà không cảm thấy như đang học. Phát triển tại Hà Nội.",
  },
  en: {
    cta: "Adopt a carefree creature.",
    sub: "macOS, Windows. 28MB. Free.",
    download: "Download free",
    pricing: "Pricing",
    product: "Product",
    legal: "Legal",
    company: "Company",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    docs: "Handbook",
    changelog: "Updates",
    address: "Hanoi, Vietnam",
    rights: "Vô chi, 2026.",
    tagline:
      "A creature that eats vocab. You learn without feeling like you are studying. Built in Hanoi.",
  },
};

export function Footer({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <footer className="relative">
      <section className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-[640px]">
            <h2 className="font-display text-[40px] leading-[1.02] tracking-tight md:text-[64px]">
              {t.cta}
            </h2>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              {t.sub}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/download"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-[14px] font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-accent-deep)]"
            >
              {t.download}
              <span aria-hidden>↓</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-5 py-3 text-[14px] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-tint)]"
            >
              {t.pricing}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-hairline)] bg-[var(--color-bg)] px-6 py-16">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo-bird.png"
                alt="Vô chi"
                width={28}
                height={28}
                className="h-7 w-7 rounded-md object-cover"
              />
              <span className="font-display text-[18px] font-medium tracking-tight">
                Vô chi
              </span>
            </Link>
            <p className="mt-5 max-w-[300px] text-[14px] leading-[1.55] text-[var(--color-ink-soft)]">
              {t.tagline}
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              {t.address}
            </p>
          </div>

          <div>
            <div className="micro mb-4">{t.product}</div>
            <ul className="space-y-2.5 text-[14px] text-[var(--color-ink-soft)]">
              <li><Link href="/download" className="hover:text-[var(--color-ink)]">{t.download}</Link></li>
              <li><Link href="/pricing" className="hover:text-[var(--color-ink)]">{t.pricing}</Link></li>
              <li><Link href="/changelog" className="hover:text-[var(--color-ink)]">{t.changelog}</Link></li>
              <li><Link href="/docs" className="hover:text-[var(--color-ink)]">{t.docs}</Link></li>
            </ul>
          </div>

          <div>
            <div className="micro mb-4">{t.company}</div>
            <ul className="space-y-2.5 text-[14px] text-[var(--color-ink-soft)]">
              <li><Link href="/privacy" className="hover:text-[var(--color-ink)]">{t.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--color-ink)]">{t.terms}</Link></li>
              <li>
                <a href="mailto:hi@vochi.app" className="hover:text-[var(--color-ink)]">
                  hi@vochi.app
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="micro mb-4">{t.contact}</div>
            <ul className="space-y-2.5 text-[14px] text-[var(--color-ink-soft)]">
              <li>
                <a href="mailto:hi@vochi.app" className="hover:text-[var(--color-ink)]">
                  hi@vochi.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-14 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-[var(--color-hairline)] pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          <span>© {t.rights}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            {lang === "vi" ? "Thú nhỏ vẫn vô tư" : "Creatures still carefree"}
          </span>
        </div>
      </section>
    </footer>
  );
}
