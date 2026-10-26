import { DOCS_BASE, type DocItem } from "@/lib/docs";
import { toPlainText } from "@/lib/search";
import { siteConfig } from "@/lib/site-config";

interface Crumb {
  href: string;
  label: string;
}

interface Section {
  heading: string;
  lines: string[];
}

/**
 * Splits a Markdown body into sections at headings of the given level. Lines
 * inside fenced code blocks are never treated as headings (PowerShell and Bash
 * comments start with `#`). A section ends at the next heading of the same or
 * a higher level.
 */
function splitSections(markdown: string, level: 2 | 3): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
    }

    const heading = inFence ? null : line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const headingLevel = heading[1].length;
      if (headingLevel === level) {
        current = { heading: toPlainText(heading[2]), lines: [] };
        sections.push(current);
        continue;
      }
      if (headingLevel < level) {
        current = null;
        continue;
      }
    }

    current?.lines.push(line);
  }

  return sections;
}

/** Each `### Question?` heading and the text beneath it becomes one FAQ entry. */
function extractFaqEntries(markdown: string) {
  return splitSections(markdown, 3)
    .filter((section) => section.heading.endsWith("?"))
    .map((section) => ({ question: section.heading, answer: toPlainText(section.lines.join("\n")) }))
    .filter((entry) => entry.answer.length > 0);
}

/** The top-level items of the ordered list under `## Steps` become HowTo steps. */
function extractHowToSteps(markdown: string) {
  const stepsSection = splitSections(markdown, 2).find((section) => /^steps$/i.test(section.heading));
  if (!stepsSection) {
    return [];
  }

  const steps: string[] = [];
  let inFence = false;
  for (const line of stepsSection.lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
    }
    const item = inFence ? null : line.match(/^\d+\.\s+(.+)$/);
    if (item) {
      steps.push(item[1]);
    } else if (steps.length > 0 && line.trim() && !inFence && !line.trim().startsWith("![")) {
      steps[steps.length - 1] += ` ${line.trim()}`;
    }
  }

  return steps.map((step) => toPlainText(step)).filter(Boolean);
}

/**
 * JSON-LD for a documentation page: a TechArticle (WebSite for the docs home)
 * with breadcrumbs, plus a FAQPage or HowTo node when the page `type` calls for one.
 */
export function buildStructuredData(doc: DocItem, crumbs: Crumb[]) {
  const url = `${siteConfig.baseUrl}${doc.url}`;
  const publisher = { "@type": "Organization", ...siteConfig.publisher };
  const isHome = doc.url === DOCS_BASE;

  const page = {
    "@type": isHome ? "WebSite" : "TechArticle",
    "@id": `${url}#page`,
    name: doc.title,
    headline: doc.title,
    description: doc.description,
    url,
    inLanguage: "en-GB",
    dateModified: doc.updated,
    publisher,
    about: { "@type": "SoftwareApplication", name: "Proventeq365", applicationCategory: "BusinessApplication" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: `${siteConfig.baseUrl}${crumb.href}`
      }))
    }
  };

  const graph: Record<string, unknown>[] = [page];

  if (doc.type === "faq") {
    const entries = extractFaqEntries(doc.content);
    if (entries.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        mainEntity: entries.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer }
        }))
      });
    }
  }

  if (doc.type === "howto") {
    const steps = extractHowToSteps(doc.content);
    if (steps.length > 0) {
      graph.push({
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: doc.title,
        description: doc.description,
        url,
        step: steps.map((text, index) => ({ "@type": "HowToStep", position: index + 1, text }))
      });
    }
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** "2026-10-26" → "Oct 2026", for the article meta line. */
export function formatUpdated(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
}
