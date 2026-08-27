import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán",
  description: "Trang thanh toán Vô chi.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/checkout" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
