"use client";

import { PageShell } from "@/components/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell>
      {() => (
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[820px]">
            <h1 className="font-display text-[44px] leading-[1.02] tracking-tight md:text-[72px]">
              Quyền riêng tư
            </h1>
            <div className="mt-10 space-y-5 text-[15px] leading-[1.7] text-[var(--color-ink-soft)]">
              <p>
                Vô chi lưu email, đơn hàng, license và thông tin thiết bị đã kích hoạt để xử lý
                thanh toán, cấp quyền dùng app và hỗ trợ khách hàng.
              </p>
              <p>
                Từ vựng và tiến độ học mặc định nằm trên máy của bạn. Server license chỉ nhận
                license key, device id cài đặt ngẫu nhiên và trạng thái kích hoạt.
              </p>
              <p>
                Dữ liệu thanh toán được xử lý qua SePay. Vô chi không lưu thông tin thẻ ngân hàng.
              </p>
              <p>Liên hệ: hi@vochi.app.</p>
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
