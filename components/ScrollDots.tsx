"use client";

import { useEffect, useState } from "react";
import type { Lang } from "./Nav";

const SECTIONS: { id: string; vi: string; en: string }[] = [
  { id: "top", vi: "Mở đầu", en: "Top" },
  { id: "features", vi: "Tính năng", en: "Features" },
  { id: "manifesto", vi: "Câu chuyện", en: "Story" },
  { id: "method", vi: "Phương pháp", en: "Method" },
  { id: "pricing", vi: "Bảng giá", en: "Pricing" },
  { id: "faq", vi: "Câu hỏi", en: "FAQ" },
];

export function ScrollDots({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<string>("top");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el != null,
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (inView[0]) setActive(inView[0].target.id);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-30% 0px -30% 0px" },
    );
    els.forEach((el) => io.observe(el));

    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:80vh;left:0;height:1px;width:1px;pointer-events:none;";
    document.body.prepend(sentinel);
    const showIo = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    showIo.observe(sentinel);

    return () => {
      io.disconnect();
      showIo.disconnect();
      sentinel.remove();
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
