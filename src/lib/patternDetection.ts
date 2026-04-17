// Lightweight candlestick pattern detection on the most recent 3-5 candles.

export interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

export type PatternSentiment = 'bullish' | 'bearish';

export interface DetectedPattern {
  name: string;
  sentiment: PatternSentiment;
  candleIndex: number;
  candleTime: number;
  pricePoint: number; // price for the marker (low for bullish, high for bearish)
  description: string; // short pre-canned description; AI fills the rest on click
}

const body = (c: Candle) => Math.abs(c.close - c.open);
const range = (c: Candle) => c.high - c.low;
const upperWick = (c: Candle) => c.high - Math.max(c.open, c.close);
const lowerWick = (c: Candle) => Math.min(c.open, c.close) - c.low;
const isBull = (c: Candle) => c.close > c.open;
const isBear = (c: Candle) => c.close < c.open;

function detectHammer(c: Candle): boolean {
  const r = range(c);
  if (r === 0) return false;
  const b = body(c);
  return (
    lowerWick(c) >= 2 * b &&
    upperWick(c) <= b * 0.5 &&
    b / r < 0.4
  );
}

function detectShootingStar(c: Candle): boolean {
  const r = range(c);
  if (r === 0) return false;
  const b = body(c);
  return (
    upperWick(c) >= 2 * b &&
    lowerWick(c) <= b * 0.5 &&
    b / r < 0.4
  );
}

function detectBullishEngulfing(prev: Candle, curr: Candle): boolean {
  return (
    isBear(prev) &&
    isBull(curr) &&
    curr.open <= prev.close &&
    curr.close >= prev.open &&
    body(curr) > body(prev)
  );
}

function detectBearishEngulfing(prev: Candle, curr: Candle): boolean {
  return (
    isBull(prev) &&
    isBear(curr) &&
    curr.open >= prev.close &&
    curr.close <= prev.open &&
    body(curr) > body(prev)
  );
}

function detectMorningStar(c1: Candle, c2: Candle, c3: Candle): boolean {
  return (
    isBear(c1) &&
    body(c2) < body(c1) * 0.5 &&
    isBull(c3) &&
    c3.close > (c1.open + c1.close) / 2
  );
}

function detectEveningStar(c1: Candle, c2: Candle, c3: Candle): boolean {
  return (
    isBull(c1) &&
    body(c2) < body(c1) * 0.5 &&
    isBear(c3) &&
    c3.close < (c1.open + c1.close) / 2
  );
}

export function detectPatterns(candles: Candle[]): DetectedPattern[] {
  const found: DetectedPattern[] = [];
  if (candles.length < 1) return found;

  // Scan only the last 5 candles for performance & relevance
  const start = Math.max(0, candles.length - 5);

  for (let i = start; i < candles.length; i++) {
    const c = candles[i];
    if (detectHammer(c) && (i === 0 || candles[i - 1].close < candles[i - 1].open || c.close > c.open)) {
      found.push({
        name: 'Hammer',
        sentiment: 'bullish',
        candleIndex: i,
        candleTime: c.time,
        pricePoint: c.low,
        description: 'A long lower wick with a small body near the top — buyers rejected lower prices.',
      });
    }
    if (detectShootingStar(c)) {
      found.push({
        name: 'Shooting Star',
        sentiment: 'bearish',
        candleIndex: i,
        candleTime: c.time,
        pricePoint: c.high,
        description: 'A long upper wick with a small body near the bottom — sellers rejected higher prices.',
      });
    }
    if (i >= 1) {
      const prev = candles[i - 1];
      if (detectBullishEngulfing(prev, c)) {
        found.push({
          name: 'Bullish Engulfing',
          sentiment: 'bullish',
          candleIndex: i,
          candleTime: c.time,
          pricePoint: c.low,
          description: 'A large green candle fully engulfs the prior red — strong buying pressure.',
        });
      }
      if (detectBearishEngulfing(prev, c)) {
        found.push({
          name: 'Bearish Engulfing',
          sentiment: 'bearish',
          candleIndex: i,
          candleTime: c.time,
          pricePoint: c.high,
          description: 'A large red candle fully engulfs the prior green — strong selling pressure.',
        });
      }
    }
    if (i >= 2) {
      const c1 = candles[i - 2];
      const c2 = candles[i - 1];
      if (detectMorningStar(c1, c2, c)) {
        found.push({
          name: 'Morning Star',
          sentiment: 'bullish',
          candleIndex: i,
          candleTime: c.time,
          pricePoint: c.low,
          description: 'A three-candle reversal: down, indecision, then strong up — bottom forming.',
        });
      }
      if (detectEveningStar(c1, c2, c)) {
        found.push({
          name: 'Evening Star',
          sentiment: 'bearish',
          candleIndex: i,
          candleTime: c.time,
          pricePoint: c.high,
          description: 'A three-candle reversal: up, indecision, then strong down — top forming.',
        });
      }
    }
  }

  // Deduplicate same pattern on same candle
  const seen = new Set<string>();
  return found.filter((p) => {
    const key = `${p.candleIndex}-${p.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
