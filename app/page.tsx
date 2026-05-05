"use client";

import { useState, useRef, useEffect } from "react";
import ChatInput from "@/components/ChatInput";
import ProductGrid from "@/components/ProductGrid";
import ThinkingLoader from "@/components/ThinkingLoader";
import { ApiResponse, EnrichedProduct } from "@/lib/types";

type AppState = "empty" | "loading" | "results";

const EXAMPLE_QUERIES = [
  "Best headphones under ₹2000",
  "Gaming mouse under ₹1500",
  "Laptop for coding under ₹60000",
  "Budget smartphone under ₹15,000",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<AppState>("empty");
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [showWhyNot, setShowWhyNot] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "results" && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state, results]);

  const handleSubmit = async (q?: string) => {
    const searchQuery = q ?? query;
    if (!searchQuery.trim()) return;
    setLastQuery(searchQuery);
    setQuery("");
    setState("loading");
    setResults(null);
    setShowCompare(false);
    setShowWhyNot(false);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      if (!res.ok) throw new Error("API error");
      const data: ApiResponse = await res.json();
      setResults(data);
      setState("results");
    } catch {
      setResults({
        products: [] as EnrichedProduct[],
        comparison_summary: "Showing best matches for your query.",
        final_recommendation_id: "",
        final_recommendation_why: "",
        is_fallback: true,
        agent_thinking: { detected_category: "general", detected_budget: null, detected_use_case: "general", total_products: 0, filtered_count: 0, ai_analyzed_count: 0, confidence: 0 },
        final_verdict: { best_performance: null, best_value: null, overall_winner: null },
        why_not_others: [],
      });
      setState("results");
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    handleSubmit(example);
  };

  const handleReset = () => {
    setState("empty");
    setResults(null);
    setLastQuery("");
    setQuery("");
    setShowCompare(false);
    setShowWhyNot(false);
  };

  // Compare top 2 products
  const top2 = results?.products.slice(0, 2) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] hero-bg">
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192z" />
              </svg>
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold gradient-text leading-none">AgentCart</h1>
              <p className="text-[#a1a1aa] text-[10px] leading-none mt-0.5 hidden sm:block">AI-powered shopping intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {state !== "empty" && (
              <button onClick={handleReset} className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-[#1e1e2e] transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                </svg>
                New Search
              </button>
            )}
            <a href="/how-it-works" className="hidden sm:flex items-center gap-1.5 text-[#a1a1aa] hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#1e1e2e] transition-all duration-200">How it works</a>
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini AI
            </span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col pt-16">
        {/* EMPTY STATE */}
        {state === "empty" && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192z" />
                </svg>
                Powered by Google Gemini
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
                Find the <span className="gradient-text">Perfect Product</span><br />in Seconds
              </h2>
              <p className="text-[#a1a1aa] text-lg sm:text-xl leading-relaxed mb-4 max-w-xl mx-auto">
                AI that understands, compares, and recommends.
              </p>
              <p className="text-[#52525b] text-sm mb-10 max-w-md mx-auto">
                Skip the endless scrolling. Ask a question, and our agent will filter, analyze, and explain the best options for you.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {EXAMPLE_QUERIES.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleClick(example)}
                    className="text-sm px-4 py-2.5 rounded-full bg-[#111118] border border-[#1e1e2e] text-[#a1a1aa] hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {state === "loading" && (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-3xl mx-auto">
              <div className="mb-6 text-center">
                <p className="text-[#a1a1aa] text-sm mb-2">Searching for</p>
                <p className="text-white font-semibold text-lg font-heading">&ldquo;{lastQuery}&rdquo;</p>
              </div>
              <ThinkingLoader />
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-15">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 rounded-2xl bg-[#111118] border border-[#1e1e2e] animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS STATE */}
        {state === "results" && results && (
          <div ref={resultsRef} className="flex-1 overflow-y-auto px-4 py-8 pb-32">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-[#a1a1aa] text-xs mb-1">Results for</p>
                  <p className="text-white font-semibold text-lg font-heading">&ldquo;{lastQuery}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3">
                  {results.agent_thinking.confidence > 0 && (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Confidence: {results.agent_thinking.confidence}%
                    </span>
                  )}
                  <span className="text-[#a1a1aa] text-sm">
                    {results.products.length} product{results.products.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              </div>

              {/* Fallback notice */}
              {results.is_fallback && (
                <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Showing best matches based on your query.
                </div>
              )}

              {/* 🧠 How Agent Decided */}
              {results.agent_thinking.total_products > 0 && (
                <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm font-heading mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-xs">🧠</span>
                    How Agent Decided
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Category", value: results.agent_thinking.detected_category, icon: "📂" },
                      { label: "Budget", value: results.agent_thinking.detected_budget ? `₹${results.agent_thinking.detected_budget.toLocaleString("en-IN")}` : "No limit", icon: "💰" },
                      { label: "Filtered", value: `${results.agent_thinking.total_products} → ${results.agent_thinking.filtered_count}`, icon: "🔍" },
                      { label: "AI Analyzed", value: `${results.agent_thinking.ai_analyzed_count} products`, icon: "⚡" },
                    ].map((item) => (
                      <div key={item.label} className="bg-[#0a0a0f] rounded-xl p-3 border border-[#1e1e2e]">
                        <p className="text-[#52525b] text-xs mb-1">{item.icon} {item.label}</p>
                        <p className="text-white text-sm font-semibold capitalize">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              {results.comparison_summary && results.products.length > 0 && (
                <div className="bg-[#111118] border-l-4 border-indigo-500 rounded-2xl p-5 shadow-lg shadow-indigo-500/5">
                  <h3 className="text-indigo-400 font-semibold text-sm mb-2 font-heading">AI Analysis</h3>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed mb-3">{results.comparison_summary}</p>
                  {results.final_recommendation_why && (
                    <div className="flex items-start gap-2 bg-indigo-500/10 rounded-xl px-4 py-3 border border-indigo-500/20">
                      <span className="text-base">⭐</span>
                      <div>
                        <span className="text-indigo-300 font-semibold text-xs uppercase tracking-wide">Top Pick — </span>
                        <span className="text-white text-sm">{results.final_recommendation_why}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 🎯 Final Verdict */}
              {results.final_verdict && results.final_verdict.overall_winner && (
                <div className="bg-gradient-to-br from-[#111118] to-[#0f0f1a] border border-indigo-500/20 rounded-2xl p-5 shadow-lg shadow-indigo-500/5">
                  <h3 className="text-white font-semibold text-sm font-heading mb-4 flex items-center gap-2">
                    <span className="text-base">🎯</span> Final Recommendation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {results.final_verdict.best_performance && (
                      <div className="bg-[#0a0a0f] rounded-xl p-4 border border-amber-500/20">
                        <p className="text-amber-400 text-xs font-semibold uppercase tracking-wide mb-1">🏆 Best Performance</p>
                        <p className="text-white font-bold text-sm mb-1">{results.final_verdict.best_performance.name}</p>
                        <p className="text-[#a1a1aa] text-xs leading-relaxed">{results.final_verdict.best_performance.reason}</p>
                      </div>
                    )}
                    {results.final_verdict.best_value && (
                      <div className="bg-[#0a0a0f] rounded-xl p-4 border border-emerald-500/20">
                        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-1">💎 Best Value</p>
                        <p className="text-white font-bold text-sm mb-1">{results.final_verdict.best_value.name}</p>
                        <p className="text-[#a1a1aa] text-xs leading-relaxed">{results.final_verdict.best_value.reason}</p>
                      </div>
                    )}
                    {results.final_verdict.overall_winner && (
                      <div className="bg-[#0a0a0f] rounded-xl p-4 border border-indigo-500/30 ring-1 ring-indigo-500/20">
                        <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wide mb-1">👑 Overall Winner</p>
                        <p className="text-white font-bold text-sm mb-1">{results.final_verdict.overall_winner.name}</p>
                        <p className="text-[#a1a1aa] text-xs leading-relaxed">{results.final_verdict.overall_winner.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {results.products.length >= 2 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowCompare(!showCompare)}
                    className={`text-xs px-4 py-2 rounded-full border transition-all duration-200 ${showCompare ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300" : "bg-[#111118] border-[#1e1e2e] text-[#a1a1aa] hover:border-indigo-500/30 hover:text-white"}`}
                  >
                    {showCompare ? "Hide Comparison" : "⚖️ Compare Top 2"}
                  </button>
                  {results.why_not_others.length > 0 && (
                    <button
                      onClick={() => setShowWhyNot(!showWhyNot)}
                      className={`text-xs px-4 py-2 rounded-full border transition-all duration-200 ${showWhyNot ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300" : "bg-[#111118] border-[#1e1e2e] text-[#a1a1aa] hover:border-indigo-500/30 hover:text-white"}`}
                    >
                      {showWhyNot ? "Hide" : "❓ Why Not Others?"}
                    </button>
                  )}
                </div>
              )}

              {/* Compare Mode */}
              {showCompare && top2.length === 2 && (
                <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm font-heading mb-4">⚖️ Side-by-Side Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#1e1e2e]">
                          <th className="text-left text-[#52525b] py-2 pr-4 font-medium">Attribute</th>
                          <th className="text-left text-indigo-400 py-2 px-4 font-semibold">{top2[0].name}</th>
                          <th className="text-left text-[#a1a1aa] py-2 px-4 font-semibold">{top2[1].name}</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#a1a1aa]">
                        <tr className="border-b border-[#1e1e2e]/50"><td className="py-2.5 pr-4 text-[#52525b]">Price</td><td className={`py-2.5 px-4 font-semibold ${top2[0].price <= top2[1].price ? "text-emerald-400" : "text-white"}`}>₹{top2[0].price.toLocaleString("en-IN")}</td><td className={`py-2.5 px-4 font-semibold ${top2[1].price <= top2[0].price ? "text-emerald-400" : "text-white"}`}>₹{top2[1].price.toLocaleString("en-IN")}</td></tr>
                        <tr className="border-b border-[#1e1e2e]/50"><td className="py-2.5 pr-4 text-[#52525b]">Rating</td><td className={`py-2.5 px-4 font-semibold ${top2[0].rating >= top2[1].rating ? "text-amber-400" : "text-white"}`}>⭐ {top2[0].rating}</td><td className={`py-2.5 px-4 font-semibold ${top2[1].rating >= top2[0].rating ? "text-amber-400" : "text-white"}`}>⭐ {top2[1].rating}</td></tr>
                        <tr className="border-b border-[#1e1e2e]/50"><td className="py-2.5 pr-4 text-[#52525b]">Reviews</td><td className="py-2.5 px-4">{top2[0].reviews.toLocaleString()}</td><td className="py-2.5 px-4">{top2[1].reviews.toLocaleString()}</td></tr>
                        <tr><td className="py-2.5 pr-4 text-[#52525b]">Key Feature</td><td className="py-2.5 px-4">{top2[0].features[0]}</td><td className="py-2.5 px-4">{top2[1].features[0]}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Why Not Others */}
              {showWhyNot && results.why_not_others.length > 0 && (
                <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm font-heading mb-3">❓ Why Not These?</h3>
                  <div className="space-y-3">
                    {results.why_not_others.map((item, i) => (
                      <div key={i} className="bg-[#0a0a0f] rounded-xl p-3 border border-[#1e1e2e]">
                        <p className="text-white text-sm font-semibold mb-1.5">{item.name}</p>
                        <ul className="space-y-1">
                          {item.reasons.map((r, j) => (
                            <li key={j} className="text-[#a1a1aa] text-xs flex items-start gap-1.5">
                              <span className="text-red-400/80 mt-0.5">✕</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Grid */}
              {results.products.length > 0 ? (
                <ProductGrid products={results.products} topPickId={results.final_recommendation_id} />
              ) : (
                <div className="text-center py-16">
                  <p className="text-[#a1a1aa] text-lg">No products found. Try a different search.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer input ── */}
      <footer className="sticky bottom-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-t border-[#1e1e2e] px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput value={query} onChange={setQuery} onSubmit={() => handleSubmit()} disabled={state === "loading"} />
          <p className="text-center text-[#52525b] text-xs mt-3">AgentCart AI Shopping Agent · Powered by Gemini 1.5 Flash</p>
        </div>
      </footer>
    </div>
  );
}
