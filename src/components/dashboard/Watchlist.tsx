import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getStock, formatPrice } from '@/lib/stockData';
import { cn } from '@/lib/utils';

interface WatchlistProps {
  watchlist: string[];
  selectedStock: string;
  onSelectStock: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
}

export function Watchlist({
  watchlist,
  selectedStock,
  onSelectStock,
  onRemoveFromWatchlist,
}: WatchlistProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h2 className="font-semibold text-sm text-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-terminal-cyan animate-pulse"></span>
          My Watchlist
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {watchlist.length} stocks
        </p>
      </div>

      <ScrollArea className="flex-1 terminal-scrollbar">
        <div className="p-2 space-y-1">
          {watchlist.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No stocks in watchlist.
              <br />
              Search and add stocks above.
            </p>
          ) : (
            watchlist.map((symbol) => {
              const stock = getStock(symbol);
              if (!stock) return null;

              const priceChange =
                ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100;
              const isPositive = priceChange >= 0;
              const isSelected = symbol === selectedStock;

              return (
                <div
                  key={symbol}
                  onClick={() => onSelectStock(symbol)}
                  className={cn(
                    'group flex items-center justify-between p-2 rounded cursor-pointer transition-all',
                    isSelected
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-secondary border border-transparent'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'font-mono font-semibold text-sm',
                          isSelected ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {symbol}
                      </span>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3 text-terminal-green" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-terminal-red" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {stock.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-mono text-xs font-medium">
                        {formatPrice(stock.currentPrice)}
                      </p>
                      <p
                        className={cn(
                          'font-mono text-xs',
                          isPositive ? 'text-terminal-green' : 'text-terminal-red'
                        )}
                      >
                        {isPositive ? '+' : ''}
                        {priceChange.toFixed(2)}%
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(symbol);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
