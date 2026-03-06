"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, FileText } from "lucide-react";

interface ChatBoxProps {
  filename: string | null;
  totalDocs?: number;
}

export default function ChatBox({ filename, totalDocs = 0 }: ChatBoxProps) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [sendHovered, setSendHovered] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL + "/query" || "http://localhost:8000/query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMessage, filename }),
        }
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch (error) {
      console.error("Query Error:", error);
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I encountered an error while processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const canSend = input.trim() && !isLoading;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", fontFamily: "var(--font-outfit), apple-system, sans-serif" }}>

      {/* ── Header ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "18px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.018)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.09)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <FileText size={16} style={{ color: "rgba(255,255,255,0.65)" }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)", margin: 0, letterSpacing: "-0.2px" }}>
            Ask your PDF
          </h1>
          {filename ? (
            <p style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0, letterSpacing: "0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {filename}
            </p>
          ) : totalDocs > 0 ? (
            <p style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0, letterSpacing: "0.2px" }}>
              All {totalDocs} document{totalDocs > 1 ? "s" : ""}
            </p>
          ) : (
            <p style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.18)", margin: 0, letterSpacing: "0.2px" }}>
              No PDF selected — upload one on the left
            </p>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          scrollbarWidth: "none",
        }}
      >
        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "60px 0" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.035) inset",
              }}
            >
              <FileText size={22} style={{ color: "rgba(255,255,255,0.3)" }} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.3)", maxWidth: 260, lineHeight: 1.6, margin: 0, letterSpacing: "0.2px" }}>
              {totalDocs > 0
                ? `Querying across ${totalDocs} document${totalDocs > 1 ? "s" : ""}. Select one on the left or ask away.`
                : "Upload a PDF on the left, then ask questions about it."}
            </p>

            {/* Quick-start chips */}
            {totalDocs > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 4 }}>
                {["Summarize this document", "What are the key points?", "Explain the main topic"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 400,
                      fontFamily: "inherit",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.075)",
                      color: "rgba(255,255,255,0.5)",
                      cursor: "none",
                      transition: "all 0.2s",
                      letterSpacing: "0.1px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.075)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {/* AI avatar */}
            {msg.role === "ai" && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  marginBottom: 2,
                }}
              >
                <Bot size={13} style={{ color: "rgba(255,255,255,0.45)" }} />
              </div>
            )}

            {/* Bubble */}
            <div
              style={{
                maxWidth: "72%",
                padding: "11px 16px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.6,
                letterSpacing: "0.1px",
                ...(msg.role === "user"
                  ? {
                      background: "rgba(255,255,255,0.86)",
                      color: "#000",
                      boxShadow: "0 2px 24px rgba(255,255,255,0.06)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.075)",
                      color: "rgba(255,255,255,0.85)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.025) inset",
                    }),
              }}
            >
              <p style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "flex-start" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                marginBottom: 2,
              }}
            >
              <Bot size={13} style={{ color: "rgba(255,255,255,0.45)" }} />
            </div>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "16px 16px 16px 4px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.075)",
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                    animation: "typingBounce 1.2s ease-in-out infinite",
                    animationDelay: `${delay}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "16px 28px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.018)",
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSendMessage(); }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            disabled={isLoading}
            placeholder={
              filename
                ? `Ask about ${filename}…`
                : totalDocs > 0
                ? "Ask across all documents…"
                : "Upload a PDF to get started…"
            }
            style={{
              width: "100%",
              padding: "12px 52px 12px 16px",
              background: inputFocused ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
              border: inputFocused ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.075)",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 400,
              fontFamily: "inherit",
              color: "rgba(255,255,255,0.85)",
              outline: "none",
              boxShadow: inputFocused ? "0 0 0 3px rgba(255,255,255,0.035)" : "none",
              transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
              cursor: "none",
              opacity: isLoading ? 0.5 : 1,
              WebkitAppearance: "none",
            }}
          />
          {/* Placeholder color override */}
          <style>{`
            input::placeholder { color: rgba(255,255,255,0.16); font-weight: 300; }
            input:disabled { cursor: not-allowed; }
            @keyframes typingBounce {
              0%, 60%, 100% { transform: translateY(0); opacity: 0.25; }
              30%            { transform: translateY(-5px); opacity: 0.8; }
            }
            ::-webkit-scrollbar { display: none; }
          `}</style>

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!canSend}
            onMouseEnter={() => setSendHovered(true)}
            onMouseLeave={() => setSendHovered(false)}
            style={{
              position: "absolute",
              right: 8,
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "none",
              display: "grid",
              placeItems: "center",
              cursor: canSend ? "none" : "default",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: sendHovered && canSend ? "translateY(-1px)" : "translateY(0)",
              ...(canSend
                ? {
                    background: sendHovered ? "#fff" : "rgba(255,255,255,0.86)",
                    boxShadow: sendHovered
                      ? "0 6px 24px rgba(255,255,255,0.18), 0 0 40px rgba(255,255,255,0.06)"
                      : "0 2px 12px rgba(255,255,255,0.08)",
                  }
                : {
                    background: "rgba(255,255,255,0.07)",
                    boxShadow: "none",
                  }),
            }}
          >
            <Send size={14} style={{ color: canSend ? "#000" : "rgba(255,255,255,0.18)" }} />
          </button>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 7, marginTop: 10 }}>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
          <p style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.18)", margin: 0, letterSpacing: "0.2px" }}>
            Powered by Gemini · Answers grounded in your PDF content
          </p>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
        </div>
      </div>

    </div>
  );
}