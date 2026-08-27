import type { MetadataRoute } from "next";

const SITE_URL = "https://vochi.xyz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout",
          "/checkout/",
          "/verify-email",
          "/reset-password",
          "/s/",
          "/share/stats",
          "/share/badge/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
