import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, resolveSeoLang, type SeoLang } from "@/lib/seo/pageMeta";
import { listPosts } from "@/lib/tips/posts";
import { TipsShell } from "./tips-shell";

type Props = { searchParams: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = await resolveSeoLang((await searchParams).lang);
  return buildPageMetadata("tips", "/tips", lang, "website");
}

const COPY = {
  vi: {
    eyebrow: "Blog",
    title: "Mẹo học tiếng Anh",
    lede: "Bài viết ngắn, có thể áp dụng ngay. Không giáo điều.",
    read: "Đọc",
    minutes: "phút đọc",
  },
  en: {
    eyebrow: "Blog",
    title: "Learn Chinese tips",
    lede: "Short posts. Actionable. No fluff.",
    read: "Read",
    minutes: "min read",
  },
} as const;

export default async function Page({ searchParams }: Props) {
  const lang: SeoLang = await resolveSeoLang((await searchParams).lang);
  const posts = listPosts(lang);
  const t = COPY[lang];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: t.title,
    inLanguage: lang === "vi" ? "vi-VN" : "en-US",
    url: `https://vochi.xyz/tips${lang === "en" ? "?lang=en" : ""}`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://vochi.xyz/tips/${p.slug}${lang === "en" ? "?lang=en" : ""}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt ?? p.publishedAt,
      keywords: p.keywords.join(", "),
    })),
  };

  return (
    <TipsShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-[900px] px-6 pb-24 pt-28 md:pt-36">
        <p className="micro text-[var(--color-ink-muted)]">{t.eyebrow}</p>
        <h1 className="mt-3 font-display text-[36px] leading-[1.05] tracking-tight md:text-[64px] md:leading-[1.02]">
          {t.title}
        </h1>
        <p className="mt-5 max-w-[560px] text-[16px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[18px]">
          {t.lede}
        </p>

        <ul className="mt-14 divide-y divide-[var(--color-hairline)] border-t border-[var(--color-hairline)]">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/tips/${p.slug}${lang === "en" ? "?lang=en" : ""}`}
                className="group flex flex-col gap-2 py-7 transition-colors hover:bg-[var(--color-tint)]"
              >
                <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                  <time dateTime={p.publishedAt}>{p.publishedAt}</time>
                  <span>·</span>
                  <span>
                    {p.readingMinutes} {t.minutes}
                  </span>
                  {p.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[var(--color-ink-muted)]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-[24px] leading-[1.15] tracking-tight text-[var(--color-ink)] group-hover:underline md:text-[32px]">
                  {p.title}
                </h2>
                <p className="max-w-[640px] text-[15px] leading-[1.55] text-[var(--color-ink-soft)]">
                  {p.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </TipsShell>
  );
}
