import { GoogleGenerativeAI } from "@google/generative-ai";
import { Product, UserIntent, AIRecommendation } from "./types";

const getGenAI = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch {
    return null;
  }
};

const cleanJsonResponse = (text: string): string => {
  return text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
};

// ---------- Deterministic intent extraction (CODE, not AI) ----------

export function extractCategoryFromQuery(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes("headphone") || lower.includes("headset")) return "headphones";
  if (lower.includes("laptop") || lower.includes("notebook")) return "laptop";
  if (lower.includes("mouse") || lower.includes("mice")) return "mouse";
  if (lower.includes("keyboard")) return "keyboard";
  if (lower.includes("monitor") || lower.includes("display") || lower.includes("screen")) return "monitor";
  if (lower.includes("phone") || lower.includes("smartphone") || lower.includes("mobile")) return "smartphone";
  if (lower.includes("earbud") || lower.includes("tws") || lower.includes("airpod")) return "earbuds";
  if (lower.includes("speaker")) return "speaker";
  return "other";
}

export function extractBudgetFromQuery(query: string): number | null {
  const matches = query.match(/(?:under|below|upto|up to|less than|within|₹|rs\.?|inr)\s*(\d[\d,]*)/i);
  if (matches) {
    const num = parseInt(matches[1].replace(/,/g, ""), 10);
    return isNaN(num) ? null : num;
  }
  const standalone = query.match(/\b(\d{4,6})\b/g);
  if (standalone) {
    const nums = standalone.map((n) => parseInt(n, 10)).filter((n) => n >= 500);
    return nums.length > 0 ? Math.max(...nums) : null;
  }
  return null;
}

function extractUseCaseFromQuery(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes("gaming") || lower.includes("game")) return "gaming";
  if (lower.includes("coding") || lower.includes("programming") || lower.includes("developer")) return "coding";
  if (lower.includes("music") || lower.includes("audio") || lower.includes("bass")) return "music";
  if (lower.includes("work") || lower.includes("office") || lower.includes("productivity")) return "work";
  if (lower.includes("study") || lower.includes("student") || lower.includes("college")) return "study";
  return "general";
}

// Hybrid: try AI first, fall back to deterministic
export async function parseUserIntent(query: string): Promise<UserIntent> {
  // Always compute deterministic baseline
  const deterministic: UserIntent = {
    category: extractCategoryFromQuery(query),
    max_budget: extractBudgetFromQuery(query),
    use_case: extractUseCaseFromQuery(query),
    brand_preference: null,
    keywords: query.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
  };

  const genAI = getGenAI();
  if (!genAI) return deterministic;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a shopping assistant. A user said: "${query}"

Extract their intent and return ONLY valid JSON (no markdown, no explanation):
{
  "category": "headphones|laptop|mouse|keyboard|monitor|smartphone|earbuds|speaker|other",
  "max_budget": number or null,
  "use_case": "gaming|coding|music|work|study|general",
  "brand_preference": "string or null",
  "keywords": ["array of relevant keywords"]
}`;
    const result = await model.generateContent(prompt);
    const text = cleanJsonResponse(result.response.text());
    const parsed = JSON.parse(text) as UserIntent;
    // Merge: prefer AI values but keep deterministic budget if AI missed it
    return {
      category: parsed.category || deterministic.category,
      max_budget: parsed.max_budget ?? deterministic.max_budget,
      use_case: parsed.use_case || deterministic.use_case,
      brand_preference: parsed.brand_preference,
      keywords: parsed.keywords?.length ? parsed.keywords : deterministic.keywords,
    };
  } catch (err) {
    console.error("parseUserIntent AI failed, using deterministic:", err);
    return deterministic;
  }
}

// ---------- AI Ranking (ONLY explains, compares, recommends) ----------

export async function rankAndExplainProducts(
  query: string,
  products: Product[]
): Promise<AIRecommendation> {
  const fallback = buildFallbackRecommendation(products);
  const genAI = getGenAI();
  if (!genAI || products.length === 0) return fallback;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const simplifiedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      rating: p.rating,
      reviews: p.reviews,
      features: p.features,
    }));

    const prompt = `You are an AI shopping assistant.
You are given a list of filtered products.

Your job:
1. Explain each product in 1-2 lines
2. Compare them briefly
3. Give a clear final recommendation

User query: "${query}"

Products:
${JSON.stringify(simplifiedProducts, null, 2)}

Return ONLY valid JSON (no markdown):
{
  "ranked_products": [
    { "id": "product id", "reason": "1-2 sentence explanation", "score": number_1_to_10 }
  ],
  "comparison_summary": "2-3 sentence comparison",
  "final_recommendation": {
    "id": "product id of top pick",
    "why": "1 sentence strong reason"
  }
}`;

    const result = await model.generateContent(prompt);
    const text = cleanJsonResponse(result.response.text());
    const parsed = JSON.parse(text) as AIRecommendation;
    return parsed;
  } catch (err) {
    console.error("rankAndExplainProducts AI failed, using fallback:", err);
    return fallback;
  }
}

function buildFallbackRecommendation(products: Product[]): AIRecommendation {
  return {
    ranked_products: products.map((p, i) => ({
      id: p.id,
      reason: `${p.name} by ${p.brand} features ${p.features.slice(0, 2).join(" and ")}. Rated ${p.rating}/5 with ${p.reviews.toLocaleString()} reviews.`,
      score: 10 - i,
    })),
    comparison_summary:
      "Showing best matches based on your query. Products are ranked by rating, reviews, and relevance.",
    final_recommendation: {
      id: products[0]?.id || "",
      why: products[0]
        ? `The ${products[0].name} offers the best overall value and performance.`
        : "No products matched your criteria.",
    },
  };
}
