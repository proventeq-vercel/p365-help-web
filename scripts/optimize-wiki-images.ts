import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const WIKI_ROOT = path.join(process.cwd(), "wiki");
const WEBP_CACHE_ROOT = path.join(WIKI_ROOT, "_webp-cache");
const CONVERTIBLE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

interface ImageFile {
  relativePath: string;
  absolutePath: string;
  extension: string;
}

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listConvertibleImages(dir: string, results: ImageFile[] = [], base = dir): Promise<ImageFile[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "_webp-cache") {
      continue;
    }

    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await listConvertibleImages(absolutePath, results, base);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (!CONVERTIBLE_EXTENSIONS.has(extension)) {
      continue;
    }

    results.push({
      relativePath: path.relative(base, absolutePath),
      absolutePath,
      extension
    });
  }

  return results;
}

function toWebpRelativePath(relativePath: string) {
  const ext = path.extname(relativePath);
  return `${relativePath.slice(0, -ext.length)}.webp`;
}

async function needsRegeneration(sourcePath: string, targetPath: string) {
  if (!(await pathExists(targetPath))) {
    return true;
  }

  const [sourceStat, targetStat] = await Promise.all([fs.stat(sourcePath), fs.stat(targetPath)]);
  return sourceStat.mtimeMs > targetStat.mtimeMs;
}

async function optimizeImage(sourcePath: string, targetPath: string, extension: string) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });

  const transformer = sharp(sourcePath).rotate();
  if (extension === ".png") {
    await transformer
      .webp({
        quality: 92,
        effort: 6,
        nearLossless: true,
        smartSubsample: true
      })
      .toFile(targetPath);
    return;
  }

  await transformer
    .webp({
      quality: 86,
      effort: 6,
      smartSubsample: true
    })
    .toFile(targetPath);
}

async function run() {
  const images = await listConvertibleImages(WIKI_ROOT);
  let optimized = 0;
  let skipped = 0;

  for (const image of images) {
    const webpRelative = toWebpRelativePath(image.relativePath);
    const webpTargetPath = path.join(WEBP_CACHE_ROOT, webpRelative);

    if (!(await needsRegeneration(image.absolutePath, webpTargetPath))) {
      skipped += 1;
      continue;
    }

    await optimizeImage(image.absolutePath, webpTargetPath, image.extension);
    optimized += 1;
  }

  console.log(
    `[optimize:images] Optimized ${optimized} image(s), skipped ${skipped} up-to-date file(s). Cache: ${path.relative(process.cwd(), WEBP_CACHE_ROOT)}`
  );
}

run().catch((error: unknown) => {
  console.error("[optimize:images] Failed:", error);
  process.exit(1);
});
