"use client";
import { useState, useRef, useEffect } from "react";
import FileUploadComponent from "./componenets/FileUpload";
import ChatBox from "./componenets/ChatBox";
import { FileText, Layers, X } from "lucide-react";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const [cardMouse, setCardMouse] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Global mouse tracking
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });

      // Card-relative mouse
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        setCardMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleFileUpload = (filename: string) => {
    setUploadedFiles((prev) => {
      if (prev.includes(filename)) return prev;
      return [...prev, filename];
    });
    setSelectedFilename(filename);
  };

  const removeFile = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFiles((prev) => prev.filter((f) => f !== filename));
    if (selectedFilename === filename) setSelectedFilename(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        background: "#050505",
        fontFamily: "var(--font-outfit), apple-system, sans-serif",
        cursor: "none",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Custom cursor ── */}
      <div
        style={{
          position: "fixed",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          left: mouse.x,
          top: mouse.y,
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
        }}
      />

      {/* ── Global spotlight ── */}
      <div
        style={{
          position: "fixed",
          width: 700,
          height: 700,
          borderRadius: "50%",
          left: mouse.x,
          top: mouse.y,
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.065) 0%, rgba(180,140,255,0.03) 30%, transparent 65%)",
          filter: "blur(1px)",
          pointerEvents: "none",
          zIndex: 1,
          transition: "left 0.07s ease-out, top 0.07s ease-out",
        }}
      />

      {/* ── Ambient orbs ── */}
      <div style={{ position:"fixed", width:350, height:350, borderRadius:"50%", top:"5%", left:"5%", background:"radial-gradient(circle, rgba(110,70,240,0.09), transparent 70%)", filter:"blur(70px)", pointerEvents:"none", zIndex:0, animation:"drift1 11s ease-in-out infinite" }} />
      <div style={{ position:"fixed", width:250, height:250, borderRadius:"50%", bottom:"10%", right:"10%", background:"radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)", filter:"blur(70px)", pointerEvents:"none", zIndex:0, animation:"drift2 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed", width:180, height:180, borderRadius:"50%", bottom:"25%", left:"8%", background:"radial-gradient(circle, rgba(60,140,255,0.07), transparent 70%)", filter:"blur(70px)", pointerEvents:"none", zIndex:0, animation:"drift1 18s ease-in-out infinite reverse" }} />

      {/* ── Hairline rules ── */}
      <div style={{ position:"fixed", left:0, right:0, top:"28%", height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.045) 20%, rgba(255,255,255,0.045) 80%, transparent)", pointerEvents:"none", zIndex:1 }} />
      <div style={{ position:"fixed", left:0, right:0, bottom:"28%", height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.045) 20%, rgba(255,255,255,0.045) 80%, transparent)", pointerEvents:"none", zIndex:1 }} />

      {/* ── Film grain ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── Left Panel ── */}
      <div
        ref={panelRef}
        style={{
          width: "30vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          zIndex: 20,
          gap: 24,
          padding: "40px 24px",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          // Card glass background
          background: "rgba(255,255,255,0.018)",
          // Card-light via CSS variable
          ["--mx" as string]: `${cardMouse.x}px`,
          ["--my" as string]: `${cardMouse.y}px`,
        }}
      >
        {/* Card inner spotlight */}
        <div
          style={{
            position: "absolute",
            inset: -1,
            pointerEvents: "none",
            zIndex: 0,
            background: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.05), transparent 70%)",
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        />

        {/* Panel content */}
        <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

          {/* Wordmark row */}
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:4 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.09)", display:"grid", placeItems:"center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6a2 2 0 0 1 2-2h7a3 3 0 0 1 3 3v13a1.5 1.5 0 0 0-1.5-1.5H4a2 2 0 0 1-2-2V6z" />
                <path d="M22 6a2 2 0 0 0-2-2h-7a3 3 0 0 0-3 3v13a1.5 1.5 0 0 1 1.5-1.5H20a2 2 0 0 0 2-2V6z" />
              </svg>
            </div>
            <span style={{ fontSize:12.5, fontWeight:500, color:"rgba(255,255,255,0.3)", letterSpacing:"0.4px" }}>
              PDF RAG
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: 27,
              fontWeight: 600,
              letterSpacing: "-0.9px",
              lineHeight: 1.18,
              margin: "0 0 6px",
              textAlign: "center",
              background: "linear-gradient(160deg, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.42) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ask anything,<br />instantly.
          </h2>

          {/* Upload button */}
          <FileUploadComponent onFileUpload={handleFileUpload} />

          {/* PDF list */}
          {uploadedFiles.length > 0 && (
            <div style={{ width: "100%", maxWidth: 260, display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.18)", textTransform: "uppercase", letterSpacing: "0.2px", textAlign: "center", marginBottom: 4 }}>
                Your Documents
              </p>

              {/* All Docs */}
              <button
                onClick={() => setSelectedFilename(null)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11.5px 14px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 400,
                  fontFamily: "inherit",
                  cursor: "none",
                  transition: "all 0.2s",
                  border: selectedFilename === null ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.075)",
                  background: selectedFilename === null ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.04)",
                  color: selectedFilename === null ? "#000" : "rgba(255,255,255,0.85)",
                  boxShadow: selectedFilename === null ? "0 2px 24px rgba(255,255,255,0.09)" : "none",
                }}
              >
                <Layers size={14} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, textAlign: "left" }}>All Documents ({uploadedFiles.length})</span>
              </button>

              {/* Individual files */}
              {uploadedFiles.map((filename) => (
                <button
                  key={filename}
                  onClick={() => setSelectedFilename(filename)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11.5px 14px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 400,
                    fontFamily: "inherit",
                    cursor: "none",
                    transition: "all 0.2s",
                    border: selectedFilename === filename ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.075)",
                    background: selectedFilename === filename ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.04)",
                    color: selectedFilename === filename ? "#000" : "rgba(255,255,255,0.85)",
                    boxShadow: selectedFilename === filename ? "0 2px 24px rgba(255,255,255,0.09)" : "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <FileText size={14} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{filename}</span>
                  <span
                    onClick={(e) => removeFile(filename, e)}
                    style={{ padding: 2, borderRadius: 4, opacity: 0.5, transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
                  >
                    <X size={12} />
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Empty hint */}
          {uploadedFiles.length === 0 && (
            <p style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.18)", textAlign: "center", maxWidth: 200, letterSpacing: "0.2px", lineHeight: 1.5 }}>
              Upload a PDF to start asking questions about it.
            </p>
          )}
        </div>
      </div>

      {/* ── Right Panel: Chat ── */}
      <div
        style={{
          width: "70vw",
          minHeight: "100vh",
          background: "rgba(255,255,255,0.012)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Subtle top fade */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.03) 70%, transparent)", pointerEvents:"none" }} />
        <ChatBox filename={selectedFilename} totalDocs={uploadedFiles.length} />
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes drift1 {
          0%,100% { transform: translate(0,0); }
          40%      { transform: translate(14px,-22px); }
          70%      { transform: translate(-8px,10px); }
        }
        @keyframes drift2 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(-20px,-18px); }
        }
      `}</style>
    </div>
  );
}