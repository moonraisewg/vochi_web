import type { Metadata } from "next";

const TITLE = "Tài liệu từ vựng tiếng Anh theo chủ đề (PDF miễn phí)";
const DESCRIPTION =
  "Bộ tài liệu từ vựng tiếng Anh theo chủ đề do Vô chi biên soạn, 58 trang, tải miễn phí dạng PDF. Không cần đăng ký.";

// Metadata khai ở layout vì page.tsx là client component (dùng useSearchParams
// để đọc ?unsub=1) — client component không export được `metadata`.
//
// `canonical` trỏ về "/tai-lieu" không kèm query, nên biến thể ?unsub=1 mà người
// dùng bấm từ link huỷ đăng ký trong mail không bị index thành một trang riêng.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "tài liệu từ vựng tiếng anh",
    "từ vựng tiếng anh theo chủ đề",
    "tài liệu tiếng anh pdf",
    "học từ vựng tiếng anh miễn phí",
    "ebook từ vựng tiếng anh",
  ],
  alternates: { canonical: "/tai-lieu" },
  openGraph: {
    type: "article",
    url: "/tai-lieu",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-tai-lieu.png",
        width: 1200,
        height: 630,
        alt: "Tài liệu từ vựng tiếng Anh theo chủ đề · 58 trang · PDF miễn phí",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-tai-lieu.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
