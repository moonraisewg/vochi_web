import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geistmono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vô chi. Học từ vựng. Đừng để pet đói khóc.",
  description:
    "Pet ảo sống trên màn hình macOS và Windows. Đói thì gọi bạn học từ. Học tiếng Anh dưới lớp vỏ Tamagotchi.",
  keywords: [
    "học từ vựng",
    "học tiếng anh",
    "tamagotchi",
    "pet ảo",
    "ứng dụng học từ vựng",
    "desktop pet",
    "macOS app",
    "Windows app",
  ],
  openGraph: {
    title: "Vô chi. Pet ăn từ vựng.",
    description: "Tamagotchi cho người học tiếng Anh. macOS và Windows.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}
