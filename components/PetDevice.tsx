"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useAnimationFrame } from "motion/react";
import type { Lang } from "./Nav";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Animation = "carry" | "eating" | "happy" | "sleeping" | "learning";

const SRC: Record<Animation, string> = {
  carry: "/lottie/carry.json",
  eating: "/lottie/petdoi.json",
  happy: "/lottie/vochihi.json",
  sleeping: "/lottie/sleeping.json",
  learning: "/lottie/Learning.json",
};

const LABELS = {
  vi: {
    live: "Đang sống",
    level: "Cấp",
    hunger: "Sức khoẻ",
    due: "Đến hạn",
    skip: "Bỏ qua",
    feed: "Cho ăn",
    reveal: "Xem",
  },
  en: {
    live: "Live",
    level: "Lvl",
    hunger: "Health",
    due: "Due",
    skip: "Skip",
    feed: "Feed",
    reveal: "Reveal",
  },
} as const;

const WORDS = [
  { en: "ephemeral", vi: "phù du", phon: "/ɪˈfem.ər.əl/" },
  { en: "serendipity", vi: "duyên may", phon: "/ˌser.ənˈdɪp.ə.ti/" },
  { en: "nostalgia", vi: "hoài niệm", phon: "/nɒˈstæl.dʒə/" },
  { en: "petrichor", vi: "mùi đất sau mưa", phon: "/ˈpet.rɪ.kɔːr/" },
  { en: "wanderlust", vi: "khao khát đi xa", phon: "/ˈwɒn.də.lʌst/" },
  { en: "linger", vi: "nán lại", phon: "/ˈlɪŋ.ɡər/" },
  { en: "resilient", vi: "kiên cường", phon: "/rɪˈzɪl.i.ənt/" },
];

export function PetDevice({
  className = "",
  lang = "vi",
}: {
  className?: string;
  lang?: Lang;
}) {
  const L = LABELS[lang];
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);
  // A short-lived override (eating/happy) set by feed(); when null, the displayed
  // animation is derived from hunger so we never setState in an effect.
  const [override, setOverride] = useState<Animation | null>(null);
  const [hunger, setHunger] = useState(72);
  const [wordIdx, setWordIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const word = WORDS[wordIdx % WORDS.length];

  const current: Animation =
    override ?? (hunger < 22 ? "sleeping" : hunger > 88 ? "happy" : "carry");

  useEffect(() => {
    let alive = true;
    fetch(SRC[current])
      .then((r) => r.json())
      .then((d) => alive && setAnimationData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [current]);

  useAnimationFrame((_, dt) => {
    setHunger((h) => Math.max(0, h - dt * 0.0006));
  });

  useEffect(() => {
    const reveal = setTimeout(() => setRevealed(true), 0);
    const id = setInterval(() => {
      setRevealed(false);
      setWordIdx((i) => i + 1);
      setTimeout(() => setRevealed(true), 1100);
    }, 4600);
    return () => {
      clearTimeout(reveal);
      clearInterval(id);
    };
  }, []);

  const feed = () => {
    setOverride("eating");
    setHunger((h) => Math.min(100, h + 18));
    setTimeout(() => setOverride("happy"), 1400);
    setTimeout(() => setOverride(null), 2800);
  };

  const hungerColor = useMemo(() => {
    if (hunger < 25) return "var(--color-accent-deep)";
    return "var(--color-accent)";
  }, [hunger]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-[300px] sm:w-[320px] md:ml-auto md:mr-0 md:w-[360px]"
      >
        {/* device chassis */}
        <div className="relative rounded-[28px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-5 lift-md">
          {/* status row */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
                {L.live}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              {L.level} 04
            </span>
          </div>

          {/* screen */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--color-tint)]">
            <PetWanderer animationData={animationData} hunger={hunger} />
          </div>

          {/* hunger meter */}
          <div className="mt-5 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
              {L.hunger}
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-hairline)]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: hungerColor }}
                animate={{ width: `${hunger}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 18 }}
              />
            </div>
            <span className="font-mono text-[11px] tabular-nums text-[var(--color-ink)]">
              {Math.round(hunger)}
            </span>
          </div>

          {/* word card */}
          <motion.div
            key={wordIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-bg)] px-4 py-3"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-display text-[20px] tracking-tight">{word.en}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                {L.due}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-[var(--color-ink-soft)]">
                {word.phon}
              </span>
              {revealed ? (
                <span className="text-[13px] text-[var(--color-ink)]">{word.vi}</span>
              ) : (
                <span className="font-mono text-[12px] text-[var(--color-ink-muted)]">
                  · · · · ·
                </span>
              )}
            </div>
          </motion.div>

          {/* controls */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <ControlButton onClick={() => setWordIdx((i) => i + 1)} label={L.skip} />
            <ControlButton onClick={feed} label={L.feed} primary />
            <ControlButton onClick={() => setRevealed((r) => !r)} label={L.reveal} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ControlButton({
  onClick,
  label,
  primary = false,
}: {
  onClick: () => void;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-[12px] font-medium transition-all active:scale-[0.97] ${
        primary
          ? "bg-[var(--color-accent)] text-[var(--color-surface)] hover:bg-[var(--color-accent-deep)]"
          : "border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-tint)]"
      }`}
    >
      {label}
    </button>
  );
}

function PetWanderer({
  animationData,
  hunger,
}: {
  animationData: Record<string, unknown> | null;
  hunger: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.5, y: 0.55 });
  const pos = useRef({ x: 0.5, y: 0.55 });
  const last = useRef(0);

  useAnimationFrame((t) => {
    if (t - last.current > 3000) {
      target.current = {
        x: 0.2 + Math.random() * 0.6,
        y: 0.4 + Math.random() * 0.35,
      };
      last.current = t;
    }
    pos.current.x += (target.current.x - pos.current.x) * 0.012;
    pos.current.y += (target.current.y - pos.current.y) * 0.012;
    const el = ref.current;
    if (el) {
      const facing = target.current.x < pos.current.x ? -1 : 1;
      el.style.transform = `translate(-50%, -50%) scaleX(${facing})`;
      el.style.left = `${pos.current.x * 100}%`;
      el.style.top = `${pos.current.y * 100}%`;
    }
  });

  return (
    <div
      ref={ref}
      className="absolute z-[5] h-[62%] w-[62%]"
      style={{ left: "50%", top: "55%", transform: "translate(-50%, -50%)" }}
    >
      {animationData ? (
        <Lottie
          animationData={animationData}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
          style={{ width: "100%", height: "100%", opacity: hunger < 15 ? 0.7 : 1 }}
        />
      ) : (
        <div className="h-full w-full" />
      )}
    </div>
  );
}
