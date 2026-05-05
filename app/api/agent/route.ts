import { NextResponse } from "next/server";

// Legacy route — redirects to /api/recommend for backwards compatibility
export async function POST(req: Request) {
  const body = await req.json();
  const query = body.message || body.query || "";

  const res = await fetch(new URL("/api/recommend", req.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
