"use client";

import { motion } from "framer-motion";
import { Star, ExternalLink, Sparkles, Award } from "lucide-react";
import { EnrichedProduct } from "@/lib/types";

interface ProductCardProps {
  product: EnrichedProduct;
  isTopPick: boolean;
  index: number;
}

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-400/10 text-amber-300 border-amber-400/20",
  "Top Rated": "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  "Budget Pick": "bg-sky-400/10 text-sky-300 border-sky-400/20",
  Premium: "bg-violet-400/10 text-violet-300 border-violet-400/20",
};

export default function ProductCard({ product, isTopPick, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden transition-shadow duration-300 ${
        isTopPick
          ? "glow-accent gradient-border"
          : "glass-card hover:border-white/[0.08]"
      }`}
      style={!isTopPick ? { border: "1px solid rgba(255,255,255,0.05)" } : undefined}
    >
      {/* Top Pick ribbon */}
      {isTopPick && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[11px] font-bold text-center py-1.5 tracking-wider flex items-center justify-center gap-1.5">
          <Award className="w-3 h-3" />
          RECOMMENDED CHOICE
        </div>
      )}

      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute ${isTopPick ? "top-10" : "top-3"} right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${
            BADGE_STYLES[product.badge] ?? "bg-indigo-400/10 text-indigo-300 border-indigo-400/20"
          }`}
        >
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div
        className={`relative w-full overflow-hidden bg-gradient-to-b from-[#0d0d16] to-[#12121a] flex items-center justify-center ${isTopPick ? "mt-[28px]" : ""}`}
        style={{ height: "180px" }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const fallbacks: Record<string, string> = {
              headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=220&fit=crop",
              earbuds: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=220&fit=crop",
              laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=220&fit=crop",
              mouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=220&fit=crop",
              keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=220&fit=crop",
              monitor: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=220&fit=crop",
              smartphone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=220&fit=crop",
              speaker: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=220&fit=crop",
            };
            const cat = (product.category || "").toLowerCase();
            target.src = fallbacks[cat] || `https://placehold.co/400x220/111118/818cf8?text=${encodeURIComponent(product.name)}`;
            target.onerror = null;
          }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow p-5 gap-2.5">
        <p className="text-[#71717a] text-[11px] font-semibold uppercase tracking-widest">
          {product.brand}
        </p>

        <h3 className="text-white font-bold text-[15px] leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 font-semibold text-xs">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[#52525b] text-xs">
            ({product.reviews.toLocaleString("en-IN")} reviews)
          </span>
        </div>

        <p className="text-xl font-black tracking-tight text-indigo-300">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {product.features.slice(0, 3).map((feat, i) => (
            <span
              key={i}
              className="bg-white/[0.04] text-[#a1a1aa] text-[11px] px-2.5 py-1 rounded-lg border border-white/[0.06]"
            >
              {feat}
            </span>
          ))}
        </div>

        {/* AI Reason */}
        <div className="mt-auto pt-3">
          <div className="rounded-xl bg-indigo-500/[0.06] border border-indigo-400/10 p-3.5">
            <p className="text-indigo-300/80 text-[11px] font-semibold mb-1 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-3 h-3" />
              AI Insight
            </p>
            <p className="text-[#c4c4cc] text-[13px] leading-relaxed">
              {product.reason || `A solid ${product.category} choice featuring ${product.features[0]}.`}
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href={
            product.product_url && product.product_url !== "#"
              ? product.product_url
              : `https://www.amazon.in/s?k=${encodeURIComponent(product.name + " " + product.brand)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.97] ${
            isTopPick
              ? "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white shadow-lg shadow-indigo-500/20"
              : "bg-white/[0.04] hover:bg-white/[0.07] text-white/80 hover:text-white border border-white/[0.06]"
          }`}
        >
          View on Amazon
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
