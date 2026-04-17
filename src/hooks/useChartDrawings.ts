import { useCallback, useEffect, useState } from 'react';

export type DrawingTool = 'none' | 'trendline' | 'horizontal' | 'fibonacci';

export interface BaseDrawing {
  id: string;
  type: 'trendline' | 'horizontal' | 'fibonacci';
  createdAt: number;
}

export interface TrendlineDrawing extends BaseDrawing {
  type: 'trendline';
  // Two anchor points in chart coordinates: time (UTC seconds) + price
  p1: { time: number; price: number };
  p2: { time: number; price: number };
}

export interface HorizontalDrawing extends BaseDrawing {
  type: 'horizontal';
  price: number;
  label?: string; // 'Support' | 'Resistance' | custom
}

export interface FibonacciDrawing extends BaseDrawing {
  type: 'fibonacci';
  // From swing low to swing high (or vice versa)
  p1: { time: number; price: number };
  p2: { time: number; price: number };
}

export type Drawing = TrendlineDrawing | HorizontalDrawing | FibonacciDrawing;

const STORAGE_PREFIX = 'ibe:chart-drawings:';

function storageKey(symbol: string, exchange: string) {
  return `${STORAGE_PREFIX}${exchange}:${symbol}`.toUpperCase();
}

export function useChartDrawings(symbol: string, exchange: string = 'NSE') {
  const [drawings, setDrawings] = useState<Drawing[]>([]);

  // Load when symbol/exchange changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(symbol, exchange));
      setDrawings(raw ? (JSON.parse(raw) as Drawing[]) : []);
    } catch {
      setDrawings([]);
    }
  }, [symbol, exchange]);

  const persist = useCallback(
    (next: Drawing[]) => {
      try {
        localStorage.setItem(storageKey(symbol, exchange), JSON.stringify(next));
      } catch {
        /* ignore quota */
      }
    },
    [symbol, exchange]
  );

  const addDrawing = useCallback(
    (d: { type: Drawing['type']; id?: string; createdAt?: number } & Record<string, unknown>) => {
      const drawing = {
        ...d,
        id: d.id || `${d.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: d.createdAt || Date.now(),
      } as Drawing;
      setDrawings((prev) => {
        const next = [...prev, drawing];
        persist(next);
        return next;
      });
      return drawing;
    },
    [persist]
  );

  const removeDrawing = useCallback(
    (id: string) => {
      setDrawings((prev) => {
        const next = prev.filter((d) => d.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearDrawings = useCallback(() => {
    setDrawings([]);
    persist([]);
  }, [persist]);

  return { drawings, addDrawing, removeDrawing, clearDrawings };
}
