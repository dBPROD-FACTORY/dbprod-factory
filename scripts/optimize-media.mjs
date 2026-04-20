// Recursively compress images in public/media/ so that none exceeds
// Cloudflare Pages' 25 MB per-file limit, and bundles stay small.
//
// Rules:
//  - JPEG/JPG: re-encode at quality 82 (mozjpeg), strip metadata
//  - PNG: quality 80, compressionLevel 9
//  - WEBP: quality 82
//  - Any image wider than MAX_WIDTH is downscaled
//  - Only rewrites files if the new version is actually smaller
//  - Skips tiny files (< 200 KB) — not worth recompressing

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/media");
const MAX_WIDTH = 4096;
const MIN_SIZE_BYTES = 200 * 1024;

const OPTS = {
  jpg: { quality: 82, mozjpeg: true },
  jpeg: { quality: 82, mozjpeg: true },
  png: { quality: 80, compressionLevel: 9 },
  webp: { quality: 82 },
};

async function walk(dir) {
  const out = [];
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

function extOf(p) {
  return path.extname(p).toLowerCase().replace(".", "");
}

async function optimize(file) {
  const ext = extOf(file);
  if (!(ext in OPTS)) return null;
  const stat = await fs.stat(file);
  if (stat.size < MIN_SIZE_BYTES) return null;

  const buf = await fs.readFile(file);
  let img = sharp(buf, { failOnError: false }).rotate();
  const meta = await img.metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const opts = OPTS[ext];
  let pipeline;
  if (ext === "png") pipeline = img.png(opts);
  else if (ext === "webp") pipeline = img.webp(opts);
  else pipeline = img.jpeg(opts);

  const out = await pipeline.toBuffer();
  if (out.length >= stat.size) {
    return { file, before: stat.size, after: stat.size, skipped: "no-gain" };
  }
  await fs.writeFile(file, out);
  return { file, before: stat.size, after: out.length, skipped: null };
}

const files = await walk(ROOT);
const results = [];
for (const f of files) {
  try {
    const r = await optimize(f);
    if (r && !r.skipped) results.push(r);
    else if (r?.skipped) console.log(`- skip (${r.skipped}): ${path.relative(ROOT, f)}`);
  } catch (e) {
    console.warn(`! error on ${f}: ${e.message}`);
  }
}

if (results.length === 0) {
  console.log("✓ Nothing to optimize.");
  process.exit(0);
}

const totBefore = results.reduce((s, r) => s + r.before, 0);
const totAfter = results.reduce((s, r) => s + r.after, 0);
const mb = (n) => (n / 1024 / 1024).toFixed(2) + " MB";
console.log(`\n✓ Optimized ${results.length} file(s):`);
for (const r of results) {
  console.log(`  ${path.relative(ROOT, r.file)} — ${mb(r.before)} → ${mb(r.after)}`);
}
console.log(`\nTotal: ${mb(totBefore)} → ${mb(totAfter)} (saved ${mb(totBefore - totAfter)})`);
