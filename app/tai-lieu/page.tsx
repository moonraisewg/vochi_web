"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import posthog from "posthog-js";

// File PDF host trên R2, không để trong public/: public/ đi thẳng vào git và vào
// mỗi lần deploy Vercel, còn R2 thì đổi file không cần deploy lại.
const PDF_URL = process.env.NEXT_PUBLIC_LEAD_MAGNET_URL ?? "";

const COPY = {
  vi: {
    title: "Tài liệu của bạn đã sẵn sàng",
    lead: "Bộ tài liệu học từ vựng do Vô chi biên soạn. Tải về, in ra, hoặc đọc trên máy — tuỳ bạn.",
    download: "Tải tài liệu (PDF)",
    appTitle: "Học đều hơn với Vô chi",
    appLead:
      "Một con pet nhỏ sống trên màn hình, đói thì đòi bạn trả lời flashcard. Học vì thương pet, không vì kỷ luật.",
    appCta: "Tải app Vô chi",
    unsub: "Bạn đã huỷ đăng ký nhận email. Chúng tôi sẽ không gửi thêm gì nữa.",
    missing: "Link tài liệu chưa được cấu hình. Nhắn fanpage Vô chi để được gửi tay nhé.",
  },
  en: {
    title: "Your study pack is ready",
    lead: "A vocabulary study pack put together by Vô chi. Download it, print it, or read it on screen.",
    download: "Download the pack (PDF)",
    appTitle: "Study more consistently with Vô chi",
    appLead:
      "A little pet living on your screen that gets hungry and asks you to answer flashcards. Study out of affection, not discipline.",
    appCta: "Get the Vô chi app",
    unsub: "You've been unsubscribed. We won't email you again.",
    missing:
      "The download link isn't configured yet. Message the Vô chi page and we'll send it over.",
  },
} as const;

function TaiLieuInner() {
  const params = useSearchParams();
  const unsubscribed = params.get("unsub") === "1";

  return (
    <PageShell>
      {(lang) => {
        const t = COPY[lang];
        return (
          <section className="mx-auto max-w-2xl px-6 py-24">
            {unsubscribed && (
              <p
                role="status"
                className="mb-8 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
              >
                {t.unsub}
              </p>
            )}

            <h1 className="text-4xl font-bold tracking-tight">{t.title}</h1>
            <p className="mt-4 text-lg text-neutral-600">{t.lead}</p>

            {PDF_URL ? (
              <a
                href={PDF_URL}
                onClick={() => posthog.capture("lead_magnet_download", { lang })}
                className="mt-8 inline-flex items-center rounded-full bg-neutral-900 px-7 py-3.5 font-semibold text-white transition hover:bg-neutral-700"
              >
                {t.download}
              </a>
            ) : (
              // Thà nói thật là chưa cấu hình còn hơn hiện một nút bấm vào không ra gì.
              <p className="mt-8 text-neutral-500">{t.missing}</p>
            )}

            <hr className="my-14 border-neutral-200" />

            <h2 className="text-2xl font-bold tracking-tight">{t.appTitle}</h2>
            <p className="mt-3 text-neutral-600">{t.appLead}</p>
            <a
              href="/download"
              className="mt-6 inline-flex items-center rounded-full border border-neutral-900 px-7 py-3.5 font-semibold text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
            >
              {t.appCta}
            </a>
          </section>
        );
      }}
    </PageShell>
  );
}

// useSearchParams cần Suspense boundary trong App Router — cùng khuôn với
// app/checkout/page.tsx.
export default function TaiLieuPage() {
  return (
    <Suspense fallback={null}>
      <TaiLieuInner />
    </Suspense>
  );
}
