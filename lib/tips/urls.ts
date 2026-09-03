import type { SeoLang } from "@/lib/seo/pageMeta";

// Một chỗ duy nhất dựng URL của bài viết. Trước đây sitemap và trang bài tự ghép
// chuỗi riêng, hai chỗ lệch nhau là canonical không khớp sitemap mà không ai thấy.
export const SITE_URL = "https://vochi.xyz";

type PostRef = { slug: string; lang: SeoLang };

/** Đường dẫn canonical của bài, kèm ?lang=en cho bài tiếng Anh. */
export function postPath(post: PostRef): string {
  return `/tips/${post.slug}${post.lang === "en" ? "?lang=en" : ""}`;
}

export function postUrl(post: PostRef): string {
  return `${SITE_URL}${postPath(post)}`;
}

/** Ảnh OG riêng của bài, do scripts/gen-og.tsx sinh ở prebuild. */
export function ogImagePath(post: { slug: string }): string {
  return `/og/tips/${post.slug}.png`;
}

export function ogImageUrl(post: { slug: string }): string {
  return `${SITE_URL}${ogImagePath(post)}`;
}
