import { useState } from 'react';
import { IndianRupee, TrendingUp, Percent, Scale, PiggyBank, ArrowUpCircle, ArrowDownCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStock, formatIndianNumber, formatPrice } from '@/lib/stockData';
import { cn } from '@/lib/utils';
import { MetricExplanationDialog, MetricType } from './MetricExplanationDialog';

interface FinancialHighlightsProps {
  symbol: string;
}

export function FinancialHighlights({ symbol }: FinancialHighlightsProps) {
  const stock = getStock(symbol);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null);
  const [currentMetricValue, setCurrentMetricValue] = useState<string>('');

  if (!stock) {
    return null;
  }

  const peVsIndustry = stock.peRatio - stock.industryPE;
  const isUndervalued = peVsIndustry < 0;

  const handleMetricClick = (metricType: MetricType, value: string) => {
    setSelectedMetric(metricType);
    setCurrentMetricValue(value);
    setDialogOpen(true);
  };

  // Calculate distance from ATH/ATL
  const distanceFromATH = ((stock.allTimeHigh - stock.currentPrice) / stock.allTimeHigh) * 100;
  const distanceFromATL = ((stock.currentPrice - stock.allTimeLow) / stock.allTimeLow) * 100;

  const metrics = [
    {
      label: 'TTM P/E Ratio',
      value: stock.peRatio > 0 ? stock.peRatio.toFixed(1) : 'N/A',
      subtext: `Industry: ${stock.industryPE.toFixed(1)}`,
      icon: TrendingUp,
      highlight: stock.peRatio > 0 && stock.peRatio < stock.industryPE,
      metricType: 'pe-ratio' as MetricType,
      clickable: true,
      comparison: stock.peRatio > 0 ? (
        <span
          className={cn(
            'text-xs',
            isUndervalued ? 'text-terminal-green' : 'text-terminal-red'
          )}
        >
          {isUndervalued ? 'Undervalued' : 'Premium'} ({Math.abs(peVsIndustry).toFixed(1)})
        </span>
      ) : null,
    },
    {
      label: 'Dividend Yield',
      value: `${stock.dividendYield.toFixed(2)}%`,
      subtext: stock.dividendYield > 0 ? 'Annual yield' : 'No dividend',
      icon: Percent,
      highlight: stock.dividendYield > 1.5,
      metricType: 'dividend-yield' as MetricType,
      clickable: true,
    },
    {
      label: 'Debt/Equity',
      value: stock.debtToEquity.toFixed(2),
      subtext:
        stock.debtToEquity < 0.5
          ? 'Low debt'
          : stock.debtToEquity < 1.5
          ? 'Moderate'
          : 'High leverage',
      icon: Scale,
      highlight: stock.debtToEquity < 0.5,
      metricType: 'debt-equity' as MetricType,
      clickable: true,
    },
    {
      label: 'Market Cap',
      value: formatIndianNumber(stock.marketCap * 10000000).replace('₹', ''),
      subtext: 'In Crores',
      icon: PiggyBank,
      prefix: '₹',
      metricType: 'market-cap' as MetricType,
      clickable: true,
    },
    {
      label: 'Historical Peak',
      value: formatPrice(stock.allTimeHigh).replace('₹', ''),
      subtext: stock.athDate,
      icon: ArrowUpCircle,
      prefix: '₹',
      metricType: 'ath' as MetricType,
      clickable: true,
      highlight: distanceFromATH < 10,
      comparison: (
        <span className={cn(
          'text-xs',
          distanceFromATH < 10 ? 'text-terminal-green' : 'text-terminal-gold'
        )}>
          {distanceFromATH.toFixed(1)}% below
        </span>
      ),
    },
    {
      label: 'Historical Floor',
      value: formatPrice(stock.allTimeLow).replace('₹', ''),
      subtext: stock.atlDate,
      icon: ArrowDownCircle,
      prefix: '₹',
      metricType: 'atl' as MetricType,
      clickable: true,
      comparison: (
        <span className="text-xs text-terminal-green">
          {distanceFromATL.toFixed(0)}% above
        </span>
      ),
    },
  ];

  return (
    <>
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-terminal-gold" />
            Financial Highlights
            <span className="ml-auto text-xs text-muted-foreground font-normal flex items-center gap-1">
              <Info className="h-3 w-3" />
              Click for details
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <button
                key={metric.label}
                onClick={() => handleMetricClick(metric.metricType, `${metric.prefix || ''}${metric.value}`)}
                className={cn(
                  'p-3 rounded-lg bg-secondary/50 border border-border text-left transition-all',
                  'hover:bg-secondary hover:border-terminal-cyan/50 hover:shadow-md hover:shadow-terminal-cyan/10',
                  'focus:outline-none focus:ring-2 focus:ring-terminal-cyan/50',
                  metric.highlight && 'border-terminal-green/50'
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <metric.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <p className="text-lg font-bold font-mono">
                  {metric.prefix || ''}
                  {metric.value}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{metric.subtext}</span>
                  {metric.comparison}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              All figures based on trailing twelve months (TTM). Market cap in ₹ Crores. ATH/ATL are inflation-adjusted.
            </p>
          </div>
        </CardContent>
      </Card>

      <MetricExplanationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        metric={selectedMetric}
        currentValue={currentMetricValue}
        stockName={stock.name}
      />
    </>
  );
}
