import { TrendingUp, TrendingDown, Plus, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStock, formatPrice, formatPercentage } from '@/lib/stockData';
import { cn } from '@/lib/utils';

interface StockHeaderProps {
  symbol: string;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
}

export function StockHeader({
  symbol,
  isInWatchlist,
  onToggleWatchlist,
}: StockHeaderProps) {
  const stock = getStock(symbol);

  if (!stock) {
    return (
      <div className="p-4 border-b border-border">
        <p className="text-muted-foreground">Select a stock to view details</p>
      </div>
    );
  }

  const priceChange = stock.currentPrice - stock.previousClose;
  const priceChangePercent = (priceChange / stock.previousClose) * 100;
  const isPositive = priceChange >= 0;

  return (
    <div className="p-4 border-b border-border bg-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono text-primary">
              {stock.symbol}
            </h1>
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground font-medium">
              {stock.exchange}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
              {stock.sector}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{stock.name}</p>
        </div>

        <Button
          variant={isInWatchlist ? 'secondary' : 'outline'}
          size="sm"
          onClick={onToggleWatchlist}
          className="gap-1.5"
        >
          {isInWatchlist ? (
            <>
              <Star className="h-4 w-4 fill-terminal-gold text-terminal-gold" />
              <span>Watching</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add to Watchlist</span>
            </>
          )}
        </Button>
      </div>

      <div className="flex items-end gap-6 mt-4">
        <div>
          <p className="text-3xl font-bold font-mono">
            {formatPrice(stock.currentPrice)}
          </p>
          <div
            className={cn(
              'flex items-center gap-1.5 mt-1 font-mono text-sm',
              isPositive ? 'text-terminal-green' : 'text-terminal-red'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{formatPrice(Math.abs(priceChange)).replace('₹', '')}</span>
            <span>({formatPercentage(priceChangePercent)})</span>
          </div>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Day Range</p>
            <p className="font-mono">
              {formatPrice(stock.dayLow)} - {formatPrice(stock.dayHigh)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">52W Range</p>
            <p className="font-mono">
              {formatPrice(stock.weekLow52)} - {formatPrice(stock.weekHigh52)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Volume</p>
            <p className="font-mono">
              {stock.volume.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
