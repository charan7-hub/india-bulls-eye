
-- Sector analysis table for AI sentiment heatmap
CREATE TABLE public.sector_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sector_name TEXT NOT NULL,
  sector_code TEXT NOT NULL,
  sentiment_score NUMERIC(4,2) NOT NULL DEFAULT 0.00,
  previous_sentiment_score NUMERIC(4,2) DEFAULT 0.00,
  article_count INT NOT NULL DEFAULT 0,
  hot_stock_ticker TEXT,
  hot_stock_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT sentiment_range CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0),
  CONSTRAINT prev_sentiment_range CHECK (previous_sentiment_score >= -1.0 AND previous_sentiment_score <= 1.0),
  UNIQUE(sector_code)
);

-- Enable RLS
ALTER TABLE public.sector_analysis ENABLE ROW LEVEL SECURITY;

-- Public read access (market data is public)
CREATE POLICY "Anyone can view sector analysis"
ON public.sector_analysis
FOR SELECT
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert sector analysis"
ON public.sector_analysis
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sector analysis"
ON public.sector_analysis
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sector analysis"
ON public.sector_analysis
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.sector_analysis;

-- Seed initial sector data
INSERT INTO public.sector_analysis (sector_name, sector_code, sentiment_score, previous_sentiment_score, article_count, hot_stock_ticker, hot_stock_name) VALUES
  ('Nifty Bank', 'NIFTY_BANK', 0.45, 0.32, 12, 'HDFCBANK', 'HDFC Bank'),
  ('Nifty IT', 'NIFTY_IT', -0.30, -0.15, 8, 'TCS', 'TCS'),
  ('Nifty Auto', 'NIFTY_AUTO', 0.60, 0.55, 6, 'TATAMOTORS', 'Tata Motors'),
  ('Nifty FMCG', 'NIFTY_FMCG', 0.15, 0.20, 5, 'HINDUNILVR', 'Hindustan Unilever'),
  ('Nifty Metal', 'NIFTY_METAL', -0.55, -0.40, 9, 'TATASTEEL', 'Tata Steel'),
  ('Nifty Energy', 'NIFTY_ENERGY', 0.25, 0.10, 7, 'RELIANCE', 'Reliance');
