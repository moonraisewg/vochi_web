import type { Metadata } from "next";

// Metadata khai ở layout vì page.tsx là client component — client component
// không export được `metadata`. Quan trọng nhất là `canonical`: layout gốc đặt
// canonical = trang chủ cho MỌI trang, nên nếu không ghi đè ở đây thì trang này
// tự khai báo mình là bản sao của "/" và Google sẽ không index nó, dù sitemap.xml
// vẫn liệt kê.
export const metadata: Metadata = {
  title: "Hướng dẫn sử dụng",
  description: "Cẩm nang dùng Vô chi trong 3 phút: cấp quyền trên macOS, khởi động cùng hệ thống, và các chế độ học.",
  alternates: { canonical: "/docs" },
  openGraph: { url: "/docs", title: "Hướng dẫn sử dụng", description: "Cẩm nang dùng Vô chi trong 3 phút: cấp quyền trên macOS, khởi động cùng hệ thống, và các chế độ học." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
