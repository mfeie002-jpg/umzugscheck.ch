import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Info,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Calculator,
  Truck,
  Users,
  DollarSign,
  Clock,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeierabendInputs {
  avgOrderValue: number;
  marketingCPL: number;
  salesCloseRate: number;
  salesTimePerLead: number;
  salesHourlyCost: number;
  crewSize: number;
  jobDuration: number;
  crewHourlyCost: number;
  vehicleFuelCost: number;
  materialsDisposalCost: number;
}

type Scenario = "conservative" | "base" | "aggressive";

const SCENARIO_CONFIGS: Record<Scenario, { label: string; description: string; inputs: FeierabendInputs }> = {
  conservative: {
    label: "🥶 Winter (Konservativ)",
    description: "Niedrigere Nachfrage, höhere CPL, schwächere Conversion",
    inputs: {
      avgOrderValue: 2400,
      marketingCPL: 85,
      salesCloseRate: 18,
      salesTimePerLead: 35,
      salesHourlyCost: 45,
      crewSize: 3,
      jobDuration: 6,
      crewHourlyCost: 38,
      vehicleFuelCost: 180,
      materialsDisposalCost: 120,
    },
  },
  base: {
    label: "📊 Base Case",
    description: "Realistische Durchschnittswerte",
    inputs: {
      avgOrderValue: 2800,
      marketingCPL: 60,
      salesCloseRate: 22,
      salesTimePerLead: 30,
      salesHourlyCost: 45,
      crewSize: 3,
      jobDuration: 6,
      crewHourlyCost: 38,
      vehicleFuelCost: 180,
      materialsDisposalCost: 120,
    },
  },
  aggressive: {
    label: "☀️ Sommer (Aggressiv)",
    description: "Hohe Nachfrage, bessere CPL, starke Conversion",
    inputs: {
      avgOrderValue: 3200,
      marketingCPL: 45,
      salesCloseRate: 28,
      salesTimePerLead: 25,
      salesHourlyCost: 45,
      crewSize: 3,
      jobDuration: 6,
      crewHourlyCost: 38,
      vehicleFuelCost: 180,
      materialsDisposalCost: 120,
    },
  },
};

const TARGET_CM2 = 400;

// Helper to calculate metrics for any input set
const calculateMetrics = (inputs: FeierabendInputs) => {
  const { avgOrderValue, marketingCPL, salesCloseRate, salesTimePerLead, salesHourlyCost, crewSize, jobDuration, crewHourlyCost, vehicleFuelCost, materialsDisposalCost } = inputs;
  
  const crewCost = crewSize * jobDuration * crewHourlyCost;
  const cogs = crewCost + vehicleFuelCost + materialsDisposalCost;
  const closeRateDecimal = salesCloseRate / 100;
  const marketingCACPerBooking = closeRateDecimal > 0 ? marketingCPL / closeRateDecimal : Infinity;
  const salesLaborCostPerLead = (salesTimePerLead / 60) * salesHourlyCost;
  const salesLaborCACPerBooking = closeRateDecimal > 0 ? salesLaborCostPerLead / closeRateDecimal : Infinity;
  const totalCAC = marketingCACPerBooking + salesLaborCACPerBooking;
  const contributionMarginII = avgOrderValue - cogs - totalCAC;
  
  return { cogs, totalCAC, contributionMarginII };
};

const formatCHF = (value: number) => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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

export function FeierabendUnitEconomicsCalculator() {
  const [inputs, setInputs] = useState<FeierabendInputs>(SCENARIO_CONFIGS.base.inputs);

  const updateInput = (key: keyof FeierabendInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculations = useMemo(() => {
    const {
      avgOrderValue,
      marketingCPL,
      salesCloseRate,
      salesTimePerLead,
      salesHourlyCost,
      crewSize,
      jobDuration,
      crewHourlyCost,
      vehicleFuelCost,
      materialsDisposalCost,
    } = inputs;

    // 1) COGS = (Crew Size × Job Hours × Crew Hourly Cost) + Vehicle Cost + Materials Cost
    const crewCost = crewSize * jobDuration * crewHourlyCost;
    const cogs = crewCost + vehicleFuelCost + materialsDisposalCost;

    // 2) Total CAC = (Marketing CPL / Close Rate) + (Sales Time / 60 × Sales Hourly Cost)
    const closeRateDecimal = salesCloseRate / 100;
    const marketingCACPerBooking = closeRateDecimal > 0 ? marketingCPL / closeRateDecimal : Infinity;
    const salesLaborCostPerLead = (salesTimePerLead / 60) * salesHourlyCost;
    const salesLaborCACPerBooking = closeRateDecimal > 0 ? salesLaborCostPerLead / closeRateDecimal : Infinity;
    const totalCAC = marketingCACPerBooking + salesLaborCACPerBooking;

    // 3) Contribution Margin II = AOV – COGS – Total CAC
    const contributionMarginII = avgOrderValue - cogs - totalCAC;

    // 4) Max Allowable CAC = AOV – COGS – 400
    const maxAllowableCAC = avgOrderValue - cogs - TARGET_CM2;

    // 5) Max Allowable CPL = ((AOV – COGS – 400) – Sales Labor Cost per Booking) × Close Rate
    const maxAllowableCPL = (maxAllowableCAC - salesLaborCACPerBooking) * closeRateDecimal;

    return {
      crewCost,
      cogs,
      marketingCACPerBooking,
      salesLaborCostPerLead,
      salesLaborCACPerBooking,
      totalCAC,
      contributionMarginII,
      maxAllowableCAC,
      maxAllowableCPL,
      closeRateDecimal,
    };
  }, [inputs]);

  const isHealthy = calculations.contributionMarginII >= TARGET_CM2;
  const isCritical = calculations.contributionMarginII < 0;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with Target */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold">Feierabendumzug Unit Economics</p>
                <p className="text-sm text-muted-foreground">
                  Ziel: Jeder Auftrag muss mindestens <strong className="text-primary">CHF 400 Contribution Margin II</strong> beitragen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicator */}
        <Card className={cn(
          "border-2",
          isHealthy ? "border-green-500 bg-green-50 dark:bg-green-950/30" : 
          isCritical ? "border-red-500 bg-red-50 dark:bg-red-950/30" : 
          "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {isHealthy ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-700">PROFITABEL</p>
                    <p className="text-sm text-green-600">CM2 ≥ CHF 400 – Aufträge können skaliert werden</p>
                  </div>
                </>
              ) : isCritical ? (
                <>
                  <TrendingDown className="w-12 h-12 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-700">VERLUST</p>
                    <p className="text-sm text-red-600">Negative Marge – Preise oder Kosten anpassen</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-12 h-12 text-amber-600" />
                  <div>
                    <p className="text-2xl font-bold text-amber-700">UNTER ZIEL</p>
                    <p className="text-sm text-amber-600">CM2 unter CHF 400 – Optimierung erforderlich</p>
                  </div>
                </>
              )}
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">Contribution Margin II</p>
                <p className={cn(
                  "text-4xl font-bold tabular-nums",
                  isHealthy ? "text-green-700" : isCritical ? "text-red-700" : "text-amber-700"
                )}>
                  {formatCHF(calculations.contributionMarginII)}
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
              {/* Revenue */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5" />
                  Umsatz
                </p>
                <InputField
                  label="Ø Auftragswert (netto, exkl. MwSt)"
                  value={inputs.avgOrderValue}
                  onChange={(v) => updateInput("avgOrderValue", v)}
                  tooltip="Durchschnittlicher Nettoauftragswert pro Buchung"
                  suffix="CHF"
                  icon={DollarSign}
                />
              </div>

              {/* Marketing & Sales */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Marketing & Sales
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Marketing CPL"
                    value={inputs.marketingCPL}
                    onChange={(v) => updateInput("marketingCPL", v)}
                    tooltip="Kosten pro Lead aus Paid Ads"
                    suffix="CHF"
                  />
                  <InputField
                    label="Sales Close Rate"
                    value={inputs.salesCloseRate}
                    onChange={(v) => updateInput("salesCloseRate", v)}
                    tooltip="Prozentsatz der Leads die zu Buchungen werden"
                    suffix="%"
                  />
                  <InputField
                    label="Sales-Zeit pro Lead"
                    value={inputs.salesTimePerLead}
                    onChange={(v) => updateInput("salesTimePerLead", v)}
                    tooltip="Durchschnittliche Zeit für Angebotserstellung & Nachfassen"
                    suffix="min"
                  />
                  <InputField
                    label="Sales Stundenlohn"
                    value={inputs.salesHourlyCost}
                    onChange={(v) => updateInput("salesHourlyCost", v)}
                    tooltip="Vollkosten pro Stunde Sales-Mitarbeiter"
                    suffix="CHF/h"
                  />
                </div>
              </div>

              {/* Operations */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5" />
                  Operations (COGS)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Crew-Grösse"
                    value={inputs.crewSize}
                    onChange={(v) => updateInput("crewSize", v)}
                    tooltip="Anzahl Mitarbeiter pro Auftrag"
                    suffix="Pers."
                  />
                  <InputField
                    label="Auftragsdauer (inkl. Fahrt)"
                    value={inputs.jobDuration}
                    onChange={(v) => updateInput("jobDuration", v)}
                    tooltip="Gesamtdauer inkl. An-/Abfahrt"
                    suffix="Std."
                  />
                  <InputField
                    label="Crew Stundenlohn (loaded)"
                    value={inputs.crewHourlyCost}
                    onChange={(v) => updateInput("crewHourlyCost", v)}
                    tooltip="Vollkosten pro Stunde pro Mitarbeiter (inkl. Sozialabgaben)"
                    suffix="CHF/h"
                  />
                  <InputField
                    label="Fahrzeug & Treibstoff"
                    value={inputs.vehicleFuelCost}
                    onChange={(v) => updateInput("vehicleFuelCost", v)}
                    tooltip="Fahrzeugkosten, Treibstoff, Versicherung pro Auftrag"
                    suffix="CHF"
                  />
                </div>
                <InputField
                  label="Material & Entsorgung"
                  value={inputs.materialsDisposalCost}
                  onChange={(v) => updateInput("materialsDisposalCost", v)}
                  tooltip="Verpackungsmaterial, Kartons, Entsorgungskosten"
                  suffix="CHF"
                  icon={Package}
                />
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
              {/* 1) COGS */}
              <FormulaDisplay
                label="1) COGS (Cost of Goods Sold)"
                formula={`(${inputs.crewSize} × ${inputs.jobDuration}h × ${formatCHF(inputs.crewHourlyCost)}) + ${formatCHF(inputs.vehicleFuelCost)} + ${formatCHF(inputs.materialsDisposalCost)}`}
                result={formatCHF(calculations.cogs)}
                status="neutral"
              />

              {/* 2) Total CAC */}
              <FormulaDisplay
                label="2) Total CAC (pro Buchung)"
                formula={`(${formatCHF(inputs.marketingCPL)} / ${inputs.salesCloseRate}%) + (${inputs.salesTimePerLead}min / 60 × ${formatCHF(inputs.salesHourlyCost)} / ${inputs.salesCloseRate}%)`}
                result={calculations.totalCAC === Infinity ? "∞" : formatCHF(calculations.totalCAC)}
                status="neutral"
              />

              {/* Sub-calculation detail */}
              <div className="pl-4 border-l-2 border-muted space-y-1 text-xs text-muted-foreground">
                <p>• Marketing CAC pro Buchung: {calculations.marketingCACPerBooking === Infinity ? "∞" : formatCHF(calculations.marketingCACPerBooking)}</p>
                <p>• Sales Labor pro Lead: {formatCHF(calculations.salesLaborCostPerLead)}</p>
                <p>• Sales Labor CAC pro Buchung: {calculations.salesLaborCACPerBooking === Infinity ? "∞" : formatCHF(calculations.salesLaborCACPerBooking)}</p>
              </div>

              {/* 3) Contribution Margin II */}
              <FormulaDisplay
                label="3) Contribution Margin II"
                formula={`${formatCHF(inputs.avgOrderValue)} – ${formatCHF(calculations.cogs)} – ${calculations.totalCAC === Infinity ? "∞" : formatCHF(calculations.totalCAC)}`}
                result={formatCHF(calculations.contributionMarginII)}
                status={isHealthy ? "positive" : isCritical ? "negative" : "negative"}
              />

              {/* Target comparison */}
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                isHealthy ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              )}>
                <span className="text-sm font-medium">Ziel: ≥ CHF 400</span>
                <Badge className={isHealthy ? "bg-green-600" : "bg-red-600"}>
                  {isHealthy ? "✓ Erreicht" : `✗ ${formatCHF(TARGET_CM2 - calculations.contributionMarginII)} fehlen`}
                </Badge>
              </div>

              {/* 4) Max Allowable CAC */}
              <FormulaDisplay
                label="4) Max erlaubter CAC"
                formula={`${formatCHF(inputs.avgOrderValue)} – ${formatCHF(calculations.cogs)} – CHF 400`}
                result={formatCHF(calculations.maxAllowableCAC)}
                status={calculations.totalCAC <= calculations.maxAllowableCAC ? "positive" : "negative"}
              />

              {/* 5) Max Allowable CPL */}
              <FormulaDisplay
                label="5) Max erlaubter CPL"
                formula={`(Max CAC – Sales Labor CAC) × Close Rate`}
                result={calculations.maxAllowableCPL < 0 ? "Nicht möglich" : formatCHF(calculations.maxAllowableCPL)}
                status={inputs.marketingCPL <= calculations.maxAllowableCPL ? "positive" : "negative"}
              />

              {/* CPL comparison */}
              {calculations.maxAllowableCPL > 0 && (
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg text-sm",
                  inputs.marketingCPL <= calculations.maxAllowableCPL 
                    ? "bg-green-100 dark:bg-green-900/30" 
                    : "bg-red-100 dark:bg-red-900/30"
                )}>
                  <span>Aktueller CPL: {formatCHF(inputs.marketingCPL)}</span>
                  <span className="font-medium">
                    {inputs.marketingCPL <= calculations.maxAllowableCPL 
                      ? `✓ ${formatCHF(calculations.maxAllowableCPL - inputs.marketingCPL)} Spielraum`
                      : `✗ ${formatCHF(inputs.marketingCPL - calculations.maxAllowableCPL)} zu hoch`
                    }
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SCENARIO COMPARISON TABLE */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Szenario-Vergleich (Feierabend Direct Mover)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Szenario</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">AOV</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">CPL</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Close %</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">COGS</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">CAC</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">CM II</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(["conservative", "base", "aggressive"] as Scenario[]).map((scenario) => {
                    const config = SCENARIO_CONFIGS[scenario];
                    const metrics = calculateMetrics(config.inputs);
                    const isHealthyScenario = metrics.contributionMarginII >= TARGET_CM2;
                    const isCriticalScenario = metrics.contributionMarginII < 0;
                    
                    return (
                      <tr key={scenario} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{config.label}</p>
                            <p className="text-xs text-muted-foreground">{config.description}</p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2 font-mono">{formatCHF(config.inputs.avgOrderValue)}</td>
                        <td className="text-right py-3 px-2 font-mono">{formatCHF(config.inputs.marketingCPL)}</td>
                        <td className="text-right py-3 px-2 font-mono">{config.inputs.salesCloseRate}%</td>
                        <td className="text-right py-3 px-2 font-mono">{formatCHF(metrics.cogs)}</td>
                        <td className="text-right py-3 px-2 font-mono">
                          {metrics.totalCAC === Infinity ? "∞" : formatCHF(metrics.totalCAC)}
                        </td>
                        <td className={cn(
                          "text-right py-3 px-2 font-mono font-bold",
                          isHealthyScenario ? "text-green-600" : isCriticalScenario ? "text-red-600" : "text-amber-600"
                        )}>
                          {formatCHF(metrics.contributionMarginII)}
                        </td>
                        <td className="text-center py-3 px-2">
                          {isHealthyScenario ? (
                            <Badge className="bg-green-600 text-white">🟢 SCALE</Badge>
                          ) : isCriticalScenario ? (
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
              Ziel: CM II ≥ CHF 400 pro Auftrag. Szenarios basieren auf saisonalen Schwankungen im Schweizer Umzugsmarkt.
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions based on status */}
        {!isHealthy && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Optimierungsvorschläge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
                {inputs.marketingCPL > calculations.maxAllowableCPL && (
                  <li>• CPL auf max. <strong>{formatCHF(Math.max(0, calculations.maxAllowableCPL))}</strong> senken</li>
                )}
                {inputs.salesCloseRate < 25 && (
                  <li>• Close Rate erhöhen (aktuell {inputs.salesCloseRate}%, Ziel: 25%+)</li>
                )}
                {inputs.avgOrderValue < 3000 && (
                  <li>• AOV auf min. CHF 3'000 erhöhen (Upselling, Premium-Dienste)</li>
                )}
                {calculations.cogs > inputs.avgOrderValue * 0.5 && (
                  <li>• COGS optimieren (aktuell {((calculations.cogs / inputs.avgOrderValue) * 100).toFixed(0)}% vom AOV)</li>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
