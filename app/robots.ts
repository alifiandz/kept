import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/account"] }, sitemap: "https://kept.my.id/sitemap.xml", host: "https://kept.my.id" };
}
