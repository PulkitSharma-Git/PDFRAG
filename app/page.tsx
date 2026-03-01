import FileUploadComponent from "./componenets/FileUpload";
import ChatBox from "./componenets/ChatBox";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen w-screen flex">
        {/* Upload Section - Left Side */}
        <div className="w-[30vw] min-h-screen flex justify-center items-center group relative overflow-hidden shadow-xl z-20">
          {/* Animated background layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 bg-[length:200%_200%] bg-[position:0%_0%] transition-all duration-700 group-hover:bg-[position:100%_100%] z-0 opacity-10"></div>
          
          {/* Content stays above background */}
          <div className="relative z-10 w-full flex justify-center items-center flex-col gap-6">
            <h2 className="text-3xl font-extrabold text-amber-900 tracking-tight text-center">
              Gemini PDF RAG
            </h2>
            <FileUploadComponent />
          </div>
        </div>

        {/* Chat Section - Right Side */}
        <div className="w-[70vw] min-h-screen bg-slate-50 border-l border-amber-200 shadow-inner z-10">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
