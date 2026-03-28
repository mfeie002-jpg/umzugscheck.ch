/**
 * Scaling Decision Panel
 * Go/No-Go criteria for scaling paid media based on ChatGPT analysis
 * 
 * Critical thresholds:
 * - CAC < 30% of Revenue
 * - Stable conversion rate (not volatile)
 * - Capacity available
 * - Cash cushion (2-3 months runway)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Rocket,
  Pause,
  TrendingUp,
  Users,
  Wallet,
  Gauge
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScalingCriteria {
  cacToRevenueRatio: number; // CAC as % of average revenue
  conversionRateStability: number; // 0-100, higher = more stable
  capacityUtilization: number; // 0-100%
  cashRunwayMonths: number;
  avgCloseRate: number;
  cmiiPerJob: number;
}

interface ScalingDecisionPanelProps {
  criteria: ScalingCriteria;
  model: 'feierabend' | 'umzugscheck';
}

interface CriterionResult {
  label: string;
  value: string;
  passed: boolean;
  threshold: string;
  importance: 'critical' | 'high' | 'medium';
}

export function ScalingDecisionPanel({ criteria, model }: ScalingDecisionPanelProps) {
  const evaluateCriteria = (): CriterionResult[] => {
    const results: CriterionResult[] = [];
    
    // 1. CAC < 30% of Revenue (Critical)
    const cacPassed = criteria.cacToRevenueRatio <= 30;
    results.push({
      label: 'CAC / Revenue Ratio',
      value: `${criteria.cacToRevenueRatio.toFixed(1)}%`,
      passed: cacPassed,
      threshold: '≤ 30%',
      importance: 'critical',
    });
    
    // 2. Contribution Margin II per Job (Critical for Direct Mover)
    if (model === 'feierabend') {
      const cmiiPassed = criteria.cmiiPerJob >= 400;
      results.push({
        label: 'CM II pro Auftrag',
        value: `CHF ${criteria.cmiiPerJob.toFixed(0)}`,
        passed: cmiiPassed,
        threshold: '≥ CHF 400',
        importance: 'critical',
      });
    }
    
    // 3. Conversion Rate Stability (High)
    const stabilityPassed = criteria.conversionRateStability >= 70;
    results.push({
      label: 'Conversion Stabilität',
      value: `${criteria.conversionRateStability}%`,
      passed: stabilityPassed,
      threshold: '≥ 70%',
      importance: 'high',
    });
    
    // 4. Close Rate Threshold (High)
    const closeRatePassed = criteria.avgCloseRate >= 15;
    results.push({
      label: 'Durchschn. Close Rate',
      value: `${criteria.avgCloseRate.toFixed(1)}%`,
      passed: closeRatePassed,
      threshold: '≥ 15%',
      importance: 'high',
    });
    
    // 5. Capacity Check (High)
    const capacityPassed = criteria.capacityUtilization < 85;
    results.push({
      label: 'Kapazitätsauslastung',
      value: `${criteria.capacityUtilization}%`,
      passed: capacityPassed,
      threshold: '< 85%',
      importance: 'high',
    });
    
    // 6. Cash Runway (Medium)
    const cashPassed = criteria.cashRunwayMonths >= 3;
    results.push({
      label: 'Cash Runway',
      value: `${criteria.cashRunwayMonths} Monate`,
      passed: cashPassed,
      threshold: '≥ 3 Monate',
      importance: 'medium',
    });
    
    return results;
  };
  
  const results = evaluateCriteria();
  const criticalFailed = results.filter(r => r.importance === 'critical' && !r.passed);
  const highFailed = results.filter(r => r.importance === 'high' && !r.passed);
  const allPassed = results.every(r => r.passed);
  
  // Decision logic
  let decision: 'go' | 'conditional' | 'nogo';
  let decisionLabel: string;
  let decisionDescription: string;
  
  if (criticalFailed.length > 0) {
    decision = 'nogo';
    decisionLabel = 'NO-GO';
    decisionDescription = `${criticalFailed.length} kritische Kriterien nicht erfüllt. Skalierung stoppen.`;
  } else if (highFailed.length >= 2) {
    decision = 'nogo';
    decisionLabel = 'NO-GO';
    decisionDescription = `${highFailed.length} wichtige Kriterien nicht erfüllt. Erst optimieren.`;
  } else if (highFailed.length === 1 || !allPassed) {
    decision = 'conditional';
    decisionLabel = 'CONDITIONAL GO';
    decisionDescription = 'Vorsichtige Skalierung möglich. Schwächen beheben.';
  } else {
    decision = 'go';
    decisionLabel = 'GO';
    decisionDescription = 'Alle Kriterien erfüllt. Skalierung empfohlen.';
  }
  
  const passedCount = results.filter(r => r.passed).length;
  const passedPercentage = (passedCount / results.length) * 100;
  
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Rocket className="w-4 h-4" />
          Scaling Decision Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Decision */}
        <div className={cn(
          "p-4 rounded-lg border-2 flex items-center gap-4",
          decision === 'go' && "bg-green-50 border-green-500 dark:bg-green-950/30",
          decision === 'conditional' && "bg-amber-50 border-amber-500 dark:bg-amber-950/30",
          decision === 'nogo' && "bg-red-50 border-red-500 dark:bg-red-950/30",
        )}>
          {decision === 'go' && <Rocket className="w-8 h-8 text-green-600" />}
          {decision === 'conditional' && <AlertTriangle className="w-8 h-8 text-amber-600" />}
          {decision === 'nogo' && <Pause className="w-8 h-8 text-red-600" />}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={cn(
                "text-lg px-3 py-1",
                decision === 'go' && "bg-green-600",
                decision === 'conditional' && "bg-amber-500",
                decision === 'nogo' && "bg-red-600",
              )}>
                {decisionLabel}
              </Badge>
            </div>
            <p className={cn(
              "text-sm",
              decision === 'go' && "text-green-800 dark:text-green-200",
              decision === 'conditional' && "text-amber-800 dark:text-amber-200",
              decision === 'nogo' && "text-red-800 dark:text-red-200",
            )}>
              {decisionDescription}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {passedCount}/{results.length}
            </div>
            <div className="text-xs text-muted-foreground">Kriterien</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Erfüllungsgrad</span>
            <span>{passedPercentage.toFixed(0)}%</span>
          </div>
          <Progress 
            value={passedPercentage} 
            className={cn(
              "h-2",
              passedPercentage >= 80 ? "[&>div]:bg-green-500" : 
              passedPercentage >= 50 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"
            )}
          />
        </div>
        
        {/* Criteria Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Kriterium</th>
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Schwelle</th>
                <th className="text-right py-2 pr-4 font-medium text-muted-foreground">Aktuell</th>
                <th className="text-center py-2 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn(
                        "text-[10px] px-1.5",
                        result.importance === 'critical' && "border-red-500 text-red-600",
                        result.importance === 'high' && "border-amber-500 text-amber-600",
                        result.importance === 'medium' && "border-blue-500 text-blue-600",
                      )}>
                        {result.importance === 'critical' ? 'KRITISCH' : 
                         result.importance === 'high' ? 'HOCH' : 'MITTEL'}
                      </Badge>
                      <span className="font-medium">{result.label}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-muted-foreground">
                    {result.threshold}
                  </td>
                  <td className={cn(
                    "py-3 pr-4 text-right font-mono font-bold",
                    result.passed ? "text-green-600" : "text-red-600"
                  )}>
                    {result.value}
                  </td>
                  <td className="py-3 text-center">
                    {result.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Action Items for Failed Criteria */}
        {!allPassed && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Handlungsempfehlungen
            </p>
            <ul className="space-y-1 text-sm">
              {criticalFailed.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2 text-red-700 dark:text-red-400">
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span><strong>{r.label}:</strong> {r.value} → Ziel: {r.threshold}</span>
                </li>
              ))}
              {highFailed.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span><strong>{r.label}:</strong> {r.value} → Ziel: {r.threshold}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
