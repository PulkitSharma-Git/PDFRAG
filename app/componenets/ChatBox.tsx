"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, FileText } from "lucide-react";

interface ChatBoxProps {
    filename: string | null;
    totalDocs?: number;
}

export default function ChatBox({ filename, totalDocs = 0 }: ChatBoxProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch(
                process.env.NEXT_PUBLIC_SERVER_URL + "/query" || "http://localhost:8000/query",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question: userMessage, filename: filename })
                }
            );

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

            const data = await res.json();
            setMessages(prev => [...prev, { role: "ai", text: data.answer }]);

        } catch (error) {
            console.error("Query Error:", error);
            setMessages(prev => [...prev, { role: "ai", text: "Sorry, I encountered an error while processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">

            {/* ── Header ── */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-amber-200 bg-white flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-amber-600" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-base font-bold text-slate-800">Ask your PDF</h1>
                    {filename ? (
                        <p className="text-xs text-amber-600 font-medium truncate">📄 {filename}</p>
                    ) : totalDocs > 0 ? (
                        <p className="text-xs text-amber-600 font-medium">
                            🗂 All {totalDocs} document{totalDocs > 1 ? "s" : ""}
                        </p>
                    ) : (
                        <p className="text-xs text-slate-400">No PDF selected — upload one on the left</p>
                    )}
                </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-slate-50">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-16">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                            <FileText size={24} className="text-amber-500" />
                        </div>
                        <p className="text-slate-500 text-sm max-w-xs">
                            {totalDocs > 0
                                ? `Querying across ${totalDocs} document${totalDocs > 1 ? "s" : ""}. Select a specific PDF from the left, or ask away!`
                                : "Upload a PDF on the left, then ask questions about it."}
                        </p>
                        {/* Quick-start chips */}
                        {totalDocs > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                {["Summarize this document", "What are the key points?", "Explain the main topic"].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setInput(q)}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 border border-amber-200 text-amber-700 hover:bg-amber-200 transition"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "ai" && (
                            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mb-0.5">
                                <Bot size={14} className="text-amber-600" />
                            </div>
                        )}
                        {/* Fixed max-w so bubbles don't shift the layout */}
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                                ? "bg-amber-500 text-white rounded-tr-sm"
                                : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                        }`}>
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mb-0.5">
                            <Bot size={14} className="text-amber-600" />
                        </div>
                        <div className="max-w-[75%] px-4 py-3.5 rounded-2xl rounded-tl-sm bg-white border border-slate-200 shadow-sm">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* ── Input ── */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-amber-200 bg-white">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) handleSendMessage(); }}
                        disabled={isLoading}
                        placeholder={
                            filename ? `Ask about ${filename}…`
                            : totalDocs > 0 ? "Ask across all documents…"
                            : "Upload a PDF to get started…"
                        }
                        className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent rounded-full text-slate-700 shadow-sm transition-all disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">
                    Powered by Gemini · Answers are grounded in your PDF content
                </p>
            </div>
        </div>
    );
}
