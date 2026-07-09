"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/apiBase";

type OrderStatus = {
  invoiceNumber: string;
  plan: string;
  status: string;
  paidAt: string | null;
  expiresAt: string;
  licenseIssued: boolean;
};

const TERMINAL_STATUSES = new Set(["paid", "expired", "failed", "cancelled"]);

function isTerminalOrder(order: OrderStatus): boolean {
  return order.licenseIssued || TERMINAL_STATUSES.has(order.status);
}

export function CheckoutResult({
  invoice,
  tone,
}: {
  invoice: string | null;
  tone: "success" | "error" | "cancel";
}) {
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!invoice) return;
    let cancelled = false;
    let id: number | undefined;
    const stop = () => {
      if (id !== undefined) {
        window.clearInterval(id);
        id = undefined;
      }
    };
    async function load() {
      try {
        const res = await fetch(apiUrl(`/api/orders/${encodeURIComponent(invoice!)}`));
        const data = (await res.json()) as OrderStatus & { error?: { message?: string } };
        if (!res.ok) throw new Error(data?.error?.message ?? "Order not found");
        if (cancelled) return;
        setOrder(data);
        // Stop polling once the order reaches a terminal state — no point hitting
        // the API every 5s forever after the license is issued or the order died.
        if (isTerminalOrder(data)) stop();
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Order not found");
      }
    }
    void load();
    id = window.setInterval(load, 5000);
    return () => {
      cancelled = true;
      stop();
    };
  }, [invoice]);

  const title =
    tone === "success"
      ? "Đang xác nhận thanh toán."
      : tone === "cancel"
        ? "Đơn đã được hủy ở cổng thanh toán."
        : "Thanh toán chưa hoàn tất.";

  return (
    <section className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[760px]">
        <div className="micro mb-4">Checkout</div>
        <h1 className="font-display text-[44px] leading-[1.02] tracking-tight md:text-[72px]">
          {title}
        </h1>
        <p className="mt-5 text-[16px] leading-[1.6] text-[var(--color-ink-soft)]">
          Ngân hàng và cổng thanh toán cần một chút thời gian để xác nhận chuyển khoản. Trang này tự cập nhật trạng thái khi đơn được xử lý.
        </p>

        <div className="mt-10 rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-6 lift">
          {!invoice && <p className="text-[14px] text-[var(--color-ink-soft)]">Thiếu mã đơn hàng.</p>}
          {error && <p className="text-[14px] text-red-700">{error}</p>}
          {invoice && !order && !error && (
            <p className="text-[14px] text-[var(--color-ink-soft)]">Đang tải trạng thái đơn...</p>
          )}
          {order && (
            <dl className="grid grid-cols-1 gap-4 text-[14px] md:grid-cols-2">
              <div>
                <dt className="micro mb-1">Invoice</dt>
                <dd className="font-mono">{order.invoiceNumber}</dd>
              </div>
              <div>
                <dt className="micro mb-1">Trạng thái</dt>
                <dd>{order.status}</dd>
              </div>
              <div>
                <dt className="micro mb-1">License</dt>
                <dd>{order.licenseIssued ? "Đã phát hành, kiểm tra email" : "Chưa phát hành"}</dd>
              </div>
              <div>
                <dt className="micro mb-1">Thanh toán lúc</dt>
                <dd>{order.paidAt ? new Date(order.paidAt).toLocaleString("vi-VN") : "-"}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="rounded-full border border-[var(--color-hairline-strong)] bg-white px-5 py-3 text-[14px] font-medium"
          >
            Quay lại giá
          </Link>
          <a
            href="https://www.facebook.com/vochi.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-[14px] font-medium text-white"
          >
            Cần hỗ trợ
          </a>
        </div>
      </div>
    </section>
  );
}
