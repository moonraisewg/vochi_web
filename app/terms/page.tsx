/* eslint-disable react/no-unescaped-entities */
"use client";

import { PageShell } from "@/components/PageShell";
import { useLang } from "@/components/LangProvider";
import type { Lang } from "@/components/Nav";
import type { ReactNode } from "react";

const EFFECTIVE_DATE = "5 tháng 6, 2026";
const EFFECTIVE_DATE_EN = "June 5, 2026";

const COPY: Record<
  Lang,
  {
    title: string;
    updated: string;
    sections: Array<{ h: string; body: ReactNode }>;
  }
> = {
  vi: {
    title: "Điều khoản dịch vụ",
    updated: `Cập nhật: ${EFFECTIVE_DATE}`,
    sections: [
      {
        h: "1. Chấp nhận điều khoản",
        body: (
          <p>
            Bằng cách tải xuống, cài đặt hoặc sử dụng app Vô chi và website vochi.xyz, bạn xác
            nhận đã đọc, hiểu và đồng ý ràng buộc với các điều khoản này. Nếu bạn không đồng ý,
            vui lòng không sử dụng dịch vụ.
          </p>
        ),
      },
      {
        h: "2. Mô tả dịch vụ",
        body: (
          <p>
            Vô chi là một ứng dụng máy tính cho macOS và Windows cùng website vận hành tại
            vochi.xyz. App giúp người dùng học từ vựng tiếng Anh thông qua thuật toán lặp lại
            ngắt quãng (SRS) gắn với một sinh vật ảo trên màn hình. Dịch vụ được cung cấp ở dạng
            beta — chức năng có thể thay đổi.
          </p>
        ),
      },
      {
        h: "3. License và giới hạn sử dụng",
        body: (
          <>
            <p>
              Sau khi mua một gói trả phí, Vô chi cấp cho bạn license cá nhân, không độc quyền,
              không chuyển nhượng để cài đặt và sử dụng app trên số thiết bị tương ứng với gói
              đã mua.
            </p>
            <p>Bạn KHÔNG được:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Bán, cho thuê, cấp license phụ hoặc phân phối lại license cho người khác.</li>
              <li>
                Vượt qua, vô hiệu hoá hoặc tìm cách phá các biện pháp kỹ thuật giới hạn thiết bị,
                xác thực license, hoặc kiểm soát truy cập.
              </li>
              <li>Sao chép, đảo ngược biên dịch, dịch ngược hoặc trích xuất mã nguồn app.</li>
              <li>Sử dụng app để thực hiện hoạt động trái pháp luật hoặc vi phạm bản quyền.</li>
            </ul>
          </>
        ),
      },
      {
        h: "4. Thanh toán",
        body: (
          <p>
            Giá hiển thị bằng VND, đã bao gồm các loại thuế áp dụng. Thanh toán được xử lý qua
            cổng thanh toán VietQR (Sepay). Sau khi giao dịch thành công, license sẽ được gửi
            qua email trong vòng vài phút. Nếu sau 30 phút bạn chưa nhận được, vui lòng liên hệ{" "}
            <a className="underline" href="mailto:hi@vochi.xyz">hi@vochi.xyz</a>.
          </p>
        ),
      },
      {
        h: "5. Chính sách hoàn tiền",
        body: (
          <>
            <p>
              Gói Pro (3 tháng): hoàn tiền 100% trong vòng 14 ngày kể từ ngày mua. Gói Lifetime:
              hoàn tiền 100% trong vòng 30 ngày. Yêu cầu hoàn tiền gửi qua email; license tương
              ứng sẽ bị thu hồi.
            </p>
            <p>
              Sau thời hạn hoàn tiền, do tính chất sản phẩm số đã được cung cấp đầy đủ, chúng tôi
              không xử lý hoàn tiền trừ khi pháp luật bắt buộc khác.
            </p>
          </>
        ),
      },
      {
        h: "6. Nội dung của người dùng",
        body: (
          <p>
            Từ vựng, ghi chú và bộ thẻ do bạn nhập vào app vẫn thuộc sở hữu của bạn. Vô chi không
            yêu cầu bất kỳ quyền sở hữu nào với nội dung học tập của bạn. Dữ liệu này lưu cục bộ
            trên máy của bạn và không được upload lên server.
          </p>
        ),
      },
      {
        h: "7. Bản beta và miễn trừ bảo đảm",
        body: (
          <p>
            App được cung cấp "nguyên trạng" trong giai đoạn beta. Chúng tôi nỗ lực giữ ổn định
            nhưng KHÔNG bảo đảm app sẽ không có lỗi, không gián đoạn, hay phù hợp với mọi mục
            đích cụ thể của bạn. Trong phạm vi pháp luật cho phép, chúng tôi từ chối mọi bảo đảm
            ngụ ý về tính thương mại hoá và sự phù hợp cho mục đích cụ thể.
          </p>
        ),
      },
      {
        h: "8. Giới hạn trách nhiệm",
        body: (
          <p>
            Trong phạm vi pháp luật cho phép, trách nhiệm tối đa của Vô chi với bất kỳ thiệt hại
            nào liên quan tới dịch vụ được giới hạn ở số tiền bạn đã trả cho gói license trong 12
            tháng gần nhất. Chúng tôi không chịu trách nhiệm với thiệt hại gián tiếp, ngẫu nhiên,
            hậu quả, mất doanh thu, mất dữ liệu (ngoài phạm vi bảo vệ dữ liệu cá nhân ở Chính
            sách Quyền riêng tư).
          </p>
        ),
      },
      {
        h: "9. Dữ liệu sử dụng và báo cáo lỗi ẩn danh",
        body: (
          <p>
            Khi sử dụng Vô chi, bạn đồng ý rằng app gửi dữ liệu sử dụng ẩn danh (không có email,
            tên hay nội dung từ vựng) để cải thiện sản phẩm, bao gồm cả ghi nhận lỗi khi app gặp
            sự cố. Bạn có thể tắt toàn bộ tính năng này trong Settings bất kỳ lúc nào. Chi tiết
            tại{" "}
            <a className="underline" href="/privacy">trang Quyền riêng tư</a>.
          </p>
        ),
      },
      {
        h: "10. Chấm dứt",
        body: (
          <p>
            Bạn có thể chấm dứt sử dụng dịch vụ bất cứ lúc nào bằng cách gỡ cài đặt app. Chúng
            tôi có thể tạm dừng hoặc chấm dứt license của bạn nếu bạn vi phạm nghiêm trọng các
            điều khoản này, sau khi gửi thông báo qua email và cơ hội khắc phục trong 7 ngày,
            trừ trường hợp vi phạm gây thiệt hại tức thì.
          </p>
        ),
      },
      {
        h: "11. Luật áp dụng và giải quyết tranh chấp",
        body: (
          <p>
            Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Tranh chấp phát sinh sẽ
            được hai bên thiện chí giải quyết qua thương lượng. Nếu không đạt được thoả thuận,
            tranh chấp thuộc thẩm quyền giải quyết của Toà án có thẩm quyền tại Việt Nam, hoặc cơ
            quan có thẩm quyền nơi cư trú của người tiêu dùng nếu pháp luật bảo vệ người tiêu dùng
            yêu cầu.
          </p>
        ),
      },
      {
        h: "12. Thay đổi điều khoản",
        body: (
          <p>
            Khi điều khoản thay đổi đáng kể, chúng tôi thông báo qua email và cập nhật ngày hiệu
            lực ở đầu trang này ít nhất 30 ngày trước khi áp dụng. Tiếp tục sử dụng dịch vụ sau
            ngày hiệu lực mới nghĩa là bạn đồng ý với phiên bản mới.
          </p>
        ),
      },
      {
        h: "13. Liên hệ",
        body: (
          <p>
            Mọi câu hỏi về điều khoản: <a className="underline" href="mailto:hi@vochi.xyz">hi@vochi.xyz</a>.
          </p>
        ),
      },
    ],
  },
  en: {
    title: "Terms of Service",
    updated: `Last updated: ${EFFECTIVE_DATE_EN}`,
    sections: [
      {
        h: "1. Acceptance of terms",
        body: (
          <p>
            By downloading, installing, or using the Vô chi app and the vochi.xyz website, you
            acknowledge that you have read, understood, and agreed to be bound by these terms. If
            you do not agree, please do not use the service.
          </p>
        ),
      },
      {
        h: "2. Service description",
        body: (
          <p>
            Vô chi is a desktop application for macOS and Windows, together with a companion
            website at vochi.xyz. The app helps users learn English vocabulary through a spaced
            repetition algorithm tied to a virtual creature on screen. The service is provided in
            beta — functionality may change.
          </p>
        ),
      },
      {
        h: "3. License and usage limits",
        body: (
          <>
            <p>
              On a successful purchase, Vô chi grants you a personal, non-exclusive,
              non-transferable license to install and use the app on the number of devices
              included in your plan.
            </p>
            <p>You may NOT:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Sell, rent, sublicense, or redistribute the license to others.
              </li>
              <li>
                Bypass, disable, or interfere with technical measures that enforce the device
                limit, license verification, or access control.
              </li>
              <li>
                Copy, decompile, reverse engineer, or extract source code from the app.
              </li>
              <li>
                Use the app for any unlawful purpose or to infringe intellectual property rights.
              </li>
            </ul>
          </>
        ),
      },
      {
        h: "4. Payment",
        body: (
          <p>
            Prices are shown in VND, inclusive of applicable taxes. Payment is processed through
            the VietQR gateway (Sepay). The license is emailed within minutes after a successful
            transaction. If you do not receive it within 30 minutes, contact{" "}
            <a className="underline" href="mailto:hi@vochi.xyz">hi@vochi.xyz</a>.
          </p>
        ),
      },
      {
        h: "5. Refund policy",
        body: (
          <>
            <p>
              Pro plan (3 months): 100% refund within 14 days of purchase. Lifetime plan: 100%
              refund within 30 days. Refund requests are submitted by email; the corresponding
              license is revoked.
            </p>
            <p>
              After the refund window, because the digital product has been fully delivered, no
              refund is processed unless required by applicable law.
            </p>
          </>
        ),
      },
      {
        h: "6. User content",
        body: (
          <p>
            Vocabulary, notes, and decks that you enter into the app remain your property. Vô chi
            claims no ownership over your learning content. This data is stored locally on your
            machine and is not uploaded to our servers.
          </p>
        ),
      },
      {
        h: "7. Beta status and disclaimer of warranty",
        body: (
          <p>
            The app is provided "as is" during the beta phase. We work to keep it stable but make
            NO warranty that the app will be free of bugs, uninterrupted, or fit for your
            particular purpose. To the extent permitted by law, we disclaim all implied warranties
            of merchantability and fitness for a particular purpose.
          </p>
        ),
      },
      {
        h: "8. Limitation of liability",
        body: (
          <p>
            To the extent permitted by law, our maximum aggregate liability for any damages
            arising out of or related to the service is limited to the amount you paid for the
            license in the most recent twelve months. We are not liable for indirect, incidental,
            consequential, lost revenue, or data loss (beyond personal data protection covered by
            the Privacy Policy).
          </p>
        ),
      },
      {
        h: "9. Anonymous usage data and error reports",
        body: (
          <p>
            By using Vô chi, you agree that the app sends anonymous usage data (no email, name,
            or vocabulary content) to improve the product, including error reports when the app
            crashes. You can disable this entirely in Settings at any time. See the{" "}
            <a className="underline" href="/privacy">Privacy Policy</a> for details.
          </p>
        ),
      },
      {
        h: "10. Termination",
        body: (
          <p>
            You may stop using the service at any time by uninstalling the app. We may suspend
            or terminate your license if you materially breach these terms, after notifying you
            by email and giving you 7 days to cure, except where the breach causes immediate harm.
          </p>
        ),
      },
      {
        h: "11. Governing law and disputes",
        body: (
          <p>
            These terms are governed by the laws of Vietnam. Disputes are first attempted to be
            resolved in good faith through negotiation. If no agreement is reached, disputes fall
            under the jurisdiction of the competent courts of Vietnam, or the consumer's place of
            residence where consumer protection law so requires.
          </p>
        ),
      },
      {
        h: "12. Changes to terms",
        body: (
          <p>
            For material changes we will email you and update the effective date at the top of
            this page at least 30 days before they take effect. Continued use after the new
            effective date means you accept the updated terms.
          </p>
        ),
      },
      {
        h: "13. Contact",
        body: (
          <p>
            Questions about these terms:{" "}
            <a className="underline" href="mailto:hi@vochi.xyz">hi@vochi.xyz</a>.
          </p>
        ),
      },
    ],
  },
};

export default function TermsPage() {
  return (
    <PageShell>
      {() => <TermsContent />}
    </PageShell>
  );
}

function TermsContent() {
  const { lang } = useLang();
  const t = COPY[lang];
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <h1 className="font-display text-[44px] leading-[1.02] tracking-tight md:text-[64px]">
          {t.title}
        </h1>
        <p className="mt-3 text-[13px] text-[var(--color-ink-muted)] font-mono uppercase tracking-[0.14em]">
          {t.updated}
        </p>
        <div className="mt-10 max-w-[760px] space-y-10 text-[15px] leading-[1.7] text-[var(--color-ink-soft)]">
          {t.sections.map((s, i) => (
            <section key={i} className="space-y-3">
              <h2 className="font-display text-[22px] tracking-tight text-[var(--color-ink)]">
                {s.h}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
