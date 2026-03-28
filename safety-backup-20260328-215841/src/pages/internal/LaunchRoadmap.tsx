/**
 * 90-Day Launch & Stabilization Roadmap Dashboard
 * Internal operational cockpit for Swiss relocation business
 */

import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Pause, Play, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import { RoadmapTable } from '@/components/internal/RoadmapTable';
import { KPIInputPanel } from '@/components/internal/KPIInputPanel';
import { KillSwitchPanel } from '@/components/internal/KillSwitchPanel';
import { StatusBanner } from '@/components/internal/StatusBanner';
import { ActionsPanel } from '@/components/internal/ActionsPanel';
import type { LaunchKPIs } from '@/components/internal/types';

const DEFAULT_KPIS: LaunchKPIs = {
  // Ads
  cpc: 7.50,
  ctr: 3.5,
  dailySpend: 200,
  dailyLeads: 4,
  
  // Sales
  closeRate: 25,
  cpl: 50,
  
  // Ops
  jobsCompleted: 5,
  avgAOV: 2200,
  avgCOGS: 1200,
  cm2: 650,
  cm2Percent: 29.5,
  utilization: 65,
  
  // Marketplace
  marketplaceCPL: 42,
  resaleRate: 70,
  fillRate: 1.8,
  disputeRate: 2,
  partnerAcceptRate: 55,
  
  // Financial
  cashReserveMonths: 2.5,
  claimRatePercent: 1.2,
  
  // Calculated
  blendedCPL7Day: 48,
  partnerRefundRate: 8,
  marketplaceRevenuePercent: 25,
};

export default function LaunchRoadmap() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [kpis, setKpis] = useState<LaunchKPIs>(DEFAULT_KPIS);
  
  const updateKPI = (key: keyof LaunchKPIs, value: number) => {
    setKpis(prev => ({ ...prev, [key]: value }));
  };
  
  // Calculate overall status
  const overallStatus = useMemo(() => {
    const killSwitches = [
      kpis.blendedCPL7Day > 90,
      kpis.claimRatePercent > 5,
      kpis.partnerRefundRate > 15,
      kpis.cashReserveMonths < 1,
    ];
    
    if (killSwitches.some(k => k)) return 'critical';
    
    const warnings = [
      kpis.closeRate < 15,
      kpis.cm2Percent < 20,
      kpis.utilization < 50,
      kpis.partnerAcceptRate < 40,
    ];
    
    if (warnings.filter(w => w).length >= 2) return 'warning';
    
    return 'healthy';
  }, [kpis]);
  
  return (
    <>
      <Helmet>
        <title>90-Day Launch Roadmap | Internal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  90-Day Launch & Stabilization
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Operational Cockpit • Cherries & Chaff Engine
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Current Week</p>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      min={1} 
                      max={12}
                      value={currentWeek}
                      onChange={(e) => setCurrentWeek(Number(e.target.value))}
                      className="w-16 h-8 text-center"
                    />
                    <span className="text-sm text-muted-foreground">/ 12</span>
                  </div>
                </div>
                <Badge 
                  variant={overallStatus === 'healthy' ? 'default' : overallStatus === 'warning' ? 'secondary' : 'destructive'}
                  className="text-sm px-3 py-1"
                >
                  {overallStatus === 'healthy' && '🟢 GO'}
                  {overallStatus === 'warning' && '🟡 CAUTION'}
                  {overallStatus === 'critical' && '🔴 STOP'}
                </Badge>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Phase 1: Validation</span>
                <span>Phase 2: Hybrid</span>
                <span>Phase 3: Scale</span>
              </div>
              <Progress value={(currentWeek / 12) * 100} className="h-2" />
            </div>
          </div>
        </header>
        
        {/* Alert Banners */}
        <StatusBanner kpis={kpis} currentWeek={currentWeek} />
        
        {/* Main Content */}
        <main className="container mx-auto px-6 py-6">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="settings">KPI Inputs</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Kill Switches */}
                <div className="lg:col-span-2">
                  <KillSwitchPanel kpis={kpis} />
                </div>
                
                {/* Actions */}
                <div>
                  <ActionsPanel status={overallStatus} kpis={kpis} currentWeek={currentWeek} />
                </div>
              </div>
              
              {/* Key Metrics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Blended CPL"
                  value={formatSwissCHF(kpis.blendedCPL7Day)}
                  target="< CHF 55"
                  status={kpis.blendedCPL7Day < 55 ? 'good' : kpis.blendedCPL7Day < 75 ? 'warn' : 'bad'}
                />
                <MetricCard 
                  title="Close Rate"
                  value={formatSwissPercent(kpis.closeRate / 100)}
                  target="> 25%"
                  status={kpis.closeRate > 25 ? 'good' : kpis.closeRate > 15 ? 'warn' : 'bad'}
                />
                <MetricCard 
                  title="CM2 Margin"
                  value={formatSwissPercent(kpis.cm2Percent / 100)}
                  target="> 30%"
                  status={kpis.cm2Percent > 30 ? 'good' : kpis.cm2Percent > 20 ? 'warn' : 'bad'}
                />
                <MetricCard 
                  title="Utilization"
                  value={formatSwissPercent(kpis.utilization / 100)}
                  target="75-85%"
                  status={kpis.utilization >= 60 && kpis.utilization <= 95 ? 'good' : kpis.utilization < 50 ? 'bad' : 'warn'}
                />
              </div>
              
              {/* Secondary Metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Partner Accept"
                  value={formatSwissPercent(kpis.partnerAcceptRate / 100)}
                  target="> 40%"
                  status={kpis.partnerAcceptRate > 40 ? 'good' : kpis.partnerAcceptRate > 25 ? 'warn' : 'bad'}
                />
                <MetricCard 
                  title="Marketplace CPL"
                  value={formatSwissCHF(kpis.marketplaceCPL)}
                  target="< CHF 45"
                  status={kpis.marketplaceCPL < 45 ? 'good' : kpis.marketplaceCPL < 60 ? 'warn' : 'bad'}
                />
                <MetricCard 
                  title="Dispute Rate"
                  value={formatSwissPercent(kpis.disputeRate / 100)}
                  target="< 3%"
                  status={kpis.disputeRate < 3 ? 'good' : kpis.disputeRate < 5 ? 'warn' : 'bad'}
                />
                <MetricCard 
                  title="Cash Reserve"
                  value={`${kpis.cashReserveMonths.toFixed(1)} Mo.`}
                  target="> 2 months"
                  status={kpis.cashReserveMonths > 2 ? 'good' : kpis.cashReserveMonths > 1 ? 'warn' : 'bad'}
                />
              </div>
            </TabsContent>
            
            {/* Roadmap Tab */}
            <TabsContent value="roadmap">
              <RoadmapTable currentWeek={currentWeek} kpis={kpis} />
            </TabsContent>
            
            {/* KPI Inputs Tab */}
            <TabsContent value="settings">
              <KPIInputPanel kpis={kpis} onUpdate={updateKPI} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}

// Helper component for metric cards
function MetricCard({ 
  title, 
  value, 
  target, 
  status 
}: { 
  title: string; 
  value: string; 
  target: string; 
  status: 'good' | 'warn' | 'bad';
}) {
  return (
    <Card className={
      status === 'good' ? 'border-green-500/30 bg-green-500/5' :
      status === 'warn' ? 'border-yellow-500/30 bg-yellow-500/5' :
      'border-red-500/30 bg-red-500/5'
    }>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          {status === 'good' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'warn' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
          {status === 'bad' && <XCircle className="h-5 w-5 text-red-500" />}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Target: {target}</p>
      </CardContent>
    </Card>
  );
}
