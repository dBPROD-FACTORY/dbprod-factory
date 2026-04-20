import React, { useMemo, useState } from "react";
import PostCard from "./PostCard.jsx";

const PAGE_SIZE = 9;

export default function BlogList({ posts }) {
  const tags = useMemo(() => ["Tous", ...new Set(posts.map(p => p.tag))], [posts]);
  const [tag, setTag] = useState("Tous");
  const [page, setPage] = useState(1);

  const filtered = tag === "Tous" ? posts : posts.filter(p => p.tag === tag);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = page < totalPages;

  function handleTag(t) { setTag(t); setPage(1); }

  const [featured, ...rest] = filtered;

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 48, flexWrap: "wrap", alignItems: "center" }}>
        <span className="mono" style={{ marginRight: 8 }}>{filtered.length} article{filtered.length > 1 ? "s" : ""}</span>
        {tags.map(t => (
          <button
            key={t}
            onClick={() => handleTag(t)}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              fontSize: 12,
              fontFamily: "var(--f-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              border: "1px solid var(--line-2)",
              background: tag === t ? "var(--fg)" : "transparent",
              color: tag === t ? "var(--bg)" : "var(--fg-dim)",
              cursor: "pointer",
              transition: "all 0.2s var(--ease)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Featured article */}
      {featured && (
        <a
          href={`/blog/${featured.id}`}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            overflow: "hidden",
            textDecoration: "none",
            color: "var(--fg)",
            marginBottom: 48,
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--line)",
            background: "var(--bg-elev)",
            transition: "border-color 0.3s var(--ease)",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--line-2)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line)"}
          className="featured-card"
        >
          <div
            className="media-ph"
            data-label={`À LA UNE · ${featured.tag?.toUpperCase()}`}
            style={{ minHeight: 400, position: "relative", overflow: "hidden" }}
          >
            {featured.cover && (
              <img src={featured.cover} alt={featured.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            )}
            <div style={{
              position: "absolute", inset: 0,
              background: featured.cover
                ? "linear-gradient(to right, color-mix(in oklab, var(--bg) 30%, transparent), transparent)"
                : "linear-gradient(135deg, color-mix(in oklab, var(--accent) 18%, transparent), transparent 70%)",
            }} />
            <div style={{ position: "absolute", top: 24, left: 24 }}>
              <span className="chip chip-accent" style={{ background: "color-mix(in oklab, var(--bg) 70%, transparent)", backdropFilter: "blur(8px)" }}>
                À la une
              </span>
            </div>
          </div>
          <div style={{ padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span className="chip chip-accent">{featured.tag}</span>
              <span className="chip">{featured.read}</span>
            </div>
            <h2 className="h-display" style={{ fontSize: "clamp(32px,3.5vw,52px)", margin: 0, lineHeight: 1 }}>
              {featured.title}
            </h2>
            <p style={{ fontSize: 16, color: "var(--fg-dim)", margin: 0, lineHeight: 1.6 }}>
              {featured.excerpt}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 24, borderTop: "1px solid var(--line)" }}>
              <span className="mono">{featured.date}</span>
              <span style={{ color: "var(--accent)", fontWeight: 500, fontSize: 14 }}>Lire l'article →</span>
            </div>
          </div>
        </a>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="posts-grid">
        {rest.slice(0, (page * PAGE_SIZE) - 1).map(p => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: "14px 36px",
              borderRadius: 999,
              border: "1px solid var(--line-2)",
              background: "transparent",
              color: "var(--fg)",
              fontFamily: "var(--f-sans)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s var(--ease)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--fg)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line-2)"; }}
          >
            Voir plus d'articles ({filtered.length - visible.length} restants)
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .featured-card { grid-template-columns: 1fr !important; }
          .featured-card .media-ph { min-height: 240px !important; }
          .posts-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) and (max-width: 1200px) {
          .posts-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
