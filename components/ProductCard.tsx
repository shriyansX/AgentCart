"use client";

import { motion } from "framer-motion";
import { Star, ExternalLink, CheckCircle } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
    description: string;
    why: string;
    isBestChoice: boolean;
    features: string[];
    url: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group flex flex-col h-full bg-white dark:bg-zinc-900 border ${
        product.isBestChoice ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-zinc-200 dark:border-zinc-800"
      } rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10`}
    >
      {product.isBestChoice && (
        <div className="absolute top-4 right-4 z-10 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <CheckCircle className="w-3 h-3" />
          Recommended
        </div>
      )}

      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight text-zinc-900 dark:text-zinc-100 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded text-xs font-bold">
            <Star className="w-3 h-3 fill-current" />
            {product.rating}
          </div>
        </div>

        <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-3">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <div className="mb-4 flex-grow">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 italic">
            "{product.why}"
          </p>
          <ul className="space-y-1">
            {product.features.slice(0, 3).map((f, i) => (
              <li key={i} className="text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-indigo-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          View Details
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
