import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  Geist,
  Geist_Mono,
  VT323,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  weight: ["400"],
  style: ["normal", "italic"],
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

const vt323 = VT323({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-vt323",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vocabagotchi — Học từ vựng. Đừng để pet chết đói.",
  description:
    "Pet ảo sống trên màn hình macOS và Windows. Đói thì gọi bạn học từ. Học tiếng Anh dưới lớp vỏ Tamagotchi 90s.",
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
    title: "Vocabagotchi — Pet ăn từ vựng",
    description: "Tamagotchi cho người học tiếng Anh. macOS + Windows.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${bricolage.variable} ${instrument.variable} ${geist.variable} ${geistMono.variable} ${vt323.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}
