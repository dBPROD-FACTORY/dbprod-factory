// Cloudflare Pages Function — receives already-compressed file from browser,
// commits it to GitHub via Contents API.
//
// Required env vars (Cloudflare Pages dashboard → Settings → Variables):
//   GITHUB_TOKEN   — fine-grained token with repo Contents write permission
//   UPLOAD_PASSWORD — secret word to protect the upload page
//   GITHUB_REPO    — optional, defaults to "dBPROD-FACTORY/dbprod-factory"

export async function onRequestPost(context) {
  const { request, env } = context;

  let formData;
  try { formData = await request.formData(); }
  catch { return json({ error: "Données invalides" }, 400); }

  // ── auth ────────────────────────────────────────────────────────────────
  if (!env.UPLOAD_PASSWORD || formData.get("password") !== env.UPLOAD_PASSWORD) {
    return json({ error: "Mot de passe incorrect" }, 401);
  }

  // ── inputs ───────────────────────────────────────────────────────────────
  const file      = formData.get("file");
  const subfolder = formData.get("subfolder") || "studios";
  const slug      = (formData.get("slug") || "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (!file || !(file instanceof File) || !slug) {
    return json({ error: "Fichier ou nom manquant" }, 400);
  }

  // ── extension ────────────────────────────────────────────────────────────
  const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
                "image/gif": "gif", "audio/mpeg": "mp3", "audio/mp3": "mp3" };
  const ext      = EXT[file.type] || "jpg";
  const filename = `${slug}.${ext}`;
  const repoPath = `public/media/${subfolder}/${filename}`;

  // ── base64 encode ────────────────────────────────────────────────────────
  const buf    = await file.arrayBuffer();
  const bytes  = new Uint8Array(buf);
  let binary   = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + 8192, bytes.length)));
  }
  const base64 = btoa(binary);

  // ── GitHub API ───────────────────────────────────────────────────────────
  const REPO    = env.GITHUB_REPO || "dBPROD-FACTORY/dbprod-factory";
  const TOKEN   = env.GITHUB_TOKEN;
  const BRANCH  = "main";

  if (!TOKEN) return json({ error: "GITHUB_TOKEN non configuré dans Cloudflare" }, 500);

  const apiUrl  = `https://api.github.com/repos/${REPO}/contents/${repoPath}`;
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "dB-PROD-FACTORY-Upload/1.0",
  };

  // Check if file already exists (need SHA to update)
  let sha;
  const check = await fetch(apiUrl, { headers });
  if (check.ok) { sha = (await check.json()).sha; }

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `feat(media): upload ${filename} [skip-optimize]`,
      content: base64,
      branch: BRANCH,
      ...(sha && { sha }),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return json({ error: err.message || `Erreur GitHub ${res.status}` }, 502);
  }

  return json({ success: true, path: `/media/${subfolder}/${filename}` });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
