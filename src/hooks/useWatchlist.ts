import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_KEY = 'indian-stock-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchlist(parsed);
        }
      } catch (e) {
        console.error('Failed to parse watchlist:', e);
      }
    } else {
      // Default watchlist
      const defaultWatchlist = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ZOMATO'];
      setWatchlist(defaultWatchlist);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(defaultWatchlist));
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  }, [watchlist]);

  const addToWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) => {
      if (prev.includes(symbol)) return prev;
      return [...prev, symbol];
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  }, []);

  const isInWatchlist = useCallback(
    (symbol: string) => watchlist.includes(symbol),
    [watchlist]
  );

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
}
