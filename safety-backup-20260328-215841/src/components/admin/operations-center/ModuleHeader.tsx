/**
 * Module Header Component - Mobile First
 * Touch-friendly headers with expandable explanations
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface ModuleHeaderProps {
  title: string;
  icon: React.ElementType;
  description: string;
  explanation: string;
  tips?: string[];
  metrics?: { label: string; description: string }[];
}

export function ModuleHeader({ 
  title, 
  icon: Icon, 
  description, 
  explanation,
  tips = [],
  metrics = []
}: ModuleHeaderProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="space-y-3 mb-4 md:mb-6">
      {/* Title Row - Mobile Optimized */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold truncate">{title}</h2>
            <p className="text-muted-foreground text-xs md:text-sm truncate">{description}</p>
          </div>
        </div>
        <Button 
          variant={showHelp ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => setShowHelp(!showHelp)}
          className="h-10 min-w-[44px] flex-shrink-0"
        >
          {showHelp ? <X className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
          <span className="hidden sm:inline sm:ml-1.5">
            {showHelp ? 'Schliessen' : 'Hilfe'}
          </span>
        </Button>
      </div>

      {/* Expandable Help Section - Mobile Friendly */}
      {showHelp && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Main Explanation */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Was ist das?
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
              </div>

              {/* Metrics Explanation - Horizontal scroll on mobile */}
              {metrics.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">📊 Metriken</h4>
                  <div className="flex flex-wrap gap-2">
                    {metrics.map((metric, i) => (
                      <div key={i} className="bg-background rounded-lg p-2 border min-w-0">
                        <Badge variant="outline" className="mb-1 text-xs">{metric.label}</Badge>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {tips.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    Tipps
                  </h4>
                  <ul className="space-y-1.5">
                    {tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Pre-defined module configurations
export const MODULE_CONFIGS = {
  brands: {
    title: 'Marken Performance',
    description: 'Vergleich aller 3 Marken',
    explanation: 'Hier siehst du die Performance deiner 3 Umzugsmarken: Feierabend (Premium), Umzugexpress (Speed) und Zügelhelden (Budget). Jede Marke hat unterschiedliche Zielgruppen und Margen.',
    tips: [
      'Feierabend sollte die höchste Marge haben (35%+ CM2)',
      'Umzugexpress wächst durch schnelle Reaktionszeiten',
      'Zügelhelden bringt Volumen, aber niedrigere Margen'
    ],
    metrics: [
      { label: 'CM2', description: 'Contribution Margin 2 - Gewinn nach Ops-Kosten' },
      { label: 'Conv. Rate', description: 'Lead-zu-Buchung Rate' },
      { label: 'Revenue', description: 'Umsatz dieser Marke' }
    ]
  },
  routing: {
    title: 'Lead Routing',
    description: 'Automatische Lead-Verteilung',
    explanation: 'Das System routet Leads automatisch zur passenden Marke basierend auf Score, Wert, Dringlichkeit und Budget. Premium-Leads (Score ≥65, Wert ≥CHF 1800) gehen zu Feierabend.',
    tips: [
      'Tippe auf eine Marke um zu filtern',
      'Urgent-Leads → Umzugexpress',
      'Budget-Leads → Zügelhelden'
    ],
    metrics: [
      { label: 'Score', description: 'Lead-Qualität 0-100' },
      { label: 'Wert', description: 'Geschätzter Auftragswert' },
      { label: 'Status', description: 'Pending → Gebucht' }
    ]
  },
  capacity: {
    title: 'Kapazität',
    description: 'Crew-Auslastung',
    explanation: 'Zeigt wie ausgelastet deine Crews sind. Bei 80-95% bist du optimal. Unter 60%: Rabatte. Über 95%: Peak-Preise. Nach 4 Wochen >85%: Crew #2 einstellen!',
    tips: [
      'Grün (80-95%) = Optimal',
      'Gelb (60-80%) = Rabatte anbieten',
      'Rot (>95%) = Peak-Pricing'
    ],
    metrics: [
      { label: 'Utilization', description: '% gebuchte Zeit' },
      { label: 'Jobs/Tag', description: 'Ø Jobs pro Tag' }
    ]
  },
  killswitch: {
    title: 'Kill Switch',
    description: 'Notfall-Stopps',
    explanation: 'Automatische Schutzmechanismen. Wenn eine Metrik kritisch wird (z.B. CPL > 90), wird ein Alert ausgelöst. Das schützt dich vor Geldverbrennung.',
    tips: [
      'CPL > 90: Ads pausieren',
      'CM2 < 20%: Preise prüfen',
      'Claims > 5%: Qualität checken'
    ],
    metrics: [
      { label: 'CPL', description: 'Cost per Lead' },
      { label: 'CM2', description: 'Contribution Margin 2' },
      { label: 'Claims', description: 'Schadensmeldungen %' }
    ]
  },
  forecast: {
    title: 'Prognose',
    description: '6-Monats-Vorhersage',
    explanation: 'Zeigt die erwartete Umsatzentwicklung für 6 Monate, aufgeteilt nach Marken. Umzugssaison (Apr-Jun) zeigt höhere Zahlen.',
    tips: [
      'April-Juni ist Hochsaison',
      'Vergleiche Szenarien',
      'Gestrichelte Linie = Ziel'
    ],
    metrics: [
      { label: 'Target', description: 'Umsatzziel/Monat' },
      { label: 'ROAS', description: 'Revenue pro Werbe-CHF' }
    ]
  },
  partners: {
    title: 'Partner',
    description: 'Marketplace Partner',
    explanation: 'Übersicht aller Partner-Firmen im Marketplace. Scarcity-Regeln begrenzen Partner pro Region. Dispute Rate >15% → Probation.',
    tips: [
      'Response Time <60min',
      'Accept Rate >70%',
      'Dispute Rate <15%'
    ],
    metrics: [
      { label: 'Response', description: 'Antwortzeit (min)' },
      { label: 'Accept', description: 'Annahmerate %' },
      { label: 'Dispute', description: 'Streitfälle %' }
    ]
  },
  funnel: {
    title: 'Funnel',
    description: 'Vom Besucher zur Buchung',
    explanation: 'Website → Calculator → Lead → Offerte → Gebucht. Jede Stufe zeigt die Conversion Rate.',
    tips: [
      'Website→Calc: 15-20%',
      'Calc→Lead: 20-25%',
      'Quote→Booked: 55%+'
    ],
    metrics: [
      { label: 'Conv. Rate', description: '% zur nächsten Stufe' },
      { label: 'Drop-off', description: '% Absprung' }
    ]
  },
  costs: {
    title: 'Kosten',
    description: 'Unit Economics',
    explanation: 'Zeigt wohin dein Geld fliesst: Personal (~55%), Fahrzeug (~12%), Marketing (~17%), Overhead (~16%).',
    tips: [
      'Personal ist der grösste Hebel',
      'CPL-Monitoring für Marketing',
      'CM2/Job ≥ CHF 500'
    ],
    metrics: [
      { label: 'COGS', description: 'Direkte Kosten/Auftrag' },
      { label: 'CM2/Job', description: 'Gewinn pro Auftrag' }
    ]
  },
  simulator: {
    title: 'Simulator',
    description: 'What-if Analyse',
    explanation: 'Teste verschiedene Szenarien: Was passiert wenn CPL steigt? Was bringt eine höhere Close Rate? Der Simulator berechnet sofort.',
    tips: [
      'Nutze die Presets als Start',
      'ROAS ≥ 4x ist nachhaltig',
      'CAC = max. Kosten pro Kunde'
    ],
    metrics: [
      { label: 'CAC', description: 'Customer Acquisition Cost' },
      { label: 'ROAS', description: 'Return on Ad Spend' },
      { label: 'ROI', description: 'Return on Investment' }
    ]
  },
  weekly: {
    title: 'Wochen-Report',
    description: 'Automatische Berichte',
    explanation: 'Wochenberichte mit KPIs, Highlights, Warnungen und Action Items. Vergleiche Wochen miteinander.',
    tips: [
      'Grün = Ziele erreicht',
      'Action Items abhaken',
      'PDF für Meetings'
    ],
    metrics: [
      { label: 'WoW', description: 'Week-over-Week Vergleich' },
      { label: 'Highlights', description: 'Positive Entwicklungen' }
    ]
  }
};
