"use client";

import { useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { RELEASES } from "@/lib/releases";
import { apiUrl } from "@/lib/apiBase";
import { getStoredUtm } from "@/lib/utm";

export const APP_STORE_URL =
  "https://apps.apple.com/us/app/h%E1%BB%8Dc-ti%E1%BA%BFng-anh-v%E1%BB%9Bi-zochi/id6776330651";
export const DESKTOP_FALLBACK_URL = "/download";

export type DownloadPlatform = "mac" | "windows" | "ios" | "android" | "unknown";

type Target = {
  href: string;
  platform: DownloadPlatform;
  external: boolean;
};

function detectTarget(): Target {
  if (typeof navigator === "undefined") {
    return { href: DESKTOP_FALLBACK_URL, platform: "unknown", external: false };
  }
  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();

  if (/iPad|iPhone|iPod/i.test(ua)) {
    return { href: APP_STORE_URL, platform: "ios", external: true };
  }
  if (/Android/i.test(ua)) {
    return { href: APP_STORE_URL, platform: "android", external: true };
  }
  if (uaLower.includes("mac") && RELEASES.mac.url) {
    return { href: RELEASES.mac.url, platform: "mac", external: true };
  }
  if (uaLower.includes("win") && RELEASES.windows.url) {
    return { href: RELEASES.windows.url, platform: "windows", external: true };
  }
  return { href: DESKTOP_FALLBACK_URL, platform: "unknown", external: false };
}

const noopSubscribe = () => () => {};
const SERVER_SNAPSHOT: Target = {
  href: DESKTOP_FALLBACK_URL,
  platform: "unknown",
  external: false,
};

export function useDownloadTarget(): Target {
  return useSyncExternalStore<Target>(
    noopSubscribe,
    detectTarget,
    () => SERVER_SNAPSHOT,
  );
}

function extractVersion(url: string): string | null {
  const m = url.match(/_(\d+\.\d+\.\d+)_/);
  return m ? m[1] : null;
}

// Fires the same tracking as /download page for parity. No-op on unknown
// platforms — /download page owns tracking when user lands there manually.
export function trackDownloadClick(target: Target, source: string): void {
  if (target.platform === "unknown") return;

  const utm =
    typeof window !== "undefined"
      ? (getStoredUtm(Date.now(), window.localStorage) ?? {})
      : {};

  posthog.capture("app_download_click", {
    platform: target.platform,
    version: target.external ? extractVersion(target.href) : null,
    artifact_url: target.external ? target.href : null,
    detected_os: target.platform,
    matched_detected_os: true,
    recommended: true,
    source,
    ...utm,
  });

  // Desktop artifacts only — mobile store clicks don't need the server-side
  // download-intent record (no app-launch UTM matching on install).
  if (target.platform === "mac" || target.platform === "windows") {
    void fetch(apiUrl("/api/utm/download"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: target.platform, utm }),
      keepalive: true,
    }).catch(() => {});
  }
}
