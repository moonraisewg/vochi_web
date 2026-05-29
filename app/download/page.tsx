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
    title: "Một file. Một pet. Bắt đầu.",
    sub: "Bản beta. Miễn phí. Không cần tạo tài khoản.",
    macDmg: "macOS, DMG (Apple Silicon + Intel)",
    macAbout: "Cần macOS 12 trở lên, 28MB",
    winMsi: "Windows, MSI (x64)",
    winAbout: "Cần Windows 10 build 1809+, 31MB",
    linuxNote: "Linux đang nấu. Đăng ký mình ới khi xong.",
    detected: "Máy bạn đang xài",
    forYou: "Cho máy bạn",
  },
  en: {
    title: "One file. One pet. Go.",
    sub: "Beta. Free. No sign-up.",
    macDmg: "macOS, DMG (Apple Silicon + Intel)",
    macAbout: "Requires macOS 12+, 28MB",
    winMsi: "Windows, MSI (x64)",
    winAbout: "Requires Windows 10 build 1809+, 31MB",
    linuxNote: "Linux is in the oven. Drop your email and I'll ping you.",
    detected: "Detected system",
    forYou: "For your Mac",
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
              <h1 className="font-display text-[48px] leading-[1.02] tracking-tight md:text-[80px]">
                {t.title}
              </h1>
              <p className="mt-5 max-w-[560px] text-[17px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[19px]">
                {t.sub}
              </p>

              <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                {t.detected}:{" "}
                <span className="text-[var(--color-accent-deep)]">
                  {os === "mac"
                    ? "macOS"
                    : os === "windows"
                      ? "Windows"
                      : os === "linux"
                        ? "Linux"
                        : "-"}
                </span>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
                <DownloadCard
                  primary={os === "mac"}
                  label={t.macDmg}
                  about={t.macAbout}
                  sha="a1f3...c9b2"
                  href="#"
                  forYouLabel={t.forYou}
                />
                <DownloadCard
                  primary={os === "windows"}
                  label={t.winMsi}
                  about={t.winAbout}
                  sha="71ad...c5ee"
                  href="#"
                  forYouLabel={t.forYou}
                />
              </div>

              <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-hairline-strong)] bg-[var(--color-tint)] p-6 text-[14px] text-[var(--color-ink-soft)]">
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
  forYouLabel,
}: {
  primary: boolean;
  label: string;
  about: string;
  sha: string;
  href: string;
  forYouLabel: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`group relative block rounded-2xl border p-6 transition-shadow ${
        primary
          ? "border-[var(--color-ink)] bg-[var(--color-surface)] lift-md"
          : "border-[var(--color-hairline-strong)] bg-[var(--color-surface)] lift hover:lift-md"
      }`}
    >
      {primary && (
        <span className="absolute -top-3 left-6 rounded-full bg-[var(--color-ink)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-surface)]">
          {forYouLabel}
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display text-[20px] leading-tight tracking-tight">
            {label}
          </div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
            {about}
          </div>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-hairline-strong)] text-[16px] text-[var(--color-ink)] transition-transform group-hover:translate-y-0.5">
          ↓
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--color-hairline)] pt-4 font-mono text-[11px] text-[var(--color-ink-muted)]">
        <span>SHA-256</span>
        <span>{sha}</span>
      </div>
    </motion.a>
  );
}
