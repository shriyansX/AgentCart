"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Brain, Sparkles, Check } from "lucide-react";

const STEPS = [
  { label: "Analyzing your query…", Icon: Search, delay: 0 },
  { label: "Filtering products…", Icon: Filter, delay: 1400 },
  { label: "AI reasoning…", Icon: Brain, delay: 3000 },
  { label: "Generating recommendation…", Icon: Sparkles, delay: 4500 },
];

export default function ThinkingLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setActiveStep(i), STEPS[i].delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card-solid rounded-2xl p-5 glow-soft"
      >
        <div className="space-y-2.5">
          {STEPS.map((step, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: i <= activeStep ? 1 : 0.25, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    done
                      ? "bg-emerald-500/15 border border-emerald-500/25"
                      : active
                        ? "bg-indigo-500/15 border border-indigo-500/25"
                        : "bg-white/[0.03] border border-white/[0.05]"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <motion.div key="icon" animate={active ? { scale: [1, 1.15, 1] } : {}} transition={active ? { repeat: Infinity, duration: 1.5 } : {}}>
                        <step.Icon className={`w-3.5 h-3.5 ${active ? "text-indigo-400" : "text-white/20"}`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-500 ${
                    done ? "text-emerald-400/80" : active ? "text-white" : "text-white/20"
                  }`}
                >
                  {step.label}
                </span>
                {active && (
                  <div className="ml-auto flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1 h-1 rounded-full bg-indigo-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
