"use client";

import { useRef, FormEvent, KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!value.trim() || disabled) return;
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-3 w-full max-w-3xl mx-auto"
    >
      {/* Soft glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-violet-500/5 blur-xl pointer-events-none" />

      <div className="relative flex-1 flex items-center glass-card-solid rounded-2xl shadow-lg shadow-black/30 focus-within:border-indigo-500/30 transition-all duration-300">
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Try: "best headphones under ₹2000"'
          disabled={disabled}
          className="flex-1 bg-transparent text-white placeholder-[#52525b] text-sm md:text-base px-5 py-4 outline-none disabled:opacity-50 rounded-2xl"
          id="chat-input"
          aria-label="Search query"
        />

        <button
          type="submit"
          disabled={!value.trim() || disabled}
          id="send-button"
          aria-label="Send query"
          className="mr-2.5 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-indigo-400 hover:to-violet-400 transition-all duration-200 active:scale-90 flex-shrink-0 shadow-md shadow-indigo-500/20"
        >
          <SendHorizonal className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
