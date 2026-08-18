import type { Metadata } from "next";

// Metadata khai ở layout vì page.tsx là client component — client component
// không export được `metadata`. Quan trọng nhất là `canonical`: layout gốc đặt
// canonical = trang chủ cho MỌI trang, nên nếu không ghi đè ở đây thì trang này
// tự khai báo mình là bản sao của "/" và Google sẽ không index nó, dù sitemap.xml
// vẫn liệt kê.
export const metadata: Metadata = {
  title: "Thanh toán",
  description: "Chọn gói, để lại email, quét QR chuyển khoản. License tự gửi vào email khi giao dịch xong.",
  alternates: { canonical: "/checkout" },
  openGraph: { url: "/checkout", title: "Thanh toán", description: "Chọn gói, để lại email, quét QR chuyển khoản. License tự gửi vào email khi giao dịch xong." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
