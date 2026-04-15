import { TrendingUp, TrendingDown, Plus, Star, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getStock, formatPrice, formatPercentage } from '@/lib/stockData';
import { LivePriceData } from '@/hooks/useLivePrice';
import { cn } from '@/lib/utils';

interface StockHeaderProps {
  symbol: string;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  liveData: LivePriceData | null;
  liveLoading: boolean;
  liveError: string | null;
}

export function StockHeader({
  symbol,
  isInWatchlist,
  onToggleWatchlist,
  liveData: live,
  liveLoading: loading,
  liveError: error,
}: StockHeaderProps) {
  const stock = getStock(symbol);

  if (!stock) {
    return (
      <div className="p-4 border-b border-border">
        <p className="text-muted-foreground">Select a stock to view details</p>
      </div>
    );
  }

  const currentPrice = live?.extracted_price ?? stock.currentPrice;
  const priceChange = live?.price_movement
    ? live.price_movement.value
    : stock.currentPrice - stock.previousClose;
  const priceChangePercent = live?.price_movement
    ? live.price_movement.percentage
    : ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100;
  const isPositive = priceChange >= 0;
  const marketStatus = live?.market_trading || live?.market_closed || null;

  return (
    <div className="p-4 border-b border-border bg-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono text-primary">
              {stock.symbol}
            </h1>
            <span className="text-xs px-2 py-1 rounded-none bg-muted text-muted-foreground font-medium">
              {stock.exchange}
            </span>
            <span className="text-xs px-2 py-1 rounded-none bg-secondary text-secondary-foreground">
              {stock.sector}
            </span>
            {!loading && !error && live && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-none bg-terminal-green/10 text-terminal-green font-mono">
                <span className="w-1.5 h-1.5 bg-terminal-green animate-pulse" />
                LIVE
              </span>
            )}
            {error && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-none bg-destructive/10 text-destructive font-mono">
                <WifiOff className="h-3 w-3" />
                OFFLINE
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {live?.title || stock.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {marketStatus && (
            <span
              className={cn(
                'text-[10px] px-2 py-1 rounded-none font-mono',
                marketStatus.toLowerCase().includes('open') || marketStatus.toLowerCase().includes('pre')
                  ? 'bg-terminal-green/10 text-terminal-green'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {marketStatus}
            </span>
          )}
          <Button
            variant={isInWatchlist ? 'secondary' : 'outline'}
            size="sm"
            onClick={onToggleWatchlist}
            className="gap-1.5 rounded-none"
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
      </div>

      <div className="flex items-end gap-6 mt-4">
        <div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-40 rounded-none animate-pulse" />
              <Skeleton className="h-5 w-28 rounded-none animate-pulse" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold font-mono">
                {formatPrice(currentPrice)}
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
            </>
          )}
        </div>

        <div className="flex gap-6 text-sm">
          {loading ? (
            <>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16 rounded-none" />
                <Skeleton className="h-4 w-32 rounded-none" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16 rounded-none" />
                <Skeleton className="h-4 w-32 rounded-none" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-12 rounded-none" />
                <Skeleton className="h-4 w-24 rounded-none" />
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
