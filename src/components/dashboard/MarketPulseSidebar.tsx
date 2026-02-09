import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface SectorData {
  id: string;
  sector_name: string;
  sector_code: string;
  sentiment_score: number;
  previous_sentiment_score: number | null;
  article_count: number;
  hot_stock_ticker: string | null;
  hot_stock_name: string | null;
}

function getSentimentColor(score: number): string {
  // Gradient from dark red (-1) through neutral (0) to dark green (+1)
  if (score <= -0.6) return 'bg-red-900/80';
  if (score <= -0.3) return 'bg-red-700/70';
  if (score <= -0.1) return 'bg-red-500/50';
  if (score < 0.1) return 'bg-muted';
  if (score < 0.3) return 'bg-emerald-500/40';
  if (score < 0.6) return 'bg-emerald-600/60';
  return 'bg-emerald-800/80';
}

function getSentimentLabel(score: number): string {
  return score >= 0.1 ? 'Bullish' : score <= -0.1 ? 'Bearish' : 'Neutral';
}

export function MarketPulseSidebar({
  onSectorClick,
  activeSector,
}: {
  onSectorClick: (sectorCode: string | null) => void;
  activeSector: string | null;
}) {
  const [sectors, setSectors] = useState<SectorData[]>([]);

  useEffect(() => {
    const fetchSectors = async () => {
      const { data } = await supabase
        .from('sector_analysis')
        .select('*')
        .order('sector_name');
      if (data) setSectors(data as unknown as SectorData[]);
    };

    fetchSectors();

    // Realtime subscription
    const channel = supabase
      .channel('sector_analysis_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sector_analysis' }, () => {
        fetchSectors();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleClick = (sectorCode: string) => {
    onSectorClick(activeSector === sectorCode ? null : sectorCode);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-3 border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-terminal-cyan flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5" />
          Sector Heatmap (AI Sentiment)
        </h2>
      </div>

      <ScrollArea className="flex-1 terminal-scrollbar">
        <TooltipProvider delayDuration={200}>
          <div className="grid grid-cols-2 gap-2 p-3">
            {sectors.map((sector) => {
              const trend = sector.previous_sentiment_score !== null
                ? sector.sentiment_score - sector.previous_sentiment_score
                : 0;
              const isActive = activeSector === sector.sector_code;
              const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;

              return (
                <Tooltip key={sector.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick(sector.sector_code)}
                      className={`
                        relative rounded-md p-2.5 text-left transition-all cursor-pointer
                        ${getSentimentColor(sector.sentiment_score)}
                        ${isActive ? 'ring-2 ring-terminal-cyan ring-offset-1 ring-offset-background' : 'hover:ring-1 hover:ring-border'}
                      `}
                    >
                      {/* Sector name */}
                      <div className="text-[11px] font-semibold text-foreground leading-tight truncate">
                        {sector.sector_name.replace('Nifty ', '')}
                      </div>

                      {/* Score + Trend arrow */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-xs font-mono font-bold text-foreground">
                          {sector.sentiment_score > 0 ? '+' : ''}{Number(sector.sentiment_score).toFixed(2)}
                        </span>
                        <TrendIcon className={`w-3 h-3 ${trend >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`} />
                      </div>

                      {/* Hot stock */}
                      {sector.hot_stock_ticker && (
                        <div className="mt-1.5 text-[9px] text-muted-foreground truncate">
                          Driven by: <span className="font-semibold text-foreground">{sector.hot_stock_ticker}</span>
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px]">
                    <p className="text-xs font-semibold">{sector.sector_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current Vibe: <span className={sector.sentiment_score >= 0.1 ? 'text-terminal-green' : sector.sentiment_score <= -0.1 ? 'text-terminal-red' : 'text-terminal-gold'}>
                        {getSentimentLabel(sector.sentiment_score)}
                      </span> based on {sector.article_count} news articles
                    </p>
                    {sector.hot_stock_name && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Top mover: {sector.hot_stock_name}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </ScrollArea>
    </div>
  );
}
