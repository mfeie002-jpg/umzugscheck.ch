/**
 * Command Center - Central Operations Dashboard
 * 10 Module Overview for Multi-Brand Portfolio
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  Building2,
  HelpCircle,
  Info
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
import { ModuleHeader, MODULE_CONFIGS } from './ModuleHeader';

// Tab definitions with tooltips
const TABS = [
  { value: 'overview', label: 'Übersicht', icon: LayoutDashboard, tooltip: 'Schnellübersicht aller wichtigen Metriken auf einen Blick' },
  { value: 'brands', label: 'Marken', icon: Building2, tooltip: 'Performance der 3 Marken: Feierabend, Umzugexpress, Zügelhelden' },
  { value: 'routing', label: 'Routing', icon: Route, tooltip: 'Automatische Lead-Verteilung basierend auf Score und Wert' },
  { value: 'capacity', label: 'Kapazität', icon: Users, tooltip: 'Crew-Auslastung und Verfügbarkeit planen' },
  { value: 'killswitch', label: 'Kill Switch', icon: AlertTriangle, tooltip: 'Automatische Notfall-Stopps bei kritischen Metriken' },
  { value: 'forecast', label: 'Prognose', icon: TrendingUp, tooltip: '6-Monats Revenue-Vorhersage nach Marke' },
  { value: 'partners', label: 'Partner', icon: Users, tooltip: 'Marketplace Partner Status und Performance' },
  { value: 'funnel', label: 'Funnel', icon: Target, tooltip: 'Conversion Rates von Website bis Buchung' },
  { value: 'costs', label: 'Kosten', icon: DollarSign, tooltip: 'Kostenstruktur und Unit Economics pro Job' },
  { value: 'simulator', label: 'Simulator', icon: Calculator, tooltip: 'What-if Analyse: Teste verschiedene Szenarien' },
];

export function CommandCenter() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              Operations Center
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

        {/* Intro Card */}
        {showIntro && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Info className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Willkommen im Operations Center!</h3>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                      Dies ist deine Zentrale für alle Business-Metriken. Nutze die <strong>Tabs oben</strong> um 
                      zwischen Modulen zu wechseln. Jedes Modul hat einen <strong>"Wie funktioniert das?"</strong>-Button 
                      mit detaillierten Erklärungen. Die <strong>Quick Stats</strong> unten zeigen die wichtigsten Zahlen 
                      auf einen Blick - hovere für mehr Info.
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowIntro(false)}>
                  Verstanden
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Bar with Tooltips */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <QuickStat 
            icon={Building2} 
            label="Marken" 
            value="3" 
            tooltip="Feierabend (Premium), Umzugexpress (Speed), Zügelhelden (Budget)"
          />
          <QuickStat 
            icon={Users} 
            label="Crews" 
            value="1" 
            tooltip="Aktive Umzugs-Teams. Bei >85% Auslastung für 4 Wochen → Crew #2 einstellen"
          />
          <QuickStat 
            icon={Target} 
            label="Jobs/Monat" 
            value="26" 
            tooltip="Geplante Jobs diesen Monat über alle 3 Marken"
          />
          <QuickStat 
            icon={DollarSign} 
            label="Ziel-Revenue" 
            value="CHF 47K" 
            tooltip="Monatliches Umsatzziel basierend auf 26 Jobs × Ø CHF 1'815"
          />
          <QuickStat 
            icon={Gauge} 
            label="Auslastung" 
            value="85%" 
            status="ok" 
            tooltip="80-95% = Optimal. Unter 60% = Rabatte anbieten. Über 95% = Peak-Pricing"
          />
          <QuickStat 
            icon={AlertTriangle} 
            label="Kill Switches" 
            value="0 aktiv" 
            status="ok" 
            tooltip="Automatische Notfall-Stopps. 0 = Alle Metriken im grünen Bereich"
          />
        </div>

        {/* Main Tabs with Tooltips */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full h-auto">
            {TABS.map((tab) => (
              <Tooltip key={tab.value}>
                <TooltipTrigger asChild>
                  <TabsTrigger value={tab.value} className="text-xs">
                    <tab.icon className="h-3 w-3 mr-1" />
                    {tab.label}
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-sm">{tab.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewIntro />
            <OverviewGrid />
          </TabsContent>

          <TabsContent value="brands" className="mt-6">
            <ModuleHeader {...MODULE_CONFIGS.brands} icon={Building2} />
            <BrandPerformanceModule />
          </TabsContent>

          <TabsContent value="routing" className="mt-6">
            <ModuleHeader {...MODULE_CONFIGS.routing} icon={Route} />
            <LeadRoutingModule />
          </TabsContent>

          <TabsContent value="capacity" className="mt-6">
            <ModuleHeader {...MODULE_CONFIGS.capacity} icon={Users} />
            <CapacityPlannerModule />
          </TabsContent>

          <TabsContent value="killswitch" className="mt-6">
            <ModuleHeader {...MODULE_CONFIGS.killswitch} icon={AlertTriangle} />
            <KillSwitchModule />
          </TabsContent>

          <TabsContent value="forecast" className="mt-6">
            <ModuleHeader {...MODULE_CONFIGS.forecast} icon={TrendingUp} />
            <RevenueForecastModule />
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            <ModuleHeader {...MODULE_CONFIGS.partners} icon={Users} />
            <PartnerNetworkModule />
          </TabsContent>

          <TabsContent value="funnel" className="mt-6">
            <ModuleHeader {...MODULE_CONFIGS.funnel} icon={Target} />
            <ConversionFunnelModule />
          </TabsContent>

          <TabsContent value="costs" className="mt-6">
            <ModuleHeader {...MODULE_CONFIGS.costs} icon={DollarSign} />
            <CostStructureModule />
          </TabsContent>

          <TabsContent value="simulator" className="mt-6">
            <ModuleHeader {...MODULE_CONFIGS.simulator} icon={Calculator} />
            <ScenarioSimulatorModule />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

// Quick Stat Component with Tooltip
function QuickStat({ 
  icon: Icon, 
  label, 
  value, 
  status,
  tooltip 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
  status?: 'ok' | 'warning' | 'critical';
  tooltip?: string;
}) {
  const content = (
    <Card className={`cursor-help transition-all hover:shadow-md
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
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {label}
              <HelpCircle className="h-3 w-3 opacity-50" />
            </p>
            <p className="font-bold text-sm">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// Overview Introduction
function OverviewIntro() {
  return (
    <Card className="mb-6 bg-muted/30">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <LayoutDashboard className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold">Übersicht</h3>
            <p className="text-sm text-muted-foreground">
              Die Übersicht zeigt kompakte Versionen aller wichtigen Module. 
              Klicke auf die <strong>Tabs oben</strong> für detaillierte Ansichten mit mehr Interaktionsmöglichkeiten.
            </p>
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
          <CardDescription className="text-xs">Revenue & Margin pro Marke</CardDescription>
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
          <CardDescription className="text-xs">Automatische Notfall-Schwellwerte</CardDescription>
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
          <CardDescription className="text-xs">80-95% ist optimal</CardDescription>
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
          <CardDescription className="text-xs">Vom Besucher zur Buchung</CardDescription>
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
          <CardDescription className="text-xs">COGS Verteilung</CardDescription>
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
          <CardDescription className="text-xs">KW {new Date().getWeek()} Performance</CardDescription>
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

// Helper for week number
declare global {
  interface Date {
    getWeek(): number;
  }
}
Date.prototype.getWeek = function() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
};
