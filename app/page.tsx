"use client";
import { useState, useRef } from "react";
import FileUploadComponent from "./componenets/FileUpload";
import ChatBox from "./componenets/ChatBox";
import { FileText, Layers, X } from "lucide-react";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [cardMouse, setCardMouse] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Card-relative mouse tracking for panel inner spotlight
  const handlePanelMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setCardMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

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
        background: "transparent",
        fontFamily: "var(--font-outfit), apple-system, sans-serif",
        cursor: "none",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Left Panel ── */}
      <div
        ref={panelRef}
        onMouseMove={handlePanelMouseMove}
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
          borderRight: "1px solid rgba(255,140,40,0.09)",
          // Card glass background
          background: "rgba(255,140,30,0.022)",
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
            background: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), rgba(255,160,40,0.06), transparent 70%)",
            borderRight: "1px solid rgba(255,140,40,0.09)",
          }}
        />

        {/* Panel content */}
        <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

          {/* Wordmark row */}
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:4 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"rgba(255,150,40,0.09)", border:"1px solid rgba(255,150,40,0.13)", display:"grid", placeItems:"center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,80,0.75)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6a2 2 0 0 1 2-2h7a3 3 0 0 1 3 3v13a1.5 1.5 0 0 0-1.5-1.5H4a2 2 0 0 1-2-2V6z" />
                <path d="M22 6a2 2 0 0 0-2-2h-7a3 3 0 0 0-3 3v13a1.5 1.5 0 0 1 1.5-1.5H20a2 2 0 0 0 2-2V6z" />
              </svg>
            </div>
            <span style={{ fontSize:12.5, fontWeight:500, color:"rgba(255,180,80,0.4)", letterSpacing:"0.4px" }}>
              PDF RAG
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: 32,
              fontWeight: 600,
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
              margin: "0 0 6px",
              textAlign: "center",
              background: "linear-gradient(160deg, rgba(255,230,160,0.95) 30%, rgba(255,150,50,0.55) 100%)",
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
              <p style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,160,50,0.25)", textTransform: "uppercase", letterSpacing: "0.2px", textAlign: "center", marginBottom: 4 }}>
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
                  border: selectedFilename === null ? "1px solid rgba(255,180,60,0.3)" : "1px solid rgba(255,150,40,0.1)",
                  background: selectedFilename === null ? "rgba(255,160,40,0.88)" : "rgba(255,140,30,0.05)",
                  color: selectedFilename === null ? "#1a0800" : "rgba(255,200,120,0.85)",
                  boxShadow: selectedFilename === null ? "0 2px 24px rgba(255,140,30,0.18)" : "none",
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
                    border: selectedFilename === filename ? "1px solid rgba(255,180,60,0.3)" : "1px solid rgba(255,150,40,0.1)",
                    background: selectedFilename === filename ? "rgba(255,160,40,0.88)" : "rgba(255,140,30,0.05)",
                    color: selectedFilename === filename ? "#1a0800" : "rgba(255,200,120,0.85)",
                    boxShadow: selectedFilename === filename ? "0 2px 24px rgba(255,140,30,0.18)" : "none",
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
            <p style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,160,50,0.25)", textAlign: "center", maxWidth: 200, letterSpacing: "0.2px", lineHeight: 1.5 }}>
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
          background: "rgba(255,110,10,0.01)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Subtle top fade */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg, transparent, rgba(255,160,40,0.04) 30%, rgba(255,160,40,0.04) 70%, transparent)", pointerEvents:"none" }} />
        <ChatBox filename={selectedFilename} totalDocs={uploadedFiles.length} />
      </div>
    </div>
  );
}