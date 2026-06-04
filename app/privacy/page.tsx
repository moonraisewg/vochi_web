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
                Dữ liệu thanh toán được xử lý qua cổng thanh toán bên thứ ba. Vô chi không lưu thông tin thẻ ngân hàng.
              </p>

              <h2 className="font-display text-[22px] tracking-tight pt-4">
                Dữ liệu sử dụng (analytics)
              </h2>
              <p>
                Vô chi gửi dữ liệu sử dụng <strong>ẩn danh</strong> để cải thiện sản phẩm.
                Mỗi lần cài đặt được gắn một mã định danh ngẫu nhiên (<em>install_id</em>)
                lưu trên máy bạn, không gắn với email, tên hay bất kỳ thông tin cá nhân nào.
              </p>
              <p>
                Dữ liệu thu thập gồm: phiên bản app, hệ điều hành, các hành động dạng sự kiện
                (click pet, ôn từ, đổi chế độ, kích hoạt license), kèm các thuộc tính kỹ thuật
                (ví dụ: kích thước pet, ngôn ngữ giao diện, gói license đang dùng). Khi app gặp
                lỗi, loại lỗi và stack trace cũng được ghi nhận cùng đường này.
              </p>
              <p>
                <strong>Vô chi không gửi nội dung từ vựng, định nghĩa, ví dụ, hay bất kỳ
                văn bản nào bạn nhập vào app.</strong> Dữ liệu được xử lý bởi PostHog
                (us.i.posthog.com) làm bên thứ ba.
              </p>
              <p>
                Bạn có thể tắt việc gửi dữ liệu sử dụng (gồm cả ghi nhận lỗi) bất kỳ lúc nào
                trong Cài đặt {" "}→{" "}<em>Giúp Vô chi tốt hơn</em>.
              </p>

              <h2 className="font-display text-[22px] tracking-tight pt-4">
                Liên hệ
              </h2>
              <p>
                Mọi câu hỏi về quyền riêng tư, xoá dữ liệu, hay yêu cầu rút gọn: hi@vochi.xyz.
              </p>
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
