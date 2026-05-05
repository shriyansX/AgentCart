"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles, Trophy, Gem, Crown, Scale, HelpCircle, X, Zap, Package, Brain, Target, Info } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import ProductGrid from "@/components/ProductGrid";
import ThinkingLoader from "@/components/ThinkingLoader";
import { ApiResponse, EnrichedProduct } from "@/lib/types";

type AppState = "empty" | "loading" | "results";
const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

const CHIPS = [
  { label: "Best headphones under ₹2000" },
  { label: "Laptop for coding under ₹60,000" },
  { label: "Gaming mouse under ₹3000" },
  { label: "Budget smartphone under ₹15,000" },
  { label: "Mechanical keyboard under ₹5000" },
  { label: "Wireless earbuds under ₹3000" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<AppState>("empty");
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [showWhyNot, setShowWhyNot] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "results" && ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state, results]);

  const submit = async (q?: string) => {
    const sq = q ?? query;
    if (!sq.trim()) return;
    setLastQuery(sq); setQuery(""); setState("loading"); setResults(null); setShowCompare(false); setShowWhyNot(false);
    try {
      const r = await fetch("/api/recommend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: sq }) });
      if (!r.ok) throw new Error();
      setResults(await r.json()); setState("results");
    } catch {
      setResults({ products: [] as EnrichedProduct[], comparison_summary: "Showing best matches for your query.", final_recommendation_id: "", final_recommendation_why: "", is_fallback: true, agent_thinking: { detected_category: "general", detected_budget: null, detected_use_case: "general", total_products: 0, filtered_count: 0, ai_analyzed_count: 0, confidence: 0 }, final_verdict: { best_performance: null, best_value: null, overall_winner: null }, why_not_others: [] });
      setState("results");
    }
  };

  const reset = () => { setState("empty"); setResults(null); setLastQuery(""); setQuery(""); };
  const top2 = results?.products.slice(0, 2) || [];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070711", paddingTop: "56px" }}>
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">

          {state === "empty" && (
            <motion.div key="empty" {...fade} transition={{ duration: 0.5 }} className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="max-w-2xl mx-auto">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
                  className="w-16 h-16 mx-auto mb-6 animate-float" style={{ borderRadius: 20, background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15))", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles className="w-7 h-7 text-indigo-400" />
                </motion.div>
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold px-4 py-1.5 rounded-full mb-6" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", color: "#818cf8" }}>
                  <Zap className="w-3 h-3" /> Powered by Google Gemini
                </div>
                <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.1] mb-4">
                  Find the <span className="gradient-text">Perfect Product</span><br />in Seconds
                </h2>
                <p className="text-base sm:text-lg leading-relaxed mb-2 max-w-lg mx-auto" style={{ color: "#a1a1aa" }}>
                  AI that understands, compares, and recommends for you.
                </p>
                <p className="text-xs mb-8" style={{ color: "#3f3f46" }}>
                  🛍️ 60+ Products &nbsp;•&nbsp; 🧠 Gemini AI &nbsp;•&nbsp; ⚡ Instant Results &nbsp;•&nbsp; 🇮🇳 India Prices
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {CHIPS.map((c, i) => (
                    <motion.button key={c.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                      onClick={() => submit(c.label)}
                      className="text-[13px] px-4 py-2.5 rounded-full cursor-pointer transition-all"
                      style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)", color: "#a1a1aa" }}>
                      {c.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {state === "loading" && (
            <motion.div key="loading" {...fade} transition={{ duration: 0.4 }} className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="w-full max-w-3xl mx-auto text-center">
                <p className="text-sm mb-1" style={{ color: "#71717a" }}>Searching for</p>
                <p className="text-white font-semibold text-lg font-heading mb-6">&ldquo;{lastQuery}&rdquo;</p>
                <ThinkingLoader />
                <div className="mt-8 grid grid-cols-3 gap-5 opacity-10">
                  {[1,2,3].map(i => <div key={i} className="h-80 rounded-2xl shimmer" style={{ border: "1px solid rgba(255,255,255,0.03)", background: "rgba(255,255,255,0.02)" }} />)}
                </div>
              </div>
            </motion.div>
          )}

          {state === "results" && results && (
            <motion.div key="results" {...fade} transition={{ duration: 0.5 }} ref={ref} className="flex-1 px-4 py-8 pb-32">
              <div className="max-w-6xl mx-auto space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#71717a" }}>Results for</p>
                    <p className="text-white font-semibold text-lg font-heading">&ldquo;{lastQuery}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {results.agent_thinking.confidence > 0 && (
                      <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", color: "#34d399" }}>
                        ✦ {results.agent_thinking.confidence}% confident
                      </span>
                    )}
                    <button onClick={reset} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl" style={{ color: "#71717a", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <RotateCcw className="w-3.5 h-3.5" /> New Search
                    </button>
                  </div>
                </div>
                {results.is_fallback && (
                  <div className="px-4 py-3 rounded-xl flex items-center gap-2 text-sm" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)", color: "#fbbf24" }}>
                    <Info className="w-4 h-4 flex-shrink-0" /> Showing best matches based on your query.
                  </div>
                )}
                {results.agent_thinking.total_products > 0 && (
                  <div className="glass-card p-5">
                    <h3 className="text-white font-semibold text-sm font-heading mb-3 flex items-center gap-2">
                      <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Brain className="w-3.5 h-3.5 text-violet-400" /></div>
                      How Agent Decided
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { l: "Category", v: results.agent_thinking.detected_category, I: Package },
                        { l: "Budget", v: results.agent_thinking.detected_budget ? `₹${results.agent_thinking.detected_budget.toLocaleString("en-IN")}` : "No limit", I: Gem },
                        { l: "Filtered", v: `${results.agent_thinking.total_products} → ${results.agent_thinking.filtered_count}`, I: Target },
                        { l: "AI Analyzed", v: `${results.agent_thinking.ai_analyzed_count} products`, I: Zap },
                      ].map(({ l, v, I }) => (
                        <div key={l} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                          <p className="text-[11px] mb-1 flex items-center gap-1" style={{ color: "#52525b" }}><I className="w-3 h-3" /> {l}</p>
                          <p className="text-white text-sm font-semibold capitalize">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {results.comparison_summary && results.products.length > 0 && (
                  <div className="glass-card p-5" style={{ borderLeft: "3px solid rgba(99,102,241,0.5)" }}>
                    <h3 className="font-semibold text-sm mb-2 font-heading flex items-center gap-1.5" style={{ color: "#818cf8" }}><Sparkles className="w-3.5 h-3.5" /> AI Analysis</h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "#a1a1aa" }}>{results.comparison_summary}</p>
                    {results.final_recommendation_why && (
                      <div className="flex items-start gap-2 rounded-xl px-4 py-3" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}>
                        <Trophy className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div><span className="font-semibold text-[11px] uppercase tracking-wider" style={{ color: "#818cf8" }}>Top Pick — </span><span className="text-white/90 text-sm">{results.final_recommendation_why}</span></div>
                      </div>
                    )}
                  </div>
                )}
                {results.final_verdict?.overall_winner && (
                  <div className="glass-card p-5 glow-soft">
                    <h3 className="text-white font-semibold text-sm font-heading mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-indigo-400" /> Final Recommendation</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {results.final_verdict.best_performance && (
                        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(251,191,36,0.12)" }}>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: "#fbbf24" }}><Trophy className="w-3 h-3" /> Best Performance</p>
                          <p className="text-white font-bold text-sm mb-1">{results.final_verdict.best_performance.name}</p>
                          <p className="text-xs leading-relaxed" style={{ color: "#a1a1aa" }}>{results.final_verdict.best_performance.reason}</p>
                        </div>
                      )}
                      {results.final_verdict.best_value && (
                        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(52,211,153,0.12)" }}>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: "#34d399" }}><Gem className="w-3 h-3" /> Best Value</p>
                          <p className="text-white font-bold text-sm mb-1">{results.final_verdict.best_value.name}</p>
                          <p className="text-xs leading-relaxed" style={{ color: "#a1a1aa" }}>{results.final_verdict.best_value.reason}</p>
                        </div>
                      )}
                      {results.final_verdict.overall_winner && (
                        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(99,102,241,0.2)" }}>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1 text-indigo-400"><Crown className="w-3 h-3" /> Overall Winner</p>
                          <p className="text-white font-bold text-sm mb-1">{results.final_verdict.overall_winner.name}</p>
                          <p className="text-xs leading-relaxed" style={{ color: "#a1a1aa" }}>{results.final_verdict.overall_winner.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {results.products.length >= 2 && (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setShowCompare(!showCompare)} className="text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all" style={{ background: showCompare ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)", border: showCompare ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(255,255,255,0.07)", color: showCompare ? "#818cf8" : "#71717a" }}>
                      <Scale className="w-3.5 h-3.5" /> {showCompare ? "Hide" : "Compare Top 2"}
                    </button>
                    {results.why_not_others.length > 0 && (
                      <button onClick={() => setShowWhyNot(!showWhyNot)} className="text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all" style={{ background: showWhyNot ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)", border: showWhyNot ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(255,255,255,0.07)", color: showWhyNot ? "#818cf8" : "#71717a" }}>
                        <HelpCircle className="w-3.5 h-3.5" /> {showWhyNot ? "Hide" : "Why Not Others?"}
                      </button>
                    )}
                  </div>
                )}
                <AnimatePresence>
                  {showCompare && top2.length === 2 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="glass-card p-5">
                        <h3 className="text-white font-semibold text-sm font-heading mb-4 flex items-center gap-2"><Scale className="w-4 h-4 text-indigo-400" /> Side-by-Side</h3>
                        <table className="w-full text-xs">
                          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}><th className="text-left py-2 pr-4 font-medium" style={{ color: "#52525b" }}>Attribute</th><th className="text-left py-2 px-4 font-semibold text-indigo-300">{top2[0].name}</th><th className="text-left py-2 px-4 font-semibold" style={{ color: "#a1a1aa" }}>{top2[1].name}</th></tr></thead>
                          <tbody>
                            {[["Price", `₹${top2[0].price.toLocaleString("en-IN")}`, `₹${top2[1].price.toLocaleString("en-IN")}`, top2[0].price <= top2[1].price], ["Rating", `⭐ ${top2[0].rating}`, `⭐ ${top2[1].rating}`, top2[0].rating >= top2[1].rating], ["Reviews", top2[0].reviews.toLocaleString(), top2[1].reviews.toLocaleString(), null], ["Key Feature", top2[0].features[0], top2[1].features[0], null]].map(([l, v0, v1, a0wins]) => (
                              <tr key={String(l)} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                <td className="py-2.5 pr-4" style={{ color: "#52525b" }}>{l}</td>
                                <td className={`py-2.5 px-4 font-medium ${a0wins === true ? "text-emerald-400" : ""}`} style={a0wins === null ? { color: "#a1a1aa" } : {}}>{v0}</td>
                                <td className={`py-2.5 px-4 font-medium ${a0wins === false ? "text-emerald-400" : ""}`} style={a0wins === null ? { color: "#a1a1aa" } : {}}>{v1}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                  {showWhyNot && results.why_not_others.length > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="glass-card p-5">
                        <h3 className="text-white font-semibold text-sm font-heading mb-3 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-orange-400" /> Why Not These?</h3>
                        <div className="space-y-2.5">
                          {results.why_not_others.map((item, i) => (
                            <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                              <p className="text-white text-sm font-semibold mb-1.5">{item.name}</p>
                              <ul className="space-y-1">{item.reasons.map((r, j) => <li key={j} className="text-xs flex items-start gap-1.5" style={{ color: "#a1a1aa" }}><X className="w-3 h-3 mt-0.5 flex-shrink-0 text-red-400/60" />{r}</li>)}</ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {results.products.length > 0 ? (
                  <ProductGrid products={results.products} topPickId={results.final_recommendation_id} />
                ) : (
                  <div className="text-center py-16"><p className="text-lg" style={{ color: "#71717a" }}>No products found. Try a different search.</p></div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="sticky bottom-0 z-40 border-t px-4 py-4" style={{ background: "rgba(7,7,17,0.92)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-3xl mx-auto">
          <ChatInput value={query} onChange={setQuery} onSubmit={() => submit()} disabled={state === "loading"} />
          <p className="text-center text-[11px] mt-3" style={{ color: "#3f3f46" }}>AgentCart · AI Shopping Agent · Powered by Gemini · 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}
