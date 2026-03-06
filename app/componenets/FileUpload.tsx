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
                process.env.NEXT_PUBLIC_SERVER_URL + "/upload/pdf" || "http://localhost:8000/upload/pdf",
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
            className={`h-44 w-44 p-8 rounded-2xl border-4 flex flex-col justify-center items-center cursor-pointer
                transition-all duration-200 select-none
                ${isUploading
                    ? "bg-amber-200 border-amber-400 cursor-wait"
                    : "bg-amber-300 border-amber-600 hover:bg-amber-400 hover:scale-105"
                }`}
        >
            {isUploading ? (
                <>
                    <Loader2 size={32} className="text-amber-800 animate-spin mb-2" />
                    <span className="text-amber-900 font-bold text-sm text-center">Uploading…</span>
                </>
            ) : lastUploaded ? (
                <>
                    <CheckCircle2 size={32} className="text-amber-800 mb-2" />
                    <span className="text-amber-900 font-bold text-sm text-center">Upload Another</span>
                </>
            ) : (
                <>
                    <Upload size={32} className="text-amber-900 mb-2" />
                    <span className="text-amber-900 font-bold text-sm text-center">Upload PDF</span>
                </>
            )}
        </div>
    );
};

export default FileUploadComponent;