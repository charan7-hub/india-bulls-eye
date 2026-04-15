const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SERPAPI_URL = 'https://serpapi.com/search.json';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { symbol, exchange } = await req.json();

    if (!symbol || typeof symbol !== 'string') {
      return new Response(JSON.stringify({ error: 'symbol is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('SERPAPI_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'SERPAPI_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ticker = `${symbol}:${exchange || 'NSE'}`;
    const url = new URL(SERPAPI_URL);
    url.searchParams.set('engine', 'google_finance');
    url.searchParams.set('q', ticker);
    url.searchParams.set('api_key', apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`SerpApi error [${response.status}]: ${text}`);
    }

    const data = await response.json();
    const summary = data.summary || {};
    const market = data.market || {};
    const keyStats = data.key_stats || {};
    const financials = data.financials || {};
    const graph = data.graph || [];

    const result = {
      symbol,
      exchange: exchange || 'NSE',
      title: summary.title || symbol,
      extracted_price: summary.extracted_price ?? null,
      currency: summary.currency || 'INR',
      price_movement: summary.price_movement || null,
      market_trading: market.trading || null,
      market_closed: market.closed || null,
      previous_close: summary.previous_close ?? null,
      // Financial data
      key_stats: keyStats,
      financials: financials,
      // Intraday graph data
      graph: graph,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('stock-price error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
