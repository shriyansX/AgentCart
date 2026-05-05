import { NextResponse } from "next/server";
import {
  parseUserIntent,
  rankAndExplainProducts,
  extractCategoryFromQuery,
  extractBudgetFromQuery,
} from "@/lib/ai";
import { filterProducts } from "@/lib/filter";
import {
  Product,
  EnrichedProduct,
  ApiResponse,
  AgentThinking,
  FinalVerdict,
  WhyNotItem,
} from "@/lib/types";
import productsData from "@/data/products.json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query: string = body.query || body.message || "";

    if (!query.trim()) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const allProducts = productsData as Product[];

    // STEP 1: Parse intent (deterministic + AI enrichment)
    const intent = await parseUserIntent(query);

    // STEP 2: Filter products BEFORE AI
    const filtered = filterProducts(allProducts, intent);

    // Build agent thinking metadata
    const agentThinking: AgentThinking = {
      detected_category: intent.category,
      detected_budget: intent.max_budget,
      detected_use_case: intent.use_case,
      total_products: allProducts.length,
      filtered_count: filtered.length,
      ai_analyzed_count: Math.min(filtered.length, 5),
      confidence: 0, // calculated below
    };

    if (filtered.length === 0) {
      const top = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 3);
      agentThinking.filtered_count = top.length;
      agentThinking.ai_analyzed_count = top.length;
      agentThinking.confidence = 40;

      return NextResponse.json(buildFallbackApiResponse(top, agentThinking));
    }

    // STEP 3: AI explains, compares, recommends (max 5 products)
    const toAnalyze = filtered.slice(0, 5);
    const aiResult = await rankAndExplainProducts(query, toAnalyze);

    // STEP 4: Merge AI output with full product data
    const productMap = new Map(filtered.map((p) => [p.id, p]));
    const enriched: EnrichedProduct[] = [];

    for (const ranked of aiResult.ranked_products) {
      const product = productMap.get(ranked.id);
      if (product) {
        enriched.push({ ...product, reason: ranked.reason, score: ranked.score });
      }
    }

    // Fill in any products AI missed
    const existingIds = new Set(enriched.map((p) => p.id));
    for (const product of filtered) {
      if (!existingIds.has(product.id)) {
        enriched.push({
          ...product,
          reason: `${product.name} features ${product.features.slice(0, 2).join(" and ")}.`,
          score: product.rating * 2,
        });
      }
    }

    // Sort: recommendation first, then by score
    const finalRecId = aiResult.final_recommendation.id;
    enriched.sort((a, b) => {
      if (a.id === finalRecId) return -1;
      if (b.id === finalRecId) return 1;
      return b.score - a.score;
    });

    // Calculate confidence score
    agentThinking.confidence = calculateConfidence(intent, enriched);

    // Build final verdict
    const finalVerdict = buildFinalVerdict(enriched, finalRecId);

    // Build "why not others" for non-recommended products
    const whyNotOthers = buildWhyNotOthers(enriched, finalRecId);

    const response: ApiResponse = {
      products: enriched,
      comparison_summary: aiResult.comparison_summary,
      final_recommendation_id: finalRecId,
      final_recommendation_why: aiResult.final_recommendation.why,
      agent_thinking: agentThinking,
      final_verdict: finalVerdict,
      why_not_others: whyNotOthers,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Recommend API error:", error);
    const allProducts = productsData as Product[];
    const top = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 3);
    const thinking: AgentThinking = {
      detected_category: "general",
      detected_budget: null,
      detected_use_case: "general",
      total_products: allProducts.length,
      filtered_count: top.length,
      ai_analyzed_count: top.length,
      confidence: 30,
    };
    return NextResponse.json(buildFallbackApiResponse(top, thinking));
  }
}

function calculateConfidence(
  intent: { category: string; max_budget: number | null },
  products: EnrichedProduct[]
): number {
  let conf = 50;
  if (intent.category && intent.category !== "other") conf += 20;
  if (intent.max_budget) conf += 10;
  if (products.length >= 3) conf += 10;
  if (products.length >= 1 && products[0].score >= 8) conf += 10;
  return Math.min(conf, 98);
}

function buildFinalVerdict(
  products: EnrichedProduct[],
  topPickId: string
): FinalVerdict {
  if (products.length === 0) return { best_performance: null, best_value: null, overall_winner: null };

  const sorted = [...products];
  const bestPerf = sorted.reduce((a, b) => (b.rating > a.rating ? b : a));
  const bestVal = sorted.reduce((a, b) => {
    const aValue = a.rating / (a.price / 10000);
    const bValue = b.rating / (b.price / 10000);
    return bValue > aValue ? b : a;
  });
  const winner = products.find((p) => p.id === topPickId) || products[0];

  return {
    best_performance: {
      id: bestPerf.id,
      name: bestPerf.name,
      reason: `Highest rating (${bestPerf.rating}/5) with ${bestPerf.reviews.toLocaleString()} reviews`,
    },
    best_value: {
      id: bestVal.id,
      name: bestVal.name,
      reason: `Best rating-to-price ratio at ₹${bestVal.price.toLocaleString("en-IN")}`,
    },
    overall_winner: {
      id: winner.id,
      name: winner.name,
      reason: winner.reason,
    },
  };
}

function buildWhyNotOthers(
  products: EnrichedProduct[],
  topPickId: string
): WhyNotItem[] {
  const winner = products.find((p) => p.id === topPickId);
  if (!winner || products.length <= 1) return [];

  return products
    .filter((p) => p.id !== topPickId)
    .slice(0, 3)
    .map((p) => {
      const reasons: string[] = [];
      if (p.price > winner.price) {
        const diff = ((p.price - winner.price) / winner.price * 100).toFixed(0);
        reasons.push(`${diff}% more expensive (₹${p.price.toLocaleString("en-IN")} vs ₹${winner.price.toLocaleString("en-IN")})`);
      }
      if (p.rating < winner.rating) {
        reasons.push(`Lower rating (${p.rating} vs ${winner.rating})`);
      }
      if (p.reviews < winner.reviews) {
        reasons.push(`Fewer verified reviews (${p.reviews.toLocaleString()} vs ${winner.reviews.toLocaleString()})`);
      }
      if (reasons.length === 0) {
        reasons.push("Close contender, but the winner edges out on overall value");
      }
      return { name: p.name, reasons };
    });
}

function buildFallbackApiResponse(
  products: Product[],
  thinking: AgentThinking
): ApiResponse {
  const enriched: EnrichedProduct[] = products.map((p, i) => ({
    ...p,
    reason: `${p.name} by ${p.brand} features ${p.features.slice(0, 2).join(" and ")}.`,
    score: 10 - i,
  }));

  return {
    products: enriched,
    comparison_summary: "Showing best matches based on your query.",
    final_recommendation_id: enriched[0]?.id || "",
    final_recommendation_why: enriched[0]
      ? `${enriched[0].name} is our top recommendation overall.`
      : "",
    is_fallback: true,
    agent_thinking: thinking,
    final_verdict: buildFinalVerdict(enriched, enriched[0]?.id || ""),
    why_not_others: [],
  };
}
