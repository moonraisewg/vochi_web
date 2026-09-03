import fs from "node:fs";
import path from "node:path";
import type { SeoLang } from "@/lib/seo/pageMeta";
import { parseFrontmatter, renderMarkdown, type Frontmatter } from "./markdown";

// Post shape emitted by the .md loader. Note this is NOT the JSX-based Post
// from ./types — bodies here are pre-rendered HTML strings so server pages can
// dangerouslySetInnerHTML without re-parsing at request time.
export type MdPost = {
  slug: string;
  lang: SeoLang;
  title: string;
  description: string;
  /** Chuỗi hiện trên SERP. Mặc định lấy title/description, nhưng tách riêng để
   *  giới hạn 60/160 ký tự của Google không ép phải cắt H1 hay lede cho khó đọc. */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  tags: string[];
  bodyHtml: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "tips");

function toStringArray(v: string | number | string[] | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toStr(v: string | number | string[] | undefined, fallback = ""): string {
  if (v === undefined) return fallback;
  return Array.isArray(v) ? v.join(", ") : String(v);
}

function toNum(v: string | number | string[] | undefined, fallback: number): number {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function parseLang(v: string | number | string[] | undefined): SeoLang {
  const s = toStr(v, "vi").toLowerCase();
  return s === "en" ? "en" : "vi";
}

function fromFrontmatter(slug: string, data: Frontmatter, bodyHtml: string): MdPost {
  const title = toStr(data.title, slug);
  const description = toStr(data.description);
  return {
    slug: toStr(data.slug, slug),
    lang: parseLang(data.lang),
    title,
    description,
    metaTitle: toStr(data.metaTitle, title),
    metaDescription: toStr(data.metaDescription, description),
    keywords: toStringArray(data.keywords),
    publishedAt: toStr(data.publishedAt, new Date().toISOString().slice(0, 10)),
    updatedAt: data.updatedAt ? toStr(data.updatedAt) : undefined,
    readingMinutes: toNum(data.readingMinutes, 5),
    tags: toStringArray(data.tags),
    bodyHtml,
  };
}

let cache: MdPost[] | null = null;

// Reads once per Node process. Rebuild triggers re-import → new cache.
export function loadAllPosts(): MdPost[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) {
    cache = [];
    return cache;
  }
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts: MdPost[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(raw);
    const html = renderMarkdown(body);
    posts.push(fromFrontmatter(file.replace(/\.md$/, ""), data, html));
  }
  cache = posts;
  return cache;
}

export function listMdPosts(lang: SeoLang): MdPost[] {
  return loadAllPosts()
    .filter((p) => p.lang === lang)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function findMdPost(slug: string): MdPost | null {
  return loadAllPosts().find((p) => p.slug === slug) ?? null;
}

export function allMdSlugs(): string[] {
  return loadAllPosts().map((p) => p.slug);
}
