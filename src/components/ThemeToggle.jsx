import React, { useEffect, useState } from "react";
import Icon from "./Icon.jsx";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = localStorage.getItem("dbprod-theme") || "dark";
    setTheme(stored);
    document.documentElement.dataset.theme = stored;
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("dbprod-theme", next); } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Changer le thème"
      id="theme-toggle"
      style={{
        position: "fixed", right: 20, top: 14,
        zIndex: 201, /* above nav (200) and overlay (199) */
        width: 40, height: 40, borderRadius: "50%",
        background: "var(--bg-elev)", border: "1px solid var(--line-2)",
        display: "grid", placeItems: "center", cursor: "pointer",
        color: "var(--fg)", backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "background 0.3s var(--ease), border-color 0.3s var(--ease)",
        WebkitAppearance: "none", appearance: "none", outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={16} stroke={1.5} />
    </button>
  );
}
