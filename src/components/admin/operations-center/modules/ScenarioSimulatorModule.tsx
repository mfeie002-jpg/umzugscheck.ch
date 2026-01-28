/**
 * Scenario Simulator Module - Mobile First
 * Touch-friendly sliders and results
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Calculator, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

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
    <div className="space-y-4 md:space-y-6">
      {/* Presets - Horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 md:flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant={JSON.stringify(params) === JSON.stringify({ ...preset }) ? 'default' : 'outline'}
            onClick={() => setParams(preset)}
            className="flex-shrink-0 h-10 min-w-[100px]"
            size="sm"
          >
            {preset.name}
          </Button>
        ))}
        <Button variant="ghost" onClick={resetDefaults} size="sm" className="flex-shrink-0 h-10">
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Profitability Status - Always visible on mobile */}
      <Card className={`${isProfitable ? 'border-green-500 bg-green-500/5' : 'border-destructive bg-destructive/5'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {isProfitable ? (
              <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-green-500 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-destructive flex-shrink-0" />
            )}
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-bold">
                {isProfitable ? 'Profitabel ✓' : 'Nicht Profitabel'}
              </h3>
              <p className="text-sm text-muted-foreground">
                CAC: CHF {actualCAC.toFixed(0)} / Max: CHF {profitableCAC.toFixed(0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid - 2x2 on mobile */}
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-6 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Leads</p>
            <p className="text-xl md:text-3xl font-bold">{monthlyLeads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Jobs</p>
            <p className="text-xl md:text-3xl font-bold">{monthlyJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Revenue</p>
            <p className="text-xl md:text-3xl font-bold">{(monthlyRevenue / 1000).toFixed(1)}K</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Profit</p>
            <p className={`text-xl md:text-3xl font-bold ${monthlyProfit > 0 ? 'text-green-600' : 'text-destructive'}`}>
              {(monthlyProfit / 1000).toFixed(1)}K
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROAS Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">ROAS</p>
              <p className="text-3xl md:text-4xl font-bold">{roas.toFixed(2)}x</p>
            </div>
            <Badge 
              variant={roas >= 4 ? 'default' : roas >= 2 ? 'secondary' : 'destructive'}
              className="text-sm md:text-lg px-3 md:px-4 py-1 md:py-2"
            >
              {roas >= 4 ? '✓ Excellent' : roas >= 2 ? 'OK' : '⚠ Kritisch'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sliders */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Parameter
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          {/* CPL */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Cost per Lead</Label>
              <span className="font-bold text-lg">CHF {params.cpl}</span>
            </div>
            <Slider
              value={[params.cpl]}
              onValueChange={([v]) => setParams({ ...params, cpl: v })}
              min={20}
              max={100}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>20</span>
              <span className="text-yellow-600">60 ⚠</span>
              <span className="text-destructive">90 ✕</span>
            </div>
          </div>

          {/* Close Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Close Rate</Label>
              <span className="font-bold text-lg">{params.closeRate}%</span>
            </div>
            <Slider
              value={[params.closeRate]}
              onValueChange={([v]) => setParams({ ...params, closeRate: v })}
              min={10}
              max={60}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10%</span>
              <span>35% (Basis)</span>
              <span>60%</span>
            </div>
          </div>

          {/* Avg Job Value */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Ø Job-Wert</Label>
              <span className="font-bold text-lg">CHF {params.avgJobValue}</span>
            </div>
            <Slider
              value={[params.avgJobValue]}
              onValueChange={([v]) => setParams({ ...params, avgJobValue: v })}
              min={800}
              max={3500}
              step={50}
              className="py-2"
            />
          </div>

          {/* Margin */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">CM2 Marge</Label>
              <span className="font-bold text-lg">{params.marginPercent}%</span>
            </div>
            <Slider
              value={[params.marginPercent]}
              onValueChange={([v]) => setParams({ ...params, marginPercent: v })}
              min={15}
              max={45}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="text-destructive">20% ✕</span>
              <span className="text-yellow-600">25% ⚠</span>
              <span>45%</span>
            </div>
          </div>

          {/* Monthly Budget */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Monatsbudget</Label>
              <span className="font-bold text-lg">CHF {params.monthlyBudget.toLocaleString('de-CH')}</span>
            </div>
            <Slider
              value={[params.monthlyBudget]}
              onValueChange={([v]) => setParams({ ...params, monthlyBudget: v })}
              min={1000}
              max={15000}
              step={500}
              className="py-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
