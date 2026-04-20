// Helper script — add / compress a photo before committing
//
// Usage:
//   node scripts/add-photo.mjs <input-image> <subfolder> [slug]
//
// Examples:
//   node scripts/add-photo.mjs ~/Desktop/studio-c.jpg studios studio-c
//   node scripts/add-photo.mjs ~/Desktop/leila.png voices leila-m
//   node scripts/add-photo.mjs ~/Desktop/cover.jpg posts article-mixage
//   node scripts/add-photo.mjs ~/Desktop/poster.jpg projects au-revoir
//
// Subfolders disponibles : studios  voices  posts  projects  samples
//
// What it does:
//   1. Resizes if wider than MAX_WIDTH (keeps aspect ratio)
//   2. Re-encodes as JPEG 85 (or PNG/WebP if input is PNG/WebP)
//   3. Saves to public/media/<subfolder>/<slug>.<ext>
//   4. Only writes if result is smaller than original
//   5. Prints the path to paste in PagesCMS

import fs from "node:fs/promises";
import path from "node:path";

const MAX_WIDTH = 2400;
const QUALITY   = 85;

const SUBFOLDERS = ["studios", "voices", "posts", "projects", "samples"];

// ── helpers ────────────────────────────────────────────────────────────────

const red   = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const bold  = (s) => `\x1b[1m${s}\x1b[0m`;
const mb    = (n) => (n / 1024 / 1024).toFixed(2) + " MB";
const kb    = (n) => (n / 1024).toFixed(1) + " KB";

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── args ───────────────────────────────────────────────────────────────────

const [,, input, subfolder, slugArg] = process.argv;

if (!input || !subfolder) {
  console.error(red("Usage: node scripts/add-photo.mjs <input-image> <subfolder> [slug]"));
  console.error(`Subfolders: ${SUBFOLDERS.join(" | ")}`);
  process.exit(1);
}

if (!SUBFOLDERS.includes(subfolder)) {
  console.error(red(`Unknown subfolder "${subfolder}". Choose from: ${SUBFOLDERS.join(", ")}`));
  process.exit(1);
}

const absInput = path.resolve(input);
try { await fs.access(absInput); }
catch {
  console.error(red(`File not found: ${absInput}`));
  process.exit(1);
}

// ── load sharp dynamically (optional dep) ─────────────────────────────────

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error(red("sharp not found. Run: npm install --no-save sharp"));
  process.exit(1);
}

// ── resolve output path ───────────────────────────────────────────────────

const extIn   = path.extname(absInput).toLowerCase();
const isPng   = extIn === ".png";
const isWebp  = extIn === ".webp";
const outExt  = isPng ? ".png" : isWebp ? ".webp" : ".jpg";

const basename = path.basename(absInput, extIn);
const slug     = slugArg ? slugify(slugArg) : slugify(basename);
const outDir   = path.resolve("public/media", subfolder);
const outFile  = path.join(outDir, `${slug}${outExt}`);

await fs.mkdir(outDir, { recursive: true });

const statIn = await fs.stat(absInput);
console.log(`\nInput : ${absInput} (${statIn.size > 1024*1024 ? mb(statIn.size) : kb(statIn.size)})`);
console.log(`Output: ${outFile}`);

// ── process ────────────────────────────────────────────────────────────────

const buf = await fs.readFile(absInput);
let img   = sharp(buf, { failOnError: false }).rotate();
const meta = await img.metadata();

if (meta.width && meta.width > MAX_WIDTH) {
  console.log(`Resizing from ${meta.width}px → ${MAX_WIDTH}px`);
  img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
}

let pipeline;
if (isPng)       pipeline = img.png({ quality: QUALITY, compressionLevel: 9 });
else if (isWebp) pipeline = img.webp({ quality: QUALITY });
else             pipeline = img.jpeg({ quality: QUALITY, mozjpeg: true });

const out = await pipeline.toBuffer();

if (out.length >= statIn.size) {
  // Output is larger — just copy the original
  await fs.copyFile(absInput, outFile);
  console.log(green(`✓ Kept original (compression wouldn't help) — ${statIn.size > 1024*1024 ? mb(statIn.size) : kb(statIn.size)}`));
} else {
  await fs.writeFile(outFile, out);
  const saved = statIn.size - out.length;
  console.log(green(`✓ Compressed! ${statIn.size > 1024*1024 ? mb(statIn.size) : kb(statIn.size)} → ${out.length > 1024*1024 ? mb(out.length) : kb(out.length)} (saved ${saved > 1024*1024 ? mb(saved) : kb(saved)})`));
}

// ── instructions ───────────────────────────────────────────────────────────

const cmsPath = `/media/${subfolder}/${slug}${outExt}`;

console.log(`
${bold("Next steps:")}

1. ${bold("Commit & push")} the new file:
   git add public/media/${subfolder}/${slug}${outExt}
   git commit -m "feat(media): add ${slug}"
   git push

2. ${bold("Dans PagesCMS")} — coller ce chemin dans le champ image :
   ${bold(cmsPath)}

`);
