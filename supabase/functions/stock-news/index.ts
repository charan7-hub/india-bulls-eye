import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { symbol, companyName } = await req.json();
    if (!symbol) {
      return new Response(JSON.stringify({ error: "symbol is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const NEWS_API_KEY = Deno.env.get("NEWS_API_KEY");
    if (!NEWS_API_KEY) throw new Error("NEWS_API_KEY is not configured");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch news from NewsData.io
    const searchQuery = companyName || symbol;
    const newsUrl = `https://newsdata.io/api/1/latest?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(searchQuery)}&country=in&language=en&category=business`;

    const newsResponse = await fetch(newsUrl);
    if (!newsResponse.ok) {
      const errText = await newsResponse.text();
      console.error("NewsData error:", newsResponse.status, errText);
      throw new Error(`News API error: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    const articles = (newsData.results || []).map((a: any) => ({
      title: a.title,
      description: a.description || a.content || "",
      source: a.source_name || a.source_id || "Unknown",
      url: a.link || "#",
    }));

    if (articles.length === 0) {
      return new Response(
        JSON.stringify({ segments: [], message: "No news found for this stock." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build headlines summary for AI
    const headlinesSummary = articles
      .slice(0, 8)
      .map(
        (a: any, i: number) =>
          `${i + 1}. "${a.title}" - ${a.description || "No description"} (Source: ${a.source || "Unknown"})`
      )
      .join("\n");

    // AI analysis via Lovable AI Gateway
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are an Indian stock market analyst. Analyze news headlines for ${searchQuery} (ticker: ${symbol}) listed on NSE/BSE. 

Return a JSON array of news segments. Each segment must have:
- "headline": A bold, concise headline (rewritten for clarity)
- "summary": Exactly 2 sentences explaining why this news affects the stock price
- "sentiment": One of "Positive", "Negative", or "Neutral"
- "category": One of "Macro Factors", "Company Specific", or "Sector Trends"
- "source": The original source name
- "sourceUrl": The original article URL
- "factors": An array of relevant India-specific factors mentioned (e.g., "RBI Interest Rates", "Crude Oil", "FII Flows", "Rupee Movement", "Government Policy", "Monsoon Impact", "GDP Growth"). Only include if genuinely relevant.

Return ONLY valid JSON array, no markdown, no explanation.`,
            },
            {
              role: "user",
              content: `Analyze these headlines for ${searchQuery} (${symbol}):\n\n${headlinesSummary}`,
            },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "[]";

    // Parse AI response - handle potential markdown wrapping
    let segments;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      segments = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      segments = [];
    }

    // Enrich with source URLs from original articles
    segments = segments.map((seg: any, i: number) => ({
      ...seg,
      sourceUrl: seg.sourceUrl || articles[i]?.url || "#",
      source: seg.source || articles[i]?.source || "Unknown",
    }));

    return new Response(JSON.stringify({ segments }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stock-news error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
