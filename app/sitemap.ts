import type { MetadataRoute } from "next";

import { DOCS_BASE, getDocsData } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const landing: MetadataRoute.Sitemap[number] = {
    url: siteConfig.baseUrl,
    changeFrequency: "weekly",
    priority: 1
  };

  const docs = getDocsData().docs.map((doc) => ({
    url: `${siteConfig.baseUrl}${doc.url}`,
    changeFrequency: "weekly" as const,
    priority: doc.url === DOCS_BASE ? 0.9 : 0.7
  }));

  return [landing, ...docs];
}
