"use client";
import Link from "next/link";
import productsData from "@/data/products.json";

const CATEGORIES = [
  { slug: "headphones", label: "Headphones", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg> },
  { slug: "laptop", label: "Laptops", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { slug: "mouse", label: "Mice", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 2v8M6 10h12"/></svg> },
  { slug: "keyboard", label: "Keyboards", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg> },
  { slug: "smartphone", label: "Smartphones", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/></svg> },
  { slug: "earbuds", label: "Earbuds", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><circle cx="8" cy="15" r="3"/><circle cx="16" cy="15" r="3"/><path d="M8 12V5a4 4 0 018 0v7"/></svg> },
  { slug: "monitor", label: "Monitors", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { slug: "speaker", label: "Speakers", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="14" r="1"/><path d="M12 6h.01"/></svg> },
];

const products = productsData as Array<{ category: string }>;
const countByCategory = (slug: string) => products.filter(p => p.category === slug).length;

export default function CategoriesPage() {
  return (
    <div className="min-h-screen" style={{ background: "#070711", color: "#f4f4f5" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">Browse <span className="gradient-text">Categories</span></h1>
          <p style={{ color: "#71717a" }}>Explore our full product catalog by category</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => {
            const count = countByCategory(cat.slug);
            return (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} style={{ textDecoration: "none" }}>
                <div className="glass-card p-6 flex flex-col items-center text-center gap-3 cursor-pointer">
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{cat.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#52525b" }}>{count > 0 ? `${count} products` : "Coming soon"}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
