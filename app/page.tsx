"use client";
import { useState } from "react";
import FileUploadComponent from "./componenets/FileUpload";
import ChatBox from "./componenets/ChatBox";
import { FileText, Layers, X } from "lucide-react";

export default function Home() {
    // Track all uploaded PDFs
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    // null = query ALL docs; string = query a specific file
    const [selectedFilename, setSelectedFilename] = useState<string | null>(null);

    const handleFileUpload = (filename: string) => {
        setUploadedFiles(prev => {
            if (prev.includes(filename)) return prev;
            return [...prev, filename];
        });
        // Auto-select newly uploaded file
        setSelectedFilename(filename);
    };

    const removeFile = (filename: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedFiles(prev => prev.filter(f => f !== filename));
        if (selectedFilename === filename) setSelectedFilename(null);
    };

    return (
        <div className="min-h-screen w-screen flex">

            {/* ── Left Panel: Upload + PDF List ── */}
            <div className="w-[30vw] min-h-screen flex flex-col justify-center items-center group relative overflow-hidden shadow-xl z-20 gap-6 px-6 py-10">
                {/* Animated amber tint background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 bg-[length:200%_200%] bg-[position:0%_0%] transition-all duration-700 group-hover:bg-[position:100%_100%] z-0 opacity-10" />

                <div className="relative z-10 w-full flex flex-col items-center gap-6">
                    <h2 className="text-3xl font-extrabold text-amber-900 tracking-tight text-center">
                        Gemini PDF RAG
                    </h2>

                    {/* Upload button */}
                    <FileUploadComponent onFileUpload={handleFileUpload} />

                    {/* PDF List — shown once at least one file is uploaded */}
                    {uploadedFiles.length > 0 && (
                        <div className="w-full max-w-xs space-y-2">
                            <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest text-center">
                                Your Documents
                            </p>

                            {/* All Documents option */}
                            <button
                                onClick={() => setSelectedFilename(null)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                                    selectedFilename === null
                                        ? "bg-amber-500 text-white border-amber-600 shadow"
                                        : "bg-white/60 text-amber-800 border-amber-200 hover:bg-amber-50"
                                }`}
                            >
                                <Layers size={14} className="flex-shrink-0" />
                                <span className="flex-1 text-left">All Documents ({uploadedFiles.length})</span>
                            </button>

                            {/* Individual PDFs */}
                            {uploadedFiles.map(filename => (
                                <button
                                    key={filename}
                                    onClick={() => setSelectedFilename(filename)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border group/item ${
                                        selectedFilename === filename
                                            ? "bg-amber-500 text-white border-amber-600 shadow"
                                            : "bg-white/60 text-amber-800 border-amber-200 hover:bg-amber-50"
                                    }`}
                                >
                                    <FileText size={14} className="flex-shrink-0" />
                                    <span className="flex-1 text-left truncate">{filename}</span>
                                    <span
                                        onClick={e => removeFile(filename, e)}
                                        className="opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-100 hover:text-red-500"
                                    >
                                        <X size={12} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Hint when nothing is uploaded */}
                    {uploadedFiles.length === 0 && (
                        <p className="text-xs text-amber-700 text-center max-w-[200px]">
                            Upload a PDF to start asking questions about it.
                        </p>
                    )}
                </div>
            </div>

            {/* ── Right Panel: Chat ── */}
            <div className="w-[70vw] min-h-screen bg-slate-50 border-l border-amber-200 shadow-inner z-10 flex flex-col">
                <ChatBox filename={selectedFilename} totalDocs={uploadedFiles.length} />
            </div>

        </div>
    );
}
