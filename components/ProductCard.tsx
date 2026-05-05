"use client";

import { EnrichedProduct } from "@/lib/types";

interface ProductCardProps {
  product: EnrichedProduct;
  isTopPick: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Top Rated": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Budget Pick": "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Premium: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

export default function ProductCard({ product, isTopPick }: ProductCardProps) {
  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isTopPick
          ? "border-indigo-500 shadow-lg shadow-indigo-500/20 bg-[#111118]"
          : "border-[#1e1e2e] shadow-md shadow-black/30 bg-[#111118] hover:border-indigo-500/50"
      }`}
    >
      {/* Top Pick ribbon */}
      {isTopPick && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold text-center py-1.5 tracking-wide">
          ⭐ Recommended Choice
        </div>
      )}

      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute ${isTopPick ? "top-9" : "top-3"} right-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            BADGE_STYLES[product.badge] ?? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
          }`}
        >
          {product.badge}
        </div>
      )}

      {/* Product image */}
      <div style={{ background: '#0d0d1a', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: isTopPick ? '28px' : '0' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '200px', objectFit: 'contain', padding: '16px' }}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const fallbacks: Record<string, string> = {
              headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=220&fit=crop',
              earbuds: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=220&fit=crop',
              laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=220&fit=crop',
              mouse: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=220&fit=crop',
              keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=220&fit=crop',
              monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=220&fit=crop',
              smartphone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=220&fit=crop',
              speaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=220&fit=crop',
            };
            const cat = (product.category || '').toLowerCase();
            target.src = fallbacks[cat] || `https://placehold.co/400x220/111118/6366f1?text=${encodeURIComponent(product.name)}`;
            target.onerror = null;
          }}
        />
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-grow p-5 gap-3">
        {/* Brand */}
        <p className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">
          {product.brand}
        </p>

        {/* Product name */}
        <h3 className="text-white font-bold text-base leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Rating & reviews */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-amber-400 font-semibold">⭐ {product.rating.toFixed(1)}</span>
          <span className="text-[#a1a1aa]">
            ({product.reviews.toLocaleString("en-IN")} reviews)
          </span>
        </div>

        {/* Price */}
        <p
          className={`text-2xl font-black tracking-tight ${
            isTopPick ? "text-indigo-400" : "text-indigo-400"
          }`}
        >
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5">
          {product.features.slice(0, 3).map((feat, i) => (
            <span
              key={i}
              className="bg-[#1e1e2e] text-[#a1a1aa] text-xs px-2.5 py-1 rounded-full border border-[#2a2a3e]"
            >
              {feat}
            </span>
          ))}
        </div>

        {/* AI Reason box */}
        <div className="mt-auto pt-3 rounded-xl bg-[#1e1b4b] border border-indigo-500/20 p-3.5">
          <p className="text-indigo-300 text-xs font-semibold mb-1.5 flex items-center gap-1.5">
            🧠 Why we recommend this:
          </p>
          <p className="text-white text-sm leading-relaxed">
            {product.reason ||
              `A solid ${product.category} choice featuring ${product.features[0]}.`}
          </p>
        </div>

        {/* CTA */}
        <a
          href={
            product.product_url && product.product_url !== '#'
              ? product.product_url
              : `https://www.amazon.in/s?k=${encodeURIComponent(product.name + ' ' + product.brand)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all duration-200 hover:opacity-90 active:scale-95 ${
            isTopPick
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
              : "bg-[#1e1e2e] hover:bg-[#2a2a3e] text-white border border-[#2a2a3e]"
          }`}
        >
          View on Amazon →
        </a>
      </div>
    </div>
  );
}
