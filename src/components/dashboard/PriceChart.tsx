import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
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
  IPriceLine,
  createSeriesMarkers,
} from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, Loader2, TrendingUp, Minus, GitBranch, Trash2, MousePointer2,
} from 'lucide-react';
import { generateCandleData } from '@/lib/stockData';
import { cn } from '@/lib/utils';
import { useLivePrice } from '@/hooks/useLivePrice';
import { detectPatterns, type Candle, type DetectedPattern } from '@/lib/patternDetection';
import { supabase } from '@/integrations/supabase/client';
import {
  useChartDrawings,
  type Drawing,
  type DrawingTool,
  type TrendlineDrawing,
  type FibonacciDrawing,
} from '@/hooks/useChartDrawings';
import { toast } from '@/hooks/use-toast';

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

const FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
const FIB_COLORS: Record<string, string> = {
  '0': 'hsl(0, 75%, 55%)',
  '0.236': 'hsl(30, 90%, 55%)',
  '0.382': 'hsl(45, 100%, 55%)',
  '0.5': 'hsl(187, 100%, 50%)',
  '0.618': 'hsl(142, 70%, 50%)',
  '0.786': 'hsl(260, 70%, 65%)',
  '1': 'hsl(0, 75%, 55%)',
};

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
  const drawingSeriesRef = useRef<Array<ISeriesApi<'Line'>>>([]);
  const priceLinesRef = useRef<Array<{ series: ISeriesApi<'Candlestick'>; line: IPriceLine }>>([]);
  const pendingPointRef = useRef<{ time: number; price: number } | null>(null);

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [activePattern, setActivePattern] = useState<DetectedPattern | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<DrawingTool>('none');

  const { drawings, addDrawing, removeDrawing, clearDrawings } = useChartDrawings(symbol, exchange);

  const windowParam = timeframeToWindow[timeframe];
  const { data: tfData, loading: tfLoading } = useLivePrice(symbol, exchange, windowParam);
  const liveGraph = tfData?.graph || null;
  const isLoading = tfLoading || mainLiveLoading;

  const candleData = useMemo<Candle[]>(() => {
    if (liveGraph && liveGraph.length > 0) {
      const bucket = timeframe === '1D' ? 5 * 60 : timeframe === '1W' ? 30 * 60 : 24 * 3600;
      const live = aggregateLineToCandles(liveGraph, bucket);
      if (live.length > 1) return live;
    }
    return generateCandleData(symbol, timeframe).map((d) => ({
      time: d.time, open: d.open, high: d.high, low: d.low, close: d.close,
    }));
  }, [liveGraph, symbol, timeframe]);

  const detectedPatterns = useMemo(() => detectPatterns(candleData), [candleData]);

  // Helper: clear all drawing visuals from chart (not from state)
  const clearDrawingVisuals = useCallback(() => {
    if (chartRef.current) {
      drawingSeriesRef.current.forEach((s) => {
        try { chartRef.current!.removeSeries(s); } catch { /* noop */ }
      });
    }
    drawingSeriesRef.current = [];
    if (candleSeriesRef.current) {
      priceLinesRef.current.forEach(({ series, line }) => {
        try { series.removePriceLine(line); } catch { /* noop */ }
      });
    }
    priceLinesRef.current = [];
  }, []);

  // Render all persisted drawings onto the current chart
  const renderDrawings = useCallback(() => {
    if (!chartRef.current || !candleSeriesRef.current) return;
    clearDrawingVisuals();

    drawings.forEach((d) => {
      if (d.type === 'horizontal') {
        const line = candleSeriesRef.current!.createPriceLine({
          price: d.price,
          color: 'hsl(45, 100%, 55%)',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: d.label || `H ${d.price.toFixed(2)}`,
        });
        priceLinesRef.current.push({ series: candleSeriesRef.current!, line });
      } else if (d.type === 'trendline') {
        const series = chartRef.current!.addSeries(LineSeries, {
          color: 'hsl(187, 100%, 50%)',
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        const a = d.p1.time <= d.p2.time ? d.p1 : d.p2;
        const b = d.p1.time <= d.p2.time ? d.p2 : d.p1;
        series.setData([
          { time: a.time as UTCTimestamp, value: a.price },
          { time: b.time as UTCTimestamp, value: b.price },
        ]);
        drawingSeriesRef.current.push(series);
      } else if (d.type === 'fibonacci') {
        const a = d.p1.time <= d.p2.time ? d.p1 : d.p2;
        const b = d.p1.time <= d.p2.time ? d.p2 : d.p1;
        const high = Math.max(d.p1.price, d.p2.price);
        const low = Math.min(d.p1.price, d.p2.price);
        const range = high - low;
        FIB_LEVELS.forEach((lvl) => {
          const price = high - range * lvl;
          // Horizontal segment between the two anchor times
          const lineSeries = chartRef.current!.addSeries(LineSeries, {
            color: FIB_COLORS[String(lvl)],
            lineWidth: 1,
            lineStyle: 1,
            priceLineVisible: false,
            lastValueVisible: false,
          });
          lineSeries.setData([
            { time: a.time as UTCTimestamp, value: price },
            { time: b.time as UTCTimestamp, value: price },
          ]);
          drawingSeriesRef.current.push(lineSeries);
          // Price-axis label
          const pl = candleSeriesRef.current!.createPriceLine({
            price,
            color: FIB_COLORS[String(lvl)],
            lineWidth: 1,
            lineStyle: 3,
            axisLabelVisible: true,
            title: `Fib ${(lvl * 100).toFixed(1)}%`,
          });
          priceLinesRef.current.push({ series: candleSeriesRef.current!, line: pl });
        });
      }
    });
  }, [drawings, clearDrawingVisuals]);

  // Build/rebuild chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      drawingSeriesRef.current = [];
      priceLinesRef.current = [];
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
      timeScale: { borderColor: 'hsl(220, 30%, 20%)', timeVisible: true, secondsVisible: false },
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
      .filter((c) => { if (seen.has(c.time)) return false; seen.add(c.time); return true; })
      .map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open, high: c.high, low: c.low, close: c.close,
      }));
    if (candles.length > 0) candleSeries.setData(candles);

    const volSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' }, priceScaleId: '',
    });
    volSeries.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
    volSeries.setData(
      candleData.map((c) => ({
        time: c.time as UTCTimestamp,
        value: Math.abs(c.close - c.open) * 10000 + 1000,
        color: c.close >= c.open ? 'hsla(142, 70%, 50%, 0.3)' : 'hsla(0, 75%, 55%, 0.3)',
      }))
    );

    if (detectedPatterns.length > 0) {
      const markers: SeriesMarker<Time>[] = detectedPatterns.map((p) => ({
        time: p.candleTime as UTCTimestamp,
        position: p.sentiment === 'bullish' ? 'belowBar' : 'aboveBar',
        color: p.sentiment === 'bullish' ? 'hsl(142, 70%, 50%)' : 'hsl(0, 75%, 55%)',
        shape: p.sentiment === 'bullish' ? 'arrowUp' : 'arrowDown',
        text: `${p.name} • ${p.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}`,
      }));
      try { createSeriesMarkers(candleSeries, markers); } catch (e) {
        console.warn('Pattern markers not supported:', e);
      }
    }

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

    // Render persisted drawings onto fresh chart
    renderDrawings();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
        drawingSeriesRef.current = [];
        priceLinesRef.current = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, timeframe, candleData, detectedPatterns]);

  // Re-render drawings when they change (without rebuilding the whole chart)
  useEffect(() => {
    renderDrawings();
  }, [renderDrawings]);

  // Click handler — depends on activeTool, so subscribe separately
  useEffect(() => {
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
    if (!chart || !candleSeries) return;

    const handler = (param: any) => {
      // Pattern detection click — only when no drawing tool is active
      if (activeTool === 'none') {
        if (!param?.time || detectedPatterns.length === 0) return;
        const clickedTime = param.time as number;
        const match = detectedPatterns.find((p) => Math.abs(p.candleTime - clickedTime) < 60 * 60 * 24);
        if (match) { setActivePattern(match); fetchExplanation(match); }
        return;
      }

      if (!param?.point || !param?.time) return;
      const time = param.time as number;
      const price = candleSeries.coordinateToPrice(param.point.y);
      if (price == null) return;

      if (activeTool === 'horizontal') {
        addDrawing({ type: 'horizontal', price: Number(price.toFixed(2)), label: `H ${price.toFixed(2)}` });
        toast({ title: 'Horizontal line added', description: `@ ₹${price.toFixed(2)}` });
        setActiveTool('none');
        return;
      }

      // Two-click tools (trendline, fibonacci)
      if (!pendingPointRef.current) {
        pendingPointRef.current = { time, price };
        toast({ title: `${activeTool === 'trendline' ? 'Trendline' : 'Fibonacci'}: anchor 1 set`, description: 'Click second point to complete.' });
        return;
      }
      const p1 = pendingPointRef.current;
      const p2 = { time, price };
      pendingPointRef.current = null;
      if (activeTool === 'trendline') {
        addDrawing({ type: 'trendline', p1, p2 } as Omit<TrendlineDrawing, 'id' | 'createdAt'>);
        toast({ title: 'Trendline added' });
      } else if (activeTool === 'fibonacci') {
        addDrawing({ type: 'fibonacci', p1, p2 } as Omit<FibonacciDrawing, 'id' | 'createdAt'>);
        toast({ title: 'Fibonacci retracement added' });
      }
      setActiveTool('none');
    };

    chart.subscribeClick(handler);
    return () => { chart.unsubscribeClick(handler); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool, detectedPatterns, addDrawing]);

  // Reset pending anchor when tool changes
  useEffect(() => {
    if (activeTool === 'none') pendingPointRef.current = null;
  }, [activeTool]);

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
    } finally { setAiLoading(false); }
  };

  const toolButton = (tool: DrawingTool, label: string, Icon: typeof TrendingUp) => (
    <Button
      variant={activeTool === tool ? 'secondary' : 'outline'}
      size="sm"
      onClick={() => setActiveTool(activeTool === tool ? 'none' : tool)}
      className={cn(
        'h-7 px-2 text-xs rounded-none gap-1 font-mono',
        activeTool === tool && 'bg-terminal-cyan/20 text-terminal-cyan border-terminal-cyan'
      )}
      title={label}
    >
      <Icon className="h-3 w-3" />
      <span className="hidden lg:inline">{label}</span>
    </Button>
  );

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
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded-none border border-border overflow-hidden">
              {(['1D', '1W', '1M'] as Timeframe[]).map((tf) => (
                <Button
                  key={tf} variant="ghost" size="sm"
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
          </div>
        </div>

        {/* Drawing toolbar */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mr-1">
            Draw:
          </span>
          <Button
            variant={activeTool === 'none' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setActiveTool('none')}
            className="h-7 px-2 text-xs rounded-none gap-1 font-mono"
            title="Cursor"
          >
            <MousePointer2 className="h-3 w-3" />
            <span className="hidden lg:inline">Cursor</span>
          </Button>
          {toolButton('trendline', 'Trendline', TrendingUp)}
          {toolButton('horizontal', 'Horizontal', Minus)}
          {toolButton('fibonacci', 'Fibonacci', GitBranch)}
          {drawings.length > 0 && (
            <Button
              variant="outline" size="sm"
              onClick={() => { clearDrawings(); toast({ title: 'Drawings cleared' }); }}
              className="h-7 px-2 text-xs rounded-none gap-1 font-mono text-terminal-red border-terminal-red/40 hover:bg-terminal-red/10"
              title="Clear all drawings"
            >
              <Trash2 className="h-3 w-3" />
              <span className="hidden lg:inline">Clear ({drawings.length})</span>
            </Button>
          )}
          {activeTool !== 'none' && (
            <span className="text-[10px] text-terminal-cyan font-mono ml-1 animate-pulse">
              {activeTool === 'horizontal'
                ? '→ Click chart to place line'
                : pendingPointRef.current
                ? '→ Click second point'
                : '→ Click first anchor point'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-terminal-green inline-block" />
            <span className="w-3 h-2 bg-terminal-red inline-block" />
            Candles
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={chartContainerRef}
          className={cn('w-full h-[350px]', activeTool !== 'none' && 'cursor-crosshair')}
        />

        {/* Drawings list */}
        {drawings.length > 0 && (
          <div className="px-4 py-2 border-t border-border flex flex-wrap gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mr-1 self-center">
              Saved:
            </span>
            {drawings.map((d) => (
              <button
                key={d.id}
                onClick={() => removeDrawing(d.id)}
                className="text-[10px] font-mono px-2 py-1 rounded-none border border-border bg-muted/30 hover:bg-terminal-red/20 hover:border-terminal-red/50 hover:text-terminal-red transition-colors flex items-center gap-1"
                title="Click to remove"
              >
                {d.type === 'trendline' && <TrendingUp className="h-2.5 w-2.5" />}
                {d.type === 'horizontal' && <Minus className="h-2.5 w-2.5" />}
                {d.type === 'fibonacci' && <GitBranch className="h-2.5 w-2.5" />}
                {drawingLabel(d)}
                <Trash2 className="h-2.5 w-2.5 opacity-50" />
              </button>
            ))}
          </div>
        )}

        {detectedPatterns.length > 0 && (
          <div className="px-4 py-2 border-t border-border flex flex-wrap gap-1.5">
            {detectedPatterns.map((p, i) => (
              <button
                key={`${p.name}-${i}`}
                onClick={() => { setActivePattern(p); fetchExplanation(p); }}
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

function drawingLabel(d: Drawing): string {
  if (d.type === 'horizontal') return `₹${d.price.toFixed(2)}`;
  if (d.type === 'trendline') return `Trend ${d.p1.price.toFixed(0)}→${d.p2.price.toFixed(0)}`;
  return `Fib ${Math.min(d.p1.price, d.p2.price).toFixed(0)}–${Math.max(d.p1.price, d.p2.price).toFixed(0)}`;
}
