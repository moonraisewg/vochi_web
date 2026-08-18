import type { MetadataRoute } from "next";

const SITE_URL = "https://vochi.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/pricing", "/download", "/docs", "/changelog", "/checkout", "/tai-lieu"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/pricing" || path === "/download"
          ? 0.9
          : // Trang tài liệu là cửa hút traffic tự nhiên ("từ vựng tiếng anh pdf"),
            // đáng ưu tiên hơn /docs hay /changelog.
            path === "/tai-lieu"
            ? 0.8
            : 0.6,
  }));
}
