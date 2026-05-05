export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  use_cases: string[];
  product_url: string;
  badge: "Best Seller" | "Top Rated" | "Budget Pick" | "Premium" | null;
}

export interface UserIntent {
  category: string;
  max_budget: number | null;
  use_case: string;
  brand_preference: string | null;
  keywords: string[];
}

export interface RankedProduct {
  id: string;
  reason: string;
  score: number;
}

export interface AIRecommendation {
  ranked_products: RankedProduct[];
  comparison_summary: string;
  final_recommendation: {
    id: string;
    why: string;
  };
}

export interface EnrichedProduct extends Product {
  reason: string;
  score: number;
}

export interface ApiResponse {
  products: EnrichedProduct[];
  comparison_summary: string;
  final_recommendation_id: string;
  final_recommendation_why: string;
  is_fallback?: boolean;
}
