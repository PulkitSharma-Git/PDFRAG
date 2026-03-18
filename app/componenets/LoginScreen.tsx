"use client";
import { signIn } from "next-auth/react";

export default function LoginScreen() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        padding: "48px 40px",
        background: "rgba(255,255,255,0.018)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 24,
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}
    >
      {/* Sub-bg spotlight */}
      <div
        style={{
          position: "absolute",
          inset: -1,
          pointerEvents: "none",
          zIndex: 0,
          background: "radial-gradient(150px circle at top center, rgba(255,255,255,0.05), transparent)",
          borderRadius: 24,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Wordmark row */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.09)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6a2 2 0 0 1 2-2h7a3 3 0 0 1 3 3v13a1.5 1.5 0 0 0-1.5-1.5H4a2 2 0 0 1-2-2V6z" />
              <path d="M22 6a2 2 0 0 0-2-2h-7a3 3 0 0 0-3 3v13a1.5 1.5 0 0 1 1.5-1.5H20a2 2 0 0 0 2-2V6z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: "-0.9px",
            margin: "0 0 8px",
            textAlign: "center",
            background: "linear-gradient(160deg, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.42) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Welcome Back
        </h2>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 400, marginBottom: 32, textAlign: "center" }}>
          Sign in to access your PDFs and start asking questions.
        </p>

        {/* Google Oauth Button */}
        <button
          onClick={() => signIn("google")}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.09)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "13px 22px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "rgba(255,255,255,0.85)",
            fontSize: 15,
            fontWeight: 500,
            cursor: "none",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
