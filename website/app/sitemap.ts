import type { MetadataRoute } from "next";
import { insights } from "../lib/insights";
import { siteUrl } from "../lib/site";
import { agencyPaths } from "../lib/agency";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap { return [
  ...agencyPaths.map(path => ({ url: `${siteUrl}${path}` })),
  ...insights.map(insight => ({ url: `${siteUrl}/insights/${insight.slug}/`, lastModified: insight.dateModified })),
]; }
