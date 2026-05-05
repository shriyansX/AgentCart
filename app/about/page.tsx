import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export const metadata = { title: "About – AgentCart", description: "AgentCart is an AI-powered shopping decision agent." };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090f] text-white hero-bg">
      <header className="border-b border-white/[0.04] glass-card-solid sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-white" /></div>
            <span className="font-heading text-sm font-bold gradient-text">AgentCart</span>
          </Link>
          <Link href="/" className="text-[#71717a] hover:text-white text-sm transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 rotate-180" /> Back</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-8">About <span className="gradient-text">AgentCart</span></h1>
        <div className="space-y-5 text-sm leading-relaxed">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-2 font-heading">The Problem</h2>
            <p className="text-[#a1a1aa]">Finding the right product online is overwhelming. Users waste hours comparing specs, reading conflicting reviews, and second-guessing. More options often means worse decisions.</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-2 font-heading">The Solution</h2>
            <p className="text-[#a1a1aa]">AgentCart is an <strong className="text-white">AI-powered shopping decision agent</strong>. It understands your intent, filters products, reasons about trade-offs, and gives a confident recommendation with full transparency.</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-2 font-heading">What Makes It Different</h2>
            <ul className="space-y-2 mt-2">
              {["Not a chatbot — it's a decision engine", "Deterministic filtering BEFORE AI reasoning", "Full transparency: see how the agent decided", "Structured verdict with confidence score", "Explains why alternatives were rejected"].map((t, i) => (
                <li key={i} className="text-[#a1a1aa] flex items-start gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-2 font-heading">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              {[{ l: "Frontend", v: "Next.js + TypeScript" }, { l: "Styling", v: "Tailwind CSS v4" }, { l: "AI", v: "Google Gemini 1.5 Flash" }, { l: "Data", v: "40+ product dataset" }].map(({ l, v }) => (
                <div key={l} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                  <p className="text-[#52525b] text-[11px]">{l}</p>
                  <p className="text-white text-sm font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex gap-3">
          <Link href="/" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/15 text-sm flex items-center gap-2">Try AgentCart <ArrowRight className="w-4 h-4" /></Link>
          <Link href="/how-it-works" className="glass-card text-[#a1a1aa] hover:text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">How It Works</Link>
        </div>
      </main>
    </div>
  );
}
