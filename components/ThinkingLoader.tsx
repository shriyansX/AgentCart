"use client";

export default function ThinkingLoader() {
  return (
    <div className="flex items-center justify-center gap-4 py-12">
      <div className="flex items-center gap-3 bg-[#111118] border border-[#1e1e2e] rounded-2xl px-6 py-4 shadow-lg shadow-indigo-500/5">
        <div className="flex gap-1.5">
          <span
            className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2.5 h-2.5 bg-indigo-300 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span className="text-[#a1a1aa] text-sm font-medium animate-pulse">
          Agent is thinking...
        </span>
      </div>
    </div>
  );
}
