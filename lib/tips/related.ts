import type { SeoLang } from "@/lib/seo/pageMeta";


export type Relatable = {
  slug: string;
  lang: SeoLang;
  tags: string[];
  publishedAt: string;
};

/**
 * Ba bài liên quan nhất cùng ngôn ngữ: ưu tiên số tag trùng, hoà thì bài mới hơn.
 *
 * Cố ý luôn trả về bài kể cả khi không trùng tag nào — mục đích là không để bài
 * nào mồ côi (21/21 bài trước đây không có internal link nào), nên "bài mới nhất
 * cùng ngôn ngữ" vẫn tốt hơn là không link gì.
 */
export function relatedPosts<T extends Relatable>(post: T, all: T[], limit = 3): T[] {
  return all
    .filter((p) => p.lang === post.lang && p.slug !== post.slug)
    .map((p) => ({ post: p, shared: p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort(
      (a, b) =>
        b.shared - a.shared || b.post.publishedAt.localeCompare(a.post.publishedAt),
    )
    .slice(0, limit)
    .map((x) => x.post);
}
