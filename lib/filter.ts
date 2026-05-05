import { Product, UserIntent } from "./types";

const CATEGORY_ALIASES: Record<string, string[]> = {
  headphones: ["headphones", "headphone", "headset", "over-ear", "on-ear"],
  laptop: ["laptop", "notebook", "computer", "ultrabook"],
  mouse: ["mouse", "mice", "gaming mouse"],
  keyboard: ["keyboard", "mechanical keyboard"],
  monitor: ["monitor", "display", "screen"],
  smartphone: ["smartphone", "phone", "mobile", "android", "iphone"],
  earbuds: ["earbuds", "earbud", "tws", "in-ear", "airpods"],
  speaker: ["speaker", "bluetooth speaker", "portable speaker"],
};

function categoryMatches(product: Product, intentCategory: string): boolean {
  if (!intentCategory || intentCategory === "other") return true;

  const normalizedIntent = intentCategory.toLowerCase();
  const aliases = CATEGORY_ALIASES[normalizedIntent] || [normalizedIntent];

  const productCategory = product.category.toLowerCase();
  const categoryMatch = aliases.some(
    (alias) =>
      productCategory.includes(alias) || alias.includes(productCategory)
  );

  const useCaseMatch = product.use_cases.some((uc) =>
    aliases.some((alias) => uc.toLowerCase().includes(alias))
  );

  return categoryMatch || useCaseMatch;
}

function useCaseMatches(product: Product, intentUseCase: string): boolean {
  if (!intentUseCase || intentUseCase === "general") return true;
  return product.use_cases.some(
    (uc) =>
      uc.toLowerCase().includes(intentUseCase.toLowerCase()) ||
      intentUseCase.toLowerCase().includes(uc.toLowerCase())
  );
}

function keywordMatches(product: Product, keywords: string[]): number {
  if (!keywords || keywords.length === 0) return 0;
  let score = 0;
  const searchableText =
    `${product.name} ${product.brand} ${product.category} ${product.features.join(" ")} ${product.use_cases.join(" ")}`.toLowerCase();

  for (const kw of keywords) {
    if (searchableText.includes(kw.toLowerCase())) score++;
  }
  return score;
}

export function filterProducts(products: Product[], intent: UserIntent): Product[] {
  let filtered = products.filter((product) => {
    // Category filter
    if (!categoryMatches(product, intent.category)) return false;

    // Budget filter
    if (intent.max_budget !== null && product.price > intent.max_budget)
      return false;

    // Brand preference filter (soft match — don't exclude if no match, just deprioritize)
    return true;
  });

  // If we got nothing with category, broaden the search using keywords
  if (filtered.length === 0 && intent.keywords.length > 0) {
    filtered = products.filter((product) => {
      if (intent.max_budget !== null && product.price > intent.max_budget)
        return false;
      return keywordMatches(product, intent.keywords) > 0;
    });
  }

  // Final fallback: return best-rated products
  if (filtered.length === 0) {
    filtered = [...products];
    if (intent.max_budget !== null) {
      filtered = filtered.filter((p) => p.price <= intent.max_budget!);
    }
  }

  // Sort: brand preference first, then use-case match, then rating DESC, reviews DESC
  return filtered
    .sort((a, b) => {
      // Brand preference boost
      const brandPref = intent.brand_preference?.toLowerCase();
      const aIsBrand = brandPref
        ? a.brand.toLowerCase().includes(brandPref)
        : false;
      const bIsBrand = brandPref
        ? b.brand.toLowerCase().includes(brandPref)
        : false;
      if (aIsBrand && !bIsBrand) return -1;
      if (!aIsBrand && bIsBrand) return 1;

      // Use case match boost
      const aUseCaseMatch = useCaseMatches(a, intent.use_case) ? 1 : 0;
      const bUseCaseMatch = useCaseMatches(b, intent.use_case) ? 1 : 0;
      if (aUseCaseMatch !== bUseCaseMatch) return bUseCaseMatch - aUseCaseMatch;

      // Keyword score boost
      const aKwScore = keywordMatches(a, intent.keywords);
      const bKwScore = keywordMatches(b, intent.keywords);
      if (aKwScore !== bKwScore) return bKwScore - aKwScore;

      // Rating then reviews
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviews - a.reviews;
    })
    .slice(0, 5);
}
