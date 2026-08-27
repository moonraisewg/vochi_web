import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allSlugs, findPost } from "@/lib/tips/posts";
import { TipsShell } from "../tips-shell";

type Props = { params: Promise<{ slug: string }> };

const SITE_URL = "https://vochi.xyz";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  const canonical = `/tips/${post.slug}${post.lang === "en" ? "?lang=en" : ""}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical,
      languages: {
        [post.lang === "vi" ? "vi-VN" : "en-US"]: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: canonical,
      locale: post.lang === "vi" ? "vi_VN" : "en_US",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/og.png"],
    },
  };
}

const COPY = {
  vi: {
    back: "← Về danh sách bài viết",
    updated: "Cập nhật",
    published: "Xuất bản",
    minutes: "phút đọc",
    ctaTitle: "Tải Vô chi miễn phí",
    ctaBody: "Pet ảo desktop giúp bạn luyện IELTS/TOEIC 10 phút/ngày.",
    ctaButton: "Tải cho macOS & Windows",
  },
  en: {
    back: "← Back to all tips",
    updated: "Updated",
    published: "Published",
    minutes: "min read",
    ctaTitle: "Get Vô chi free",
    ctaBody: "A desktop pet that helps you drill HSK vocabulary daily.",
    ctaButton: "Download for macOS & Windows",
  },
} as const;

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const t = COPY[post.lang];
  const url = `${SITE_URL}/tips/${post.slug}${post.lang === "en" ? "?lang=en" : ""}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        keywords: post.keywords.join(", "),
        inLanguage: post.lang === "vi" ? "vi-VN" : "en-US",
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        author: { "@type": "Organization", name: "Vô chi", url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: "Vô chi",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-bird.png` },
        },
        mainEntityOfPage: url,
        image: `${SITE_URL}/og.png`,
        articleSection: post.tags[0],
        wordCount: post.readingMinutes * 220,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tips", item: `${SITE_URL}/tips` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <TipsShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-[720px] px-6 pb-24 pt-28 md:pt-36">
        <Link
          href={`/tips${post.lang === "en" ? "?lang=en" : ""}`}
          className="micro text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          {t.back}
        </Link>

        <div className="mt-8 flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          <time dateTime={post.publishedAt}>
            {t.published}: {post.publishedAt}
          </time>
          <span>·</span>
          <span>
            {post.readingMinutes} {t.minutes}
          </span>
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <h1 className="mt-4 font-display text-[34px] leading-[1.05] tracking-tight md:text-[56px] md:leading-[1.02]">
          {post.title}
        </h1>

        <p className="mt-5 text-[17px] leading-[1.6] text-[var(--color-ink-soft)] md:text-[19px]">
          {post.description}
        </p>

        <div
          className="prose-tips mt-14"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />

        <aside className="mt-16 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-tint)] p-6 md:p-8">
          <div className="micro text-[var(--color-ink-muted)]">{t.ctaTitle}</div>
          <p className="mt-2 text-[16px] leading-[1.5] text-[var(--color-ink)]">
            {t.ctaBody}
          </p>
          <Link
            href={`/download${post.lang === "en" ? "?lang=en" : ""}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-[14px] font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-accent-deep)]"
          >
            {t.ctaButton}
            <span aria-hidden>↓</span>
          </Link>
        </aside>
      </article>
    </TipsShell>
  );
}
