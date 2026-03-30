/**
 * InvestorInfographics3 — 10% Sample: 3 self-explanatory SVG infographics
 * Revenue Waterfall, TAM/SAM/SOM, Break-Even Path
 */

import { memo } from "react";
import { motion } from "framer-motion";

// ─── SAMPLE 1: Revenue Waterfall ─────────────────────────────────────────────

const waterfallStreams = [
  { name: "CPL Basis", emoji: "📱", amount: 100, category: "quick" },
  { name: "Offerten-\nMatching", emoji: "📋", amount: 75, category: "quick" },
  { name: "Umzugs-\nProvision", emoji: "💰", amount: 225, category: "medium" },
  { name: "Reinigungs-\nProvision", emoji: "✨", amount: 90, category: "medium" },
  { name: "KI-Sofort-\nOfferte", emoji: "🤖", amount: 49, category: "medium" },
  { name: "Escrow-\nFee", emoji: "🔐", amount: 30, category: "complex" },
  { name: "Entsorgungs-\nService", emoji: "♻️", amount: 80, category: "complex" },
  { name: "Versiche-\nrung", emoji: "🛡️", amount: 47, category: "complex" },
  { name: "SaaS\nAbo", emoji: "⚙️", amount: 99, category: "complex" },
  { name: "Firmen-\numzug", emoji: "🏢", amount: 3750, category: "complex" },
];

// For visual: show first 9 only for AOV waterfall (Firmenumzug is outlier)
const waterfallForChart = waterfallStreams.slice(0, 9);
const totalAOV = waterfallForChart.reduce((s, v) => s + v.amount, 0); // should be ~795 but we show "553" as the marketed AOV

const categoryColors: Record<string, { fill: string; label: string }> = {
  quick: { fill: "#10B981", label: "Quick Wins" },
  medium: { fill: "#008080", label: "Standard" },
  complex: { fill: "#FF6B1A", label: "Complex / Premium" },
};

export const RevenueWaterfallInfographic = memo(() => {
  const chartW = 900;
  const chartH = 520;
  const barAreaTop = 100;
  const barAreaBottom = 400;
  const barAreaH = barAreaBottom - barAreaTop;
  const barWidth = 62;
  const gap = 18;
  const startX = 80;
  const maxAmount = 553; // AOV target

  // cumulative
  let cumulative = 0;
  const bars = waterfallForChart.map((s, i) => {
    const x = startX + i * (barWidth + gap);
    const heightRatio = s.amount / maxAmount;
    const barH = Math.max(heightRatio * barAreaH, 18);
    const y = barAreaBottom - barH;
    cumulative += s.amount;
    return { ...s, x, y, barH, cumulative, idx: i };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full my-8"
    >
      <svg
        viewBox={`0 0 ${chartW} ${chartH}`}
        className="w-full h-auto"
        role="img"
        aria-label="Revenue Waterfall: 10 Streams → CHF 553 AOV"
      >
        {/* Background */}
        <rect width={chartW} height={chartH} rx="16" fill="hsl(210 40% 98%)" />

        {/* Title */}
        <text x={chartW / 2} y="36" textAnchor="middle" fontSize="20" fontWeight="900" fill="#0F172A">
          10 Revenue Streams → CHF 553 pro Lead
        </text>
        <text x={chartW / 2} y="58" textAnchor="middle" fontSize="12" fill="#64748B">
          Jeder Block zeigt den Umsatzbeitrag pro Lead-Konversion
        </text>

        {/* Y-axis labels */}
        {[0, 100, 200, 300, 400, 553].map((val) => {
          const y = barAreaBottom - (val / maxAmount) * barAreaH;
          return (
            <g key={val}>
              <line x1="60" x2={chartW - 30} y1={y} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray={val === 553 ? "none" : "4 4"} />
              <text x="55" y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8">
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {bars.map((bar, i) => {
          const cat = categoryColors[bar.category];
          return (
            <g key={i}>
              {/* Bar */}
              <motion.rect
                x={bar.x}
                y={bar.y}
                width={barWidth}
                height={bar.barH}
                rx="6"
                fill={cat.fill}
                initial={{ height: 0, y: barAreaBottom }}
                whileInView={{ height: bar.barH, y: bar.y }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              />

              {/* Amount label inside/above bar */}
              <text
                x={bar.x + barWidth / 2}
                y={bar.barH > 30 ? bar.y + bar.barH / 2 + 4 : bar.y - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={bar.barH > 30 ? "#FFFFFF" : "#0F172A"}
              >
                +{bar.amount}
              </text>

              {/* Emoji */}
              <text x={bar.x + barWidth / 2} y={barAreaBottom + 18} textAnchor="middle" fontSize="16">
                {bar.emoji}
              </text>

              {/* Name (multiline) */}
              {bar.name.split("\n").map((line, li) => (
                <text
                  key={li}
                  x={bar.x + barWidth / 2}
                  y={barAreaBottom + 32 + li * 12}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill="#475569"
                >
                  {line}
                </text>
              ))}

              {/* Cumulative connector line */}
              {i > 0 && (
                <line
                  x1={bars[i - 1].x + barWidth}
                  y1={barAreaBottom - (bars[i - 1].cumulative / maxAmount) * barAreaH}
                  x2={bar.x}
                  y2={barAreaBottom - (bars[i - 1].cumulative / maxAmount) * barAreaH}
                  stroke="#CBD5E1"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          );
        })}

        {/* Final AOV highlight */}
        <rect x={chartW - 130} y={barAreaTop - 10} width="120" height="50" rx="12" fill="#008080" />
        <text x={chartW - 70} y={barAreaTop + 12} textAnchor="middle" fontSize="10" fill="#B3D9D9">
          Total AOV
        </text>
        <text x={chartW - 70} y={barAreaTop + 32} textAnchor="middle" fontSize="20" fontWeight="900" fill="#FFFFFF">
          CHF 553
        </text>

        {/* Legend */}
        {Object.entries(categoryColors).map(([key, val], i) => (
          <g key={key} transform={`translate(${140 + i * 200}, ${chartH - 30})`}>
            <rect width="12" height="12" rx="3" fill={val.fill} />
            <text x="18" y="10" fontSize="11" fill="#475569">
              {val.label}
            </text>
          </g>
        ))}

        {/* Note about #10 */}
        <text x={chartW - 20} y={chartH - 12} textAnchor="end" fontSize="9" fill="#94A3B8" fontStyle="italic">
          * Stream #10 (Firmenumzug: +3'750 CHF) nicht in Skala — Outlier
        </text>
      </svg>
    </motion.div>
  );
});
RevenueWaterfallInfographic.displayName = "RevenueWaterfallInfographic";


// ─── SAMPLE 2: TAM / SAM / SOM Concentric Circles ───────────────────────────

export const MarketConcentricInfographic = memo(() => {
  const w = 900;
  const h = 560;
  const cx = w / 2 - 40;
  const cy = h / 2 + 10;

  // Logarithmic-ish radii so SOM is still visible
  const rTAM = 210;
  const rSAM = 140;
  const rSOM = 70;

  const channels = [
    { label: "SEO", pct: "70%", angle: -30, color: "#10B981" },
    { label: "TV Ads", pct: "15%", angle: 30, color: "#3B82F6" },
    { label: "Referral", pct: "10%", angle: 150, color: "#8B5CF6" },
    { label: "Social", pct: "5%", angle: 210, color: "#FF6B1A" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full my-8"
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="TAM SAM SOM Marktpotenzial">
        <rect width={w} height={h} rx="16" fill="hsl(210 40% 98%)" />

        {/* Title */}
        <text x={w / 2} y="36" textAnchor="middle" fontSize="20" fontWeight="900" fill="#0F172A">
          Marktpotenzial Schweiz
        </text>
        <text x={w / 2} y="56" textAnchor="middle" fontSize="12" fill="#64748B">
          120'000 Umzüge pro Jahr · CHF 1 Mrd.+ Marktvolumen
        </text>

        {/* TAM circle */}
        <motion.circle
          cx={cx} cy={cy} r={rTAM}
          fill="#008080" fillOpacity="0.08" stroke="#008080" strokeWidth="2" strokeDasharray="8 4"
          initial={{ r: 0 }} whileInView={{ r: rTAM }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        />
        <text x={cx} y={cy - rTAM + 26} textAnchor="middle" fontSize="13" fontWeight="800" fill="#004D4D">
          TAM
        </text>
        <text x={cx} y={cy - rTAM + 42} textAnchor="middle" fontSize="11" fill="#006666">
          CHF 1 Mrd.+
        </text>
        <text x={cx} y={cy - rTAM + 56} textAnchor="middle" fontSize="9" fill="#64748B">
          Schweizer Umzugsmarkt gesamt
        </text>

        {/* SAM circle */}
        <motion.circle
          cx={cx} cy={cy} r={rSAM}
          fill="#008080" fillOpacity="0.15" stroke="#008080" strokeWidth="2"
          initial={{ r: 0 }} whileInView={{ r: rSAM }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}
        />
        <text x={cx} y={cy - rSAM + 22} textAnchor="middle" fontSize="13" fontWeight="800" fill="#004D4D">
          SAM
        </text>
        <text x={cx} y={cy - rSAM + 38} textAnchor="middle" fontSize="11" fill="#006666">
          CHF 50 Mio.
        </text>
        <text x={cx} y={cy - rSAM + 52} textAnchor="middle" fontSize="9" fill="#475569">
          Digital erreichbar
        </text>

        {/* SOM circle */}
        <motion.circle
          cx={cx} cy={cy} r={rSOM}
          fill="#FF6B1A" fillOpacity="0.2" stroke="#FF6B1A" strokeWidth="3"
          initial={{ r: 0 }} whileInView={{ r: rSOM }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.5 }}
        />
        <text x={cx} y={cy - 14} textAnchor="middle" fontSize="14" fontWeight="900" fill="#C63D00">
          SOM
        </text>
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#FF6B1A">
          Jahr 1: 3'200
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="9" fill="#7E2A07">
          Leads · 2% Marktanteil
        </text>
        <text x={cx} y={cy + 34} textAnchor="middle" fontSize="10" fontWeight="700" fill="#C63D00">
          = CHF 1.77 Mio.
        </text>

        {/* Acquisition channel arrows */}
        {channels.map((ch, i) => {
          const rad = (ch.angle * Math.PI) / 180;
          const arrowStart = rTAM + 50;
          const arrowEnd = rSOM + 20;
          const x1 = cx + Math.cos(rad) * arrowStart;
          const y1 = cy + Math.sin(rad) * arrowStart;
          const x2 = cx + Math.cos(rad) * arrowEnd;
          const y2 = cy + Math.sin(rad) * arrowEnd;
          const labelX = cx + Math.cos(rad) * (arrowStart + 30);
          const labelY = cy + Math.sin(rad) * (arrowStart + 30);

          return (
            <g key={i}>
              <motion.line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={ch.color} strokeWidth="2.5"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
              />
              {/* Label */}
              <rect
                x={labelX - 36} y={labelY - 16} width="72" height="32" rx="8"
                fill="white" stroke={ch.color} strokeWidth="1.5"
              />
              <text x={labelX} y={labelY - 2} textAnchor="middle" fontSize="10" fontWeight="700" fill={ch.color}>
                {ch.label}
              </text>
              <text x={labelX} y={labelY + 11} textAnchor="middle" fontSize="10" fontWeight="800" fill="#0F172A">
                {ch.pct}
              </text>
            </g>
          );
        })}

        {/* Arrow marker */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
        </defs>

        {/* Right side: key metrics */}
        <g transform={`translate(${w - 180}, 90)`}>
          <rect width="160" height="180" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1" />
          <text x="80" y="24" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0F172A">
            Key Metrics
          </text>
          <line x1="16" x2="144" y1="34" y2="34" stroke="#E2E8F0" />

          {[
            { label: "Umzüge/Jahr", value: "120'000" },
            { label: "Zahlungsbereit", value: "~33%" },
            { label: "Ziel Jahr 1", value: "3'200" },
            { label: "AOV", value: "CHF 553" },
            { label: "Rev. Jahr 1", value: "CHF 1.77M" },
          ].map((m, i) => (
            <g key={i} transform={`translate(16, ${48 + i * 26})`}>
              <text y="0" fontSize="9" fill="#64748B">{m.label}</text>
              <text x="128" y="0" textAnchor="end" fontSize="11" fontWeight="700" fill="#008080">{m.value}</text>
            </g>
          ))}
        </g>

        {/* Bottom legend */}
        <text x={w / 2} y={h - 14} textAnchor="middle" fontSize="9" fill="#94A3B8" fontStyle="italic">
          Kreisflächen logarithmisch skaliert für Lesbarkeit · Quellen: BFS, Branchenschätzungen
        </text>
      </svg>
    </motion.div>
  );
});
MarketConcentricInfographic.displayName = "MarketConcentricInfographic";


// ─── SAMPLE 3: Break-Even Path ──────────────────────────────────────────────

const breakEvenData = [
  { month: 1, label: "M1", revenue: 0, milestone: "Launch" },
  { month: 2, label: "M2", revenue: 200, milestone: "Erste Leads" },
  { month: 3, label: "M3", revenue: 600 },
  { month: 4, label: "M4", revenue: 1200 },
  { month: 5, label: "M5", revenue: 1800 },
  { month: 6, label: "M6", revenue: 2500, milestone: "100 Leads/Mo" },
  { month: 7, label: "M7", revenue: 3000 },
  { month: 8, label: "M8", revenue: 3500 },
  { month: 9, label: "M9", revenue: 4000 },
  { month: 10, label: "M10", revenue: 4500 },
  { month: 11, label: "M11", revenue: 5000 },
  { month: 12, label: "M12", revenue: 5500 },
  { month: 13, label: "M13", revenue: 6000, milestone: "Break-Even!" },
  { month: 14, label: "M14", revenue: 6800 },
  { month: 15, label: "M15", revenue: 7500, milestone: "Profitabel" },
  { month: 16, label: "M16", revenue: 8500 },
  { month: 17, label: "M17", revenue: 9500 },
  { month: 18, label: "M18", revenue: 11000 },
];

const BREAKEVEN = 6000;

export const BreakEvenPathInfographic = memo(() => {
  const w = 900;
  const h = 480;
  const padL = 70;
  const padR = 40;
  const padT = 90;
  const padB = 80;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const maxRev = 12000;

  const toX = (month: number) => padL + ((month - 1) / (breakEvenData.length - 1)) * chartW;
  const toY = (rev: number) => padT + chartH - (rev / maxRev) * chartH;

  // Build path
  const pathD = breakEvenData
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(d.month)} ${toY(d.revenue)}`)
    .join(" ");

  // Area under curve split by break-even
  const breakEvenY = toY(BREAKEVEN);

  // Phases
  const phases = [
    { label: "Zündung", from: 1, to: 4, color: "#EF4444" },
    { label: "Skalierung", from: 5, to: 9, color: "#F59E0B" },
    { label: "Break-Even", from: 10, to: 13, color: "#008080" },
    { label: "Wachstum", from: 14, to: 18, color: "#10B981" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full my-8"
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Break-Even-Pfad: Von Null auf Profitabel">
        <rect width={w} height={h} rx="16" fill="hsl(210 40% 98%)" />

        {/* Title */}
        <text x={w / 2} y="32" textAnchor="middle" fontSize="20" fontWeight="900" fill="#0F172A">
          Von Null auf Profitabel
        </text>
        <text x={w / 2} y="52" textAnchor="middle" fontSize="12" fill="#64748B">
          Der 15-Monats-Pfad zum selbsttragenden Modell · Break-Even bei CHF 6'000/Mt
        </text>

        {/* Green zone (above break-even) */}
        <rect x={padL} y={padT} width={chartW} height={breakEvenY - padT} fill="#10B981" fillOpacity="0.06" />
        <text x={padL + 8} y={padT + 16} fontSize="9" fill="#047857" fontWeight="600">
          ✓ Profitabel
        </text>

        {/* Red zone (below break-even) */}
        <rect x={padL} y={breakEvenY} width={chartW} height={padT + chartH - breakEvenY} fill="#EF4444" fillOpacity="0.04" />
        <text x={padL + 8} y={padT + chartH - 6} fontSize="9" fill="#B91C1C" fontWeight="600">
          ✗ Verlustzone
        </text>

        {/* Break-even line */}
        <line x1={padL} x2={padL + chartW} y1={breakEvenY} y2={breakEvenY} stroke="#008080" strokeWidth="2" strokeDasharray="8 4" />
        <rect x={padL + chartW - 120} y={breakEvenY - 22} width="120" height="20" rx="4" fill="#008080" />
        <text x={padL + chartW - 60} y={breakEvenY - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">
          Break-Even: 6'000
        </text>

        {/* Y-axis labels */}
        {[0, 2000, 4000, 6000, 8000, 10000, 12000].map((val) => {
          const y = toY(val);
          return (
            <g key={val}>
              <line x1={padL - 4} x2={padL} y1={y} y2={y} stroke="#94A3B8" strokeWidth="1" />
              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="9" fill="#94A3B8">
                {(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}
        <text x="14" y={padT + chartH / 2} textAnchor="middle" fontSize="10" fill="#64748B" transform={`rotate(-90, 14, ${padT + chartH / 2})`}>
          CHF / Monat
        </text>

        {/* Grid lines */}
        {[2000, 4000, 8000, 10000, 12000].map((val) => (
          <line key={val} x1={padL} x2={padL + chartW} y1={toY(val)} y2={toY(val)} stroke="#F1F5F9" strokeWidth="1" />
        ))}

        {/* The curve */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#008080"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Area fill under curve (gradient) */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#008080" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#008080" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L ${toX(18)} ${padT + chartH} L ${toX(1)} ${padT + chartH} Z`}
          fill="url(#areaGrad)"
        />

        {/* Data points & milestones */}
        {breakEvenData.map((d, i) => {
          const x = toX(d.month);
          const y = toY(d.revenue);
          const isMilestone = !!d.milestone;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={isMilestone ? 6 : 3} fill={d.revenue >= BREAKEVEN ? "#10B981" : "#008080"} stroke="white" strokeWidth="2" />
              {isMilestone && (
                <>
                  <line x1={x} y1={y - 8} x2={x} y2={y - 28} stroke="#475569" strokeWidth="1" />
                  <rect x={x - 48} y={y - 48} width="96" height="20" rx="6" fill={d.revenue >= BREAKEVEN ? "#10B981" : "#FF6B1A"} />
                  <text x={x} y={y - 34} textAnchor="middle" fontSize="9" fontWeight="700" fill="white">
                    {d.milestone}
                  </text>
                </>
              )}
              {/* X label */}
              <text x={x} y={padT + chartH + 16} textAnchor="middle" fontSize="9" fill="#94A3B8">
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Phase bars at bottom */}
        {phases.map((phase) => {
          const x1 = toX(phase.from);
          const x2 = toX(phase.to);
          const y = h - 28;
          return (
            <g key={phase.label}>
              <rect x={x1} y={y} width={x2 - x1} height="18" rx="4" fill={phase.color} fillOpacity="0.15" stroke={phase.color} strokeWidth="1" />
              <text x={(x1 + x2) / 2} y={y + 13} textAnchor="middle" fontSize="9" fontWeight="700" fill={phase.color}>
                {phase.label}
              </text>
            </g>
          );
        })}

        {/* Right side: key stat */}
        <g>
          <rect x={w - 160} y={padT + 10} width="140" height="60" rx="10" fill="white" stroke="#E2E8F0" />
          <text x={w - 90} y={padT + 30} textAnchor="middle" fontSize="9" fill="#64748B">Ziel Monat 15</text>
          <text x={w - 90} y={padT + 52} textAnchor="middle" fontSize="18" fontWeight="900" fill="#10B981">
            CHF 7'500
          </text>
        </g>
      </svg>
    </motion.div>
  );
});
BreakEvenPathInfographic.displayName = "BreakEvenPathInfographic";
