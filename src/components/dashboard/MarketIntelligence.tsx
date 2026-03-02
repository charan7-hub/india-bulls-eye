import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { getStock } from '@/lib/stockData';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface NewsSegment {
  headline: string;
  summary: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  category: 'Macro Factors' | 'Company Specific' | 'Sector Trends';
  source: string;
  sourceUrl: string;
  factors: string[];
}

const INDIA_FACTORS = [
  'RBI Interest Rates', 'Crude Oil', 'FII Flows', 'DII Flows',
  'Rupee Movement', 'Government Policy', 'Monsoon Impact', 'GDP Growth',
  'Inflation', 'Trade Deficit',
];

const sentimentConfig = {
  Positive: { color: 'bg-terminal-green/15 text-terminal-green border-terminal-green/30', icon: TrendingUp },
  Negative: { color: 'bg-terminal-red/15 text-terminal-red border-terminal-red/30', icon: TrendingDown },
  Neutral: { color: 'bg-terminal-gold/15 text-terminal-gold border-terminal-gold/30', icon: Minus },
};

const categoryColors: Record<string, string> = {
  'Macro Factors': 'bg-terminal-cyan/15 text-terminal-cyan border-terminal-cyan/30',
  'Company Specific': 'bg-terminal-blue/15 text-terminal-blue border-terminal-blue/30',
  'Sector Trends': 'bg-terminal-gold/15 text-terminal-gold border-terminal-gold/30',
};

export function MarketIntelligence({ symbol }: { symbol: string }) {
  const [segments, setSegments] = useState<NewsSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    const stock = getStock(symbol);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('stock-news', {
        body: { symbol, companyName: stock?.name || symbol },
      });

      if (fnError) throw fnError;

      if (data?.error) {
        setError(data.error);
        toast({ title: 'News Error', description: data.error, variant: 'destructive' });
      } else {
        setSegments(data?.segments || []);
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch news';
      setError(msg);
      console.error('MarketIntelligence error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [symbol]);

  const highlightFactors = (text: string) => {
    let result = text;
    const parts: (string | { text: string; isFactor: true })[] = [];
    let remaining = result;

    for (const factor of INDIA_FACTORS) {
      const regex = new RegExp(`(${factor})`, 'gi');
      if (regex.test(remaining)) {
        const split = remaining.split(regex);
        split.forEach((part) => {
          if (part.toLowerCase() === factor.toLowerCase()) {
            parts.push({ text: part, isFactor: true });
          } else if (part) {
            parts.push(part);
          }
        });
        remaining = '';
        break;
      }
    }

    if (remaining) return <span>{remaining}</span>;

    return (
      <>
        {parts.map((p, i) =>
          typeof p === 'string' ? (
            <span key={i}>{p}</span>
          ) : (
            <span
              key={i}
              className="font-semibold text-terminal-cyan underline decoration-terminal-cyan/40 underline-offset-2 cursor-pointer"
              title={`View in India Factor panel`}
            >
              {p.text}
            </span>
          )
        )}
      </>
    );
  };

  return (
    <Card className="border-border bg-card border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Newspaper className="w-4 h-4 text-terminal-cyan" />
            Live Market Intelligence
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchNews}
            disabled={loading}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 p-3 rounded-lg border border-border">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && segments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No news available for {symbol}. Try refreshing.
          </p>
        )}

        {!loading && segments.length > 0 && (
          <ScrollArea className="h-[400px] pr-2">
            <div className="space-y-3">
              {segments.map((seg, idx) => {
                const SentimentIcon = sentimentConfig[seg.sentiment]?.icon || Minus;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors space-y-2"
                  >
                    {/* Category + Sentiment */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${categoryColors[seg.category] || ''}`}
                      >
                        {seg.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 flex items-center gap-1 ${sentimentConfig[seg.sentiment]?.color || ''}`}
                      >
                        <SentimentIcon className="w-3 h-3" />
                        {seg.sentiment}
                      </Badge>
                    </div>

                    {/* Headline */}
                    <h4 className="text-sm font-semibold text-foreground leading-tight">
                      {seg.headline}
                    </h4>

                    {/* AI Summary with factor highlighting */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {highlightFactors(seg.summary)}
                    </p>

                    {/* Factors */}
                    {seg.factors && seg.factors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {seg.factors.map((f, fi) => (
                          <span
                            key={fi}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-terminal-cyan/10 text-terminal-cyan border border-terminal-cyan/20"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Source */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-muted-foreground">{seg.source}</span>
                      <a
                        href={seg.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-terminal-cyan hover:underline flex items-center gap-1"
                      >
                        Read More <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
