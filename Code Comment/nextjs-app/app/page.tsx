
"use client";
import { useState, useRef } from "react";

export default function CodeCommentGenerator() {
  const [inputCode, setInputCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [outputCode, setOutputCode] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError("");
    setOutputCode("");
    try {
      const res = await fetch("/api/code-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode, language }),
      });
      const data = await res.json();
      if (data.commentedCode) {
        setOutputCode(data.commentedCode);
      } else {
        setCommentError(data.error || "Unknown error");
      }
    } catch (err) {
      setCommentError("Failed to fetch comments.");
    }
    setCommentLoading(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setInputCode(event.target?.result as string || "");
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen w-full h-full bg-[#1e1e1e] font-mono p-2 sm:p-6">
      <div className="w-full h-full px-2 py-2 sm:px-6 sm:py-6 shadow-2xl border border-[#333] bg-[#252526]">
        {/* VS Code style header */}
        <div className="flex items-center px-4 sm:px-6 py-3 bg-[#2d2d2d] border-b border-[#333]">
          <span className="text-[#22d3ee] text-lg sm:text-xl font-bold mr-2">&#9679;</span>
          <span className="text-[#d4d4d4] text-base sm:text-lg font-semibold">Code Comment Generator</span>
        </div>
        {/* Main content */}
        <div className="flex flex-col md:flex-row">
          {/* Sidebar (fake file explorer) */}
          <div className="hidden md:block w-40 md:w-48 bg-[#2d2d2d] border-r border-[#333] py-4 sm:py-6 px-2 sm:px-4">
            <div className="text-[#d4d4d4] text-xs sm:text-sm font-bold mb-2 sm:mb-4">EXPLORER</div>
            <div className="text-[#d4d4d4] text-xs">code-comment/</div>
            <div className="text-[#d4d4d4] text-xs ml-2 sm:ml-4">main.ts</div>
            <div className="text-[#d4d4d4] text-xs ml-2 sm:ml-4">utils.ts</div>
            <div className="text-[#d4d4d4] text-xs ml-2 sm:ml-4">README.md</div>
          </div>
          {/* Editor panel */}
          <div className="flex-1 p-4 sm:p-8">
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <label className="text-[#d4d4d4] font-semibold text-sm sm:text-base">Paste your code or import a file:</label>
                <input
                  type="file"
                  accept=".py,.js,.ts,.java,.cpp,.cs,.go,.rb,.txt"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  className="bg-[#1e1e1e] text-[#d4d4d4] border border-[#333] rounded px-2 py-1 text-xs sm:text-sm"
                />
              </div>
              <textarea
                className="w-full h-40 p-2 border border-[#333] rounded bg-[#1e1e1e] text-[#d4d4d4] font-mono mb-4 text-xs sm:text-sm resize-y"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="Paste your code here..."
                required
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <label className="text-[#d4d4d4] font-semibold text-sm sm:text-base">Select language:</label>
                <select
                  className="bg-[#1e1e1e] text-[#d4d4d4] border border-[#333] rounded px-2 py-1 text-xs sm:text-sm"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                  <option value="c++">C++</option>
                  <option value="c#">C#</option>
                  <option value="go">Go</option>
                  <option value="ruby">Ruby</option>
                </select>
                <button
                  type="submit"
                  className="bg-[#007acc] text-white px-3 sm:px-4 py-2 rounded font-semibold shadow hover:bg-[#005a9e] text-xs sm:text-sm"
                  disabled={commentLoading}
                >
                  {commentLoading ? "Generating..." : "Generate Comments"}
                </button>
              </div>
            </form>
            {commentError && <div className="mt-4 text-red-400 text-xs sm:text-sm">{commentError}</div>}
            {outputCode && (
              <div className="mt-8 bg-[#1e1e1e] border border-[#333] p-2 sm:p-4 rounded shadow relative overflow-x-auto">
                <label className="block mb-2 text-[#d4d4d4] font-semibold text-sm sm:text-base">Commented Code:</label>
                <button
                  type="button"
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-[#007acc] text-white px-2 sm:px-3 py-1 rounded text-xs font-semibold hover:bg-[#005a9e]"
                  onClick={() => {
                    navigator.clipboard.writeText(outputCode);
                  }}
                  aria-label="Copy to clipboard"
                >
                  Copy
                </button>
                <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-[#d4d4d4]">{outputCode}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}