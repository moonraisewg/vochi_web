import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";
import { UtmCapture } from "@/components/UtmCapture";
import { LangProvider } from "@/components/LangProvider";
import type { Lang } from "@/components/Nav";
import { resolveHtmlLang } from "@/lib/seo/pageMeta";
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
    default: "Vô chi · Học tiếng Anh cho người Việt, học tiếng Trung HSK cho English speakers",
    template: "%s · Vô chi",
  },
  description:
    "Pet ảo desktop giúp người Việt học từ vựng tiếng Anh (IELTS · TOEIC · 5.300 từ) và English speakers luyện tiếng Trung HSK 1–6. Thuật toán FSRS, offline, macOS + Windows.",
  applicationName: "Vô chi",
  authors: [{ name: "Vô chi" }],
  creator: "Vô chi",
  publisher: "Vô chi",
  keywords: [
    "vô chi",
    "vochi",
    "học tiếng anh",
    "học từ vựng tiếng anh",
    "app học tiếng anh cho người việt",
    "học IELTS",
    "học TOEIC",
    "ôn từ vựng tiếng anh",
    "pet ảo học tiếng anh",
    "tamagotchi học tiếng anh",
    "learn Chinese",
    "learn Chinese vocabulary",
    "HSK app",
    "HSK 1",
    "HSK 2",
    "HSK 3",
    "HSK 4",
    "HSK 5",
    "HSK 6",
    "learn Mandarin",
    "Chinese flashcards",
    "spaced repetition Chinese",
    "SRS Chinese",
    "desktop pet vocabulary",
    "FSRS",
    "vocabulary app macOS",
    "vocabulary app Windows",
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
    title: "Vô chi · Học tiếng Anh & tiếng Trung cùng pet ảo desktop",
    description:
      "Người Việt luyện từ vựng tiếng Anh (IELTS/TOEIC). English speakers luyện HSK 1–6. Pet ảo trên macOS/Windows, thuật toán FSRS.",
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Vô chi · pet ảo học từ vựng tiếng Anh và tiếng Trung HSK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vô chi · Học tiếng Anh (VI) & tiếng Trung HSK (EN)",
    description:
      "Pet ảo desktop cho macOS & Windows. Người Việt học tiếng Anh IELTS/TOEIC, English speakers học HSK 1–6.",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const FAQ_QA_VI: Array<[string, string]> = [
  ["Nếu thú nhỏ chết thì sao?", "Nó sẽ không chết chỉ vì bạn bận vài ngày. Vô chi không dùng cảm giác tội lỗi để giữ chân bạn. Thú nhỏ chỉ ngủ và đợi bạn quay lại."],
  ["App có chạy trên Windows không?", "Có. macOS 12 trở lên và Windows 10 trở lên đều được hỗ trợ. Bản Linux đang trong quá trình hoàn thiện."],
  ["Thanh toán bằng cách nào, có an toàn không?", "Quét mã VietQR trong app ngân hàng và chuyển khoản. Không cần nhập số thẻ. Sau khi ngân hàng xác nhận, đăng nhập bằng email mua hàng là có Pro ngay."],
  ["Thú nhỏ có hiển thị được trên fullscreen Chrome?", "Có. Thú nhỏ hiển thị trên cùng kể cả khi xem Netflix, Chrome fullscreen hoặc Zoom."],
  ["Dữ liệu của tôi có bị upload không?", "Không. Từ vựng và tiến độ học chỉ lưu trên máy của bạn. App chỉ gọi server một lần lúc xác thực license."],
  ["Chính sách hoàn tiền?", "Pro 14 ngày, Lifetime 30 ngày. Hoàn 100%, không cần lý do."],
  ["Có hỗ trợ ôn IELTS hoặc TOEIC không?", "Có. Gần 5.300 từ chia theo cấp độ, phủ hầu hết từ thi IELTS và TOEIC."],
];

// Mirrors FAQ_QA_VI 1:1, same order — kept in sync with the English items in
// components/FAQ.tsx so EN visitors get FAQPage rich-result eligibility too.
const FAQ_QA_EN: Array<[string, string]> = [
  ["What happens if my creature dies?", "It will not die just because you are busy for a few days. Vô chi does not use guilt to keep you around. The creature simply sleeps and waits for you to come back."],
  ["Does it run on Windows?", "Yes. macOS 12+ and Windows 10+ are both supported. A Linux build is in progress."],
  ["How does payment work? Is it safe?", "Scan a VietQR code in your banking app and transfer as usual. No card details are entered anywhere. Once the bank confirms, sign in with your purchase email to get Pro right away."],
  ["Does the creature really sit over fullscreen Chrome?", "Yes. The creature stays on top while you watch Netflix, browse Chrome in fullscreen, or present on Zoom."],
  ["Is my data uploaded?", "No. Words and review history live on your device. The app only contacts the server once, to verify your license."],
  ["Refund policy?", "Pro: 14 days. Lifetime: 30 days. Full refund, no questions asked."],
  ["Can I drill IELTS or TOEIC vocab?", "Yes. The app includes nearly 5,300 words sorted by level, covering most IELTS and TOEIC vocabulary."],
];

function buildFaqPageEntry(lang: Lang) {
  const qa = lang === "en" ? FAQ_QA_EN : FAQ_QA_VI;
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}#faq`,
    inLanguage: lang === "en" ? "en-US" : "vi-VN",
    mainEntity: qa.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

const baseJsonLdGraph = [
  {
    "@type": "Organization",
    "@id": `${SITE_URL}#org`,
    name: "Vô chi",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-bird.png`,
    email: "hi@vochi.xyz",
    sameAs: [SITE_URL],
  },
  {
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: "Vô chi",
    inLanguage: ["vi-VN", "en-US"],
    publisher: { "@id": `${SITE_URL}#org` },
  },
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}#app`,
    name: "Vô chi",
    applicationCategory: "EducationalApplication",
    applicationSubCategory: "Vocabulary learning",
    operatingSystem: "macOS 12+, Windows 10+",
    url: SITE_URL,
    downloadUrl: `${SITE_URL}/download`,
    description:
      "Desktop pet SRS vocabulary app. Vietnamese speakers learn English (IELTS, TOEIC, 5,300 words). English speakers learn Mandarin Chinese (HSK 1–6). FSRS algorithm, offline-first.",
    inLanguage: ["vi-VN", "en-US"],
    teaches: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Chinese", alternateName: "zh" },
    ],
    audience: [
      {
        "@type": "EducationalAudience",
        educationalRole: "student",
        audienceType: "Vietnamese speakers learning English (IELTS, TOEIC)",
      },
      {
        "@type": "EducationalAudience",
        educationalRole: "student",
        audienceType: "English speakers learning Mandarin Chinese (HSK 1–6)",
      },
    ],
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "VND", name: "Free" },
      { "@type": "Offer", price: "59000", priceCurrency: "VND", name: "Pro 1 month" },
      { "@type": "Offer", price: "129000", priceCurrency: "VND", name: "Pro 3 months" },
      { "@type": "Offer", price: "599000", priceCurrency: "VND", name: "Lifetime" },
      { "@type": "Offer", price: "50000", priceCurrency: "VND", name: "HSK Advanced (HSK 4·5·6 unlock)" },
    ],
    publisher: { "@id": `${SITE_URL}#org` },
  },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialLang: Lang = await resolveHtmlLang();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [...baseJsonLdGraph, buildFaqPageEntry(initialLang)],
  };

  return (
    <html
      lang={initialLang}
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PostHogProvider>
          <UtmCapture />
          <LangProvider initialLang={initialLang}>{children}</LangProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
