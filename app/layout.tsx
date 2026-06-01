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

const SITE_URL = "https://vochiapp.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vô chi · Học từ vựng tiếng Anh cùng thú nhỏ vô tư",
    template: "%s · Vô chi",
  },
  description:
    "Pet ảo sống trên màn hình bạn, vừa làm việc vừa nhâm nhi từ vựng tiếng Anh. Không streak, không stress. Phương pháp Vô chi cho macOS và Windows. Tải miễn phí.",
  applicationName: "Vô chi",
  authors: [{ name: "himitsuko" }],
  creator: "himitsuko",
  publisher: "Vô chi",
  keywords: [
    "vô chi",
    "vochi",
    "học từ vựng",
    "học tiếng anh",
    "app học từ vựng",
    "học IELTS",
    "học TOEIC",
    "ôn từ vựng",
    "pet ảo desktop",
    "tamagotchi học tiếng anh",
    "desktop pet",
    "vocabulary app",
    "spaced repetition",
    "macOS app",
    "Windows app",
    "tiếng anh chill",
    "học tiếng anh không stress",
  ],
  category: "education",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "vi-VN": SITE_URL,
      "en-US": `${SITE_URL}?lang=en`,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Vô chi",
    title: "Vô chi · Học từ vựng cùng thú nhỏ vô tư",
    description:
      "Pet ảo sống trên màn hình macOS và Windows. Nhâm nhi từ vựng tiếng Anh trong kẽ rảnh, không streak, không stress.",
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Vô chi · pet ảo học từ vựng tiếng Anh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vô chi · Học từ vựng cùng thú nhỏ vô tư",
    description:
      "Pet ảo sống trên màn hình. Không streak, không stress. Tải miễn phí cho macOS và Windows.",
    creator: "@himitsuko",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    telephone: false,
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
