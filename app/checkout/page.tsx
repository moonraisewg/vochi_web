"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { motion } from "motion/react";

const PLANS = {
  pro_annual: { name: "Pro, 12 tháng", amount: 990_000 },
  lifetime: { name: "Lifetime", amount: 1_990_000 },
  student: { name: "Student", amount: 490_000 },
};

function genMemo() {
  return `VOCHI${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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

  const qrSrc = useMemo(
    () =>
      `https://img.vietqr.io/image/MB-9999999-compact2.png?amount=${planInfo.amount}&addInfo=${memo}&accountName=VOCHI`,
    [memo, planInfo.amount],
  );

  return (
    <section className="relative px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 md:grid-cols-12">
        {/* left: steps */}
        <div className="md:col-span-7">
          <div className="micro mb-4">Thanh toán, Sepay VietQR</div>
          <h1 className="font-display text-[44px] leading-[1.02] tracking-tight md:text-[64px]">
            Quét QR. <span className="italic text-[var(--color-ink-soft)]">Pet no liền.</span>
          </h1>

          <ol className="mt-12 space-y-7">
            {[
              {
                n: "01",
                t: "Mở app ngân hàng",
                d: "Vietcombank, Techcombank, MB, ACB, VPB, BIDV, TPBank, app nào cũng quét được.",
              },
              {
                n: "02",
                t: "Quét QR bên cạnh",
                d: "Số tiền và nội dung tự nhảy vào. Khỏi gõ tay.",
              },
              {
                n: "03",
                t: "Bấm chuyển khoản",
                d: "Sepay nhận thông báo từ ngân hàng trong khoảng 30 giây tới 2 phút.",
              },
              {
                n: "04",
                t: "Mở mail, license tới rồi",
                d: "Dán vào app Vô chi, mở khoá ngay.",
              },
            ].map((step) => (
              <li key={step.n} className="flex items-start gap-5">
                <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)] pt-1">
                  {step.n}
                </span>
                <div>
                  <div className="font-display text-[20px] leading-tight tracking-tight">
                    {step.t}
                  </div>
                  <div className="mt-1.5 text-[14.5px] leading-[1.55] text-[var(--color-ink-soft)]">
                    {step.d}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-tint)] p-5">
            <div className="micro" style={{ color: "var(--color-accent-deep)" }}>
              Lưu ý
            </div>
            <div className="mt-2 text-[14px] leading-[1.55] text-[var(--color-ink-soft)]">
              Nội dung chuyển khoản phải khớp y chang với{" "}
              <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 font-mono text-[var(--color-ink)]">
                {memo}
              </code>
              . Sai 1 chữ phải đối soát thủ công, mất công. Mail{" "}
              <a className="underline decoration-[var(--color-hairline-strong)] decoration-[1.5px] underline-offset-[4px]" href="mailto:hi@vochi.app">
                hi@vochi.app
              </a>{" "}
              mình xử nhanh.
            </div>
          </div>
        </div>

        {/* right: QR card */}
        <div className="md:col-span-5">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-24 rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-6 lift-md"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[20px] tracking-tight">{planInfo.name}</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                {status === "pending"
                  ? "Đang đợi"
                  : status === "confirming"
                    ? "Đang xác nhận"
                    : "Đã thanh toán"}
              </span>
            </div>
            <div className="mt-3 font-display text-[36px] leading-none tracking-tight">
              {planInfo.amount.toLocaleString("vi-VN")}đ
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt="VietQR"
                className="aspect-square w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
            </div>

            <dl className="mt-5 space-y-2 text-[12px]">
              <div className="rounded-lg border border-[var(--color-hairline)] px-3 py-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  Ngân hàng
                </dt>
                <dd className="font-mono text-[13px] text-[var(--color-ink)]">
                  MB Bank, 9999 9999 9999
                </dd>
              </div>
              <div className="rounded-lg border border-[var(--color-hairline)] px-3 py-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  Nội dung
                </dt>
                <dd className="font-mono text-[14px] text-[var(--color-accent-deep)]">
                  {memo}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between rounded-lg bg-[var(--color-ink)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-surface)]">
              <span>QR còn dùng được</span>
              <span className="text-[14px] tabular-nums">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={() => {
                setStatus("confirming");
                setTimeout(() => setStatus("paid"), 1800);
              }}
              className="mt-4 w-full rounded-full bg-[var(--color-accent)] px-5 py-3 text-[13px] font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-accent-deep)]"
            >
              Tôi chuyển khoản rồi
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
