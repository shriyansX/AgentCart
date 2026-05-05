"use client";

import { useState, useEffect } from "react";

const STEPS = [
  { label: "Analyzing query...", icon: "🔍", delay: 0 },
  { label: "Filtering products...", icon: "📦", delay: 1200 },
  { label: "AI reasoning...", icon: "🧠", delay: 2800 },
  { label: "Generating recommendation...", icon: "⭐", delay: 4200 },
];

export default function ThinkingLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, i) =>
      setTimeout(() => setActiveStep(i), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 shadow-lg shadow-indigo-500/5">
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-500 ${
                i <= activeStep ? "opacity-100" : "opacity-20"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-500 ${
                  i < activeStep
                    ? "bg-emerald-500/20 border border-emerald-500/30"
                    : i === activeStep
                      ? "bg-indigo-500/20 border border-indigo-500/30 animate-pulse"
                      : "bg-[#1e1e2e] border border-[#2a2a3e]"
                }`}
              >
                {i < activeStep ? (
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-emerald-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-500 ${
                  i < activeStep
                    ? "text-emerald-400"
                    : i === activeStep
                      ? "text-white"
                      : "text-[#52525b]"
                }`}
              >
                {step.label}
              </span>
              {i === activeStep && (
                <div className="ml-auto flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
