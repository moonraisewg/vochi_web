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
    title: "Quyền riêng tư",
    updated: `Cập nhật: ${EFFECTIVE_DATE}`,
    sections: [
      {
        h: "1. Người chịu trách nhiệm xử lý dữ liệu",
        body: (
          <>
            <p>
              Vô chi (sau đây gọi là "chúng tôi") là một sản phẩm được phát triển và vận hành tại
              Việt Nam. Khi bạn dùng app hoặc website vochi.xyz, chúng tôi là bên kiểm soát dữ
              liệu cá nhân theo Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu Cá nhân (PDPL) và Quy
              định Bảo vệ Dữ liệu Chung của EU (GDPR) khi áp dụng.
            </p>
            <p>
              Liên hệ về dữ liệu cá nhân: <a className="underline" href="mailto:hi@vochi.xyz">hi@vochi.xyz</a>.
            </p>
          </>
        ),
      },
      {
        h: "2. Dữ liệu chúng tôi thu thập",
        body: (
          <>
            <p>
              <strong>2.1 Dữ liệu mua hàng và license.</strong> Khi bạn mua một gói trả phí,
              chúng tôi thu thập: email nhận license, số tiền, mã đơn hàng, thời gian giao dịch,
              gói đã mua, mã định danh thiết bị do app sinh ra để giới hạn số máy. Chúng tôi
              KHÔNG lưu số thẻ ngân hàng — toàn bộ luồng thanh toán do cổng thanh toán bên thứ ba
              xử lý.
            </p>
            <p>
              <strong>2.2 Dữ liệu học tập (offline trên máy).</strong> Từ vựng, định nghĩa, ví dụ,
              tiến độ học, hunger/level của thú nhỏ được lưu cục bộ trong cơ sở dữ liệu SQLite
              trên máy của bạn. Chúng KHÔNG được upload, không nằm trên server của chúng tôi.
            </p>
            <p>
              <strong>2.3 Dữ liệu sử dụng ẩn danh (analytics).</strong> Nếu bạn đồng ý (mặc định
              bật, có thể tắt trong Settings), app gửi các sự kiện ẩn danh: phiên bản app, hệ
              điều hành, các hành động trong app (click pet, ôn từ, đổi chế độ), các thuộc tính
              kỹ thuật (ngôn ngữ giao diện, kích thước pet, gói license đang dùng), và loại lỗi
              khi app gặp sự cố. Mỗi lần cài đặt được gắn một mã ngẫu nhiên (install_id) lưu trên
              máy bạn, không liên kết với email hay tên thật.
            </p>
            <p>
              <strong>2.4 Dữ liệu kỹ thuật khi truy cập website.</strong> Server log thông thường
              (IP, user-agent, referrer, thời gian truy cập) do nhà cung cấp hosting xử lý trong
              khoảng 30 ngày để vận hành an toàn, sau đó tự xoá. Một cookie nhỏ tên "vochi_lang"
              được dùng để ghi nhớ lựa chọn ngôn ngữ.
            </p>
          </>
        ),
      },
      {
        h: "3. Mục đích và căn cứ pháp lý",
        body: (
          <>
            <p>
              <strong>Thực hiện hợp đồng (Điều 17 PDPL / Điều 6(1)(b) GDPR):</strong> xử lý đơn
              hàng, cấp license, chống lạm dụng giới hạn thiết bị.
            </p>
            <p>
              <strong>Sự đồng ý (Điều 11 PDPL / Điều 6(1)(a) GDPR):</strong> dữ liệu sử dụng ẩn
              danh và ghi nhận lỗi. Bạn có quyền rút lại đồng ý bất cứ lúc nào.
            </p>
            <p>
              <strong>Lợi ích chính đáng (Điều 6(1)(f) GDPR):</strong> bảo mật website, phòng
              chống gian lận thanh toán.
            </p>
          </>
        ),
      },
      {
        h: "4. Bên thứ ba xử lý dữ liệu",
        body: (
          <>
            <p>Chúng tôi chia sẻ dữ liệu cần thiết với các bên thứ ba sau đây:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Cổng thanh toán VietQR (Sepay)</strong> — xử lý giao dịch, máy chủ tại Việt Nam.
              </li>
              <li>
                <strong>Resend</strong> — gửi email license, máy chủ tại Hoa Kỳ.
              </li>
              <li>
                <strong>PostHog</strong> — phân tích sử dụng ẩn danh và ghi nhận lỗi, máy chủ tại Hoa Kỳ
                (us.i.posthog.com).
              </li>
              <li>
                <strong>Vercel</strong> — hosting website, máy chủ phân bố toàn cầu.
              </li>
              <li>
                <strong>Cloudflare</strong> — CDN và bảo vệ DDoS, máy chủ phân bố toàn cầu.
              </li>
            </ul>
          </>
        ),
      },
      {
        h: "5. Chuyển dữ liệu ra nước ngoài",
        body: (
          <>
            <p>
              Một số bên xử lý (Resend, PostHog, Vercel, Cloudflare) đặt máy chủ ngoài Việt Nam,
              chủ yếu tại Hoa Kỳ và EU. Theo Điều 25 PDPL, chúng tôi đã đánh giá tác động và áp
              dụng biện pháp bảo vệ tương đương: hợp đồng tiêu chuẩn (Standard Contractual
              Clauses) với các bên ở khu vực không có quyết định công nhận đầy đủ. Việc chuyển
              dữ liệu ẩn danh và dữ liệu license tối thiểu là cần thiết để vận hành dịch vụ bạn
              đã đăng ký.
            </p>
          </>
        ),
      },
      {
        h: "6. Thời hạn lưu trữ",
        body: (
          <>
            <ul className="list-disc pl-5 space-y-2">
              <li>Dữ liệu mua hàng và license: lưu suốt thời hạn license + 5 năm theo quy định kế toán Việt Nam.</li>
              <li>Email license: lưu đến khi bạn yêu cầu xoá hoặc license hết hạn 5 năm.</li>
              <li>Dữ liệu sử dụng ẩn danh: tối đa 13 tháng, sau đó tự xoá tại PostHog.</li>
              <li>Server log truy cập website: tối đa 30 ngày.</li>
              <li>Dữ liệu học tập trên máy: do bạn kiểm soát. Reset trong app sẽ xoá sạch.</li>
            </ul>
          </>
        ),
      },
      {
        h: "7. Quyền của bạn",
        body: (
          <>
            <p>Theo PDPL Việt Nam và GDPR, bạn có các quyền sau:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Quyền được biết và quyền truy cập dữ liệu cá nhân của mình.</li>
              <li>Quyền chỉnh sửa, cập nhật dữ liệu không chính xác.</li>
              <li>Quyền yêu cầu xoá dữ liệu (quyền được lãng quên).</li>
              <li>Quyền hạn chế hoặc phản đối việc xử lý.</li>
              <li>Quyền rút lại sự đồng ý đã cho, mà không ảnh hưởng tới tính hợp pháp của xử lý trước đó.</li>
              <li>Quyền chuyển dữ liệu sang nhà cung cấp khác (data portability).</li>
              <li>Quyền khiếu nại lên Cục An ninh mạng và Phòng, chống tội phạm sử dụng công nghệ cao (A05) – Bộ Công an Việt Nam.</li>
              <li>Đối với cư dân EU/EEA: quyền khiếu nại lên cơ quan bảo vệ dữ liệu địa phương.</li>
              <li>Đối với cư dân California (CCPA): quyền yêu cầu biết, xoá, và không bị bán dữ liệu. Vô chi KHÔNG bán dữ liệu cá nhân.</li>
            </ul>
            <p>
              Để thực hiện bất kỳ quyền nào, gửi email tới <a className="underline" href="mailto:hi@vochi.xyz">hi@vochi.xyz</a>.
              Chúng tôi phản hồi trong vòng 30 ngày.
            </p>
          </>
        ),
      },
      {
        h: "8. Trẻ em",
        body: (
          <p>
            Vô chi không nhắm tới người dùng dưới 16 tuổi. Nếu bạn dưới 16, hãy có sự đồng ý của
            cha mẹ hoặc người giám hộ trước khi sử dụng dịch vụ. Nếu chúng tôi phát hiện đã thu
            thập dữ liệu của trẻ em dưới 16 mà không có sự đồng ý hợp lệ, dữ liệu đó sẽ bị xoá.
          </p>
        ),
      },
      {
        h: "9. Bảo mật",
        body: (
          <p>
            Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý để bảo vệ dữ liệu: kết nối
            HTTPS bắt buộc, hash password, mã hoá license key, kiểm soát truy cập theo nguyên tắc
            least-privilege. Tuy nhiên không hệ thống nào tuyệt đối an toàn. Khi có sự cố dữ liệu,
            chúng tôi thông báo cho bạn và cơ quan có thẩm quyền trong vòng 72 giờ theo quy định.
          </p>
        ),
      },
      {
        h: "10. Thay đổi chính sách",
        body: (
          <p>
            Khi chính sách thay đổi đáng kể, chúng tôi thông báo qua email và cập nhật ngày hiệu
            lực ở đầu trang này. Tiếp tục sử dụng dịch vụ sau khi thay đổi nghĩa là bạn đồng ý
            với phiên bản mới.
          </p>
        ),
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: `Last updated: ${EFFECTIVE_DATE_EN}`,
    sections: [
      {
        h: "1. Who we are",
        body: (
          <>
            <p>
              Vô chi ("we", "us") is a product developed and operated in Vietnam. When you use
              the app or the website vochi.xyz, we act as the data controller under Vietnam's
              Decree 13/2023/ND-CP on Personal Data Protection (PDPL) and the EU General Data
              Protection Regulation (GDPR) where applicable.
            </p>
            <p>
              For privacy matters, contact{" "}
              <a className="underline" href="mailto:hi@vochi.xyz">hi@vochi.xyz</a>.
            </p>
          </>
        ),
      },
      {
        h: "2. What we collect",
        body: (
          <>
            <p>
              <strong>2.1 Purchase and license data.</strong> When you buy a paid plan we collect:
              the email that receives the license, amount, order id, transaction timestamp, plan
              purchased, and a device id generated by the app to enforce the device limit. We do
              NOT store card numbers — payment is handled entirely by a third-party gateway.
            </p>
            <p>
              <strong>2.2 Learning data (on-device).</strong> Vocabulary, definitions, examples,
              review progress, and your creature's hunger/level are stored locally in a SQLite
              database on your machine. They are NOT uploaded to our servers.
            </p>
            <p>
              <strong>2.3 Anonymous usage data (analytics).</strong> If you consent (default on,
              toggle in Settings), the app sends anonymous events: app version, OS, in-app
              actions (clicking the pet, reviewing words, switching modes), technical attributes
              (UI language, pet size, current license tier), and error type when the app crashes.
              Each install gets a random id (install_id) stored on your machine, never linked to
              your email or real name.
            </p>
            <p>
              <strong>2.4 Website access logs.</strong> Standard server logs (IP, user agent,
              referrer, timestamp) are processed by our hosting provider for up to 30 days for
              operational safety, then deleted. A small cookie named "vochi_lang" remembers your
              language choice.
            </p>
          </>
        ),
      },
      {
        h: "3. Purpose and legal basis",
        body: (
          <>
            <p>
              <strong>Performance of contract (PDPL Art. 17 / GDPR Art. 6(1)(b)):</strong> order
              processing, license issuance, device-limit enforcement.
            </p>
            <p>
              <strong>Consent (PDPL Art. 11 / GDPR Art. 6(1)(a)):</strong> anonymous usage data
              and error reports. You can withdraw consent at any time.
            </p>
            <p>
              <strong>Legitimate interest (GDPR Art. 6(1)(f)):</strong> website security and
              fraud prevention.
            </p>
          </>
        ),
      },
      {
        h: "4. Third-party processors",
        body: (
          <>
            <p>We share the minimum necessary data with the following processors:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>VietQR gateway (Sepay)</strong> — payment processing, servers in Vietnam.
              </li>
              <li>
                <strong>Resend</strong> — license email delivery, servers in the United States.
              </li>
              <li>
                <strong>PostHog</strong> — anonymous analytics and error tracking, servers in the
                United States (us.i.posthog.com).
              </li>
              <li>
                <strong>Vercel</strong> — website hosting, globally distributed.
              </li>
              <li>
                <strong>Cloudflare</strong> — CDN and DDoS protection, globally distributed.
              </li>
            </ul>
          </>
        ),
      },
      {
        h: "5. International transfers",
        body: (
          <p>
            Some processors (Resend, PostHog, Vercel, Cloudflare) host servers outside Vietnam,
            primarily in the United States and the EU. Per PDPL Art. 25 we have conducted a
            transfer impact assessment and put in place equivalent safeguards, including Standard
            Contractual Clauses with processors in regions without an adequacy decision. The
            transfer of anonymous data and minimal license data is necessary to operate the
            service you signed up for.
          </p>
        ),
      },
      {
        h: "6. Retention",
        body: (
          <>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Purchase and license data: kept for the license term plus 5 years per Vietnamese
                accounting law.
              </li>
              <li>License email: kept until you request deletion or 5 years after license expiry.</li>
              <li>Anonymous usage data: maximum 13 months, then auto-deleted at PostHog.</li>
              <li>Website server logs: maximum 30 days.</li>
              <li>On-device learning data: you control it. The in-app reset wipes everything.</li>
            </ul>
          </>
        ),
      },
      {
        h: "7. Your rights",
        body: (
          <>
            <p>Under Vietnam's PDPL and the GDPR you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Know what data we hold and access it.</li>
              <li>Correct inaccurate or incomplete data.</li>
              <li>Request erasure (right to be forgotten).</li>
              <li>Restrict or object to processing.</li>
              <li>Withdraw consent at any time, without affecting prior lawful processing.</li>
              <li>Receive your data in a portable format (data portability).</li>
              <li>
                Lodge a complaint with Vietnam's Department of Cybersecurity and High-Tech Crime
                Prevention (A05) – Ministry of Public Security.
              </li>
              <li>
                If you reside in the EU/EEA, lodge a complaint with your local data protection
                authority.
              </li>
              <li>
                If you reside in California (CCPA): the right to know, delete, and opt out of
                sale. Vô chi does NOT sell personal data.
              </li>
            </ul>
            <p>
              To exercise any of these, email{" "}
              <a className="underline" href="mailto:hi@vochi.xyz">hi@vochi.xyz</a>. We respond
              within 30 days.
            </p>
          </>
        ),
      },
      {
        h: "8. Children",
        body: (
          <p>
            Vô chi is not directed at users under 16. If you are under 16, please get parent or
            guardian consent before using the service. If we learn we have collected data from a
            child under 16 without valid consent, we will delete it.
          </p>
        ),
      },
      {
        h: "9. Security",
        body: (
          <p>
            We apply reasonable technical and organizational measures: HTTPS-only connections,
            password hashing, license key encryption, and least-privilege access. No system is
            perfectly secure. In the event of a data breach we will notify you and the competent
            authority within 72 hours where required.
          </p>
        ),
      },
      {
        h: "10. Changes",
        body: (
          <p>
            For material changes we will email you and update the effective date at the top of
            this page. Continued use after a change means you accept the updated policy.
          </p>
        ),
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <PageShell>
      {() => <PrivacyContent />}
    </PageShell>
  );
}

function PrivacyContent() {
  const { lang } = useLang();
  const t = COPY[lang];
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[820px]">
        <h1 className="font-display text-[44px] leading-[1.02] tracking-tight md:text-[64px]">
          {t.title}
        </h1>
        <p className="mt-3 text-[13px] text-[var(--color-ink-muted)] font-mono uppercase tracking-[0.14em]">
          {t.updated}
        </p>
        <div className="mt-10 space-y-10 text-[15px] leading-[1.7] text-[var(--color-ink-soft)]">
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
