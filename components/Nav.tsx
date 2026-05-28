"use client";

import Link from "next/link";
import { useState } from "react";

export type Lang = "vi" | "en";

const COPY = {
  vi: {
    features: "Hoạt động sao",
    pricing: "Giá nhiêu",
    docs: "Cẩm nang",
    changelog: "Có gì mới",
    download: "Tải liền",
  },
  en: {
    features: "How it works",
    pricing: "Pricing",
    docs: "Handbook",
    changelog: "What's new",
    download: "Get it",
  },
};

export function Nav({
  lang,
  onLangChange,
}: {
  lang: Lang;
  onLangChange: (l: Lang) => void;
}) {
  const t = COPY[lang];
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-6 md:pt-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl border-[2px] border-[var(--color-ink)] bg-[var(--color-lcd)] shadow-[3px_3px_0_var(--color-ink)] transition-transform group-hover:rotate-[-6deg]">
            <div className="absolute inset-1 rounded-md bg-[#cfe0a4] lcd-scanlines">
              <span className="absolute inset-0 grid place-items-center font-pixel text-[10px] text-[var(--color-lcd-shadow)]">
                V
              </span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-[20px] italic">Vocabagotchi</span>
            <span className="font-pixel text-[9px] uppercase tracking-[0.25em] text-[var(--color-ink)]/60">
              vocab · pet · srs
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="navlink">{t.features}</a>
          <Link href="/pricing" className="navlink">{t.pricing}</Link>
          <Link href="/docs" className="navlink">{t.docs}</Link>
          <Link href="/changelog" className="navlink">{t.changelog}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} onChange={onLangChange} />
          <Link
            href="/download"
            className="hidden rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-2 font-pixel text-[11px] uppercase tracking-widest text-[var(--color-cream)] shadow-[3px_3px_0_var(--color-pop)] transition-transform hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--color-pop)] md:inline-block"
          >
            ▼ {t.download}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="md:hidden h-10 w-10 rounded-lg border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] shadow-[3px_3px_0_var(--color-ink)]"
          >
            <span className="block text-lg">≡</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-6 mt-3 rounded-2xl border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] p-4 shadow-[4px_4px_0_var(--color-ink)] md:hidden">
          <nav className="flex flex-col gap-3 font-body text-[15px]">
            <a href="#features" onClick={() => setOpen(false)}>{t.features}</a>
            <Link href="/pricing" onClick={() => setOpen(false)}>{t.pricing}</Link>
            <Link href="/docs" onClick={() => setOpen(false)}>{t.docs}</Link>
            <Link href="/changelog" onClick={() => setOpen(false)}>{t.changelog}</Link>
            <Link href="/download" onClick={() => setOpen(false)} className="font-pixel text-[11px] uppercase tracking-widest">
              ▼ {t.download}
            </Link>
          </nav>
        </div>
      )}

      <style>{`
        .navlink {
          position: relative;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 500;
          color: var(--color-ink);
          padding: 4px 0;
        }
        .navlink::after {
          content: "";
          position: absolute;
          left: 0; bottom: -2px;
          width: 0; height: 2px;
          background: var(--color-pop);
          transition: width 220ms ease;
        }
        .navlink:hover::after { width: 100%; }
      `}</style>
    </header>
  );
}

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="relative flex h-10 items-center rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] p-1 font-pixel text-[10px] uppercase tracking-widest shadow-[3px_3px_0_var(--color-ink)]">
      <button
        onClick={() => onChange("vi")}
        className={`relative z-10 px-3 py-1 transition-colors ${
          lang === "vi" ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]"
        }`}
      >
        VN
      </button>
      <button
        onClick={() => onChange("en")}
        className={`relative z-10 px-3 py-1 transition-colors ${
          lang === "en" ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]"
        }`}
      >
        EN
      </button>
      <div
        className="absolute top-1 bottom-1 w-[42px] rounded-full bg-[var(--color-ink)] transition-[left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ left: lang === "vi" ? 4 : 50 }}
      />
    </div>
  );
}
