import type { MetadataRoute } from "next";

const SITE_URL = "https://vochi.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/pricing", "/download", "/docs", "/changelog", "/checkout"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/pricing" || path === "/download" ? 0.9 : 0.6,
  }));
}
