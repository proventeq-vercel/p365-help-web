export const siteConfig = {
  name: "P365 Help",
  description:
    "Product documentation for CPS Governance 360 (P365), generated directly from the wiki markdown source.",
  get baseUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "https://p365-help.vercel.app";
  }
};
