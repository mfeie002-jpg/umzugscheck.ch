import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Info,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Calculator,
  Users,
  DollarSign,
  Repeat,
  Headphones,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UmzugscheckInputs {
  cplBuy: number;
  pricePerPartnerLead: number;
  avgBuyersPerLead: number;
  partnerCloseRate: number;
  estimatedBookingValue: number;
  commissionPercentage: number;
  conciergeFee: number;
  supportCostPerLead: number;
  conciergeActive: boolean;
}

type Scenario = "conservative" | "base" | "aggressive";

const SCENARIO_CONFIGS: Record<Scenario, { label: string; description: string; inputs: UmzugscheckInputs }> = {
  conservative: {
    label: "🥶 Konservativ",
    description: "Niedrigere Resale Rate, höhere CPL",
    inputs: {
      cplBuy: 65,
      pricePerPartnerLead: 35,
      avgBuyersPerLead: 1.8,
      partnerCloseRate: 18,
      estimatedBookingValue: 2200,
      commissionPercentage: 8,
      conciergeFee: 99,
      supportCostPerLead: 12,
      conciergeActive: false,
    },
  },
  base: {
    label: "📊 Base Case",
    description: "Realistische Durchschnittswerte",
    inputs: {
      cplBuy: 45,
      pricePerPartnerLead: 35,
      avgBuyersPerLead: 2.5,
      partnerCloseRate: 22,
      estimatedBookingValue: 2200,
      commissionPercentage: 8,
      conciergeFee: 99,
      supportCostPerLead: 8,
      conciergeActive: false,
    },
  },
  aggressive: {
    label: "🚀 Aggressiv",
    description: "Hohe Resale Rate, niedrige Ops-Kosten",
    inputs: {
      cplBuy: 35,
      pricePerPartnerLead: 38,
      avgBuyersPerLead: 3.2,
      partnerCloseRate: 25,
      estimatedBookingValue: 2400,
      commissionPercentage: 10,
      conciergeFee: 99,
      supportCostPerLead: 5,
      conciergeActive: true,
    },
  },
};

// Helper to calculate metrics for any input set
const calculateMetrics = (inputs: UmzugscheckInputs) => {
  const { cplBuy, pricePerPartnerLead, avgBuyersPerLead, partnerCloseRate, estimatedBookingValue, commissionPercentage, conciergeFee, supportCostPerLead, conciergeActive } = inputs;
  
  const resaleRevenue = pricePerPartnerLead * avgBuyersPerLead;
  const closeRateDecimal = partnerCloseRate / 100;
  const commissionDecimal = commissionPercentage / 100;
  const commissionRevenue = estimatedBookingValue * closeRateDecimal * commissionDecimal * avgBuyersPerLead;
  const conciergeRevenue = conciergeActive ? conciergeFee * closeRateDecimal * avgBuyersPerLead : 0;
  const revenuePerLead = resaleRevenue + commissionRevenue + conciergeRevenue;
  const profitPerLead = revenuePerLead - cplBuy - supportCostPerLead;
  const breakEvenResaleRate = pricePerPartnerLead > 0 ? (cplBuy + supportCostPerLead) / pricePerPartnerLead : Infinity;
  
  return { revenuePerLead, profitPerLead, breakEvenResaleRate };
};

const formatCHF = (value: number) => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const InputField = ({ 
  label, 
  value, 
  onChange, 
  tooltip,
  suffix,
  icon: Icon,
}: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void;
  tooltip: string;
  suffix?: string;
  icon?: React.ElementType;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
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
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="pr-16 font-mono text-right"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const FormulaDisplay = ({ 
  label, 
  formula, 
  result,
  status,
}: { 
  label: string; 
  formula: string;
  result: string;
  status?: "positive" | "negative" | "neutral";
}) => {
  const statusStyles = {
    positive: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    negative: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    neutral: "bg-muted/50 border-border",
  };

  const resultStyles = {
    positive: "text-green-700 dark:text-green-400",
    negative: "text-red-700 dark:text-red-400",
    neutral: "text-foreground",
  };

  return (
    <div className={cn("rounded-lg border p-4", status ? statusStyles[status] : statusStyles.neutral)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-xs font-mono text-muted-foreground">{formula}</p>
        </div>
        <div className={cn("text-2xl font-bold tabular-nums text-right", status ? resultStyles[status] : resultStyles.neutral)}>
          {result}
        </div>
      </div>
    </div>
  );
};

export function UmzugscheckUnitEconomicsCalculator() {
  const [inputs, setInputs] = useState<UmzugscheckInputs>(SCENARIO_CONFIGS.base.inputs);

  const updateInput = (key: keyof UmzugscheckInputs, value: number | boolean) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculations = useMemo(() => {
    const {
      cplBuy,
      pricePerPartnerLead,
      avgBuyersPerLead,
      partnerCloseRate,
      estimatedBookingValue,
      commissionPercentage,
      conciergeFee,
      supportCostPerLead,
      conciergeActive,
    } = inputs;

    // 1) Revenue per Lead = (Price per Partner × Resale Rate) + (Booking Value × Partner Close Rate × Commission %) + (Concierge Fee if active)
    const resaleRevenue = pricePerPartnerLead * avgBuyersPerLead;
    const closeRateDecimal = partnerCloseRate / 100;
    const commissionDecimal = commissionPercentage / 100;
    const commissionRevenue = estimatedBookingValue * closeRateDecimal * commissionDecimal * avgBuyersPerLead;
    const conciergeRevenue = conciergeActive ? conciergeFee * closeRateDecimal * avgBuyersPerLead : 0;
    const revenuePerLead = resaleRevenue + commissionRevenue + conciergeRevenue;

    // 2) Profit per Lead = Revenue per Lead – CPL Buy – Support Cost
    const profitPerLead = revenuePerLead - cplBuy - supportCostPerLead;

    // 3) Break-even Resale Rate = (CPL Buy + Support Cost) / Price per Partner
    const breakEvenResaleRate = pricePerPartnerLead > 0 
      ? (cplBuy + supportCostPerLead) / pricePerPartnerLead 
      : Infinity;

    // Additional metrics
    const marginPercentage = revenuePerLead > 0 ? (profitPerLead / revenuePerLead) * 100 : 0;
    const roas = cplBuy > 0 ? revenuePerLead / cplBuy : 0;

    return {
      resaleRevenue,
      commissionRevenue,
      conciergeRevenue,
      revenuePerLead,
      profitPerLead,
      breakEvenResaleRate,
      marginPercentage,
      roas,
    };
  }, [inputs]);

  const isProfitable = calculations.profitPerLead > 0;
  const isAboveBreakeven = inputs.avgBuyersPerLead >= calculations.breakEvenResaleRate;
  const isCritical = calculations.profitPerLead < -10;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with Objective */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold">Umzugscheck Lead Arbitrage</p>
                <p className="text-sm text-muted-foreground">
                  Ziel: Lead-Arbitrage muss nach Support-Kosten profitabel bleiben.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicator */}
        <Card className={cn(
          "border-2",
          isProfitable ? "border-green-500 bg-green-50 dark:bg-green-950/30" : 
          isCritical ? "border-red-500 bg-red-50 dark:bg-red-950/30" : 
          "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {isProfitable ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-700">PROFITABEL</p>
                    <p className="text-sm text-green-600">Arbitrage-Marge ist positiv – Skalierung möglich</p>
                  </div>
                </>
              ) : isCritical ? (
                <>
                  <TrendingDown className="w-12 h-12 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-700">VERLUST</p>
                    <p className="text-sm text-red-600">Negative Marge – CPL senken oder Resale Rate erhöhen</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-12 h-12 text-amber-600" />
                  <div>
                    <p className="text-2xl font-bold text-amber-700">MARGINAL</p>
                    <p className="text-sm text-amber-600">Geringe Marge – Optimierung empfohlen</p>
                  </div>
                </>
              )}
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">Profit pro Lead</p>
                <p className={cn(
                  "text-4xl font-bold tabular-nums",
                  isProfitable ? "text-green-700" : isCritical ? "text-red-700" : "text-amber-700"
                )}>
                  {formatCHF(calculations.profitPerLead)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* INPUT PANEL */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Eingaben (editierbar)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lead Acquisition */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5" />
                  Lead Einkauf
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="CPL (Buy from Ads)"
                    value={inputs.cplBuy}
                    onChange={(v) => updateInput("cplBuy", v)}
                    tooltip="Kosten pro Lead aus Paid Ads"
                    suffix="CHF"
                  />
                  <InputField
                    label="Support Cost pro Lead"
                    value={inputs.supportCostPerLead}
                    onChange={(v) => updateInput("supportCostPerLead", v)}
                    tooltip="Aufwand für Lead-Qualifizierung, Telefonat, etc."
                    suffix="CHF"
                    icon={Headphones}
                  />
                </div>
              </div>

              {/* Lead Resale */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-2">
                  <Repeat className="w-3.5 h-3.5" />
                  Lead Verkauf (an Partner)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Preis pro Partner-Lead"
                    value={inputs.pricePerPartnerLead}
                    onChange={(v) => updateInput("pricePerPartnerLead", v)}
                    tooltip="Verkaufspreis pro Lead an einen Partner"
                    suffix="CHF"
                  />
                  <InputField
                    label="Ø Käufer pro Lead"
                    value={inputs.avgBuyersPerLead}
                    onChange={(v) => updateInput("avgBuyersPerLead", v)}
                    tooltip="Durchschnittliche Anzahl Partner die denselben Lead kaufen"
                    suffix="×"
                    icon={Users}
                  />
                </div>
              </div>

              {/* Commission */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-2">
                  <Percent className="w-3.5 h-3.5" />
                  Erfolgskommission
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Partner Close Rate"
                    value={inputs.partnerCloseRate}
                    onChange={(v) => updateInput("partnerCloseRate", v)}
                    tooltip="Prozentsatz der Leads die Partner zu Buchungen konvertieren"
                    suffix="%"
                  />
                  <InputField
                    label="Ø Buchungswert"
                    value={inputs.estimatedBookingValue}
                    onChange={(v) => updateInput("estimatedBookingValue", v)}
                    tooltip="Geschätzter durchschnittlicher Auftragswert beim Partner"
                    suffix="CHF"
                  />
                </div>
                <InputField
                  label="Kommission"
                  value={inputs.commissionPercentage}
                  onChange={(v) => updateInput("commissionPercentage", v)}
                  tooltip="Prozentuale Beteiligung am Buchungswert bei Erfolg"
                  suffix="%"
                />
              </div>

              {/* Concierge Toggle */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-2">
                  <Headphones className="w-3.5 h-3.5" />
                  Concierge Service (optional)
                </p>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="concierge-toggle" className="text-sm font-medium">
                      Concierge aktiv
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">Zusätzliche Gebühr für Premium-Betreuung bei erfolgreicher Buchung</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Switch
                    id="concierge-toggle"
                    checked={inputs.conciergeActive}
                    onCheckedChange={(checked) => updateInput("conciergeActive", checked)}
                  />
                </div>
                {inputs.conciergeActive && (
                  <InputField
                    label="Concierge Fee"
                    value={inputs.conciergeFee}
                    onChange={(v) => updateInput("conciergeFee", v)}
                    tooltip="Zusätzliche Gebühr bei erfolgreicher Buchung"
                    suffix="CHF"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* CALCULATIONS PANEL */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Berechnungen (transparent)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 1) Revenue per Lead */}
              <FormulaDisplay
                label="1) Revenue pro Lead"
                formula={`(${formatCHF(inputs.pricePerPartnerLead)} × ${inputs.avgBuyersPerLead}) + Kommission + Concierge`}
                result={formatCHF(calculations.revenuePerLead)}
                status="neutral"
              />

              {/* Revenue breakdown */}
              <div className="pl-4 border-l-2 border-muted space-y-1 text-xs text-muted-foreground">
                <p>• Lead-Verkauf: {formatCHF(calculations.resaleRevenue)}</p>
                <p>• Kommission ({inputs.commissionPercentage}% von {formatCHF(inputs.estimatedBookingValue)} × {inputs.partnerCloseRate}% × {inputs.avgBuyersPerLead}): {formatCHF(calculations.commissionRevenue)}</p>
                {inputs.conciergeActive && (
                  <p>• Concierge ({formatCHF(inputs.conciergeFee)} × {inputs.partnerCloseRate}% × {inputs.avgBuyersPerLead}): {formatCHF(calculations.conciergeRevenue)}</p>
                )}
              </div>

              {/* 2) Profit per Lead */}
              <FormulaDisplay
                label="2) Profit pro Lead"
                formula={`${formatCHF(calculations.revenuePerLead)} – ${formatCHF(inputs.cplBuy)} – ${formatCHF(inputs.supportCostPerLead)}`}
                result={formatCHF(calculations.profitPerLead)}
                status={isProfitable ? "positive" : "negative"}
              />

              {/* Margin indicator */}
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg text-sm",
                isProfitable ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              )}>
                <span>Marge</span>
                <span className="font-bold">
                  {calculations.marginPercentage.toFixed(1)}%
                </span>
              </div>

              {/* 3) Break-even Resale Rate */}
              <FormulaDisplay
                label="3) Break-even Käufer pro Lead"
                formula={`(${formatCHF(inputs.cplBuy)} + ${formatCHF(inputs.supportCostPerLead)}) / ${formatCHF(inputs.pricePerPartnerLead)}`}
                result={calculations.breakEvenResaleRate === Infinity ? "∞" : calculations.breakEvenResaleRate.toFixed(2)}
                status={isAboveBreakeven ? "positive" : "negative"}
              />

              {/* Break-even comparison */}
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                isAboveBreakeven ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              )}>
                <span className="text-sm font-medium">Aktuell: {inputs.avgBuyersPerLead.toFixed(1)} Käufer</span>
                <Badge className={isAboveBreakeven ? "bg-green-600" : "bg-red-600"}>
                  {isAboveBreakeven 
                    ? `✓ ${(inputs.avgBuyersPerLead - calculations.breakEvenResaleRate).toFixed(2)} über Break-even`
                    : `✗ ${(calculations.breakEvenResaleRate - inputs.avgBuyersPerLead).toFixed(2)} unter Break-even`
                  }
                </Badge>
              </div>

              {/* ROAS */}
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">ROAS (Return on Ad Spend)</p>
                <p className={cn(
                  "text-3xl font-bold",
                  calculations.roas >= 2 ? "text-green-600" : calculations.roas >= 1 ? "text-amber-600" : "text-red-600"
                )}>
                  {calculations.roas.toFixed(2)}x
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SCENARIO COMPARISON TABLE */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Szenario-Vergleich (Umzugscheck Marketplace)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Szenario</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">CPL</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Resale ×</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Support</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Revenue</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Profit/Lead</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Break-even</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(["conservative", "base", "aggressive"] as Scenario[]).map((scenario) => {
                    const config = SCENARIO_CONFIGS[scenario];
                    const metrics = calculateMetrics(config.inputs);
                    const isProfitableScenario = metrics.profitPerLead > 0;
                    const isAboveBE = config.inputs.avgBuyersPerLead >= metrics.breakEvenResaleRate;
                    
                    return (
                      <tr key={scenario} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{config.label}</p>
                            <p className="text-xs text-muted-foreground">{config.description}</p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2 font-mono">{formatCHF(config.inputs.cplBuy)}</td>
                        <td className="text-right py-3 px-2 font-mono">{config.inputs.avgBuyersPerLead}×</td>
                        <td className="text-right py-3 px-2 font-mono">{formatCHF(config.inputs.supportCostPerLead)}</td>
                        <td className="text-right py-3 px-2 font-mono">{formatCHF(metrics.revenuePerLead)}</td>
                        <td className={cn(
                          "text-right py-3 px-2 font-mono font-bold",
                          isProfitableScenario ? "text-green-600" : "text-red-600"
                        )}>
                          {formatCHF(metrics.profitPerLead)}
                        </td>
                        <td className={cn(
                          "text-right py-3 px-2 font-mono",
                          isAboveBE ? "text-green-600" : "text-red-600"
                        )}>
                          {metrics.breakEvenResaleRate.toFixed(2)}×
                        </td>
                        <td className="text-center py-3 px-2">
                          {isProfitableScenario && isAboveBE ? (
                            <Badge className="bg-green-600 text-white">🟢 SCALE</Badge>
                          ) : !isProfitableScenario ? (
                            <Badge className="bg-red-600 text-white">🔴 STOP</Badge>
                          ) : (
                            <Badge className="bg-amber-500 text-white">🟡 OPTIMIZE</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Ziel: Positive Marge pro Lead. Break-even = minimale Käufer pro Lead um Kosten zu decken.
            </p>
          </CardContent>
        </Card>

        {/* Warning if below break-even */}
        {!isAboveBreakeven && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                ⚠️ Resale Rate unter Break-even
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-red-900 dark:text-red-100">
                <li>• Mindestens <strong>{calculations.breakEvenResaleRate.toFixed(2)} Käufer pro Lead</strong> benötigt</li>
                <li>• Aktuell nur {inputs.avgBuyersPerLead} Käufer → Verlust pro Lead</li>
                <li>• Optionen: CPL senken, Lead-Preis erhöhen, oder mehr Partner gewinnen</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Optimization suggestions */}
        {!isProfitable && isAboveBreakeven && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Optimierungsvorschläge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
                {inputs.cplBuy > 40 && (
                  <li>• CPL auf unter CHF 40 senken (aktuell: {formatCHF(inputs.cplBuy)})</li>
                )}
                {inputs.avgBuyersPerLead < 3 && (
                  <li>• Resale Rate auf 3+ erhöhen (mehr Partner pro Lead)</li>
                )}
                {!inputs.conciergeActive && (
                  <li>• Concierge Service aktivieren für zusätzlichen Revenue</li>
                )}
                {inputs.commissionPercentage < 10 && (
                  <li>• Kommission auf 10%+ erhöhen</li>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
