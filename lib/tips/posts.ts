import type { SeoLang } from "@/lib/seo/pageMeta";
import type { Post } from "./types";
import { allMdSlugs, findMdPost, listMdPosts } from "./loader";

// Registry is now file-based. Author posts as .md under content/tips/;
// loader.ts parses frontmatter + body at read time. See lib/tips/loader.ts.

export function listPosts(lang: SeoLang): Post[] {
  return listMdPosts(lang);
}

export function findPost(slug: string): Post | null {
  return findMdPost(slug);
}

export function allSlugs(): string[] {
  return allMdSlugs();
}
