import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";
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

const SITE_URL = "https://vochi.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vô chi · Học ngoại ngữ, nuôi từng thú nhỏ, cùng vô chill",
    template: "%s · Vô chi",
  },
  description:
    "Học ngoại ngữ nuôi từng thú nhỏ, cùng vô chill trong thế giới mới bao la. Pet ảo sống trên màn hình macOS và Windows. Tải miễn phí.",
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
    title: "Vô chi · Học ngoại ngữ, nuôi từng thú nhỏ",
    description:
      "Học ngoại ngữ nuôi từng thú nhỏ, cùng vô chill trong thế giới mới bao la. Pet ảo cho macOS và Windows.",
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
    title: "Vô chi · Học ngoại ngữ, nuôi từng thú nhỏ",
    description:
      "Học ngoại ngữ nuôi từng thú nhỏ, cùng vô chill trong thế giới mới bao la. Tải miễn phí cho macOS và Windows.",
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
      <body className="min-h-screen overflow-x-hidden">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
