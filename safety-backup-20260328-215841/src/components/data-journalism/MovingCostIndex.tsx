/**
 * UMZUGSKOSTEN-INDEX SCHWEIZ
 * Interactive map/table showing average moving costs per canton
 * SEO optimized for backlinks from media outlets
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowUpRight, 
  MapPin,
  Info,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MOVING_COST_INDEX, 
  formatCurrency, 
  getCheapestCantons, 
  getMostExpensiveCantons,
  type CantonMovingCosts 
} from '@/lib/data-journalism';

type SortKey = 'canton' | 'avgCost3Zimmer' | 'indexValue' | 'trend';
type SortDir = 'asc' | 'desc';

export function MovingCostIndex() {
  const [sortKey, setSortKey] = useState<SortKey>('indexValue');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedCanton, setSelectedCanton] = useState<CantonMovingCosts | null>(null);

  const sortedData = useMemo(() => {
    return [...MOVING_COST_INDEX].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'canton') {
        comparison = a.canton.localeCompare(b.canton);
      } else if (sortKey === 'trend') {
        const trendOrder = { steigend: 3, stabil: 2, sinkend: 1 };
        comparison = trendOrder[a.trend] - trendOrder[b.trend];
      } else {
        comparison = a[sortKey] - b[sortKey];
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [sortKey, sortDir]);

  const cheapest = getCheapestCantons(3);
  const expensive = getMostExpensiveCantons(3);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'steigend': return <TrendingUp className="w-4 h-4 text-destructive" />;
      case 'sinkend': return <TrendingDown className="w-4 h-4 text-green-600" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case 'günstig': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'teuer': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getIndexColor = (index: number) => {
    if (index < 90) return 'text-green-600';
    if (index > 115) return 'text-destructive';
    return 'text-foreground';
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">
            Daten 2024/2025
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Umzugskosten-Index Schweiz
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vergleichen Sie die durchschnittlichen Umzugskosten in allen Schweizer Kantonen. 
            Index 100 = Schweizer Durchschnitt.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardDescription>Günstigste Kantone</CardDescription>
            </CardHeader>
            <CardContent>
              {cheapest.map((c, i) => (
                <div key={c.slug} className="flex items-center justify-between py-1">
                  <span className="text-sm">{i + 1}. {c.canton}</span>
                  <span className="font-semibold text-green-700">{c.indexValue}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardDescription>Schweizer Durchschnitt</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[calc(100%-4rem)]">
              <span className="text-4xl font-bold text-primary">100</span>
              <span className="text-sm text-muted-foreground mt-1">Index-Basiswert</span>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-2">
              <CardDescription>Teuerste Kantone</CardDescription>
            </CardHeader>
            <CardContent>
              {expensive.map((c, i) => (
                <div key={c.slug} className="flex items-center justify-between py-1">
                  <span className="text-sm">{i + 1}. {c.canton}</span>
                  <span className="font-semibold text-destructive">{c.indexValue}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Alle Kantone im Vergleich
            </CardTitle>
            <CardDescription>
              Klicken Sie auf eine Spaltenüberschrift zum Sortieren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th 
                      className="text-left py-3 px-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('canton')}
                    >
                      Kanton {sortKey === 'canton' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-right py-3 px-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('avgCost3Zimmer')}
                    >
                      3-Zi. {sortKey === 'avgCost3Zimmer' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-right py-3 px-2 hidden md:table-cell">4-Zi.</th>
                    <th className="text-right py-3 px-2 hidden lg:table-cell">Haus</th>
                    <th 
                      className="text-center py-3 px-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('indexValue')}
                    >
                      Index {sortKey === 'indexValue' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-center py-3 px-2 cursor-pointer hover:bg-muted/50 transition-colors hidden sm:table-cell"
                      onClick={() => handleSort('trend')}
                    >
                      Trend {sortKey === 'trend' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-center py-3 px-2">Niveau</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((canton) => (
                    <tr 
                      key={canton.slug}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedCanton(canton)}
                    >
                      <td className="py-3 px-2">
                        <Link 
                          to={`/umzugsfirmen/kanton-${canton.slug}`}
                          className="font-medium hover:text-primary transition-colors flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {canton.canton}
                          <ArrowUpRight className="w-3 h-3 opacity-50" />
                        </Link>
                      </td>
                      <td className="text-right py-3 px-2 font-medium">
                        {formatCurrency(canton.avgCost3Zimmer)}
                      </td>
                      <td className="text-right py-3 px-2 hidden md:table-cell">
                        {formatCurrency(canton.avgCost4Zimmer)}
                      </td>
                      <td className="text-right py-3 px-2 hidden lg:table-cell">
                        {formatCurrency(canton.avgCostHaus)}
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={`font-bold ${getIndexColor(canton.indexValue)}`}>
                          {canton.indexValue}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2 hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {getTrendIcon(canton.trend)}
                          <span className="text-xs text-muted-foreground">
                            {canton.trendPercent > 0 ? '+' : ''}{canton.trendPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriceLevelColor(canton.priceLevel)}`}
                        >
                          {canton.priceLevel}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Selected Canton Detail */}
        {selectedCanton && (
          <Card className="mt-6 border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedCanton.canton} – Details</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCanton(null)}
                >
                  Schliessen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Durchschnittskosten</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">3-Zimmer-Wohnung</span>
                      <span className="font-medium">{formatCurrency(selectedCanton.avgCost3Zimmer)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">4-Zimmer-Wohnung</span>
                      <span className="font-medium">{formatCurrency(selectedCanton.avgCost4Zimmer)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Einfamilienhaus</span>
                      <span className="font-medium">{formatCurrency(selectedCanton.avgCostHaus)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Beliebte Routen</h4>
                  <div className="space-y-2">
                    {selectedCanton.popularRoutes.map((route, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-muted-foreground">
                          → {route.to}
                        </span>
                        <span className="font-medium">{formatCurrency(route.avgCost)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <Link 
                  to={`/umzugsfirmen/kanton-${selectedCanton.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  Umzugsfirmen in {selectedCanton.canton} vergleichen
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Methodology Note */}
        <div className="mt-8 flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <strong>Methodik:</strong> Die Daten basieren auf über 50'000 Umzugsanfragen 
            auf umzugscheck.ch im Jahr 2024. Der Index berechnet sich aus dem Verhältnis 
            zum Schweizer Durchschnitt (Index 100). Alle Preise verstehen sich als 
            Richtwerte für einen Umzug innerhalb des gleichen Kantons mit professioneller 
            Umzugsfirma inkl. Möbeltransport.
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link to="/umzugsofferten">
              Jetzt Offerten vergleichen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default MovingCostIndex;
