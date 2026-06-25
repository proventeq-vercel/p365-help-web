// Shared route constants. Kept free of Node-only imports so this module can be
// pulled into client components without dragging `lib/docs.ts` (and its
// `node:fs`/`node:path` usage) into the browser bundle.

// All documentation lives under this base path. The site root (`/`) is the
// product landing page; the help docs are namespaced beneath it.
export const DOCS_BASE = "/proventeq365";
