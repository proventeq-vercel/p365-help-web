import fs from "node:fs";
import path from "node:path";

import { WIKI_ROOT } from "@/lib/docs";

interface RouteProps {
  params: Promise<{ assetPath: string[] }>;
}

const mimeByExtension: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { assetPath } = await params;
  const decoded = assetPath.map((segment) => decodeURIComponent(segment));
  const candidatePath = path.resolve(WIKI_ROOT, decoded.join(path.sep));
  const relativeToRoot = path.relative(WIKI_ROOT, candidatePath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return new Response("Not found", { status: 404 });
  }

  if (!fs.existsSync(candidatePath) || !fs.statSync(candidatePath).isFile()) {
    return new Response("Not found", { status: 404 });
  }

  const extension = path.extname(candidatePath).toLowerCase();
  const mimeType = mimeByExtension[extension] ?? "application/octet-stream";
  const file = fs.readFileSync(candidatePath);

  return new Response(file, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
