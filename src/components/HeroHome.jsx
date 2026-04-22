import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Waveform, BarPulse } from "./Waveform.jsx";
import Icon from "./Icon.jsx";

export default function HeroHome({ hero, projects }) {
  const [mx, setMx] = useState(0.5);
  const [my, setMy] = useState(0.5);
  const [h, setH] = useState(700);

  useEffect(() => {
    setH(Math.max(700, window.innerHeight));
    const m = (e) => { setMx(e.clientX / window.innerWidth); setMy(e.clientY / window.innerHeight); };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);

  const headline = hero?.headline || ["Votre voix", "résonne", "au Maroc."];
  const italic = hero?.italic || "résonne";

  return (
    <section style={{ position: "relative", minHeight: "100vh", paddingTop: 140, paddingBottom: 60, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.55, maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 80%)" }}>
        <Waveform height={h} bars={120} intensity={1} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(600px circle at ${mx * 100}% ${my * 100}%, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 50%)`,
        pointerEvents: "none",
        transition: "background 0.2s var(--ease)",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
          <div className="eyebrow">{hero?.eyebrow || "Studio · Casablanca — 33.5731°N / 7.5898°W"}</div>
          <div className="mono" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BarPulse count={4} color="var(--accent)" height={12} />
            {hero?.onAir || "Session en cours · Studio B"}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-display"
          style={{ fontSize: "clamp(48px, 13vw, 220px)", margin: 0, marginBottom: 40, textAlign: "left", wordBreak: "break-word", hyphens: "auto" }}>
          {headline[0]}<br/>
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{italic}</em><br/>
          {headline[2] || ""}<span style={{ color: "var(--accent)" }}>.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="grid-responsive-2"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "flex-end", marginTop: 60 }}>
          <p className="text-dim" style={{ fontSize: 17, maxWidth: 480, lineHeight: 1.5 }}>
            {hero?.intro || "dB PROD·FACTORY délivre des œuvres de doublage, voice-over et post-production audio depuis 2016."}
          </p>
          <div className="hero-cta-row" style={{ display: "flex", gap: 12, justifySelf: "end", alignItems: "center", flexWrap: "wrap" }}>
            <a href="/contact" className="btn btn-primary btn-arrow">{hero?.cta1 || "Demander un devis"}</a>
            <a href="/portfolio" className="btn btn-ghost btn-arrow">{hero?.cta2 || "Voir nos œuvres"}</a>
          </div>
        </motion.div>
      </div>

      {projects && projects.length > 0 && (
        <div style={{ position: "relative", zIndex: 2, marginTop: 100, borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "color-mix(in oklab, var(--bg) 80%, transparent)" }}>
          <div style={{ display: "flex", alignItems: "stretch", height: 80 }}>
            <div className="hero-showreel-left" style={{ flex: "0 0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 14, borderRight: "1px solid var(--line)" }}>
              <BarPulse count={5} color="var(--accent)" height={18} />
              <span className="mono">Showreel {new Date().getFullYear()}</span>
            </div>
            <div className="hero-showreel-marquee" style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden", padding: "0 24px", position: "relative" }}>
              <div className="marquee">
                {[...projects, ...projects].map((p, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "var(--f-title)", fontSize: 28, letterSpacing: "-0.02em", fontStyle: i % 3 === 0 ? "italic" : "normal" }}>
                    {p.title}
                    <span style={{ color: "var(--accent)", fontSize: 10 }}>●</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="hero-showreel-right" style={{ flex: "0 0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 10, borderLeft: "1px solid var(--line)" }}>
              <span className="mono">00:00 — 02:34</span>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent)", display: "grid", placeItems: "center", color: "#0A0A0F", cursor: "pointer" }}>
                <Icon name="play" size={14} stroke={2} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
