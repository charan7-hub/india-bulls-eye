import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShieldCheck, BarChart3, Volume2, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { categories, CandleSvgProps, CandlestickPattern } from '@/lib/candlestickPatterns';

function CandleSvg({ candles }: { candles: CandleSvgProps[] }) {
  const w = 100;
  const h = 120;
  const candleWidth = candles.length > 3 ? 12 : 18;
  const gap = w / (candles.length + 1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32 mx-auto">
      <rect width={w} height={h} fill="hsl(220 35% 12%)" />
      {candles.map((c, i) => {
        const x = gap * (i + 1) - candleWidth / 2;
        const bodyColor = c.bullish ? 'hsl(142 70% 50%)' : 'hsl(0 75% 55%)';
        const wickColor = 'hsl(215 20% 55%)';
        const wickX = gap * (i + 1);
        return (
          <g key={i}>
            <line x1={wickX} y1={c.wickTop} x2={wickX} y2={c.wickBottom} stroke={wickColor} strokeWidth={1.5} />
            <rect
              x={x}
              y={Math.min(c.bodyTop, c.bodyBottom)}
              width={candleWidth}
              height={Math.max(Math.abs(c.bodyTop - c.bodyBottom), 2)}
              fill={bodyColor}
              stroke={bodyColor}
              strokeWidth={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}

const sentimentColor: Record<string, string> = {
  'Strong Bullish': 'bg-terminal-green/20 text-terminal-green border-terminal-green/30',
  'Weak Bullish': 'bg-terminal-green/10 text-terminal-green/80 border-terminal-green/20',
  'Strong Bearish': 'bg-terminal-red/20 text-terminal-red border-terminal-red/30',
  'Weak Bearish': 'bg-terminal-red/10 text-terminal-red/80 border-terminal-red/20',
  Neutral: 'bg-terminal-gold/20 text-terminal-gold border-terminal-gold/30',
};

function PatternCard({ pattern }: { pattern: CandlestickPattern }) {
  return (
    <div className="border border-border bg-card overflow-hidden">
      <CandleSvg candles={pattern.candles} />
      <div className="p-4 space-y-3">
        {/* Name & Sentiment */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-foreground text-sm">{pattern.name}</h3>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border whitespace-nowrap ${sentimentColor[pattern.sentiment] || sentimentColor['Neutral']}`}
          >
            {pattern.sentiment}
          </span>
        </div>

        {/* Type badge */}
        <span className={`inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
          pattern.type === 'continuation'
            ? 'bg-terminal-blue/15 text-terminal-blue border-terminal-blue/30'
            : 'bg-primary/15 text-primary border-primary/30'
        }`}>
          {pattern.type}
        </span>

        {/* Psychology */}
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-terminal-gold mb-1">
            What Happened?
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{pattern.psychology}</p>
        </div>

        {/* Trading Rules */}
        <div className="border-t border-border pt-3 space-y-2">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
            Trading Rules
          </h4>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              <span className="text-terminal-green font-semibold">Entry:</span> {pattern.entry}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="text-terminal-red font-semibold">Stop Loss:</span> {pattern.stopLoss}
            </p>
          </div>
        </div>

        {/* Confirmation */}
        <div className="border-t border-border pt-3">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-terminal-blue mb-1">
            Confirmation Required
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{pattern.confirmation}</p>
        </div>

        {/* Indian Market Note */}
        {pattern.indianNote && (
          <div className="border-t border-terminal-gold/20 pt-3">
            <p className="text-[11px] text-terminal-gold/90 leading-relaxed italic">{pattern.indianNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}

type FilterType = 'all' | 'reversal' | 'continuation';

export default function Patterns() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const navigate = useNavigate();

  const allPatterns = categories.flatMap((c) => c.patterns);

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      patterns: cat.patterns.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sentiment.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || p.type === filter;
        return matchesSearch && matchesFilter;
      }),
    }))
    .filter((cat) => cat.patterns.length > 0);

  const totalFiltered = filteredCategories.reduce((sum, c) => sum + c.patterns.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-sm font-bold text-foreground">Candlestick Patterns Library</h1>
            <p className="text-xs text-muted-foreground">
              {totalFiltered} of {allPatterns.length} patterns
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search + Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or sentiment… (e.g. Hammer, Strong Bullish)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Filter:</span>
                {(['all', 'reversal', 'continuation'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1 border transition-colors ${
                      filter === f
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            {filteredCategories.map((cat) => (
              <section key={cat.title}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-primary whitespace-nowrap">
                    {cat.title}
                  </h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {cat.patterns.map((p) => (
                    <PatternCard key={p.name} pattern={p} />
                  ))}
                </div>
              </section>
            ))}

            {totalFiltered === 0 && (
              <div className="text-center py-20 text-muted-foreground text-sm">
                No patterns match "{search}"
              </div>
            )}
          </div>

          {/* Cheat Sheet Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="border border-border bg-card p-4 space-y-4 lg:sticky lg:top-20">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                Candle Cheat Sheet
              </h2>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Before trading any candlestick pattern, always verify these three rules:
              </p>

              {/* Rule 1 */}
              <div className="border border-border p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-terminal-cyan shrink-0" />
                  <h3 className="text-xs font-bold text-foreground">1. Location</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  A pattern is only meaningful at key <span className="text-terminal-green font-semibold">support</span> or{' '}
                  <span className="text-terminal-red font-semibold">resistance</span> levels. A Hammer in the middle of nowhere is just noise.
                </p>
              </div>

              {/* Rule 2 */}
              <div className="border border-border p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-terminal-gold shrink-0" />
                  <h3 className="text-xs font-bold text-foreground">2. Size Matters</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Compare the pattern candle to recent candles. A tiny Engulfing after massive candles is weak. The pattern should{' '}
                  <span className="text-terminal-gold font-semibold">stand out</span> relative to its context.
                </p>
              </div>

              {/* Rule 3 */}
              <div className="border border-border p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-terminal-blue shrink-0" />
                  <h3 className="text-xs font-bold text-foreground">3. Volume Confirmation</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  High volume on the signal candle = conviction. Low volume = suspect. Always check if{' '}
                  <span className="text-terminal-blue font-semibold">volume supports</span> the narrative the candle is telling.
                </p>
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-[10px] text-muted-foreground italic">
                  "A candle without context is just a shape on a chart. Location + Size + Volume = Edge."
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
