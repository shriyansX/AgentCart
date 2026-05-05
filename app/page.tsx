"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles, ShoppingCart, Trophy, Gem, Crown, Scale, HelpCircle, X, ArrowRight, Zap, Package, Brain, Target, Info } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import ProductGrid from "@/components/ProductGrid";
import ThinkingLoader from "@/components/ThinkingLoader";
import { ApiResponse, EnrichedProduct } from "@/lib/types";

type AppState = "empty" | "loading" | "results";
const EXAMPLES = ["Best headphones under ₹2000", "Gaming mouse under ₹1500", "Laptop for coding under ₹60000", "Budget smartphone under ₹15,000"];
const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<AppState>("empty");
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [showWhyNot, setShowWhyNot] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { if (state === "results" && ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" }); }, [state, results]);

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

  const reset = () => { setState("empty"); setResults(null); setLastQuery(""); setQuery(""); setShowCompare(false); setShowWhyNot(false); };
  const top2 = results?.products.slice(0, 2) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#09090f] hero-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card-solid border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-base font-bold gradient-text leading-none">AgentCart</h1>
              <p className="text-[#52525b] text-[10px] leading-none mt-0.5 hidden sm:block">AI-powered shopping intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {state !== "empty" && (
              <button onClick={reset} className="flex items-center gap-1.5 text-[#71717a] hover:text-white text-xs px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all">
                <RotateCcw className="w-3.5 h-3.5" /> New Search
              </button>
            )}
            <a href="/how-it-works" className="hidden sm:flex items-center gap-1 text-[#71717a] hover:text-white text-xs px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all">
              <Info className="w-3 h-3" /> How it works
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-400/8 px-2.5 py-1 rounded-full border border-emerald-400/15">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Gemini AI
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-16">
        <AnimatePresence mode="wait">
          {/* EMPTY STATE */}
          {state === "empty" && (
            <motion.div key="empty" {...fade} transition={{ duration: 0.5 }} className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="max-w-2xl mx-auto">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/10 flex items-center justify-center animate-float">
                  <Sparkles className="w-7 h-7 text-indigo-400" />
                </motion.div>
                <div className="inline-flex items-center gap-2 bg-indigo-500/8 border border-indigo-500/12 text-indigo-400 text-[11px] font-semibold px-4 py-1.5 rounded-full mb-6">
                  <Zap className="w-3 h-3" /> Powered by Google Gemini
                </div>
                <h2 className="font-heading text-4xl sm:text-5xl md:text-[3.5rem] font-bold leading-[1.1] mb-4">
                  Find the <span className="gradient-text">Perfect Product</span><br />in Seconds
                </h2>
                <p className="text-[#a1a1aa] text-base sm:text-lg leading-relaxed mb-3 max-w-lg mx-auto">
                  AI that understands, compares, and recommends for you.
                </p>
                <p className="text-[#52525b] text-sm mb-10 max-w-md mx-auto">
                  Skip the endless scrolling — ask a question and let our agent decide.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {EXAMPLES.map((ex, i) => (
                    <motion.button key={ex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                      onClick={() => { setQuery(ex); submit(ex); }}
                      className="text-[13px] px-4 py-2.5 rounded-xl glass-card text-[#a1a1aa] hover:text-white hover:bg-indigo-500/8 hover:border-indigo-500/20 transition-all cursor-pointer">
                      {ex}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* LOADING */}
          {state === "loading" && (
            <motion.div key="loading" {...fade} transition={{ duration: 0.4 }} className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="w-full max-w-3xl mx-auto">
                <div className="mb-6 text-center">
                  <p className="text-[#71717a] text-sm mb-1">Searching for</p>
                  <p className="text-white font-semibold text-lg font-heading">&ldquo;{lastQuery}&rdquo;</p>
                </div>
                <ThinkingLoader />
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-10">
                  {[1,2,3].map(i => <div key={i} className="h-80 rounded-2xl bg-white/[0.02] border border-white/[0.03] shimmer" />)}
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS */}
          {state === "results" && results && (
            <motion.div key="results" {...fade} transition={{ duration: 0.5 }} ref={ref} className="flex-1 overflow-y-auto px-4 py-8 pb-32">
              <div className="max-w-6xl mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-[#71717a] text-xs mb-1">Results for</p>
                    <p className="text-white font-semibold text-lg font-heading">&ldquo;{lastQuery}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {results.agent_thinking.confidence > 0 && (
                      <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-emerald-400/8 border border-emerald-400/15 text-emerald-400">
                        ✦ {results.agent_thinking.confidence}% confident
                      </span>
                    )}
                    <span className="text-[#71717a] text-sm">{results.products.length} found</span>
                  </div>
                </div>

                {/* Fallback */}
                {results.is_fallback && (
                  <div className="px-4 py-3 rounded-xl bg-amber-400/6 border border-amber-400/12 text-amber-300 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0" /> Showing best matches based on your query.
                  </div>
                )}

                {/* Agent Thinking */}
                {results.agent_thinking.total_products > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5">
                    <h3 className="text-white font-semibold text-sm font-heading mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/15 flex items-center justify-center"><Brain className="w-3.5 h-3.5 text-purple-400" /></div>
                      How Agent Decided
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { l: "Category", v: results.agent_thinking.detected_category, I: Package },
                        { l: "Budget", v: results.agent_thinking.detected_budget ? `₹${results.agent_thinking.detected_budget.toLocaleString("en-IN")}` : "No limit", I: Gem },
                        { l: "Filtered", v: `${results.agent_thinking.total_products} → ${results.agent_thinking.filtered_count}`, I: Target },
                        { l: "AI Analyzed", v: `${results.agent_thinking.ai_analyzed_count} products`, I: Zap },
                      ].map(({ l, v, I }) => (
                        <div key={l} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                          <p className="text-[#52525b] text-[11px] mb-1 flex items-center gap-1"><I className="w-3 h-3" /> {l}</p>
                          <p className="text-white text-sm font-semibold capitalize">{v}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* AI Analysis */}
                {results.comparison_summary && results.products.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5 border-l-2 border-l-indigo-500/40">
                    <h3 className="text-indigo-300 font-semibold text-sm mb-2 font-heading flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Analysis</h3>
                    <p className="text-[#a1a1aa] text-sm leading-relaxed mb-3">{results.comparison_summary}</p>
                    {results.final_recommendation_why && (
                      <div className="flex items-start gap-2 bg-indigo-500/6 rounded-xl px-4 py-3 border border-indigo-500/10">
                        <Trophy className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-indigo-300 font-semibold text-[11px] uppercase tracking-wider">Top Pick — </span>
                          <span className="text-white/90 text-sm">{results.final_recommendation_why}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Final Verdict */}
                {results.final_verdict?.overall_winner && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5 glow-soft">
                    <h3 className="text-white font-semibold text-sm font-heading mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-indigo-400" /> Final Recommendation</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {results.final_verdict.best_performance && (
                        <div className="bg-white/[0.02] rounded-xl p-4 border border-amber-400/10">
                          <p className="text-amber-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1"><Trophy className="w-3 h-3" /> Best Performance</p>
                          <p className="text-white font-bold text-sm mb-1">{results.final_verdict.best_performance.name}</p>
                          <p className="text-[#a1a1aa] text-xs leading-relaxed">{results.final_verdict.best_performance.reason}</p>
                        </div>
                      )}
                      {results.final_verdict.best_value && (
                        <div className="bg-white/[0.02] rounded-xl p-4 border border-emerald-400/10">
                          <p className="text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1"><Gem className="w-3 h-3" /> Best Value</p>
                          <p className="text-white font-bold text-sm mb-1">{results.final_verdict.best_value.name}</p>
                          <p className="text-[#a1a1aa] text-xs leading-relaxed">{results.final_verdict.best_value.reason}</p>
                        </div>
                      )}
                      {results.final_verdict.overall_winner && (
                        <div className="bg-white/[0.02] rounded-xl p-4 border border-indigo-400/15 ring-1 ring-indigo-400/10">
                          <p className="text-indigo-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1"><Crown className="w-3 h-3" /> Overall Winner</p>
                          <p className="text-white font-bold text-sm mb-1">{results.final_verdict.overall_winner.name}</p>
                          <p className="text-[#a1a1aa] text-xs leading-relaxed">{results.final_verdict.overall_winner.reason}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Toggle buttons */}
                {results.products.length >= 2 && (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setShowCompare(!showCompare)} className={`text-xs px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${showCompare ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "glass-card text-[#71717a] hover:text-white"}`}>
                      <Scale className="w-3.5 h-3.5" /> {showCompare ? "Hide" : "Compare Top 2"}
                    </button>
                    {results.why_not_others.length > 0 && (
                      <button onClick={() => setShowWhyNot(!showWhyNot)} className={`text-xs px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${showWhyNot ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "glass-card text-[#71717a] hover:text-white"}`}>
                        <HelpCircle className="w-3.5 h-3.5" /> {showWhyNot ? "Hide" : "Why Not Others?"}
                      </button>
                    )}
                  </div>
                )}

                {/* Compare */}
                <AnimatePresence>
                  {showCompare && top2.length === 2 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="glass-card rounded-2xl p-5">
                        <h3 className="text-white font-semibold text-sm font-heading mb-4 flex items-center gap-2"><Scale className="w-4 h-4 text-indigo-400" /> Side-by-Side</h3>
                        <table className="w-full text-sm">
                          <thead><tr className="border-b border-white/[0.05]"><th className="text-left text-[#52525b] py-2 pr-4 font-medium text-xs">Attribute</th><th className="text-left text-indigo-300 py-2 px-4 font-semibold text-xs">{top2[0].name}</th><th className="text-left text-[#a1a1aa] py-2 px-4 font-semibold text-xs">{top2[1].name}</th></tr></thead>
                          <tbody className="text-[#a1a1aa]">
                            <tr className="border-b border-white/[0.03]"><td className="py-2.5 pr-4 text-[#52525b] text-xs">Price</td><td className={`py-2.5 px-4 font-semibold text-xs ${top2[0].price <= top2[1].price ? "text-emerald-400" : ""}`}>₹{top2[0].price.toLocaleString("en-IN")}</td><td className={`py-2.5 px-4 font-semibold text-xs ${top2[1].price <= top2[0].price ? "text-emerald-400" : ""}`}>₹{top2[1].price.toLocaleString("en-IN")}</td></tr>
                            <tr className="border-b border-white/[0.03]"><td className="py-2.5 pr-4 text-[#52525b] text-xs">Rating</td><td className={`py-2.5 px-4 font-semibold text-xs ${top2[0].rating >= top2[1].rating ? "text-amber-400" : ""}`}>⭐ {top2[0].rating}</td><td className={`py-2.5 px-4 font-semibold text-xs ${top2[1].rating >= top2[0].rating ? "text-amber-400" : ""}`}>⭐ {top2[1].rating}</td></tr>
                            <tr className="border-b border-white/[0.03]"><td className="py-2.5 pr-4 text-[#52525b] text-xs">Reviews</td><td className="py-2.5 px-4 text-xs">{top2[0].reviews.toLocaleString()}</td><td className="py-2.5 px-4 text-xs">{top2[1].reviews.toLocaleString()}</td></tr>
                            <tr><td className="py-2.5 pr-4 text-[#52525b] text-xs">Key Feature</td><td className="py-2.5 px-4 text-xs">{top2[0].features[0]}</td><td className="py-2.5 px-4 text-xs">{top2[1].features[0]}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Why Not */}
                <AnimatePresence>
                  {showWhyNot && results.why_not_others.length > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="glass-card rounded-2xl p-5">
                        <h3 className="text-white font-semibold text-sm font-heading mb-3 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-orange-400" /> Why Not These?</h3>
                        <div className="space-y-2.5">
                          {results.why_not_others.map((item, i) => (
                            <div key={i} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                              <p className="text-white text-sm font-semibold mb-1.5">{item.name}</p>
                              <ul className="space-y-1">{item.reasons.map((r, j) => (
                                <li key={j} className="text-[#a1a1aa] text-xs flex items-start gap-1.5"><X className="w-3 h-3 text-red-400/60 mt-0.5 flex-shrink-0" />{r}</li>
                              ))}</ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Products */}
                {results.products.length > 0 ? (
                  <ProductGrid products={results.products} topPickId={results.final_recommendation_id} />
                ) : (
                  <div className="text-center py-16"><p className="text-[#71717a] text-lg">No products found. Try a different search.</p></div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-40 glass-card-solid border-t border-white/[0.04] px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput value={query} onChange={setQuery} onSubmit={() => submit()} disabled={state === "loading"} />
          <p className="text-center text-[#3f3f46] text-[11px] mt-3">AgentCart · AI Shopping Agent · Powered by Gemini</p>
        </div>
      </footer>
    </div>
  );
}
