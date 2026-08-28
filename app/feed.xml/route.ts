import { buildFeed } from "@/lib/tips/feed";

// Static: nội dung chỉ đổi khi có bài mới, mà bài mới thì phải deploy lại.
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildFeed("vi"), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
