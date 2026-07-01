"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";

// Plans shown in the checkout selector. `student` is intentionally omitted from
const PLANS = {
  one_month: { name: "1 tháng", amount: "59.000đ", note: "2 thiết bị, 1 tháng" },
  three_months: { name: "3 tháng", amount: "129.000đ", note: "2 thiết bị, 3 tháng" },
  lifetime: { name: "Lifetime", amount: "599.000đ", note: "5 thiết bị, trọn đời" },
  student: { name: "Student Lifetime", amount: "249.000đ", note: "5 thiết bị, trọn đời (cần email .edu.vn)" },
  one_month_student: { name: "1 tháng (Sinh viên)", amount: "29.000đ", note: "2 thiết bị, 1 tháng (cần email .edu.vn)" },
  three_months_student: { name: "3 tháng (Sinh viên)", amount: "65.000đ", note: "2 thiết bị, 3 tháng (cần email .edu.vn)" },
  trial_7days: { name: "Dùng thử 7 ngày", amount: "Liên hệ", note: "1 thiết bị, 7 ngày" },
  hsk_advanced: { name: "HSK nâng cao", amount: "50.000đ", note: "Mở HSK 4·5·6 · 1 thiết bị, trọn đời" },
} as const;

type PlanId = keyof typeof PLANS;
const DEFAULT_PLAN: PlanId = "three_months";
type CheckoutResponse = {
  invoiceNumber: string;
  checkoutUrl: string;
  fields: Record<string, string | number>;
};

function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function CheckoutInner() {
  const params = useSearchParams();
  const initialPlan = (params.get("plan") ?? DEFAULT_PLAN) as PlanId;
  const [plan, setPlan] = useState<PlanId>(initialPlan in PLANS ? initialPlan : DEFAULT_PLAN);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<CheckoutResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // `checkout` is only ever set with a validated absolute URL (see submit()),
  // so the effect can safely auto-submit the hidden form to SePay.
  useEffect(() => {
    if (checkout) formRef.current?.submit();
  }, [checkout]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message ?? "Không tạo được đơn hàng");
      // Guard the SePay redirect URL before committing — otherwise the button
      // would stay disabled forever with no feedback if the gateway returns junk.
      if (!isValidHttpUrl(data?.checkoutUrl)) {
        throw new Error("Cổng thanh toán trả về địa chỉ không hợp lệ. Vui lòng thử lại.");
      }
      setCheckout(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tạo được đơn hàng");
      setLoading(false);
    }
  }

  const selected = PLANS[plan];

  return (
    <section className="relative px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="micro mb-4">Thanh toán</div>
          <h1 className="font-display text-[34px] leading-[1.05] tracking-tight md:text-[64px] md:leading-[1.02]">
            Bốn bước. <span className="italic text-[var(--color-ink-soft)]">License vô mail.</span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[16px] leading-[1.6] text-[var(--color-ink-soft)]">
            Chọn gói, để lại email, quét QR chuyển khoản như bình thường. License sẽ tự gửi vào email khi giao dịch xong.
          </p>

          <ol className="mt-12 space-y-7">
            {[
              ["01", "Chọn gói và nhập email", "Email này sẽ nhận license, hãy dùng email bạn đang dùng thường xuyên."],
              ["02", "Quét mã QR", "Mở app ngân hàng, quét mã, kiểm tra số tiền và nội dung chuyển khoản đã có sẵn."],
              ["03", "Xác nhận chuyển khoản", "Bấm chuyển trong app ngân hàng. Thường mất 30 giây đến 2 phút để xác nhận."],
              ["04", "Mở email", "License tự gửi vào hộp thư. Mở app, dán license, dùng ngay."],
            ].map(([n, title, desc]) => (
              <li key={n} className="flex items-start gap-5">
                <span className="pt-1 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                  {n}
                </span>
                <div>
                  <div className="font-display text-[20px] leading-tight tracking-tight">{title}</div>
                  <div className="mt-1.5 text-[14.5px] leading-[1.55] text-[var(--color-ink-soft)]">
                    {desc}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="md:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-6 lift-md">
            <form onSubmit={submit}>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  Gói
                </span>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as PlanId)}
                  className="mt-2 w-full rounded-xl border border-[var(--color-hairline-strong)] bg-white px-4 py-3 text-[14px] outline-none focus:border-[var(--color-accent)]"
                >
                  {Object.entries(PLANS).map(([id, p]) => (
                    <option key={id} value={id}>
                      {p.name} - {p.amount}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-6 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-tint)] p-4">
                <div className="font-display text-[22px] tracking-tight">{selected.name}</div>
                <div className="mt-2 font-display text-[36px] leading-none tracking-tight">
                  {selected.amount}
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  {selected.note}
                </div>
              </div>

              <label className="mt-6 block">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  Email nhận license
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-[var(--color-hairline-strong)] bg-white px-4 py-3 text-[14px] outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-full bg-[var(--color-ink)] px-5 py-3 text-[14px] font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-accent-deep)] disabled:cursor-wait disabled:opacity-70"
              >
                {loading ? "Đang tạo đơn..." : "Sang trang thanh toán"}
              </button>
            </form>

            {checkout && (
              <form ref={formRef} method="POST" action={checkout.checkoutUrl} className="hidden">
                {Object.entries(checkout.fields).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={String(value)} />
                ))}
              </form>
            )}
          </div>
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
