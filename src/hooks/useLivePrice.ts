import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LivePriceData {
  extracted_price: number | null;
  price_movement: {
    value: number;
    percentage: number;
    movement: string;
  } | null;
  market_trading: string | null;
  market_closed: string | null;
  title: string | null;
  previous_close: number | null;
  key_stats: Record<string, any> | null;
  financials: Record<string, any> | null;
  graph: Array<{ price: number; date?: string; volume?: number }> | null;
}

interface UseLivePriceReturn {
  data: LivePriceData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const cache = new Map<string, { data: LivePriceData; ts: number }>();
const CACHE_TTL = 60_000; // 1 minute

export function useLivePrice(symbol: string, exchange: string = 'NSE'): UseLivePriceReturn {
  const [data, setData] = useState<LivePriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    const key = `${symbol}:${exchange}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('stock-price', {
        body: { symbol, exchange },
      });

      if (fnError) throw new Error(fnError.message);
      if (result?.error) throw new Error(result.error);

      const liveData: LivePriceData = {
        extracted_price: result.extracted_price,
        price_movement: result.price_movement,
        market_trading: result.market_trading,
        market_closed: result.market_closed,
        title: result.title,
        previous_close: result.previous_close,
        key_stats: result.key_stats || null,
        financials: result.financials || null,
        graph: result.graph || null,
      };

      cache.set(key, { data: liveData, ts: Date.now() });
      setData(liveData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch price';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [symbol, exchange]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  return { data, loading, error, refetch: fetchPrice };
}
