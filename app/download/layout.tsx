import type { Metadata } from "next";

// Metadata khai ở layout vì page.tsx là client component — client component
// không export được `metadata`. Quan trọng nhất là `canonical`: layout gốc đặt
// canonical = trang chủ cho MỌI trang, nên nếu không ghi đè ở đây thì trang này
// tự khai báo mình là bản sao của "/" và Google sẽ không index nó, dù sitemap.xml
// vẫn liệt kê.
export const metadata: Metadata = {
  title: "Tải app",
  description: "Một file. Một pet. Bắt đầu. Bản beta miễn phí cho macOS và Windows, không cần tạo tài khoản.",
  alternates: { canonical: "/download" },
  openGraph: { url: "/download", title: "Tải app", description: "Một file. Một pet. Bắt đầu. Bản beta miễn phí cho macOS và Windows, không cần tạo tài khoản." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
