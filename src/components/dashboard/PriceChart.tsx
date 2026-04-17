import { useEffect, useRef, useState, useMemo } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  UTCTimestamp,
  CandlestickData,
  SeriesMarker,
  Time,
  createSeriesMarkers,
} from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateCandleData } from '@/lib/stockData';
import { cn } from '@/lib/utils';
import { useLivePrice } from '@/hooks/useLivePrice';
import { detectPatterns, type Candle, type DetectedPattern } from '@/lib/patternDetection';
import { supabase } from '@/integrations/supabase/client';

interface PriceChartProps {
  symbol: string;
  exchange?: string;
  livePrice?: number | null;
  mainLiveLoading?: boolean;
}

type Timeframe = '1D' | '1W' | '1M';

const timeframeToWindow: Record<Timeframe, string> = {
  '1D': '1D',
  '1W': '5D',
  '1M': '1M',
};

// Build synthetic candles from a live intraday price array (line points).
function aggregateLineToCandles(
  graph: Array<{ price: number; date?: string; volume?: number }>,
  bucketSeconds: number
): Candle[] {
  if (!graph.length) return [];
  const buckets = new Map<number, { o: number; h: number; l: number; c: number; t: number }>();
  graph.forEach((p, i) => {
    const ts = p.date
      ? Math.floor(new Date(p.date).getTime() / 1000)
      : Math.floor(Date.now() / 1000) - (graph.length - i) * 60;
    const bucket = ts - (ts % bucketSeconds);
    const existing = buckets.get(bucket);
    if (!existing) {
      buckets.set(bucket, { o: p.price, h: p.price, l: p.price, c: p.price, t: bucket });
    } else {
      existing.h = Math.max(existing.h, p.price);
      existing.l = Math.min(existing.l, p.price);
      existing.c = p.price;
    }
  });
  return Array.from(buckets.values())
    .sort((a, b) => a.t - b.t)
    .map((b) => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c }));
}

export function PriceChart({ symbol, exchange = 'NSE', livePrice, mainLiveLoading }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [showSMA, setShowSMA] = useState(true);
  const [activePattern, setActivePattern] = useState<DetectedPattern | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const windowParam = timeframeToWindow[timeframe];
  const { data: tfData, loading: tfLoading } = useLivePrice(symbol, exchange, windowParam);
  const liveGraph = tfData?.graph || null;
  const isLoading = tfLoading || mainLiveLoading;

  // Build candle data: prefer live aggregated, else mock generator.
  const candleData = useMemo<Candle[]>(() => {
    if (liveGraph && liveGraph.length > 0) {
      const bucket = timeframe === '1D' ? 5 * 60 : timeframe === '1W' ? 30 * 60 : 24 * 3600;
      const live = aggregateLineToCandles(liveGraph, bucket);
      if (live.length > 1) return live;
    }
    return generateCandleData(symbol, timeframe).map((d) => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
  }, [liveGraph, symbol, timeframe]);

  const detectedPatterns = useMemo(() => detectPatterns(candleData), [candleData]);

  // Build/rebuild chart when symbol or timeframe changes
  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'hsl(215, 20%, 65%)',
        fontFamily: "'JetBrains Mono', monospace",
      },
      grid: {
        vertLines: { color: 'hsl(220, 30%, 18%)' },
        horzLines: { color: 'hsl(220, 30%, 18%)' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: 'hsl(187, 100%, 50%)', width: 1, style: 2 },
        horzLine: { color: 'hsl(187, 100%, 50%)', width: 1, style: 2 },
      },
      rightPriceScale: { borderColor: 'hsl(220, 30%, 20%)', autoScale: true },
      timeScale: {
        borderColor: 'hsl(220, 30%, 20%)',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });
    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: 'hsl(142, 70%, 50%)',
      downColor: 'hsl(0, 75%, 55%)',
      borderUpColor: 'hsl(142, 70%, 50%)',
      borderDownColor: 'hsl(0, 75%, 55%)',
      wickUpColor: 'hsl(142, 70%, 50%)',
      wickDownColor: 'hsl(0, 75%, 55%)',
    });
    candleSeriesRef.current = candleSeries;

    const seen = new Set<number>();
    const candles: CandlestickData<UTCTimestamp>[] = candleData
      .filter((c) => {
        if (seen.has(c.time)) return false;
        seen.add(c.time);
        return true;
      })
      .map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
    if (candles.length > 0) candleSeries.setData(candles);

    // Volume
    const volSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });
    volSeries.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
    volSeries.setData(
      candleData.map((c) => ({
        time: c.time as UTCTimestamp,
        value: Math.abs(c.close - c.open) * 10000 + 1000,
        color:
          c.close >= c.open
            ? 'hsla(142, 70%, 50%, 0.3)'
            : 'hsla(0, 75%, 55%, 0.3)',
      }))
    );

    // SMAs
    if (showSMA && candleData.length >= 20) {
      const sma20 = candleData
        .map((d, i) => {
          if (i < 20) return null;
          const sum = candleData.slice(i - 20, i).reduce((a, c) => a + c.close, 0);
          return { time: d.time as UTCTimestamp, value: sum / 20 };
        })
        .filter(Boolean) as { time: UTCTimestamp; value: number }[];
      if (sma20.length > 0) {
        chart.addSeries(LineSeries, {
          color: 'hsl(187, 100%, 50%)', lineWidth: 1,
          priceLineVisible: false, lastValueVisible: false,
        }).setData(sma20);
      }
      if (candleData.length >= 50) {
        const sma50 = candleData
          .map((d, i) => {
            if (i < 50) return null;
            const sum = candleData.slice(i - 50, i).reduce((a, c) => a + c.close, 0);
            return { time: d.time as UTCTimestamp, value: sum / 50 };
          })
          .filter(Boolean) as { time: UTCTimestamp; value: number }[];
        if (sma50.length > 0) {
          chart.addSeries(LineSeries, {
            color: 'hsl(45, 100%, 55%)', lineWidth: 1,
            priceLineVisible: false, lastValueVisible: false,
          }).setData(sma50);
        }
      }
    }

    // Pattern markers
    if (detectedPatterns.length > 0) {
      const markers: SeriesMarker<Time>[] = detectedPatterns.map((p) => ({
        time: p.candleTime as UTCTimestamp,
        position: p.sentiment === 'bullish' ? 'belowBar' : 'aboveBar',
        color:
          p.sentiment === 'bullish'
            ? 'hsl(142, 70%, 50%)'
            : 'hsl(0, 75%, 55%)',
        shape: p.sentiment === 'bullish' ? 'arrowUp' : 'arrowDown',
        text: `${p.name} • ${p.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}`,
      }));
      try {
        createSeriesMarkers(candleSeries, markers);
      } catch (e) {
        console.warn('Pattern markers not supported:', e);
      }
    }

    // Click handler — map clicked time to nearest detected pattern
    const handler = (param: any) => {
      if (!param?.time || detectedPatterns.length === 0) return;
      const clickedTime = param.time as number;
      const match = detectedPatterns.find((p) => Math.abs(p.candleTime - clickedTime) < 60 * 60 * 24);
      if (match) {
        setActivePattern(match);
        fetchExplanation(match);
      }
    };
    chart.subscribeClick(handler);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.unsubscribeClick(handler);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, timeframe, showSMA, candleData, detectedPatterns]);

  const fetchExplanation = async (pattern: DetectedPattern) => {
    setAiExplanation(null);
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pattern-explain', {
        body: { pattern: pattern.name, sentiment: pattern.sentiment, symbol },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiExplanation(data?.explanation || 'No explanation returned.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'AI request failed';
      setAiExplanation(`⚠ ${msg}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Card className="flex-1 relative rounded-none">
      {isLoading && (
        <div className="absolute inset-0 bg-background/70 z-20 flex items-center justify-center">
          <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-none">
            <div className="w-4 h-4 border-2 border-terminal-cyan border-t-transparent animate-spin" />
            <span className="text-sm font-mono text-terminal-cyan">Refreshing Data...</span>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">Price Chart</CardTitle>
            {detectedPatterns.length > 0 && (
              <Badge variant="outline" className="rounded-none font-mono text-[10px] gap-1">
                <Sparkles className="h-3 w-3" />
                {detectedPatterns.length} pattern{detectedPatterns.length > 1 ? 's' : ''} detected
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-none border border-border overflow-hidden">
              {(['1D', '1W', '1M'] as Timeframe[]).map((tf) => (
                <Button
                  key={tf}
                  variant="ghost"
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    'rounded-none h-7 px-3 text-xs font-mono',
                    timeframe === tf && 'bg-primary text-primary-foreground'
                  )}
                >
                  {tf}
                </Button>
              ))}
            </div>
            <Button
              variant={showSMA ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowSMA(!showSMA)}
              className="h-7 px-3 text-xs rounded-none"
            >
              SMA 20/50
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-terminal-green inline-block" />
            <span className="w-3 h-2 bg-terminal-red inline-block" />
            Candles
          </span>
          {showSMA && (
            <>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-terminal-cyan" /> SMA 20
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-terminal-gold" /> SMA 50
              </span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={chartContainerRef} className="w-full h-[350px]" />
        {detectedPatterns.length > 0 && (
          <div className="px-4 py-2 border-t border-border flex flex-wrap gap-1.5">
            {detectedPatterns.map((p, i) => (
              <button
                key={`${p.name}-${i}`}
                onClick={() => {
                  setActivePattern(p);
                  fetchExplanation(p);
                }}
                className={cn(
                  'text-[10px] font-mono px-2 py-1 rounded-none border transition-colors',
                  p.sentiment === 'bullish'
                    ? 'bg-terminal-green/10 text-terminal-green border-terminal-green/30 hover:bg-terminal-green/20'
                    : 'bg-terminal-red/10 text-terminal-red border-terminal-red/30 hover:bg-terminal-red/20'
                )}
              >
                {p.name} • {p.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}
              </button>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={!!activePattern} onOpenChange={(o) => !o && setActivePattern(null)}>
        <DialogContent className="rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono">
              <Sparkles className="h-4 w-4 text-terminal-cyan" />
              {activePattern?.name}
              <Badge
                variant="outline"
                className={cn(
                  'rounded-none text-[10px]',
                  activePattern?.sentiment === 'bullish'
                    ? 'text-terminal-green border-terminal-green/40'
                    : 'text-terminal-red border-terminal-red/40'
                )}
              >
                {activePattern?.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {activePattern?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="border border-border bg-muted/30 p-3 rounded-none">
            <p className="text-[10px] uppercase tracking-wider text-terminal-cyan font-mono mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Gemini AI · Psychology
            </p>
            {aiLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Analyzing the move...
              </div>
            ) : (
              <p className="text-xs leading-relaxed whitespace-pre-wrap">
                {aiExplanation || '...'}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
