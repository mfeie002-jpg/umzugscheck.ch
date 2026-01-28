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
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        <header className="border-b border-border bg-muted/30 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Internal Dashboard</p>
                <h1 className="text-2xl font-bold text-foreground">Paid Media & Profitability Control Center</h1>
              </div>
              <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-3">
                <span className={cn("text-sm font-medium", model === "feierabend" ? "text-foreground" : "text-muted-foreground")}>
                  Feierabendumzug (Direct)
                </span>
                <Switch
                  checked={model === "umzugscheck"}
                  onCheckedChange={handleModelChange}
                />
                <span className={cn("text-sm font-medium", model === "umzugscheck" ? "text-foreground" : "text-muted-foreground")}>
                  Umzugscheck (Marketplace)
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* SECTION 1 — Scenario Selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Szenario wählen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {(["conservative", "base", "aggressive"] as Scenario[]).map((s) => (
                  <Button
                    key={s}
                    variant={scenario === s ? "default" : "outline"}
                    onClick={() => handleScenarioChange(s)}
                    className="flex-1"
                  >
                    {s === "conservative" && "🛡️ Conservative"}
                    {s === "base" && "📊 Base Case"}
                    {s === "aggressive" && "🚀 Aggressive"}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {scenario === "conservative" && "Pessimistische Annahmen – höhere Kosten, niedrigere Conversion"}
                {scenario === "base" && "Realistische Annahmen basierend auf aktuellen Daten"}
                {scenario === "aggressive" && "Optimistische Annahmen – beste Performance-Werte"}
              </p>
            </CardContent>
          </Card>

          {/* Status Indicator */}
          <StatusIndicator 
            cac={calculations.cac} 
            contributionMargin={calculations.contributionMarginII} 
            profitPerJob={calculations.profitPerJob} 
          />

          {/* SECTION 2 & 3 — Input Panel + Calculated Results */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Input Panel (Left - 2 cols) */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Input Parameter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputField
                  label="Monatliches Ad Spend"
                  value={inputs.monthlyAdSpend}
                  onChange={(v) => updateInput("monthlyAdSpend", v)}
                  tooltip={INPUT_TOOLTIPS.monthlyAdSpend}
                  suffix="CHF"
                />
                <InputField
                  label="Cost per Lead (CPL)"
                  value={inputs.cpl}
                  onChange={(v) => updateInput("cpl", v)}
                  tooltip={INPUT_TOOLTIPS.cpl}
                  suffix="CHF"
                />
                <InputField
                  label="Close Rate"
                  value={inputs.closeRate}
                  onChange={(v) => updateInput("closeRate", v)}
                  tooltip={INPUT_TOOLTIPS.closeRate}
                  suffix="%"
                />
                <InputField
                  label={model === "feierabend" ? "Ø Auftragswert" : "Lead-Preis (an Provider)"}
                  value={inputs.avgOrderValue}
                  onChange={(v) => updateInput("avgOrderValue", v)}
                  tooltip={INPUT_TOOLTIPS.avgOrderValue}
                  suffix="CHF"
                />
                <InputField
                  label="Bruttomarge"
                  value={inputs.grossMargin}
                  onChange={(v) => updateInput("grossMargin", v)}
                  tooltip={INPUT_TOOLTIPS.grossMargin}
                  suffix="%"
                />
                {model === "feierabend" && (
                  <>
                    <InputField
                      label="Sales-Zeit pro Lead"
                      value={inputs.salesTimeMinutes}
                      onChange={(v) => updateInput("salesTimeMinutes", v)}
                      tooltip={INPUT_TOOLTIPS.salesTimeMinutes}
                      suffix="min"
                    />
                    <InputField
                      label="Stundenlohn Sales"
                      value={inputs.salaryPerHour}
                      onChange={(v) => updateInput("salaryPerHour", v)}
                      tooltip={INPUT_TOOLTIPS.salaryPerHour}
                      suffix="CHF/h"
                    />
                  </>
                )}
                <InputField
                  label="Lead-Qualitätsrate"
                  value={inputs.leadQualityRate}
                  onChange={(v) => updateInput("leadQualityRate", v)}
                  tooltip={INPUT_TOOLTIPS.leadQualityRate}
                  suffix="%"
                />
              </CardContent>
            </Card>

            {/* Calculated Results (Right - 3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <KPICard
                  label="CAC (Customer Acquisition Cost)"
                  value={calculations.cac === Infinity ? "∞" : formatCHF(calculations.cac)}
                  subValue={`Max erlaubt: ${formatCHF(inputs.avgOrderValue * (inputs.grossMargin / 100))}`}
                  status={calculations.cac < inputs.avgOrderValue * (inputs.grossMargin / 100) * 0.5 ? "positive" : calculations.cac < inputs.avgOrderValue * (inputs.grossMargin / 100) ? "warning" : "negative"}
                  icon={Users}
                />
                <KPICard
                  label="Contribution Margin II"
                  value={formatCHF(calculations.contributionMarginII)}
                  subValue="Nach Ad Spend + Sales"
                  status={calculations.contributionMarginII > 1000 ? "positive" : calculations.contributionMarginII > 0 ? "warning" : "negative"}
                  icon={DollarSign}
                />
                <KPICard
                  label={model === "feierabend" ? "Profit pro Auftrag" : "Profit pro Lead"}
                  value={formatCHF(calculations.profitPerJob)}
                  subValue={`Bei ${Math.round(calculations.bookings)} ${model === "feierabend" ? "Buchungen" : "verkauften Leads"}/Mt.`}
                  status={calculations.profitPerJob > 100 ? "positive" : calculations.profitPerJob > 0 ? "warning" : "negative"}
                  icon={TrendingUp}
                />
                <KPICard
                  label="Break-even CPL"
                  value={formatCHF(Math.max(0, calculations.breakEvenCPL))}
                  subValue={`Aktueller CPL: ${formatCHF(inputs.cpl)}`}
                  status={inputs.cpl < calculations.breakEvenCPL * 0.7 ? "positive" : inputs.cpl < calculations.breakEvenCPL ? "warning" : "negative"}
                  icon={Target}
                />
              </div>

              {/* Secondary metrics */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Leads/Monat</p>
                      <p className="font-bold text-lg">{Math.round(calculations.leadsPerMonth)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Qualifiziert</p>
                      <p className="font-bold text-lg">{Math.round(calculations.qualifiedLeads)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{model === "feierabend" ? "Buchungen" : "Verkauft"}</p>
                      <p className="font-bold text-lg">{Math.round(calculations.bookings)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">ROAS</p>
                      <p className={cn("font-bold text-lg", calculations.roas >= 3 ? "text-green-600" : calculations.roas >= 1.5 ? "text-amber-600" : "text-red-600")}>
                        {calculations.roas.toFixed(2)}x
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SECTION 4 — Stress Test Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Stress Test – Sensitivitätsanalyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Szenario</th>
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">Contribution Margin II</th>
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">Profit/Einheit</th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 bg-primary/5">
                      <td className="py-3 px-3 font-medium">📊 Aktuelles Szenario</td>
                      <td className={cn("text-right py-3 px-3 font-mono font-bold", calculations.contributionMarginII >= 0 ? "text-green-600" : "text-red-600")}>
                        {formatCHF(calculations.contributionMarginII)}
                      </td>
                      <td className={cn("text-right py-3 px-3 font-mono", calculations.profitPerJob >= 0 ? "text-green-600" : "text-red-600")}>
                        {formatCHF(calculations.profitPerJob)}
                      </td>
                      <td className="text-center py-3 px-3">
                        {calculations.contributionMarginII > 0 ? (
                          <Badge className="bg-green-100 text-green-800">Profitabel</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Verlust</Badge>
                        )}
                      </td>
                    </tr>
                    {stressTests.map((test, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-3">{test.label}</td>
                        <td className={cn("text-right py-3 px-3 font-mono", test.contributionMarginII >= 0 ? "text-green-600" : "text-red-600")}>
                          {formatCHF(test.contributionMarginII)}
                        </td>
                        <td className={cn("text-right py-3 px-3 font-mono", test.profitPerJob >= 0 ? "text-green-600" : "text-red-600")}>
                          {formatCHF(test.profitPerJob)}
                        </td>
                        <td className="text-center py-3 px-3">
                          {test.isProfitable ? (
                            <Badge className="bg-green-100 text-green-800">OK</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">⚠️ Kritisch</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 5 — Guardrails & Alerts */}
          {alerts.length > 0 && (
            <Card className="border-2 border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Guardrails & Warnungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {alerts.map((alert, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {alert.type === "error" ? (
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      )}
                      <span className={cn("text-sm", alert.type === "error" ? "text-red-700" : "text-amber-700")}>
                        {alert.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
            Internal use only • Simulation based on input parameters • {new Date().toLocaleDateString("de-CH")}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
