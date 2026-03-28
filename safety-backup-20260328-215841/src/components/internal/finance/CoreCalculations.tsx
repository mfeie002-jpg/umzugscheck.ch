/**
 * Core Calculations Panel - Auto-calculated metrics with visible formulas
 */

import { Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import type { FinanceInputs, FinanceKPIs } from './types';

interface CoreCalculationsProps {
  inputs: FinanceInputs;
  kpis: FinanceKPIs;
}

interface CalculationRowProps {
  name: string;
  formula: string;
  result: string;
}

function CalculationRow({ name, formula, result }: CalculationRowProps) {
  return (
    <div className="p-3 bg-muted rounded-lg">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{name}</span>
        <span className="font-mono font-bold">{result}</span>
      </div>
      <code className="text-xs text-muted-foreground block mt-1">{formula}</code>
    </div>
  );
}

export function CoreCalculations({ inputs, kpis }: CoreCalculationsProps) {
  const totalMarketingSpend = inputs.avgDailyAdSpend * 30;
  const monthlyBurn = inputs.monthlyFixedCosts + totalMarketingSpend;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Core Calculations
        </CardTitle>
        <CardDescription>Automatische Berechnungen mit sichtbaren Formeln</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <CalculationRow
          name="1) Blended CAC"
          formula={`Total Marketing Spend (${formatSwissCHF(totalMarketingSpend)}) / Booked Jobs (${inputs.jobsCompleted30d})`}
          result={formatSwissCHF(kpis.blendedCAC)}
        />
        
        <CalculationRow
          name="2) CM2 Rolling (30d)"
          formula="Sum(Job Revenue) − Sum(COGS + Acquisition Cost)"
          result={formatSwissCHF(kpis.cm2_30d)}
        />
        
        <CalculationRow
          name="3) Utilization Rate"
          formula="Booked Revenue Days / Available Revenue Days"
          result={formatSwissPercent(kpis.utilizationRate)}
        />
        
        <CalculationRow
          name="4) Cash Runway"
          formula={`Cash (${formatSwissCHF(inputs.cashOnHand)}) / Monthly Burn (${formatSwissCHF(monthlyBurn)})`}
          result={`${kpis.cashRunwayMonths.toFixed(1)} Monate`}
        />
        
        <CalculationRow
          name="5) Marketplace Net Contribution"
          formula="Marketplace Revenue − Marketplace Ad Spend − Support Cost"
          result={formatSwissCHF(kpis.marketplaceNetMargin)}
        />
      </CardContent>
    </Card>
  );
}
