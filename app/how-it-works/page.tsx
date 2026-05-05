import Link from "next/link";
import { Search, Filter, Brain, Target, ArrowRight, Sparkles } from "lucide-react";

export const metadata = { title: "How It Works – AgentCart", description: "Learn how AgentCart's AI agent decides." };

const STEPS = [
  { num: "01", Icon: Search, title: "Understand Your Query", desc: "Natural language parsing extracts category, budget, use-case, and brand preference using a hybrid code + AI approach.", color: "indigo" },
  { num: "02", Icon: Filter, title: "Filter Products", desc: "Before any AI call, we deterministically filter our dataset. Category matching, budget caps, and relevance scoring narrow 40+ products to the top 5.", color: "violet" },
  { num: "03", Icon: Brain, title: "AI Reasoning", desc: "Google Gemini analyzes only pre-filtered products — explaining each, comparing trade-offs, and scoring relevance to your query.", color: "purple" },
  { num: "04", Icon: Target, title: "Final Decision", desc: "A structured verdict: Best Performance, Best Value, and Overall Winner — with confidence score and explanations for rejected alternatives.", color: "emerald" },
];
const C: Record<string, string> = { indigo: "border-indigo-400/12 bg-indigo-500/[0.04]", violet: "border-violet-400/12 bg-violet-500/[0.04]", purple: "border-purple-400/12 bg-purple-500/[0.04]", emerald: "border-emerald-400/12 bg-emerald-500/[0.04]" };
const IC: Record<string, string> = { indigo: "text-indigo-400 bg-indigo-500/15", violet: "text-violet-400 bg-violet-500/15", purple: "text-purple-400 bg-purple-500/15", emerald: "text-emerald-400 bg-emerald-500/15" };
const NC: Record<string, string> = { indigo: "text-indigo-400/40", violet: "text-violet-400/40", purple: "text-purple-400/40", emerald: "text-emerald-400/40" };

export default function HowItWorksPage() {
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
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">How <span className="gradient-text">AgentCart</span> Works</h1>
          <p className="text-[#a1a1aa] text-base max-w-lg mx-auto">Not a chatbot — a decision-making AI agent with a structured pipeline.</p>
        </div>
        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.num} className={`border rounded-2xl p-6 ${C[s.color]}`}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <span className={`font-heading text-xl font-bold ${NC[s.color]}`}>{s.num}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${IC[s.color]}`}><s.Icon className="w-5 h-5" /></div>
                </div>
                <div>
                  <h2 className="text-white font-bold text-base mb-1.5 font-heading">{s.title}</h2>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <p className="text-[#3f3f46] text-xs mb-5 uppercase tracking-widest">Pipeline</p>
          <div className="flex items-center justify-center gap-1.5 flex-wrap text-[11px] font-medium">
            {["User Query", "→", "Intent", "→", "Filter", "→", "AI Reason", "→", "Decision"].map((t, i) =>
              t === "→" ? <span key={i} className="text-[#3f3f46]">→</span> : <span key={i} className="bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 rounded-lg text-[#71717a]">{t}</span>
            )}
          </div>
        </div>
        <div className="mt-14 text-center">
          <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/15 text-sm">
            Try It Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
