import { NextResponse } from "next/server";
import { parseIntent, generateReasoning, Product } from "@/lib/ai";
import { filterProducts } from "@/lib/filter";
import productsData from "@/data/products.json";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Parse intent from user message
    const intent = await parseIntent(message);
    console.log("Extracted Intent:", intent);

    // 2. Filter products based on intent
    const filteredProducts = filterProducts(productsData as Product[], intent);

    if (filteredProducts.length === 0) {
      return NextResponse.json({
        message: "I couldn't find any products matching your criteria. Could you try a different search?",
        products: [],
        reasoning: "No products found."
      });
    }

    // 3. Generate reasoning for the top products (max 5 for reasoning)
    const productsForReasoning = filteredProducts.slice(0, 5);
    const agentResponse = await generateReasoning(message, productsForReasoning);

    // 4. Combine data for frontend
    const enrichedRecommendations = agentResponse.recommendations.map(rec => {
      const product = productsData.find(p => p.id === rec.productId);
      return {
        ...product,
        why: rec.why,
        isBestChoice: rec.isBestChoice
      };
    });

    return NextResponse.json({
      reasoning: agentResponse.reasoning,
      recommendations: enrichedRecommendations
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
