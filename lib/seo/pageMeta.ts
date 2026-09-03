import type { Metadata } from "next";
import { cookies, headers } from "next/headers";

export type SeoLang = "vi" | "en";

const NEXT_LOCALE: Record<SeoLang, "vi_VN" | "en_US"> = {
  vi: "vi_VN",
  en: "en_US",
};

export type PageMetaKey =
  | "home"
  | "pricing"
  | "download"
  | "docs"
  | "changelog"
  | "privacy"
  | "terms"
  | "tips";

type Copy = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
};

// VI = Vietnamese audience learning English (primary market).
// EN = English-speaker audience learning Mandarin Chinese / HSK (secondary market).
const COPY: Record<PageMetaKey, Record<SeoLang, Copy>> = {
  home: {
    vi: {
      title: "Vô chi · Học tiếng Anh AI cùng thú ảo",
      description:
        "App AI học tiếng Anh cho người Việt. 5.300 từ IELTS/TOEIC, FSRS spaced repetition, pet ảo trên macOS/Windows. Miễn phí, offline.",
      keywords: [
        "học tiếng anh AI",
        "app AI học tiếng anh",
        "học tiếng anh với AI",
        "AI luyện tiếng anh",
        "AI học từ vựng tiếng anh",
        "AI học IELTS",
        "AI học TOEIC",
        "app học tiếng anh cho người việt",
        "pet ảo học tiếng anh",
        "spaced repetition tiếng anh",
        "FSRS",
        "vô chi",
        "vochi",
      ],
      ogTitle: "Vô chi · Học tiếng Anh AI cùng thú ảo",
      ogDescription:
        "App AI học từ vựng tiếng Anh cho người Việt. IELTS/TOEIC, FSRS, pet ảo trên desktop. macOS & Windows. Miễn phí.",
    },
    en: {
      title: "Vô chi · Learn Chinese with AI — HSK 1–6",
      description:
        "AI-powered Chinese vocabulary app for HSK 1–6. FSRS spaced repetition, a virtual pet on your desktop. macOS/Windows. Free, offline.",
      keywords: [
        "learn Chinese with AI",
        "learn Chinese AI",
        "AI Chinese learning app",
        "AI HSK app",
        "AI Mandarin app",
        "learn Mandarin AI",
        "Chinese vocabulary app AI",
        "HSK 1",
        "HSK 2",
        "HSK 3",
        "HSK 4",
        "HSK 5",
        "HSK 6",
        "spaced repetition Chinese",
        "FSRS Chinese",
        "desktop pet vocabulary",
        "vochi",
      ],
      ogTitle: "Vô chi · Learn Chinese with AI (HSK 1–6)",
      ogDescription:
        "AI-powered HSK vocabulary. FSRS spaced repetition. A pet on your desktop. macOS & Windows. Free.",
    },
  },
  pricing: {
    vi: {
      title: "Bảng giá · Free, Pro, Lifetime từ 59.000đ",
      description:
        "Vô chi Free trọn đời, Pro từ 59.000đ/tháng, Lifetime 599.000đ (5 thiết bị). Thanh toán VietQR, hoàn tiền 14–30 ngày.",
      keywords: [
        "vô chi giá",
        "vochi pricing",
        "app học tiếng anh giá",
        "học từ vựng lifetime",
        "IELTS TOEIC app pro",
        "spaced repetition app giá",
      ],
      ogTitle: "Vô chi · Bảng giá Free, Pro, Lifetime",
      ogDescription:
        "Free trọn đời. Pro 59.000đ/tháng. Lifetime 599.000đ, 5 thiết bị. Thanh toán VietQR.",
    },
    en: {
      title: "Pricing · Free, Pro, Lifetime, HSK Add-on",
      description:
        "Free forever. Pro from 59,000₫/month. Lifetime 599,000₫ (5 devices). HSK 4–6 unlock 50,000₫. VietQR checkout.",
      keywords: [
        "vochi pricing",
        "HSK app price",
        "learn Chinese app price",
        "Chinese vocabulary app lifetime",
        "spaced repetition app pricing",
        "FSRS app pricing",
      ],
      ogTitle: "Vô chi · Pricing (HSK & English)",
      ogDescription:
        "Free forever, Pro 59,000₫/mo, Lifetime 599,000₫, HSK 4–6 unlock 50,000₫.",
    },
  },
  download: {
    vi: {
      title: "Tải app học từ vựng cho macOS và Windows · Miễn phí",
      description:
        "Tải Vô chi cho macOS 12+ (Apple Silicon & Intel) và Windows 10+. App học từ vựng tiếng Anh cho người Việt. Miễn phí.",
      keywords: [
        "tải vô chi",
        "download vochi",
        "vochi macOS",
        "vochi windows",
        "app học từ vựng cho macbook",
        "tải app học tiếng anh",
      ],
      ogTitle: "Tải Vô chi · macOS & Windows",
      ogDescription:
        "Cài Vô chi trên macOS 12+ hoặc Windows 10+. Học từ vựng tiếng Anh mỗi ngày.",
    },
    en: {
      title: "Download the offline HSK vocabulary app · Free",
      description:
        "Download Vô chi for macOS 12+ (Apple Silicon & Intel) and Windows 10+. Learn Mandarin Chinese HSK vocabulary. Free.",
      keywords: [
        "download vochi",
        "vochi macOS",
        "vochi windows",
        "HSK app download",
        "learn Chinese app for Mac",
        "Chinese vocabulary app download",
      ],
      ogTitle: "Download Vô chi · macOS & Windows",
      ogDescription:
        "Install on macOS 12+ or Windows 10+. Learn HSK vocabulary daily.",
    },
  },
  docs: {
    vi: {
      title: "Hướng dẫn sử dụng · Cẩm nang 3 phút",
      description:
        "Cài đặt, hai chế độ học, quản lý từ vựng, thuật toán FSRS, kích hoạt license, khắc phục sự cố cho Vô chi.",
      keywords: [
        "hướng dẫn vô chi",
        "vochi docs",
        "cách cài vô chi",
        "FSRS spaced repetition",
        "kích hoạt license vô chi",
      ],
      ogTitle: "Vô chi · Hướng dẫn sử dụng",
      ogDescription: "Cài đặt, chế độ học, từ vựng, license, khắc phục sự cố.",
    },
    en: {
      title: "Docs · Get set up in 3 minutes",
      description:
        "Install, two study modes, vocabulary management, FSRS algorithm, license activation, troubleshooting for Vô chi.",
      keywords: [
        "vochi docs",
        "vochi help",
        "how to install vochi",
        "FSRS spaced repetition",
        "vochi license activation",
      ],
      ogTitle: "Vô chi · Docs",
      ogDescription:
        "Install, study modes, vocabulary, license, troubleshooting.",
    },
  },
  changelog: {
    vi: {
      title: "Changelog · Lịch sử cập nhật",
      description:
        "Tính năng mới, cải tiến và bản sửa lỗi của Vô chi. Đăng nhập Google, VietQR, chế độ ngủ theo lịch.",
      keywords: ["vô chi changelog", "vochi update", "lịch sử phiên bản vô chi"],
      ogTitle: "Vô chi · Changelog",
      ogDescription: "Tính năng mới, cải tiến, bản vá gần nhất.",
    },
    en: {
      title: "Changelog · Release notes",
      description:
        "New features, improvements and fixes in Vô chi. Google Sign-in, VietQR, scheduled sleep mode.",
      keywords: ["vochi changelog", "vochi release notes", "vochi updates"],
      ogTitle: "Vô chi · Changelog",
      ogDescription: "Latest features, improvements, patches.",
    },
  },
  privacy: {
    vi: {
      title: "Quyền riêng tư · Chính sách dữ liệu",
      description:
        "Chính sách quyền riêng tư của Vô chi tuân theo Nghị định 13/2023/NĐ-CP (PDPL) và GDPR. Dữ liệu học lưu trên thiết bị, không telemetry, không huấn luyện AI.",
      keywords: ["chính sách quyền riêng tư vô chi", "vochi privacy", "PDPL", "GDPR"],
      ogTitle: "Vô chi · Quyền riêng tư",
      ogDescription: "Dữ liệu lưu trên thiết bị. Không telemetry. Không huấn luyện AI.",
    },
    en: {
      title: "Privacy · Data policy",
      description:
        "Vô chi privacy policy under Vietnam PDPL (Decree 13/2023) and GDPR. Learning data stays on device. No telemetry. No AI training.",
      keywords: ["vochi privacy", "PDPL", "GDPR", "vocabulary app privacy"],
      ogTitle: "Vô chi · Privacy",
      ogDescription: "Data stays on device. No telemetry. No AI training.",
    },
  },
  tips: {
    vi: {
      title: "Mẹo học · Blog",
      description:
        "Mẹo học từ vựng tiếng Anh cho người Việt: IELTS, TOEIC, FSRS, spaced repetition. Bài viết ngắn, có thể áp dụng ngay.",
      keywords: [
        "mẹo học tiếng anh",
        "học từ vựng IELTS",
        "học TOEIC",
        "SRS tiếng anh",
        "FSRS",
        "blog vô chi",
      ],
      ogTitle: "Vô chi · Mẹo học tiếng Anh",
      ogDescription: "IELTS, TOEIC, FSRS, SRS. Bài ngắn, áp dụng ngay.",
    },
    en: {
      title: "Tips · Blog",
      description:
        "Tips for learning Mandarin Chinese: HSK 1–6, characters, tones, FSRS spaced repetition. Short posts you can act on today.",
      keywords: [
        "learn Chinese tips",
        "HSK study tips",
        "learn Mandarin blog",
        "SRS Chinese",
        "FSRS Chinese",
        "Chinese vocabulary blog",
      ],
      ogTitle: "Vô chi · Learn Chinese tips",
      ogDescription: "HSK, characters, tones, FSRS. Short, actionable.",
    },
  },
  terms: {
    vi: {
      title: "Điều khoản dịch vụ",
      description:
        "Điều khoản sử dụng app Vô chi và website vochi.xyz. Giấy phép, thanh toán, hoàn tiền, quyền sở hữu trí tuệ.",
      keywords: ["điều khoản dịch vụ vô chi", "vochi terms"],
      ogTitle: "Vô chi · Điều khoản dịch vụ",
      ogDescription: "Giấy phép, thanh toán, hoàn tiền, quyền sở hữu trí tuệ.",
    },
    en: {
      title: "Terms of service",
      description:
        "Terms of use for the Vô chi app and vochi.xyz. License, payment, refund policy, IP rights.",
      keywords: ["vochi terms", "terms of service"],
      ogTitle: "Vô chi · Terms",
      ogDescription: "License, payment, refund, IP rights.",
    },
  },
};

function parseSeoLang(v: unknown): SeoLang | null {
  return v === "en" || v === "vi" ? v : null;
}

// VN visitors → learn English (vi copy). Everyone else → learn Chinese/HSK (en copy).
function langFromCountry(country: string | null | undefined): SeoLang | null {
  if (!country) return null;
  return country.trim().toUpperCase() === "VN" ? "vi" : "en";
}

// Accept-Language: return "vi" if the visitor lists any Vietnamese tag,
// otherwise "en" if any English tag is present. Null on no match.
function langFromAcceptLanguage(h: string | null): SeoLang | null {
  if (!h) return null;
  const lower = h.toLowerCase();
  if (/(^|[,\s;])vi(-|;|,|$)/.test(lower)) return "vi";
  if (/(^|[,\s;])en(-|;|,|$)/.test(lower)) return "en";
  return null;
}

// Priority (highest first):
//   1. explicit ?lang=vi|en  — link-shared, crawler-driven, deep-link overrides everything
//   2. vochi_lang cookie     — the user's own toggle
//   3. edge geo (Vercel/CF)  — VN → vi, else en; also what Googlebot from a US IP hits
//   4. Accept-Language       — best-effort when no geo header (dev, non-Vercel edge)
//   5. en                    — English-first product default (widest reach; VI signal wins upstream)
export async function resolveSeoLang(
  searchParamsLang?: string | string[] | undefined,
): Promise<SeoLang> {
  const raw = Array.isArray(searchParamsLang) ? searchParamsLang[0] : searchParamsLang;
  const fromParam = parseSeoLang(raw);
  if (fromParam) return fromParam;

  const cookieStore = await cookies();
  const fromCookie = parseSeoLang(cookieStore.get("vochi_lang")?.value);
  if (fromCookie) return fromCookie;

  const hdrs = await headers();
  const country =
    hdrs.get("x-vercel-ip-country") || hdrs.get("cf-ipcountry") || null;
  const fromGeo = langFromCountry(country);
  if (fromGeo) return fromGeo;

  const fromAccept = langFromAcceptLanguage(hdrs.get("accept-language"));
  if (fromAccept) return fromAccept;

  return "en";
}

// Layouts don't get searchParams; use the same order minus (1).
// html lang for the very first render — user cookie wins over geo so a picked
// language survives the return trip.
export async function resolveHtmlLang(): Promise<SeoLang> {
  const cookieStore = await cookies();
  const fromCookie = parseSeoLang(cookieStore.get("vochi_lang")?.value);
  if (fromCookie) return fromCookie;

  const hdrs = await headers();
  const country =
    hdrs.get("x-vercel-ip-country") || hdrs.get("cf-ipcountry") || null;
  const fromGeo = langFromCountry(country);
  if (fromGeo) return fromGeo;

  const fromAccept = langFromAcceptLanguage(hdrs.get("accept-language"));
  if (fromAccept) return fromAccept;

  return "en";
}

function altPath(path: string, lang: SeoLang): string {
  const clean = path === "/" ? "" : path;
  return lang === "en" ? `${clean || "/"}${clean ? "?lang=en" : "?lang=en"}` : clean || "/";
}

export function buildPageMetadata(
  key: PageMetaKey,
  path: string,
  lang: SeoLang,
  ogType: "website" | "article" = "website",
): Metadata {
  const c = COPY[key][lang];
  const canonical = altPath(path, lang);
  return {
    title: c.title,
    description: c.description,
    keywords: c.keywords,
    alternates: {
      canonical,
      languages: {
        "vi-VN": altPath(path, "vi"),
        "en-US": altPath(path, "en"),
        "x-default": altPath(path, "vi"),
      },
    },
    openGraph: {
      title: c.ogTitle,
      description: c.ogDescription,
      url: canonical,
      type: ogType,
      locale: NEXT_LOCALE[lang],
      alternateLocale: [NEXT_LOCALE[lang === "vi" ? "en" : "vi"]],
    },
    twitter: {
      card: "summary_large_image",
      title: c.ogTitle,
      description: c.ogDescription,
    },
  };
}
