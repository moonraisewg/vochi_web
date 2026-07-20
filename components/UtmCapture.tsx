"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { getStoredUtm, readUtmFromSearch, storeUtmFirstTouch } from "@/lib/utm";

// Mounts once (in the root layout). On load: capture first-touch UTM from the
// URL, then fire a single `landing_visit` event with whatever UTM is now stored.
export function UtmCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const now = Date.now();
    storeUtmFirstTouch(readUtmFromSearch(window.location.search), now, window.localStorage);
    const utm = getStoredUtm(now, window.localStorage) ?? {};
    posthog.capture("landing_visit", { ...utm });
  }, []);
  return null;
}
