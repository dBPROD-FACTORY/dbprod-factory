import React, { useState } from "react";
import Panorama from "./Panorama.jsx";

export default function PanoramaGallery({ views = [], height = 640, label }) {
  const [i, setI] = useState(0);
  if (!views.length) return <Panorama src={null} height={height} label={label} />;
  const current = views[i];

  return (
    <div>
      <Panorama src={current.url} height={height} interactive={true} autoSpeed={1.2} label={`${label || ""} · ${current.label}`} key={current.url} />
      {views.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {views.map((v, k) => (
            <button
              key={v.url}
              onClick={() => setI(k)}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                fontSize: 12,
                fontFamily: "var(--f-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                border: "1px solid var(--line-2)",
                background: k === i ? "var(--fg)" : "transparent",
                color: k === i ? "var(--bg)" : "var(--fg-dim)",
                cursor: "pointer",
                transition: "all 0.2s var(--ease)",
              }}
            >
              <span style={{ marginRight: 8, opacity: 0.6 }}>{String(k + 1).padStart(2, "0")}</span>
              {v.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
