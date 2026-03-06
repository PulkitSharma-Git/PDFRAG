"use client";

import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
      style={{
        position: "fixed",
        top: 16,
        right: 18,
        zIndex: 9999,
        width: 44,
        height: 24,
        borderRadius: 12,
        border: isDark
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid rgba(0,0,0,0.12)",
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
        cursor: "none",
        padding: 0,
        display: "flex",
        alignItems: "center",
        transition: "background 0.3s, border 0.3s",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        outline: "none",
      }}
    >
      {/* Sliding knob */}
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          marginLeft: isDark ? 2 : 22,
          background: isDark ? "rgba(255,255,255,0.85)" : "rgba(30,30,30,0.85)",
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1), background 0.3s",
          boxShadow: isDark
            ? "0 0 6px rgba(255,255,255,0.25)"
            : "0 0 6px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          lineHeight: 1,
        }}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
