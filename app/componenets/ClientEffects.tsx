"use client";

import { useEffect, useState } from "react";

export default function ClientEffects() {
  const [mouse, setMouse] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const move = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div
        style={{
          position: "fixed",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          left: mouse.x,
          top: mouse.y,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
          transition: "width 0.2s, height 0.2s",
        }}
      />

      {/* Global spotlight */}
      <div
        style={{
          position: "fixed",
          width: 700,
          height: 700,
          borderRadius: "50%",
          left: mouse.x,
          top: mouse.y,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.065) 0%, rgba(180,140,255,0.03) 30%, transparent 65%)",
          filter: "blur(1px)",
          pointerEvents: "none",
          zIndex: 1,
          transition: "left 0.07s ease-out, top 0.07s ease-out",
        }}
      />
    </>
  );
}