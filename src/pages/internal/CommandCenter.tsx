/**
 * UNIFIED COMMAND CENTER
 * Founder-grade operating system for daily decisions
 * Route: /internal/command-center
 */

import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

import {
  GlobalStatusBar,
  ExecutiveSnapshot,
  UnitEconomicsPanel,
  LeadScoringSimulator,
  DistributionEngine,
  PartnerNetworkPanel,
  RoadmapTracker,
  FinanceControlPanel,
  KillSwitchAlerts,
  OperatorDecisionPanel,
} from '@/components/internal/command-center';
import type {
  GlobalStatus,
  ExecutiveKPIs,
  FeierabendInputs,
  MarketplaceInputs,
  DailyPLEntry,
  OperatorDecision,
} from '@/components/internal/command-center';

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
    const cm2 = revenue - cogs - adSpend;
    const netCash = cm2 - 50; // minus fixed costs share
    
    entries.push({ date, revenue, cogs, adSpend, cm2, netCash });
  }
  
  return entries;
}

// Section wrapper component
function Section({ 
  title, 
  defaultOpen = true, 
  children 
}: { 
  title: string; 
  defaultOpen?: boolean; 
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between px-3 py-2 h-auto text-sm font-medium bg-muted/50 hover:bg-muted"
        >
          <span>{title}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function CommandCenterPage() {
  // Period selector
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  
  // Finance inputs
  const [cashOnHand, setCashOnHand] = useState(85000);
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState(12000);
  const [claimsPaid, setClaimsPaid] = useState(450);
  const [refundsIssued, setRefundsIssued] = useState(280);
  
  // Unit economics inputs
  const [feierabendInputs, setFeierabendInputs] = useState<FeierabendInputs>({
    aovNet: 2800,
    cplMkt: 55,
    closeRate: 0.28,
    salesMinutesPerLead: 15,
    salesHourlyCost: 40,
    crewSize: 3,
    jobHours: 6,
    crewHourlyCost: 50,
    fleetCost: 180,
    materialsCost: 45,
  });
  
  const [marketplaceInputs, setMarketplaceInputs] = useState<MarketplaceInputs>({
    cplBuy: 45,
    partnerPricePerLead: 40,
    avgBuyersPerLead: 1.8,
    commissionPercent: 12,
    estBookingValue: 2200,
    partnerCloseRate: 0.25,
    conciergeEnabled: true,
    supportCostPerLead: 8,
  });
  
  // Mock data
  const dailyPL = useMemo(() => generateMockDailyPL(30), []);
  
  // Calculate KPIs
  const kpis = useMemo<ExecutiveKPIs>(() => {
    const last7 = dailyPL.slice(-7);
    const last30 = dailyPL;
    
    const revenue7d = last7.reduce((sum, d) => sum + d.revenue, 0);
    const revenue30d = last30.reduce((sum, d) => sum + d.revenue, 0);
    const cm2_7d = last7.reduce((sum, d) => sum + d.cm2, 0);
    const cm2_30d = last30.reduce((sum, d) => sum + d.cm2, 0);
    
    return {
      revenue7d,
      revenue30d,
      cm2_7d,
      cm2_30d,
      cm2Percent7d: revenue7d > 0 ? (cm2_7d / revenue7d) * 100 : 0,
      cm2Percent30d: revenue30d > 0 ? (cm2_30d / revenue30d) * 100 : 0,
      blendedCAC: 72,
      avgAOV: 2650,
      jobsCompleted7d: 8,
      jobsCompleted30d: 32,
      marketplaceNetMargin: 1850,
      claimsRatePercent: 2.8,
      partnerDisputeRatePercent: 6.2,
    };
  }, [dailyPL]);
  
  // Calculate global status
  const globalStatus = useMemo<GlobalStatus>(() => {
    const blendedCPL7d = 58;
    const utilizationPercent = 68;
    const totalAdSpend = dailyPL.slice(-30).reduce((sum, d) => sum + d.adSpend, 0);
    const monthlyBurn = monthlyFixedCosts + (totalAdSpend / 30) * 30;
    const cashRunwayMonths = monthlyBurn > 0 ? cashOnHand / monthlyBurn : 12;
    
    // Count kill switches
    let activeKillSwitches = 0;
    if (blendedCPL7d > 90) activeKillSwitches++;
    if (kpis.cm2Percent7d < 20) activeKillSwitches++;
    if (kpis.claimsRatePercent > 5) activeKillSwitches++;
    if (cashRunwayMonths < 1) activeKillSwitches++;
    
    // Determine overall status
    let overall: 'scale' | 'hold' | 'stop' = 'scale';
    if (activeKillSwitches > 0) {
      overall = 'stop';
    } else if (blendedCPL7d > 70 || kpis.cm2Percent7d < 25 || utilizationPercent < 60) {
      overall = 'hold';
    }
    
    return {
      overall,
      blendedCPL7d,
      cm2_7d: kpis.cm2_7d,
      utilizationPercent,
      cashRunwayMonths,
      activeKillSwitches,
    };
  }, [kpis, cashOnHand, monthlyFixedCosts, dailyPL]);
  
  // Calculate operator decision
  const operatorDecision = useMemo<OperatorDecision>(() => {
    if (globalStatus.overall === 'stop') {
      return {
        action: 'stop',
        reasons: [
          'Kill switch triggered',
          'Cash runway critical or CPL too high',
          'Immediate action required',
        ],
        todayActions: [
          'Pause all Google Ads campaigns',
          'Review last 10 leads for quality',
          'Call top 3 partners for feedback',
        ],
      };
    }
    
    if (globalStatus.overall === 'hold') {
      return {
        action: 'hold',
        reasons: [
          'Metrics borderline but not critical',
          'Optimization needed before scaling',
          'Some KPIs below target',
        ],
        todayActions: [
          'Review landing page CVR',
          'Tighten Google Ads targeting',
          'Increase follow-up speed',
        ],
      };
    }
    
    return {
      action: 'scale',
      reasons: [
        'All core KPIs healthy',
        'CM2 margin above 25%',
        'Utilization in target range',
      ],
      todayActions: [
        'Increase daily ad budget by 20%',
        'Test new ad copy variants',
        'Consider price increase +5%',
      ],
    };
  }, [globalStatus]);
  
  return (
    <>
      <Helmet>
        <title>Command Center | Internal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Global Status Bar - Sticky */}
        <GlobalStatusBar status={globalStatus} />
        
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold tracking-tight">Command Center</h1>
              <span className="text-xs text-muted-foreground">Swiss Relocation Operating System</span>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-4 space-y-4">
          {/* Kill Switch Alerts */}
          <KillSwitchAlerts
            blendedCPL7d={globalStatus.blendedCPL7d}
            cm2Percent={kpis.cm2Percent7d}
            claimsRatePercent={kpis.claimsRatePercent}
            cashRunwayMonths={globalStatus.cashRunwayMonths}
            resaleRate={marketplaceInputs.avgBuyersPerLead}
            partnerDisputePercent={kpis.partnerDisputeRatePercent}
            fillRatePercent={78}
          />
          
          {/* Operator Decision */}
          <OperatorDecisionPanel decision={operatorDecision} />
          
          {/* Section 1: Executive Snapshot */}
          <Section title="1. Executive Snapshot" defaultOpen={true}>
            <ExecutiveSnapshot kpis={kpis} period={period} onPeriodChange={setPeriod} />
          </Section>
          
          {/* Section 2: Unit Economics */}
          <Section title="2. Paid Media & Unit Economics" defaultOpen={true}>
            <UnitEconomicsPanel
              feierabendInputs={feierabendInputs}
              marketplaceInputs={marketplaceInputs}
              onFeierabendChange={setFeierabendInputs}
              onMarketplaceChange={setMarketplaceInputs}
            />
          </Section>
          
          {/* Section 3: Lead Scoring & Routing */}
          <Section title="3. Lead Scoring & Routing Brain" defaultOpen={true}>
            <LeadScoringSimulator />
          </Section>
          
          {/* Section 4: Distribution Engine */}
          <Section title="4. Distribution & Auction Engine" defaultOpen={false}>
            <DistributionEngine />
          </Section>
          
          {/* Section 5: Partner Network */}
          <Section title="5. Partner Network Control" defaultOpen={false}>
            <PartnerNetworkPanel />
          </Section>
          
          {/* Section 6: Roadmap */}
          <Section title="6. 90-Day Roadmap & Execution" defaultOpen={false}>
            <RoadmapTracker />
          </Section>
          
          {/* Section 7: Finance & Cash */}
          <Section title="7. Finance, Utilization & Cash" defaultOpen={false}>
            <FinanceControlPanel
              cashOnHand={cashOnHand}
              monthlyFixedCosts={monthlyFixedCosts}
              claimsPaid={claimsPaid}
              refundsIssued={refundsIssued}
              utilizationPercent={globalStatus.utilizationPercent}
              dailyPL={dailyPL}
              onCashChange={setCashOnHand}
              onFixedCostsChange={setMonthlyFixedCosts}
              onClaimsChange={setClaimsPaid}
              onRefundsChange={setRefundsIssued}
            />
          </Section>
        </main>
      </div>
    </>
  );
}
