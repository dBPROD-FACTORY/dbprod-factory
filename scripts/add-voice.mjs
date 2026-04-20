// Helper script — add a voice actor audio sample
//
// Usage:
//   node scripts/add-voice.mjs <input-audio> [output-slug]
//
// Examples:
//   node scripts/add-voice.mjs ~/Desktop/leila.wav leila-m
//   node scripts/add-voice.mjs /path/to/jean.mp3 jean-d
//
// What it does:
//   1. Converts the input to MP3 192kbps (or copies if already a lean MP3)
//   2. Places the result in public/media/voices/<slug>.mp3
//   3. Prints the value to paste into PagesCMS "Extrait audio" field
//
// Requirements: ffmpeg must be installed (brew install ffmpeg / choco install ffmpeg)

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync, execSync } from "node:child_process";

// ── helpers ────────────────────────────────────────────────────────────────

const red   = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const bold  = (s) => `\x1b[1m${s}\x1b[0m`;
const mb    = (n) => (n / 1024 / 1024).toFixed(2) + " MB";

function ffmpegAvailable() {
  try { execSync("ffmpeg -version", { stdio: "ignore" }); return true; }
  catch { return false; }
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── args ───────────────────────────────────────────────────────────────────

const [,, input, slugArg] = process.argv;

if (!input) {
  console.error(red("Usage: node scripts/add-voice.mjs <input-audio> [output-slug]"));
  process.exit(1);
}

const absInput = path.resolve(input);
try { await fs.access(absInput); }
catch {
  console.error(red(`File not found: ${absInput}`));
  process.exit(1);
}

if (!ffmpegAvailable()) {
  console.error(red("ffmpeg not found. Install it first:"));
  console.error("  Windows : choco install ffmpeg   (or download from ffmpeg.org)");
  console.error("  Mac     : brew install ffmpeg");
  process.exit(1);
}

const basename  = path.basename(absInput, path.extname(absInput));
const slug      = slugArg ? slugify(slugArg) : slugify(basename);
const outDir    = path.resolve("public/media/voices");
const outFile   = path.join(outDir, `${slug}.mp3`);

await fs.mkdir(outDir, { recursive: true });

// ── check existing ─────────────────────────────────────────────────────────

const extIn     = path.extname(absInput).toLowerCase();
const statIn    = await fs.stat(absInput);
const isMp3     = extIn === ".mp3";
const overLimit = statIn.size > 10 * 1024 * 1024;
const bitrate   = overLimit ? "128k" : "192k";

console.log(`\nInput : ${absInput} (${mb(statIn.size)})`);
console.log(`Output: ${outFile}`);
console.log(`Codec : MP3 ${bitrate}\n`);

// ── convert ────────────────────────────────────────────────────────────────

const tmp = outFile + ".tmp.mp3";

const res = spawnSync("ffmpeg", [
  "-y", "-i", absInput,
  "-vn", "-ac", "2", "-ar", "44100",
  "-codec:a", "libmp3lame", "-b:a", bitrate,
  tmp,
], { stdio: ["ignore", "ignore", "pipe"] });

if (res.status !== 0) {
  const errMsg = res.stderr?.toString() ?? "";
  console.error(red("ffmpeg failed:"));
  console.error(errMsg.slice(-600));
  try { await fs.unlink(tmp); } catch {}
  process.exit(1);
}

const statOut = await fs.stat(tmp);

// If it's already an MP3 and re-encoding made it bigger, keep original
if (isMp3 && statOut.size >= statIn.size) {
  await fs.unlink(tmp);
  await fs.copyFile(absInput, outFile);
  console.log(green(`✓ Kept original MP3 (re-encoding would be larger)`));
} else {
  await fs.rename(tmp, outFile);
  const saved = statIn.size - statOut.size;
  console.log(green(`✓ Done! ${mb(statIn.size)} → ${mb(statOut.size)}${saved > 0 ? ` (saved ${mb(saved)})` : ""}`));
}

// ── instructions ───────────────────────────────────────────────────────────

const cmsPath = `/media/voices/${slug}.mp3`;

console.log(`
${bold("Next steps:")}

1. ${bold("Commit & push")} the new file:
   git add public/media/voices/${slug}.mp3
   git commit -m "feat(voices): add ${slug} sample"
   git push

2. ${bold("In PagesCMS")} → Banque de voix → open the comedian's profile:
   • Champ "Extrait audio" → coller ce chemin :
     ${bold(cmsPath)}
   • Remplir "Durée (sec)" et "Seed (waveform)" si nécessaire

`);
