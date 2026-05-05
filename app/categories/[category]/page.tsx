import Link from "next/link";
import { notFound } from "next/navigation";
import productsData from "@/data/products.json";
import { Product } from "@/lib/types";
import CategoryProductImage from "@/components/CategoryProductImage";

interface Props { params: Promise<{ category: string }> }

const LABELS: Record<string, string> = {
  headphones: "Headphones", laptop: "Laptops", mouse: "Mice", keyboard: "Keyboards",
  smartphone: "Smartphones", earbuds: "Earbuds", monitor: "Monitors", speaker: "Speakers",
};

export async function generateStaticParams() {
  return Object.keys(LABELS).map(c => ({ category: c }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const label = LABELS[category] || category;
  return { title: `${label} – AgentCart`, description: `Browse all ${label} on AgentCart.` };
}

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

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!LABELS[category]) notFound();
  const products = (productsData as Product[]).filter(p => p.category === category);
  const label = LABELS[category];

  return (
    <div className="min-h-screen" style={{ background: "#070711", color: "#f4f4f5" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/categories" className="text-sm no-underline" style={{ color: "#71717a" }}>← Categories</Link>
          <span style={{ color: "#3f3f46" }}>/</span>
          <span className="text-sm" style={{ color: "#a1a1aa" }}>{label}</span>
        </div>
        <h1 className="font-heading text-3xl font-bold mb-1">{label}</h1>
        <p className="text-sm mb-8" style={{ color: "#71717a" }}>{products.length} products</p>
        {products.length === 0 ? (
          <div className="text-center py-24"><p className="text-lg" style={{ color: "#71717a" }}>No products in this category yet.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product.id} className="glass-card flex flex-col overflow-hidden" style={{ borderRadius: 16 }}>
                <div style={{ background: "linear-gradient(135deg,#0d0d1a,#111130)", height: 160, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                  <CategoryProductImage src={product.image} alt={product.name} fallback={FALLBACKS[category] || ""} />
                </div>
                <div className="p-4 flex flex-col gap-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#71717a" }}>{product.brand}</p>
                  <p className="text-white font-bold text-sm leading-snug line-clamp-2">{product.name}</p>
                  <p className="font-black text-lg" style={{ color: "#818cf8" }}>₹{product.price.toLocaleString("en-IN")}</p>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "#fbbf24" }}>
                    ⭐ <span>{product.rating}</span> <span style={{ color: "#52525b" }}>({product.reviews.toLocaleString()})</span>
                  </div>
                  <a href={product.product_url || `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer"
                    className="mt-2 text-center text-sm font-semibold py-2 rounded-xl no-underline transition-all"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8", display: "block" }}>
                    View on Amazon →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
