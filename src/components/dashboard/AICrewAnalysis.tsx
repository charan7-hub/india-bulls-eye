import { useState } from 'react';
import { Brain, Users, TrendingUp, BarChart3, MessageSquare, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getStock, getTechnicalIndicators } from '@/lib/stockData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AgentResult {
  agent: string;
  analysis: string;
}

interface AnalysisResult {
  symbol: string;
  agents: AgentResult[];
  synthesis: string;
  timestamp: string;
}

const agentMeta: Record<string, { icon: typeof Brain; color: string; label: string }> = {
  'Technical Analyst': { icon: TrendingUp, color: 'text-terminal-cyan', label: 'Technical' },
  'Fundamental Analyst': { icon: BarChart3, color: 'text-terminal-gold', label: 'Fundamental' },
  'Sentiment Analyst': { icon: MessageSquare, color: 'text-terminal-blue', label: 'Sentiment' },
};

function AgentCard({ agent, analysis }: AgentResult) {
  const meta = agentMeta[agent] || { icon: Brain, color: 'text-primary', label: agent };
  const Icon = meta.icon;

  return (
    <div className="border border-border bg-secondary/30 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${meta.color}`} />
        <h4 className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>
          {meta.label} Agent
        </h4>
      </div>
      <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
        {analysis}
      </div>
    </div>
  );
}

export function AICrewAnalysis({ symbol }: { symbol: string }) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setResult(null);

    try {
      const stock = getStockData(symbol);
      const indicators = getTechnicalIndicators(symbol);

      const { data, error } = await supabase.functions.invoke('stock-analysis', {
        body: {
          symbol,
          stockData: stock
            ? {
                ...stock,
                rsi: indicators.rsi,
                macdHistogram: indicators.macd.histogram,
              }
            : null,
        },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: 'Analysis Failed',
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      setResult(data as AnalysisResult);
      setExpanded(true);
    } catch (err: any) {
      console.error('AI Crew error:', err);
      toast({
        title: 'Analysis Error',
        description: err?.message || 'Failed to run AI analysis. Try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-terminal-cyan" />
            AI Crew Analysis
            <span className="text-[10px] font-normal text-muted-foreground">
              (Multi-Agent)
            </span>
          </CardTitle>
          <Button
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={runAnalysis}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {loading ? 'Analyzing…' : result ? 'Re-analyze' : 'Run Crew'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!result && !loading && (
          <div className="text-center py-6 space-y-2">
            <Users className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground">
              Launch 3 AI agents — Technical, Fundamental & Sentiment — to analyze{' '}
              <span className="text-foreground font-semibold">{symbol}</span> in parallel.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8 space-y-3">
            <div className="flex justify-center gap-4">
              {['Technical', 'Fundamental', 'Sentiment'].map((name) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 border border-border bg-secondary/50 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-terminal-cyan" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground animate-pulse">
              AI agents analyzing {symbol}…
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            {/* Synthesis — always visible */}
            <div className="border border-terminal-cyan/30 bg-terminal-cyan/5 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-terminal-cyan" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-terminal-cyan">
                  Chief Strategist Verdict
                </h4>
              </div>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {result.synthesis}
              </div>
            </div>

            {/* Toggle agent details */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs text-muted-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Hide' : 'Show'} Agent Reports
            </Button>

            {expanded && (
              <div className="space-y-2">
                {result.agents.map((a) => (
                  <AgentCard key={a.agent} {...a} />
                ))}
              </div>
            )}

            <div className="flex items-center gap-1.5 pt-1">
              <AlertTriangle className="h-3 w-3 text-terminal-gold" />
              <p className="text-[10px] text-muted-foreground">
                AI analysis is for educational purposes only. Not financial advice.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
