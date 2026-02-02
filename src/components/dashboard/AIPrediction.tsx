import { Brain, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTechnicalIndicators } from '@/lib/stockData';
import { cn } from '@/lib/utils';

interface AIPredictionProps {
  symbol: string;
}

export function AIPrediction({ symbol }: AIPredictionProps) {
  const indicators = getTechnicalIndicators(symbol);
  const { prediction } = indicators;

  const getDirectionIcon = () => {
    switch (prediction.direction) {
      case 'bullish':
        return <TrendingUp className="h-6 w-6 text-terminal-green" />;
      case 'bearish':
        return <TrendingDown className="h-6 w-6 text-terminal-red" />;
      default:
        return <Minus className="h-6 w-6 text-terminal-gold" />;
    }
  };

  const getDirectionColor = () => {
    switch (prediction.direction) {
      case 'bullish':
        return 'text-terminal-green';
      case 'bearish':
        return 'text-terminal-red';
      default:
        return 'text-terminal-gold';
    }
  };

  const getMeterPosition = () => {
    switch (prediction.direction) {
      case 'bullish':
        return 50 + (prediction.confidence / 2) * 0.5;
      case 'bearish':
        return 50 - (prediction.confidence / 2) * 0.5;
      default:
        return 50;
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4 text-terminal-cyan" />
          AI Prediction Engine
          <span className="text-xs font-normal text-muted-foreground">
            (Rule-Based)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">
            Next Week's Probability
          </p>
          <div className="flex items-center justify-center gap-3">
            {getDirectionIcon()}
            <span className={cn('text-3xl font-bold font-mono', getDirectionColor())}>
              {prediction.direction.toUpperCase()}
            </span>
          </div>
          <p className="text-lg font-mono font-semibold mt-1">
            {prediction.confidence}% confidence
          </p>
        </div>

        {/* Bullish/Bearish Meter */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-terminal-red">Bearish</span>
            <span className="text-terminal-green">Bullish</span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-terminal-red to-terminal-gold"
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-terminal-gold to-terminal-green"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-foreground rounded-full border-2 border-background shadow-lg transition-all"
              style={{
                left: `calc(${getMeterPosition()}% - 8px)`,
              }}
            />
          </div>
        </div>

        {/* Key Reason Card */}
        <div className="bg-secondary/50 rounded-lg p-3 border border-border">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-terminal-cyan mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Key Reason</p>
              <p className="text-sm font-medium">{prediction.keyReason}</p>
            </div>
          </div>
        </div>

        {/* Technical Indicators Summary */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">RSI</p>
            <p
              className={cn(
                'font-mono text-sm font-medium',
                indicators.rsi < 30 && 'text-terminal-green',
                indicators.rsi > 70 && 'text-terminal-red',
                indicators.rsi >= 30 && indicators.rsi <= 70 && 'text-foreground'
              )}
            >
              {indicators.rsi}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">MACD</p>
            <p
              className={cn(
                'font-mono text-sm font-medium',
                indicators.macd.histogram > 0 ? 'text-terminal-green' : 'text-terminal-red'
              )}
            >
              {indicators.macd.histogram > 0 ? '+' : ''}
              {indicators.macd.histogram.toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">SMA Cross</p>
            <p
              className={cn(
                'font-mono text-sm font-medium',
                indicators.sma20 > indicators.sma50 ? 'text-terminal-green' : 'text-terminal-red'
              )}
            >
              {indicators.sma20 > indicators.sma50 ? 'Above' : 'Below'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
