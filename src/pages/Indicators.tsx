import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, Zap, Activity, BarChart3, Building2, X, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { indicators, categoryColors, type Indicator, type IndicatorCategory } from '@/lib/indicatorsData';

const categoryIconMap: Record<IndicatorCategory, React.ReactNode> = {
  Trend: <TrendingUp className="h-4 w-4" />,
  Momentum: <Zap className="h-4 w-4" />,
  Volatility: <Activity className="h-4 w-4" />,
  Volume: <BarChart3 className="h-4 w-4" />,
  Fundamental: <Building2 className="h-4 w-4" />,
};

const allCategories: IndicatorCategory[] = ['Trend', 'Momentum', 'Volatility', 'Volume', 'Fundamental'];

export default function Indicators() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<IndicatorCategory | 'All'>('All');
  const [selected, setSelected] = useState<Indicator | null>(null);

  const filtered = indicators.filter((ind) => {
    const matchesSearch =
      ind.name.toLowerCase().includes(search.toLowerCase()) ||
      ind.shortName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || ind.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const grouped = allCategories.reduce((acc, cat) => {
    const items = filtered.filter((i) => i.category === cat);
    if (items.length > 0) acc.push({ category: cat, items });
    return acc;
  }, [] as { category: IndicatorCategory; items: Indicator[] }[]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-terminal-cyan" />
              <h1 className="text-lg font-bold text-foreground font-mono">Indicators Library</h1>
            </div>
            <Badge variant="outline" className="rounded-none text-xs font-mono">
              {indicators.length} Indicators
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search indicators... (e.g., RSI, MACD, P/E)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-none font-mono"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <Button
              variant={activeCategory === 'All' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none text-xs font-mono"
              onClick={() => setActiveCategory('All')}
            >
              All
            </Button>
            {allCategories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                className="rounded-none text-xs font-mono gap-1.5"
                onClick={() => setActiveCategory(cat)}
              >
                {categoryIconMap[cat]}
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Grouped Sections */}
        {grouped.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-mono">
            No indicators match your search.
          </div>
        )}

        {grouped.map(({ category, items }) => (
          <section key={category}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`p-1.5 border ${categoryColors[category]}`}>
                {categoryIconMap[category]}
              </span>
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-foreground">
                {category} Indicators
              </h2>
              <span className="text-xs text-muted-foreground font-mono">({items.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
              {items.map((ind) => (
                <button
                  key={ind.shortName}
                  onClick={() => setSelected(ind)}
                  className="text-left p-4 bg-card border border-border hover:border-terminal-cyan/50 transition-colors rounded-none group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-bold font-mono text-foreground group-hover:text-terminal-cyan transition-colors">
                      {ind.shortName}
                    </span>
                    <Badge variant="outline" className={`rounded-none text-[10px] ${categoryColors[ind.category]}`}>
                      {ind.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{ind.name}</p>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg rounded-none border-border bg-card sm:max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-lg font-mono">{selected.name}</DialogTitle>
                  <Badge variant="outline" className={`rounded-none text-xs ${categoryColors[selected.category]}`}>
                    {selected.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{selected.shortName}</p>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-terminal-cyan mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-terminal-gold mb-1">How to Use</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.howToUse}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-purple-400 mb-1">Where to Use</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.whereToUse}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-terminal-green mb-1">Benefits</h4>
                  <ul className="space-y-1.5">
                    {selected.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-terminal-green mt-0.5 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {selected.indianNote && (
                  <div className="p-3 border border-terminal-gold/30 bg-terminal-gold/5">
                    <p className="text-xs text-terminal-gold font-mono">🇮🇳 {selected.indianNote}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
