"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Lang = "vi" | "en";

const COPY = {
  vi: {
    features: "Hoạt động sao",
    pricing: "Giá nhiêu",
    docs: "Cẩm nang",
    changelog: "Có gì mới",
    download: "Tải free",
  },
  en: {
    features: "How it works",
    pricing: "Pricing",
    docs: "Handbook",
    changelog: "Updates",
    download: "Download free",
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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none;";
    document.body.prepend(sentinel);
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px" },
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-[var(--color-hairline)] bg-[var(--color-bg)]/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
      style={{ height: 72 }}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
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

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="navlink">{t.features}</Link>
          <Link href="/pricing" className="navlink">{t.pricing}</Link>
          <Link href="/docs" className="navlink">{t.docs}</Link>
          <Link href="/changelog" className="navlink">{t.changelog}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} onChange={onLangChange} />
          <Link
            href="/download"
            className="hidden rounded-full bg-[var(--color-ink)] px-4 py-2 text-[13px] font-medium text-[var(--color-surface)] transition-all hover:bg-[var(--color-accent-deep)] md:inline-block"
          >
            {t.download}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] md:hidden"
          >
            <span className="block text-base">≡</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-6 mt-2 rounded-xl border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-4 lift md:hidden">
          <nav className="flex flex-col gap-3 text-[14px]">
            <Link href="/#features" onClick={() => setOpen(false)}>{t.features}</Link>
            <Link href="/pricing" onClick={() => setOpen(false)}>{t.pricing}</Link>
            <Link href="/docs" onClick={() => setOpen(false)}>{t.docs}</Link>
            <Link href="/changelog" onClick={() => setOpen(false)}>{t.changelog}</Link>
            <Link
              href="/download"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-[var(--color-ink)] px-4 py-2 text-center text-[13px] font-medium text-[var(--color-surface)]"
            >
              {t.download}
            </Link>
          </nav>
        </div>
      )}

      <style>{`
        .navlink {
          position: relative;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 450;
          color: var(--color-ink-soft);
          padding: 4px 0;
          transition: color 200ms;
        }
        .navlink:hover { color: var(--color-ink); }
      `}</style>
    </header>
  );
}

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="relative flex h-9 items-center rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-0.5 text-[11px] font-medium uppercase tracking-wider">
      <button
        onClick={() => onChange("vi")}
        className={`relative z-10 px-3 py-1.5 transition-colors ${
          lang === "vi" ? "text-[var(--color-surface)]" : "text-[var(--color-ink-soft)]"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => onChange("en")}
        className={`relative z-10 px-3 py-1.5 transition-colors ${
          lang === "en" ? "text-[var(--color-surface)]" : "text-[var(--color-ink-soft)]"
        }`}
      >
        EN
      </button>
      <div
        className="absolute top-0.5 bottom-0.5 w-[38px] rounded-full bg-[var(--color-ink)] transition-[left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ left: lang === "vi" ? 2 : 42 }}
      />
    </div>
  );
}
