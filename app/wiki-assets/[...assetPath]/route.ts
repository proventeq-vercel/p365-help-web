import fs from "node:fs";
import path from "node:path";

import { WIKI_ROOT } from "@/lib/docs";

interface RouteProps {
  params: Promise<{ assetPath: string[] }>;
}

const WEBP_CACHE_ROOT = path.join(WIKI_ROOT, "_webp-cache");

const mimeByExtension: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function safeResolve(root: string, relativePath: string) {
  const resolved = path.resolve(root, relativePath);
  const relativeToRoot = path.relative(root, resolved);
  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return null;
  }
  return resolved;
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { assetPath } = await params;
  const decoded = assetPath.map((segment) => decodeURIComponent(segment));
  const relativeAssetPath = decoded.join(path.sep);
  const requestedExtension = path.extname(relativeAssetPath).toLowerCase();

  const candidates = new Set<string>();

  if (requestedExtension === ".webp") {
    const cacheCandidate = safeResolve(WEBP_CACHE_ROOT, relativeAssetPath);
    if (cacheCandidate) {
      candidates.add(cacheCandidate);
    }
  }

  const directCandidate = safeResolve(WIKI_ROOT, relativeAssetPath);
  if (directCandidate) {
    candidates.add(directCandidate);
  }

  if (requestedExtension === ".webp") {
    const stem = relativeAssetPath.slice(0, -requestedExtension.length);
    for (const extension of [".png", ".jpg", ".jpeg"]) {
      const fallbackCandidate = safeResolve(WIKI_ROOT, `${stem}${extension}`);
      if (fallbackCandidate) {
        candidates.add(fallbackCandidate);
      }
    }
  }

  if (candidates.size === 0) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = [...candidates].find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!filePath) {
    return new Response("Not found", { status: 404 });
  }

  const extension = path.extname(filePath).toLowerCase();
  const mimeType = mimeByExtension[extension] ?? "application/octet-stream";
  const file = fs.readFileSync(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
