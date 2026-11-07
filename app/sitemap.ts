import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { destinations, tours } from "@/lib/kept-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/credits`, changeFrequency: "yearly", priority: 0.2 },
    ...destinations.map((destination) => ({ url: `${base}/destination?slug=${destination.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...tours.map((tour) => ({ url: `${base}/tour?slug=${tour.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
