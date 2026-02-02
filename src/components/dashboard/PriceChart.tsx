import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, CandlestickSeries, HistogramSeries, LineSeries, UTCTimestamp } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateCandleData, getTechnicalIndicators } from '@/lib/stockData';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  symbol: string;
}

type Timeframe = '1D' | '1W' | '1M';

export function PriceChart({ symbol }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [showSMA, setShowSMA] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clear previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
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
        vertLine: {
          color: 'hsl(187, 100%, 50%)',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: 'hsl(187, 100%, 50%)',
          width: 1,
          style: 2,
        },
      },
      rightPriceScale: {
        borderColor: 'hsl(220, 30%, 20%)',
      },
      timeScale: {
        borderColor: 'hsl(220, 30%, 20%)',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: 'hsl(142, 70%, 50%)',
      downColor: 'hsl(0, 75%, 55%)',
      borderDownColor: 'hsl(0, 75%, 55%)',
      borderUpColor: 'hsl(142, 70%, 50%)',
      wickDownColor: 'hsl(0, 75%, 55%)',
      wickUpColor: 'hsl(142, 70%, 50%)',
    });

    const candleData = generateCandleData(symbol, timeframe);
    const formattedCandleData = candleData.map((d) => ({
      ...d,
      time: d.time as UTCTimestamp,
    }));
    candleSeries.setData(formattedCandleData);

    // Volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    const volumeData = candleData.map((d) => ({
      time: d.time as UTCTimestamp,
      value: d.volume,
      color: d.close >= d.open ? 'hsla(142, 70%, 50%, 0.3)' : 'hsla(0, 75%, 55%, 0.3)',
    }));
    volumeSeries.setData(volumeData);

    // SMA Lines
    if (showSMA) {
      // Calculate SMA20 data
      const sma20Data = candleData.map((d, i) => {
        if (i < 20) return null;
        const sum = candleData.slice(i - 20, i).reduce((acc, c) => acc + c.close, 0);
        return { time: d.time as UTCTimestamp, value: sum / 20 };
      }).filter(Boolean) as { time: UTCTimestamp; value: number }[];

      // Calculate SMA50 data
      const sma50Data = candleData.map((d, i) => {
        if (i < 50) return null;
        const sum = candleData.slice(i - 50, i).reduce((acc, c) => acc + c.close, 0);
        return { time: d.time as UTCTimestamp, value: sum / 50 };
      }).filter(Boolean) as { time: UTCTimestamp; value: number }[];

      if (sma20Data.length > 0) {
        const sma20Series = chart.addSeries(LineSeries, {
          color: 'hsl(187, 100%, 50%)',
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        sma20Series.setData(sma20Data);
      }

      if (sma50Data.length > 0) {
        const sma50Series = chart.addSeries(LineSeries, {
          color: 'hsl(45, 100%, 55%)',
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        sma50Series.setData(sma50Data);
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

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol, timeframe, showSMA]);

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Price Chart</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border overflow-hidden">
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
              className="h-7 px-3 text-xs"
            >
              SMA 20/50
            </Button>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-terminal-cyan"></span>
            SMA 20
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-terminal-gold"></span>
            SMA 50
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={chartContainerRef} className="w-full h-[350px]" />
      </CardContent>
    </Card>
  );
}
