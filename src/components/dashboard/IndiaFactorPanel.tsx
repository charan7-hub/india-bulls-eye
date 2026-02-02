import { TrendingUp, TrendingDown, Minus, Droplets, Building2, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIndiaFactorData, formatIndianNumber } from '@/lib/stockData';
import { cn } from '@/lib/utils';

interface IndiaFactorPanelProps {
  symbol: string;
}

export function IndiaFactorPanel({ symbol }: IndiaFactorPanelProps) {
  const data = getIndiaFactorData(symbol);

  // Calculate FII/DII sentiment score (-100 to 100)
  const netFlow = data.fiiNetFlow + data.diiNetFlow;
  const sentimentScore = Math.min(100, Math.max(-100, netFlow / 50));

  const getSentimentLabel = (score: number) => {
    if (score > 60) return 'Strong Buy';
    if (score > 20) return 'Buy';
    if (score > -20) return 'Neutral';
    if (score > -60) return 'Sell';
    return 'Strong Sell';
  };

  const getSentimentColor = (score: number) => {
    if (score > 20) return 'text-terminal-green';
    if (score < -20) return 'text-terminal-red';
    return 'text-terminal-gold';
  };

  const getCorrelationLabel = (corr: number) => {
    if (corr > 0.7) return 'High';
    if (corr > 0.4) return 'Moderate';
    if (corr > 0) return 'Low';
    return 'Inverse';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h2 className="font-semibold text-sm text-terminal-gold flex items-center gap-2">
          <Activity className="h-4 w-4" />
          India Factor
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Market intelligence for {symbol}
        </p>
      </div>

      <div className="flex-1 p-3 space-y-4 overflow-y-auto terminal-scrollbar">
        {/* FII/DII Sentiment Gauge */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              FII/DII Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-terminal-red">Sell</span>
              <span
                className={cn(
                  'text-sm font-bold',
                  getSentimentColor(sentimentScore)
                )}
              >
                {getSentimentLabel(sentimentScore)}
              </span>
              <span className="text-xs text-terminal-green">Buy</span>
            </div>

            {/* Gauge Bar */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 bg-gradient-to-r from-terminal-red via-terminal-gold to-terminal-green"
                style={{ width: '100%' }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full border-2 border-background shadow-lg transition-all"
                style={{
                  left: `calc(${((sentimentScore + 100) / 200) * 100}% - 6px)`,
                }}
              />
            </div>

            <div className="flex justify-between mt-3 text-xs">
              <div>
                <p className="text-muted-foreground">FII Net</p>
                <p
                  className={cn(
                    'font-mono font-medium',
                    data.fiiNetFlow >= 0 ? 'text-terminal-green' : 'text-terminal-red'
                  )}
                >
                  {data.fiiNetFlow >= 0 ? '+' : ''}
                  {formatIndianNumber(Math.abs(data.fiiNetFlow * 10000000))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">DII Net</p>
                <p
                  className={cn(
                    'font-mono font-medium',
                    data.diiNetFlow >= 0 ? 'text-terminal-green' : 'text-terminal-red'
                  )}
                >
                  {data.diiNetFlow >= 0 ? '+' : ''}
                  {formatIndianNumber(Math.abs(data.diiNetFlow * 10000000))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nifty/Sensex Correlation */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              Index Correlation
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Nifty 50</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terminal-cyan rounded-full"
                    style={{ width: `${Math.abs(data.niftyCorrelation) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-sm font-medium text-terminal-cyan">
                  {data.niftyCorrelation.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Sensex</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terminal-gold rounded-full"
                    style={{ width: `${Math.abs(data.sensexCorrelation) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-sm font-medium text-terminal-gold">
                  {data.sensexCorrelation.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {getCorrelationLabel(data.niftyCorrelation)} correlation with broader market
            </p>
          </CardContent>
        </Card>

        {/* Macro Impact */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Macro Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-1.5">
                <span className="text-base">🏛️</span> RBI Policy
              </span>
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded',
                  data.rbiSentiment === 'hawkish' && 'bg-terminal-red/20 text-terminal-red',
                  data.rbiSentiment === 'neutral' && 'bg-terminal-gold/20 text-terminal-gold',
                  data.rbiSentiment === 'dovish' && 'bg-terminal-green/20 text-terminal-green'
                )}
              >
                {data.rbiSentiment.charAt(0).toUpperCase() + data.rbiSentiment.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                Crude Oil
              </span>
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1',
                  data.crudeImpact === 'positive' && 'bg-terminal-green/20 text-terminal-green',
                  data.crudeImpact === 'neutral' && 'bg-muted text-muted-foreground',
                  data.crudeImpact === 'negative' && 'bg-terminal-red/20 text-terminal-red'
                )}
              >
                {data.crudeImpact === 'positive' && <TrendingUp className="h-3 w-3" />}
                {data.crudeImpact === 'neutral' && <Minus className="h-3 w-3" />}
                {data.crudeImpact === 'negative' && <TrendingDown className="h-3 w-3" />}
                {data.crudeImpact.charAt(0).toUpperCase() + data.crudeImpact.slice(1)}
              </span>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "{data.macroSummary}"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
