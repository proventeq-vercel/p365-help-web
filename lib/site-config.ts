export const siteConfig = {
  name: "Proventeq365 Help",
  description:
    "Product documentation for Proventeq365, generated directly from the wiki markdown source.",
  // Default "last updated" date for pages without an `updated` frontmatter field.
  lastUpdated: "2026-10-26",
  publisher: { name: "Proventeq", url: "https://www.proventeq.com" },
  get baseUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "https://p365-help.vercel.app";
  }
};
