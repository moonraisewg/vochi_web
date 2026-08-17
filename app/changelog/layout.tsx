import type { Metadata } from "next";

// Metadata khai ở layout vì page.tsx là client component — client component
// không export được `metadata`. Quan trọng nhất là `canonical`: layout gốc đặt
// canonical = trang chủ cho MỌI trang, nên nếu không ghi đè ở đây thì trang này
// tự khai báo mình là bản sao của "/" và Google sẽ không index nó, dù sitemap.xml
// vẫn liệt kê.
export const metadata: Metadata = {
  title: "Nhật ký cập nhật",
  description: "Những gì đã thay đổi qua từng phiên bản Vô chi: tính năng mới, sửa lỗi và cải thiện.",
  alternates: { canonical: "/changelog" },
  openGraph: { url: "/changelog", title: "Nhật ký cập nhật", description: "Những gì đã thay đổi qua từng phiên bản Vô chi: tính năng mới, sửa lỗi và cải thiện." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
