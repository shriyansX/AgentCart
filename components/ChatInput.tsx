"use client";

import { useRef, FormEvent, KeyboardEvent } from "react";

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
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl pointer-events-none" />

      <div className="relative flex-1 flex items-center bg-[#111118] border border-[#1e1e2e] rounded-full shadow-lg shadow-black/40 focus-within:border-indigo-500 transition-colors duration-200">
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Try: "best headphones under ₹2000"'
          disabled={disabled}
          className="flex-1 bg-transparent text-white placeholder-[#52525b] text-sm md:text-base px-5 py-4 outline-none disabled:opacity-60"
          id="chat-input"
          aria-label="Search query"
        />

        <button
          type="submit"
          disabled={!value.trim() || disabled}
          id="send-button"
          aria-label="Send query"
          className="mr-2 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 transition-all duration-200 active:scale-95 flex-shrink-0 shadow-md shadow-indigo-600/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 translate-x-0.5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
