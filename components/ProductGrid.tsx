"use client";

import ProductCard from "./ProductCard";
import { EnrichedProduct } from "@/lib/types";

interface ProductGridProps {
  products: EnrichedProduct[];
  topPickId: string;
}

export default function ProductGrid({ products, topPickId }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          isTopPick={product.id === topPickId}
          index={index}
        />
      ))}
    </div>
  );
}
