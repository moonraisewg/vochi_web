"use client";

import { useSyncExternalStore } from "react";
import { PageShell } from "@/components/PageShell";
import { RELEASES } from "@/lib/releases";
import { apiUrl } from "@/lib/apiBase";
import { getStoredUtm } from "@/lib/utm";
import { motion } from "motion/react";
import posthog from "posthog-js";

type OS = "mac" | "windows" | "linux" | "unknown";
type Platform = "mac" | "windows";

function extractVersion(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/_(\d+\.\d+\.\d+)_/);
  return m ? m[1] : null;
}

function detectOS(): OS {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "unknown";
}

// Detect OS via useSyncExternalStore so the server snapshot is always "unknown"
// (matching the first client render → no hydration mismatch / card flip) while
// the client snapshot reflects the real navigator. No subscription is needed —
// the OS never changes after mount.
const noopSubscribe = () => () => {};
function useDetectedOS(): OS {
  return useSyncExternalStore<OS>(
    noopSubscribe,
    () => detectOS(),
    () => "unknown",
  );
}

const COPY = {
  vi: {
    title: "Một file. Một pet. Bắt đầu.",
    sub: "Bản beta. Miễn phí. Không cần tạo tài khoản.",
    macDmg: "macOS, DMG (Apple Silicon + Intel)",
    macAbout: "Cần macOS 12 trở lên, 28MB",
    winMsi: "Windows, MSI (x64)",
    winAbout: "Cần Windows 10 build 1809+, 31MB",
    linuxNote: "Linux đang nấu. Đăng ký đê, mình sẽ ới khi xong.",
    detected: "Máy bạn đang xài",
    forYouMac: "Cho máy Mac của bạn",
    forYouWin: "Cho máy Windows của bạn",
    forYou: "Cho máy bạn",
    comingSoon: "Sắp ra mắt",
  },
  en: {
    title: "One file. One creature. Begin.",
    sub: "Beta. Free. No sign-up required.",
    macDmg: "macOS, DMG (Apple Silicon + Intel)",
    macAbout: "Requires macOS 12 or later, 28MB",
    winMsi: "Windows, MSI (x64)",
    winAbout: "Requires Windows 10 build 1809 or later, 31MB",
    linuxNote: "A Linux build is in development. Leave your email to be notified when it ships.",
    detected: "Detected system",
    forYouMac: "Recommended for your Mac",
    forYouWin: "Recommended for your PC",
    forYou: "Recommended for you",
    comingSoon: "Coming soon",
  },
};

export default function DownloadPage() {
  const os = useDetectedOS();

  return (
    <PageShell>
      {(lang) => {
        const t = COPY[lang];
        return (
          <section className="relative px-6 py-20 md:py-28">
            <div className="mx-auto max-w-[1280px]">
              <h1 className="font-display text-[36px] leading-[1.05] tracking-tight md:text-[80px] md:leading-[1.02]">
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
                  platform="mac"
                  detectedOS={os}
                  primary={os === "mac"}
                  label={t.macDmg}
                  about={t.macAbout}
                  sha={RELEASES.mac.sha256}
                  href={RELEASES.mac.url}
                  forYouLabel={t.forYouMac}
                  comingSoonLabel={t.comingSoon}
                />
                <DownloadCard
                  platform="windows"
                  detectedOS={os}
                  primary={os === "windows"}
                  label={t.winMsi}
                  about={t.winAbout}
                  sha={RELEASES.windows.sha256}
                  href={RELEASES.windows.url}
                  forYouLabel={t.forYouWin}
                  comingSoonLabel={t.comingSoon}
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
  platform,
  detectedOS,
  primary,
  label,
  about,
  sha,
  href,
  forYouLabel,
  comingSoonLabel,
}: {
  platform: Platform;
  detectedOS: OS;
  primary: boolean;
  label: string;
  about: string;
  sha: string | null;
  href: string | null;
  forYouLabel: string;
  comingSoonLabel: string;
}) {
  const available = href != null;
  const version = extractVersion(href);

  const handleDownloadClick = () => {
    const utm = getStoredUtm(Date.now(), window.localStorage) ?? {};

    posthog.capture("app_download_click", {
      platform,
      version,
      artifact_url: href,
      detected_os: detectedOS,
      matched_detected_os: detectedOS === platform,
      recommended: primary,
      ...utm,
    });

    // Record a server-side download intent so the app can resolve UTM on first
    // launch (time + platform matching). Fire-and-forget — attribution must
    // never block or error the actual download.
    void fetch(apiUrl("/api/utm/download"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, utm }),
      keepalive: true,
    }).catch(() => {});
  };

  const badge =
    available && primary ? (
      <span className="absolute -top-3 left-6 rounded-full bg-[var(--color-ink)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-surface)]">
        {forYouLabel}
      </span>
    ) : !available ? (
      <span className="absolute -top-3 left-6 rounded-full bg-[var(--color-ink-muted)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-surface)]">
        {comingSoonLabel}
      </span>
    ) : null;

  const inner = (
    <>
      {badge}
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
        <span>{sha ?? "-"}</span>
      </div>
    </>
  );

  if (!available) {
    // No artifact yet — render an inert card so the CTA never lies.
    return (
      <div
        aria-disabled="true"
        className="group relative block cursor-not-allowed rounded-2xl border border-dashed border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-6 opacity-60"
      >
        {inner}
      </div>
    );
  }

  return (
    <motion.a
      href={href}
      onClick={handleDownloadClick}
      data-platform={platform}
      data-version={version ?? ""}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`group relative block rounded-2xl border p-6 transition-shadow ${
        primary
          ? "border-[var(--color-ink)] bg-[var(--color-surface)] lift-md"
          : "border-[var(--color-hairline-strong)] bg-[var(--color-surface)] lift hover:lift-md"
      }`}
    >
      {inner}
    </motion.a>
  );
}
