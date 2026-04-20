import React from "react";
import Icon from "./Icon.jsx";
import { BarPulse } from "./Waveform.jsx";

export default function Footer({ site, contact, social, footerCta }) {
  const cta = footerCta || {
    eyebrow: "Démarrons un projet",
    title: "Parlons de votre prochaine production.",
    italic: "Parlons",
    buttonLabel: "Nous contacter",
  };
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 120, paddingTop: 80, paddingBottom: 32 }}>
      <div className="container">
        <div style={{ marginBottom: 100 }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>{cta.eyebrow}</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
            <h2 className="h-display" style={{ fontSize: "clamp(56px, 8vw, 128px)", margin: 0, maxWidth: 900 }}>
              <em style={{ fontStyle: "italic" }}>{cta.italic}</em>{" "}{cta.title.replace(cta.italic, "")}
            </h2>
            <a
              href="/contact"
              style={{
                width: 180, height: 180,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "#0A0A0F",
                display: "grid", placeItems: "center",
                textDecoration: "none",
                textAlign: "center",
                fontFamily: "var(--f-sans)",
                fontWeight: 500,
                fontSize: 15,
                transition: "transform 0.4s var(--ease)",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(-8deg) scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0) scale(1)"}
            >{cta.buttonLabel}<br/>→</a>
          </div>
        </div>

        <div className="grid-responsive-3" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, alignItems: "flex-start", paddingBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "var(--accent)",
                display: "grid", placeItems: "center",
                color: "#0A0A0F",
                fontFamily: "var(--f-mono)",
                fontWeight: 700, fontSize: 15,
              }}>dB</div>
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{site?.brand || "PROD·FACTORY"}</div>
                <div className="mono" style={{ fontSize: 9, marginTop: 2 }}>{site?.tagline || "EST. 2016 · CASABLANCA"}</div>
              </div>
            </div>
            <p className="text-dim" style={{ maxWidth: 360, fontSize: 14, marginBottom: 28 }}>
              {site?.description || "Studio de doublage, voice-over et post-production audio basé à Casablanca."}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {(social || [{n:"instagram",u:"#"},{n:"facebook",u:"#"},{n:"linkedin",u:"#"}]).map(s => (
                <a key={s.n} href={s.u} style={{
                  width: 36, height: 36,
                  border: "1px solid var(--line-2)",
                  borderRadius: 8,
                  display: "grid", placeItems: "center",
                  color: "var(--fg-dim)",
                  transition: "all 0.25s var(--ease)",
                }}>
                  <Icon name={s.n} size={16} stroke={1.5} />
                </a>
              ))}
            </div>
          </div>

          {[
            { t: "Navigation", items: [
              { l: "Services", p: "/services" },
              { l: "Portfolio", p: "/portfolio" },
              { l: "Studios", p: "/studios" },
              { l: "Journal", p: "/blog" },
            ]},
            { t: "Informations", items: [
              { l: "À propos", p: "/about" },
              { l: "FAQ", p: "/faq" },
              { l: "Contact", p: "/contact" },
            ]},
            { t: "Contact", items: [] },
          ].map((col, idx) => (
            <div key={idx}>
              <div className="mono" style={{ marginBottom: 16, fontSize: 10 }}>{col.t}</div>
              {col.items.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.items.map(it => (
                    <li key={it.l}>
                      <a href={it.p} style={{ color: "var(--fg)", textDecoration: "none", fontSize: 14 }}>{it.l}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  <li style={{ fontSize: 13, color: "var(--fg)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <Icon name="mapPin" size={14} stroke={1.5} style={{ marginTop: 2, color: "var(--fg-dim)" }} />
                    {contact?.address || "7 Avenue 2 Mars, Casablanca, Maroc"}
                  </li>
                  <li style={{ fontSize: 13, color: "var(--fg)", display: "flex", gap: 8, alignItems: "center" }}>
                    <Icon name="mail" size={14} stroke={1.5} style={{ color: "var(--fg-dim)" }} />
                    {contact?.email || "contact@dbprod-factory.com"}
                  </li>
                  <li style={{ fontSize: 13, color: "var(--fg)", display: "flex", gap: 8, alignItems: "center" }}>
                    <Icon name="phone" size={14} stroke={1.5} style={{ color: "var(--fg-dim)" }} />
                    {contact?.phone || "+212 669 809 234"}
                  </li>
                </ul>
              )}
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid var(--line)",
          paddingTop: 24,
          display: "flex", justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div className="mono" style={{ fontSize: 10 }}>© {new Date().getFullYear()} dB PROD·FACTORY — Tous droits réservés</div>
          <div className="mono" style={{ fontSize: 10, display: "flex", gap: 24, alignItems: "center" }}>
            <a href="#" style={{ color: "var(--fg-dim)", textDecoration: "none" }}>Mentions légales</a>
            <a href="#" style={{ color: "var(--fg-dim)", textDecoration: "none" }}>CGV</a>
            <a href="#" style={{ color: "var(--fg-dim)", textDecoration: "none" }}>Confidentialité</a>
            <a href="/upload" style={{ color: "var(--fg-mute)", textDecoration: "none", opacity: 0.4 }}>⬆ Upload</a>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center", color: "var(--fg-mute)" }}>
              <BarPulse count={3} color="var(--accent)" height={10} /> ON AIR
            </span>
          </div>
        </div>

        <div style={{ marginTop: 80, overflow: "hidden", paddingTop: 40, borderTop: "1px solid var(--line)" }}>
          <div style={{
            fontFamily: "var(--f-title)",
            fontSize: "clamp(80px, 19vw, 280px)",
            lineHeight: 0.85,
            letterSpacing: "-0.06em",
            fontWeight: 300,
            color: "var(--fg)",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}>
            dB <em style={{ fontStyle: "italic", color: "var(--accent)" }}>prod</em>·factory<span style={{ color: "var(--accent)" }}>.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
