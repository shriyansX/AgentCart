import Link from "next/link";

export const metadata = {
  title: "About – AgentCart",
  description: "AgentCart is an AI-powered shopping agent built for hackathons. Learn about the product and its purpose.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white hero-bg">
      <header className="border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white">
                <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192z" />
              </svg>
            </div>
            <span className="font-heading text-sm font-bold gradient-text">AgentCart</span>
          </Link>
          <Link href="/" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">← Back to Search</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
          About <span className="gradient-text">AgentCart</span>
        </h1>

        <div className="space-y-6 text-[#a1a1aa] text-sm leading-relaxed">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-2 font-heading">The Problem</h2>
            <p>
              Finding the right product online is overwhelming. Users waste hours comparing specs across dozens of tabs, reading conflicting reviews, and second-guessing their choices. The paradox of choice is real — more options leads to worse decisions.
            </p>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-2 font-heading">The Solution</h2>
            <p>
              AgentCart is an <strong className="text-white">AI-powered shopping decision agent</strong>. It doesn&apos;t just search — it understands your intent, filters relevant products, reasons about trade-offs, and gives you a confident recommendation with full transparency into how it decided.
            </p>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-2 font-heading">What Makes It Different</h2>
            <ul className="space-y-2 mt-2">
              {[
                "Not a chatbot — it's a decision engine",
                "Deterministic filtering BEFORE AI reasoning",
                "Full transparency: see how the agent decided",
                "Structured verdict: Best Performance, Best Value, Overall Winner",
                "Explains why alternatives were rejected",
                "Confidence score based on query specificity",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-2 font-heading">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { label: "Frontend", value: "Next.js + TypeScript" },
                { label: "Styling", value: "Tailwind CSS v4" },
                { label: "AI", value: "Google Gemini 1.5 Flash" },
                { label: "Data", value: "40+ product JSON dataset" },
              ].map((item) => (
                <div key={item.label} className="bg-[#0a0a0f] rounded-lg p-3 border border-[#1e1e2e]">
                  <p className="text-[#52525b] text-xs">{item.label}</p>
                  <p className="text-white text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-3">
          <Link href="/" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-indigo-600/20 text-sm">
            Try AgentCart →
          </Link>
          <Link href="/how-it-works" className="bg-[#111118] border border-[#1e1e2e] text-[#a1a1aa] hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm">
            How It Works
          </Link>
        </div>
      </main>
    </div>
  );
}
