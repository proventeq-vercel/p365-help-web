# P365 Help Website

This project turns the `/wiki` markdown tree into a fast, SEO-friendly documentation website deployable on Vercel.

## Key design choices

- **Wiki is source of truth:** Pages are generated directly from `wiki/**/*.md`.
- **Friendly URLs:** Numeric prefixes are removed from URLs (for example `wiki/01-navigation-menu/README.md` -> `/navigation-menu`).
- **Static generation:** All docs routes are pre-rendered at build time for performance.
- **AI-readable:** Semantic HTML, predictable heading anchors, `llms.txt`, and crawlable internal links.
- **Resend-style docs UX:** Persistent sidebar, breadcrumbs, previous/next links, and an on-page table of contents.

## Local development

```bash
bun install
bun run dev
```

Open <http://localhost:3000>.

## Deploy on Vercel

1. Import this repository in Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to your production URL (for canonical links and sitemap).
3. `vercel.json` is included with build/install commands and `wiki/**/*` file inclusion for the wiki asset route.
4. Deploy.

Whenever markdown in `/wiki` changes, redeploy to regenerate the whole docs site.

## Wiki authoring recommendations

To improve long-term maintainability, SEO quality, and AI retrieval quality:

1. Add frontmatter to each page:

   ```md
   ---
   title: Manage Workspaces
   description: Configure and schedule workspace scans.
   ---
   ```

2. Keep exactly one `# H1` per file and use ordered `##`/`###` headings beneath it.
3. Replace generic image alt text with descriptive alt text.
4. Keep links markdown-relative (`./other-page.md`) so they remain portable.
5. Fix broken anchors (for example links to `#hub-site` where the heading is on another page).
