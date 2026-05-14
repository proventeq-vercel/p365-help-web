export const siteConfig = {
  name: "Proventeq365 Help",
  description:
    "Product documentation for Proventeq365, generated directly from the wiki markdown source.",
  get baseUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "https://p365-help.vercel.app";
  }
};
