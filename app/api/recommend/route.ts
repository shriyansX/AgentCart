import { NextResponse } from "next/server";
import { parseUserIntent, rankAndExplainProducts } from "@/lib/ai";
import { filterProducts } from "@/lib/filter";
import { Product, EnrichedProduct, ApiResponse } from "@/lib/types";
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

    const products = productsData as Product[];

    // STEP 1: Parse intent with Gemini (falls back gracefully)
    const intent = await parseUserIntent(query);
    console.log("Parsed intent:", intent);

    // STEP 2: Filter products
    const filtered = filterProducts(products, intent);
    console.log(`Filtered ${filtered.length} products`);

    if (filtered.length === 0) {
      // Absolute fallback: return top 3 by rating
      const topProducts = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      const fallbackResponse: ApiResponse = {
        products: topProducts.map((p, i) => ({
          ...p,
          reason: `This ${p.category} by ${p.brand} is one of our top-rated products, featuring ${p.features.slice(0, 2).join(" and ")}.`,
          score: 10 - i,
        })),
        comparison_summary:
          "Showing best matches for your query. Here are our top recommended products.",
        final_recommendation_id: topProducts[0].id,
        final_recommendation_why: `The ${topProducts[0].name} is our highest-rated product overall.`,
        is_fallback: true,
      };

      return NextResponse.json(fallbackResponse);
    }

    // STEP 3: Rank and explain with Gemini
    const aiResult = await rankAndExplainProducts(query, filtered);

    // STEP 4: Merge AI output with product data
    const productMap = new Map(filtered.map((p) => [p.id, p]));

    const enriched: EnrichedProduct[] = [];

    // Build from AI ranked list
    for (const ranked of aiResult.ranked_products) {
      const product = productMap.get(ranked.id);
      if (product) {
        enriched.push({
          ...product,
          reason: ranked.reason,
          score: ranked.score,
        });
      }
    }

    // If AI returned fewer products than we have, fill in remaining
    if (enriched.length < filtered.length) {
      const existingIds = new Set(enriched.map((p) => p.id));
      for (const product of filtered) {
        if (!existingIds.has(product.id)) {
          enriched.push({
            ...product,
            reason: `This ${product.category} by ${product.brand} features ${product.features.slice(0, 2).join(" and ")}.`,
            score: product.rating * 2,
          });
        }
      }
    }

    // Put the final recommendation first
    const finalRecId = aiResult.final_recommendation.id;
    enriched.sort((a, b) => {
      if (a.id === finalRecId) return -1;
      if (b.id === finalRecId) return 1;
      return b.score - a.score;
    });

    const response: ApiResponse = {
      products: enriched,
      comparison_summary: aiResult.comparison_summary,
      final_recommendation_id: aiResult.final_recommendation.id,
      final_recommendation_why: aiResult.final_recommendation.why,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Recommend API error:", error);

    // Never return an error to the UI — return fallback products
    const products = productsData as Product[];
    const topProducts = [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    const fallbackResponse: ApiResponse = {
      products: topProducts.map((p, i) => ({
        ...p,
        reason: `Showing best matches for your query. This ${p.category} by ${p.brand} features ${p.features.slice(0, 2).join(" and ")}.`,
        score: 10 - i,
      })),
      comparison_summary: "Showing best matches for your query.",
      final_recommendation_id: topProducts[0].id,
      final_recommendation_why: `The ${topProducts[0].name} is our top recommendation overall.`,
      is_fallback: true,
    };

    return NextResponse.json(fallbackResponse);
  }
}
