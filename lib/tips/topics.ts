import type { Metadata } from "next";
import type { SeoLang } from "@/lib/seo/pageMeta";

export type TopicKey =
  | "learning-tip"
  | "meo-hoc-tieng-anh"
  | "meo-thi-ielts"
  | "meo-thi-toeic";

// A topic is a keyword-rich URL that groups posts sharing at least one tag.
// Kept separate from PageMetaKey so we do not force /tips/index copy on hubs.
export type Topic = {
  key: TopicKey;
  path: `/${TopicKey}`;
  lang: SeoLang;
  matchTags: string[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  hero: {
    eyebrow: string;
    title: string;
    lede: string;
  };
  emptyState: string;
  relatedLabel: string;
  relatedLinks: Array<{ href: string; label: string }>;
};

const CTA_DOWNLOAD_VI = { href: "/download", label: "Tải Vô chi miễn phí" };
const CTA_PRICING_VI = { href: "/pricing", label: "Xem bảng giá" };
const CTA_TIPS_VI = { href: "/tips", label: "Xem toàn bộ blog" };
const CTA_DOWNLOAD_EN = { href: "/download?lang=en", label: "Download Vô chi free" };
const CTA_TIPS_EN = { href: "/tips?lang=en", label: "See all posts" };

export const TOPICS: Record<TopicKey, Topic> = {
  "learning-tip": {
    key: "learning-tip",
    path: "/learning-tip",
    lang: "en",
    matchTags: ["HSK", "SRS", "FSRS", "Beginner", "Characters", "Mandarin"],
    metaTitle: "Learning tips · Mandarin Chinese & HSK study guide",
    metaDescription:
      "Study tips for Mandarin Chinese and HSK 1–6. Spaced repetition, character memorization, tones, daily 10-minute plans that stick.",
    metaKeywords: [
      "learning tips",
      "learn Chinese tips",
      "HSK study tips",
      "spaced repetition Chinese",
      "FSRS Chinese",
      "Chinese vocabulary tips",
      "how to learn Mandarin",
    ],
    hero: {
      eyebrow: "Learning tips",
      title: "Learn Chinese without burning out",
      lede:
        "Short, actionable posts on HSK vocabulary, character memorization, tones, and using FSRS spaced repetition to keep 90% retention.",
    },
    emptyState: "New posts land here weekly. Check back soon.",
    relatedLabel: "Keep going",
    relatedLinks: [CTA_DOWNLOAD_EN, CTA_TIPS_EN],
  },
  "meo-hoc-tieng-anh": {
    key: "meo-hoc-tieng-anh",
    path: "/meo-hoc-tieng-anh",
    lang: "vi",
    matchTags: ["IELTS", "TOEIC", "Vocabulary", "SRS", "FSRS", "Anki"],
    metaTitle: "Mẹo học tiếng Anh · Từ vựng, IELTS, TOEIC bằng SRS",
    metaDescription:
      "Mẹo học tiếng Anh cho người Việt: 5.300 từ IELTS/TOEIC, spaced repetition, FSRS, chống burn-out. Bài ngắn, áp dụng ngay.",
    metaKeywords: [
      "mẹo học tiếng anh",
      "cách học từ vựng tiếng anh",
      "học tiếng anh mỗi ngày",
      "học tiếng anh cho người việt",
      "SRS tiếng anh",
      "FSRS",
      "học tiếng anh không stress",
    ],
    hero: {
      eyebrow: "Mẹo học",
      title: "Học tiếng Anh cho người Việt",
      lede:
        "Từ vựng theo cấp độ, spaced repetition, mẹo giữ nhịp 10 phút/ngày. Không lời khuyên chung chung — thứ nào áp dụng được liền.",
    },
    emptyState: "Bài mới lên đều mỗi tuần. Quay lại xem sau nhé.",
    relatedLabel: "Đi tiếp",
    relatedLinks: [CTA_DOWNLOAD_VI, CTA_PRICING_VI, CTA_TIPS_VI],
  },
  "meo-thi-ielts": {
    key: "meo-thi-ielts",
    path: "/meo-thi-ielts",
    lang: "vi",
    matchTags: ["IELTS"],
    metaTitle: "Mẹo thi IELTS · Từ vựng, Writing, Speaking, Reading, Listening",
    metaDescription:
      "Mẹo luyện IELTS cho người Việt: 5.300 từ chia theo cấp độ, Writing Task 2, Speaking Part 2 vocab, spaced repetition FSRS, không burn-out.",
    metaKeywords: [
      "mẹo thi IELTS",
      "học từ vựng IELTS",
      "luyện IELTS",
      "IELTS Writing Task 2",
      "IELTS Speaking",
      "IELTS Reading vocabulary",
      "app học IELTS cho người việt",
    ],
    hero: {
      eyebrow: "IELTS",
      title: "Mẹo thi IELTS",
      lede:
        "Chiến lược học từ vựng IELTS bằng FSRS, chia cấp độ, gắn theo chủ đề Writing/Speaking. Tăng band mà không cần cày 6 tiếng/ngày.",
    },
    emptyState: "Đang chuẩn bị thêm bài IELTS chuyên sâu. Sắp có.",
    relatedLabel: "Tiếp theo",
    relatedLinks: [CTA_DOWNLOAD_VI, CTA_PRICING_VI, CTA_TIPS_VI],
  },
  "meo-thi-toeic": {
    key: "meo-thi-toeic",
    path: "/meo-thi-toeic",
    lang: "vi",
    matchTags: ["TOEIC"],
    metaTitle: "Mẹo thi TOEIC · Từ vựng, Listening, Reading cho người Việt",
    metaDescription:
      "Cách luyện TOEIC bằng spaced repetition: từ vựng theo Part 5–7, Listening cụm cố định, chiến thuật quản lý thời gian. Bài ngắn, thực chiến.",
    metaKeywords: [
      "mẹo thi TOEIC",
      "học từ vựng TOEIC",
      "luyện TOEIC",
      "TOEIC Listening",
      "TOEIC Reading",
      "app học TOEIC cho người việt",
      "TOEIC Part 5",
    ],
    hero: {
      eyebrow: "TOEIC",
      title: "Mẹo thi TOEIC",
      lede:
        "Từ vựng TOEIC theo Part, chiến lược Listening cụm cố định, quản lý thời gian phòng thi. Ngắn gọn, tập trung vào điểm số.",
    },
    emptyState: "Bài TOEIC đang được viết. Trong lúc chờ, xem mẹo học tiếng Anh chung.",
    relatedLabel: "Tiếp theo",
    relatedLinks: [
      { href: "/meo-hoc-tieng-anh", label: "Mẹo học tiếng Anh chung" },
      CTA_DOWNLOAD_VI,
      CTA_TIPS_VI,
    ],
  },
};

export function getTopic(key: TopicKey): Topic {
  return TOPICS[key];
}

export function topicKeys(): TopicKey[] {
  return Object.keys(TOPICS) as TopicKey[];
}

// Topic hubs have a single canonical URL per language (VI hubs live on their
// slug, EN hub on ?lang=en). No cross-lang alternates because there is no
// equivalent slug in the other lang — e.g. /meo-thi-ielts has no EN twin.
export function buildTopicMetadata(topic: Topic): Metadata {
  const canonical = topic.lang === "en" ? `${topic.path}?lang=en` : topic.path;
  const locale = topic.lang === "vi" ? "vi_VN" : "en_US";
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    keywords: topic.metaKeywords,
    alternates: {
      canonical,
      languages: {
        [topic.lang === "vi" ? "vi-VN" : "en-US"]: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      type: "website",
      url: canonical,
      locale,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: topic.metaTitle,
      description: topic.metaDescription,
    },
  };
}
