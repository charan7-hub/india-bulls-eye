import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourStep {
  selector: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="search"]',
    title: 'Search Stocks',
    description: 'Quickly find any NSE/BSE stock by name or ticker symbol.',
    position: 'bottom',
  },
  {
    selector: '[data-tour="market-news"]',
    title: 'Market Intelligence',
    description: 'Real-time news and sentiment analysis for your selected stock.',
    position: 'right',
  },
  {
    selector: '[data-tour="price-chart"]',
    title: 'Price Chart',
    description: 'Interactive charts with multiple timeframes to track stock performance.',
    position: 'bottom',
  },
  {
    selector: '[data-tour="ai-prediction"]',
    title: 'AI Predictions',
    description: 'AI-powered price forecasts and analysis to help inform your decisions.',
    position: 'top',
  },
  {
    selector: '[data-tour="watchlist"]',
    title: 'Your Watchlist',
    description: 'Add stocks to your watchlist to track them easily in one place.',
    position: 'left',
  },
];

const STORAGE_KEY = 'stockpulse_tour_completed';

export function WelcomeTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      const timer = setTimeout(() => setIsActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateHighlight = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    const el = document.querySelector(step.selector);
    if (el) {
      setHighlightRect(el.getBoundingClientRect());
    }
  }, [currentStep]);

  useEffect(() => {
    if (!isActive) return;
    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    return () => window.removeEventListener('resize', updateHighlight);
  }, [isActive, updateHighlight]);

  const dismiss = () => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const next = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const padding = 8;

  // Tooltip positioning
  const getTooltipStyle = (): React.CSSProperties => {
    if (!highlightRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const gap = 16;
    const base: React.CSSProperties = { position: 'fixed' };

    switch (step.position) {
      case 'bottom':
        return {
          ...base,
          top: highlightRect.bottom + gap,
          left: highlightRect.left + highlightRect.width / 2,
          transform: 'translateX(-50%)',
        };
      case 'top':
        return {
          ...base,
          bottom: window.innerHeight - highlightRect.top + gap,
          left: highlightRect.left + highlightRect.width / 2,
          transform: 'translateX(-50%)',
        };
      case 'right':
        return {
          ...base,
          top: highlightRect.top + highlightRect.height / 2,
          left: highlightRect.right + gap,
          transform: 'translateY(-50%)',
        };
      case 'left':
        return {
          ...base,
          top: highlightRect.top + highlightRect.height / 2,
          right: window.innerWidth - highlightRect.left + gap,
          transform: 'translateY(-50%)',
        };
      default:
        return base;
    }
  };

  return (
    <div className="fixed inset-0 z-[100]" onClick={dismiss}>
      {/* Dark overlay with cut-out */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {highlightRect && (
              <rect
                x={highlightRect.left - padding}
                y={highlightRect.top - padding}
                width={highlightRect.width + padding * 2}
                height={highlightRect.height + padding * 2}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="hsl(var(--background))"
          fillOpacity="0.8"
          mask="url(#tour-mask)"
          style={{ pointerEvents: 'auto' }}
        />
      </svg>

      {/* Highlight border glow */}
      {highlightRect && (
        <div
          className="fixed border-2 border-primary rounded-lg shadow-[0_0_20px_hsl(var(--primary)/0.4)] pointer-events-none transition-all duration-300"
          style={{
            top: highlightRect.top - padding,
            left: highlightRect.left - padding,
            width: highlightRect.width + padding * 2,
            height: highlightRect.height + padding * 2,
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        className="fixed z-[101] w-80 bg-card border border-border rounded-xl p-5 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
        style={getTooltipStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground font-mono">
            {currentStep + 1} / {TOUR_STEPS.length}
          </span>
        </div>

        <h3 className="text-base font-semibold text-foreground mb-1.5">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>

        {/* Step dots */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === currentStep
                    ? 'w-4 bg-primary'
                    : i < currentStep
                    ? 'w-1.5 bg-primary/40'
                    : 'w-1.5 bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={prev} className="h-8 px-3 text-xs">
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Back
              </Button>
            )}
            <Button size="sm" onClick={next} className="h-8 px-4 text-xs">
              {currentStep === TOUR_STEPS.length - 1 ? (
                'Get Started'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
