/**
 * Scenario Simulator Module
 * What-if analysis for CPL/margins
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface ScenarioParams {
  cpl: number;
  closeRate: number;
  avgJobValue: number;
  marginPercent: number;
  monthlyBudget: number;
}

export function ScenarioSimulatorModule() {
  const [params, setParams] = useState<ScenarioParams>({
    cpl: 52,
    closeRate: 35,
    avgJobValue: 1815,
    marginPercent: 28,
    monthlyBudget: 5000,
  });

  // Calculated values
  const monthlyLeads = Math.floor(params.monthlyBudget / params.cpl);
  const monthlyJobs = Math.floor(monthlyLeads * (params.closeRate / 100));
  const monthlyRevenue = monthlyJobs * params.avgJobValue;
  const monthlyProfit = monthlyRevenue * (params.marginPercent / 100);
  const roas = params.monthlyBudget > 0 ? monthlyRevenue / params.monthlyBudget : 0;
  const profitableCAC = params.avgJobValue * (params.marginPercent / 100);
  const actualCAC = monthlyJobs > 0 ? params.monthlyBudget / monthlyJobs : 0;
  const isProfitable = actualCAC <= profitableCAC;

  const resetDefaults = () => {
    setParams({
      cpl: 52,
      closeRate: 35,
      avgJobValue: 1815,
      marginPercent: 28,
      monthlyBudget: 5000,
    });
  };

  // Preset scenarios
  const presets = [
    { name: 'Konservativ', cpl: 65, closeRate: 25, avgJobValue: 1600, marginPercent: 25, monthlyBudget: 4000 },
    { name: 'Basis', cpl: 52, closeRate: 35, avgJobValue: 1815, marginPercent: 28, monthlyBudget: 5000 },
    { name: 'Optimistisch', cpl: 40, closeRate: 45, avgJobValue: 2000, marginPercent: 32, monthlyBudget: 6000 },
  ];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex gap-3">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant={JSON.stringify(params) === JSON.stringify({ ...preset }) ? 'default' : 'outline'}
            onClick={() => setParams(preset)}
          >
            {preset.name}
          </Button>
        ))}
        <Button variant="ghost" onClick={resetDefaults}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Parameter anpassen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CPL */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Cost per Lead (CPL)</Label>
                <span className="font-bold">CHF {params.cpl}</span>
              </div>
              <Slider
                value={[params.cpl]}
                onValueChange={([v]) => setParams({ ...params, cpl: v })}
                min={20}
                max={100}
                step={1}
                className={params.cpl > 60 ? '[&>span]:bg-yellow-500' : params.cpl > 90 ? '[&>span]:bg-destructive' : ''}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>CHF 20</span>
                <span className="text-yellow-500">CHF 60 (Warnung)</span>
                <span className="text-destructive">CHF 90 (Kill)</span>
              </div>
            </div>

            {/* Close Rate */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Close Rate</Label>
                <span className="font-bold">{params.closeRate}%</span>
              </div>
              <Slider
                value={[params.closeRate]}
                onValueChange={([v]) => setParams({ ...params, closeRate: v })}
                min={10}
                max={60}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10%</span>
                <span>35% (Basis)</span>
                <span>60%</span>
              </div>
            </div>

            {/* Avg Job Value */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Ø Job-Wert</Label>
                <span className="font-bold">CHF {params.avgJobValue}</span>
              </div>
              <Slider
                value={[params.avgJobValue]}
                onValueChange={([v]) => setParams({ ...params, avgJobValue: v })}
                min={800}
                max={3500}
                step={50}
              />
            </div>

            {/* Margin */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>CM2 Marge</Label>
                <span className="font-bold">{params.marginPercent}%</span>
              </div>
              <Slider
                value={[params.marginPercent]}
                onValueChange={([v]) => setParams({ ...params, marginPercent: v })}
                min={15}
                max={45}
                step={1}
                className={params.marginPercent < 20 ? '[&>span]:bg-destructive' : params.marginPercent < 25 ? '[&>span]:bg-yellow-500' : ''}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-destructive">20% (Kill)</span>
                <span className="text-yellow-500">25% (Warnung)</span>
                <span>45%</span>
              </div>
            </div>

            {/* Monthly Budget */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Monatsbudget Ads</Label>
                <span className="font-bold">CHF {params.monthlyBudget.toLocaleString('de-CH')}</span>
              </div>
              <Slider
                value={[params.monthlyBudget]}
                onValueChange={([v]) => setParams({ ...params, monthlyBudget: v })}
                min={1000}
                max={15000}
                step={500}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* Profitability Status */}
          <Card className={isProfitable ? 'border-green-500 bg-green-500/5' : 'border-destructive bg-destructive/5'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                {isProfitable ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : (
                  <AlertTriangle className="h-12 w-12 text-destructive" />
                )}
                <div>
                  <h3 className="text-xl font-bold">
                    {isProfitable ? 'Profitabel' : 'Nicht Profitabel'}
                  </h3>
                  <p className="text-muted-foreground">
                    CAC: CHF {actualCAC.toFixed(0)} / Max: CHF {profitableCAC.toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">Leads/Monat</p>
                <p className="text-3xl font-bold">{monthlyLeads}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">Jobs/Monat</p>
                <p className="text-3xl font-bold">{monthlyJobs}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold">CHF {(monthlyRevenue / 1000).toFixed(1)}K</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">Profit</p>
                <p className={`text-3xl font-bold ${monthlyProfit > 0 ? 'text-green-600' : 'text-destructive'}`}>
                  CHF {(monthlyProfit / 1000).toFixed(1)}K
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ROAS */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Return on Ad Spend (ROAS)</p>
                  <p className="text-4xl font-bold">{roas.toFixed(2)}x</p>
                </div>
                <Badge 
                  variant={roas >= 4 ? 'default' : roas >= 2 ? 'secondary' : 'destructive'}
                  className="text-lg px-4 py-2"
                >
                  {roas >= 4 ? 'Excellent' : roas >= 2 ? 'OK' : 'Kritisch'}
                </Badge>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span>CHF {params.monthlyBudget.toLocaleString('de-CH')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span>CHF {monthlyRevenue.toLocaleString('de-CH')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t">
                  <span>ROI</span>
                  <span className={monthlyProfit - params.monthlyBudget > 0 ? 'text-green-600' : 'text-destructive'}>
                    {monthlyProfit - params.monthlyBudget > 0 ? '+' : ''}CHF {(monthlyProfit - params.monthlyBudget).toLocaleString('de-CH')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
