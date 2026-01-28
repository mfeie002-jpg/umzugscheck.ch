/**
 * Command Center Help System
 * Mobile-first expandable help for all sections
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, Lightbulb, BookOpen, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface SectionHelpProps {
  title: string;
  icon: React.ElementType;
  description: string;
  explanation: string;
  tips?: string[];
  metrics?: { label: string; description: string }[];
  handbookLink?: string;
}

export function SectionHelp({ 
  title, 
  icon: Icon, 
  description, 
  explanation,
  tips = [],
  metrics = [],
  handbookLink,
}: SectionHelpProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="space-y-3 mb-4">
      {/* Title Row - Mobile Optimized */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-bold truncate">{title}</h3>
            <p className="text-muted-foreground text-xs truncate">{description}</p>
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
            {showHelp ? 'Schliessen' : 'Wie?'}
          </span>
        </Button>
      </div>

      {/* Expandable Help Section */}
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

              {/* Metrics Explanation */}
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
                    <Lightbulb className="h-4 w-4 text-warning" />
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

              {/* Handbook Link */}
              {handbookLink && (
                <div className="pt-2 border-t">
                  <a 
                    href={handbookLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Mehr im Handbuch
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Pre-defined help configurations for Command Center sections
 */
export const COMMAND_CENTER_HELP = {
  globalStatus: {
    title: 'Status-Ampel',
    description: 'SCALE / HOLD / STOP Entscheidung',
    explanation: 'Die globale Statusanzeige zeigt dir sofort, ob du Gas geben (SCALE), optimieren (HOLD) oder stoppen (STOP) sollst. Sie basiert auf den wichtigsten KPIs: CPL, CM2, Auslastung und Cash Runway.',
    tips: [
      '🟢 SCALE: Alle KPIs grün → Ads-Budget erhöhen',
      '🟡 HOLD: Einzelne KPIs gelb → erst optimieren',
      '🔴 STOP: Kill-Switch ausgelöst → sofort handeln',
    ],
    metrics: [
      { label: 'CPL 7d', description: 'Cost per Lead im 7-Tage-Schnitt' },
      { label: 'CM2', description: 'Contribution Margin 2 (Gewinn nach Ops)' },
      { label: 'Util', description: 'Crew-Auslastung in %' },
      { label: 'Runway', description: 'Cash reicht für X Monate' },
    ],
    handbookLink: '/admin/handbuch',
  },

  operatorDecision: {
    title: 'Operator-Entscheidung',
    description: 'Was heute zu tun ist',
    explanation: 'Basierend auf allen Daten bekommst du eine klare Handlungsempfehlung mit konkreten Actions für heute. Die "WHY"-Spalte erklärt die Gründe, "DO TODAY" zeigt die nächsten Schritte.',
    tips: [
      'Bei SCALE: +20% Budget, neue Ad-Varianten testen',
      'Bei HOLD: Landing Page CVR prüfen, Targeting verbessern',
      'Bei STOP: Sofort Ads pausieren, Leads analysieren',
    ],
    metrics: [
      { label: 'WHY', description: 'Gründe für die Entscheidung' },
      { label: 'DO TODAY', description: 'Konkrete Aktionen' },
    ],
  },

  killSwitchAlerts: {
    title: 'Kill Switches',
    description: 'Automatische Schutzmechanismen',
    explanation: 'Kill Switches sind harte Grenzen, die automatisch Alarm schlagen. Wenn ein Wert überschritten wird, solltest du sofort reagieren um Geld zu schützen.',
    tips: [
      'CPL > CHF 90 (7d): Ads pausieren',
      'CM2 < 20% (5 Jobs): Preise/Ops prüfen',
      'Claims > 5% Revenue: Qualität stoppen',
      'Cash < 1 Monat: Notfall-Modus',
    ],
    metrics: [
      { label: 'Trigger', description: 'Wann löst der Switch aus?' },
      { label: 'Action', description: 'Was sofort tun?' },
    ],
    handbookLink: '/admin/handbuch',
  },

  executiveSnapshot: {
    title: 'Executive Snapshot',
    description: 'KPI-Übersicht auf einen Blick',
    explanation: 'Die wichtigsten Business-KPIs für 7 und 30 Tage: Revenue, CM2, CAC, AOV, Jobs und Marketplace-Marge. Vergleiche die Zeiträume um Trends zu erkennen.',
    tips: [
      '7d-Werte für aktuelle Trends',
      '30d-Werte für stabile Basis',
      'CM2 > 25% anstreben',
    ],
    metrics: [
      { label: 'Revenue', description: 'Umsatz im Zeitraum' },
      { label: 'CM2 %', description: 'Marge nach allen variablen Kosten' },
      { label: 'Blended CAC', description: 'Durchschnittliche Kundengewinnungskosten' },
    ],
  },

  unitEconomics: {
    title: 'Unit Economics',
    description: 'Kosten und Margen pro Marke',
    explanation: 'Berechne für jede Marke (Feierabend, Umzugexpress, Zügelhelden) und den Marketplace die Unit Economics. Ändere die Inputs und sieh sofort die Auswirkungen auf CM2.',
    tips: [
      'Feierabend: Höchste Preise, beste Marge',
      'Umzugexpress: Schnell, mittlere Marge',
      'Zügelhelden: Volumen, tiefste Marge',
      'Max CPL beachten = Obergrenze für Ads',
    ],
    metrics: [
      { label: 'AOV', description: 'Average Order Value netto' },
      { label: 'COGS', description: 'Cost of Goods Sold' },
      { label: 'Max CPL', description: 'Maximaler CPL für Profitabilität' },
    ],
    handbookLink: '/admin/handbuch',
  },

  leadScoring: {
    title: 'Lead Scoring & Routing',
    description: 'Wie Leads verteilt werden',
    explanation: 'Der Lead Scoring Simulator zeigt, wie Leads basierend auf Zimmer, Distanz, Services, Budget-Einstellung und Kapazität geroutet werden. Premium-Leads (Score ≥65) gehen zuerst zu Feierabend.',
    tips: [
      'Score > 65: Premium → Feierabend',
      'Score 40-65: Standard → alle Marken',
      'Score < 40: Budget → Zügelhelden',
      'Kapazität beeinflusst Routing',
    ],
    metrics: [
      { label: 'Score', description: 'Lead-Qualität 0-100' },
      { label: 'Route', description: 'Welche Marke bekommt den Lead' },
    ],
  },

  distributionEngine: {
    title: 'Distribution & Auktion',
    description: 'Marketplace Lead-Verteilung',
    explanation: 'Zeigt wie Leads im Marketplace verteilt werden: Bidding-Auktion, Partner-Matching und Scarcity-Regeln. Premium-Partner haben Vorrang.',
    tips: [
      'Premium-Partner: First-Look + Rabatt',
      'Standard: Competitive Bidding',
      'Budget: Bulk-Leads',
    ],
    metrics: [
      { label: 'Bid', description: 'Gebot des Partners' },
      { label: 'Fill Rate', description: '% Leads die vergeben werden' },
    ],
  },

  partnerNetwork: {
    title: 'Partner Network',
    description: 'Marketplace-Partner Status',
    explanation: 'Übersicht aller Partner im Marketplace mit Response Time, Accept Rate und Dispute Rate. Partner mit schlechten Werten werden automatisch degradiert.',
    tips: [
      'Response < 60min halten',
      'Accept Rate > 70% anstreben',
      'Dispute > 15% = Probation',
    ],
    metrics: [
      { label: 'Response', description: 'Ø Antwortzeit Minuten' },
      { label: 'Accept', description: '% angenommene Leads' },
      { label: 'Dispute', description: '% Streitfälle' },
    ],
  },

  roadmapTracker: {
    title: '90-Day Roadmap',
    description: 'Launch-Phasen und Meilensteine',
    explanation: 'Der 90-Tage-Plan mit Phase 1 (Validation), Phase 2 (Optimization) und Phase 3 (Scale). Jede Woche hat klare KPIs und Go/No-Go-Kriterien.',
    tips: [
      'Woche 1-4: CPL < 60, Close > 20%',
      'Woche 5-8: Marketplace CPL < 45',
      'Woche 9-12: CM2 > 35%, ROAS > 400%',
    ],
    metrics: [
      { label: 'Phase', description: 'Validation → Optimization → Scale' },
      { label: 'Gate', description: 'Go/No-Go Kriterium' },
    ],
    handbookLink: '/admin/handbuch',
  },

  financeControl: {
    title: 'Finance & Cash',
    description: 'P&L, Cash Runway, Claims',
    explanation: 'Tägliche P&L-Übersicht, Cash-on-Hand, monatliche Fixkosten und Claims/Refunds. Der Cash Runway zeigt, wie lange das Geld reicht.',
    tips: [
      'Runway > 6 Monate = sicher',
      'Runway 2-6 Monate = Vorsicht',
      'Runway < 2 Monate = Notfall',
    ],
    metrics: [
      { label: 'Cash', description: 'Aktueller Kontostand' },
      { label: 'Burn', description: 'Monatliche Ausgaben' },
      { label: 'Runway', description: 'Monate bis Cash = 0' },
    ],
  },
};
