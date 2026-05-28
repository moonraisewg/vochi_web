"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { motion } from "motion/react";

type OS = "mac" | "windows" | "linux" | "unknown";

function detectOS(): OS {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "unknown";
}

const COPY = {
  vi: {
    eyebrow: "Tải về liền",
    title: "1 file. 1 pet. Vô cày.",
    sub: "Bản beta. Miễn phí. Khỏi tạo tài khoản gì sất.",
    macDmg: "macOS · DMG (Apple Silicon + Intel)",
    macAbout: "cần macOS 12 Monterey trở lên · 28MB · nhẹ tênh",
    winMsi: "Windows · MSI (x64)",
    winAbout: "cần Windows 10 build 1809+ · 31MB · nhẹ tênh",
    linuxNote: "Linux đang nấu trong nồi. Để mail mình ới khi xong →",
    checksum: "SHA-256 ↗",
    detected: "Máy bạn đang xài",
  },
  en: {
    eyebrow: "Get it",
    title: "1 file. 1 pet. Go.",
    sub: "Beta. Free. No sign-up nonsense.",
    macDmg: "macOS · DMG (Apple Silicon + Intel)",
    macAbout: "needs macOS 12 Monterey+ · 28MB · feather-light",
    winMsi: "Windows · MSI (x64)",
    winAbout: "needs Windows 10 build 1809+ · 31MB · feather-light",
    linuxNote: "Linux is in the oven. Drop your email and I'll ping you →",
    checksum: "SHA-256 ↗",
    detected: "Detected your machine",
  },
};

export default function DownloadPage() {
  const [os, setOs] = useState<OS>("unknown");
  useEffect(() => setOs(detectOS()), []);

  return (
    <PageShell>
      {(lang) => {
        const t = COPY[lang];
        return (
          <section className="relative px-6 py-20 md:py-28">
            <div className="mx-auto max-w-[1000px]">
              <div className="font-pixel text-[11px] uppercase tracking-[0.3em] text-[var(--color-pop)]">
                ▸ {t.eyebrow}
              </div>
              <h1 className="mt-3 font-display text-[48px] leading-[0.95] tracking-[-0.02em] md:text-[88px]">
                {t.title}
              </h1>
              <p className="mt-5 max-w-[600px] text-[17px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[19px]">
                {t.sub}
              </p>

              <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink)]/55">
                {t.detected}:{" "}
                <span className="text-[var(--color-pop)]">
                  {os === "mac" ? "macOS" : os === "windows" ? "Windows" : os === "linux" ? "Linux" : "—"}
                </span>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                <DownloadCard
                  primary={os === "mac"}
                  label={t.macDmg}
                  about={t.macAbout}
                  sha="a1f3...c9b2"
                  href="#"
                />
                <DownloadCard
                  primary={os === "windows"}
                  label={t.winMsi}
                  about={t.winAbout}
                  sha="71ad...c5ee"
                  href="#"
                />
              </div>

              <div className="mt-10 rounded-2xl border-[2px] border-dashed border-[var(--color-ink)]/40 p-5 font-mono text-[13px] text-[var(--color-ink)]/65">
                {t.linuxNote}
              </div>
            </div>
          </section>
        );
      }}
    </PageShell>
  );
}

function DownloadCard({
  primary,
  label,
  about,
  sha,
  href,
}: {
  primary: boolean;
  label: string;
  about: string;
  sha: string;
  href: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -3 }}
      className={`group relative block rounded-3xl border-[2px] border-[var(--color-ink)] p-6 transition-shadow ${
        primary
          ? "bg-[var(--color-ink)] text-[var(--color-cream)] shadow-[6px_6px_0_var(--color-pop)] hover:shadow-[8px_8px_0_var(--color-pop)]"
          : "bg-[var(--color-cream)] shadow-[5px_5px_0_var(--color-ink)] hover:shadow-[7px_7px_0_var(--color-ink)]"
      }`}
    >
      {primary && (
        <span className="absolute -top-3 left-6 rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-lcd)] px-3 py-1 font-pixel text-[10px] uppercase tracking-widest text-[var(--color-ink)]">
          Hợp máy bạn nè
        </span>
      )}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-[22px] italic leading-tight">{label}</div>
          <div className={`mt-2 font-mono text-[12px] uppercase tracking-wider ${primary ? "text-[var(--color-cream)]/70" : "text-[var(--color-ink)]/55"}`}>
            {about}
          </div>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-full border-[2px] border-current font-pixel text-lg transition-transform group-hover:translate-y-1">
          ▼
        </span>
      </div>
      <div className={`mt-6 flex items-center justify-between border-t-[1.5px] border-dashed pt-4 font-mono text-[11px] ${primary ? "border-[var(--color-cream)]/30 text-[var(--color-cream)]/60" : "border-[var(--color-ink)]/30 text-[var(--color-ink)]/60"}`}>
        <span>SHA-256</span>
        <span>{sha}</span>
      </div>
    </motion.a>
  );
}
