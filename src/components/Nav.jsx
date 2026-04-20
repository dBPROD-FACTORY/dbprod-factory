import React, { useEffect, useState } from "react";
import { BarPulse } from "./Waveform.jsx";

export default function Nav({ currentPath = "/", brand = { name: "PROD·FACTORY", subline: "CASABLANCA ·MA" } }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 20);
    s();
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);

  const items = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/voix", label: "Voix" },
    { href: "/studios", label: "Studios" },
    { href: "/blog", label: "Journal" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "À propos" },
  ];

  const isActive = (href) => currentPath === href || currentPath.startsWith(href + "/");

  return (
    <header style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: scrolled ? "10px 0" : "18px 0",
      background: scrolled ? "color-mix(in oklab, var(--bg) 80%, transparent)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      transition: "all 0.35s var(--ease)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <a href="/" style={{ textDecoration: "none", color: "var(--fg)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--accent)",
            display: "grid", placeItems: "center",
            color: "#0A0A0F",
            fontFamily: "var(--f-mono)",
            fontWeight: 700, fontSize: 14,
            position: "relative",
            overflow: "hidden",
          }}>
            <span style={{ position: "relative", zIndex: 2 }}>dB</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>{brand.name}</span>
            <span className="mono" style={{ fontSize: 9, marginTop: 2 }}>{brand.subline}</span>
          </div>
        </a>

        <nav className="desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center", background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 999, padding: 4 }}>
          {items.map(it => (
            <a
              key={it.href}
              href={it.href}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                color: isActive(it.href) ? "var(--bg)" : "var(--fg-dim)",
                background: isActive(it.href) ? "var(--fg)" : "transparent",
                textDecoration: "none",
                transition: "all 0.25s var(--ease)",
              }}
            >{it.label}</a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="/contact" className="btn btn-primary btn-arrow" style={{ padding: "10px 18px" }}>
            Devis gratuit
          </a>
        </div>
      </div>
    </header>
  );
}
