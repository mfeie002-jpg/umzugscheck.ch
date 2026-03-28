/**
 * Phone Support ROI Rules Panel
 * Hard rules for call center based on ChatGPT analysis
 * 
 * Key rules:
 * - Qualify before deep engagement
 * - Time capping (5-10 min max initial call)
 * - Deposit for high-touch service
 * - Focus calls on high-ROI leads
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Clock, 
  Wallet,
  Target,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Timer,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CallMetrics {
  avgCallDuration: number; // minutes
  callsPerDay: number;
  conversionFromCall: number; // %
  costPerCallMinute: number; // CHF
  avgJobValueFromCall: number; // CHF
}

interface PhoneSupportROIRulesProps {
  metrics?: CallMetrics;
}

const HARD_RULES = [
  {
    id: 'qualify_first',
    category: 'Qualification',
    title: 'Qualify before deep engagement',
    description: 'Kurze Vorqualifikation (< 2min) bevor ausführliches Gespräch.',
    icon: Target,
    implementation: [
      'Budget-Erwartung abfragen (< CHF 800 = Ablehnen)',
      'Umzugsdatum validieren (> 3 Monate = Marketplace)',
      '"Just browsing" erkennen → max 3min',
    ],
  },
  {
    id: 'time_cap',
    category: 'Time Management',
    title: 'Strikte Zeitlimits',
    description: 'Initial-Call max 5-10min. Folge-Calls nur bei konkretem Interesse.',
    icon: Timer,
    implementation: [
      'Whale-Kunden (> CHF 2\'200): 8-10 min',
      'Marketplace-Routing: 2-3 min',
      'Bei Stagnation: Callback vereinbaren',
    ],
  },
  {
    id: 'deposit_high_touch',
    category: 'Monetization',
    title: 'Deposit für High-Touch Service',
    description: 'Concierge-Kunden zahlen CHF 50-100 Anzahlung (verrechenbar).',
    icon: Wallet,
    implementation: [
      'Besichtigung vor Ort: CHF 50 Deposit',
      'Full-Service Concierge: CHF 100 Deposit',
      'Abzug vom finalen Preis wenn Buchung',
    ],
  },
  {
    id: 'focus_high_roi',
    category: 'Prioritization',
    title: 'Fokus auf High-ROI Leads',
    description: 'Ressourcen auf wertvolle Leads konzentrieren.',
    icon: DollarSign,
    implementation: [
      'Google Search > Meta (höhere Intent)',
      'Grosse Wohnungen > Studios',
      'Referrals > Cold Leads',
    ],
  },
];

const ANTI_PATTERNS = [
  {
    title: 'Jeder Lead gleich behandeln',
    description: 'Verschwendet Zeit auf unprofitable Anfragen',
    cost: 'CHF 60-90 pro verlorener Stunde',
  },
  {
    title: 'Keine Zeitlimits',
    description: '30min Calls für CHF 800 Jobs',
    cost: 'Negativ-Marge pro Buchung',
  },
  {
    title: 'Gratis Concierge',
    description: 'Beratung ohne Commitment',
    cost: 'Hohe Opportunitätskosten',
  },
];

export function PhoneSupportROIRules({ metrics }: PhoneSupportROIRulesProps) {
  // Calculate ROI if metrics provided
  const callROI = metrics ? {
    costPerCall: metrics.avgCallDuration * metrics.costPerCallMinute,
    revenuePerCall: (metrics.conversionFromCall / 100) * metrics.avgJobValueFromCall,
    roiPerCall: 0,
  } : null;
  
  if (callROI) {
    callROI.roiPerCall = callROI.revenuePerCall - callROI.costPerCall;
  }
  
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Phone Support ROI Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ROI Summary (if metrics provided) */}
        {callROI && (
          <div className={cn(
            "p-4 rounded-lg border-2",
            callROI.roiPerCall > 50 ? "bg-green-50 border-green-200 dark:bg-green-950/30" :
            callROI.roiPerCall > 0 ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30" :
            "bg-red-50 border-red-200 dark:bg-red-950/30"
          )}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Cost per Call</div>
                <div className="text-xl font-bold font-mono">CHF {callROI.costPerCall.toFixed(0)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Revenue per Call</div>
                <div className="text-xl font-bold font-mono">CHF {callROI.revenuePerCall.toFixed(0)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Net ROI per Call</div>
                <div className={cn(
                  "text-xl font-bold font-mono",
                  callROI.roiPerCall > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {callROI.roiPerCall > 0 ? '+' : ''}CHF {callROI.roiPerCall.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Hard Rules */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Strikte Regeln (non-negotiable)
          </p>
          <div className="space-y-4">
            {HARD_RULES.map((rule) => {
              const Icon = rule.icon;
              return (
                <div key={rule.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-primary/10">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{rule.title}</span>
                        <Badge variant="outline" className="text-[10px]">{rule.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rule.description}</p>
                      <ul className="space-y-1">
                        {rule.implementation.map((impl, idx) => (
                          <li key={idx} className="text-xs flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{impl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Anti-Patterns */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-red-500" />
            Zu vermeiden (Margin Killers)
          </p>
          <div className="space-y-2">
            {ANTI_PATTERNS.map((pattern, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-lg border border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800"
              >
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-red-800 dark:text-red-200">{pattern.title}</p>
                    <p className="text-xs text-red-700 dark:text-red-300">{pattern.description}</p>
                    <p className="text-xs font-mono text-red-600 mt-1">Impact: {pattern.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Reference Table */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Call-Zeit Referenz
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Lead-Typ</th>
                <th className="text-center py-2">Max Zeit</th>
                <th className="text-right py-2">Aktion</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2">Whale (≥ CHF 2'200)</td>
                <td className="py-2 text-center font-mono">8-10 min</td>
                <td className="py-2 text-right">
                  <Badge className="bg-green-600 text-[10px]">KEEP</Badge>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2">Mittel (CHF 1'000-2'199)</td>
                <td className="py-2 text-center font-mono">5 min</td>
                <td className="py-2 text-right">
                  <Badge className="bg-blue-600 text-[10px]">ROUTE</Badge>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2">Klein (&lt; CHF 1'000)</td>
                <td className="py-2 text-center font-mono">2-3 min</td>
                <td className="py-2 text-right">
                  <Badge className="bg-amber-500 text-[10px]">MARKETPLACE</Badge>
                </td>
              </tr>
              <tr>
                <td className="py-2">Unqualifiziert</td>
                <td className="py-2 text-center font-mono">1-2 min</td>
                <td className="py-2 text-right">
                  <Badge variant="destructive" className="text-[10px]">REJECT</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
