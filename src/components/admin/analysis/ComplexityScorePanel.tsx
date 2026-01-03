import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Building2, Truck, Package } from 'lucide-react';

interface ComplexityFactor {
  name: string;
  symbol: string;
  weight: number;
  description: string;
  icon: React.ReactNode;
}

const COMPLEXITY_FACTORS: ComplexityFactor[] = [
  {
    name: 'Normalisiertes Volumen',
    symbol: 'V_norm',
    weight: 0.35,
    description: 'Verhältnis von Volumen zu Zimmeranzahl',
    icon: <Package className="h-4 w-4" />
  },
  {
    name: 'Distanzfaktor',
    symbol: 'D',
    weight: 0.25,
    description: 'Basierend auf ASTAG Distanzwerk',
    icon: <Truck className="h-4 w-4" />
  },
  {
    name: 'Etagen/Lift-Faktor',
    symbol: '(1-E)·F',
    weight: 0.25,
    description: 'Höhere Etage ohne Lift = höherer Score',
    icon: <Building2 className="h-4 w-4" />
  },
  {
    name: 'Spezialgüter',
    symbol: 'I_spez',
    weight: 0.15,
    description: 'Klavier, Tresor, Kunstwerke etc.',
    icon: <TrendingUp className="h-4 w-4" />
  }
];

interface ComplexityScorePanelProps {
  score?: number;
  factors?: {
    volume: number;
    distance: number;
    elevator: number;
    special: number;
  };
}

export const ComplexityScorePanel: React.FC<ComplexityScorePanelProps> = ({
  score = 0,
  factors
}) => {
  const getScoreColor = (s: number) => {
    if (s < 30) return 'bg-green-500/10 text-green-600 border-green-500/30';
    if (s < 70) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
    return 'bg-red-500/10 text-red-600 border-red-500/30';
  };

  const getScoreLabel = (s: number) => {
    if (s < 30) return 'Low Complexity';
    if (s < 70) return 'Medium Complexity';
    return 'High Complexity';
  };

  const getRoutingInfo = (s: number) => {
    if (s < 30) return 'Lokale Anbieter, "Man-with-a-Van"';
    if (s < 70) return 'Standard-Partner mit Erfahrung';
    return 'ASTAG-zertifizierte Premium-Partner (Möbellift, Klavierplan)';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Komplexitäts-Score Formel
        </CardTitle>
        <CardDescription>
          Algorithmus zur Lead-Bewertung und Vendor-Routing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formula Display */}
        <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <div className="text-center">
            <span className="text-primary font-bold">S<sub>c</sub></span>
            {' = '}
            <span className="text-blue-600">w<sub>v</sub></span>·V<sub>norm</sub>
            {' + '}
            <span className="text-blue-600">w<sub>d</sub></span>·D
            {' + '}
            <span className="text-blue-600">w<sub>e</sub></span>·(1-E)·F
            {' + '}
            <span className="text-blue-600">w<sub>s</sub></span>·I<sub>spez</sub>
          </div>
        </div>

        {/* Factor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {COMPLEXITY_FACTORS.map((factor) => (
            <div
              key={factor.symbol}
              className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
            >
              <div className="p-2 bg-primary/10 rounded-md text-primary">
                {factor.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{factor.name}</span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {factor.symbol}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {factor.description}
                </p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${factor.weight * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {(factor.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Score Thresholds */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Score-Schwellenwerte & Routing</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-md bg-green-500/10 border border-green-500/20">
              <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">
                &lt; 30
              </Badge>
              <div className="flex-1">
                <span className="text-sm font-medium text-green-700">Low Complexity</span>
                <p className="text-xs text-green-600/80">→ Lokale Anbieter, "Man-with-a-Van"</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20">
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                30-70
              </Badge>
              <div className="flex-1">
                <span className="text-sm font-medium text-yellow-700">Medium Complexity</span>
                <p className="text-xs text-yellow-600/80">→ Standard-Partner mit Erfahrung</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-red-500/10 border border-red-500/20">
              <Badge variant="outline" className="bg-red-500/20 text-red-700 border-red-500/30">
                &gt; 70
              </Badge>
              <div className="flex-1">
                <span className="text-sm font-medium text-red-700">High Complexity</span>
                <p className="text-xs text-red-600/80">→ ASTAG-zertifizierte Premium-Partner (Möbellift, Klavierplan)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Score Display (if provided) */}
        {score > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Aktueller Score:</span>
              <div className="flex items-center gap-2">
                <Badge className={getScoreColor(score)}>
                  {score}/100
                </Badge>
                <span className="text-sm font-medium">{getScoreLabel(score)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Routing: {getRoutingInfo(score)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
