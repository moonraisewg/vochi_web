import Link from "next/link";
import { postsForTopic } from "@/lib/tips/topics";
import type { Topic } from "@/lib/tips/topics";

const SITE_URL = "https://vochi.xyz";

const selectPosts = postsForTopic;

function buildJsonLd(topic: Topic, posts: ReturnType<typeof selectPosts>) {
  const langSuffix = topic.lang === "en" ? "?lang=en" : "";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}${topic.path}#hub`,
        name: topic.metaTitle,
        description: topic.metaDescription,
        inLanguage: topic.lang === "vi" ? "vi-VN" : "en-US",
        url: `${SITE_URL}${topic.path}`,
        hasPart: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${SITE_URL}/tips/${p.slug}${langSuffix}`,
          datePublished: p.publishedAt,
          dateModified: p.updatedAt ?? p.publishedAt,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: topic.hero.title,
            item: `${SITE_URL}${topic.path}`,
          },
        ],
      },
    ],
  };
}

const T = {
  vi: { read: "phút đọc" },
  en: { read: "min read" },
} as const;

export function TopicHub({ topic }: { topic: Topic }) {
  const posts = selectPosts(topic);
  const jsonLd = buildJsonLd(topic, posts);
  const langSuffix = topic.lang === "en" ? "?lang=en" : "";
  const t = T[topic.lang];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-[900px] px-6 pb-24 pt-28 md:pt-36">
        <p className="micro text-[var(--color-ink-muted)]">{topic.hero.eyebrow}</p>
        <h1 className="mt-3 font-display text-[36px] leading-[1.05] tracking-tight md:text-[64px] md:leading-[1.02]">
          {topic.hero.title}
        </h1>
        <p className="mt-5 max-w-[620px] text-[16px] leading-[1.55] text-[var(--color-ink-soft)] md:text-[18px]">
          {topic.hero.lede}
        </p>

        {posts.length > 0 ? (
          <ul className="mt-14 divide-y divide-[var(--color-hairline)] border-t border-[var(--color-hairline)]">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/tips/${p.slug}${langSuffix}`}
                  className="group flex flex-col gap-2 py-7 transition-colors hover:bg-[var(--color-tint)]"
                >
                  <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                    <time dateTime={p.publishedAt}>{p.publishedAt}</time>
                    <span>·</span>
                    <span>
                      {p.readingMinutes} {t.read}
                    </span>
                    {p.tags.slice(0, 2).map((tag) => (
                      <span key={tag}>#{tag}</span>
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
        ) : (
          <div className="mt-14 rounded-2xl border border-dashed border-[var(--color-hairline-strong)] bg-[var(--color-tint)] p-8">
            <p className="text-[16px] leading-[1.6] text-[var(--color-ink-soft)]">
              {topic.emptyState}
            </p>
          </div>
        )}

        <aside className="mt-16 border-t border-[var(--color-hairline)] pt-10">
          <div className="micro text-[var(--color-ink-muted)]">{topic.relatedLabel}</div>
          <ul className="mt-5 flex flex-wrap gap-3">
            {topic.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-5 py-2.5 text-[14px] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-tint)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
}
