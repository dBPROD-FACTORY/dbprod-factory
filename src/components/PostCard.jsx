import React from "react";

export default function PostCard({ post, size = "normal" }) {
  const isLarge = size === "large";
  return (
    <a
      href={`/blog/${post.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "var(--fg)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        border: "1px solid var(--line)",
        background: "var(--bg-elev)",
        transition: "border-color 0.3s var(--ease), transform 0.3s var(--ease)",
        height: "100%",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--line-2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Cover image */}
      <div
        className="media-ph"
        data-label={post.tag?.toUpperCase()}
        style={{
          aspectRatio: isLarge ? "16/7" : "16/9",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {post.cover && (
          <img
            src={post.cover}
            alt={post.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: post.cover
            ? "linear-gradient(to top, color-mix(in oklab, var(--bg) 60%, transparent) 0%, transparent 50%)"
            : "linear-gradient(135deg, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)",
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: isLarge ? "28px 32px 32px" : "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="chip chip-accent">{post.tag}</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-mute)" }}>{post.read}</span>
        </div>
        <h3
          className="h-serif"
          style={{ fontSize: isLarge ? 28 : 20, margin: 0, lineHeight: 1.2, flex: 1 }}
        >
          {post.title}
        </h3>
        <p style={{ fontSize: 14, color: "var(--fg-dim)", margin: 0, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.excerpt}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--line)", marginTop: "auto" }}>
          <span className="mono" style={{ fontSize: 10 }}>{post.date}</span>
          <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>Lire →</span>
        </div>
      </div>
    </a>
  );
}
