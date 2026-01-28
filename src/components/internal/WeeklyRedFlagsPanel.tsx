/**
 * Weekly Red Flags Monitoring Panel
 * Early warning system based on ChatGPT analysis
 * 
 * Key red flags to monitor:
 * - Lead quality dip
 * - Rising CPL/CPA
 * - Call center overload  
 * - Conversion rate drop
 * - Operational overload
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Phone,
  Users,
  Activity,
  Target,
  Clock,
  Ban,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RedFlagMetrics {
  // Lead Quality
  leadQualityScore: number; // 0-100
  leadQualityTrend: 'up' | 'down' | 'stable';
  invalidLeadRate: number; // %
  
  // Cost Metrics
  currentCPL: number;
  baselineCPL: number;
  currentCPA: number;
  baselineCPA: number;
  
  // Call Center
  avgCallDuration: number; // minutes
  targetCallDuration: number;
  callBacklog: number;
  responseTimeHours: number;
  
  // Conversion
  currentConversionRate: number;
  baselineConversionRate: number;
  
  // Operations
  capacityUtilization: number;
  customerSatisfactionScore: number;
  complaintRate: number;
}

interface WeeklyRedFlagsPanelProps {
  metrics: RedFlagMetrics;
  model: 'feierabend' | 'umzugscheck';
}

interface RedFlag {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  metric: string;
  threshold: string;
  icon: React.ElementType;
}

export function WeeklyRedFlagsPanel({ metrics, model }: WeeklyRedFlagsPanelProps) {
  const detectRedFlags = (): RedFlag[] => {
    const flags: RedFlag[] = [];
    
    // 1. Lead Quality Dip
    if (metrics.leadQualityScore < 60 || metrics.invalidLeadRate > 20) {
      flags.push({
        id: 'lead_quality',
        category: 'Lead Quality',
        title: 'Lead-Qualität kritisch',
        description: 'Hoher Anteil ungültiger oder unqualifizierter Leads. Targeting prüfen.',
        severity: metrics.leadQualityScore < 50 ? 'critical' : 'warning',
        metric: `Quality: ${metrics.leadQualityScore}% | Invalid: ${metrics.invalidLeadRate}%`,
        threshold: 'Quality ≥ 70%, Invalid < 15%',
        icon: Users,
      });
    }
    
    // 2. Rising CPL
    const cplIncrease = ((metrics.currentCPL - metrics.baselineCPL) / metrics.baselineCPL) * 100;
    if (cplIncrease > 20) {
      flags.push({
        id: 'cpl_spike',
        category: 'Paid Media',
        title: 'CPL-Anstieg',
        description: `CPL ${cplIncrease.toFixed(0)}% über Baseline. Kampagnen oder Bidding anpassen.`,
        severity: cplIncrease > 40 ? 'critical' : 'warning',
        metric: `Aktuell: CHF ${metrics.currentCPL} | Baseline: CHF ${metrics.baselineCPL}`,
        threshold: 'Max +20% über Baseline',
        icon: TrendingUp,
      });
    }
    
    // 3. Rising CPA
    const cpaIncrease = ((metrics.currentCPA - metrics.baselineCPA) / metrics.baselineCPA) * 100;
    if (cpaIncrease > 25) {
      flags.push({
        id: 'cpa_spike',
        category: 'Paid Media',
        title: 'CPA-Anstieg',
        description: `CPA ${cpaIncrease.toFixed(0)}% über Baseline. Conversion Funnel prüfen.`,
        severity: cpaIncrease > 50 ? 'critical' : 'warning',
        metric: `Aktuell: CHF ${metrics.currentCPA} | Baseline: CHF ${metrics.baselineCPA}`,
        threshold: 'Max +25% über Baseline',
        icon: TrendingUp,
      });
    }
    
    // 4. Call Center Overload
    if (metrics.avgCallDuration > metrics.targetCallDuration * 1.5 || metrics.callBacklog > 10) {
      flags.push({
        id: 'call_overload',
        category: 'Operations',
        title: 'Call Center überlastet',
        description: 'Zu lange Anrufe oder Rückstau. Kapazität erhöhen oder Leads drosseln.',
        severity: metrics.callBacklog > 20 ? 'critical' : 'warning',
        metric: `Avg: ${metrics.avgCallDuration}min | Backlog: ${metrics.callBacklog}`,
        threshold: `Max ${metrics.targetCallDuration * 1.5}min | Backlog < 10`,
        icon: Phone,
      });
    }
    
    // 5. Slow Response Time
    if (metrics.responseTimeHours > 2) {
      flags.push({
        id: 'slow_response',
        category: 'Operations',
        title: 'Langsame Reaktionszeit',
        description: 'Leads werden nicht schnell genug kontaktiert. Conversion sinkt.',
        severity: metrics.responseTimeHours > 4 ? 'critical' : 'warning',
        metric: `${metrics.responseTimeHours.toFixed(1)}h durchschnittlich`,
        threshold: '< 1h optimal, max 2h',
        icon: Clock,
      });
    }
    
    // 6. Conversion Rate Drop
    const conversionDrop = ((metrics.baselineConversionRate - metrics.currentConversionRate) / metrics.baselineConversionRate) * 100;
    if (conversionDrop > 15) {
      flags.push({
        id: 'conversion_drop',
        category: 'Sales',
        title: 'Conversion-Einbruch',
        description: `Conversion ${conversionDrop.toFixed(0)}% unter Baseline. Lead-Qualität oder Prozess prüfen.`,
        severity: conversionDrop > 30 ? 'critical' : 'warning',
        metric: `Aktuell: ${metrics.currentConversionRate}% | Baseline: ${metrics.baselineConversionRate}%`,
        threshold: 'Max -15% unter Baseline',
        icon: TrendingDown,
      });
    }
    
    // 7. Operational Overload
    if (metrics.capacityUtilization > 90) {
      flags.push({
        id: 'capacity_overload',
        category: 'Operations',
        title: 'Kapazitätsgrenze erreicht',
        description: 'Hohe Auslastung gefährdet Qualität. Marketing drosseln oder Kapazität erhöhen.',
        severity: metrics.capacityUtilization > 95 ? 'critical' : 'warning',
        metric: `${metrics.capacityUtilization}% Auslastung`,
        threshold: '< 85% empfohlen',
        icon: Activity,
      });
    }
    
    // 8. Customer Satisfaction Drop
    if (metrics.customerSatisfactionScore < 80 || metrics.complaintRate > 5) {
      flags.push({
        id: 'satisfaction_drop',
        category: 'Quality',
        title: 'Kundenzufriedenheit sinkt',
        description: 'Qualitätsprobleme können zu schlechten Reviews und niedrigerer Conversion führen.',
        severity: metrics.customerSatisfactionScore < 70 ? 'critical' : 'warning',
        metric: `CSAT: ${metrics.customerSatisfactionScore}% | Beschwerden: ${metrics.complaintRate}%`,
        threshold: 'CSAT ≥ 85%, Beschwerden < 3%',
        icon: Target,
      });
    }
    
    return flags;
  };
  
  const redFlags = detectRedFlags();
  const criticalCount = redFlags.filter(f => f.severity === 'critical').length;
  const warningCount = redFlags.filter(f => f.severity === 'warning').length;
  const hasRedFlags = redFlags.length > 0;
  
  // Overall status
  let overallStatus: 'healthy' | 'attention' | 'critical';
  if (criticalCount > 0) {
    overallStatus = 'critical';
  } else if (warningCount >= 2) {
    overallStatus = 'attention';
  } else {
    overallStatus = 'healthy';
  }
  
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Weekly Red Flags
          </CardTitle>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <Ban className="w-3 h-3" />
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                <AlertTriangle className="w-3 h-3" />
                {warningCount} Warning
              </Badge>
            )}
            {!hasRedFlags && (
              <Badge variant="outline" className="border-green-500 text-green-600 gap-1">
                <CheckCircle2 className="w-3 h-3" />
                All Clear
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status Bar */}
        <div className={cn(
          "p-3 rounded-lg border flex items-center justify-between",
          overallStatus === 'healthy' && "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
          overallStatus === 'attention' && "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
          overallStatus === 'critical' && "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              overallStatus === 'healthy' && "bg-green-500",
              overallStatus === 'attention' && "bg-amber-500 animate-pulse",
              overallStatus === 'critical' && "bg-red-500 animate-pulse",
            )} />
            <span className={cn(
              "font-medium text-sm",
              overallStatus === 'healthy' && "text-green-700 dark:text-green-400",
              overallStatus === 'attention' && "text-amber-700 dark:text-amber-400",
              overallStatus === 'critical' && "text-red-700 dark:text-red-400",
            )}>
              {overallStatus === 'healthy' && 'Keine kritischen Probleme'}
              {overallStatus === 'attention' && 'Aufmerksamkeit erforderlich'}
              {overallStatus === 'critical' && 'Sofortige Massnahmen erforderlich'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {redFlags.length} Red Flag{redFlags.length !== 1 ? 's' : ''} erkannt
          </span>
        </div>
        
        {/* Red Flags List */}
        {hasRedFlags ? (
          <div className="space-y-3">
            {redFlags.map((flag) => {
              const Icon = flag.icon;
              return (
                <div 
                  key={flag.id}
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    flag.severity === 'critical' && "bg-red-50 border-l-red-500 dark:bg-red-950/20",
                    flag.severity === 'warning' && "bg-amber-50 border-l-amber-500 dark:bg-amber-950/20",
                    flag.severity === 'info' && "bg-blue-50 border-l-blue-500 dark:bg-blue-950/20",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn(
                      "w-5 h-5 mt-0.5 flex-shrink-0",
                      flag.severity === 'critical' && "text-red-600",
                      flag.severity === 'warning' && "text-amber-600",
                      flag.severity === 'info' && "text-blue-600",
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "font-semibold text-sm",
                          flag.severity === 'critical' && "text-red-800 dark:text-red-200",
                          flag.severity === 'warning' && "text-amber-800 dark:text-amber-200",
                        )}>
                          {flag.title}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5">
                          {flag.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {flag.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="font-mono">
                          <span className="text-muted-foreground">Aktuell:</span>{' '}
                          <span className={cn(
                            "font-medium",
                            flag.severity === 'critical' && "text-red-700",
                            flag.severity === 'warning' && "text-amber-700",
                          )}>
                            {flag.metric}
                          </span>
                        </span>
                        <span className="font-mono text-muted-foreground">
                          Schwelle: {flag.threshold}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="font-medium">Keine Red Flags erkannt</p>
            <p className="text-sm">Alle überwachten Metriken im grünen Bereich</p>
          </div>
        )}
        
        {/* Quick Reference */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Überwachte Kategorien</p>
          <div className="flex flex-wrap gap-2">
            {['Lead Quality', 'Paid Media', 'Operations', 'Sales', 'Quality'].map(cat => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
