import type { MetadataRoute } from "next";
import { insights } from "../lib/insights";
import { siteUrl } from "../lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/insights`, changeFrequency: "monthly", priority: 0.8 },
    ...insights.map((insight) => ({
      url: `${siteUrl}/insights/${insight.slug}`,
      lastModified: insight.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
