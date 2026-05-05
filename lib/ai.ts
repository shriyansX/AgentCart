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
  // Strip markdown code fences if present
  return text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
};

export async function parseUserIntent(query: string): Promise<UserIntent> {
  const genAI = getGenAI();

  const fallback: UserIntent = {
    category: extractCategoryFromQuery(query),
    max_budget: extractBudgetFromQuery(query),
    use_case: "general",
    brand_preference: null,
    keywords: query.toLowerCase().split(" ").filter((w) => w.length > 3),
  };

  if (!genAI) return fallback;

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
    return parsed;
  } catch (err) {
    console.error("parseUserIntent failed, using fallback:", err);
    return fallback;
  }
}

export async function rankAndExplainProducts(
  query: string,
  products: Product[]
): Promise<AIRecommendation> {
  const genAI = getGenAI();

  const fallbackRanked: AIRecommendation = {
    ranked_products: products.map((p, i) => ({
      id: p.id,
      reason: `This ${p.category} by ${p.brand} is a strong choice, featuring ${p.features.slice(0, 2).join(" and ")}.`,
      score: 10 - i,
    })),
    comparison_summary:
      "Showing best matches for your query. These products have been selected based on your requirements.",
    final_recommendation: {
      id: products[0].id,
      why: `The ${products[0].name} offers the best overall value and performance for your needs.`,
    },
  };

  if (!genAI || products.length === 0) return fallbackRanked;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const simplifiedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      rating: p.rating,
      reviews: p.reviews,
      features: p.features,
      use_cases: p.use_cases,
      badge: p.badge,
    }));

    const prompt = `You are an AI shopping expert. The user asked: "${query}"

Here are up to 5 products (in JSON):
${JSON.stringify(simplifiedProducts, null, 2)}

Analyze and return ONLY valid JSON (no markdown):
{
  "ranked_products": [
    {
      "id": "product id",
      "reason": "1-2 sentence explanation of why this is good for the user",
      "score": number from 1-10
    }
  ],
  "comparison_summary": "2-3 sentence comparison of the top options",
  "final_recommendation": {
    "id": "product id of top pick",
    "why": "1 sentence strong reason to buy this one"
  }
}`;

    const result = await model.generateContent(prompt);
    const text = cleanJsonResponse(result.response.text());
    const parsed = JSON.parse(text) as AIRecommendation;
    return parsed;
  } catch (err) {
    console.error("rankAndExplainProducts failed, using fallback:", err);
    return fallbackRanked;
  }
}

// --- Fallback helpers ---
function extractCategoryFromQuery(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes("headphone") || lower.includes("headset")) return "headphones";
  if (lower.includes("laptop") || lower.includes("notebook")) return "laptop";
  if (lower.includes("mouse") || lower.includes("mice")) return "mouse";
  if (lower.includes("keyboard")) return "keyboard";
  if (lower.includes("monitor") || lower.includes("display") || lower.includes("screen")) return "monitor";
  if (lower.includes("phone") || lower.includes("smartphone") || lower.includes("mobile")) return "smartphone";
  if (lower.includes("earbud") || lower.includes("tws") || lower.includes("airpod")) return "earbuds";
  if (lower.includes("speaker") || lower.includes("bluetooth speaker")) return "speaker";
  return "other";
}

function extractBudgetFromQuery(query: string): number | null {
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
