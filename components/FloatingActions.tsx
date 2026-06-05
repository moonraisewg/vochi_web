"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

const COPY = {
  vi: { adopt: "Nuôi thú ngay", up: "Lên đầu trang" },
  en: { adopt: "Adopt now", up: "Back to top" },
} as const;

export function FloatingActions() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  // Reveal after the user scrolls past one viewport. IntersectionObserver on a
  // sentinel keeps this off the main scroll thread.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:80vh;left:0;width:1px;height:1px;pointer-events:none;";
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  const t = COPY[lang];

  return (
    <div
      className={`pointer-events-none fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3 transition-all duration-300 md:bottom-6 md:right-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t.up}
        className={`pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] text-[18px] text-[var(--color-ink)] shadow-[0_6px_20px_rgba(15,19,17,0.10)] transition-colors hover:bg-[var(--color-tint)] ${
          visible ? "" : "pointer-events-none"
        }`}
      >
        <span aria-hidden>↑</span>
      </button>
      <Link
        href="/download"
        className={`pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-[14px] font-medium text-[var(--color-surface)] shadow-[0_10px_30px_rgba(15,19,17,0.18)] transition-colors hover:bg-[var(--color-accent-deep)] ${
          visible ? "" : "pointer-events-none"
        }`}
      >
        {t.adopt}
        <span aria-hidden className="text-[15px] leading-none">↓</span>
      </Link>
    </div>
  );
}
