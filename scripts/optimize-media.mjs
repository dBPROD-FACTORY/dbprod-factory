// Recursively compress media files in public/media/ so nothing exceeds
// Cloudflare Pages' 25 MB per-file limit and bundles stay small.
//
// Images (jpg/jpeg/png/webp):
//  - jpg/jpeg: re-encode at quality 82 (mozjpeg), strip metadata
//  - png: quality 80, compressionLevel 9
//  - webp: quality 82
//  - Any image wider than MAX_WIDTH is downscaled
//
// Audio (wav/m4a/flac → mp3):
//  - Converts WAV/FLAC/M4A to MP3 at 192 kbps via ffmpeg
//  - MP3 files > 10 MB are re-encoded at 128 kbps to stay lean
//
// Skips files < 200 KB. Only rewrites if smaller.

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const ROOT = path.resolve("public/media");
const MAX_WIDTH = 4096;
const MIN_SIZE_BYTES = 200 * 1024;
const MAX_AUDIO_MB = 10;

const IMG_OPTS = {
  jpg: { quality: 82, mozjpeg: true },
  jpeg: { quality: 82, mozjpeg: true },
  png: { quality: 80, compressionLevel: 9 },
  webp: { quality: 82 },
};
const IMG_EXT = new Set(Object.keys(IMG_OPTS));
const AUDIO_EXT = new Set(["wav", "flac", "m4a", "aiff", "aif", "mp3"]);

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

const extOf = (p) => path.extname(p).toLowerCase().replace(".", "");
const mb = (n) => (n / 1024 / 1024).toFixed(2) + " MB";

async function optimizeImage(file) {
  const ext = extOf(file);
  const stat = await fs.stat(file);
  if (stat.size < MIN_SIZE_BYTES) return null;

  const buf = await fs.readFile(file);
  let img = sharp(buf, { failOnError: false }).rotate();
  const meta = await img.metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  const opts = IMG_OPTS[ext];
  const pipeline = ext === "png" ? img.png(opts) : ext === "webp" ? img.webp(opts) : img.jpeg(opts);
  const out = await pipeline.toBuffer();
  if (out.length >= stat.size) return { file, before: stat.size, after: stat.size, skipped: "no-gain" };
  await fs.writeFile(file, out);
  return { file, before: stat.size, after: out.length };
}

async function optimizeAudio(file) {
  const ext = extOf(file);
  const stat = await fs.stat(file);
  if (stat.size < MIN_SIZE_BYTES) return null;

  const isMp3 = ext === "mp3";
  const overLimit = stat.size > MAX_AUDIO_MB * 1024 * 1024;

  // MP3 within size budget → nothing to do.
  if (isMp3 && !overLimit) return null;

  const target = file.replace(/\.[^.]+$/, ".mp3");
  const tmp = target + ".tmp.mp3";
  const bitrate = overLimit ? "128k" : "192k";

  const res = spawnSync("ffmpeg", [
    "-y", "-i", file,
    "-vn", "-ac", "2", "-ar", "44100",
    "-codec:a", "libmp3lame", "-b:a", bitrate,
    tmp,
  ], { stdio: ["ignore", "ignore", "inherit"] });

  if (res.status !== 0) {
    try { await fs.unlink(tmp); } catch {}
    throw new Error("ffmpeg failed");
  }

  const newStat = await fs.stat(tmp);
  if (newStat.size >= stat.size && isMp3) {
    await fs.unlink(tmp);
    return { file, before: stat.size, after: stat.size, skipped: "no-gain" };
  }

  // Replace: remove original (if different ext), rename tmp → target
  if (file !== target) await fs.unlink(file);
  await fs.rename(tmp, target);
  return { file, after_file: target, before: stat.size, after: newStat.size };
}

const files = await walk(ROOT);
const results = [];
for (const f of files) {
  const ext = extOf(f);
  try {
    let r = null;
    if (IMG_EXT.has(ext)) r = await optimizeImage(f);
    else if (AUDIO_EXT.has(ext)) r = await optimizeAudio(f);
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
console.log(`\n✓ Optimized ${results.length} file(s):`);
for (const r of results) {
  const label = r.after_file && r.after_file !== r.file
    ? `${path.relative(ROOT, r.file)} → ${path.relative(ROOT, r.after_file)}`
    : path.relative(ROOT, r.file);
  console.log(`  ${label} — ${mb(r.before)} → ${mb(r.after)}`);
}
console.log(`\nTotal: ${mb(totBefore)} → ${mb(totAfter)} (saved ${mb(totBefore - totAfter)})`);
