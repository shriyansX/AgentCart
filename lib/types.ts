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

// Agent thinking metadata — shows HOW the agent decided
export interface AgentThinking {
  detected_category: string;
  detected_budget: number | null;
  detected_use_case: string;
  total_products: number;
  filtered_count: number;
  ai_analyzed_count: number;
  confidence: number; // 0–100
}

// Final structured recommendation
export interface FinalVerdict {
  best_performance: { id: string; name: string; reason: string } | null;
  best_value: { id: string; name: string; reason: string } | null;
  overall_winner: { id: string; name: string; reason: string } | null;
}

// "Why not" explanation for rejected products
export interface WhyNotItem {
  name: string;
  reasons: string[];
}

export interface ApiResponse {
  products: EnrichedProduct[];
  comparison_summary: string;
  final_recommendation_id: string;
  final_recommendation_why: string;
  is_fallback?: boolean;
  agent_thinking: AgentThinking;
  final_verdict: FinalVerdict;
  why_not_others: WhyNotItem[];
}
