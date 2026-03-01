"use client"
import * as React from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
    onFileUpload?: (filename: string) => void;
}

const FileUploadComponent: React.FC<FileUploadProps> = ({ onFileUpload }) => {

    const handleFileUploadButtonClick = () => {
        const el = document.createElement("input");
        el.setAttribute("type", "file");
        el.setAttribute("accept", "application/pdf");
        el.addEventListener("change", async ( ) => {
            if(el.files && el.files?.length > 0) {
                const file = el.files.item(0);

                if(file) {
                    const formData = new FormData();
                    formData.append("pdf", file)

                    await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/upload/pdf" || "http://localhost:8000/upload/pdf", {
                        method: "POST",
                        body: formData
                    });
                    console.log("File Uploaded ")
                    if (onFileUpload) {
                        onFileUpload(file.name);
                    }
                }

            }
        })
        el.click();
    }


    return (
        <div onClick={handleFileUploadButtonClick} className="h-48 w-48 p-10 border-amber-600 rounded-2xl border-4 flex flex-col justify-center items-center bg-amber-300 hover:bg-amber-400 transition cursor-pointer">
            <div className="text-center border-amber-600 text-amber-900 font-bold mb-2">
                Upload PDF
            </div>
            <Upload className="text-amber-900" size={32}></Upload>
        </div>
    );

};

export default FileUploadComponent;