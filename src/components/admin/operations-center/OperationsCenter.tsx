/**
 * Command Center - Central Operations Dashboard
 * Mobile-First Design with Touch-Optimized UX
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
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
  Info,
  Menu,
  Phone,
  X,
  ChevronRight
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

// Tab definitions
const TABS = [
  { value: 'overview', label: 'Übersicht', icon: LayoutDashboard, tooltip: 'Schnellübersicht' },
  { value: 'brands', label: 'Marken', icon: Building2, tooltip: '3 Marken Performance' },
  { value: 'routing', label: 'Routing', icon: Route, tooltip: 'Lead-Verteilung' },
  { value: 'capacity', label: 'Kapazität', icon: Users, tooltip: 'Crew-Auslastung' },
  { value: 'killswitch', label: 'Kill Switch', icon: AlertTriangle, tooltip: 'Notfall-Stopps' },
  { value: 'forecast', label: 'Prognose', icon: TrendingUp, tooltip: 'Revenue-Vorhersage' },
  { value: 'partners', label: 'Partner', icon: Users, tooltip: 'Marketplace Partner' },
  { value: 'funnel', label: 'Funnel', icon: Target, tooltip: 'Conversion Rates' },
  { value: 'costs', label: 'Kosten', icon: DollarSign, tooltip: 'Unit Economics' },
  { value: 'simulator', label: 'Simulator', icon: Calculator, tooltip: 'What-if Analyse' },
];

export function CommandCenter() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-4">
      {/* Mobile Header - Compact & Touch-Friendly */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b md:relative md:border-0">
        <div className="flex items-center justify-between p-3 md:p-0">
          {/* Mobile: Compact title */}
          <div className="flex items-center gap-2 md:hidden">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="font-bold">Ops Center</span>
          </div>
          
          {/* Desktop: Full header */}
          <div className="hidden md:block">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
              <LayoutDashboard className="h-7 w-7 lg:h-8 lg:w-8 text-primary" />
              Operations Center
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Multi-Brand Dashboard • Live Monitoring
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing} 
              size="sm"
              variant="ghost"
              className="h-10 w-10 p-0 md:h-9 md:w-auto md:px-3"
            >
              <RefreshCw className={`h-5 w-5 md:h-4 md:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline md:ml-2">Aktualisieren</span>
            </Button>
            
            {/* Mobile Nav Toggle */}
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 w-10 p-0 md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="pt-4">
                  <h3 className="font-bold text-lg mb-4">Module</h3>
                  <div className="space-y-1">
                    {TABS.map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors min-h-[56px]
                          ${activeTab === tab.value 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted active:bg-muted/80'
                          }`}
                      >
                        <tab.icon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <p className="font-medium">{tab.label}</p>
                          <p className={`text-xs ${activeTab === tab.value ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {tab.tooltip}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 opacity-50" />
                      </button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-0 md:pt-6 space-y-4 md:space-y-6">
        {/* Intro Card - Collapsible on Mobile */}
        {showIntro && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">Willkommen!</span> Wische durch die <strong>Tabs</strong> oder tippe auf <strong>☰</strong> für alle Module.
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowIntro(false)}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats - 2x3 Grid on Mobile, 6 columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          <QuickStatMobile icon={Building2} label="Marken" value="3" />
          <QuickStatMobile icon={Users} label="Crews" value="1" />
          <QuickStatMobile icon={Target} label="Jobs" value="26" />
          <QuickStatMobile icon={DollarSign} label="Revenue" value="47K" />
          <QuickStatMobile icon={Gauge} label="Auslastung" value="85%" status="ok" />
          <QuickStatMobile icon={AlertTriangle} label="Alerts" value="0" status="ok" />
        </div>

        {/* Tab Navigation - Horizontal Scroll on Mobile */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile: Horizontal Scroll Tabs */}
          <div className="md:hidden -mx-3 px-3">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-full transition-colors min-h-[48px] flex-shrink-0
                      ${activeTab === tab.value 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                      }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </div>

          {/* Desktop: Standard Tabs */}
          <TabsList className="hidden md:grid md:grid-cols-5 lg:grid-cols-10 w-full h-auto">
            {TABS.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="text-xs py-2.5"
              >
                <tab.icon className="h-3.5 w-3.5 mr-1.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="overview" className="mt-4 md:mt-6">
            <OverviewIntroMobile />
            <OverviewGridMobile />
          </TabsContent>

          <TabsContent value="brands" className="mt-4 md:mt-6">
            <ModuleHeader {...MODULE_CONFIGS.brands} icon={Building2} />
            <BrandPerformanceModule />
          </TabsContent>

          <TabsContent value="routing" className="mt-4 md:mt-6">
            <ModuleHeader {...MODULE_CONFIGS.routing} icon={Route} />
            <LeadRoutingModule />
          </TabsContent>

          <TabsContent value="capacity" className="mt-4 md:mt-6">
            <ModuleHeader {...MODULE_CONFIGS.capacity} icon={Users} />
            <CapacityPlannerModule />
          </TabsContent>

          <TabsContent value="killswitch" className="mt-4 md:mt-6">
            <ModuleHeader {...MODULE_CONFIGS.killswitch} icon={AlertTriangle} />
            <KillSwitchModule />
          </TabsContent>

          <TabsContent value="forecast" className="mt-4 md:mt-6">
            <ModuleHeader {...MODULE_CONFIGS.forecast} icon={TrendingUp} />
            <RevenueForecastModule />
          </TabsContent>

          <TabsContent value="partners" className="mt-4 md:mt-6">
            <ModuleHeader {...MODULE_CONFIGS.partners} icon={Users} />
            <PartnerNetworkModule />
          </TabsContent>

          <TabsContent value="funnel" className="mt-4 md:mt-6">
            <ModuleHeader {...MODULE_CONFIGS.funnel} icon={Target} />
            <ConversionFunnelModule />
          </TabsContent>

          <TabsContent value="costs" className="mt-4 md:mt-6">
            <ModuleHeader {...MODULE_CONFIGS.costs} icon={DollarSign} />
            <CostStructureModule />
          </TabsContent>

          <TabsContent value="simulator" className="mt-4 md:mt-6">
            <ModuleHeader {...MODULE_CONFIGS.simulator} icon={Calculator} />
            <ScenarioSimulatorModule />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Bottom CTA - Call to Action */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur border-t md:hidden safe-area-inset-bottom">
        <Button 
          size="lg" 
          className="w-full h-14 text-base font-semibold gap-2"
          asChild
        >
          <a href="tel:+41765681302">
            <Phone className="h-5 w-5" />
            Jetzt Lead anrufen
          </a>
        </Button>
      </div>
    </div>
  );
}

// Mobile-Optimized Quick Stat
function QuickStatMobile({ 
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
      ${status === 'ok' ? 'border-green-500/30 bg-green-500/5' : ''}
      ${status === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' : ''}
      ${status === 'critical' ? 'border-destructive/30 bg-destructive/5' : ''}
    `}>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 flex-shrink-0 ${
            status === 'ok' ? 'text-green-600' :
            status === 'warning' ? 'text-yellow-600' :
            status === 'critical' ? 'text-destructive' : 
            'text-muted-foreground'
          }`} />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="font-bold text-sm md:text-base">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile Overview Intro
function OverviewIntroMobile() {
  return (
    <Card className="mb-4 bg-muted/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <LayoutDashboard className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Kompakte Übersicht aller Module. Tippe auf einen <strong>Tab</strong> für Details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile-Optimized Overview Grid
function OverviewGridMobile() {
  return (
    <div className="grid gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Brand Summary */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Marken Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-3">
            <BrandRowMobile name="Feierabend" revenue={22400} margin={35} color="bg-primary" />
            <BrandRowMobile name="Umzugexpress" revenue={16000} margin={28} color="bg-destructive" />
            <BrandRowMobile name="Zügelhelden" revenue={8800} margin={22} color="bg-chart-1" />
          </div>
        </CardContent>
      </Card>

      {/* Kill Switch Status */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Kill Switch Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-2">
            <KillSwitchRowMobile name="CPL" value={45} threshold={90} />
            <KillSwitchRowMobile name="CM2" value={28} threshold={20} inverted />
            <KillSwitchRowMobile name="Claims" value={2} threshold={5} />
            <KillSwitchRowMobile name="Runway" value={6} threshold={3} inverted unit="Mo" />
          </div>
        </CardContent>
      </Card>

      {/* Capacity Gauge */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Auslastung
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex items-center justify-center py-2">
            <div className="relative">
              <svg className="w-20 h-20 md:w-24 md:h-24 transform -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" className="md:hidden" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" className="hidden md:block" />
                <circle 
                  cx="40" cy="40" r="32" fill="none" 
                  stroke="hsl(var(--primary))" strokeWidth="6"
                  strokeDasharray={`${85 * 2.01} ${100 * 2.01}`}
                  strokeLinecap="round"
                  className="md:hidden"
                />
                <circle 
                  cx="48" cy="48" r="40" fill="none" 
                  stroke="hsl(var(--primary))" strokeWidth="8"
                  strokeDasharray={`${85 * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round"
                  className="hidden md:block"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-bold">85%</span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">26 von 31 Jobs</p>
        </CardContent>
      </Card>

      {/* Funnel Mini */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Funnel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-1.5">
            <FunnelRowMobile stage="Website" count={2500} percentage={100} />
            <FunnelRowMobile stage="Calculator" count={450} percentage={18} />
            <FunnelRowMobile stage="Lead" count={95} percentage={21} />
            <FunnelRowMobile stage="Quoted" count={42} percentage={44} />
            <FunnelRowMobile stage="Booked" count={26} percentage={62} />
          </div>
        </CardContent>
      </Card>

      {/* Costs Mini */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Kosten
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-2">
            <CostRowMobile name="Personal" amount={18500} percentage={55} />
            <CostRowMobile name="Fahrzeug" amount={4200} percentage={12} />
            <CostRowMobile name="Marketing" amount={5700} percentage={17} />
            <CostRowMobile name="Overhead" amount={5400} percentage={16} />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Mini */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Diese Woche
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="font-bold">CHF 11.2K</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Jobs</p>
              <p className="font-bold">7</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Marge</p>
              <p className="font-bold text-green-600">29%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Leads</p>
              <p className="font-bold">23</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components - Mobile Optimized
function BrandRowMobile({ name, revenue, margin, color }: { name: string; revenue: number; margin: number; color: string }) {
  return (
    <div className="flex items-center gap-3 min-h-[44px]">
      <div className={`w-1.5 h-10 rounded ${color}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        <p className="text-xs text-muted-foreground">
          CHF {(revenue / 1000).toFixed(1)}K • {margin}%
        </p>
      </div>
    </div>
  );
}

function KillSwitchRowMobile({ name, value, threshold, inverted = false, unit = '' }: { 
  name: string; value: number; threshold: number; inverted?: boolean; unit?: string;
}) {
  const isOk = inverted ? value >= threshold : value <= threshold;
  return (
    <div className="flex items-center justify-between min-h-[36px]">
      <span className="text-sm">{name}</span>
      <div className="flex items-center gap-2">
        <span className={`font-medium ${isOk ? 'text-green-600' : 'text-destructive'}`}>
          {value}{unit}
        </span>
        <Badge variant={isOk ? 'secondary' : 'destructive'} className="text-xs h-5">
          {isOk ? 'OK' : '!'}
        </Badge>
      </div>
    </div>
  );
}

function FunnelRowMobile({ stage, count, percentage }: { stage: string; count: number; percentage: number }) {
  return (
    <div className="flex items-center gap-2 min-h-[28px]">
      <div className="w-16 text-xs truncate">{stage}</div>
      <div className="flex-1 h-3 bg-muted rounded overflow-hidden">
        <div className="h-full bg-primary/60 rounded" style={{ width: `${percentage}%` }} />
      </div>
      <div className="w-8 text-xs text-right">{percentage}%</div>
    </div>
  );
}

function CostRowMobile({ name, amount, percentage }: { name: string; amount: number; percentage: number }) {
  return (
    <div className="flex items-center gap-2 min-h-[28px]">
      <div className="w-16 text-xs truncate">{name}</div>
      <div className="flex-1 h-2.5 bg-muted rounded overflow-hidden">
        <div className="h-full bg-chart-1 rounded" style={{ width: `${percentage}%` }} />
      </div>
      <div className="w-12 text-xs text-right">{(amount / 1000).toFixed(1)}K</div>
    </div>
  );
}
