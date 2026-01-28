/**
 * Finance Input Panel - Editable Founder Inputs
 */

import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FinanceInputs } from './types';

interface FinanceInputPanelProps {
  inputs: FinanceInputs;
  onInputChange: (key: keyof FinanceInputs, value: number) => void;
}

export function FinanceInputPanel({ inputs, onInputChange }: FinanceInputPanelProps) {
  const handleChange = (key: keyof FinanceInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(key, parseFloat(e.target.value) || 0);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Founder Inputs
        </CardTitle>
        <CardDescription>Manuelle Eingaben für Berechnungen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="cashOnHand">Cash on Hand (CHF)</Label>
            <Input
              id="cashOnHand"
              type="number"
              value={inputs.cashOnHand}
              onChange={handleChange('cashOnHand')}
            />
          </div>
          <div>
            <Label htmlFor="monthlyFixed">Monthly Fixed Costs (CHF)</Label>
            <Input
              id="monthlyFixed"
              type="number"
              value={inputs.monthlyFixedCosts}
              onChange={handleChange('monthlyFixedCosts')}
            />
          </div>
          <div>
            <Label htmlFor="dailyAdSpend">Avg Daily Ad Spend (CHF)</Label>
            <Input
              id="dailyAdSpend"
              type="number"
              value={inputs.avgDailyAdSpend}
              onChange={handleChange('avgDailyAdSpend')}
            />
          </div>
          <div>
            <Label htmlFor="avgCPL">Avg CPL (CHF)</Label>
            <Input
              id="avgCPL"
              type="number"
              value={inputs.avgCPL}
              onChange={handleChange('avgCPL')}
            />
          </div>
          <div>
            <Label htmlFor="closeRate">Avg Close Rate (%)</Label>
            <Input
              id="closeRate"
              type="number"
              step="0.1"
              value={inputs.avgCloseRate}
              onChange={handleChange('avgCloseRate')}
            />
          </div>
          <div>
            <Label htmlFor="cm2PerJob">Avg CM2 per Job (CHF)</Label>
            <Input
              id="cm2PerJob"
              type="number"
              value={inputs.avgCM2PerJob}
              onChange={handleChange('avgCM2PerJob')}
            />
          </div>
          <div>
            <Label htmlFor="jobs7d">Jobs Completed (7d)</Label>
            <Input
              id="jobs7d"
              type="number"
              value={inputs.jobsCompleted7d}
              onChange={handleChange('jobsCompleted7d')}
            />
          </div>
          <div>
            <Label htmlFor="jobs30d">Jobs Completed (30d)</Label>
            <Input
              id="jobs30d"
              type="number"
              value={inputs.jobsCompleted30d}
              onChange={handleChange('jobsCompleted30d')}
            />
          </div>
          <div>
            <Label htmlFor="claims">Claims Paid (CHF)</Label>
            <Input
              id="claims"
              type="number"
              value={inputs.claimsPaid}
              onChange={handleChange('claimsPaid')}
            />
          </div>
          <div>
            <Label htmlFor="refunds">Refunds Issued (CHF)</Label>
            <Input
              id="refunds"
              type="number"
              value={inputs.refundsIssued}
              onChange={handleChange('refundsIssued')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
