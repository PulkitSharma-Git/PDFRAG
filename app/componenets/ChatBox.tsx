"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";

export default function ChatBox() {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/query" || "http://localhost:8000/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question: userMessage })
            });

            if (!res.ok) throw new Error("Failed to fetch response");

            const data = await res.json();
            
            setMessages(prev => [...prev, { role: "ai", text: data.answer }]);

        } catch (error) {
            console.error("Query Error", error);
            setMessages(prev => [...prev, { role: "ai", text: "Sorry, I encountered an error while processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 w-full p-4">
            {/* Header */}
            <div className="pb-4 border-b text-center">
                <h1 className="text-2xl font-bold text-slate-800">Ask your PDF</h1>
                <p className="text-slate-500 text-sm">Upload a PDF on the left and start asking questions!</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-4 px-2 pb-4">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        Ask a question to get started. 
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${
                                msg.role === 'user' 
                                ? 'bg-amber-500 text-white rounded-tr-none' 
                                : 'bg-white border text-slate-800 rounded-tl-none shadow-sm'
                            }`}>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-4 rounded-2xl bg-white border text-slate-800 rounded-tl-none shadow-sm flex space-x-2 items-center">
                           <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                           <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                           <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-300"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="pt-4 mt-auto border-t">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                        }}
                        disabled={isLoading}
                        placeholder="Ask about the document..."
                        className="w-full pl-4 pr-12 py-3 bg-white border outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent rounded-full text-slate-700 shadow-sm transition-all"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 focus:outline-none disabled:opacity-50 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
