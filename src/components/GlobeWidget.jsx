import React, { useRef, useEffect, useState, useCallback } from "react";

// Accent matches CSS --accent: oklch(0.82 0.22 130) ≈ lime-green
const ACCENT = "#78DC64";
const ACCENT_RGB = [120, 220, 100];

// Casablanca — dB PROD·FACTORY HQ
const HQ = { lat: 33.5731, lng: -7.5898, name: "dB PROD·FACTORY", isHQ: true };

// ~340 land mass dots at 7.5° resolution
const LAND = [
  // Greenland + Iceland
  [76,-40],[72,-52],[68,-46],[64,-18],[65,-22],
  // North America
  [71,-128],[71,-100],[71,-80],[68,-140],[68,-100],[68,-85],
  [63,-155],[63,-138],[63,-120],[63,-97],[63,-75],[63,-68],
  [58,-155],[58,-136],[58,-122],[58,-110],[58,-97],[58,-80],[58,-68],
  [53,-130],[53,-122],[53,-110],[53,-97],[53,-82],[53,-68],
  [48,-124],[48,-118],[48,-110],[48,-102],[48,-90],[48,-82],[48,-72],[48,-64],
  [43,-125],[43,-118],[43,-109],[43,-100],[43,-93],[43,-85],[43,-78],[43,-70],
  [38,-123],[38,-118],[38,-110],[38,-102],[38,-97],[38,-90],[38,-83],[38,-77],
  [33,-118],[33,-112],[33,-103],[33,-97],[33,-91],[33,-84],[33,-80],[33,-78],
  [28,-107],[28,-102],[28,-96],[28,-92],[28,-89],[28,-82],[28,-81],
  [23,-106],[23,-100],[23,-96],[23,-90],[23,-86],[23,-83],
  [18,-97],[18,-93],[18,-88],[18,-84],[18,-80],[18,-77],
  [13,-86],[13,-83],[13,-80],[13,-76],
  [10,-84],[10,-74],[10,-62],[8,-77],
  // Caribbean
  [22,-80],[20,-76],[18,-68],[18,-74],[16,-62],[15,-61],
  // South America
  [12,-72],[10,-65],[8,-63],[5,-60],[3,-60],
  [0,-65],[0,-52],[-3,-60],[-3,-73],[-5,-65],[-5,-48],
  [-10,-65],[-10,-75],[-10,-52],[-10,-37],
  [-15,-72],[-15,-65],[-15,-52],[-15,-43],
  [-20,-70],[-20,-65],[-20,-52],[-20,-44],
  [-25,-70],[-25,-65],[-25,-52],[-25,-48],
  [-30,-71],[-30,-63],[-30,-55],[-30,-52],
  [-35,-72],[-35,-64],[-35,-57],
  [-40,-65],[-40,-62],
  [-45,-67],[-45,-64],[-50,-70],[-52,-70],
  // Europe
  [70,22],[70,28],[68,14],[68,26],[65,14],[65,22],[65,27],
  [60,5],[60,12],[60,18],[60,24],[58,5],[58,12],[58,18],[58,24],[58,26],
  [55,-3],[55,5],[55,12],[55,18],[55,23],[55,26],[55,37],[55,50],
  [50,-4],[50,2],[50,8],[50,15],[50,22],[50,28],[50,35],
  [45,-2],[45,5],[45,10],[45,15],[45,20],[45,28],[45,35],
  [40,-6],[40,0],[40,5],[40,12],[40,18],[40,25],[40,30],[40,35],
  [35,-6],[35,-2],[35,5],[35,12],[35,18],[35,25],[35,32],[35,37],
  // Africa
  [37,8],[37,12],[37,18],[37,25],[37,32],
  [32,-5],[32,0],[32,8],[32,15],[32,22],[32,30],[32,35],
  [27,-14],[27,-8],[27,-2],[27,5],[27,12],[27,22],[27,30],[27,37],
  [22,-14],[22,-8],[22,-2],[22,5],[22,12],[22,22],[22,33],[22,38],
  [17,-15],[17,-8],[17,-2],[17,5],[17,12],[17,22],[17,35],[17,42],
  [12,-15],[12,-10],[12,-4],[12,3],[12,10],[12,18],[12,28],[12,37],[12,43],
  [7,-10],[7,-5],[7,0],[7,5],[7,12],[7,20],[7,28],[7,37],[7,42],[7,47],
  [2,-10],[2,0],[2,8],[2,18],[2,28],[2,35],[2,42],
  [-3,12],[- 3,20],[- 3,28],[- 3,35],[- 3,42],
  [-8,13],[-8,20],[-8,28],[-8,35],[-8,43],
  [-13,14],[-13,20],[-13,28],[-13,35],
  [-18,20],[-18,28],[-18,35],[-18,43],[-18,47],
  [-23,18],[-23,25],[-23,32],[-23,47],
  [-28,17],[-28,25],[-28,32],
  [-33,18],[-33,22],[-33,27],
  // Madagascar
  [-18,47],[-22,44],[-25,45],
  // Middle East + Central Asia
  [37,35],[37,38],[37,42],[37,48],
  [32,35],[32,38],[32,42],[32,47],[32,55],[32,62],
  [27,37],[27,42],[27,48],[27,55],[27,62],[27,68],
  [22,45],[22,52],[22,58],[22,65],
  [17,42],[17,47],[17,55],
  [12,43],[12,47],
  // Asia South
  [28,62],[28,68],[28,72],[28,78],[28,85],[28,90],[28,97],
  [23,68],[23,73],[23,78],[23,83],[23,90],[23,97],
  [18,73],[18,77],[18,82],[18,88],
  [13,78],[13,80],[13,98],[13,103],
  [8,77],[8,80],[8,98],[8,103],
  [3,102],[3,105],[3,108],
  // Southeast Asia + East Asia
  [0,102],[0,108],[0,115],[0,120],
  [-3,108],[-3,115],[-3,120],[-5,105],[-5,115],[-5,122],
  [-8,115],[-8,122],[-8,130],
  [8,105],[8,98],[10,105],[10,108],[12,108],[13,100],
  [17,98],[17,102],[18,98],[20,103],
  [22,103],[22,108],[22,114],[23,113],
  [27,95],[27,92],[28,90],
  // China + Korea + Japan
  [28,102],[28,108],[28,112],[28,118],
  [33,102],[33,108],[33,115],[33,120],[33,127],[33,130],
  [37,95],[37,102],[37,108],[37,115],[37,120],[37,127],[37,135],[37,138],
  [40,102],[40,108],[40,115],[40,120],[40,125],[40,128],[40,135],[40,140],
  [43,88],[43,95],[43,102],[43,108],[43,115],[43,122],[43,130],[43,142],
  [48,87],[48,95],[48,102],[48,108],[48,115],[48,122],[48,130],[48,135],[48,140],
  [53,87],[53,95],[53,102],[53,110],[53,118],[53,125],[53,132],[53,140],[53,150],
  [58,55],[58,62],[58,70],[58,78],[58,88],[58,97],[58,105],[58,112],[58,120],[58,130],[58,140],[58,150],
  [62,40],[62,50],[62,60],[62,72],[62,82],[62,92],[62,102],[62,112],[62,122],[62,132],[62,142],[62,152],
  [65,35],[65,45],[65,55],[65,65],[65,75],[65,88],[65,100],[65,112],[65,124],[65,136],[65,148],
  [68,32],[68,42],[68,52],[68,62],[68,72],[68,82],[68,92],[68,105],[68,120],[68,132],[68,148],[68,162],
  [71,22],[71,32],[71,42],[71,52],[71,62],[71,72],[71,82],[71,92],[71,102],[71,132],[71,152],
  // Japan islands
  [32,130],[33,131],[35,136],[36,138],[37,138],[38,141],[40,141],[42,141],
  // Philippines + Indonesia detail
  [10,122],[12,123],[15,121],[12,125],[7,125],[0,120],
  // Oceania
  [-5,145],[-6,143],[-8,142],
  [-13,130],[-13,143],[-15,130],
  [-18,122],[-18,127],[-18,135],[-18,143],[-18,147],
  [-22,113],[-23,115],[-23,120],[-23,130],[-23,138],[-23,148],[-23,152],
  [-27,115],[-27,122],[-27,130],[-27,138],[-27,148],[-27,152],
  [-32,116],[-32,135],[-32,142],[-32,148],[-32,150],
  [-37,143],[-37,148],[-38,145],
  // New Zealand
  [-38,176],[-40,175],[-42,173],[-43,172],[-44,170],[-46,168],
];

function toXYZ(lat, lng) {
  const la = (lat * Math.PI) / 180;
  const lo = (lng * Math.PI) / 180;
  return { x: Math.cos(la) * Math.cos(lo), y: Math.sin(la), z: Math.cos(la) * Math.sin(lo) };
}

function rotatePoint(xyz, rotY, rotX) {
  let { x, y, z } = xyz;
  // Y axis rotation (longitude)
  const x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
  const z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
  // X axis rotation (tilt)
  const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
  const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
  return { x: x1, y: y2, z: z2 };
}

function slerp(a, b, t) {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(Math.abs(dot));
  if (omega < 0.0001) return a;
  const so = Math.sin(omega);
  const fa = Math.sin((1 - t) * omega) / so;
  const fb = Math.sin(t * omega) / so;
  return { x: fa * a.x + fb * b.x, y: fa * a.y + fb * b.y, z: fa * a.z + fb * b.z };
}

function makeArc(from, to, steps = 80) {
  const pts = [];
  for (let i = 0; i <= steps; i++) pts.push(slerp(from, to, i / steps));
  return pts;
}

export default function GlobeWidget({ clients = [] }) {
  const canvasRef = useRef(null);
  const state = useRef({
    rotY: 0.4, rotX: 0.25,
    autoRotate: true, isDragging: false,
    lastMouse: { x: 0, y: 0 }, phase: 0,
    hovered: null,
  });
  const [tooltip, setTooltip] = useState(null);

  // Pre-compute client data
  const clientsData = clients
    .filter(c => c.lat != null && c.lng != null)
    .map((c, i) => ({
      ...c,
      xyz: toXYZ(c.lat, c.lng),
      arc: makeArc(toXYZ(HQ.lat, HQ.lng), toXYZ(c.lat, c.lng)),
      arc_offset: i / Math.max(clients.length, 1),
    }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let raf;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      const { rotY, rotX, phase } = state.current;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const cx = W / 2, cy = H / 2;
      const r = Math.min(W, H) * 0.40;

      ctx.clearRect(0, 0, W, H);

      // Sphere gradient
      const sphereGrad = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.28, r * 0.05, cx, cy, r);
      sphereGrad.addColorStop(0, "#12122C");
      sphereGrad.addColorStop(0.6, "#0B0B1C");
      sphereGrad.addColorStop(1, "#08080E");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Atmosphere glow
      const atmo = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.18);
      atmo.addColorStop(0, `rgba(${ACCENT_RGB},0.12)`);
      atmo.addColorStop(0.5, `rgba(${ACCENT_RGB},0.04)`);
      atmo.addColorStop(1, `rgba(${ACCENT_RGB},0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.18, 0, Math.PI * 2);
      ctx.fillStyle = atmo;
      ctx.fill();

      // Clip to sphere for dots/grid
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.lineWidth = 0.7;
      for (let lat = -75; lat <= 75; lat += 30) {
        const la = (lat * Math.PI) / 180;
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 3) {
          const raw = toXYZ(lat, lng);
          const p = rotatePoint(raw, rotY, rotX);
          const sx = cx + p.x * r, sy = cy - p.y * r;
          if (p.z < 0) { first = true; continue; }
          first ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
          first = false;
        }
        ctx.stroke();
      }
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 3) {
          const raw = toXYZ(lat, lng);
          const p = rotatePoint(raw, rotY, rotX);
          const sx = cx + p.x * r, sy = cy - p.y * r;
          if (p.z < 0) { first = true; continue; }
          first ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
          first = false;
        }
        ctx.stroke();
      }

      // Land dots
      for (const [lat, lng] of LAND) {
        const raw = toXYZ(lat, lng);
        const p = rotatePoint(raw, rotY, rotX);
        if (p.z < 0) continue;
        const alpha = Math.min(1, p.z * 2.5) * 0.55;
        const sx = cx + p.x * r, sy = cy - p.y * r;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT_RGB},${alpha})`;
        ctx.fill();
      }

      ctx.restore(); // end sphere clip

      // === Connection arcs ===
      for (const client of clientsData) {
        const arc = client.arc;
        // Draw base arc (faint)
        ctx.beginPath();
        let firstVisible = true;
        for (const raw of arc) {
          const p = rotatePoint(raw, rotY, rotX);
          const sx = cx + p.x * r, sy = cy - p.y * r;
          if (p.z < -0.05) { firstVisible = true; continue; }
          firstVisible ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
          firstVisible = false;
        }
        ctx.strokeStyle = `rgba(${ACCENT_RGB},0.18)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animated pulse dot along arc
        const t = ((phase * 0.4 + (client.arc_offset || 0)) % 1 + 1) % 1;
        const idx = Math.floor(t * (arc.length - 1));
        const raw = arc[idx];
        const p = rotatePoint(raw, rotY, rotX);
        if (p.z > 0) {
          const sx = cx + p.x * r, sy = cy - p.y * r;
          // Glowing trail
          const trail = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
          trail.addColorStop(0, `rgba(${ACCENT_RGB},0.9)`);
          trail.addColorStop(1, `rgba(${ACCENT_RGB},0)`);
          ctx.beginPath();
          ctx.arc(sx, sy, 6, 0, Math.PI * 2);
          ctx.fillStyle = trail;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fillStyle = ACCENT;
          ctx.fill();
        }

        // Client node
        const cp = rotatePoint(client.xyz, rotY, rotX);
        if (cp.z > -0.1) {
          const sx = cx + cp.x * r, sy = cy - cp.y * r;
          const pulse = 0.5 + 0.5 * Math.sin(phase * 2 + (client.arc_offset || 0) * 10);
          // Outer glow
          ctx.beginPath();
          ctx.arc(sx, sy, 8 + pulse * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ACCENT_RGB},${0.07 + pulse * 0.06})`;
          ctx.fill();
          // Ring
          ctx.beginPath();
          ctx.arc(sx, sy, 6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${ACCENT_RGB},${0.6 + pulse * 0.3})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          // Center dot
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fillStyle = ACCENT;
          ctx.fill();
        }
      }

      // === HQ — Casablanca dB marker ===
      const hqXYZ = toXYZ(HQ.lat, HQ.lng);
      const hqP = rotatePoint(hqXYZ, rotY, rotX);
      if (hqP.z > -0.05) {
        const sx = cx + hqP.x * r, sy = cy - hqP.y * r;
        const pulse = 0.5 + 0.5 * Math.sin(phase * 2.5);
        // Large glow
        const hqGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 20 + pulse * 6);
        hqGlow.addColorStop(0, `rgba(${ACCENT_RGB},0.3)`);
        hqGlow.addColorStop(1, `rgba(${ACCENT_RGB},0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, 20 + pulse * 6, 0, Math.PI * 2);
        ctx.fillStyle = hqGlow;
        ctx.fill();
        // Badge
        const bw = 32, bh = 18;
        ctx.beginPath();
        ctx.roundRect(sx - bw / 2, sy - bh / 2, bw, bh, 4);
        ctx.fillStyle = ACCENT;
        ctx.fill();
        ctx.font = `bold 9px "JetBrains Mono", monospace`;
        ctx.fillStyle = "#0A0A0F";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("dB", sx, sy);
        // Dot below badge
        ctx.beginPath();
        ctx.arc(sx, sy + bh / 2 + 5, 3, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT;
        ctx.fill();
      }

      // Sphere edge highlight
      const edgeGrad = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r);
      edgeGrad.addColorStop(0, "rgba(255,255,255,0)");
      edgeGrad.addColorStop(1, "rgba(255,255,255,0.04)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = edgeGrad;
      ctx.fill();
      // Sphere border
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${ACCENT_RGB},0.15)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Hit-test: find nearest visible client on screen
    function hitTest(mouseX, mouseY) {
      const W = canvas.width / dpr, H = canvas.height / dpr;
      const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.40;
      let best = null, bestDist = 14;
      for (const c of clientsData) {
        const p = rotatePoint(c.xyz, state.current.rotY, state.current.rotX);
        if (p.z < 0) continue;
        const sx = cx + p.x * r, sy = cy - p.y * r;
        const d = Math.hypot(mouseX - sx, mouseY - sy);
        if (d < bestDist) { bestDist = d; best = c; }
      }
      // Also test HQ
      const hqP = rotatePoint(toXYZ(HQ.lat, HQ.lng), state.current.rotY, state.current.rotX);
      if (hqP.z > 0) {
        const W2 = canvas.width / dpr, H2 = canvas.height / dpr;
        const sx = W2 / 2 + hqP.x * Math.min(W2, H2) * 0.40;
        const sy = H2 / 2 - hqP.y * Math.min(W2, H2) * 0.40;
        if (Math.hypot(mouseX - sx, mouseY - sy) < 16) best = { ...HQ, isHQ: true };
      }
      return best;
    }

    function loop() {
      if (state.current.autoRotate && !state.current.isDragging) {
        state.current.rotY += 0.004;
      }
      state.current.phase += 0.025;
      draw();
      raf = requestAnimationFrame(loop);
    }
    loop();

    // Mouse events
    function onMouseDown(e) {
      state.current.isDragging = true;
      state.current.lastMouse = { x: e.clientX, y: e.clientY };
    }
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
      const hit = hitTest(mx, my);
      if (hit !== state.current.hovered) {
        state.current.hovered = hit;
        canvas.style.cursor = hit ? "pointer" : "grab";
        if (hit) {
          const W = canvas.width / dpr, H = canvas.height / dpr;
          const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.40;
          const p = rotatePoint(toXYZ(hit.lat ?? HQ.lat, hit.lng ?? HQ.lng), state.current.rotY, state.current.rotX);
          const sx = cx + p.x * r, sy = cy - p.y * r;
          setTooltip({ name: hit.name, city: hit.city, country: hit.country, isHQ: hit.isHQ, x: rect.left + sx, y: rect.top + sy - 40 });
        } else {
          setTooltip(null);
        }
      }
      if (!state.current.isDragging) return;
      const dx = e.clientX - state.current.lastMouse.x;
      const dy = e.clientY - state.current.lastMouse.y;
      state.current.rotY += dx * 0.008;
      state.current.rotX = Math.max(-0.6, Math.min(0.6, state.current.rotX + dy * 0.006));
      state.current.lastMouse = { x: e.clientX, y: e.clientY };
      state.current.autoRotate = false;
    }
    function onMouseUp() { state.current.isDragging = false; }
    function onClick() {
      if (!state.current.isDragging) {
        state.current.autoRotate = !state.current.autoRotate;
      }
    }
    // Touch
    function onTouchStart(e) {
      const t = e.touches[0];
      state.current.isDragging = true;
      state.current.lastMouse = { x: t.clientX, y: t.clientY };
      state.current.autoRotate = false;
    }
    function onTouchMove(e) {
      if (!state.current.isDragging) return;
      const t = e.touches[0];
      const dx = t.clientX - state.current.lastMouse.x;
      const dy = t.clientY - state.current.lastMouse.y;
      state.current.rotY += dx * 0.008;
      state.current.rotX = Math.max(-0.6, Math.min(0.6, state.current.rotX + dy * 0.006));
      state.current.lastMouse = { x: t.clientX, y: t.clientY };
      e.preventDefault();
    }
    function onTouchEnd() { state.current.isDragging = false; }

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.style.cursor = "grab";

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [clientsData.length]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", borderRadius: "50%" }}
      />
      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed", zIndex: 999,
          left: tooltip.x, top: tooltip.y,
          transform: "translate(-50%, -100%)",
          background: "var(--bg-elev)",
          border: "1px solid var(--line-2)",
          borderRadius: 8,
          padding: "8px 14px",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: tooltip.isHQ ? ACCENT : "var(--fg)" }}>
            {tooltip.name}
          </div>
          {(tooltip.city || tooltip.country) && (
            <div style={{ fontSize: 11, color: "var(--fg-dim)", fontFamily: "var(--f-mono)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
              {[tooltip.city, tooltip.country].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
      )}
      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(8,8,12,0.7)", backdropFilter: "blur(8px)",
        border: "1px solid var(--line)", borderRadius: 999,
        padding: "6px 14px",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, display: "block" }} />
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--fg-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Cliquer pour pause · Glisser pour tourner
        </span>
      </div>
    </div>
  );
}
