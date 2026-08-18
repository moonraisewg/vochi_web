"use client";

import { useState, useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { getStoredRef } from "@/lib/referral";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    label: "Bạn được mời",
    lead: "Nhập mã này khi tạo tài khoản trong app để nhận thêm ngày Pro miễn phí.",
    copy: "Copy mã",
    copied: "Đã copy",
  },
  en: {
    label: "You were invited",
    lead: "Enter this code when you create your account in the app to get extra free Pro days.",
    copy: "Copy code",
    copied: "Copied",
  },
} as const;

// Đọc localStorage qua useSyncExternalStore, cùng khuôn với useDetectedOS trong
// app/download/page.tsx: snapshot phía server luôn là null (khớp lần render đầu
// ở client → không lệch hydration), snapshot phía client đọc giá trị thật. Không
// cần subscribe vì mã mời không đổi giữa chừng trong một phiên.
const noopSubscribe = () => () => {};

function useStoredRef(): string | null {
  return useSyncExternalStore<string | null>(
    noopSubscribe,
    () => {
      try {
        return getStoredRef(Date.now(), window.localStorage);
      } catch {
        // Safari private mode — coi như không có mã.
        return null;
      }
    },
    () => null,
  );
}

/** Hiện mã mời đã bắt được từ `?ref=` trên link chia sẻ. Không có mã thì không
 *  render gì — tuyệt đại đa số khách vào thẳng sẽ không thấy khối này. */
export function ReferralCodeNotice({ lang }: { lang: Lang }) {
  const code = useStoredRef();
  const [copied, setCopied] = useState(false);
  const t = COPY[lang];

  if (!code) return null;

  // Arrow const chứ không phải function declaration: khai báo hàm bị hoist nên
  // TypeScript không giữ được phép thu hẹp kiểu từ `if (!code) return null`.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      posthog.capture("referral_code_copied", { code });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Trình duyệt chặn clipboard — mã vẫn hiện to trên màn hình để gõ tay.
    }
  };

  return (
    <div className="mt-8 inline-flex flex-col gap-3 rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-tint)] p-5 sm:flex-row sm:items-center sm:gap-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
          {t.label}
        </div>
        <div className="mt-1.5 font-display text-[28px] tracking-[0.18em] text-[var(--color-accent-deep)]">
          {code}
        </div>
      </div>
      <div className="max-w-[280px]">
        <p className="text-[13.5px] leading-[1.5] text-[var(--color-ink-soft)]">{t.lead}</p>
        <button
          type="button"
          onClick={copy}
          className="mt-2.5 rounded-full border border-[var(--color-hairline-strong)] bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-[var(--color-accent)]"
        >
          {copied ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
}
