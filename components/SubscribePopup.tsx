"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import posthog from "posthog-js";
import { apiUrl } from "@/lib/apiBase";
import { getStoredUtm } from "@/lib/utm";
import { SUBSCRIBED_KEY, popupDelayMs, shouldShowPopup } from "@/lib/subscribePopup";
import type { Lang } from "./Nav";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const COPY = {
  vi: {
    title: "Quà tặng cho bạn 🎁",
    lead: "Nhận ngay 1,760 từ vựng phổ biến nhất (PDF, in được) cùng mã giảm 20% khi bạn nâng cấp Vô chi Pro.",
    emailLabel: "Email của bạn",
    consent: "Mình đồng ý nhận email từ Vô chi",
    privacy: "Chính sách riêng tư",
    submit: "Gửi quà cho tôi",
    submitting: "Đang gửi...",
    close: "Đóng",
    okTitle: "Quà đã lên đường 📬",
    okLead: "Kiểm tra hộp thư (cả mục Quảng cáo/Spam) để lấy tài liệu và mã giảm 20%.",
    okCta: "Tải app Vô chi",
    errGeneric: "Có lỗi xảy ra, thử lại giúp mình nhé.",
    errConsent: "Bạn cần tick đồng ý nhận email trước đã.",
    errCaptcha: "Chờ xác minh chống spam xong đã nhé.",
  },
  en: {
    title: "A gift for you 🎁",
    lead: "Drop your email and we'll send a curated vocabulary study pack (PDF, print-ready) plus 20% off Vô chi Pro.",
    emailLabel: "Your email",
    consent: "I agree to receive emails from Vô chi",
    privacy: "Privacy policy",
    submit: "Send my gift",
    submitting: "Sending...",
    close: "Close",
    okTitle: "Your gift is on its way 📬",
    okLead: "Check your inbox (and the Promotions/Spam tab) for the pack and your 20% discount code.",
    okCta: "Get the Vô chi app",
    errGeneric: "Something went wrong, please try again.",
    errConsent: "Please tick the consent box first.",
    errCaptcha: "Hang on for the anti-spam check to finish.",
  },
} as const;

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (token: string) => void },
      ) => void;
    };
  }
}

export function SubscribePopup({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState("");
  const [captchaReady, setCaptchaReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);
  const renderedRef = useRef(false);
  const t = COPY[lang];

  // Mở popup: chỉ khi chưa từng đăng ký thành công. Mobile chờ 5s để tránh án
  // phạt intrusive interstitial của Google.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(SUBSCRIBED_KEY);
    } catch {
      // Safari private mode có thể ném — coi như chưa đăng ký.
    }
    if (!shouldShowPopup(stored)) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const timer = window.setTimeout(() => {
      openerRef.current = document.activeElement;
      setOpen(true);
      posthog.capture("subscribe_popup_shown", { lang });
    }, popupDelayMs(isMobile));
    return () => window.clearTimeout(timer);
  }, [lang]);

  const close = useCallback(
    (reason: "dismissed" | "completed") => {
      setOpen(false);
      if (reason === "dismissed") posthog.capture("subscribe_popup_dismissed", { lang });
      // Trả focus về nơi người dùng đang đứng trước khi popup chiếm lấy.
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
    },
    [lang],
  );

  // Esc để đóng + focus trap: Tab không được phép đi ra ngoài dialog.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close("dismissed");
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Vẽ widget Turnstile. `captchaReady` là thứ bắt buộc phải có trong deps:
  // <Script> render cùng lượt với dialog, nên lần effect đầu tiên LUÔN chạy
  // trước khi script tải xong — không có cờ này thì effect thoát sớm rồi không
  // bao giờ chạy lại, widget không bao giờ hiện, và người dùng kẹt ở thông báo
  // "chờ xác minh chống spam" vĩnh viễn.
  useEffect(() => {
    if (!open || done || !SITE_KEY) return;
    // React StrictMode gọi effect hai lần ở dev; Turnstile ném lỗi nếu vẽ đè
    // lên cùng một container.
    if (renderedRef.current) return;
    const el = captchaRef.current;
    if (!el || !window.turnstile) return;
    renderedRef.current = true;
    window.turnstile.render(el, { sitekey: SITE_KEY, callback: setToken });
  }, [open, done, captchaReady]);

  // Đóng popup là container biến mất; mở lại phải vẽ widget mới.
  useEffect(() => {
    if (!open) renderedRef.current = false;
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError(t.errConsent);
      return;
    }
    if (SITE_KEY && !token) {
      setError(t.errCaptcha);
      return;
    }

    const source = getStoredUtm(Date.now(), window.localStorage)?.source ?? "home_popup";
    posthog.capture("subscribe_submitted", { lang, source });
    setBusy(true);
    try {
      const res = await fetch(apiUrl("/api/subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, source, website, turnstileToken: token || "dev" }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        setError(body?.error?.message ?? t.errGeneric);
        return;
      }
      try {
        window.localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {
        // Không ghi được cờ thì lần sau popup hiện lại — phiền, nhưng không hỏng.
      }
      posthog.capture("subscribe_ok", { lang, source });
      setDone(true);
    } catch {
      setError(t.errGeneric);
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          // Script tải xong mới có window.turnstile — cờ này là thứ đánh thức
          // effect vẽ widget ở trên.
          onLoad={() => setCaptchaReady(true)}
          onReady={() => setCaptchaReady(true)}
        />
      )}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscribe-title"
          className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
        >
          <button
            type="button"
            onClick={() => close(done ? "completed" : "dismissed")}
            aria-label={t.close}
            className="absolute right-4 top-4 text-2xl leading-none text-neutral-400 hover:text-neutral-700"
          >
            ×
          </button>

          {done ? (
            <div className="text-center">
              <h2 id="subscribe-title" className="text-2xl font-bold">
                {t.okTitle}
              </h2>
              <p className="mt-3 text-neutral-600">{t.okLead}</p>
              <a
                href="/download"
                className="mt-6 inline-flex items-center rounded-full bg-neutral-900 px-7 py-3.5 font-semibold text-white transition hover:bg-neutral-700"
              >
                {t.okCta}
              </a>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 id="subscribe-title" className="text-2xl font-bold">
                {t.title}
              </h2>
              <p className="mt-3 text-neutral-600">{t.lead}</p>

              {/* Không autoFocus: trên mobile nó bật bàn phím lên che kín popup. */}
              <label htmlFor="subscribe-email" className="mt-6 block text-sm font-medium">
                {t.emailLabel}
              </label>
              <input
                id="subscribe-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              />

              {/* Honeypot: ẩn khỏi mắt người nhưng vẫn nằm trong DOM để bot điền
                  vào. Không dùng display:none — vài bot bỏ qua trường ẩn kiểu đó. */}
              <div
                aria-hidden="true"
                className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
              >
                <label htmlFor="subscribe-website">Website</label>
                <input
                  id="subscribe-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <label className="mt-4 flex items-start gap-2.5 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  {t.consent}{" "}
                  <a href="/privacy" className="underline">
                    {t.privacy}
                  </a>
                </span>
              </label>

              {SITE_KEY && <div ref={captchaRef} className="mt-4" />}

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="mt-6 w-full rounded-full bg-neutral-900 px-7 py-3.5 font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
              >
                {busy ? t.submitting : t.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
