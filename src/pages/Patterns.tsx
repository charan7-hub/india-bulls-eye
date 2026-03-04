import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CandlestickPattern {
  name: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  description: string;
  howToTrade: string;
  candles: CandleSvgProps[];
}

interface CandleSvgProps {
  bodyTop: number;
  bodyBottom: number;
  wickTop: number;
  wickBottom: number;
  bullish: boolean;
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

const patterns: CandlestickPattern[] = [
  {
    name: 'Doji',
    sentiment: 'Neutral',
    description:
      'The Doji forms when the open and close are virtually equal. It signals indecision — neither buyers nor sellers have won. After a strong trend, it warns that momentum is fading and a reversal may be near.',
    howToTrade:
      "Wait for the next candle to confirm direction. Place entry above or below the Doji range. Stop-loss goes on the opposite side of the Doji wick.",
    candles: [
      { bodyTop: 58, bodyBottom: 60, wickTop: 30, wickBottom: 90, bullish: true },
    ],
  },
  {
    name: 'Hammer',
    sentiment: 'Bullish',
    description:
      'Appears at the bottom of a downtrend. Sellers pushed the price sharply lower during the session, but buyers stepped in aggressively and pushed it back near the open. The long lower shadow shows buyer strength.',
    howToTrade:
      "Enter long when the next candle closes above the Hammer high. Place stop-loss below the Hammer lower wick. Target a 1:2 risk-reward ratio.",
    candles: [
      { bodyTop: 35, bodyBottom: 45, wickTop: 30, wickBottom: 95, bullish: true },
    ],
  },
  {
    name: 'Inverted Hammer',
    sentiment: 'Bullish',
    description:
      'Found at the end of a downtrend. Buyers tried to push higher during the session but sellers fought back. However, the fact that buyers even attempted signals a potential shift in momentum.',
    howToTrade:
      "Confirm with a bullish follow-through candle. Enter above the Inverted Hammer high. Stop-loss below the low of the pattern.",
    candles: [
      { bodyTop: 75, bodyBottom: 85, wickTop: 25, wickBottom: 90, bullish: true },
    ],
  },
  {
    name: 'Bullish Engulfing',
    sentiment: 'Bullish',
    description:
      'A small bearish candle is completely engulfed by a larger bullish candle. This shows that buyers have overwhelmed sellers, taking control of the market. It is strongest when appearing after a clear downtrend.',
    howToTrade:
      'Enter long at the close of the engulfing candle or on a break above its high. Stop-loss below the low of the engulfing candle. Target the nearest resistance level.',
    candles: [
      { bodyTop: 55, bodyBottom: 70, wickTop: 50, wickBottom: 75, bullish: false },
      { bodyTop: 40, bodyBottom: 80, wickTop: 35, wickBottom: 85, bullish: true },
    ],
  },
  {
    name: 'Bearish Engulfing',
    sentiment: 'Bearish',
    description:
      'A small bullish candle is completely engulfed by a larger bearish candle. Sellers have overwhelmed buyers. This is a powerful reversal signal at the top of an uptrend, especially on high volume.',
    howToTrade:
      'Enter short at the close of the engulfing candle. Stop-loss above the high of the engulfing candle. Target the nearest support level.',
    candles: [
      { bodyTop: 50, bodyBottom: 65, wickTop: 45, wickBottom: 70, bullish: true },
      { bodyTop: 35, bodyBottom: 75, wickTop: 30, wickBottom: 80, bullish: false },
    ],
  },
  {
    name: 'Morning Star',
    sentiment: 'Bullish',
    description:
      'A three-candle reversal pattern at the bottom of a downtrend. The first candle is bearish, followed by a small-bodied candle (indecision), then a strong bullish candle. It marks the transition from sellers to buyers.',
    howToTrade:
      'Enter long at the close of the third candle. Stop-loss below the low of the middle candle. Target prior resistance or a 1:2 risk-reward ratio.',
    candles: [
      { bodyTop: 35, bodyBottom: 70, wickTop: 30, wickBottom: 75, bullish: false },
      { bodyTop: 73, bodyBottom: 78, wickTop: 68, wickBottom: 85, bullish: false },
      { bodyTop: 30, bodyBottom: 65, wickTop: 25, wickBottom: 70, bullish: true },
    ],
  },
  {
    name: 'Evening Star',
    sentiment: 'Bearish',
    description:
      'The bearish counterpart to Morning Star. A strong bullish candle, followed by a small-bodied candle showing indecision, then a strong bearish candle. It signals the end of buying pressure at a top.',
    howToTrade:
      'Enter short at the close of the third candle. Stop-loss above the high of the middle candle. Target prior support levels.',
    candles: [
      { bodyTop: 40, bodyBottom: 75, wickTop: 35, wickBottom: 80, bullish: true },
      { bodyTop: 30, bodyBottom: 35, wickTop: 25, wickBottom: 40, bullish: true },
      { bodyTop: 38, bodyBottom: 75, wickTop: 33, wickBottom: 80, bullish: false },
    ],
  },
  {
    name: 'Shooting Star',
    sentiment: 'Bearish',
    description:
      'Appears at the top of an uptrend. Buyers pushed the price higher but sellers took control and drove it back near the open. The long upper shadow signals rejection at higher levels.',
    howToTrade:
      "Enter short when the next candle closes below the Shooting Star low. Stop-loss above the upper wick. Target the nearest support level.",
    candles: [
      { bodyTop: 75, bodyBottom: 85, wickTop: 20, wickBottom: 90, bullish: false },
    ],
  },
  {
    name: 'Hanging Man',
    sentiment: 'Bearish',
    description:
      'Looks identical to a Hammer but appears at the top of an uptrend. The long lower shadow shows that sellers are beginning to emerge. It warns that the uptrend may be exhausting.',
    howToTrade:
      "Wait for bearish confirmation on the next candle. Enter short below the Hanging Man low. Stop-loss above its high.",
    candles: [
      { bodyTop: 30, bodyBottom: 40, wickTop: 25, wickBottom: 90, bullish: false },
    ],
  },
  {
    name: 'Three White Soldiers',
    sentiment: 'Bullish',
    description:
      "Three consecutive long-bodied bullish candles, each opening within the previous candle body and closing progressively higher. It signals strong, sustained buying pressure and a powerful reversal from a downtrend.",
    howToTrade:
      "Enter long at the close of the third candle or on a pullback. Stop-loss below the first candle low. Watch for overextension — consider partial profits at resistance.",
    candles: [
      { bodyTop: 65, bodyBottom: 85, wickTop: 62, wickBottom: 88, bullish: true },
      { bodyTop: 45, bodyBottom: 68, wickTop: 42, wickBottom: 70, bullish: true },
      { bodyTop: 25, bodyBottom: 48, wickTop: 22, wickBottom: 50, bullish: true },
    ],
  },
  {
    name: 'Three Black Crows',
    sentiment: 'Bearish',
    description:
      "Three consecutive long-bodied bearish candles, each opening within the previous candle body and closing progressively lower. It indicates strong selling pressure and a reliable reversal from an uptrend.",
    howToTrade:
      "Enter short at the close of the third candle. Stop-loss above the first candle high. Target key support levels below.",
    candles: [
      { bodyTop: 25, bodyBottom: 48, wickTop: 22, wickBottom: 50, bullish: false },
      { bodyTop: 45, bodyBottom: 68, wickTop: 42, wickBottom: 70, bullish: false },
      { bodyTop: 65, bodyBottom: 85, wickTop: 62, wickBottom: 88, bullish: false },
    ],
  },
  {
    name: 'Piercing Line',
    sentiment: 'Bullish',
    description:
      'A two-candle pattern at the bottom of a downtrend. The second bullish candle opens below the prior bearish candle's low but closes above its midpoint. It shows buyers fighting back with conviction.',
    howToTrade:
      'Enter long at the close of the bullish candle. Stop-loss below the low of the pattern. Target the top of the first candle or next resistance.',
    candles: [
      { bodyTop: 35, bodyBottom: 70, wickTop: 30, wickBottom: 75, bullish: false },
      { bodyTop: 30, bodyBottom: 60, wickTop: 25, wickBottom: 78, bullish: true },
    ],
  },
  {
    name: 'Dark Cloud Cover',
    sentiment: 'Bearish',
    description:
      'The bearish counterpart to Piercing Line. The second candle opens above the prior bullish high but closes below its midpoint. Sellers are aggressively rejecting higher prices.',
    howToTrade:
      'Enter short at the close of the bearish candle. Stop-loss above the pattern high. Target the nearest support level.',
    candles: [
      { bodyTop: 40, bodyBottom: 75, wickTop: 35, wickBottom: 80, bullish: true },
      { bodyTop: 30, bodyBottom: 62, wickTop: 25, wickBottom: 65, bullish: false },
    ],
  },
  {
    name: 'Spinning Top',
    sentiment: 'Neutral',
    description:
      'A candle with a small body and long wicks on both sides. Both buyers and sellers were active during the session, but neither gained a decisive advantage. It represents pure market indecision.',
    howToTrade:
      'Do not trade it in isolation. Use it as a signal to tighten stops on existing positions. Wait for the next candle to set direction.',
    candles: [
      { bodyTop: 52, bodyBottom: 60, wickTop: 25, wickBottom: 90, bullish: true },
    ],
  },
  {
    name: 'Tweezer Tops',
    sentiment: 'Bearish',
    description:
      'Two candles with matching highs at the top of an uptrend. The market tested a resistance level twice and failed both times. Double rejection at the same level is a strong bearish signal.',
    howToTrade:
      'Enter short below the second candle's close. Stop-loss above the matching highs. Target the nearest support.',
    candles: [
      { bodyTop: 35, bodyBottom: 60, wickTop: 25, wickBottom: 65, bullish: true },
      { bodyTop: 40, bodyBottom: 60, wickTop: 25, wickBottom: 65, bullish: false },
    ],
  },
  {
    name: 'Tweezer Bottoms',
    sentiment: 'Bullish',
    description:
      'Two candles with matching lows at the bottom of a downtrend. The market tested a support level twice and held. Double support confirmation is a strong bullish reversal signal.',
    howToTrade:
      'Enter long above the second candle's close. Stop-loss below the matching lows. Target the nearest resistance.',
    candles: [
      { bodyTop: 50, bodyBottom: 70, wickTop: 45, wickBottom: 90, bullish: false },
      { bodyTop: 45, bodyBottom: 65, wickTop: 40, wickBottom: 90, bullish: true },
    ],
  },
];

const sentimentColor: Record<string, string> = {
  Bullish: 'bg-terminal-green/20 text-terminal-green border-terminal-green/30',
  Bearish: 'bg-terminal-red/20 text-terminal-red border-terminal-red/30',
  Neutral: 'bg-terminal-gold/20 text-terminal-gold border-terminal-gold/30',
};

export default function Patterns() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = patterns.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
            <h1 className="text-sm font-bold text-foreground">
              Candlestick Patterns Library
            </h1>
            <p className="text-xs text-muted-foreground">
              {filtered.length} patterns
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patterns… (e.g. Hammer, Engulfing)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.name}
              className="border border-border bg-card overflow-hidden"
            >
              {/* SVG Diagram */}
              <CandleSvg candles={p.candles} />

              <div className="p-4 space-y-3">
                {/* Name & Badge */}
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-foreground">{p.name}</h2>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border ${sentimentColor[p.sentiment]}`}
                  >
                    {p.sentiment}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.description}
                </p>

                {/* How to Trade */}
                <div className="border-t border-border pt-3">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
                    How to Trade
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.howToTrade}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No patterns match "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
