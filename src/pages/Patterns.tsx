import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShieldCheck, BarChart3, Volume2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CandleSvgProps {
  bodyTop: number;
  bodyBottom: number;
  wickTop: number;
  wickBottom: number;
  bullish: boolean;
}

interface CandlestickPattern {
  name: string;
  sentiment: string;
  psychology: string;
  entry: string;
  stopLoss: string;
  confirmation: string;
  candles: CandleSvgProps[];
}

interface PatternCategory {
  title: string;
  patterns: CandlestickPattern[];
}

function CandleSvg({ candles }: { candles: CandleSvgProps[] }) {
  const w = 100;
  const h = 120;
  const candleWidth = 18;
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

const categories: PatternCategory[] = [
  {
    title: 'Single Candle Patterns',
    patterns: [
      {
        name: 'Hammer',
        sentiment: 'Strong Bullish',
        psychology: 'Sellers pushed price sharply lower, but buyers stepped in aggressively and drove it back near the open. Buyer strength emerged at the bottom.',
        entry: 'Enter long when the next candle closes above the Hammer high.',
        stopLoss: 'Place stop-loss below the Hammer lower wick.',
        confirmation: 'The next candle must close bullish and above the Hammer body to validate the reversal.',
        candles: [{ bodyTop: 35, bodyBottom: 45, wickTop: 30, wickBottom: 95, bullish: true }],
      },
      {
        name: 'Inverted Hammer',
        sentiment: 'Weak Bullish',
        psychology: 'Buyers attempted to push higher but sellers fought back. The attempt itself signals a potential momentum shift after a downtrend.',
        entry: 'Enter above the Inverted Hammer high on confirmation.',
        stopLoss: 'Stop-loss below the low of the candle.',
        confirmation: 'The next candle must open and close above the Inverted Hammer body — a gap up adds strength.',
        candles: [{ bodyTop: 75, bodyBottom: 85, wickTop: 25, wickBottom: 90, bullish: true }],
      },
      {
        name: 'Shooting Star',
        sentiment: 'Strong Bearish',
        psychology: 'Buyers pushed price to new highs but sellers took control and drove it back near the open. Upper wick shows rejection at resistance.',
        entry: 'Enter short when the next candle closes below the Shooting Star low.',
        stopLoss: 'Stop-loss above the upper wick.',
        confirmation: 'The next candle must close bearish and below the Shooting Star body to confirm the reversal.',
        candles: [{ bodyTop: 75, bodyBottom: 85, wickTop: 20, wickBottom: 90, bullish: false }],
      },
      {
        name: 'Hanging Man',
        sentiment: 'Weak Bearish',
        psychology: 'Looks like a Hammer but at the top of an uptrend. Sellers are starting to emerge — the long lower shadow warns that buying pressure is fading.',
        entry: 'Enter short below the Hanging Man low on confirmation.',
        stopLoss: 'Stop-loss above the Hanging Man high.',
        confirmation: 'The next candle must close bearish, ideally below the Hanging Man open, to validate the signal.',
        candles: [{ bodyTop: 30, bodyBottom: 40, wickTop: 25, wickBottom: 90, bullish: false }],
      },
      {
        name: 'Doji',
        sentiment: 'Neutral',
        psychology: 'Open and close are virtually equal — neither buyers nor sellers won. After a strong trend, it warns momentum is fading and a reversal may be near.',
        entry: 'Wait for the next candle to set direction, then enter above/below the Doji range.',
        stopLoss: 'Stop-loss on the opposite side of the Doji wick.',
        confirmation: 'The next candle must break decisively beyond the Doji range in either direction.',
        candles: [{ bodyTop: 58, bodyBottom: 60, wickTop: 30, wickBottom: 90, bullish: true }],
      },
      {
        name: 'Marubozu',
        sentiment: 'Strong Bullish',
        psychology: 'A full-bodied candle with no wicks — buyers (or sellers) dominated the entire session without any opposition. Pure conviction.',
        entry: 'For bullish Marubozu: enter long at close or on a small pullback. For bearish: enter short.',
        stopLoss: 'Stop-loss at the midpoint of the Marubozu body.',
        confirmation: 'The next candle should continue in the same direction. A reversal candle immediately after weakens the signal.',
        candles: [{ bodyTop: 25, bodyBottom: 90, wickTop: 25, wickBottom: 90, bullish: true }],
      },
    ],
  },
  {
    title: 'Double Candle Patterns',
    patterns: [
      {
        name: 'Bullish Engulfing',
        sentiment: 'Strong Bullish',
        psychology: 'A small bearish candle is completely swallowed by a larger bullish candle. Buyers overwhelmed sellers — momentum has shifted.',
        entry: 'Enter long at the close of the engulfing candle or on a break above its high.',
        stopLoss: 'Stop-loss below the low of the engulfing candle.',
        confirmation: 'The next candle must close bullish, confirming buyer control.',
        candles: [
          { bodyTop: 55, bodyBottom: 70, wickTop: 50, wickBottom: 75, bullish: false },
          { bodyTop: 40, bodyBottom: 80, wickTop: 35, wickBottom: 85, bullish: true },
        ],
      },
      {
        name: 'Bearish Engulfing',
        sentiment: 'Strong Bearish',
        psychology: 'A small bullish candle is completely engulfed by a larger bearish candle. Sellers overwhelmed buyers at the top of an uptrend.',
        entry: 'Enter short at the close of the engulfing candle.',
        stopLoss: 'Stop-loss above the high of the engulfing candle.',
        confirmation: 'The next candle must close bearish to confirm seller dominance.',
        candles: [
          { bodyTop: 50, bodyBottom: 65, wickTop: 45, wickBottom: 70, bullish: true },
          { bodyTop: 35, bodyBottom: 75, wickTop: 30, wickBottom: 80, bullish: false },
        ],
      },
      {
        name: 'Bullish Harami',
        sentiment: 'Weak Bullish',
        psychology: 'A small bullish candle forms inside the body of a larger bearish candle. Selling pressure is weakening — buyers are starting to test control.',
        entry: 'Enter long above the high of the second (small) candle.',
        stopLoss: 'Stop-loss below the low of the first (large) candle.',
        confirmation: 'The next candle must break above the Harami high to validate the reversal.',
        candles: [
          { bodyTop: 30, bodyBottom: 80, wickTop: 25, wickBottom: 85, bullish: false },
          { bodyTop: 48, bodyBottom: 62, wickTop: 45, wickBottom: 65, bullish: true },
        ],
      },
      {
        name: 'Bearish Harami',
        sentiment: 'Weak Bearish',
        psychology: 'A small bearish candle forms inside the body of a larger bullish candle. Buying momentum is fading — sellers are gaining a foothold.',
        entry: 'Enter short below the low of the second (small) candle.',
        stopLoss: 'Stop-loss above the high of the first (large) candle.',
        confirmation: 'The next candle must break below the Harami low to confirm the reversal.',
        candles: [
          { bodyTop: 30, bodyBottom: 80, wickTop: 25, wickBottom: 85, bullish: true },
          { bodyTop: 45, bodyBottom: 60, wickTop: 42, wickBottom: 63, bullish: false },
        ],
      },
      {
        name: 'Piercing Line',
        sentiment: 'Strong Bullish',
        psychology: 'After a bearish candle, the next candle opens below the low but closes above the midpoint of the first. Buyers fought back with conviction at the bottom.',
        entry: 'Enter long at the close of the bullish candle.',
        stopLoss: 'Stop-loss below the low of the pattern.',
        confirmation: 'The next candle must close above the bullish candle close to confirm buyer strength.',
        candles: [
          { bodyTop: 35, bodyBottom: 70, wickTop: 30, wickBottom: 75, bullish: false },
          { bodyTop: 30, bodyBottom: 60, wickTop: 25, wickBottom: 78, bullish: true },
        ],
      },
      {
        name: 'Dark Cloud Cover',
        sentiment: 'Strong Bearish',
        psychology: 'After a bullish candle, the next opens above the high but closes below the midpoint. Sellers aggressively rejected higher prices.',
        entry: 'Enter short at the close of the bearish candle.',
        stopLoss: 'Stop-loss above the pattern high.',
        confirmation: 'The next candle must close bearish to validate the reversal signal.',
        candles: [
          { bodyTop: 40, bodyBottom: 75, wickTop: 35, wickBottom: 80, bullish: true },
          { bodyTop: 30, bodyBottom: 62, wickTop: 25, wickBottom: 65, bullish: false },
        ],
      },
    ],
  },
  {
    title: 'Triple Candle Patterns',
    patterns: [
      {
        name: 'Morning Star',
        sentiment: 'Strong Bullish',
        psychology: 'Bearish candle → small indecision candle → strong bullish candle. Marks the exact transition from seller control to buyer control at a bottom.',
        entry: 'Enter long at the close of the third candle.',
        stopLoss: 'Stop-loss below the low of the middle candle.',
        confirmation: 'The third candle must close above the midpoint of the first candle. Volume on the third candle should be higher.',
        candles: [
          { bodyTop: 35, bodyBottom: 70, wickTop: 30, wickBottom: 75, bullish: false },
          { bodyTop: 73, bodyBottom: 78, wickTop: 68, wickBottom: 85, bullish: false },
          { bodyTop: 30, bodyBottom: 65, wickTop: 25, wickBottom: 70, bullish: true },
        ],
      },
      {
        name: 'Evening Star',
        sentiment: 'Strong Bearish',
        psychology: 'Strong bullish candle → small indecision candle → strong bearish candle. Signals the end of buying pressure at a market top.',
        entry: 'Enter short at the close of the third candle.',
        stopLoss: 'Stop-loss above the high of the middle candle.',
        confirmation: 'The third candle must close below the midpoint of the first candle. Increasing volume confirms the reversal.',
        candles: [
          { bodyTop: 40, bodyBottom: 75, wickTop: 35, wickBottom: 80, bullish: true },
          { bodyTop: 30, bodyBottom: 35, wickTop: 25, wickBottom: 40, bullish: true },
          { bodyTop: 38, bodyBottom: 75, wickTop: 33, wickBottom: 80, bullish: false },
        ],
      },
      {
        name: 'Three White Soldiers',
        sentiment: 'Strong Bullish',
        psychology: 'Three consecutive long bullish candles, each opening within the prior body and closing higher. Sustained, aggressive buying — a powerful reversal signal.',
        entry: 'Enter long at the close of the third candle or on a pullback.',
        stopLoss: 'Stop-loss below the first candle low.',
        confirmation: 'Each candle should close near its high with minimal upper wick. The fourth candle should not be a large bearish reversal.',
        candles: [
          { bodyTop: 65, bodyBottom: 85, wickTop: 62, wickBottom: 88, bullish: true },
          { bodyTop: 45, bodyBottom: 68, wickTop: 42, wickBottom: 70, bullish: true },
          { bodyTop: 25, bodyBottom: 48, wickTop: 22, wickBottom: 50, bullish: true },
        ],
      },
      {
        name: 'Three Black Crows',
        sentiment: 'Strong Bearish',
        psychology: 'Three consecutive long bearish candles, each opening within the prior body and closing lower. Relentless selling — a reliable reversal from an uptrend.',
        entry: 'Enter short at the close of the third candle.',
        stopLoss: 'Stop-loss above the first candle high.',
        confirmation: 'Each candle should close near its low with minimal lower wick. The fourth candle should not reclaim the third candle body.',
        candles: [
          { bodyTop: 25, bodyBottom: 48, wickTop: 22, wickBottom: 50, bullish: false },
          { bodyTop: 45, bodyBottom: 68, wickTop: 42, wickBottom: 70, bullish: false },
          { bodyTop: 65, bodyBottom: 85, wickTop: 62, wickBottom: 88, bullish: false },
        ],
      },
    ],
  },
];

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
      </div>
    </div>
  );
}

export default function Patterns() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const allPatterns = categories.flatMap((c) => c.patterns);

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      patterns: cat.patterns.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sentiment.toLowerCase().includes(search.toLowerCase())
      ),
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
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or sentiment… (e.g. Hammer, Strong Bullish)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
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
