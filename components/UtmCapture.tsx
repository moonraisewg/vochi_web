"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { getStoredUtm, readUtmFromSearch, storeUtmFirstTouch } from "@/lib/utm";
import { readRefFromSearch, storeRefFirstTouch } from "@/lib/referral";

// Mounts once (in the root layout). On load: capture first-touch UTM and any
// referral code from the URL, then fire a single `landing_visit` event with
// whatever UTM is now stored.
//
// Referral capture lives here rather than on the homepage because a share link
// can point anywhere — /pricing?ref=X, /download?ref=X — and a code dropped on
// the floor is a referrer who never gets credited.
export function UtmCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const now = Date.now();
    storeUtmFirstTouch(readUtmFromSearch(window.location.search), now, window.localStorage);
    try {
      storeRefFirstTouch(readRefFromSearch(window.location.search), now, window.localStorage);
    } catch {
      // Safari private mode có thể ném khi ghi localStorage — mất mã mời thì
      // phiền, nhưng không được phép làm hỏng lượt truy cập.
    }
    const utm = getStoredUtm(now, window.localStorage) ?? {};
    posthog.capture("landing_visit", { ...utm });
  }, []);
  return null;
}
