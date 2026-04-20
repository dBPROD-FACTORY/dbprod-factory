import React from "react";
import Icon from "./Icon.jsx";

export default function PostCard({ post }) {
  return (
    <a
      href={`/blog/${post.id}`}
      className="card"
      style={{ padding: 28, textDecoration: "none", color: "var(--fg)", display: "flex", flexDirection: "column", gap: 16, height: "100%" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="chip chip-accent">{post.tag}</span>
        <span className="mono" style={{ fontSize: 10 }}>{post.read}</span>
      </div>
      <h3 className="h-serif" style={{ fontSize: 24, margin: 0, lineHeight: 1.2 }}>{post.title}</h3>
      <p className="text-dim" style={{ fontSize: 14, margin: 0, flex: 1 }}>{post.excerpt}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--line)" }}>
        <span className="mono" style={{ fontSize: 10 }}>{post.date}</span>
        <Icon name="arrowUpRight" size={16} stroke={1.5} />
      </div>
    </a>
  );
}
