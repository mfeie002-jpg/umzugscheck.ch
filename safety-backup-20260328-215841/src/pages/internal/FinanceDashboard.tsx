/**
 * Finance & P&L Snapshot Dashboard
 * Executive real-time financial health monitor
 */

import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { PieChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FinanceKPICards,
  FinanceInputPanel,
  CoreCalculations,
  DailyPLTable,
  FinanceKillSwitches,
  ScenarioSimulator,
  OperatorActions,
  CFOChecklist,
} from '@/components/internal/finance';
import type { FinanceInputs, FinanceKPIs, DailyPLEntry } from '@/components/internal/finance';

// Generate mock daily P&L data
function generateMockDailyPL(days: number): DailyPLEntry[] {
  const entries: DailyPLEntry[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const revenue = 2000 + Math.random() * 4000;
    const cogs = revenue * (0.4 + Math.random() * 0.15);
    const adSpend = 150 + Math.random() * 100;
    const acquisitionCost = adSpend * 0.3;
    const cm2 = revenue - cogs - adSpend - acquisitionCost;
    const jobsCompleted = Math.floor(Math.random() * 3);
    const marketplaceRevenue = 100 + Math.random() * 200;
    const netCashDelta = cm2 + marketplaceRevenue - 50; // minus fixed costs
    
    entries.push({
      date,
      revenue,
      cogs,
      adSpend,
      acquisitionCost,
      cm2,
      jobsCompleted,
      marketplaceRevenue,
      netCashDelta,
    });
  }
  
  return entries;
}

export default function FinanceDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  
  const [inputs, setInputs] = useState<FinanceInputs>({
    cashOnHand: 85000,
    monthlyFixedCosts: 12000,
    avgDailyAdSpend: 180,
    avgCPL: 42,
    avgCloseRate: 22,
    avgCM2PerJob: 680,
    jobsCompleted7d: 8,
    jobsCompleted30d: 32,
    claimsPaid: 450,
    refundsIssued: 280,
  });
  
  const dailyPL = useMemo(() => generateMockDailyPL(30), []);
  
  // Calculate KPIs from inputs
  const kpis = useMemo<FinanceKPIs>(() => {
    const last7 = dailyPL.slice(-7);
    const last30 = dailyPL;
    
    const totalRevenue7d = last7.reduce((sum, d) => sum + d.revenue, 0);
    const totalRevenue30d = last30.reduce((sum, d) => sum + d.revenue, 0);
    const cm2_7d = last7.reduce((sum, d) => sum + d.cm2, 0);
    const cm2_30d = last30.reduce((sum, d) => sum + d.cm2, 0);
    
    const totalMarketingSpend = inputs.avgDailyAdSpend * 30;
    const blendedCAC = inputs.jobsCompleted30d > 0 
      ? totalMarketingSpend / inputs.jobsCompleted30d 
      : 0;
    
    const avgAOV = inputs.jobsCompleted30d > 0 
      ? totalRevenue30d / inputs.jobsCompleted30d 
      : 0;
    
    const monthlyBurn = inputs.monthlyFixedCosts + totalMarketingSpend;
    const cashRunwayMonths = monthlyBurn > 0 
      ? inputs.cashOnHand / monthlyBurn 
      : 12;
    
    const marketplaceRevenue = last30.reduce((sum, d) => sum + d.marketplaceRevenue, 0);
    const marketplaceAdSpend = totalMarketingSpend * 0.3; // 30% attributed to marketplace
    const marketplaceNetMargin = marketplaceRevenue - marketplaceAdSpend - 500; // support cost
    
    const claimsRate = totalRevenue30d > 0 
      ? (inputs.claimsPaid / totalRevenue30d) * 100 
      : 0;
    
    return {
      totalRevenue7d,
      totalRevenue30d,
      cm2_7d,
      cm2_30d,
      cm2Percent7d: totalRevenue7d > 0 ? (cm2_7d / totalRevenue7d) * 100 : 0,
      cm2Percent30d: totalRevenue30d > 0 ? (cm2_30d / totalRevenue30d) * 100 : 0,
      blendedCAC,
      avgAOV,
      utilizationRate: 68, // Mock
      claimsRate,
      marketplaceNetMargin,
      cashRunwayMonths,
    };
  }, [inputs, dailyPL]);
  
  const handleInputChange = (key: keyof FinanceInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <>
      <Helmet>
        <title>Finance & P&L | Internal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <PieChart className="h-6 w-6 text-primary" />
                  Finance & P&L Snapshot
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  SCALE / HOLD / STOP Decision Engine
                </p>
              </div>
              <Tabs value={period} onValueChange={(v) => setPeriod(v as '7d' | '30d')}>
                <TabsList>
                  <TabsTrigger value="7d">7 Tage</TabsTrigger>
                  <TabsTrigger value="30d">30 Tage</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-6 py-6 space-y-6">
          
          {/* Kill Switches (Top) */}
          <FinanceKillSwitches kpis={kpis} inputs={inputs} />
          
          {/* Decision Engine */}
          <OperatorActions kpis={kpis} />
          
          {/* KPI Cards */}
          <FinanceKPICards kpis={kpis} period={period} />
          
          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pl">P&L</TabsTrigger>
              <TabsTrigger value="simulator">What-If</TabsTrigger>
              <TabsTrigger value="settings">Inputs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <CoreCalculations inputs={inputs} kpis={kpis} />
                <CFOChecklist />
              </div>
            </TabsContent>
            
            <TabsContent value="pl">
              <DailyPLTable entries={dailyPL} />
            </TabsContent>
            
            <TabsContent value="simulator">
              <ScenarioSimulator inputs={inputs} kpis={kpis} />
            </TabsContent>
            
            <TabsContent value="settings">
              <FinanceInputPanel inputs={inputs} onInputChange={handleInputChange} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
