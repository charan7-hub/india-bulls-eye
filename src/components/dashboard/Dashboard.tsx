import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, CandlestickChart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { StockSearch } from './StockSearch';
import { StockHeader } from './StockHeader';
import { PriceChart } from './PriceChart';
import { Watchlist } from './Watchlist';
import { AIPrediction } from './AIPrediction';
import { AICrewAnalysis } from './AICrewAnalysis';
import { FinancialHighlights } from './FinancialHighlights';
import { MarketIntelligence } from './MarketIntelligence';
import { useWatchlist } from '@/hooks/useWatchlist';

export function Dashboard() {
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useWatchlist();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('avatar_url')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [user]);

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
              <div className="w-8 h-8 bg-gradient-to-br from-terminal-cyan to-terminal-blue flex items-center justify-center">
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

          <div className="flex items-center gap-3 text-xs">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/patterns')}
            >
              <CandlestickChart className="h-3.5 w-3.5" />
              Patterns
            </Button>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-terminal-green/10 text-terminal-green">
              <span className="w-1.5 h-1.5 bg-terminal-green animate-pulse"></span>
              Market Open
            </div>
            <span className="text-muted-foreground font-mono">
              {new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <Avatar className="h-7 w-7">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Profile" />
                    ) : null}
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      <User className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Left Sidebar - Live Market News */}
        <aside className="w-72 border-r border-border bg-sidebar flex-shrink-0 overflow-y-auto terminal-scrollbar">
          <MarketIntelligence symbol={selectedStock} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto terminal-scrollbar">
          <StockHeader
            symbol={selectedStock}
            isInWatchlist={isInWatchlist(selectedStock)}
            onToggleWatchlist={handleToggleWatchlist}
          />

          <div className="p-4 space-y-4">
            <PriceChart symbol={selectedStock} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AIPrediction symbol={selectedStock} />
              <FinancialHighlights symbol={selectedStock} />
            </div>

            <AICrewAnalysis symbol={selectedStock} />
          </div>
        </main>

        {/* Right Sidebar - Watchlist */}
        <aside className="w-64 border-l border-border bg-sidebar flex-shrink-0">
          <Watchlist
            watchlist={watchlist}
            selectedStock={selectedStock}
            onSelectStock={setSelectedStock}
            onRemoveFromWatchlist={removeFromWatchlist}
          />
        </aside>
      </div>
    </div>
  );
}
