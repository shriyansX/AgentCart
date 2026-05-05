import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap", weight: ["400","500","600","700","800"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
  title: "AgentCart – AI Shopping Agent",
  description: "Find the perfect product in seconds. AI-powered recommendations by Google Gemini.",
  keywords: ["AI shopping", "product recommendations", "Gemini AI", "smart shopping agent"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} h-full`}>
      <body className="h-full antialiased" style={{ background: "#070711", color: "#f4f4f5" }}>
        {/* Ambient orbs */}
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card-solid border-b border-white/[0.05]" style={{ borderRadius: 0 }}>
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 001.95 1.53h9.58a2 2 0 001.95-1.67l1.65-9.33H5.12"/>
                </svg>
              </div>
              <div>
                <span className="font-heading font-bold gradient-text text-base leading-none">AgentCart</span>
                <p className="text-[#52525b] text-[10px] leading-none mt-0.5 hidden sm:block">AI-powered shopping intelligence</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className="text-[#71717a] hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all no-underline">Home</Link>
              <Link href="/categories" className="text-[#71717a] hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all no-underline">Categories</Link>
              <Link href="/about" className="text-[#71717a] hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all no-underline">About</Link>
              <Link href="/how-it-works" className="text-[#71717a] hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all no-underline">How it works</Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-400/8 px-2.5 py-1 rounded-full border border-emerald-400/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 2s infinite" }} /> Gemini AI
              </span>
              <Link href="/categories" className="md:hidden text-[#71717a] hover:text-white p-1.5 rounded-lg hover:bg-white/[0.04] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
