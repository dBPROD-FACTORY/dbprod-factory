import React, { useMemo, useState } from "react";
import PostCard from "./PostCard.jsx";

export default function BlogList({ posts, featuredId }) {
  const featured = posts.find(p => p.id === featuredId) || posts[0];
  const rest = posts.filter(p => p.id !== featured.id);
  const tags = useMemo(() => ["all", ...new Set(posts.map(p => p.tag))], [posts]);
  const [tag, setTag] = useState("all");
  const visible = rest.filter(p => tag === "all" || p.tag === tag);

  return (
    <div>
      <a href={`/blog/${featured.id}`} className="card" style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: 0, overflow: "hidden", textDecoration: "none",
        color: "var(--fg)", marginBottom: 60, padding: 0,
      }}>
        <div className="media-ph" data-label="ARTICLE À LA UNE" style={{ minHeight: 380, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 20%, transparent), transparent 70%)" }}/>
          {featured.cover && <img src={featured.cover} alt={featured.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
          <div style={{ position: "absolute", top: 24, left: 24 }}>
            <span className="chip chip-accent" style={{ background: "color-mix(in oklab, var(--bg) 70%, transparent)", backdropFilter: "blur(8px)" }}>À la une</span>
          </div>
        </div>
        <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <span className="chip chip-accent">{featured.tag}</span>
            <span className="chip">{featured.read}</span>
          </div>
          <h2 className="h-display" style={{ fontSize: 56, margin: 0, lineHeight: 0.95, marginBottom: 20 }}>{featured.title}</h2>
          <p className="text-dim" style={{ fontSize: 16, marginBottom: 24 }}>{featured.excerpt}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
            <span className="mono">{featured.date}</span>
            <span className="link-arrow">Lire →</span>
          </div>
        </div>
      </a>

      <div style={{ display: "flex", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
        {tags.map(t => (
          <button key={t} onClick={() => setTag(t)} style={{
            padding: "8px 16px", borderRadius: 999, fontSize: 12, fontFamily: "var(--f-mono)",
            textTransform: "uppercase", letterSpacing: "0.08em",
            border: "1px solid var(--line-2)",
            background: tag === t ? "var(--fg)" : "transparent",
            color: tag === t ? "var(--bg)" : "var(--fg-dim)",
            cursor: "pointer", transition: "all 0.25s var(--ease)",
          }}>{t === "all" ? "Tous" : t}</button>
        ))}
      </div>

      <div className="grid-responsive-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {visible.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
