"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { motion } from "motion/react";

const PLANS = {
  pro_annual: { name: "Pro · Annual", amount: 990_000, suffix: "VND" },
  lifetime: { name: "Lifetime", amount: 1_990_000, suffix: "VND" },
  student: { name: "Student", amount: 490_000, suffix: "VND" },
};

function genMemo() {
  return `VOCA${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function CheckoutInner() {
  const params = useSearchParams();
  const plan = (params.get("plan") ?? "pro_annual") as keyof typeof PLANS;
  const planInfo = PLANS[plan] ?? PLANS.pro_annual;

  const [memo] = useState(genMemo);
  const [secondsLeft, setSecondsLeft] = useState(900);
  const [status, setStatus] = useState<"pending" | "confirming" | "paid">("pending");

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  // Fake QR — in production use Sepay QR generator API
  const qrSrc = useMemo(
    () =>
      `https://img.vietqr.io/image/MB-9999999-compact2.png?amount=${planInfo.amount}&addInfo=${memo}&accountName=VOCABAGOTCHI`,
    [memo, planInfo.amount],
  );

  return (
    <section className="relative px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 md:grid-cols-12">
        {/* LEFT — instructions */}
        <div className="md:col-span-7">
          <div className="font-pixel text-[11px] uppercase tracking-[0.3em] text-[var(--color-pop)]">
            ▸ Thanh toán · Sepay VietQR · 4 bước thôi
          </div>
          <h1 className="mt-3 font-display text-[44px] leading-[0.95] tracking-[-0.02em] md:text-[64px]">
            Quét cái QR. <span className="italic">Pet no liền.</span>
          </h1>

          <ol className="mt-10 space-y-5">
            {[
              { n: "01", t: "Mở app ngân hàng quen thuộc", d: "Vietcombank · Techcombank · MB · ACB · VPB · BIDV · TPBank — quét bằng app nào cũng OK" },
              { n: "02", t: "Quét cái QR bên cạnh", d: "Số tiền + nội dung tự nhảy vào — bạn khỏi gõ tay chi cho mỏi" },
              { n: "03", t: "Bấm chuyển khoản như thường lệ", d: "Sepay nhận thông báo từ ngân hàng trong khoảng 30 giây – 2 phút" },
              { n: "04", t: "Mở mail, license tới rồi đó", d: "Dán vô app Vocabagotchi → mở khoá ngay, không chờ" },
            ].map((step) => (
              <li key={step.n} className="flex items-start gap-5">
                <span className="font-display text-[44px] italic leading-none text-[var(--color-ink)]/20">
                  {step.n}
                </span>
                <div>
                  <div className="font-display text-[20px] tracking-[-0.01em]">{step.t}</div>
                  <div className="mt-1 text-[14.5px] leading-[1.5] text-[var(--color-ink-soft)]">{step.d}</div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl border-[2px] border-dashed border-[var(--color-pop)] bg-[var(--color-cream)] p-5">
            <div className="font-pixel text-[10px] uppercase tracking-widest text-[var(--color-pop)]">Lưu ý xíu</div>
            <div className="mt-2 text-[14px] leading-[1.55]">
              Nội dung chuyển khoản phải khớp <em>y chang</em> với <code className="rounded bg-[var(--color-paper-dark)] px-1.5 py-0.5 font-mono">{memo}</code>.
              Lỡ gõ sai 1 chữ là phải đối soát thủ công, hơi mệt — mail mình tại <a className="underline" href="mailto:hi@vocabagotchi.app">hi@vocabagotchi.app</a> mình xử nhanh.
            </div>
          </div>
        </div>

        {/* RIGHT — QR card */}
        <div className="md:col-span-5">
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-8 rounded-3xl border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] p-6 shadow-[8px_8px_0_var(--color-ink)]"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[22px] tracking-[-0.01em]">{planInfo.name}</h2>
              <span className="font-pixel text-[10px] uppercase tracking-widest">
                {status === "pending" ? "Đang đợi bạn quét" : status === "confirming" ? "Đang check..." : "Xong xuôi rồi"}
              </span>
            </div>
            <div className="mt-2 font-display text-[40px] italic leading-none">
              {planInfo.amount.toLocaleString("vi-VN")}đ
            </div>

            <div className="relative mt-6 overflow-hidden rounded-2xl border-[2px] border-[var(--color-ink)] bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt="VietQR"
                className="aspect-square w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
              <div className="pointer-events-none absolute inset-3 grid place-items-center">
                <div className="rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-cream)] px-3 py-1 font-pixel text-[10px] uppercase tracking-widest shadow-[2px_2px_0_var(--color-pop)]">
                  VOCA ☉
                </div>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-2 text-[12px]">
              <div className="col-span-3 rounded-lg border-[1.5px] border-dashed border-[var(--color-ink)]/30 px-3 py-2">
                <dt className="font-pixel text-[9px] uppercase tracking-widest text-[var(--color-ink)]/55">Ngân hàng</dt>
                <dd className="font-mono">MB Bank · 9999 9999 9999</dd>
              </div>
              <div className="col-span-3 rounded-lg border-[1.5px] border-dashed border-[var(--color-ink)]/30 px-3 py-2">
                <dt className="font-pixel text-[9px] uppercase tracking-widest text-[var(--color-ink)]/55">Nội dung</dt>
                <dd className="font-mono text-[14px] text-[var(--color-pop)]">{memo}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between rounded-lg bg-[var(--color-ink)] px-4 py-3 font-pixel text-[11px] uppercase tracking-widest text-[var(--color-cream)]">
              <span>QR còn dùng được</span>
              <span className="font-mono text-[16px] tabular-nums">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={() => {
                setStatus("confirming");
                setTimeout(() => setStatus("paid"), 1800);
              }}
              className="mt-4 w-full rounded-full border-[2px] border-[var(--color-ink)] bg-[var(--color-lcd)] px-5 py-3 font-pixel text-[11px] uppercase tracking-widest shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--color-ink)]"
            >
              Tui chuyển rồi nha
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <PageShell>
      {() => (
        <Suspense fallback={<div className="h-[60vh]" />}>
          <CheckoutInner />
        </Suspense>
      )}
    </PageShell>
  );
}
