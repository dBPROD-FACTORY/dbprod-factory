// Migrate WordPress posts → Astro content collection
// - Pulls all posts from https://dbprod-factory.com/wp-json/wp/v2
// - Downloads featured images to public/images/blog/
// - Converts HTML → Markdown (Turndown)
// - Writes one .md per post to src/content/posts/

import { writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, createWriteStream } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import TurndownService from 'turndown';

const BASE = 'https://dbprod-factory.com/wp-json/wp/v2';
const ROOT = process.cwd();
const POSTS_DIR = join(ROOT, 'src/content/posts');
const IMG_DIR = join(ROOT, 'public/images/blog');
console.log('ROOT:', ROOT);
console.log('POSTS_DIR:', POSTS_DIR);
console.log('IMG_DIR:', IMG_DIR);
const KEEP_EN = process.env.WP_KEEP_EN === '1';  // by default only FR

mkdirSync(IMG_DIR, { recursive: true });
mkdirSync(POSTS_DIR, { recursive: true });

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});
td.addRule('stripStyle', {
  filter: ['style', 'script', 'noscript'],
  replacement: () => '',
});
// Keep figure/figcaption as simple image + alt
td.addRule('figure', {
  filter: 'figure',
  replacement: (content) => '\n\n' + content.trim() + '\n\n',
});

function decodeEntities(s) {
  return String(s || '')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&[#a-z0-9]+;/gi, '');
}

function yamlStr(s) {
  // YAML double-quoted scalar — escape backslash, double-quote, control chars
  return '"' + String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .trim() + '"';
}

function frenchDate(iso) {
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const d = new Date(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function readingTime(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min`;
}

async function fetchAll(path) {
  const out = [];
  let page = 1;
  while (true) {
    const url = `${BASE}/${path}?per_page=100&page=${page}`;
    const r = await fetch(url);
    if (!r.ok) {
      if (r.status === 400) break;
      throw new Error(`${url} → ${r.status}`);
    }
    const totalPages = Number(r.headers.get('x-wp-totalpages') || 1);
    const data = await r.json();
    out.push(...data);
    if (page >= totalPages) break;
    page++;
  }
  return out;
}

async function downloadImage(url, slug) {
  if (!url) return null;
  try {
    const ext = (extname(new URL(url).pathname) || '.jpg').toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext) ? ext : '.jpg';
    const filename = `${slug}${safeExt}`;
    const outPath = join(IMG_DIR, filename);
    if (existsSync(outPath)) return `/images/blog/${filename}`;
    const r = await fetch(url);
    if (!r.ok) {
      console.warn(`  ! image fetch failed (${r.status}): ${url}`);
      return null;
    }
    await pipeline(Readable.fromWeb(r.body), createWriteStream(outPath));
    return `/images/blog/${filename}`;
  } catch (e) {
    console.warn(`  ! image error: ${e.message}`);
    return null;
  }
}

// Strip Bricks Builder shortcodes & WP layout junk before turndown
function cleanHtml(html) {
  return String(html || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[bricks_template[^\]]*\]/gi, '')
    .replace(/\[\/bricks_template\]/gi, '')
    .replace(/\[[a-z0-9_\-]+( [^\]]*)?\]/gi, '') // wp shortcodes
    .replace(/<div[^>]*class="[^"]*(?:wp-block-[\w-]+|brxe-[\w-]+)[^"]*"[^>]*>/gi, '<div>')
    .replace(/ style="[^"]*"/gi, '')
    .replace(/ class="[^"]*"/gi, '')
    .replace(/ data-[\w-]+="[^"]*"/gi, '')
    .replace(/<p>\s*<\/p>/gi, '');
}

// Rewrite content image URLs to local paths (downloading them on the fly)
async function rewriteContentImages(html, slug) {
  const imgRe = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  const urls = [];
  let m;
  while ((m = imgRe.exec(html)) !== null) urls.push(m[1]);

  let i = 0;
  const map = new Map();
  for (const u of urls) {
    if (!u.startsWith('http')) continue;
    if (map.has(u)) continue;
    i++;
    const local = await downloadImage(u, `${slug}-${i}`);
    if (local) map.set(u, local);
  }
  let out = html;
  for (const [orig, local] of map) {
    out = out.split(orig).join(local);
  }
  return out;
}

console.log('Fetching posts…');
const allPosts = await fetchAll('posts');
console.log(`  total: ${allPosts.length}`);

console.log('Fetching categories…');
const cats = await fetchAll('categories');
const catMap = new Map(cats.map(c => [c.id, c.name]));

console.log('Fetching media (this can be slow)…');
const mediaCache = new Map();
async function getMedia(id) {
  if (!id) return null;
  if (mediaCache.has(id)) return mediaCache.get(id);
  try {
    const r = await fetch(`${BASE}/media/${id}?_fields=source_url,alt_text`);
    if (!r.ok) { mediaCache.set(id, null); return null; }
    const j = await r.json();
    mediaCache.set(id, j);
    return j;
  } catch { return null; }
}

// Wipe existing posts dir so we start clean
console.log('Cleaning existing posts dir…');
for (const f of readdirSync(POSTS_DIR)) {
  if (f.endsWith('.md') || f.endsWith('.mdx')) unlinkSync(join(POSTS_DIR, f));
}

let order = 0;
let written = 0;
let skipped = 0;

// Sort newest first → highest order at top
allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

for (const p of allPosts) {
  const isFr = p.link.includes('/fr/');
  if (!isFr && !KEEP_EN) { skipped++; continue; }

  const slug = p.slug;
  const title = decodeEntities(p.title?.rendered || '');
  const excerptRaw = decodeEntities((p.excerpt?.rendered || '').replace(/<[^>]+>/g, ''));
  const excerpt = excerptRaw.length > 220 ? excerptRaw.slice(0, 217) + '…' : excerptRaw;

  const primaryCatName = (p.categories || []).map(id => catMap.get(id)).find(n => n && n !== 'Blog') || 'Blog';

  let cover = null;
  if (p.featured_media) {
    const m = await getMedia(p.featured_media);
    if (m?.source_url) cover = await downloadImage(m.source_url, slug);
  }

  // Clean + rewrite images, then turndown
  let html = cleanHtml(p.content?.rendered || '');
  html = await rewriteContentImages(html, slug);
  let md = td.turndown(html).trim();
  // Collapse 3+ newlines
  md = md.replace(/\n{3,}/g, '\n\n');

  const date = frenchDate(p.date);
  const read = readingTime(md);

  order++;
  const fm = [
    '---',
    `id: ${yamlStr(slug)}`,
    `tag: ${yamlStr(primaryCatName)}`,
    `title: ${yamlStr(title)}`,
    `date: ${yamlStr(date)}`,
    `excerpt: ${yamlStr(excerpt)}`,
    `read: ${yamlStr(read)}`,
    `featured: ${order <= 3 ? 'true' : 'false'}`,
    cover ? `cover: ${yamlStr(cover)}` : null,
    `order: ${order}`,
    '---',
    '',
    md,
    '',
  ].filter(l => l !== null).join('\n');

  writeFileSync(join(POSTS_DIR, `${slug}.md`), fm, 'utf8');
  written++;
  if (written % 10 === 0) console.log(`  wrote ${written}…`);
}

console.log(`\nDone. Wrote ${written}, skipped ${skipped}.`);
console.log(`Images in: ${IMG_DIR}`);
