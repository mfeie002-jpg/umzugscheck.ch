/**
 * Investor Charts — Recharts-basierte Visualisierungen für /investoren
 * Pie, Bar, Area, Radar Charts für Market, Revenue, Funding etc.
 */
import { memo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Legend
} from "recharts";

// ═══ COLORS ═══
const CHART_COLORS = {
  primary: "hsl(0, 72%, 51%)",
  blue: "hsl(217, 91%, 60%)",
  green: "hsl(142, 71%, 45%)",
  purple: "hsl(263, 70%, 50%)",
  amber: "hsl(38, 92%, 50%)",
  cyan: "hsl(188, 78%, 41%)",
  indigo: "hsl(239, 84%, 67%)",
  red: "hsl(0, 84%, 60%)",
  slate: "hsl(215, 20%, 65%)",
  emerald: "hsl(160, 84%, 39%)",
};

const PIE_COLORS = [CHART_COLORS.blue, CHART_COLORS.green, CHART_COLORS.purple, CHART_COLORS.amber, CHART_COLORS.cyan, CHART_COLORS.indigo];

// ═══ 1. REVENUE PIE CHART (Unit Economics) ═══
const revenuePieData = [
  { name: "Basis-Provision", value: 225, color: CHART_COLORS.blue },
  { name: "Affiliate", value: 100, color: CHART_COLORS.green },
  { name: "Versicherung", value: 99, color: CHART_COLORS.purple },
  { name: "Circular Economy", value: 50, color: CHART_COLORS.amber },
  { name: "Bürokratie", value: 49, color: CHART_COLORS.cyan },
  { name: "Escrow", value: 30, color: CHART_COLORS.indigo },
];

export const RevenuePieChart = memo(() => (
  <div className="w-full h-[280px]">
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={revenuePieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
          label={({ name, value }) => `${value} CHF`}
        >
          {revenuePieData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [`CHF ${value}`, name]}
          contentStyle={{ background: "hsl(222,47%,11%)", border: "1px solid hsl(217,33%,17%)", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "11px", color: "hsl(215,20%,65%)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
));
RevenuePieChart.displayName = "RevenuePieChart";

// ═══ 2. MARKET SIZE BAR CHART ═══
const marketSizeData = [
  { name: "Privat", value: 425000, fill: CHART_COLORS.blue },
  { name: "Geschäft", value: 32500, fill: CHART_COLORS.purple },
  { name: "Professionell", value: 165000, fill: CHART_COLORS.green },
  { name: "Reinigung", value: 200000, fill: CHART_COLORS.amber },
];

export const MarketSizeBarChart = memo(() => (
  <div className="w-full h-[260px]">
    <ResponsiveContainer>
      <BarChart data={marketSizeData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,17%)" />
        <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,65%)", fontSize: 11 }} axisLine={{ stroke: "hsl(217,33%,17%)" }} />
        <YAxis tick={{ fill: "hsl(215,20%,65%)", fontSize: 11 }} axisLine={{ stroke: "hsl(217,33%,17%)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value: number) => [new Intl.NumberFormat("de-CH").format(value), "Umzüge/Jahr"]}
          contentStyle={{ background: "hsl(222,47%,11%)", border: "1px solid hsl(217,33%,17%)", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {marketSizeData.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
));
MarketSizeBarChart.displayName = "MarketSizeBarChart";

// ═══ 3. COMPETITOR RADAR CHART ═══
const competitorRadarData = [
  { feature: "Garantie", umzugscheck: 100, movu: 10, comparis: 5, ofri: 10 },
  { feature: "Vetting", umzugscheck: 100, movu: 40, comparis: 10, ofri: 35 },
  { feature: "Echtzeit", umzugscheck: 100, movu: 15, comparis: 5, ofri: 10 },
  { feature: "4 Sprachen", umzugscheck: 100, movu: 50, comparis: 40, ofri: 15 },
  { feature: "Gemeinde-DB", umzugscheck: 100, movu: 0, comparis: 0, ofri: 0 },
  { feature: "Dispute", umzugscheck: 100, movu: 5, comparis: 0, ofri: 0 },
  { feature: "Preisdeckel", umzugscheck: 100, movu: 0, comparis: 0, ofri: 0 },
  { feature: "Digital-First", umzugscheck: 100, movu: 40, comparis: 20, ofri: 15 },
];

export const CompetitorRadarChart = memo(() => (
  <div className="w-full h-[320px]">
    <ResponsiveContainer>
      <RadarChart data={competitorRadarData} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="hsl(217,33%,17%)" />
        <PolarAngleAxis dataKey="feature" tick={{ fill: "hsl(215,20%,65%)", fontSize: 10 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Umzugscheck" dataKey="umzugscheck" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.25} strokeWidth={2} />
        <Radar name="MOVU" dataKey="movu" stroke={CHART_COLORS.slate} fill={CHART_COLORS.slate} fillOpacity={0.1} strokeWidth={1} />
        <Radar name="Comparis" dataKey="comparis" stroke={CHART_COLORS.amber} fill={CHART_COLORS.amber} fillOpacity={0.05} strokeWidth={1} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: "11px", color: "hsl(215,20%,65%)" }} />
      </RadarChart>
    </ResponsiveContainer>
  </div>
));
CompetitorRadarChart.displayName = "CompetitorRadarChart";

// ═══ 4. FUNDING REVENUE GROWTH AREA CHART ═══
const revenueGrowthData = [
  { month: "M1", revenue: 0, costs: 2000 },
  { month: "M2", revenue: 200, costs: 2500 },
  { month: "M3", revenue: 500, costs: 2500 },
  { month: "M4", revenue: 800, costs: 3000 },
  { month: "M5", revenue: 1200, costs: 3000 },
  { month: "M6", revenue: 1800, costs: 3200 },
  { month: "M7", revenue: 2400, costs: 3200 },
  { month: "M8", revenue: 2900, costs: 3000 },
  { month: "M9", revenue: 3200, costs: 2800 },
  { month: "M10", revenue: 3800, costs: 2500 },
  { month: "M11", revenue: 4200, costs: 2200 },
  { month: "M12", revenue: 5000, costs: 2000 },
  { month: "M13", revenue: 5500, costs: 1800 },
  { month: "M14", revenue: 6000, costs: 1500 },
  { month: "M15", revenue: 6500, costs: 1200 },
];

export const RevenueGrowthChart = memo(() => (
  <div className="w-full h-[280px]">
    <ResponsiveContainer>
      <AreaChart data={revenueGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.4} />
            <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.red} stopOpacity={0.3} />
            <stop offset="95%" stopColor={CHART_COLORS.red} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,17%)" />
        <XAxis dataKey="month" tick={{ fill: "hsl(215,20%,65%)", fontSize: 11 }} axisLine={{ stroke: "hsl(217,33%,17%)" }} />
        <YAxis tick={{ fill: "hsl(215,20%,65%)", fontSize: 11 }} axisLine={{ stroke: "hsl(217,33%,17%)" }} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
        <Tooltip
          formatter={(value: number, name: string) => [`CHF ${new Intl.NumberFormat("de-CH").format(value)}`, name === "revenue" ? "Einnahmen" : "Kosten"]}
          contentStyle={{ background: "hsl(222,47%,11%)", border: "1px solid hsl(217,33%,17%)", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
        />
        <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.green} fill="url(#colorRevenue)" strokeWidth={2.5} name="revenue" />
        <Area type="monotone" dataKey="costs" stroke={CHART_COLORS.red} fill="url(#colorCosts)" strokeWidth={1.5} strokeDasharray="5 5" name="costs" />
        <Legend
          formatter={(value) => value === "revenue" ? "Einnahmen" : "Kosten"}
          iconSize={8}
          wrapperStyle={{ fontSize: "11px", color: "hsl(215,20%,65%)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
));
RevenueGrowthChart.displayName = "RevenueGrowthChart";

// ═══ 5. PAIN POINTS BAR (horizontal) ═══
const painPointsData = [
  { name: "Preisopazität", value: 50, unit: "% Varianz" },
  { name: "Planungszeit <30d", value: 42, unit: "% der Umzügler" },
  { name: "Sprachbarrieren", value: 26, unit: "% Ausländeranteil" },
  { name: "Schmutzige Wohnung", value: 10, unit: "% der Mieter" },
  { name: "Keine Lizenzpflicht", value: 4, unit: "% SMA-zertifiziert" },
];

export const PainPointsChart = memo(() => (
  <div className="w-full h-[220px]">
    <ResponsiveContainer>
      <BarChart data={painPointsData} layout="vertical" margin={{ top: 5, right: 40, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,17%)" horizontal={false} />
        <XAxis type="number" tick={{ fill: "hsl(215,20%,65%)", fontSize: 11 }} axisLine={{ stroke: "hsl(217,33%,17%)" }} />
        <YAxis type="category" dataKey="name" tick={{ fill: "hsl(215,20%,65%)", fontSize: 10 }} axisLine={{ stroke: "hsl(217,33%,17%)" }} width={120} />
        <Tooltip
          formatter={(value: number, _: string, props: any) => [`${value}${props.payload.unit}`, "Ausmass"]}
          contentStyle={{ background: "hsl(222,47%,11%)", border: "1px solid hsl(217,33%,17%)", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
        />
        <Bar dataKey="value" fill={CHART_COLORS.red} radius={[0, 6, 6, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  </div>
));
PainPointsChart.displayName = "PainPointsChart";

// ═══ 6. TRANCHE ALLOCATION DONUT ═══
const trancheData = [
  { name: "T1: Zündung", value: 20000, color: CHART_COLORS.primary },
  { name: "T2: Skalierung", value: 25000, color: CHART_COLORS.amber },
  { name: "T3: Break-Even", value: 35000, color: CHART_COLORS.emerald },
];

export const TrancheDonutChart = memo(() => (
  <div className="w-full h-[240px]">
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={trancheData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
          label={({ name, value }) => `${(value / 1000).toFixed(0)}k`}
        >
          {trancheData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [`CHF ${new Intl.NumberFormat("de-CH").format(value)}`, name]}
          contentStyle={{ background: "hsl(222,47%,11%)", border: "1px solid hsl(217,33%,17%)", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", color: "hsl(215,20%,65%)" }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
));
TrancheDonutChart.displayName = "TrancheDonutChart";

// ═══ 7. WHY-INVEST GROUP STATS (Mini bar chart per group) ═══
const groupStatsData = [
  { group: "Markt", nuclear: 2, big: 6, deep: 2, total: 10 },
  { group: "SEO", nuclear: 5, big: 4, deep: 1, total: 10 },
  { group: "Plattform", nuclear: 2, big: 5, deep: 3, total: 10 },
  { group: "KI/WhatsApp", nuclear: 5, big: 3, deep: 2, total: 10 },
  { group: "Execution", nuclear: 3, big: 5, deep: 2, total: 10 },
];

export const GroupStatsChart = memo(() => (
  <div className="w-full h-[220px]">
    <ResponsiveContainer>
      <BarChart data={groupStatsData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
        <XAxis dataKey="group" tick={{ fill: "hsl(215,20%,45%)", fontSize: 11 }} axisLine={{ stroke: "hsl(220,13%,91%)" }} />
        <YAxis tick={{ fill: "hsl(215,20%,45%)", fontSize: 11 }} axisLine={{ stroke: "hsl(220,13%,91%)" }} />
        <Tooltip contentStyle={{ background: "#fff", border: "1px solid hsl(220,13%,91%)", borderRadius: "8px", fontSize: "12px" }} />
        <Bar dataKey="nuclear" stackId="a" fill={CHART_COLORS.primary} name="🔥 Nuclear" radius={[0, 0, 0, 0]} />
        <Bar dataKey="big" stackId="a" fill={CHART_COLORS.blue} name="💪 Big Wow" radius={[0, 0, 0, 0]} />
        <Bar dataKey="deep" stackId="a" fill={CHART_COLORS.slate} name="🎯 Deep USP" radius={[4, 4, 0, 0]} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
      </BarChart>
    </ResponsiveContainer>
  </div>
));
GroupStatsChart.displayName = "GroupStatsChart";
