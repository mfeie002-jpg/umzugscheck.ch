/**
 * LEBENSKOSTEN-VERGLEICH TOOL
 * Interactive comparison of living costs between Swiss cities
 * SEO optimized for backlinks from media outlets
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeftRight,
  Home,
  Percent,
  Heart,
  Train,
  Baby,
  ShoppingCart,
  Star,
  Info,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  LIVING_COST_DATA, 
  getSwissAverage,
  formatCurrency,
  getComparisonPercent,
  type LivingCostData 
} from '@/lib/data-journalism';

export function LivingCostComparison() {
  const [city1Slug, setCity1Slug] = useState<string>('zuerich');
  const [city2Slug, setCity2Slug] = useState<string>('bern');
  const swissAvg = getSwissAverage();

  const city1 = useMemo(() => 
    LIVING_COST_DATA.find(c => c.slug === city1Slug) || LIVING_COST_DATA[0],
    [city1Slug]
  );
  
  const city2 = useMemo(() => 
    LIVING_COST_DATA.find(c => c.slug === city2Slug) || LIVING_COST_DATA[1],
    [city2Slug]
  );

  const swapCities = () => {
    const temp = city1Slug;
    setCity1Slug(city2Slug);
    setCity2Slug(temp);
  };

  const getDifferenceClass = (val1: number, val2: number, lowerIsBetter: boolean = true) => {
    if (val1 === val2) return 'text-muted-foreground';
    const better = lowerIsBetter ? val1 < val2 : val1 > val2;
    return better ? 'text-green-600' : 'text-destructive';
  };

  const getComparisonBadge = (val1: number, val2: number, lowerIsBetter: boolean = true) => {
    const diff = ((val1 - val2) / val2 * 100).toFixed(0);
    const better = lowerIsBetter ? val1 < val2 : val1 > val2;
    if (Math.abs(parseFloat(diff)) < 3) return null;
    
    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${better ? 'text-green-600 border-green-500/30' : 'text-destructive border-destructive/30'}`}
      >
        {parseFloat(diff) > 0 ? '+' : ''}{diff}%
      </Badge>
    );
  };

  const getCheaperCity = (metric: 'rent' | 'tax' | 'total') => {
    switch (metric) {
      case 'rent':
        return city1.rent3Room.avg < city2.rent3Room.avg ? city1 : city2;
      case 'tax':
        return city1.taxRateSingle < city2.taxRateSingle ? city1 : city2;
      case 'total':
        return city1.totalCostIndex < city2.totalCostIndex ? city1 : city2;
    }
  };

  const ComparisonRow = ({ 
    label, 
    icon: Icon, 
    val1, 
    val2, 
    format = (v: number) => v.toString(),
    lowerIsBetter = true,
    suffix = ''
  }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    val1: number;
    val2: number;
    format?: (v: number) => string;
    lowerIsBetter?: boolean;
    suffix?: string;
  }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b last:border-0">
      <div className="flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <div className={`text-center font-medium ${getDifferenceClass(val1, val2, lowerIsBetter)}`}>
        {format(val1)}{suffix}
      </div>
      <div className={`text-center font-medium ${getDifferenceClass(val2, val1, lowerIsBetter)}`}>
        {format(val2)}{suffix}
      </div>
    </div>
  );

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">
            Interaktives Tool
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Lebenskosten-Vergleich Schweiz
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vergleichen Sie Miete, Steuern, ÖV und mehr zwischen Schweizer Städten – 
            und finden Sie den besten Ort für Ihre Bedürfnisse.
          </p>
        </div>

        {/* City Selector */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="text-sm text-muted-foreground mb-2 block">Stadt 1</label>
                <Select value={city1Slug} onValueChange={setCity1Slug}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LIVING_COST_DATA.map(city => (
                      <SelectItem key={city.slug} value={city.slug} disabled={city.slug === city2Slug}>
                        {city.city} ({city.canton})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 mt-4 md:mt-6"
                onClick={swapCities}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </Button>

              <div className="flex-1 w-full">
                <label className="text-sm text-muted-foreground mb-2 block">Stadt 2</label>
                <Select value={city2Slug} onValueChange={setCity2Slug}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LIVING_COST_DATA.map(city => (
                      <SelectItem key={city.slug} value={city.slug} disabled={city.slug === city1Slug}>
                        {city.city} ({city.canton})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className={getCheaperCity('total').slug === city1Slug ? 'border-green-500/30 bg-green-500/5' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Gesamtkosten-Index</span>
                {getCheaperCity('total').slug === city1Slug && <Check className="w-4 h-4 text-green-600" />}
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{city1.city}</div>
                  <div className="text-2xl font-bold">{city1.totalCostIndex}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{city2.city}</div>
                  <div className="text-2xl font-bold">{city2.totalCostIndex}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">100 = Schweizer Durchschnitt</p>
            </CardContent>
          </Card>

          <Card className={getCheaperCity('rent').slug === city1Slug ? 'border-green-500/30 bg-green-500/5' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Günstigere Miete</span>
                <Home className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-xl font-bold">{getCheaperCity('rent').city}</div>
              <p className="text-sm text-muted-foreground mt-1">
                3-Zi: {formatCurrency(getCheaperCity('rent').rent3Room.avg)}
              </p>
            </CardContent>
          </Card>

          <Card className={getCheaperCity('tax').slug === city1Slug ? 'border-green-500/30 bg-green-500/5' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tiefere Steuern</span>
                <Percent className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-xl font-bold">{getCheaperCity('tax').city}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {getCheaperCity('tax').taxRateSingle}% (Single)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Detailvergleich</CardTitle>
            <CardDescription>
              Alle Kosten im direkten Vergleich
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Header Row */}
            <div className="grid grid-cols-3 gap-4 pb-3 border-b mb-1">
              <div className="text-sm font-medium text-muted-foreground">Kategorie</div>
              <div className="text-center font-semibold">{city1.city}</div>
              <div className="text-center font-semibold">{city2.city}</div>
            </div>

            {/* Rent Section */}
            <div className="py-2 border-b">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-2">
                Miete
              </div>
              <ComparisonRow 
                label="3-Zimmer (Ø)" 
                icon={Home}
                val1={city1.rent3Room.avg}
                val2={city2.rent3Room.avg}
                format={formatCurrency}
              />
              <ComparisonRow 
                label="4-Zimmer (Ø)" 
                icon={Home}
                val1={city1.rent4Room.avg}
                val2={city2.rent4Room.avg}
                format={formatCurrency}
              />
            </div>

            {/* Tax Section */}
            <div className="py-2 border-b">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-2">
                Steuern (bei 100k Einkommen)
              </div>
              <ComparisonRow 
                label="Single" 
                icon={Percent}
                val1={city1.taxRateSingle}
                val2={city2.taxRateSingle}
                format={(v) => v.toFixed(1)}
                suffix="%"
              />
              <ComparisonRow 
                label="Familie (2 Kinder)" 
                icon={Percent}
                val1={city1.taxRateFamily}
                val2={city2.taxRateFamily}
                format={(v) => v.toFixed(1)}
                suffix="%"
              />
            </div>

            {/* Other Costs */}
            <div className="py-2 border-b">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-2">
                Weitere Kosten
              </div>
              <ComparisonRow 
                label="Krankenkasse/Mt." 
                icon={Heart}
                val1={city1.healthInsurance}
                val2={city2.healthInsurance}
                format={formatCurrency}
              />
              <ComparisonRow 
                label="ÖV-Abo/Mt." 
                icon={Train}
                val1={city1.publicTransport.monthly}
                val2={city2.publicTransport.monthly}
                format={formatCurrency}
              />
              <ComparisonRow 
                label="Kita/Mt." 
                icon={Baby}
                val1={city1.childcare.monthly}
                val2={city2.childcare.monthly}
                format={formatCurrency}
              />
              <ComparisonRow 
                label="Lebensmittel-Index" 
                icon={ShoppingCart}
                val1={city1.groceriesIndex}
                val2={city2.groceriesIndex}
              />
            </div>

            {/* Quality of Life */}
            <div className="py-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-2">
                Lebensqualität
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Score</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`font-bold ${getDifferenceClass(city1.qualityOfLifeScore, city2.qualityOfLifeScore, false)}`}>
                      {city1.qualityOfLifeScore}/10
                    </span>
                  </div>
                  <Progress 
                    value={city1.qualityOfLifeScore * 10} 
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`font-bold ${getDifferenceClass(city2.qualityOfLifeScore, city1.qualityOfLifeScore, false)}`}>
                      {city2.qualityOfLifeScore}/10
                    </span>
                  </div>
                  <Progress 
                    value={city2.qualityOfLifeScore * 10} 
                    className="h-2 mt-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swiss Average Reference */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Schweizer Durchschnitt (Referenz)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">3-Zi. Miete:</span>{' '}
                <span className="font-medium">{formatCurrency(swissAvg.rent3Room)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">4-Zi. Miete:</span>{' '}
                <span className="font-medium">{formatCurrency(swissAvg.rent4Room)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Steuern (Single):</span>{' '}
                <span className="font-medium">{swissAvg.taxRateSingle}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Steuern (Familie):</span>{' '}
                <span className="font-medium">{swissAvg.taxRateFamily}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Krankenkasse:</span>{' '}
                <span className="font-medium">{formatCurrency(swissAvg.healthInsurance)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Kita:</span>{' '}
                <span className="font-medium">{formatCurrency(swissAvg.childcare)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Methodology Note */}
        <div className="mt-8 flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <strong>Datenquellen:</strong> Mietpreise basieren auf Daten von Wüest Partner und 
            homegate.ch. Steuersätze sind effektive Sätze bei CHF 100'000 Bruttoeinkommen 
            (Quelle: ESTV). Krankenkassenprämien entsprechen dem Durchschnitt der 
            Grundversicherung mit 2'500 CHF Franchise (BAG). Alle Angaben Stand 2024.
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground mb-4">
            Planen Sie einen Umzug von {city1.city} nach {city2.city}?
          </p>
          <Button size="lg" asChild>
            <Link to="/umzugsofferten">
              Jetzt Umzugsofferten vergleichen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default LivingCostComparison;
