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
      style={{
        position: "fixed", right: 20, top: 20, zIndex: 101,
        width: 44, height: 44, borderRadius: "50%",
        background: "var(--bg-elev)", border: "1px solid var(--line-2)",
        display: "grid", placeItems: "center", cursor: "pointer",
        color: "var(--fg)", backdropFilter: "blur(12px)",
        transition: "all 0.3s var(--ease)",
      }}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={18} stroke={1.5} />
    </button>
  );
}
