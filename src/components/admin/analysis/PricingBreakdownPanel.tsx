import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote, FileText, Truck, Package, AlertTriangle, CalendarDays } from 'lucide-react';

interface PricingFactor {
  name: string;
  calculation: string;
  reference: string;
  dynamic: string;
  icon: React.ReactNode;
}

const PRICING_FACTORS: PricingFactor[] = [
  {
    name: 'Volumen (Ladezeit)',
    calculation: 'Volumen × Ladezeitfaktor × Stundensatz',
    reference: 'Art. 3 AGB',
    dynamic: 'Abhängig von Etage/Lift',
    icon: <Package className="h-4 w-4" />
  },
  {
    name: 'Transport',
    calculation: 'Distanz (km) × Kilometersatz',
    reference: 'Distanzwerk',
    dynamic: 'CHF 3.05/km (LKW)',
    icon: <Truck className="h-4 w-4" />
  },
  {
    name: 'Verpackungsmaterial',
    calculation: 'Pauschale pro m³',
    reference: '-',
    dynamic: 'Fixpreis',
    icon: <Package className="h-4 w-4" />
  },
  {
    name: 'Zuschläge',
    calculation: 'Schwergut (>100kg), Gefahrgut',
    reference: 'Art. 2 AGB',
    dynamic: '+CHF 50.- pro Gefahrgut',
    icon: <AlertTriangle className="h-4 w-4" />
  },
  {
    name: 'Saisonalität',
    calculation: 'Basispreis × Saisonfaktor',
    reference: 'Marktdaten',
    dynamic: 'Variabel (1.0 - 1.4)',
    icon: <CalendarDays className="h-4 w-4" />
  }
];

const ASTAG_RULES = [
  {
    rule: '15-Meter-Regel',
    description: 'Normale Zufahrt = max. 15m zwischen LKW und Hauseingang',
    implication: 'Längere Distanz → Tragezeit-Zuschlag'
  },
  {
    rule: 'Zufahrtswege',
    description: 'Bestätigung der LKW-Zufahrt (3.5t oder 18t)',
    implication: 'Enge Straße → Shuttle-Fahrzeug-Zuschlag'
  },
  {
    rule: 'Festpreisgarantie',
    description: 'Verbindlicher Pauschalpreis nach Besichtigung',
    implication: 'Keine Nachforderungen am Umzugstag'
  }
];

export const PricingBreakdownPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5 text-primary" />
          ASTAG-Konformes Preismodell
        </CardTitle>
        <CardDescription>
          Orientiert an den offiziellen Tarifen des Schweizerischen Nutzfahrzeugverbands
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium">Kostenfaktor</th>
                <th className="text-left py-2 px-3 font-medium">Berechnungsgrundlage</th>
                <th className="text-left py-2 px-3 font-medium">ASTAG Ref.</th>
                <th className="text-left py-2 px-3 font-medium">Dynamik</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_FACTORS.map((factor, idx) => (
                <tr 
                  key={factor.name}
                  className={idx % 2 === 0 ? 'bg-muted/30' : ''}
                >
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{factor.icon}</span>
                      <span className="font-medium">{factor.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-muted-foreground font-mono text-xs">
                    {factor.calculation}
                  </td>
                  <td className="py-2 px-3">
                    <Badge variant="outline" className="text-xs">
                      {factor.reference}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-xs">
                    {factor.dynamic}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ASTAG Rules */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            ASTAG Regelungen
          </h4>
          <div className="grid gap-2">
            {ASTAG_RULES.map((rule) => (
              <div 
                key={rule.rule}
                className="p-3 bg-muted/30 rounded-lg border border-border/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-medium text-sm">{rule.rule}</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rule.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {rule.implication}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Surge Pricing Note */}
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm text-orange-700">Dynamisches Pricing ("Surge")</h4>
              <p className="text-xs text-orange-600/80 mt-1">
                Ende März, Juni und September sind offizielle Kündigungstermine.
                An diesen "Red Days" sind Preise ca. 30% höher. 
                Ein Umzug 3 Tage später kann ca. CHF 400.- sparen.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
