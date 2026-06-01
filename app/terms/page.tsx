"use client";

import { PageShell } from "@/components/PageShell";

export default function TermsPage() {
  return (
    <PageShell>
      {() => (
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[820px]">
            <h1 className="font-display text-[44px] leading-[1.02] tracking-tight md:text-[72px]">
              Điều khoản
            </h1>
            <div className="mt-10 space-y-5 text-[15px] leading-[1.7] text-[var(--color-ink-soft)]">
              <p>
                License Vô chi cấp quyền sử dụng theo gói đã mua. Bạn không được bán lại, chia sẻ
                công khai hoặc tìm cách vượt giới hạn thiết bị của license.
              </p>
              <p>
                Pro được hoàn tiền trong 14 ngày, Lifetime trong 30 ngày. Hoàn tiền được xử lý thủ
                công qua email hi@vochi.xyz và license liên quan có thể bị thu hồi.
              </p>
              <p>
                App đang trong giai đoạn beta. Vô chi sẽ ưu tiên sửa lỗi ảnh hưởng đến dữ liệu học
                và quyền truy cập trả phí.
              </p>
              <p>Liên hệ: hi@vochi.xyz.</p>
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
