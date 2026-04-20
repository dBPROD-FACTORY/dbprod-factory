import React, { useEffect, useRef, useState } from "react";

// Equirectangular panorama viewer.
// - Auto-pans horizontally when idle
// - Mouse X/Y controls look direction
// - Drag to spin faster
// Uses CSS background-position on a 2× duplicated image band for seamless loop.
export default function Panorama({ src, height = 520, autoSpeed = 0.02, interactive = true, label }) {
  const hostRef = useRef(null);
  const [yaw, setYaw] = useState(0); // 0..100 (%)
  const [pitch, setPitch] = useState(50);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, yaw: 0 });
  const rafRef = useRef();

  useEffect(() => {
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last; last = now;
      if (!hovering && !dragging) {
        setYaw(y => (y + autoSpeed * dt) % 100);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovering, dragging, autoSpeed]);

  const onMove = (e) => {
    if (!interactive || !hostRef.current) return;
    const r = hostRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (dragging) {
      const dx = e.clientX - dragStart.current.x;
      setYaw((dragStart.current.yaw - (dx / r.width) * 100 + 1000) % 100);
    } else {
      setYaw(prev => {
        const target = x * 100;
        return prev + (target - prev) * 0.08;
      });
      setPitch(40 + y * 20);
    }
  };

  const onDown = (e) => {
    if (!interactive) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, yaw };
  };
  const onUp = () => setDragging(false);

  return (
    <div
      ref={hostRef}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setDragging(false); }}
      onMouseMove={onMove}
      onMouseDown={onDown}
      onMouseUp={onUp}
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: 20,
        cursor: interactive ? (dragging ? "grabbing" : "grab") : "default",
        background: "#0A0A0F",
        border: "1px solid var(--line-2)",
      }}
    >
      {src ? (
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 140%",
          backgroundPosition: `${yaw}% ${pitch}%`,
          willChange: "background-position",
          transition: dragging ? "none" : "background-position 0.12s linear",
        }} />
      ) : (
        <div className="media-ph" data-label={label || "STUDIO PANORAMA"} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, color-mix(in oklab, var(--accent) 15%, transparent), transparent 60%)` }}/>
        </div>
      )}
      <div style={{
        position: "absolute", left: 20, bottom: 20,
        fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
        color: "#fff", mixBlendMode: "difference",
        display: "flex", gap: 10, alignItems: "center",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", animation: "wv 1s ease-in-out infinite alternate" }} />
        360° · {label || "Vue studio"} — {interactive ? "glisser pour explorer" : "auto"}
      </div>
    </div>
  );
}
