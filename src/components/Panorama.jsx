import React, { useEffect, useRef, useState } from "react";

// Real 360° equirectangular viewer via Pannellum (WebGL/canvas).
// Projects the distorted equirectangular image onto a sphere so the user sees
// a natural view, and can drag/pan/zoom like Google Street View.
// Pannellum is loaded from CDN on first use (no npm dep).

let pannellumPromise = null;
function loadPannellum() {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.pannellum) return Promise.resolve(window.pannellum);
  if (pannellumPromise) return pannellumPromise;
  pannellumPromise = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    document.head.appendChild(css);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.onload = () => resolve(window.pannellum);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return pannellumPromise;
}

export default function Panorama({
  src,
  height = 520,
  autoSpeed = 2,       // degrees per second; 0 disables auto-rotate
  interactive = true,
  label,
  hfov = 110,
}) {
  const hostRef = useRef(null);
  const viewerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src || !hostRef.current) return;
    let disposed = false;

    loadPannellum().then((pannellum) => {
      if (disposed || !hostRef.current) return;
      hostRef.current.innerHTML = "";
      viewerRef.current = pannellum.viewer(hostRef.current, {
        type: "equirectangular",
        panorama: src,
        autoLoad: true,
        autoRotate: autoSpeed,
        autoRotateInactivityDelay: 1000,
        showControls: false,
        showZoomCtrl: false,
        showFullscreenCtrl: false,
        compass: false,
        hfov,
        minHfov: 60,
        maxHfov: 130,
        mouseZoom: interactive,
        draggable: interactive,
        keyboardZoom: false,
        backgroundColor: [0.04, 0.04, 0.05],
      });
      setReady(true);
    }).catch((e) => console.error("[panorama] load failed", e));

    return () => {
      disposed = true;
      try { viewerRef.current && viewerRef.current.destroy(); } catch {}
      viewerRef.current = null;
    };
  }, [src, autoSpeed, interactive, hfov]);

  return (
    <div style={{ position: "relative", width: "100%", height, borderRadius: 20, overflow: "hidden", background: "#0A0A0F", border: "1px solid var(--line-2)" }}>
      <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />
      {!src && (
        <div className="media-ph" data-label={label || "STUDIO — UPLOADEZ UN PANORAMA 360°"} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 15%, transparent), transparent 60%)" }}/>
        </div>
      )}
      <div style={{
        position: "absolute", left: 20, bottom: 20,
        fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
        color: "#fff", mixBlendMode: "difference",
        display: "flex", gap: 10, alignItems: "center",
        background: "rgba(0,0,0,0.35)", padding: "6px 12px", borderRadius: 999,
        backdropFilter: "blur(8px)",
        pointerEvents: "none",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", animation: "wv 1s ease-in-out infinite alternate" }} />
        360° · {label || "Vue studio"} {interactive ? "— glisser pour explorer" : ""}
      </div>
    </div>
  );
}
