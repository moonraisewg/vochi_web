"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "./Nav";

const SECTIONS: { id: string; vi: string; en: string }[] = [
  { id: "top", vi: "Mở đầu", en: "Top" },
  { id: "features", vi: "Tính năng", en: "Features" },
  { id: "manifesto", vi: "Câu chuyện", en: "Story" },
  { id: "method", vi: "Phương pháp", en: "Method" },
  { id: "pricing", vi: "Bảng giá", en: "Pricing" },
  { id: "faq", vi: "Câu hỏi", en: "FAQ" },
];

const NAV_OFFSET = 100;

export function ScrollDots({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<string>("top");
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      rafRef.current = null;
      const probe = window.scrollY + NAV_OFFSET;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.offsetTop;
        if (top <= probe) current = s.id;
        else break;
      }
      setActive(current);
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className={`fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 transition-opacity duration-500 lg:flex ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onJump(s.id)}
            aria-label={lang === "vi" ? s.vi : s.en}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex items-center gap-3 py-1 pr-1"
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
                isActive
                  ? "translate-x-0 text-[var(--color-ink)] opacity-100"
                  : "translate-x-1 text-[var(--color-ink-soft)] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {lang === "vi" ? s.vi : s.en}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-2 w-2 bg-[var(--color-ink)]"
                  : "h-1.5 w-1.5 bg-[var(--color-ink-soft)]/40 group-hover:bg-[var(--color-ink-soft)]"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
