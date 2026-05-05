"use client";

import { useState, useRef, useEffect } from "react";
import ChatInput from "@/components/ChatInput";
import ProductGrid from "@/components/ProductGrid";
import ThinkingLoader from "@/components/ThinkingLoader";
import { ApiResponse, EnrichedProduct } from "@/lib/types";

type AppState = "empty" | "loading" | "results";

const EXAMPLE_QUERIES = [
  "Best headphones under ₹2000",
  "Laptop for coding under ₹60,000",
  "Gaming mouse under ₹3000",
  "Budget smartphone under ₹15,000",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<AppState>("empty");
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [lastQuery, setLastQuery] = useState("");
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
      // Graceful fallback: show empty results with a message
      setResults({
        products: [] as EnrichedProduct[],
        comparison_summary: "Showing best matches for your query.",
        final_recommendation_id: "",
        final_recommendation_why: "",
        is_fallback: true,
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] hero-bg">
      {/* ── Fixed Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-white"
              >
                <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.162 1.014.395 1.476.698l7.125-4.117a1.125 1.125 0 011.125 1.948l-7.01 4.048A7.5 7.5 0 1110.5 1.875z" />
              </svg>
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold gradient-text leading-none">
                AgentCart
              </h1>
              <p className="text-[#a1a1aa] text-[10px] leading-none mt-0.5 hidden sm:block">
                AI-powered shopping intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {state !== "empty" && (
              <button
                onClick={handleReset}
                id="reset-button"
                className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-[#1e1e2e] transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                    clipRule="evenodd"
                  />
                </svg>
                New Search
              </button>
            )}
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini AI
            </span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col pt-16">
        {/* EMPTY STATE */}
        {state === "empty" && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
            {/* Hero */}
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.897l-2.051-.684a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.632l.551-.184a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                </svg>
                Powered by Google Gemini
              </div>

              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                Find the{" "}
                <span className="gradient-text">Perfect Product</span>
                <br />
                in Seconds
              </h2>

              <p className="text-[#a1a1aa] text-lg sm:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
                Ask anything. Get smart AI-powered recommendations.
                <br className="hidden sm:block" />
                Skip the endless scrolling and let AgentCart decide.
              </p>

              {/* Example chips */}
              <div className="flex flex-wrap justify-center gap-2.5">
                {EXAMPLE_QUERIES.map((example) => (
                  <button
                    key={example}
                    id={`example-${example.replace(/\s+/g, "-").toLowerCase()}`}
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
              {/* Query display */}
              <div className="mb-8 text-center">
                <p className="text-[#a1a1aa] text-sm mb-2">Searching for</p>
                <p className="text-white font-medium text-lg">
                  &ldquo;{lastQuery}&rdquo;
                </p>
              </div>
              <ThinkingLoader />
              {/* Skeleton hint */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-20">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-80 rounded-2xl bg-[#111118] border border-[#1e1e2e] animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS STATE */}
        {state === "results" && results && (
          <div
            ref={resultsRef}
            className="flex-1 overflow-y-auto px-4 py-8"
          >
            <div className="max-w-6xl mx-auto">
              {/* Query label */}
              <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-[#a1a1aa] text-xs mb-1">Results for</p>
                  <p className="text-white font-semibold text-lg font-heading">
                    &ldquo;{lastQuery}&rdquo;
                  </p>
                </div>
                <span className="text-[#a1a1aa] text-sm">
                  {results.products.length} product
                  {results.products.length !== 1 ? "s" : ""} found
                </span>
              </div>

              {/* Fallback notice */}
              {results.is_fallback && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 flex-shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Showing best matches for your query.
                </div>
              )}

              {/* AI Summary Card */}
              {results.comparison_summary && results.products.length > 0 && (
                <div className="mb-8 bg-[#111118] border-l-4 border-indigo-500 rounded-2xl p-5 shadow-lg shadow-indigo-500/5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-indigo-400"
                      >
                        <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-indigo-400 font-semibold text-sm mb-2 font-heading">
                        AI Analysis
                      </h3>
                      <p className="text-[#a1a1aa] text-sm leading-relaxed mb-3">
                        {results.comparison_summary}
                      </p>
                      {results.final_recommendation_why && (
                        <div className="flex items-start gap-2 bg-indigo-500/10 rounded-xl px-4 py-3 border border-indigo-500/20">
                          <span className="text-base">⭐</span>
                          <div>
                            <span className="text-indigo-300 font-semibold text-xs uppercase tracking-wide">
                              Top Pick —{" "}
                            </span>
                            <span className="text-white text-sm">
                              {results.final_recommendation_why}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Product Grid */}
              {results.products.length > 0 ? (
                <ProductGrid
                  products={results.products}
                  topPickId={results.final_recommendation_id}
                />
              ) : (
                <div className="text-center py-16">
                  <p className="text-[#a1a1aa] text-lg">
                    No products found. Try a different search.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Fixed bottom chat input ── */}
      <footer className="sticky bottom-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-t border-[#1e1e2e] px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={query}
            onChange={setQuery}
            onSubmit={() => handleSubmit()}
            disabled={state === "loading"}
          />
          <p className="text-center text-[#52525b] text-xs mt-3">
            AgentCart AI Shopping Agent · Powered by Gemini 1.5 Flash
          </p>
        </div>
      </footer>
    </div>
  );
}
