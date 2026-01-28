import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  Info,
  AlertCircle,
  Target,
  DollarSign,
  Users,
  Zap,
  Calculator, 
  Filter,
  Rocket,
  Phone,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FeierabendUnitEconomicsCalculator } from "@/components/internal/FeierabendUnitEconomicsCalculator";
import { UmzugscheckUnitEconomicsCalculator } from "@/components/internal/UmzugscheckUnitEconomicsCalculator";
import { LeadTriageHelper } from "@/components/internal/LeadTriageHelper";
import { ScalingDecisionPanel } from "@/components/internal/ScalingDecisionPanel";
import { WeeklyRedFlagsPanel } from "@/components/internal/WeeklyRedFlagsPanel";
import { PhoneSupportROIRules } from "@/components/internal/PhoneSupportROIRules";
import { GavLaborCalculator } from "@/components/internal/GavLaborCalculator";
import { CherriesChaffRouter } from "@/components/internal/CherriesChaffRouter";
import { SeasonalYieldManagement } from "@/components/internal/SeasonalYieldManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Cherry, Calendar } from "lucide-react";

type BusinessModel = "feierabend" | "umzugscheck";
type Scenario = "conservative" | "base" | "aggressive";

interface InputValues {
  monthlyAdSpend: number;
  cpl: number;
  closeRate: number;
  avgOrderValue: number;
  grossMargin: number;
  salesTimeMinutes: number;
  salaryPerHour: number;
  leadQualityRate: number;
}

interface ScenarioDefaults {
  feierabend: Record<Scenario, InputValues>;
  umzugscheck: Record<Scenario, InputValues>;
}

const SCENARIO_DEFAULTS: ScenarioDefaults = {
  feierabend: {
    conservative: {
      monthlyAdSpend: 3000,
      cpl: 80,
      closeRate: 15,
      avgOrderValue: 2200,
      grossMargin: 30,
      salesTimeMinutes: 45,
      salaryPerHour: 45,
      leadQualityRate: 60,
    },
    base: {
      monthlyAdSpend: 5000,
      cpl: 60,
      closeRate: 22,
      avgOrderValue: 2800,
      grossMargin: 35,
      salesTimeMinutes: 30,
      salaryPerHour: 45,
      leadQualityRate: 75,
    },
    aggressive: {
      monthlyAdSpend: 10000,
      cpl: 45,
      closeRate: 30,
      avgOrderValue: 3200,
      grossMargin: 38,
      salesTimeMinutes: 20,
      salaryPerHour: 45,
      leadQualityRate: 85,
    },
  },
  umzugscheck: {
    conservative: {
      monthlyAdSpend: 2000,
      cpl: 12,
      closeRate: 18,
      avgOrderValue: 42,
      grossMargin: 80,
      salesTimeMinutes: 0,
      salaryPerHour: 0,
      leadQualityRate: 55,
    },
    base: {
      monthlyAdSpend: 4000,
      cpl: 8,
      closeRate: 25,
      avgOrderValue: 48,
      grossMargin: 85,
      salesTimeMinutes: 0,
      salaryPerHour: 0,
      leadQualityRate: 70,
    },
    aggressive: {
      monthlyAdSpend: 8000,
      cpl: 5,
      closeRate: 35,
      avgOrderValue: 55,
      grossMargin: 88,
      salesTimeMinutes: 0,
      salaryPerHour: 0,
      leadQualityRate: 80,
    },
  },
};

const INPUT_TOOLTIPS: Record<keyof InputValues, string> = {
  monthlyAdSpend: "Monatliches Google/Meta Ads Budget in CHF",
  cpl: "Kosten pro Lead aus den Ads (Cost per Lead)",
  closeRate: "Prozentsatz der Leads, die zu Buchungen konvertieren",
  avgOrderValue: "Durchschnittlicher Auftragswert / Lead-Preis für Marketplace",
  grossMargin: "Bruttomarge nach direkten Kosten (Material, Lohn, etc.)",
  salesTimeMinutes: "Zeit in Minuten pro Lead für Verkaufsgespräch",
  salaryPerHour: "Stundenlohn des Sales-Teams",
  leadQualityRate: "Anteil der Leads, die qualifiziert sind",
};

const formatCHF = (value: number) => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const KPICard = ({ 
  label, 
  value, 
  subValue, 
  status,
  icon: Icon,
}: { 
  label: string; 
  value: string; 
  subValue?: string;
  status?: "positive" | "negative" | "warning" | "neutral";
  icon?: React.ElementType;
}) => {
  const statusStyles = {
    positive: "border-green-500/50 bg-green-50 dark:bg-green-950/30",
    negative: "border-red-500/50 bg-red-50 dark:bg-red-950/30",
    warning: "border-amber-500/50 bg-amber-50 dark:bg-amber-950/30",
    neutral: "border-border bg-card",
  };

  const valueStyles = {
    positive: "text-green-700 dark:text-green-400",
    negative: "text-red-700 dark:text-red-400",
    warning: "text-amber-700 dark:text-amber-400",
    neutral: "text-foreground",
  };

  return (
    <Card className={cn("border-2", status ? statusStyles[status] : statusStyles.neutral)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className={cn("text-3xl font-bold tabular-nums", status ? valueStyles[status] : valueStyles.neutral)}>
              {value}
            </p>
            {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
          </div>
          {Icon && <Icon className={cn("w-6 h-6", status ? valueStyles[status] : "text-muted-foreground")} />}
        </div>
      </CardContent>
    </Card>
  );
};

const StatusIndicator = ({ cac, contributionMargin, profitPerJob }: { cac: number; contributionMargin: number; profitPerJob: number }) => {
  const isScale = contributionMargin > 0 && profitPerJob > 50;
  const isOptimize = contributionMargin > 0 && profitPerJob > 0 && profitPerJob <= 50;
  const isStop = contributionMargin <= 0 || profitPerJob <= 0;

  let status: "scale" | "optimize" | "stop";
  if (isStop) status = "stop";
  else if (isOptimize) status = "optimize";
  else status = "scale";

  const config = {
    scale: {
      color: "bg-green-500",
      icon: CheckCircle2,
      label: "SCALE",
      description: "Profitabel – Budget erhöhen empfohlen",
      bgColor: "bg-green-50 dark:bg-green-950/50 border-green-500",
    },
    optimize: {
      color: "bg-amber-500",
      icon: AlertTriangle,
      label: "OPTIMIZE",
      description: "Marginal profitabel – Optimierung nötig",
      bgColor: "bg-amber-50 dark:bg-amber-950/50 border-amber-500",
    },
    stop: {
      color: "bg-red-500",
      icon: TrendingDown,
      label: "STOP",
      description: "Unprofitabel – Kampagnen pausieren",
      bgColor: "bg-red-50 dark:bg-red-950/50 border-red-500",
    },
  };

  const { color, icon: Icon, label, description, bgColor } = config[status];

  return (
    <Card className={cn("border-2", bgColor)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("w-4 h-4 rounded-full animate-pulse", color)} />
          <Icon className={cn("w-10 h-10", status === "scale" ? "text-green-600" : status === "optimize" ? "text-amber-600" : "text-red-600")} />
          <div>
            <p className={cn("text-2xl font-bold", status === "scale" ? "text-green-700" : status === "optimize" ? "text-amber-700" : "text-red-700")}>
              {label}
            </p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InputField = ({ 
  label, 
  value, 
  onChange, 
  tooltip,
  suffix,
  disabled,
}: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void;
  tooltip: string;
  suffix?: string;
  disabled?: boolean;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div className="relative">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="pr-12 font-mono"
        disabled={disabled}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

export default function PaidMediaControl() {
  const [model, setModel] = useState<BusinessModel>("feierabend");
  const [scenario, setScenario] = useState<Scenario>("base");
  const [inputs, setInputs] = useState<InputValues>(SCENARIO_DEFAULTS[model][scenario]);

  const handleModelChange = (isUmzugscheck: boolean) => {
    const newModel = isUmzugscheck ? "umzugscheck" : "feierabend";
    setModel(newModel);
    setInputs(SCENARIO_DEFAULTS[newModel][scenario]);
  };

  const handleScenarioChange = (newScenario: Scenario) => {
    setScenario(newScenario);
    setInputs(SCENARIO_DEFAULTS[model][newScenario]);
  };

  const updateInput = (key: keyof InputValues, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculations = useMemo(() => {
    const { monthlyAdSpend, cpl, closeRate, avgOrderValue, grossMargin, salesTimeMinutes, salaryPerHour, leadQualityRate } = inputs;
    
    const leadsPerMonth = cpl > 0 ? monthlyAdSpend / cpl : 0;
    const qualifiedLeads = leadsPerMonth * (leadQualityRate / 100);
    const bookings = qualifiedLeads * (closeRate / 100);
    
    const revenue = bookings * avgOrderValue;
    const grossProfit = revenue * (grossMargin / 100);
    
    // Sales cost (only for direct mover)
    const salesHoursPerMonth = (leadsPerMonth * salesTimeMinutes) / 60;
    const salesCost = salesHoursPerMonth * salaryPerHour;
    
    // Contribution Margin II = Gross Profit - Ad Spend - Sales Cost
    const contributionMarginII = grossProfit - monthlyAdSpend - salesCost;
    
    // CAC = Total Acquisition Cost / Bookings
    const cac = bookings > 0 ? (monthlyAdSpend + salesCost) / bookings : Infinity;
    
    // Profit per Job/Lead
    const profitPerJob = bookings > 0 ? contributionMarginII / bookings : 0;
    
    // Break-even CPL
    const revenuePerLead = (closeRate / 100) * avgOrderValue * (grossMargin / 100);
    const salesCostPerLead = (salesTimeMinutes / 60) * salaryPerHour;
    const breakEvenCPL = revenuePerLead - salesCostPerLead;
    
    // ROAS
    const roas = monthlyAdSpend > 0 ? revenue / monthlyAdSpend : 0;

    return {
      leadsPerMonth,
      qualifiedLeads,
      bookings,
      revenue,
      grossProfit,
      salesCost,
      contributionMarginII,
      cac,
      profitPerJob,
      breakEvenCPL,
      roas,
    };
  }, [inputs]);

  // Stress test scenarios
  const stressTests = useMemo(() => {
    const base = { ...inputs };
    const tests = [
      { label: "CPL +25%", changes: { cpl: base.cpl * 1.25 } },
      { label: "CPL +50%", changes: { cpl: base.cpl * 1.5 } },
      { label: "Close Rate -20%", changes: { closeRate: base.closeRate * 0.8 } },
      { label: "Close Rate -40%", changes: { closeRate: base.closeRate * 0.6 } },
      { label: "Sales Time +50%", changes: { salesTimeMinutes: base.salesTimeMinutes * 1.5 } },
      { label: "Worst Case", changes: { cpl: base.cpl * 1.4, closeRate: base.closeRate * 0.7, salesTimeMinutes: base.salesTimeMinutes * 1.3 } },
    ];

    return tests.map(test => {
      const testInputs = { ...base, ...test.changes };
      const leadsPerMonth = testInputs.cpl > 0 ? testInputs.monthlyAdSpend / testInputs.cpl : 0;
      const qualifiedLeads = leadsPerMonth * (testInputs.leadQualityRate / 100);
      const bookings = qualifiedLeads * (testInputs.closeRate / 100);
      const revenue = bookings * testInputs.avgOrderValue;
      const grossProfit = revenue * (testInputs.grossMargin / 100);
      const salesHoursPerMonth = (leadsPerMonth * testInputs.salesTimeMinutes) / 60;
      const salesCost = salesHoursPerMonth * testInputs.salaryPerHour;
      const contributionMarginII = grossProfit - testInputs.monthlyAdSpend - salesCost;
      const profitPerJob = bookings > 0 ? contributionMarginII / bookings : 0;

      return {
        label: test.label,
        contributionMarginII,
        profitPerJob,
        isProfitable: contributionMarginII > 0,
      };
    });
  }, [inputs]);

  // Guardrails
  const alerts = useMemo(() => {
    const warnings: { type: "error" | "warning"; message: string }[] = [];
    
    if (calculations.cac === Infinity || calculations.cac > inputs.avgOrderValue) {
      warnings.push({ type: "error", message: "CAC übersteigt den durchschnittlichen Auftragswert" });
    }
    if (inputs.cpl > calculations.breakEvenCPL) {
      warnings.push({ type: "error", message: `CPL (${formatCHF(inputs.cpl)}) liegt über Break-even (${formatCHF(calculations.breakEvenCPL)})` });
    }
    if (calculations.contributionMarginII < 0) {
      warnings.push({ type: "error", message: "Negative Contribution Margin – Kampagnen verbrennen Geld" });
    }
    if (inputs.closeRate < 10) {
      warnings.push({ type: "warning", message: "Close Rate unter 10% – Lead-Qualität prüfen" });
    }
    if (calculations.roas < 2) {
      warnings.push({ type: "warning", message: "ROAS unter 2x – Skalierung nicht empfohlen" });
    }

    return warnings;
  }, [calculations, inputs]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* TOP BAR */}
        <header className="border-b-2 border-border bg-card sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">INTERNAL / CFO-COO</p>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Unit Economics Control</h1>
              </div>
              <div className="flex items-center gap-3 bg-muted border border-border rounded p-2">
                <span className={cn("text-xs font-mono", model === "feierabend" ? "text-foreground" : "text-muted-foreground")}>
                  DIRECT
                </span>
                <Switch
                  checked={model === "umzugscheck"}
                  onCheckedChange={handleModelChange}
                />
                <span className={cn("text-xs font-mono", model === "umzugscheck" ? "text-foreground" : "text-muted-foreground")}>
                  MARKETPLACE
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Tabs for all panels */}
          <Tabs defaultValue="calculator" className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex w-auto min-w-full md:grid md:grid-cols-8 gap-1">
                <TabsTrigger value="calculator" className="gap-1 text-xs px-2">
                  <Calculator className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Unit Economics</span>
                  <span className="lg:hidden">Calc</span>
                </TabsTrigger>
                <TabsTrigger value="triage" className="gap-1 text-xs px-2">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Triage</span>
                  <span className="lg:hidden">Triage</span>
                </TabsTrigger>
                <TabsTrigger value="scaling" className="gap-1 text-xs px-2">
                  <Rocket className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Scaling</span>
                  <span className="lg:hidden">Scale</span>
                </TabsTrigger>
                <TabsTrigger value="redflags" className="gap-1 text-xs px-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Red Flags</span>
                  <span className="lg:hidden">Flags</span>
                </TabsTrigger>
                <TabsTrigger value="phone" className="gap-1 text-xs px-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Phone ROI</span>
                  <span className="lg:hidden">Phone</span>
                </TabsTrigger>
                <TabsTrigger value="gav" className="gap-1 text-xs px-2">
                  <Truck className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">GAV Labor</span>
                  <span className="lg:hidden">GAV</span>
                </TabsTrigger>
                <TabsTrigger value="cherries" className="gap-1 text-xs px-2">
                  <Cherry className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Cherries</span>
                  <span className="lg:hidden">C&C</span>
                </TabsTrigger>
                <TabsTrigger value="yield" className="gap-1 text-xs px-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Yield</span>
                  <span className="lg:hidden">Yield</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calculator" className="mt-6">
              {/* Conditional Content based on Model */}
              {model === "feierabend" ? (
                /* FEIERABEND CALCULATOR */
                <FeierabendUnitEconomicsCalculator />
              ) : (
                /* UMZUGSCHECK MARKETPLACE CALCULATOR */
                <UmzugscheckUnitEconomicsCalculator />
              )}
            </TabsContent>

            <TabsContent value="triage" className="mt-6">
              <LeadTriageHelper />
            </TabsContent>

            <TabsContent value="scaling" className="mt-6">
              <ScalingDecisionPanel 
                model={model}
                criteria={{
                  cacToRevenueRatio: model === 'feierabend' ? 18 : 12,
                  conversionRateStability: 75,
                  capacityUtilization: 72,
                  cashRunwayMonths: 4,
                  avgCloseRate: model === 'feierabend' ? 20 : 25,
                  cmiiPerJob: model === 'feierabend' ? 450 : 15,
                }}
              />
            </TabsContent>

            <TabsContent value="redflags" className="mt-6">
              <WeeklyRedFlagsPanel 
                model={model}
                metrics={{
                  leadQualityScore: 72,
                  leadQualityTrend: 'stable',
                  invalidLeadRate: 12,
                  currentCPL: model === 'feierabend' ? 65 : 48,
                  baselineCPL: model === 'feierabend' ? 60 : 45,
                  currentCPA: model === 'feierabend' ? 320 : 85,
                  baselineCPA: model === 'feierabend' ? 300 : 80,
                  avgCallDuration: 7,
                  targetCallDuration: 6,
                  callBacklog: 3,
                  responseTimeHours: 1.2,
                  currentConversionRate: model === 'feierabend' ? 19 : 23,
                  baselineConversionRate: model === 'feierabend' ? 20 : 25,
                  capacityUtilization: 72,
                  customerSatisfactionScore: 88,
                  complaintRate: 2,
                }}
              />
            </TabsContent>

            <TabsContent value="phone" className="mt-6">
              <PhoneSupportROIRules 
                metrics={{
                  avgCallDuration: 7,
                  callsPerDay: 25,
                  conversionFromCall: model === 'feierabend' ? 22 : 8,
                  costPerCallMinute: 1.5,
                  avgJobValueFromCall: model === 'feierabend' ? 2500 : 55,
                }}
              />
            </TabsContent>

            <TabsContent value="gav" className="mt-6">
              <GavLaborCalculator />
            </TabsContent>

            <TabsContent value="cherries" className="mt-6">
              <CherriesChaffRouter />
            </TabsContent>

            <TabsContent value="yield" className="mt-6">
              <SeasonalYieldManagement />
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
            Internal use only • Simulation based on input parameters • {new Date().toLocaleDateString("de-CH")}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
