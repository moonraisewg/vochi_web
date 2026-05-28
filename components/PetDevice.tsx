"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useAnimationFrame } from "motion/react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Animation = "carry" | "eating" | "happy" | "sleeping" | "learning" | "hi";

const SRC: Record<Animation, string> = {
  carry: "/lottie/carry.json",
  eating: "/lottie/eating.json",
  happy: "/lottie/Hoanho.json",
  sleeping: "/lottie/sleeping.json",
  learning: "/lottie/Learning.json",
  hi: "/lottie/hi.json",
};

const WORDS = [
  { en: "ephemeral", vi: "phù du", phon: "/ɪˈfem.ər.əl/" },
  { en: "serendipity", vi: "duyên may", phon: "/ˌser.ənˈdɪp.ə.ti/" },
  { en: "nostalgia", vi: "hoài niệm", phon: "/nɒˈstæl.dʒə/" },
  { en: "petrichor", vi: "mùi đất sau mưa", phon: "/ˈpet.rɪ.kɔːr/" },
  { en: "wanderlust", vi: "khao khát đi xa", phon: "/ˈwɒn.də.lʌst/" },
  { en: "linger", vi: "nán lại", phon: "/ˈlɪŋ.ɡər/" },
  { en: "resilient", vi: "kiên cường", phon: "/rɪˈzɪl.i.ənt/" },
];

export function PetDevice({ className = "" }: { className?: string }) {
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);
  const [current, setCurrent] = useState<Animation>("carry");
  const [hunger, setHunger] = useState(72);
  const [wordIdx, setWordIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const word = WORDS[wordIdx % WORDS.length];

  // Load Lottie JSON
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

  // Hunger decay loop — drains slowly, restores on "feed"
  useAnimationFrame((_, dt) => {
    setHunger((h) => Math.max(0, h - dt * 0.0008));
  });

  // Word cycle
  useEffect(() => {
    const id = setInterval(() => {
      setRevealed(false);
      setWordIdx((i) => i + 1);
      setTimeout(() => setRevealed(true), 1200);
    }, 4200);
    setRevealed(true);
    return () => clearInterval(id);
  }, []);

  // Trigger animation based on hunger
  useEffect(() => {
    if (hunger < 22) setCurrent("sleeping");
    else if (hunger > 88) setCurrent("happy");
    else setCurrent("carry");
  }, [hunger]);

  const feed = () => {
    setCurrent("eating");
    setHunger((h) => Math.min(100, h + 18));
    setTimeout(() => setCurrent("happy"), 1400);
  };

  const hungerColor = useMemo(() => {
    if (hunger < 25) return "#FF3D7F";
    if (hunger < 55) return "#E2A100";
    return "#9DC209";
  }, [hunger]);

  return (
    <div className={`relative ${className}`}>
      {/* Tamagotchi device shell */}
      <motion.div
        initial={{ rotate: -3, scale: 0.95, opacity: 0 }}
        animate={{ rotate: -2, scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-[340px] md:w-[400px]"
      >
        {/* shadow */}
        <div className="absolute -inset-4 -z-10 translate-x-3 translate-y-4 rounded-[48%] bg-[var(--color-ink)] opacity-90 blur-[1px]" />

        {/* body */}
        <div
          className="relative rounded-[46%] border-[3px] border-[var(--color-ink)] p-7 md:p-9"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, #ffe9f1 0%, #ff8fb4 35%, #d8336a 78%, #8d1a44 100%)",
          }}
        >
          {/* highlight */}
          <div className="absolute left-10 top-6 h-10 w-16 rounded-full bg-white/60 blur-md" />

          {/* small lights row */}
          <div className="absolute right-8 top-8 flex gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-lcd)] shadow-[0_0_8px_#9DC209] blink" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-ink)]/80" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-ink)]/80" />
          </div>

          {/* screen */}
          <div className="relative mx-auto mt-2 aspect-square w-full overflow-hidden rounded-[28px] border-[3px] border-[var(--color-ink)] bg-[#cfe0a4] shadow-[inset_0_4px_0_rgba(0,0,0,0.18),inset_0_-3px_0_rgba(255,255,255,0.35)]">
            <div className="absolute inset-0 lcd-scanlines pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#dfeebd] via-[#c7d99a] to-[#a8be79]" />

            {/* HUD bar */}
            <div className="absolute left-2 right-2 top-2 z-10 flex items-center justify-between font-pixel text-[9px] uppercase tracking-wider text-[var(--color-lcd-shadow)]">
              <span>LVL 04</span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-12 border border-[var(--color-lcd-shadow)] bg-[var(--color-lcd-shadow)]/15">
                  <span
                    className="block h-full transition-[width] duration-300"
                    style={{
                      width: `${hunger}%`,
                      background: hungerColor,
                    }}
                  />
                </span>
                <span>{Math.round(hunger)}%</span>
              </span>
              <span className="font-mono">12:48</span>
            </div>

            {/* pet wander layer */}
            <PetWanderer animationData={animationData} hunger={hunger} />

            {/* word card */}
            <motion.div
              key={wordIdx}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute bottom-3 left-3 right-3 z-10 rounded-md border-[2px] border-[var(--color-lcd-shadow)] bg-[#eaf2cc] px-2 py-1.5 text-[var(--color-lcd-shadow)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[18px] italic leading-none">
                  {word.en}
                </span>
                <span className="font-pixel text-[8px] tracking-widest">DUE</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2 font-mono text-[10px]">
                <span>{word.phon}</span>
                {revealed ? (
                  <span className="font-body text-[11px] font-medium">{word.vi}</span>
                ) : (
                  <span className="font-pixel text-[9px]">??????</span>
                )}
              </div>
            </motion.div>
          </div>

          {/* buttons */}
          <div className="mt-6 flex items-center justify-between px-2">
            <DeviceButton color="bg-[var(--color-cream)]" onClick={() => setWordIdx((i) => i + 1)} label="A" />
            <DeviceButton color="bg-[var(--color-lcd)]" onClick={feed} label="B" />
            <DeviceButton color="bg-[var(--color-cream)]" onClick={() => setRevealed((r) => !r)} label="C" />
          </div>

          {/* brand chip */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="font-pixel text-[10px] tracking-widest text-white/90">
              VOCABAGOTCHI
            </span>
            <span className="font-pixel text-[10px] tracking-widest text-[var(--color-ink)]/70">
              ・v0.1
            </span>
          </div>
        </div>

        {/* lanyard */}
        <div className="absolute -top-7 left-1/2 h-7 w-3 -translate-x-1/2 rounded-t-md border-x-[2px] border-t-[2px] border-[var(--color-ink)] bg-[#b2244c]" />

        {/* sticker callout */}
        <motion.div
          initial={{ rotate: 18, scale: 0 }}
          animate={{ rotate: 12, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, type: "spring", bounce: 0.5 }}
          className="absolute -right-6 top-10 hidden rotate-12 md:block"
        >
          <div className="sticker-pop bg-[var(--color-lcd)] px-3 py-2 text-center">
            <div className="font-pixel text-[9px] uppercase tracking-widest">PET</div>
            <div className="font-display text-[14px] italic leading-none">v0.1 ♡</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ rotate: -22, scale: 0 }}
          animate={{ rotate: -14, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5, type: "spring", bounce: 0.5 }}
          className="absolute -left-8 bottom-16 hidden md:block"
        >
          <div className="sticker bg-[var(--color-stamp)] px-3 py-2 text-[var(--color-cream)]">
            <div className="font-pixel text-[9px] uppercase tracking-widest">Made in</div>
            <div className="font-display text-[14px] italic leading-none">Vietnam ★</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function DeviceButton({
  color,
  onClick,
  label,
}: {
  color: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative h-10 w-10 rounded-full border-[2px] border-[var(--color-ink)] ${color} shadow-[0_3px_0_var(--color-ink)] transition-transform active:translate-y-[2px] active:shadow-[0_1px_0_var(--color-ink)]`}
    >
      <span className="absolute inset-0 flex items-center justify-center font-pixel text-[10px] text-[var(--color-ink)]/80">
        {label}
      </span>
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
  const target = useRef({ x: 0.5, y: 0.6 });
  const pos = useRef({ x: 0.5, y: 0.6 });
  const last = useRef(0);

  useAnimationFrame((t) => {
    if (t - last.current > 2600) {
      target.current = {
        x: 0.15 + Math.random() * 0.7,
        y: 0.4 + Math.random() * 0.4,
      };
      last.current = t;
    }
    pos.current.x += (target.current.x - pos.current.x) * 0.015;
    pos.current.y += (target.current.y - pos.current.y) * 0.015;
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
      className="absolute z-[5] h-[58%] w-[58%]"
      style={{ left: "50%", top: "60%", transform: "translate(-50%, -50%)" }}
    >
      {animationData ? (
        <Lottie
          animationData={animationData}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
          style={{ width: "100%", height: "100%", opacity: hunger < 15 ? 0.6 : 1 }}
        />
      ) : (
        <div className="h-full w-full" />
      )}
    </div>
  );
}
