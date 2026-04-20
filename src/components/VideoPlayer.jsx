import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";

function isHls(url) { return /\.m3u8(\?|$)/i.test(url); }

export default function VideoPlayer({ src, poster, autoplay = false, muted = false, loop = false, controls = true, style = {}, className = "" }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;

    let hls;
    if (isHls(src) && !v.canPlayType("application/vnd.apple.mpegurl")) {
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          hls = new Hls({ enableWorker: true });
          hls.loadSource(src);
          hls.attachMedia(v);
          hls.on(Hls.Events.MANIFEST_PARSED, () => { setReady(true); if (autoplay) v.play().catch(() => {}); });
        }
      });
    } else {
      v.src = src;
      setReady(true);
      if (autoplay) v.play().catch(() => {});
    }
    return () => { if (hls) hls.destroy(); };
  }, [src, autoplay]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      muted={muted}
      loop={loop}
      playsInline
      controls={controls}
      preload="metadata"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", background: "#000", ...style }}
    />
  );
}

export function HoverVideo({ src, poster, fallback, style = {} }) {
  const videoRef = useRef(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    let hls;
    if (isHls(src) && !v.canPlayType("application/vnd.apple.mpegurl")) {
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          hls = new Hls({ enableWorker: true });
          hls.loadSource(src);
          hls.attachMedia(v);
        }
      });
    } else { v.src = src; }
    return () => { if (hls) hls.destroy(); };
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hover) v.play().catch(() => {});
    else { v.pause(); v.currentTime = 0; }
  }, [hover]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}
    >
      {fallback}
      {src && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: hover ? 1 : 0,
            transition: "opacity 0.35s var(--ease)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
