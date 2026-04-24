import { getDocsData } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET() {
  const docs = getDocsData().docs;
  const lines = [
    "# P365 Help Center",
    "",
    `Base URL: ${siteConfig.baseUrl}`,
    "This documentation is generated from markdown files in /wiki and is the canonical help source.",
    "",
    "## Pages",
    ...docs.map((doc) => `- ${siteConfig.baseUrl}${doc.url} — ${doc.title}`),
    "",
    "## Notes for AI agents",
    "- Use page headings and section anchors for granular retrieval.",
    "- Follow internal links between sections for context.",
    "- Prefer top-level section pages before deep plugin/report pages."
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    }
  });
}
