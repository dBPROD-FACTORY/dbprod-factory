import React, { useEffect, useState } from "react";

export default function Nav({ currentPath = "/", brand = { name: "PROD·FACTORY", subline: "CASABLANCA · MA" } }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 20);
    s();
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const items = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/voix", label: "Voix" },
    { href: "/studios", label: "Studios" },
    { href: "/clients", label: "Clients" },
    { href: "/blog", label: "Journal" },
    { href: "/faq", label: "FAQ" },
  ];

  const isActive = (href) => currentPath === href || currentPath.startsWith(href + "/");

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: scrolled ? "10px 0" : "18px 0",
        background: scrolled || open ? "color-mix(in oklab, var(--bg) 90%, transparent)" : "transparent",
        backdropFilter: scrolled || open ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "all 0.35s var(--ease)",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

          {/* Logo */}
          <a href="/" onClick={() => setOpen(false)} style={{ textDecoration: "none", color: "var(--fg)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--accent)", display: "grid", placeItems: "center",
              color: "#0A0A0F", fontFamily: "var(--f-mono)", fontWeight: 700, fontSize: 14,
            }}>dB</div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>{brand.name}</span>
              <span className="mono" style={{ fontSize: 9, marginTop: 2 }}>{brand.subline}</span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center", background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 999, padding: 4 }}>
            {items.map(it => (
              <a key={it.href} href={it.href} style={{
                padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                color: isActive(it.href) ? "var(--bg)" : "var(--fg-dim)",
                background: isActive(it.href) ? "var(--fg)" : "transparent",
                textDecoration: "none", transition: "all 0.25s var(--ease)",
              }}>{it.label}</a>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/contact" className="btn btn-primary btn-arrow desktop-nav" style={{ padding: "10px 18px" }}>
              Devis gratuit
            </a>
            {/* Hamburger */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
              style={{
                display: "none", width: 40, height: 40, borderRadius: 8,
                border: "1px solid var(--line-2)", background: "var(--bg-elev)",
                cursor: "pointer", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 5, padding: 0,
              }}
              className="hamburger-btn"
            >
              <span style={{
                display: "block", width: 18, height: 1.5, borderRadius: 2,
                background: "var(--fg)", transition: "all 0.3s var(--ease)",
                transform: open ? "rotate(45deg) translate(2px, 5px)" : "none",
              }} />
              <span style={{
                display: "block", width: 18, height: 1.5, borderRadius: 2,
                background: "var(--fg)", transition: "all 0.3s var(--ease)",
                opacity: open ? 0 : 1, transform: open ? "translateX(-6px)" : "none",
              }} />
              <span style={{
                display: "block", width: 18, height: 1.5, borderRadius: 2,
                background: "var(--fg)", transition: "all 0.3s var(--ease)",
                transform: open ? "rotate(-45deg) translate(2px, -5px)" : "none",
              }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 199,
        background: "var(--bg)",
        display: "flex", flexDirection: "column",
        padding: "100px 32px 48px",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s var(--ease-out)",
        overflowY: "auto",
      }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {items.map((it, i) => (
            <a
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 0",
                borderBottom: "1px solid var(--line)",
                textDecoration: "none",
                color: isActive(it.href) ? "var(--accent)" : "var(--fg)",
                fontFamily: "var(--f-display)",
                fontSize: "clamp(28px, 8vw, 48px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                transition: "color 0.2s, padding 0.2s",
                animation: open ? `mobileNavIn 0.4s ${i * 0.05}s both` : "none",
              }}
            >
              {it.label}
              <span style={{ fontSize: "0.5em", color: "var(--fg-mute)" }}>→</span>
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 32 }}>
          <a href="/contact" onClick={() => setOpen(false)} className="btn btn-primary" style={{ textAlign: "center", justifyContent: "center", fontSize: 16, padding: "16px 24px" }}>
            Demander un devis gratuit
          </a>
          <div className="mono" style={{ textAlign: "center", fontSize: 10 }}>+212 669 809 234 · contact@dbprod-factory.com</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hamburger-btn { display: flex !important; }
        }
        @keyframes mobileNavIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}
