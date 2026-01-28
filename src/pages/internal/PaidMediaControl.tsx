import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  Calculator,
  BarChart3,
  Target,
  DollarSign,
  Users,
  Percent,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type BusinessModel = "feierabend" | "umzugscheck";

interface UnitEconomics {
  // Inputs
  adSpend: number;
  clicks: number;
  leads: number;
  bookings: number;
  avgOrderValue: number;
  grossMargin: number; // percentage
  // Calculated
  cpc: number;
  cpl: number;
  cpa: number;
  conversionRate: number;
  revenue: number;
  grossProfit: number;
  netProfit: number;
  roas: number;
  ltv: number;
}

const DEFAULT_FEIERABEND: Partial<UnitEconomics> = {
  adSpend: 5000,
  clicks: 2500,
  leads: 125,
  bookings: 25,
  avgOrderValue: 2800,
  grossMargin: 35,
  ltv: 4200, // Whale customers return
};

const DEFAULT_UMZUGSCHECK: Partial<UnitEconomics> = {
  adSpend: 3000,
  clicks: 4000,
  leads: 400,
  bookings: 80, // lead sold to providers
  avgOrderValue: 45, // CPL price charged to providers
  grossMargin: 85, // mostly digital margin
  ltv: 65, // some upsells
};

const formatCHF = (value: number) => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(1)}%`;
};

const MetricCard = ({ 
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
  const statusColors = {
    positive: "text-green-600 bg-green-50 border-green-200",
    negative: "text-red-600 bg-red-50 border-red-200",
    warning: "text-amber-600 bg-amber-50 border-amber-200",
    neutral: "text-foreground bg-muted border-border",
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      status ? statusColors[status] : statusColors.neutral
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subValue && <p className="text-xs opacity-60 mt-0.5">{subValue}</p>}
        </div>
        {Icon && <Icon className="w-5 h-5 opacity-50" />}
      </div>
    </div>
  );
};

const ProfitabilityIndicator = ({ netProfit, roas }: { netProfit: number; roas: number }) => {
  const isProfitable = netProfit > 0;
  const isHealthy = roas >= 3;
  const isWarning = roas >= 1.5 && roas < 3;
  const isCritical = roas < 1.5;

  return (
    <Card className={cn(
      "border-2",
      isProfitable && isHealthy && "border-green-500 bg-green-50/50",
      isProfitable && isWarning && "border-amber-500 bg-amber-50/50",
      isCritical && "border-red-500 bg-red-50/50"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {isProfitable && isHealthy && (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-600" />
              <div>
                <p className="text-xl font-bold text-green-700">PROFITABLE</p>
                <p className="text-sm text-green-600">Ads generating healthy margin. Scale up.</p>
              </div>
            </>
          )}
          {isProfitable && isWarning && (
            <>
              <AlertTriangle className="w-12 h-12 text-amber-600" />
              <div>
                <p className="text-xl font-bold text-amber-700">MARGINAL</p>
                <p className="text-sm text-amber-600">Profitable but tight. Optimize before scaling.</p>
              </div>
            </>
          )}
          {isCritical && (
            <>
              <TrendingDown className="w-12 h-12 text-red-600" />
              <div>
                <p className="text-xl font-bold text-red-700">UNPROFITABLE</p>
                <p className="text-sm text-red-600">Ads destroying margin. Pause & restructure.</p>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-current/10 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="opacity-70">Net Profit:</span>
            <span className={cn("ml-2 font-bold", netProfit >= 0 ? "text-green-700" : "text-red-700")}>
              {formatCHF(netProfit)}
            </span>
          </div>
          <div>
            <span className="opacity-70">ROAS:</span>
            <span className={cn("ml-2 font-bold", roas >= 3 ? "text-green-700" : roas >= 1.5 ? "text-amber-700" : "text-red-700")}>
              {roas.toFixed(2)}x
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignTable = ({ model }: { model: BusinessModel }) => {
  const campaigns = model === "feierabend" ? [
    { name: "Brand - Feierabend", spend: 800, clicks: 600, leads: 45, bookings: 12, cpa: 66.67, roas: 4.2, status: "active" },
    { name: "Generic - Umzug Zürich", spend: 1500, clicks: 800, leads: 35, bookings: 6, cpa: 250, roas: 1.12, status: "warning" },
    { name: "Generic - Umzug günstig", spend: 1200, clicks: 500, leads: 25, bookings: 4, cpa: 300, roas: 0.93, status: "paused" },
    { name: "Retargeting", spend: 500, clicks: 300, leads: 15, bookings: 3, cpa: 166.67, roas: 1.68, status: "active" },
    { name: "Performance Max", spend: 1000, clicks: 300, leads: 5, bookings: 0, cpa: Infinity, roas: 0, status: "critical" },
  ] : [
    { name: "Brand - Umzugscheck", spend: 400, clicks: 1200, leads: 180, bookings: 45, cpa: 8.89, roas: 5.06, status: "active" },
    { name: "Generic - Umzugsofferte", spend: 1000, clicks: 1500, leads: 120, bookings: 24, cpa: 41.67, roas: 1.08, status: "warning" },
    { name: "City - Zürich", spend: 600, clicks: 600, leads: 50, bookings: 8, cpa: 75, roas: 0.6, status: "paused" },
    { name: "City - Bern", spend: 400, clicks: 400, leads: 30, bookings: 3, cpa: 133.33, roas: 0.34, status: "critical" },
    { name: "SEO Landing Boost", spend: 600, clicks: 300, leads: 20, bookings: 0, cpa: Infinity, roas: 0, status: "testing" },
  ];

  const statusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      warning: "bg-amber-100 text-amber-800",
      paused: "bg-gray-100 text-gray-800",
      critical: "bg-red-100 text-red-800",
      testing: "bg-blue-100 text-blue-800",
    };
    return <Badge className={cn("text-xs", variants[status])}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Campaign</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Spend</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Clicks</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Leads</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">{model === "feierabend" ? "Bookings" : "Sold"}</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">CPA</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">ROAS</th>
            <th className="text-center py-3 px-2 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c, i) => (
            <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
              <td className="py-3 px-2 font-medium">{c.name}</td>
              <td className="text-right py-3 px-2">{formatCHF(c.spend)}</td>
              <td className="text-right py-3 px-2">{c.clicks.toLocaleString("de-CH")}</td>
              <td className="text-right py-3 px-2">{c.leads}</td>
              <td className="text-right py-3 px-2">{c.bookings}</td>
              <td className={cn("text-right py-3 px-2 font-mono", c.cpa === Infinity ? "text-muted-foreground" : c.cpa < 100 ? "text-green-600" : c.cpa < 200 ? "text-amber-600" : "text-red-600")}>
                {c.cpa === Infinity ? "–" : formatCHF(c.cpa)}
              </td>
              <td className={cn("text-right py-3 px-2 font-mono font-bold", c.roas >= 3 ? "text-green-600" : c.roas >= 1 ? "text-amber-600" : "text-red-600")}>
                {c.roas.toFixed(2)}x
              </td>
              <td className="text-center py-3 px-2">{statusBadge(c.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function PaidMediaControl() {
  const [model, setModel] = useState<BusinessModel>("feierabend");
  const [inputs, setInputs] = useState(model === "feierabend" ? DEFAULT_FEIERABEND : DEFAULT_UMZUGSCHECK);

  const handleModelChange = (newModel: BusinessModel) => {
    setModel(newModel);
    setInputs(newModel === "feierabend" ? DEFAULT_FEIERABEND : DEFAULT_UMZUGSCHECK);
  };

  const updateInput = (key: keyof UnitEconomics, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const economics = useMemo((): UnitEconomics => {
    const adSpend = inputs.adSpend || 0;
    const clicks = inputs.clicks || 1;
    const leads = inputs.leads || 1;
    const bookings = inputs.bookings || 0;
    const avgOrderValue = inputs.avgOrderValue || 0;
    const grossMargin = (inputs.grossMargin || 0) / 100;
    const ltv = inputs.ltv || avgOrderValue;

    const cpc = adSpend / clicks;
    const cpl = adSpend / leads;
    const cpa = bookings > 0 ? adSpend / bookings : Infinity;
    const conversionRate = (bookings / leads) * 100;
    const revenue = bookings * avgOrderValue;
    const grossProfit = revenue * grossMargin;
    const netProfit = grossProfit - adSpend;
    const roas = adSpend > 0 ? revenue / adSpend : 0;

    return {
      adSpend,
      clicks,
      leads,
      bookings,
      avgOrderValue,
      grossMargin: inputs.grossMargin || 0,
      cpc,
      cpl,
      cpa,
      conversionRate,
      revenue,
      grossProfit,
      netProfit,
      roas,
      ltv,
    };
  }, [inputs]);

  const breakEvenCPA = economics.avgOrderValue * (economics.grossMargin / 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Internal Dashboard</p>
              <h1 className="text-2xl font-bold text-foreground">Paid Media & Unit Economics</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Business Model:</span>
              <Button
                variant={model === "feierabend" ? "default" : "outline"}
                size="sm"
                onClick={() => handleModelChange("feierabend")}
              >
                Feierabend (Direct)
              </Button>
              <Button
                variant={model === "umzugscheck" ? "default" : "outline"}
                size="sm"
                onClick={() => handleModelChange("umzugscheck")}
              >
                Umzugscheck (Marketplace)
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Model Context */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              {model === "feierabend" ? (
                <p className="text-sm">
                  <strong>Feierabend Strategy:</strong> High-value whale customers (AOV CHF 2'500+). 
                  Focus on brand & quality leads. Target CPA &lt; CHF 200, ROAS &gt; 3x.
                </p>
              ) : (
                <p className="text-sm">
                  <strong>Umzugscheck Strategy:</strong> Lead arbitrage model (buy leads cheap, sell at CHF 45+). 
                  Volume play. Target CPL &lt; CHF 10, Lead-to-Sale &gt; 20%.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profitability Status */}
        <ProfitabilityIndicator netProfit={economics.netProfit} roas={economics.roas} />

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <MetricCard 
            label="Ad Spend" 
            value={formatCHF(economics.adSpend)} 
            icon={DollarSign}
          />
          <MetricCard 
            label="CPC" 
            value={formatCHF(economics.cpc)} 
            subValue="Cost per Click"
            status={economics.cpc < 2 ? "positive" : economics.cpc < 4 ? "neutral" : "negative"}
          />
          <MetricCard 
            label="CPL" 
            value={formatCHF(economics.cpl)} 
            subValue="Cost per Lead"
            status={economics.cpl < (model === "umzugscheck" ? 10 : 50) ? "positive" : "warning"}
          />
          <MetricCard 
            label="CPA" 
            value={economics.cpa === Infinity ? "–" : formatCHF(economics.cpa)} 
            subValue={`Break-even: ${formatCHF(breakEvenCPA)}`}
            status={economics.cpa < breakEvenCPA ? "positive" : economics.cpa < breakEvenCPA * 1.5 ? "warning" : "negative"}
            icon={Users}
          />
          <MetricCard 
            label="Conv. Rate" 
            value={formatPercent(economics.conversionRate)} 
            subValue="Lead → Booking"
            status={economics.conversionRate > 20 ? "positive" : economics.conversionRate > 10 ? "neutral" : "negative"}
            icon={Percent}
          />
          <MetricCard 
            label="ROAS" 
            value={`${economics.roas.toFixed(2)}x`} 
            subValue="Return on Ad Spend"
            status={economics.roas >= 3 ? "positive" : economics.roas >= 1.5 ? "warning" : "negative"}
            icon={TrendingUp}
          />
        </div>

        {/* Unit Economics Calculator & Campaign Table */}
        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calculator">
              <Calculator className="w-4 h-4 mr-2" />
              Unit Economics Calculator
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              <BarChart3 className="w-4 h-4 mr-2" />
              Campaign Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adSpend">Ad Spend (CHF)</Label>
                      <Input
                        id="adSpend"
                        type="number"
                        value={inputs.adSpend}
                        onChange={(e) => updateInput("adSpend", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clicks">Clicks</Label>
                      <Input
                        id="clicks"
                        type="number"
                        value={inputs.clicks}
                        onChange={(e) => updateInput("clicks", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="leads">Leads</Label>
                      <Input
                        id="leads"
                        type="number"
                        value={inputs.leads}
                        onChange={(e) => updateInput("leads", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bookings">{model === "feierabend" ? "Bookings" : "Leads Sold"}</Label>
                      <Input
                        id="bookings"
                        type="number"
                        value={inputs.bookings}
                        onChange={(e) => updateInput("bookings", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="aov">{model === "feierabend" ? "Avg Order Value (CHF)" : "CPL Charged (CHF)"}</Label>
                      <Input
                        id="aov"
                        type="number"
                        value={inputs.avgOrderValue}
                        onChange={(e) => updateInput("avgOrderValue", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="margin">Gross Margin (%)</Label>
                      <Input
                        id="margin"
                        type="number"
                        value={inputs.grossMargin}
                        onChange={(e) => updateInput("grossMargin", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Output Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Unit Economics Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-mono font-bold">{formatCHF(economics.revenue)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Gross Profit ({economics.grossMargin}%)</span>
                      <span className="font-mono font-bold">{formatCHF(economics.grossProfit)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Ad Spend</span>
                      <span className="font-mono font-bold text-red-600">- {formatCHF(economics.adSpend)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-foreground">
                      <span className="font-bold">Net Profit</span>
                      <span className={cn("font-mono font-bold text-lg", economics.netProfit >= 0 ? "text-green-600" : "text-red-600")}>
                        {formatCHF(economics.netProfit)}
                      </span>
                    </div>
                    <div className="pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Break-even CPA</span>
                        <span className="font-mono">{formatCHF(breakEvenCPA)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current CPA</span>
                        <span className={cn("font-mono", economics.cpa < breakEvenCPA ? "text-green-600" : "text-red-600")}>
                          {economics.cpa === Infinity ? "–" : formatCHF(economics.cpa)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Headroom per Booking</span>
                        <span className={cn("font-mono", breakEvenCPA - economics.cpa > 0 ? "text-green-600" : "text-red-600")}>
                          {economics.cpa === Infinity ? "–" : formatCHF(breakEvenCPA - economics.cpa)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Performance – {model === "feierabend" ? "Feierabend" : "Umzugscheck"}</CardTitle>
              </CardHeader>
              <CardContent>
                <CampaignTable model={model} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Decision Framework */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Decision Framework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  SCALE UP
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• ROAS &gt; 3x consistently</li>
                  <li>• CPA &lt; 50% of break-even</li>
                  <li>• Conv. rate &gt; 20%</li>
                  <li>• Brand campaigns dominating</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-700 font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  OPTIMIZE
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• ROAS 1.5-3x</li>
                  <li>• CPA near break-even</li>
                  <li>• Mixed campaign performance</li>
                  <li>• Test new creatives/audiences</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-700 font-semibold">
                  <TrendingDown className="w-4 h-4" />
                  PAUSE / RESTRUCTURE
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• ROAS &lt; 1.5x</li>
                  <li>• CPA &gt; break-even</li>
                  <li>• Consistent negative profit</li>
                  <li>• Kill underperformers immediately</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
          Internal use only • Data is illustrative • Last updated: {new Date().toLocaleDateString("de-CH")}
        </div>
      </main>
    </div>
  );
}
