import Link from "next/link";

export const metadata = {
  title: "How It Works – AgentCart",
  description: "Learn how AgentCart's AI agent understands, filters, reasons, and recommends products.",
};

const STEPS = [
  {
    num: "01",
    icon: "🔍",
    title: "Understand Your Query",
    desc: "Our agent parses your natural language query to extract category, budget, use-case, and brand preference using a hybrid code + AI approach.",
    color: "indigo",
  },
  {
    num: "02",
    icon: "📦",
    title: "Filter Products",
    desc: "Before any AI call, we deterministically filter our dataset. Category matching, budget caps, and relevance scoring narrow down from 40+ products to the top 5.",
    color: "purple",
  },
  {
    num: "03",
    icon: "🧠",
    title: "AI Reasoning",
    desc: "Google Gemini analyzes only the pre-filtered products. It explains each one, compares trade-offs, and generates a per-product recommendation reason.",
    color: "pink",
  },
  {
    num: "04",
    icon: "🎯",
    title: "Final Decision",
    desc: "The agent produces a structured verdict: Best Performance, Best Value, and Overall Winner — with confidence score and explanations for why other products weren't chosen.",
    color: "emerald",
  },
];

const COLORS: Record<string, string> = {
  indigo: "border-indigo-500/30 bg-indigo-500/5",
  purple: "border-purple-500/30 bg-purple-500/5",
  pink: "border-pink-500/30 bg-pink-500/5",
  emerald: "border-emerald-500/30 bg-emerald-500/5",
};

const NUM_COLORS: Record<string, string> = {
  indigo: "text-indigo-400",
  purple: "text-purple-400",
  pink: "text-pink-400",
  emerald: "text-emerald-400",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white hero-bg">
      {/* Header */}
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

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            How <span className="gradient-text">AgentCart</span> Works
          </h1>
          <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
            Not a chatbot. A decision-making AI agent that follows a structured pipeline to help you pick the right product.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {STEPS.map((step) => (
            <div key={step.num} className={`border rounded-2xl p-6 ${COLORS[step.color]}`}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className={`font-heading text-2xl font-bold ${NUM_COLORS[step.color]}`}>{step.num}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg mb-2 font-heading">{step.title}</h2>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline diagram */}
        <div className="mt-16 text-center">
          <p className="text-[#52525b] text-sm mb-6">The pipeline</p>
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-semibold">
            {["User Query", "→", "Intent Extraction", "→", "Deterministic Filter", "→", "AI Reasoning", "→", "Final Decision"].map((item, i) => (
              item === "→" ? (
                <span key={i} className="text-[#52525b]">→</span>
              ) : (
                <span key={i} className="bg-[#111118] border border-[#1e1e2e] px-3 py-1.5 rounded-full text-[#a1a1aa]">{item}</span>
              )
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            Try It Now →
          </Link>
        </div>
      </main>
    </div>
  );
}
