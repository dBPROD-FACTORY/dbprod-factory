import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";

export function Waveform({ height = 120, color, bars = 64, active = true, intensity = 1, seed = 0 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const onResize = () => { canvas.width = 0; canvas.height = 0; resize(); };
    window.addEventListener("resize", onResize);

    let t = seed;
    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      const barW = w / bars;
      const col = color || getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#C4F542";
      const dim = getComputedStyle(document.documentElement).getPropertyValue("--fg-mute").trim() || "#6B6B78";

      for (let i = 0; i < bars; i++) {
        const x = i * barW;
        const n = Math.sin(t * 0.03 + i * 0.3) * 0.5
                + Math.sin(t * 0.01 + i * 0.8) * 0.3
                + Math.sin(t * 0.05 + i * 0.1) * 0.2;
        const amp = (active ? 1 : 0.3) * intensity;
        const hh = (Math.abs(n) * h * 0.9 + 4) * amp;
        const y = (h - hh) / 2;
        const isAccent = i % 7 === Math.floor((t * 0.05) % 7);
        ctx.fillStyle = isAccent ? col : dim;
        ctx.globalAlpha = isAccent ? 1 : 0.35;
        ctx.fillRect(x + 1, y, Math.max(1, barW - 2), hh);
      }
      ctx.globalAlpha = 1;
      if (active) {
        t += 1;
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [bars, color, active, intensity, seed]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: `${height}px`, display: "block" }} />;
}

export function BarPulse({ count = 5, color, height = 14 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2, alignItems: "flex-end", height }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{
          width: 2, height: "100%",
          background: color || "currentColor",
          transformOrigin: "bottom",
          animation: `wv ${0.6 + (i % 3) * 0.15}s ease-in-out ${i * 0.08}s infinite alternate`,
          borderRadius: 1,
        }} />
      ))}
    </span>
  );
}

export function StaticWave({ seed = 1, bars = 40, color = "currentColor", height = 40 }) {
  const rng = (i) => (Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1;
  return (
    <svg viewBox={`0 0 ${bars * 4} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const v = Math.abs(rng(i + 1));
        const h = 6 + v * (height - 10);
        return <rect key={i} x={i * 4 + 1} y={(height - h) / 2} width={2} height={h} fill={color} />;
      })}
    </svg>
  );
}

export function AudioPlayer({ title, artist, duration = 180, seed = 1, compact = false, url }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef();
  const lastRef = useRef();
  const audioRef = useRef(null);

  useEffect(() => {
    if (!url) return;
    const a = audioRef.current = new Audio(url);
    a.preload = "metadata";
    const onTime = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    const onEnd = () => { setPlaying(false); setProgress(0); };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      a.pause();
    };
  }, [url]);

  useEffect(() => {
    if (url) {
      if (audioRef.current) {
        if (playing) audioRef.current.play().catch(() => setPlaying(false));
        else audioRef.current.pause();
      }
      return;
    }
    if (!playing) return;
    lastRef.current = performance.now();
    const tick = (now) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setProgress((p) => {
        const np = p + dt / duration;
        if (np >= 1) { setPlaying(false); return 0; }
        return np;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, duration, url]);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const bars = 80;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: compact ? "10px 14px" : "16px 20px",
      background: "var(--bg-elev)",
      border: "1px solid var(--line)",
      borderRadius: 14,
    }}>
      <button
        onClick={() => setPlaying((p) => !p)}
        style={{
          width: compact ? 36 : 44, height: compact ? 36 : 44,
          borderRadius: "50%",
          background: "var(--accent)",
          color: "#0A0A0F",
          border: 0,
          display: "grid", placeItems: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "transform 0.2s var(--ease)",
        }}
      >
        <Icon name={playing ? "pause" : "play"} size={compact ? 14 : 16} stroke={2} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        {!compact && (title || artist) && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
            <div style={{ fontSize: 11, fontFamily: "var(--f-mono)", color: "var(--fg-mute)", letterSpacing: "0.08em" }}>{artist}</div>
          </div>
        )}
        <div style={{ position: "relative", height: compact ? 22 : 32 }}>
          <svg viewBox={`0 0 ${bars * 4} 40`} preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
            {Array.from({ length: bars }).map((_, i) => {
              const v = Math.abs((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1);
              const h = 4 + v * 30;
              const played = i / bars < progress;
              return (
                <rect
                  key={i}
                  x={i * 4 + 1}
                  y={(40 - h) / 2}
                  width={2}
                  height={h}
                  fill={played ? "var(--accent)" : "var(--fg-mute)"}
                  opacity={played ? 1 : 0.45}
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.08em", flexShrink: 0 }}>
        {fmt(progress * (audioRef.current?.duration || duration))} / {fmt(audioRef.current?.duration || duration)}
      </div>
    </div>
  );
}
