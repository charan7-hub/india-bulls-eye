import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Check, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getStockList, type Stock } from '@/lib/stockData';
import { searchDictionary, type FinancialTerm } from '@/lib/financialDictionary';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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
  const [matchedTerms, setMatchedTerms] = useState<FinancialTerm[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<FinancialTerm | null>(null);
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
      setMatchedTerms(searchDictionary(query));
      setIsOpen(true);
    } else {
      setFilteredStocks([]);
      setMatchedTerms([]);
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

  const hasResults = matchedTerms.length > 0 || filteredStocks.length > 0;

  return (
    <>
      <div className="relative w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks or financial terms..."
            className="pl-10 bg-secondary border-border font-mono text-sm"
          />
        </div>

        {isOpen && hasResults && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 border border-border bg-popover shadow-lg terminal-glow max-h-[400px] overflow-y-auto"
          >
            {/* Financial Dictionary Results */}
            {matchedTerms.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted/50 border-b border-border flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3" />
                  Financial Dictionary
                </div>
                {matchedTerms.map((term) => (
                  <div
                    key={term.term}
                    className="px-3 py-2.5 cursor-pointer hover:bg-secondary transition-colors border-b border-border/50"
                    onClick={() => setSelectedTerm(term)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-primary text-sm">
                        {term.term}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-accent text-accent-foreground font-mono">
                        DEFINITION
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {term.definition}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Results */}
            {filteredStocks.length > 0 && (
              <div>
                {matchedTerms.length > 0 && (
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted/50 border-b border-border">
                    Stocks
                  </div>
                )}
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
                        <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground">
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
        )}
      </div>

      {/* Term Detail Dialog */}
      <Dialog open={!!selectedTerm} onOpenChange={(open) => !open && setSelectedTerm(null)}>
        <DialogContent className="max-w-lg border-border bg-background">
          <DialogHeader>
            <DialogTitle className="font-mono text-xl text-primary flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {selectedTerm?.term}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {selectedTerm?.definition}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                How It Works
              </h4>
              <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                {selectedTerm?.description}
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Real-World Example
              </h4>
              <div className="bg-muted/50 border border-border p-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedTerm?.example}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
