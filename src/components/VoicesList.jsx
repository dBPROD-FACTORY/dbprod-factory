import React, { useMemo, useState } from "react";
import { AudioPlayer } from "./Waveform.jsx";
import Icon from "./Icon.jsx";

export default function VoicesList({ voices }) {
  const [lang, setLang] = useState("all");
  const [gender, setGender] = useState("all");
  const [q, setQ] = useState("");

  const allLangs = useMemo(() => ["all", ...new Set(voices.flatMap(v => v.languages || []))], [voices]);

  const filtered = voices.filter(v => {
    if (lang !== "all" && !(v.languages || []).includes(lang)) return false;
    if (gender !== "all" && v.gender !== gender) return false;
    if (q) {
      const text = `${v.name} ${(v.tags || []).join(" ")} ${v.register || ""}`.toLowerCase();
      if (!text.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 280px", minWidth: 240 }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--fg-dim)" }} />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un comédien, un registre…"
            style={{ width: "100%", padding: "12px 14px 12px 40px", background: "var(--bg-elev)", border: "1px solid var(--line-2)", borderRadius: 999, color: "var(--fg)", fontSize: 14, outline: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {allLangs.map(l => (
            <button key={l} onClick={() => setLang(l)} style={pill(lang === l)}>{l === "all" ? "Toutes langues" : l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["all", "Tous"], ["F", "Voix féminines"], ["M", "Voix masculines"]].map(([k, lab]) => (
            <button key={k} onClick={() => setGender(k)} style={pill(gender === k)}>{lab}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map(v => (
          <div key={v.id} className="card" style={{ padding: 24, display: "grid", gridTemplateColumns: "220px 1fr 2fr", gap: 24, alignItems: "center" }}>
            <div>
              <div className="mono" style={{ marginBottom: 6, fontSize: 10 }}>{(v.languages || []).join(" · ")}</div>
              <h3 className="h-serif" style={{ fontSize: 26, margin: 0 }}>{v.name}</h3>
              <div className="text-dim" style={{ fontSize: 13, marginTop: 4 }}>{v.register}</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(v.tags || []).map(t => <span key={t} className="chip">{t}</span>)}
            </div>
            <AudioPlayer title={v.name} artist={(v.languages || []).join("/")} duration={v.duration} seed={v.seed} url={v.sample_url} compact />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-dim" style={{ padding: 60, textAlign: "center", border: "1px dashed var(--line-2)", borderRadius: 18 }}>Aucun résultat</div>
        )}
      </div>
    </div>
  );
}

function pill(on) {
  return {
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontFamily: "var(--f-mono)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    border: "1px solid var(--line-2)",
    background: on ? "var(--fg)" : "transparent",
    color: on ? "var(--bg)" : "var(--fg-dim)",
    cursor: "pointer",
    transition: "all 0.2s var(--ease)",
  };
}
