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
        background: scrolled || open ? "color-mix(in oklab, var(--bg) 92%, transparent)" : "transparent",
        backdropFilter: scrolled || open ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled || open ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "padding 0.35s var(--ease), background 0.35s var(--ease), border-color 0.35s var(--ease)",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>

          {/* Logo */}
          <a href="/" onClick={() => setOpen(false)} style={{
            textDecoration: "none", color: "var(--fg)",
            display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: "var(--accent)", display: "grid", placeItems: "center",
              color: "#0A0A0F", fontFamily: "var(--f-mono)", fontWeight: 700, fontSize: 14,
            }}>dB</div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>{brand.name}</span>
              <span className="mono" style={{ fontSize: 9, marginTop: 2 }}>{brand.subline}</span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{
            display: "flex", gap: 2, alignItems: "center",
            background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 999, padding: 4,
          }}>
            {items.map(it => (
              <a key={it.href} href={it.href} style={{
                padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                color: isActive(it.href) ? "var(--bg)" : "var(--fg-dim)",
                background: isActive(it.href) ? "var(--fg)" : "transparent",
                textDecoration: "none", transition: "all 0.25s var(--ease)",
              }}>{it.label}</a>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/contact" className="btn btn-primary btn-arrow desktop-nav" style={{ padding: "10px 18px" }}>
              Devis gratuit
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              className="hamburger-btn"
            >
              <span className={`hb-line hb-top ${open ? "open" : ""}`} />
              <span className={`hb-line hb-mid ${open ? "open" : ""}`} />
              <span className={`hb-line hb-bot ${open ? "open" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className="mobile-nav-overlay"
        aria-hidden={!open}
        style={{
          position: "fixed", inset: 0, zIndex: 199,
          background: "var(--bg)",
          display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s var(--ease-out)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 0 }}>
          {items.map((it, i) => (
            <a
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "20px 0",
                borderBottom: "1px solid var(--line)",
                textDecoration: "none",
                color: isActive(it.href) ? "var(--accent)" : "var(--fg)",
                fontFamily: "var(--f-display)",
                fontSize: "clamp(32px, 9vw, 52px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                opacity: open ? 1 : 0,
                transform: open ? "translateX(0)" : "translateX(24px)",
                transition: `opacity 0.35s ${i * 0.04}s, transform 0.35s ${i * 0.04}s var(--ease-out)`,
              }}
            >
              {it.label}
              <span style={{ fontSize: "0.45em", color: "var(--fg-mute)" }}>→</span>
            </a>
          ))}
        </nav>

        <div style={{ paddingTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
          <a
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn btn-primary"
            style={{ textAlign: "center", justifyContent: "center", fontSize: 16, padding: "16px 24px", borderRadius: 999 }}
          >
            Demander un devis gratuit
          </a>
          <div className="mono" style={{ textAlign: "center", fontSize: 10, color: "var(--fg-mute)" }}>
            +212 669 809 234 · contact@dbprod-factory.com
          </div>
        </div>
      </div>

      <style>{`
        /* Hamburger button — visible only on mobile */
        .hamburger-btn {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid var(--line-2);
          background: var(--bg-elev);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0;
          /* iOS reset — critical */
          -webkit-appearance: none;
          appearance: none;
          outline: none;
          -webkit-tap-highlight-color: transparent;
          box-shadow: none;
        }
        .hb-line {
          display: block;
          width: 18px;
          height: 1.5px;
          border-radius: 2px;
          background: var(--fg);
          transition: transform 0.3s var(--ease), opacity 0.3s var(--ease);
          transform-origin: center;
        }
        .hb-top.open  { transform: translateY(6.5px) rotate(45deg); }
        .hb-mid.open  { opacity: 0; transform: scaleX(0); }
        .hb-bot.open  { transform: translateY(-6.5px) rotate(-45deg); }

        @media (max-width: 900px) {
          .hamburger-btn { display: flex; }
        }

        @keyframes mobileIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}
