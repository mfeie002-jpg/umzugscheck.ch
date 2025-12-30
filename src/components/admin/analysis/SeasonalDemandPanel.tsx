import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface SeasonalPeriod {
  name: string;
  months: string;
  factor: number;
  color: 'red' | 'yellow' | 'green';
  description: string;
}

const SEASONAL_PERIODS: SeasonalPeriod[] = [
  {
    name: 'Hochsaison (Zügeltage)',
    months: 'Ende März, Juni, September',
    factor: 1.35,
    color: 'red',
    description: 'Offizielle Kündigungstermine - höchste Nachfrage'
  },
  {
    name: 'Nebensaison',
    months: 'Januar, Februar, Juli, August',
    factor: 0.9,
    color: 'green',
    description: 'Günstigste Periode, hohe Verfügbarkeit'
  },
  {
    name: 'Übergangsmonate',
    months: 'April, Mai, Oktober, November',
    factor: 1.0,
    color: 'yellow',
    description: 'Normale Preise, gute Verfügbarkeit'
  },
  {
    name: 'Dezember',
    months: 'Dezember',
    factor: 1.1,
    color: 'yellow',
    description: 'Leicht erhöht wegen Feiertagen'
  }
];

const RED_DAYS = [
  { date: '31. März', reason: 'Offizieller Kündigungstermin (ZH)' },
  { date: '30. Juni', reason: 'Halbjahres-Kündigungstermin' },
  { date: '30. September', reason: 'Offizieller Kündigungstermin (ZH)' },
  { date: '31. Dezember', reason: 'Jahresend-Kündigungstermin' }
];

export const SeasonalDemandPanel: React.FC = () => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500/10 border-red-500/30 text-red-700';
      case 'yellow':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700';
      case 'green':
        return 'bg-green-500/10 border-green-500/30 text-green-700';
      default:
        return 'bg-muted border-border text-foreground';
    }
  };

  const getFactorBadge = (factor: number) => {
    if (factor > 1.2) return { label: '+35%', variant: 'destructive' as const };
    if (factor > 1.0) return { label: `+${((factor - 1) * 100).toFixed(0)}%`, variant: 'secondary' as const };
    if (factor < 1.0) return { label: `${((factor - 1) * 100).toFixed(0)}%`, variant: 'default' as const };
    return { label: '±0%', variant: 'outline' as const };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Saisonale Nachfrage & Pricing
        </CardTitle>
        <CardDescription>
          Yield Management basierend auf Schweizer Zügeltagen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seasonal Periods */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Saisonfaktoren
          </h4>
          <div className="grid gap-2">
            {SEASONAL_PERIODS.map((period) => {
              const factorBadge = getFactorBadge(period.factor);
              return (
                <div 
                  key={period.name}
                  className={`p-3 rounded-lg border ${getColorClasses(period.color)}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{period.name}</span>
                        <Badge variant={factorBadge.variant} className="text-xs">
                          {factorBadge.label}
                        </Badge>
                      </div>
                      <p className="text-xs opacity-80 mt-1">
                        {period.months}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-mono font-bold">
                        ×{period.factor.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs opacity-70 mt-2">
                    {period.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Red Days */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            "Red Days" - Kritische Termine
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {RED_DAYS.map((day) => (
              <div 
                key={day.date}
                className="p-2 bg-red-500/10 border border-red-500/20 rounded-md"
              >
                <span className="font-mono font-bold text-red-700 text-sm">
                  {day.date}
                </span>
                <p className="text-xs text-red-600/80 mt-0.5">
                  {day.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Flex-Date Recommendation */}
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm text-green-700">Flex-Date Empfehlung</h4>
              <p className="text-xs text-green-600/80 mt-1">
                Nutzer mit "Flexibel ±3 Tage" Option können bis zu 20% sparen.
                Dies ermöglicht Tourenplanung-Optimierung für Partner und 
                glättet die Auslastung an Peak-Tagen.
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Preview */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            Kalender-Ampel-System
          </h4>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>Teuer/Ausgebucht</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>Spar-Tag</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
