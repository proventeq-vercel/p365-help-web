import type { MetadataRoute } from "next";

import { getDocsData } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return getDocsData().docs.map((doc) => ({
    url: `${siteConfig.baseUrl}${doc.url}`,
    changeFrequency: "weekly",
    priority: doc.url === "/" ? 1 : 0.7
  }));
}
