/**
 * Commute Capital Calculator Component
 * 
 * Interactive tool to calculate the "true cost" of commuting
 * by converting time to money based on user's hourly rate.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  DollarSign,
  Train,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Info,
  Zap,
  Calendar,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  calculateCommuteCapital,
  getSuggestedHourlyRates,
  formatCommuteDuration,
  getCommuteQualityRating,
} from '@/lib/relo-os/commute-capital';
import { useSBBJourney, getEstimatedCommuteTime, getEstimatedMonthlyPass } from '@/lib/relo-os/commute-capital/useSBBJourney';

const SWISS_CITIES = [
  { value: 'zuerich', label: 'Zürich' },
  { value: 'bern', label: 'Bern' },
  { value: 'basel', label: 'Basel' },
  { value: 'genf', label: 'Genf' },
  { value: 'lausanne', label: 'Lausanne' },
  { value: 'luzern', label: 'Luzern' },
  { value: 'winterthur', label: 'Winterthur' },
  { value: 'st-gallen', label: 'St. Gallen' },
  { value: 'lugano', label: 'Lugano' },
  { value: 'biel', label: 'Biel' },
  { value: 'thun', label: 'Thun' },
  { value: 'chur', label: 'Chur' },
  { value: 'fribourg', label: 'Fribourg' },
  { value: 'schaffhausen', label: 'Schaffhausen' },
  { value: 'aarau', label: 'Aarau' },
  { value: 'olten', label: 'Olten' },
  { value: 'baden', label: 'Baden' },
  { value: 'zug', label: 'Zug' },
  { value: 'solothurn', label: 'Solothurn' },
  { value: 'neuchatel', label: 'Neuchâtel' },
  { value: 'sion', label: 'Sion' },
];

interface CommuteCapitalCalculatorProps {
  className?: string;
  initialFrom?: string;
  initialTo?: string;
  compact?: boolean;
}

export function CommuteCapitalCalculator({
  className = '',
  initialFrom = 'zuerich',
  initialTo = 'bern',
  compact = false,
}: CommuteCapitalCalculatorProps) {
  const [homeCity, setHomeCity] = useState(initialFrom);
  const [workCity, setWorkCity] = useState(initialTo);
  const [hourlyRate, setHourlyRate] = useState(40);
  const [customCommuteMinutes, setCustomCommuteMinutes] = useState<number | null>(null);

  const suggestedRates = getSuggestedHourlyRates();
  const { loading, fetchJourney, journey } = useSBBJourney();

  // Get commute time (from API, manual input, or estimate)
  const commuteMinutes = useMemo(() => {
    if (customCommuteMinutes !== null) return customCommuteMinutes;
    if (journey?.summary?.minDurationMinutes) return journey.summary.minDurationMinutes;
    return getEstimatedCommuteTime(homeCity, workCity) || 45;
  }, [customCommuteMinutes, journey, homeCity, workCity]);

  // Get monthly pass cost
  const monthlyPassCHF = useMemo(() => {
    if (journey?.summary?.estimatedMonthlyPassCHF) return journey.summary.estimatedMonthlyPassCHF;
    return getEstimatedMonthlyPass(commuteMinutes);
  }, [journey, commuteMinutes]);

  // Calculate commute capital
  const result = useMemo(() => {
    return calculateCommuteCapital({
      hourlyRate,
      oneWayCommuteMinutes: commuteMinutes,
      monthlyPassCHF,
      workDaysPerYear: 220,
    });
  }, [hourlyRate, commuteMinutes, monthlyPassCHF]);

  const commuteQuality = getCommuteQualityRating(commuteMinutes);

  const handleCityChange = async (home: string, work: string) => {
    setHomeCity(home);
    setWorkCity(work);
    setCustomCommuteMinutes(null);
    
    // Try to fetch real journey data
    if (home !== work) {
      fetchJourney(home, work);
    }
  };

  const qualityColorClass = {
    excellent: 'text-green-600 bg-green-500/10 border-green-500/30',
    good: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30',
    acceptable: 'text-amber-600 bg-amber-500/10 border-amber-500/30',
    long: 'text-orange-600 bg-orange-500/10 border-orange-500/30',
    very_long: 'text-red-600 bg-red-500/10 border-red-500/30',
  }[commuteQuality.rating];

  if (compact) {
    return (
      <Card className={`${className} border-primary/20`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Train className="w-5 h-5 text-primary" />
              <span className="font-semibold">Pendelkosten</span>
            </div>
            <Badge variant="outline" className={qualityColorClass}>
              {commuteQuality.label}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Pendelzeit (einfach)</p>
              <p className="text-lg font-bold">{formatCommuteDuration(commuteMinutes)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monatliche Zeitkosten</p>
              <p className="text-lg font-bold">CHF {result.monthlyTimeCost.toLocaleString()}</p>
            </div>
          </div>

          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/pendel-rechner">
              Detaillierte Berechnung
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Pendel-Kapital-Rechner</CardTitle>
              <CardDescription>
                Berechnen Sie den wahren Wert Ihrer Pendelzeit
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Route Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Wohnort
              </Label>
              <Select
                value={homeCity}
                onValueChange={(v) => handleCityChange(v, workCity)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SWISS_CITIES.map((city) => (
                    <SelectItem
                      key={city.value}
                      value={city.value}
                      disabled={city.value === workCity}
                    >
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Arbeitsort
              </Label>
              <Select
                value={workCity}
                onValueChange={(v) => handleCityChange(homeCity, v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SWISS_CITIES.map((city) => (
                    <SelectItem
                      key={city.value}
                      value={city.value}
                      disabled={city.value === homeCity}
                    >
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Commute Time Display/Override */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Pendelzeit (einfach)</span>
                {loading && <Badge variant="outline" className="text-xs">Lade...</Badge>}
                {journey?.mock && <Badge variant="outline" className="text-xs">Schätzung</Badge>}
              </div>
              <Badge variant="outline" className={qualityColorClass}>
                {commuteQuality.label}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[commuteMinutes]}
                  onValueChange={([v]) => setCustomCommuteMinutes(v)}
                  min={5}
                  max={120}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="w-24 text-right">
                <span className="text-xl font-bold">{formatCommuteDuration(commuteMinutes)}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">{commuteQuality.description}</p>
          </div>

          {/* Hourly Rate Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Ihr Stundensatz (Zeitwert)
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Ihr persönlicher Zeitwert - was ist Ihnen eine Stunde Freizeit wert?
                      Oft entspricht dies Ihrem Bruttostundenlohn.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[hourlyRate]}
                  onValueChange={([v]) => setHourlyRate(v)}
                  min={20}
                  max={150}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value) || 20)}
                  min={20}
                  max={200}
                  className="text-right"
                />
              </div>
              <span className="text-sm text-muted-foreground">CHF/Std.</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestedRates.map((rate) => (
                <Button
                  key={rate.label}
                  variant={hourlyRate === rate.rate ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setHourlyRate(rate.rate)}
                  className="text-xs"
                >
                  {rate.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Zeitkosten/Monat</span>
                </div>
                <p className="text-2xl font-bold">CHF {result.monthlyTimeCost.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.annualCommuteHours} Std./Jahr
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Train className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">ÖV-Kosten/Monat</span>
                </div>
                <p className="text-2xl font-bold">CHF {monthlyPassCHF.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Abo-Schätzung
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-muted-foreground">Gesamtkosten/Monat</span>
                </div>
                <p className="text-2xl font-bold text-destructive">
                  CHF {result.totalMonthlyCommuteCost.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.workDaysLostToCommute} Arbeitstage/Jahr
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Annual Summary */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Jährliche Pendelkosten</span>
              <span className="text-xl font-bold">
                CHF {result.totalAnnualCommuteCost.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zeitkosten (bei {hourlyRate} CHF/Std.)</span>
                <span>CHF {result.annualTimeCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transportkosten</span>
                <span>CHF {result.annualTransportCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg border border-accent">
            <Info className="w-5 h-5 text-accent-foreground mt-0.5 shrink-0" />
            <div className="text-sm">
              <strong className="text-foreground">Insight:</strong>{' '}
              <span className="text-muted-foreground">
                Bei {commuteMinutes} Min. Pendelzeit verbringen Sie{' '}
                <strong>{result.workDaysLostToCommute} volle Arbeitstage</strong> pro Jahr im Zug.
                Das entspricht einem Wert von{' '}
                <strong>CHF {result.annualTimeCost.toLocaleString()}</strong>.
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Planen Sie einen Umzug näher zum Arbeitsplatz?
            </p>
            <Button asChild>
              <Link to="/umzugsofferten">
                Jetzt Umzugsofferten vergleichen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CommuteCapitalCalculator;
