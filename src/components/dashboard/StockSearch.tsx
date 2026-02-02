import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getStockList, type Stock } from '@/lib/stockData';
import { cn } from '@/lib/utils';

interface StockSearchProps {
  onSelectStock: (symbol: string) => void;
  selectedStock: string;
  isInWatchlist: (symbol: string) => boolean;
  onAddToWatchlist: (symbol: string) => void;
}

export function StockSearch({
  onSelectStock,
  selectedStock,
  isInWatchlist,
  onAddToWatchlist,
}: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const stocks = getStockList();
      const filtered = stocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStocks(filtered.slice(0, 8));
      setIsOpen(true);
    } else {
      setFilteredStocks([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks (RELIANCE, TCS, ZOMATO...)"
          className="pl-10 bg-secondary border-border font-mono text-sm"
        />
      </div>

      {isOpen && filteredStocks.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-border bg-popover shadow-lg terminal-glow"
        >
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              className={cn(
                'flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-secondary transition-colors',
                stock.symbol === selectedStock && 'bg-secondary'
              )}
              onClick={() => handleSelect(stock.symbol)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-primary">
                    {stock.symbol}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {stock.exchange}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {stock.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWatchlist(stock.symbol);
                }}
              >
                {isInWatchlist(stock.symbol) ? (
                  <Check className="h-4 w-4 text-terminal-green" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
