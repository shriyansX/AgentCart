# AgentCart – AI Shopping Agent

## Problem Statement

Finding the right product online is overwhelming. Users waste hours comparing specs across dozens of tabs, reading conflicting reviews, and second-guessing their choices.

## Solution

AgentCart is an AI-powered shopping agent that understands natural language queries, retrieves relevant products from a curated dataset, ranks them intelligently using Google Gemini, and explains **WHY** each product is recommended — so users can decide in seconds, not hours.

## Features

- 🧠 **Natural language product search** — Ask in plain English or Hindi
- 🤖 **AI-powered intent understanding** (Google Gemini 1.5 Flash)
- 🎯 **Smart product filtering** — category, budget, use-case, brand preference
- 📊 **AI product ranking & comparison** with explanatory summaries
- 💬 **Per-product AI reasoning** — "why this product" for every card
- ⭐ **Final recommendation** with one-line buy rationale
- 🌙 **Dark mode UI** — premium design with indigo accents
- 📱 **Fully responsive** — mobile, tablet, desktop
- 🛡️ **Graceful fallback** — never breaks even if AI is unavailable

## Tech Stack

| Layer    | Technology                     |
|----------|-------------------------------|
| Frontend | Next.js 16 App Router + TypeScript |
| Styling  | Tailwind CSS v4               |
| Fonts    | Syne (headings) + DM Sans (body) |
| AI       | Google Gemini 1.5 Flash via `@google/generative-ai` |
| Data     | Static JSON (40+ products)    |
| Animations | Framer Motion               |

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/agentcart.git
cd agentcart

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key_here" > .env.local

# 4. Start the dev server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

## Example Queries

- `"Best headphones under ₹2000"`
- `"Laptop for coding under ₹60,000"`
- `"Gaming mouse under ₹3000"`
- `"Budget smartphone under ₹15,000"`
- `"Premium wireless earbuds for music"`
- `"Logitech gaming keyboard for FPS"`

## Architecture

```
User Query
    ↓
parseUserIntent() [Gemini] → Extracts: category, budget, use_case, brand, keywords
    ↓
filterProducts() [filter.ts] → Fuzzy category match + budget filter + scoring sort → Top 5
    ↓
rankAndExplainProducts() [Gemini] → Ranks products + generates per-product reasons + summary
    ↓
Merged Response → EnrichedProduct[] with AI reasons → Rendered as ProductCards
```
