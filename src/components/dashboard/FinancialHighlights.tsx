import { IndianRupee, TrendingUp, TrendingDown, Percent, Scale, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStock, formatIndianNumber } from '@/lib/stockData';
import { cn } from '@/lib/utils';

interface FinancialHighlightsProps {
  symbol: string;
}

export function FinancialHighlights({ symbol }: FinancialHighlightsProps) {
  const stock = getStock(symbol);

  if (!stock) {
    return null;
  }

  const peVsIndustry = stock.peRatio - stock.industryPE;
  const isUndervalued = peVsIndustry < 0;

  const metrics = [
    {
      label: 'TTM P/E Ratio',
      value: stock.peRatio > 0 ? stock.peRatio.toFixed(1) : 'N/A',
      subtext: `Industry: ${stock.industryPE.toFixed(1)}`,
      icon: TrendingUp,
      highlight: stock.peRatio > 0 && stock.peRatio < stock.industryPE,
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
    },
    {
      label: 'Market Cap',
      value: formatIndianNumber(stock.marketCap * 10000000).replace('₹', ''),
      subtext: 'In Crores',
      icon: PiggyBank,
      prefix: '₹',
    },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-terminal-gold" />
          Financial Highlights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={cn(
                'p-3 rounded-lg bg-secondary/50 border border-border',
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
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            All figures based on trailing twelve months (TTM). Market cap in ₹ Crores.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
