import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  features: string[];
  image: string;
  description: string;
  url: string;
}

export interface ShoppingIntent {
  category: string;
  maxBudget: number | null;
  preferences: string[];
}

export interface AgentResponse {
  reasoning: string;
  recommendations: {
    productId: string;
    why: string;
    isBestChoice: boolean;
  }[];
}

export async function parseIntent(query: string): Promise<ShoppingIntent> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Extract shopping intent from the following user query: "${query}"
    Return ONLY a JSON object with this structure:
    {
      "category": "string (e.g. mouse, headphones, laptop)",
      "maxBudget": number | null (in INR),
      "preferences": ["string", "string"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error parsing intent:", error);
    return { category: "", maxBudget: null, preferences: [] };
  }
}

export async function generateReasoning(query: string, products: Product[]): Promise<AgentResponse> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    User Query: "${query}"
    Available Products: ${JSON.stringify(products)}

    Role: You are AgentCart, an expert shopping assistant.
    Task: Analyze the products and recommend the top 3 options based on the user's query.
    
    Output Requirements:
    1. Provide a "reasoning" summary explaining the overall landscape.
    2. For each recommended product, explain "why" it fits the user's needs.
    3. Designate one product as "isBestChoice" (the absolute best fit).
    
    Return ONLY a JSON object with this structure:
    {
      "reasoning": "string (markdown format supported)",
      "recommendations": [
        {
          "productId": "string",
          "why": "string",
          "isBestChoice": boolean
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating reasoning:", error);
    return {
      reasoning: "I found some products for you, but I encountered an error while analyzing them.",
      recommendations: products.slice(0, 3).map((p, i) => ({
        productId: p.id,
        why: "This is a great option based on your query.",
        isBestChoice: i === 0
      }))
    };
  }
}
