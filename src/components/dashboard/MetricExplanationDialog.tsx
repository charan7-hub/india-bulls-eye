import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MetricType = 'pe-ratio' | 'dividend-yield' | 'debt-equity' | 'market-cap' | 'ath' | 'atl';

interface MetricExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: MetricType | null;
  currentValue?: string;
  stockName?: string;
}

const metricData: Record<MetricType, {
  title: string;
  description: string;
  whatItMeans: string;
  whyItMatters: string;
  interpretation: {
    good: string;
    bad: string;
  };
}> = {
  'pe-ratio': {
    title: 'P/E Ratio (Price-to-Earnings)',
    description: 'The P/E ratio measures the current share price relative to its earnings per share (EPS).',
    whatItMeans: 'A P/E ratio tells you how much investors are willing to pay per rupee of earnings. It\'s calculated by dividing the current stock price by the earnings per share (EPS).',
    whyItMatters: 'It helps determine if a stock is overvalued or undervalued compared to its peers. Lower P/E may indicate undervaluation, while higher P/E suggests investors expect high growth.',
    interpretation: {
      good: 'P/E below industry average may signal undervaluation or value opportunity',
      bad: 'Very high P/E could mean overvaluation or unsustainable growth expectations',
    },
  },
  'dividend-yield': {
    title: 'Dividend Yield',
    description: 'Dividend yield shows how much a company pays out in dividends relative to its stock price.',
    whatItMeans: 'Calculated as annual dividends per share divided by the stock price, expressed as a percentage. A 2% yield means you earn ₹2 for every ₹100 invested annually.',
    whyItMatters: 'Important for income-focused investors. Consistent dividends indicate financial stability and shareholder-friendly management.',
    interpretation: {
      good: 'Yields above 1.5% are generally attractive for income investors',
      bad: 'Very high yields (>8%) may signal financial distress or unsustainable payouts',
    },
  },
  'debt-equity': {
    title: 'Debt-to-Equity Ratio',
    description: 'This ratio compares a company\'s total debt to its shareholders\' equity.',
    whatItMeans: 'It shows how much debt a company uses to finance its operations relative to equity. A ratio of 1.0 means equal debt and equity, while 2.0 means twice as much debt as equity.',
    whyItMatters: 'High debt increases financial risk, especially during economic downturns. However, some industries (like banking) naturally operate with higher leverage.',
    interpretation: {
      good: 'D/E below 0.5 indicates conservative financing and lower risk',
      bad: 'D/E above 2.0 may indicate high financial risk (except for banks/NBFCs)',
    },
  },
  'market-cap': {
    title: 'Market Capitalization',
    description: 'Market cap represents the total market value of a company\'s outstanding shares.',
    whatItMeans: 'Calculated by multiplying current share price by total outstanding shares. In India, it\'s commonly expressed in Crores (₹1 Cr = ₹10 million).',
    whyItMatters: 'Helps categorize companies: Large-cap (>₹20,000 Cr) are stable, Mid-cap (₹5,000-20,000 Cr) offer growth potential, Small-cap (<₹5,000 Cr) are higher risk/reward.',
    interpretation: {
      good: 'Large-cap stocks are generally more stable and liquid',
      bad: 'Smaller caps can be volatile and harder to trade in large quantities',
    },
  },
  'ath': {
    title: 'All-Time High (Historical Peak)',
    description: 'The highest price the stock has ever reached in its trading history.',
    whatItMeans: 'This represents the maximum value the stock achieved at any point. Reaching new all-time highs often signals strong momentum and investor confidence.',
    whyItMatters: 'Comparing current price to ATH helps gauge potential upside. Stocks near ATH may face resistance, while those far below may have recovery potential.',
    interpretation: {
      good: 'Breaking through ATH often signals strong bullish momentum',
      bad: 'Large gap from ATH may indicate fundamental issues or sector headwinds',
    },
  },
  'atl': {
    title: 'All-Time Low (Historical Floor)',
    description: 'The lowest price the stock has ever reached in its trading history.',
    whatItMeans: 'This represents the minimum value the stock touched. Distance from ATL provides a sense of downside risk already realized.',
    whyItMatters: 'Helps understand the stock\'s historical volatility and worst-case scenarios. Current price well above ATL suggests the company has recovered from past challenges.',
    interpretation: {
      good: 'Large distance from ATL indicates strong recovery and growth',
      bad: 'Near ATL may signal ongoing troubles or value trap potential',
    },
  },
};

export function MetricExplanationDialog({
  open,
  onOpenChange,
  metric,
  currentValue,
  stockName,
}: MetricExplanationDialogProps) {
  if (!metric) return null;

  const data = metricData[metric];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            {data.title}
          </DialogTitle>
          {currentValue && stockName && (
            <DialogDescription className="text-terminal-cyan font-mono">
              {stockName}: {currentValue}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <h4 className="text-sm font-medium text-foreground mb-1.5">
                What does it mean?
              </h4>
              <p className="text-sm text-muted-foreground">{data.whatItMeans}</p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <h4 className="text-sm font-medium text-foreground mb-1.5">
                Why does it matter?
              </h4>
              <p className="text-sm text-muted-foreground">{data.whyItMatters}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Interpretation Guide</h4>
            <div className="grid gap-2">
              <div className={cn(
                'flex items-start gap-2 p-2.5 rounded-lg',
                'bg-terminal-green/10 border border-terminal-green/20'
              )}>
                <CheckCircle className="h-4 w-4 text-terminal-green mt-0.5 flex-shrink-0" />
                <p className="text-xs text-terminal-green">{data.interpretation.good}</p>
              </div>
              <div className={cn(
                'flex items-start gap-2 p-2.5 rounded-lg',
                'bg-terminal-red/10 border border-terminal-red/20'
              )}>
                <AlertCircle className="h-4 w-4 text-terminal-red mt-0.5 flex-shrink-0" />
                <p className="text-xs text-terminal-red">{data.interpretation.bad}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground border-t border-border pt-3">
            💡 Always consider multiple metrics together and compare with industry peers for better analysis.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
