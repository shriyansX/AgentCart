"use client";
import { motion } from "framer-motion";
import { Star, ExternalLink, Sparkles, Award } from "lucide-react";
import { EnrichedProduct } from "@/lib/types";

interface Props { product: EnrichedProduct; isTopPick: boolean; index: number; }
const BADGE: Record<string, string> = {
  "Best Seller": "bg-amber-400/10 text-amber-300 border-amber-400/20",
  "Top Rated": "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  "Budget Pick": "bg-sky-400/10 text-sky-300 border-sky-400/20",
  Premium: "bg-violet-400/10 text-violet-300 border-violet-400/20",
};
const FALLBACKS: Record<string, string> = {
  mouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=200&fit=crop",
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=200&fit=crop",
  headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=200&fit=crop",
  smartphone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop",
  speaker: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=200&fit=crop",
  monitor: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=200&fit=crop",
  earbuds: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=200&fit=crop",
};

export default function ProductCard({ product, isTopPick, index }: Props) {
  const amazonUrl = product.product_url && product.product_url !== "#"
    ? product.product_url
    : `https://www.amazon.in/s?k=${encodeURIComponent(product.name + " " + product.brand)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden transition-shadow duration-300 ${isTopPick ? "gradient-border glow-accent" : "glass-card"}`}
    >
      {isTopPick && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[11px] font-bold text-center py-1.5 tracking-wider flex items-center justify-center gap-1.5">
          <Award className="w-3 h-3" /> RECOMMENDED CHOICE
        </div>
      )}
      {product.badge && (
        <div className={`absolute ${isTopPick ? "top-10" : "top-3"} right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${BADGE[product.badge] ?? "bg-indigo-400/10 text-indigo-300 border-indigo-400/20"}`}>
          {product.badge}
        </div>
      )}
      {/* Image */}
      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #111130 100%)", height: "200px", marginTop: isTopPick ? "28px" : "0" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ maxHeight: "180px", maxWidth: "90%", objectFit: "contain", transition: "transform 0.3s ease" }}
          onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
          onError={e => {
            const t = e.currentTarget;
            t.src = FALLBACKS[(product.category || "").toLowerCase()] || `https://placehold.co/400x200/111118/6366f1?text=${encodeURIComponent(product.name)}`;
            t.onerror = null;
          }}
        />
      </div>
      {/* Body */}
      <div className="flex flex-col flex-grow p-5 gap-2.5">
        <p className="text-[#71717a] text-[11px] font-semibold uppercase tracking-widest">{product.brand}</p>
        <h3 className="text-white font-bold text-[15px] leading-snug line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 font-semibold text-xs">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[#52525b] text-xs">({product.reviews.toLocaleString("en-IN")} reviews)</span>
        </div>
        <p className="text-xl font-black tracking-tight text-indigo-300">₹{product.price.toLocaleString("en-IN")}</p>
        <div className="flex flex-wrap gap-1.5">
          {product.features.slice(0, 3).map((f, i) => (
            <span key={i} className="bg-white/[0.04] text-[#a1a1aa] text-[11px] px-2.5 py-1 rounded-lg border border-white/[0.06]">{f}</span>
          ))}
        </div>
        <div className="mt-auto pt-3">
          <div className="rounded-xl bg-indigo-500/[0.06] border border-indigo-400/10 p-3.5">
            <p className="text-indigo-300/80 text-[11px] font-semibold mb-1 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-3 h-3" /> AI Insight
            </p>
            <p className="text-[#c4c4cc] text-[13px] leading-relaxed">{product.reason || `A solid ${product.category} choice featuring ${product.features[0]}.`}</p>
          </div>
        </div>
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", width: "100%", textAlign: "center", padding: "10px", borderRadius: "12px", background: isTopPick ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.04)", color: "white", fontWeight: "600", textDecoration: "none", marginTop: "8px", transition: "opacity 0.2s", fontSize: "14px", border: isTopPick ? "none" : "1px solid rgba(255,255,255,0.07)" }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={e => (e.currentTarget.style.opacity = "1")}
        >
          View on Amazon →
        </a>
      </div>
    </motion.div>
  );
}
