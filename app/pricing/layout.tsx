import type { Metadata } from "next";

// Metadata khai ở layout vì page.tsx là client component — client component
// không export được `metadata`. Quan trọng nhất là `canonical`: layout gốc đặt
// canonical = trang chủ cho MỌI trang, nên nếu không ghi đè ở đây thì trang này
// tự khai báo mình là bản sao của "/" và Google sẽ không index nó, dù sitemap.xml
// vẫn liệt kê.
export const metadata: Metadata = {
  title: "Bảng giá",
  description: "Các gói Vô chi Pro: 1 tháng, 3 tháng và mua đứt trọn đời. Thanh toán VietQR, license gửi thẳng vào email.",
  alternates: { canonical: "/pricing" },
  openGraph: { url: "/pricing", title: "Bảng giá", description: "Các gói Vô chi Pro: 1 tháng, 3 tháng và mua đứt trọn đời. Thanh toán VietQR, license gửi thẳng vào email." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
