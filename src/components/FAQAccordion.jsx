import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icon.jsx";

export default function FAQAccordion({ groups }) {
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = groups.map(g => ({
    ...g,
    items: g.items.filter(it =>
      !query ||
      it.q.toLowerCase().includes(query.toLowerCase()) ||
      it.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(g => g.items.length > 0);

  return (
    <div>
      <div style={{ position: "relative", marginBottom: 40 }}>
        <Icon name="search" size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--fg-dim)" }} />
        <input
          type="text"
          placeholder="Rechercher…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "16px 16px 16px 48px",
            background: "var(--bg-elev)",
            border: "1px solid var(--line-2)",
            borderRadius: 14,
            color: "var(--fg)",
            fontSize: 15,
            fontFamily: "var(--f-sans)",
            outline: "none",
          }}
        />
      </div>

      {filtered.map((group, gi) => (
        <div key={gi} style={{ marginBottom: 48 }}>
          <div className="mono" style={{ marginBottom: 16 }}>{group.title}</div>
          <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
            {group.items.map((it, i) => {
              const key = `${gi}-${i}`;
              const isOpen = open === key;
              return (
                <div key={key} style={{ borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "24px 28px",
                      background: "transparent",
                      border: 0,
                      cursor: "pointer",
                      color: "var(--fg)",
                      textAlign: "left",
                      fontFamily: "var(--f-title)",
                      fontSize: 22,
                    }}
                  >
                    <span>{it.q}</span>
                    <Icon name={isOpen ? "minus" : "plus"} size={18} stroke={1.5} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 28px 28px", color: "var(--fg-dim)", fontSize: 15, lineHeight: 1.6 }}>
                          {it.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
