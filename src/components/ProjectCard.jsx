import React, { useState } from "react";
import Icon from "./Icon.jsx";
import { StaticWave } from "./Waveform.jsx";
import { HoverVideo } from "./VideoPlayer.jsx";

export default function ProjectCard({ project, size = "sm" }) {
  const [hover, setHover] = useState(false);
  // Aspect-ratio instead of fixed height so cards scale uniformly with column
  // width. `size` now only controls interior typography / play button / title.
  const aspect = "16/10";

  const fallback = (
    <>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, color-mix(in oklab, var(--accent) ${10 + (project.seed || 10)}%, transparent), transparent 60%)` }}/>
      {project.poster && (
        <img src={project.poster} alt={project.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
      )}
    </>
  );

  return (
    <a
      href={`/portfolio/${project.id}`}
      style={{
        position: "relative",
        display: "block",
        borderRadius: 18,
        overflow: "hidden",
        textDecoration: "none",
        color: "var(--fg)",
        border: "1px solid var(--line)",
        background: "var(--bg-elev)",
        transition: "transform 0.4s var(--ease)",
        transform: hover ? "translateY(-4px)" : "none",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="media-ph" data-label={`${(project.kind || "").toUpperCase()} · SHOWREEL`} style={{ aspectRatio: aspect, position: "relative" }}>
        <HoverVideo src={project.video_url} poster={project.poster} fallback={fallback} />

        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
          <div style={{
            width: size === "lg" ? 96 : 64,
            height: size === "lg" ? 96 : 64,
            borderRadius: "50%",
            background: hover ? "var(--accent)" : "color-mix(in oklab, var(--bg) 70%, transparent)",
            color: hover ? "#0A0A0F" : "var(--fg)",
            display: "grid", placeItems: "center",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--line-2)",
            transition: "all 0.3s var(--ease)",
            transform: hover ? "scale(1.1)" : "scale(1)",
            opacity: hover && project.video_url ? 0 : 1,
          }}>
            <Icon name="play" size={size === "lg" ? 26 : 20} stroke={2} />
          </div>
        </div>

        <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, opacity: hover && project.video_url ? 0 : 0.6, transition: "opacity 0.3s", pointerEvents: "none" }}>
          <StaticWave seed={project.seed || 1} bars={40} height={32} color="var(--accent)" />
        </div>
        <span className="chip" style={{ position: "absolute", top: 16, left: 16, background: "color-mix(in oklab, var(--bg) 70%, transparent)", backdropFilter: "blur(8px)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}/> {project.year}
        </span>
        {project.dur && (
          <span className="chip" style={{ position: "absolute", top: 16, right: 16, background: "color-mix(in oklab, var(--bg) 70%, transparent)", backdropFilter: "blur(8px)" }}>
            {project.dur}
          </span>
        )}
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {(project.tags || []).map(t => <span key={t} className="chip">{t}</span>)}
        </div>
        <h3 className="h-serif" style={{ fontSize: size === "lg" ? 36 : 22, margin: 0, marginBottom: 8 }}>
          {project.title}
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-dim)", fontSize: 13 }}>
          <span>{project.kind} · {project.lang}</span>
          <span className="mono" style={{ fontSize: 10 }}>↗ Voir le projet</span>
        </div>
      </div>
    </a>
  );
}
