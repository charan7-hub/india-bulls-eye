import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AgentResult {
  agent: string;
  analysis: string;
}

async function runAgent(
  apiKey: string,
  agentName: string,
  systemPrompt: string,
  userPrompt: string
): Promise<AgentResult> {
  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("RATE_LIMITED");
    }
    if (response.status === 402) {
      throw new Error("PAYMENT_REQUIRED");
    }
    const text = await response.text();
    console.error(`${agentName} error:`, response.status, text);
    throw new Error(`${agentName} failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "No analysis available.";
  return { agent: agentName, analysis: content };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { symbol, stockData } = await req.json();
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "Symbol is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stockContext = stockData
      ? `Stock: ${symbol} (${stockData.name})
Sector: ${stockData.sector}
Current Price: ₹${stockData.currentPrice}
Previous Close: ₹${stockData.previousClose}
Day High/Low: ₹${stockData.dayHigh} / ₹${stockData.dayLow}
52-Week High/Low: ₹${stockData.weekHigh52} / ₹${stockData.weekLow52}
All-Time High: ₹${stockData.allTimeHigh} (${stockData.athDate})
Volume: ${stockData.volume?.toLocaleString()}
Market Cap: ₹${stockData.marketCap?.toLocaleString()} Cr
P/E Ratio: ${stockData.peRatio} (Industry: ${stockData.industryPE})
Dividend Yield: ${stockData.dividendYield}%
Debt/Equity: ${stockData.debtToEquity}
RSI: ${stockData.rsi || 'N/A'}
MACD Histogram: ${stockData.macdHistogram || 'N/A'}`
      : `Stock: ${symbol} (Indian market)`;

    // Run all three agents in parallel — like a CrewAI crew
    const [technical, fundamental, sentiment] = await Promise.all([
      runAgent(
        LOVABLE_API_KEY,
        "Technical Analyst",
        `You are a senior technical analyst specializing in Indian equity markets (NSE/BSE). 
Analyze price action, chart patterns, support/resistance levels, moving averages, RSI, MACD, and volume.
Be specific with price levels in ₹. Keep your analysis to 4-5 concise bullet points.
Format each bullet as: "• **Label**: Analysis"
End with a one-line verdict: BULLISH / BEARISH / NEUTRAL with a target price range.`,
        stockContext
      ),
      runAgent(
        LOVABLE_API_KEY,
        "Fundamental Analyst",
        `You are a fundamental analyst covering Indian equities on NSE/BSE.
Evaluate valuation (P/E vs industry), financial health (debt/equity), growth prospects, dividend policy, and competitive positioning.
Be specific about the Indian market context (FII/DII flows, sector trends).
Keep your analysis to 4-5 concise bullet points.
Format each bullet as: "• **Label**: Analysis"
End with a one-line verdict: OVERVALUED / FAIRLY VALUED / UNDERVALUED with reasoning.`,
        stockContext
      ),
      runAgent(
        LOVABLE_API_KEY,
        "Sentiment Analyst",
        `You are a market sentiment analyst focused on Indian stocks and the broader NSE/BSE ecosystem.
Analyze market mood, institutional activity (FII/DII), sector momentum, news catalysts, and retail sentiment.
Consider India-specific factors: RBI policy, crude oil impact, rupee strength, government policy.
Keep your analysis to 4-5 concise bullet points.
Format each bullet as: "• **Label**: Analysis"
End with a one-line sentiment score: VERY BULLISH / BULLISH / NEUTRAL / BEARISH / VERY BEARISH.`,
        stockContext
      ),
    ]);

    // Final synthesis agent — the "crew manager"
    const synthesis = await runAgent(
      LOVABLE_API_KEY,
      "Chief Strategist",
      `You are the Chief Investment Strategist synthesizing reports from three analysts.
Given the Technical, Fundamental, and Sentiment analyses below, produce a final actionable recommendation.
Format:
1. **Overall Rating**: Strong Buy / Buy / Hold / Sell / Strong Sell
2. **Confidence**: X% (based on analyst agreement)
3. **Key Action**: One sentence — what should a trader do RIGHT NOW?
4. **Risk**: One sentence — the biggest risk to watch.
Keep the total response under 6 lines.`,
      `TECHNICAL ANALYST REPORT:\n${technical.analysis}\n\nFUNDAMENTAL ANALYST REPORT:\n${fundamental.analysis}\n\nSENTIMENT ANALYST REPORT:\n${sentiment.analysis}`
    );

    return new Response(
      JSON.stringify({
        symbol,
        agents: [technical, fundamental, sentiment],
        synthesis: synthesis.analysis,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("stock-analysis error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";

    if (message === "RATE_LIMITED") {
      return new Response(
        JSON.stringify({ error: "AI rate limit exceeded. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (message === "PAYMENT_REQUIRED") {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
