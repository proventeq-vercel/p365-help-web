import { DOCS_BASE, getDocsData, type DocItem } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

// Follows the llms.txt convention (https://llmstxt.org): a summary, then one
// link list per top-level section, each link carrying the page description.
export function GET() {
  const { docs, bySlug } = getDocsData();
  const sections = new Map<string, DocItem[]>();

  for (const doc of docs) {
    if (doc.url === DOCS_BASE) {
      continue;
    }
    const sectionKey = doc.slugSegments[0];
    sections.set(sectionKey, [...(sections.get(sectionKey) ?? []), doc]);
  }

  const lines = [
    "# Proventeq365 Help Center",
    "",
    "> Proventeq365 monitors and governs Microsoft 365 (SharePoint Online, OneDrive, Microsoft Teams and Exchange Online): redundant, obsolete and trivial (ROT) content, oversharing and permissions, governance policies, archiving, and self-service provisioning. It is deployed into the customer's own Azure subscription.",
    "",
    `Base URL: ${siteConfig.baseUrl}`,
    `Full text of every page: ${siteConfig.baseUrl}/llms-full.txt`,
    "",
    "Start with the How-to Guides for task steps, the FAQ for short answers, and the Troubleshooting and Error Catalog sections for problems and error messages.",
    ""
  ];

  for (const [sectionKey, sectionDocs] of sections) {
    lines.push(`## ${bySlug.get(sectionKey)?.title ?? sectionKey}`, "");
    for (const doc of sectionDocs) {
      lines.push(`- [${doc.title}](${siteConfig.baseUrl}${doc.url}): ${doc.description}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    }
  });
}
