/**
 * Command Center - Central Operations Dashboard
 * 10 Module Overview for Multi-Brand Portfolio
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Route, 
  Target,
  DollarSign,
  Calculator,
  FileText,
  Gauge,
  RefreshCw,
  Building2
} from 'lucide-react';

import { BrandPerformanceModule } from '@/components/admin/operations-center/modules/BrandPerformanceModule';
import { LeadRoutingModule } from '@/components/admin/operations-center/modules/LeadRoutingModule';
import { CapacityPlannerModule } from '@/components/admin/operations-center/modules/CapacityPlannerModule';
import { KillSwitchModule } from '@/components/admin/operations-center/modules/KillSwitchModule';
import { RevenueForecastModule } from '@/components/admin/operations-center/modules/RevenueForecastModule';
import { PartnerNetworkModule } from '@/components/admin/operations-center/modules/PartnerNetworkModule';
import { ConversionFunnelModule } from '@/components/admin/operations-center/modules/ConversionFunnelModule';
import { CostStructureModule } from '@/components/admin/operations-center/modules/CostStructureModule';
import { ScenarioSimulatorModule } from '@/components/admin/operations-center/modules/ScenarioSimulatorModule';
import { WeeklySummaryModule } from '@/components/admin/operations-center/modules/WeeklySummaryModule';

export function CommandCenter() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Multi-Brand Operations Dashboard • 3 Marken • Live Monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Letzte Aktualisierung: {lastRefresh.toLocaleTimeString('de-CH')}
          </span>
          <Button onClick={handleRefresh} disabled={isRefreshing} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <QuickStat icon={Building2} label="Marken" value="3" />
        <QuickStat icon={Users} label="Crews" value="1" />
        <QuickStat icon={Target} label="Jobs/Monat" value="26" />
        <QuickStat icon={DollarSign} label="Ziel-Revenue" value="CHF 47K" />
        <QuickStat icon={Gauge} label="Auslastung" value="85%" status="ok" />
        <QuickStat icon={AlertTriangle} label="Kill Switches" value="0 aktiv" status="ok" />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full h-auto">
          <TabsTrigger value="overview" className="text-xs">
            <LayoutDashboard className="h-3 w-3 mr-1" />
            Übersicht
          </TabsTrigger>
          <TabsTrigger value="brands" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            Marken
          </TabsTrigger>
          <TabsTrigger value="routing" className="text-xs">
            <Route className="h-3 w-3 mr-1" />
            Routing
          </TabsTrigger>
          <TabsTrigger value="capacity" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Kapazität
          </TabsTrigger>
          <TabsTrigger value="killswitch" className="text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Kill Switch
          </TabsTrigger>
          <TabsTrigger value="forecast" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Prognose
          </TabsTrigger>
          <TabsTrigger value="partners" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Partner
          </TabsTrigger>
          <TabsTrigger value="funnel" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            Funnel
          </TabsTrigger>
          <TabsTrigger value="costs" className="text-xs">
            <DollarSign className="h-3 w-3 mr-1" />
            Kosten
          </TabsTrigger>
          <TabsTrigger value="simulator" className="text-xs">
            <Calculator className="h-3 w-3 mr-1" />
            Simulator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewGrid />
        </TabsContent>

        <TabsContent value="brands" className="mt-6">
          <BrandPerformanceModule />
        </TabsContent>

        <TabsContent value="routing" className="mt-6">
          <LeadRoutingModule />
        </TabsContent>

        <TabsContent value="capacity" className="mt-6">
          <CapacityPlannerModule />
        </TabsContent>

        <TabsContent value="killswitch" className="mt-6">
          <KillSwitchModule />
        </TabsContent>

        <TabsContent value="forecast" className="mt-6">
          <RevenueForecastModule />
        </TabsContent>

        <TabsContent value="partners" className="mt-6">
          <PartnerNetworkModule />
        </TabsContent>

        <TabsContent value="funnel" className="mt-6">
          <ConversionFunnelModule />
        </TabsContent>

        <TabsContent value="costs" className="mt-6">
          <CostStructureModule />
        </TabsContent>

        <TabsContent value="simulator" className="mt-6">
          <ScenarioSimulatorModule />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Quick Stat Component
function QuickStat({ 
  icon: Icon, 
  label, 
  value, 
  status 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
  status?: 'ok' | 'warning' | 'critical';
}) {
  return (
    <Card className={`
      ${status === 'critical' ? 'border-destructive bg-destructive/5' : ''}
      ${status === 'warning' ? 'border-yellow-500 bg-yellow-500/5' : ''}
      ${status === 'ok' ? 'border-green-500/50' : ''}
    `}>
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${
            status === 'critical' ? 'text-destructive' :
            status === 'warning' ? 'text-yellow-500' :
            status === 'ok' ? 'text-green-500' : 'text-muted-foreground'
          }`} />
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-bold text-sm">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Overview Grid - Shows condensed versions of all modules
function OverviewGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Brand Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Marken Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <BrandRow name="Feierabend" revenue={22400} margin={35} color="bg-blue-500" />
            <BrandRow name="Umzugexpress" revenue={16000} margin={28} color="bg-red-500" />
            <BrandRow name="Zügelhelden" revenue={8800} margin={22} color="bg-teal-500" />
          </div>
        </CardContent>
      </Card>

      {/* Kill Switch Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Kill Switch Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <KillSwitchRow name="CPL (7d Ø)" value={45} threshold={90} />
            <KillSwitchRow name="CM2" value={28} threshold={20} inverted />
            <KillSwitchRow name="Claims %" value={2} threshold={5} />
            <KillSwitchRow name="Runway" value={6} threshold={3} inverted unit="Mo" />
          </div>
        </CardContent>
      </Card>

      {/* Capacity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Auslastung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle 
                  cx="48" cy="48" r="40" fill="none" 
                  stroke="hsl(var(--primary))" strokeWidth="8"
                  strokeDasharray={`${85 * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-2xl font-bold">85%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">26 von 31 Jobs gebucht</p>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel Mini */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <FunnelRow stage="Website" count={2500} percentage={100} />
            <FunnelRow stage="Calculator" count={450} percentage={18} />
            <FunnelRow stage="Lead" count={95} percentage={21} />
            <FunnelRow stage="Quoted" count={42} percentage={44} />
            <FunnelRow stage="Booked" count={26} percentage={62} />
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Mini */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Kostenstruktur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <CostRow name="Personal" amount={18500} percentage={55} />
            <CostRow name="Fahrzeug" amount={4200} percentage={12} />
            <CostRow name="Marketing" amount={5700} percentage={17} />
            <CostRow name="Overhead" amount={5400} percentage={16} />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary Mini */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Diese Woche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="font-bold">CHF 11'200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Jobs</span>
              <span className="font-bold">7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Ø Margin</span>
              <span className="font-bold text-green-600">29%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Neue Leads</span>
              <span className="font-bold">23</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components
function BrandRow({ name, revenue, margin, color }: { name: string; revenue: number; margin: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-8 rounded ${color}`} />
      <div className="flex-1">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">
          CHF {revenue.toLocaleString('de-CH')} • {margin}% CM2
        </p>
      </div>
    </div>
  );
}

function KillSwitchRow({ name, value, threshold, inverted = false, unit = '' }: { 
  name: string; value: number; threshold: number; inverted?: boolean; unit?: string;
}) {
  const isOk = inverted ? value >= threshold : value <= threshold;
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{name}</span>
      <div className="flex items-center gap-2">
        <span className={isOk ? 'text-green-600' : 'text-destructive'}>
          {value}{unit}
        </span>
        <Badge variant={isOk ? 'secondary' : 'destructive'} className="text-xs">
          {isOk ? 'OK' : 'ALERT'}
        </Badge>
      </div>
    </div>
  );
}

function FunnelRow({ stage, count, percentage }: { stage: string; count: number; percentage: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 text-xs">{stage}</div>
      <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
        <div 
          className="h-full bg-primary/70 rounded"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-16 text-xs text-right">{count} ({percentage}%)</div>
    </div>
  );
}

function CostRow({ name, amount, percentage }: { name: string; amount: number; percentage: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 text-xs">{name}</div>
      <div className="flex-1 h-3 bg-muted rounded overflow-hidden">
        <div 
          className="h-full bg-chart-1 rounded"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-20 text-xs text-right">CHF {(amount / 1000).toFixed(1)}K</div>
    </div>
  );
}
