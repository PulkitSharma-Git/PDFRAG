"use client";
import * as React from "react";
import { useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

interface FileUploadProps {
  onFileUpload?: (filename: string) => void;
}

const FileUploadComponent: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [lastUploaded, setLastUploaded] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  const uploadFile = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const res = await fetch(
        (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000") + "/upload/pdf",
        { method: "POST", body: formData }
      );
      if (!res.ok) throw new Error("Upload failed");
      setLastUploaded(file.name);
      if (onFileUpload) onFileUpload(file.name);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Is the server running?");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (isUploading) return;
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "application/pdf";
    el.addEventListener("change", () => {
      if (el.files?.[0]) uploadFile(el.files[0]);
    });
    el.click();
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 176,
        height: 176,
        borderRadius: 22,
        border: isUploading
          ? "1px solid rgba(255,255,255,0.12)"
          : hovered
          ? "1px solid rgba(255,255,255,0.2)"
          : "1px solid rgba(255,255,255,0.075)",
        background: isUploading
          ? "rgba(255,255,255,0.04)"
          : hovered
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.04)",
        boxShadow: hovered && !isUploading
          ? "0 0 0 1px rgba(255,255,255,0.035) inset, 0 20px 40px rgba(0,0,0,0.6), 0 6px 36px rgba(255,255,255,0.04)"
          : "0 0 0 1px rgba(255,255,255,0.035) inset, 0 20px 40px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: isUploading ? "wait" : "none",
        userSelect: "none",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered && !isUploading ? "translateY(-2px) scale(1.01)" : "translateY(0) scale(1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer sweep on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(100deg, transparent 35%, rgba(255,255,255,0.06) 50%, transparent 65%)",
          transform: hovered && !isUploading ? "translateX(120%)" : "translateX(-120%)",
          transition: hovered && !isUploading ? "transform 0.55s ease" : "none",
          pointerEvents: "none",
        }}
      />

      {isUploading ? (
        <>
          <Loader2
            size={28}
            style={{ color: "rgba(255,255,255,0.45)", marginBottom: 10, animation: "spin 1s linear infinite" }}
          />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 400, letterSpacing: "0.2px", fontFamily: "inherit" }}>
            Uploading…
          </span>
        </>
      ) : lastUploaded ? (
        <>
          <CheckCircle2 size={28} style={{ color: "rgba(255,255,255,0.65)", marginBottom: 10 }} />
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 500, letterSpacing: "0.05px", fontFamily: "inherit" }}>
            Upload Another
          </span>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 11, fontWeight: 300, marginTop: 4, letterSpacing: "0.2px", fontFamily: "inherit" }}>
            PDF only
          </span>
        </>
      ) : (
        <>
          <Upload size={28} style={{ color: "rgba(255,255,255,0.65)", marginBottom: 10 }} />
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 500, letterSpacing: "0.05px", fontFamily: "inherit" }}>
            Upload PDF
          </span>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 11, fontWeight: 300, marginTop: 4, letterSpacing: "0.2px", fontFamily: "inherit" }}>
            Click to browse
          </span>
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FileUploadComponent;