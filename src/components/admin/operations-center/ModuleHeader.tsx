/**
 * Module Header Component
 * Provides consistent headers with explanations for each module
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
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
    <div className="space-y-4 mb-6">
      {/* Title Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
        <Button 
          variant={showHelp ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? <X className="h-4 w-4 mr-1" /> : <HelpCircle className="h-4 w-4 mr-1" />}
          {showHelp ? 'Schliessen' : 'Wie funktioniert das?'}
        </Button>
      </div>

      {/* Expandable Help Section */}
      {showHelp && (
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="space-y-4">
              {/* Main Explanation */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  Was ist das?
                </h4>
                <p className="text-sm text-muted-foreground">{explanation}</p>
              </div>

              {/* Metrics Explanation */}
              {metrics.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">📊 Metriken erklärt</h4>
                  <div className="grid gap-2">
                    {metrics.map((metric, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <Badge variant="outline" className="shrink-0">{metric.label}</Badge>
                        <span className="text-muted-foreground">{metric.description}</span>
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
                  <ul className="space-y-1">
                    {tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {tip}
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
    description: 'Side-by-side Vergleich aller 3 Marken',
    explanation: 'Hier siehst du die Performance deiner 3 Umzugsmarken: Feierabend (Premium), Umzugexpress (Speed) und Zügelhelden (Budget). Jede Marke hat unterschiedliche Zielgruppen und Margen.',
    tips: [
      'Feierabend sollte die höchste Marge haben (35%+ CM2)',
      'Umzugexpress wächst durch schnelle Reaktionszeiten',
      'Zügelhelden bringt Volumen, aber niedrigere Margen'
    ],
    metrics: [
      { label: 'CM2', description: 'Contribution Margin 2 - Gewinn nach allen operativen Kosten' },
      { label: 'Conv. Rate', description: 'Prozentsatz der Leads, die zu Buchungen werden' },
      { label: 'Revenue', description: 'Umsatz dieser Marke im aktuellen Monat' }
    ]
  },
  routing: {
    title: 'Lead Routing',
    description: 'Automatische Verteilung von Leads auf Marken',
    explanation: 'Das System routet eingehende Leads automatisch zur passenden Marke basierend auf Lead-Score, geschätztem Wert, Dringlichkeit und Budget-Sensitivität. Premium-Leads (Score ≥65, Wert ≥CHF 1800) gehen zu Feierabend.',
    tips: [
      'Klicke auf eine Marken-Karte um nur deren Leads zu sehen',
      'Urgent-Leads gehen automatisch zu Umzugexpress',
      'Budget-sensitive Leads werden zu Zügelhelden geleitet'
    ],
    metrics: [
      { label: 'Score', description: 'Lead-Qualitätsscore von 0-100 (höher = besser)' },
      { label: 'Wert', description: 'Geschätzter Auftragswert in CHF' },
      { label: 'Status', description: 'Aktueller Stand: Pending → Kontaktiert → Offerte → Gebucht' }
    ]
  },
  capacity: {
    title: 'Kapazitäts-Planer',
    description: 'Crew-Auslastung und Verfügbarkeit',
    explanation: 'Zeigt wie ausgelastet deine Crews sind. Bei 80-95% Auslastung bist du optimal. Unter 60% solltest du Rabatte anbieten, über 95% Peak-Preise verlangen. Nach 4 Wochen >85% Auslastung: Crew #2 einstellen!',
    tips: [
      'Grün (80-95%) = Optimale Auslastung',
      'Gelb (60-80%) = Raum für mehr Jobs oder Rabattaktionen',
      'Rot (>95%) = Überlastet, Peak-Pricing aktivieren'
    ],
    metrics: [
      { label: 'Utilization', description: 'Prozent der verfügbaren Zeit, die gebucht ist' },
      { label: 'Jobs/Tag', description: 'Durchschnittliche Anzahl Jobs pro Arbeitstag' },
      { label: 'Scale Trigger', description: 'Automatischer Hinweis wann du skalieren solltest' }
    ]
  },
  killswitch: {
    title: 'Kill Switch Monitor',
    description: 'Automatische Notfall-Stopps bei kritischen Metriken',
    explanation: 'Kill Switches sind automatische Schutzmechanismen. Wenn eine Metrik kritische Werte erreicht (z.B. CPL > CHF 90), wird ein Alert ausgelöst und die empfohlene Aktion angezeigt. Das schützt dich vor Geldverbrennung.',
    tips: [
      'CPL > 90: Sofort Google Ads pausieren',
      'CM2 < 20%: Operationen stoppen und Preise prüfen',
      'Claims > 5%: Qualitätsproblem - Operations Review'
    ],
    metrics: [
      { label: 'CPL', description: 'Cost per Lead - Was kostet dich ein neuer Lead?' },
      { label: 'CM2', description: 'Contribution Margin 2 - Gewinn nach Ops-Kosten' },
      { label: 'Claims', description: 'Schadensmeldungen als % vom Revenue' },
      { label: 'Runway', description: 'Monate bis Cash aufgebraucht ist' }
    ]
  },
  forecast: {
    title: 'Revenue Prognose',
    description: '6-Monats-Vorhersage nach Marke',
    explanation: 'Zeigt die erwartete Umsatzentwicklung für die nächsten 6 Monate, aufgeteilt nach Marken. Umzugssaison (Apr-Jun) zeigt typisch höhere Zahlen. Die gestrichelte Linie ist dein Ziel.',
    tips: [
      'Die Stacked-Ansicht zeigt den Beitrag jeder Marke',
      'Vergleiche mit den Szenarien (Pessimistisch/Basis/Optimistisch)',
      'April-Juni ist Hochsaison - plane entsprechend'
    ],
    metrics: [
      { label: 'Target', description: 'Dein gesetztes Umsatzziel pro Monat' },
      { label: 'Probability', description: 'Wahrscheinlichkeit dass dieses Szenario eintritt' },
      { label: 'ROAS', description: 'Return on Ad Spend - Revenue pro CHF Werbebudget' }
    ]
  },
  partners: {
    title: 'Partner Network',
    description: 'Marketplace Partner Status und Performance',
    explanation: 'Übersicht über alle Partner-Umzugsfirmen im Marketplace. Scarcity-Regeln begrenzen Partner pro Region (z.B. max 5 in Zürich). Partner mit hoher Dispute Rate (>15%) werden automatisch auf Probation gesetzt.',
    tips: [
      'Response Time unter 60min ist optimal',
      'Accept Rate sollte über 70% liegen',
      'Dispute Rate >15% führt zu automatischer Probation'
    ],
    metrics: [
      { label: 'Response', description: 'Durchschnittliche Antwortzeit in Minuten' },
      { label: 'Accept %', description: 'Prozent der Leads, die der Partner annimmt' },
      { label: 'Dispute', description: 'Streitfälle als % der zugewiesenen Leads' }
    ]
  },
  funnel: {
    title: 'Conversion Funnel',
    description: 'Vom Website-Besucher zur Buchung',
    explanation: 'Visualisiert den Weg deiner Kunden: Website-Besuch → Calculator gestartet → Lead eingereicht → Offerte gesendet → Gebucht. Jede Stufe zeigt die Conversion Rate zur nächsten Stufe.',
    tips: [
      'Website → Calculator: 15-20% ist gut',
      'Calculator → Lead: 20-25% ist Benchmark',
      'Quote → Booked: 55%+ zeigt gute Sales-Arbeit'
    ],
    metrics: [
      { label: 'Conv. Rate', description: 'Prozent die zur nächsten Stufe kommen' },
      { label: 'Drop-off', description: 'Prozent die an dieser Stufe abspringen' },
      { label: 'Benchmark', description: 'Industriestandard zum Vergleich' }
    ]
  },
  costs: {
    title: 'Kostenstruktur',
    description: 'COGS Breakdown und Unit Economics',
    explanation: 'Zeigt wohin dein Geld fliesst: Personal (~55%), Fahrzeug (~12%), Marketing (~17%), Overhead (~16%). Die Unit Economics zeigen was ein durchschnittlicher Job kostet und einbringt.',
    tips: [
      'Personal ist der grösste Hebel - Effizienz optimieren',
      'Marketing-Kosten sollten durch CPL-Monitoring im Griff sein',
      'CM2 pro Job sollte mindestens CHF 500 sein'
    ],
    metrics: [
      { label: 'COGS', description: 'Cost of Goods Sold - direkte Kosten pro Auftrag' },
      { label: 'Gross Margin', description: 'Umsatz minus alle Kosten in Prozent' },
      { label: 'CM2/Job', description: 'Contribution Margin 2 pro einzelnem Auftrag' }
    ]
  },
  simulator: {
    title: 'Szenario Simulator',
    description: 'What-if Analyse für Business-Entscheidungen',
    explanation: 'Hier kannst du mit den Reglern verschiedene Szenarien durchspielen: Was passiert wenn CPL steigt? Was bringt eine höhere Close Rate? Der Simulator berechnet sofort Leads, Jobs, Revenue und Profit.',
    tips: [
      'Nutze die Presets (Konservativ/Basis/Optimistisch) als Startpunkt',
      'ROAS sollte mindestens 4x sein für nachhaltiges Wachstum',
      'Profitabler CAC = Maximaler Betrag den du pro Kunde ausgeben darfst'
    ],
    metrics: [
      { label: 'CAC', description: 'Customer Acquisition Cost - Kosten um einen Kunden zu gewinnen' },
      { label: 'ROAS', description: 'Return on Ad Spend - Revenue pro Werbe-CHF' },
      { label: 'ROI', description: 'Return on Investment - Gewinn nach Abzug aller Kosten' }
    ]
  },
  weekly: {
    title: 'Wochen-Summary',
    description: 'Automatisierte Wochenberichte',
    explanation: 'Automatisch generierte Wochenberichte mit allen wichtigen KPIs, Highlights, Warnungen und Action Items. Vergleiche Wochen miteinander und exportiere als PDF oder sende per E-Mail.',
    tips: [
      'Grünes Badge = Alle Ziele erreicht',
      'Action Items abhaken wenn erledigt',
      'PDF Export für Team-Meetings nutzen'
    ],
    metrics: [
      { label: 'WoW', description: 'Week-over-Week - Vergleich zur Vorwoche' },
      { label: 'Highlights', description: 'Positive Entwicklungen dieser Woche' },
      { label: 'Warnings', description: 'Metriken die unter dem Ziel liegen' }
    ]
  }
};
