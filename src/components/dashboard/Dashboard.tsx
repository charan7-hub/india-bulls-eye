import { useState } from 'react';
import { StockSearch } from './StockSearch';
import { StockHeader } from './StockHeader';
import { PriceChart } from './PriceChart';
import { Watchlist } from './Watchlist';
import { IndiaFactorPanel } from './IndiaFactorPanel';
import { AIPrediction } from './AIPrediction';
import { FinancialHighlights } from './FinancialHighlights';
import { MarketIntelligence } from './MarketIntelligence';
import { useWatchlist } from '@/hooks/useWatchlist';

export function Dashboard() {
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useWatchlist();

  const handleToggleWatchlist = () => {
    if (isInWatchlist(selectedStock)) {
      removeFromWatchlist(selectedStock);
    } else {
      addToWatchlist(selectedStock);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Search */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-terminal-cyan to-terminal-blue flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">₹</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">StockPulse</h1>
                <p className="text-xs text-muted-foreground">NSE • BSE</p>
              </div>
            </div>
          </div>

          <StockSearch
            onSelectStock={setSelectedStock}
            selectedStock={selectedStock}
            isInWatchlist={isInWatchlist}
            onAddToWatchlist={addToWatchlist}
          />

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-terminal-green/10 text-terminal-green">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse"></span>
              Market Open
            </div>
            <span className="text-muted-foreground font-mono">
              {new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Left Sidebar - Watchlist */}
        <aside className="w-64 border-r border-border bg-sidebar flex-shrink-0">
          <Watchlist
            watchlist={watchlist}
            selectedStock={selectedStock}
            onSelectStock={setSelectedStock}
            onRemoveFromWatchlist={removeFromWatchlist}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto terminal-scrollbar">
          <StockHeader
            symbol={selectedStock}
            isInWatchlist={isInWatchlist(selectedStock)}
            onToggleWatchlist={handleToggleWatchlist}
          />

          <div className="p-4 space-y-4">
            {/* Chart */}
            <PriceChart symbol={selectedStock} />

            {/* Analysis Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AIPrediction symbol={selectedStock} />
              <FinancialHighlights symbol={selectedStock} />
            </div>

            {/* Live Market Intelligence */}
            <MarketIntelligence symbol={selectedStock} />
          </div>
        </main>

        {/* Right Sidebar - India Factor */}
        <aside className="w-72 border-l border-border bg-sidebar flex-shrink-0">
          <IndiaFactorPanel symbol={selectedStock} />
        </aside>
      </div>
    </div>
  );
}
