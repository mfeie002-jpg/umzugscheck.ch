/**
 * Scenario Simulator - What-If Panel
 */

import { useState } from 'react';
import { FlaskConical, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatSwissCHF } from '@/lib/swiss-number-format';
import type { FinanceInputs, FinanceKPIs, ScenarioResult } from './types';

interface ScenarioSimulatorProps {
  inputs: FinanceInputs;
  kpis: FinanceKPIs;
}

interface Scenario {
  id: string;
  label: string;
  cpcChange: number;
  closeRateChange: number;
  laborCostChange: number;
}

const SCENARIOS: Scenario[] = [
  { id: 'cpc10', label: 'CPC +10%', cpcChange: 0.10, closeRateChange: 0, laborCostChange: 0 },
  { id: 'cpc25', label: 'CPC +25%', cpcChange: 0.25, closeRateChange: 0, laborCostChange: 0 },
  { id: 'cpc50', label: 'CPC +50%', cpcChange: 0.50, closeRateChange: 0, laborCostChange: 0 },
  { id: 'close5', label: 'Close Rate -5%', cpcChange: 0, closeRateChange: -5, laborCostChange: 0 },
  { id: 'close10', label: 'Close Rate -10%', cpcChange: 0, closeRateChange: -10, laborCostChange: 0 },
  { id: 'labor5', label: 'Labor +5%', cpcChange: 0, closeRateChange: 0, laborCostChange: 0.05 },
];

function calculateScenario(inputs: FinanceInputs, kpis: FinanceKPIs, scenario: Scenario): ScenarioResult {
  // Adjust CPL based on CPC change
  const newCPL = inputs.avgCPL * (1 + scenario.cpcChange);
  
  // Adjust close rate
  const newCloseRate = inputs.avgCloseRate + scenario.closeRateChange;
  
  // Calculate new CAC (CPL / Close Rate)
  const newBlendedCAC = newCloseRate > 0 ? newCPL / (newCloseRate / 100) : kpis.blendedCAC * 2;
  
  // Adjust CM2 based on labor cost change
  const laborImpact = inputs.avgCM2PerJob * scenario.laborCostChange;
  const newCM2PerJob = inputs.avgCM2PerJob - laborImpact;
  const newCM2 = newCM2PerJob * inputs.jobsCompleted30d;
  
  // Recalculate runway
  const totalMarketingSpend = inputs.avgDailyAdSpend * (1 + scenario.cpcChange) * 30;
  const monthlyBurn = inputs.monthlyFixedCosts + totalMarketingSpend;
  const newCashRunway = monthlyBurn > 0 ? inputs.cashOnHand / monthlyBurn : 12;
  
  // Still profitable?
  const stillProfitable = newCM2 > 0 && newBlendedCAC < inputs.avgCM2PerJob;
  
  return {
    newBlendedCAC,
    newCM2,
    newCashRunway,
    stillProfitable,
  };
}

export function ScenarioSimulator({ inputs, kpis }: ScenarioSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  
  const activeScenario = SCENARIOS.find(s => s.id === selectedScenario);
  const result = activeScenario ? calculateScenario(inputs, kpis, activeScenario) : null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FlaskConical className="h-5 w-5" />
          Scenario Simulator
        </CardTitle>
        <CardDescription>What-If Analyse</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map(scenario => (
            <Button
              key={scenario.id}
              variant={selectedScenario === scenario.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedScenario(scenario.id === selectedScenario ? null : scenario.id)}
            >
              {scenario.label}
            </Button>
          ))}
        </div>
        
        {result && (
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">New Blended CAC:</span>
              <span className="font-mono font-bold">{formatSwissCHF(result.newBlendedCAC)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New CM2 (30d):</span>
              <span className={`font-mono font-bold ${result.newCM2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatSwissCHF(result.newCM2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New Cash Runway:</span>
              <span className="font-mono font-bold">{result.newCashRunway.toFixed(1)} Mo.</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Still Profitable?</span>
              <Badge className={result.stillProfitable ? 'bg-green-500' : 'bg-red-500'}>
                {result.stillProfitable ? (
                  <><Check className="h-3 w-3 mr-1" /> Yes</>
                ) : (
                  <><X className="h-3 w-3 mr-1" /> No</>
                )}
              </Badge>
            </div>
          </div>
        )}
        
        {!result && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Wähle ein Szenario um die Auswirkungen zu sehen
          </p>
        )}
      </CardContent>
    </Card>
  );
}
