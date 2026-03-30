/**
 * FundingMilestoneTimeline
 * Full SVG infographic: Nov 2025 → Aug 2026
 * Phase 0 (pre-funding) + 3 Funding Tranches
 */

import { memo } from "react";
import { motion } from "framer-motion";

const COLORS = {
  teal: "#008080",
  orange: "#FF6B1A",
  slate: "#475569",
  slateLight: "#94A3B8",
  green: "#22C55E",
  red: "#EF4444",
  amber: "#F59E0B",
  bg: "#0F172A",
  cardBg: "#1E293B",
  white: "#F8FAFC",
  muted: "#CBD5E1",
};

// Timeline months
const MONTHS = [
  { key: "Nov", label: "Nov 25", x: 0 },
  { key: "Dez", label: "Dez 25", x: 1 },
  { key: "Jan", label: "Jan 26", x: 2 },
  { key: "Feb", label: "Feb 26", x: 3 },
  { key: "Mär", label: "Mär 26", x: 4 },
  { key: "Apr", label: "Apr 26", x: 5 },
  { key: "Mai", label: "Mai 26", x: 6 },
  { key: "Jun", label: "Jun 26", x: 7 },
  { key: "Jul", label: "Jul 26", x: 8 },
  { key: "Aug", label: "Aug 26", x: 9 },
];

export const FundingMilestoneTimeline = memo(() => {
  const W = 1000;
  const H = 620;
  const padL = 40;
  const padR = 40;
  const timelineY = 260;
  const barW = (W - padL - padR) / MONTHS.length;

  const getX = (monthIdx: number) => padL + monthIdx * barW + barW / 2;

  // Phases
  const phase0 = { start: 0, end: 4, color: COLORS.teal, label: "PHASE 0 — Aufbau", sub: "Motor bauen" };
  const phases = [
    { start: 5, end: 5, color: COLORS.orange, label: "FUNDING 1", sub: "Zündung", amount: "CHF 20k" },
    { start: 6, end: 6, color: COLORS.amber, label: "FUNDING 2", sub: "Skalierung", amount: "CHF 25k" },
    { start: 7, end: 7, color: COLORS.green, label: "FUNDING 3", sub: "Break-Even", amount: "CHF 35k" },
  ];

  // Milestones on the timeline
  const milestones = [
    { month: 0, label: "Projektstart", emoji: "🚀", y: -40 },
    { month: 1, label: "KI-Architektur", emoji: "🧠", y: -40 },
    { month: 2, label: "Plattform v1", emoji: "🏗️", y: -40 },
    { month: 3, label: "20+ Funnels live", emoji: "🔄", y: -40 },
    { month: 4, label: "Motor läuft ✓", emoji: "⚡", y: -40 },
    { month: 5, label: "Ads & Leads", emoji: "🎯", y: -40 },
    { month: 6, label: "30+ Leads/Mo", emoji: "📈", y: -40 },
    { month: 7, label: "Cashflow +", emoji: "💰", y: -40 },
    { month: 8, label: "Puffer", emoji: "🛡️", y: -40 },
    { month: 9, label: "Profitabel", emoji: "👑", y: -40 },
  ];

  // Phase 0 achievements
  const phase0Items = [
    "500+ Stunden Entwicklung",
    "20+ Funnels & Rechner",
    "KI-Architektur (95% AI-built)",
    "SEO-Fundament gelegt",
    "50+ Business-Logiken implementiert",
  ];

  // Funding targets
  const fundingTargets = [
    { phase: 1, items: ["CPL < CHF 200", "15 profitable Aufträge", "Funnels marktreif"] },
    { phase: 2, items: ["30+ Leads/Monat", "MRR CHF 25k", "Partner-Retention"] },
    { phase: 3, items: ["Cashflow-positiv", "ROI alle Kanäle", "Organisches Wachstum"] },
  ];

  // "Today" marker at end of March (index 4.9)
  const todayX = getX(4) + barW * 0.4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full my-8"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Funding Milestone Timeline: November 2025 bis August 2026"
      >
        {/* Background */}
        <rect width={W} height={H} rx="16" fill={COLORS.bg} />

        {/* Title */}
        <text x={W / 2} y="36" textAnchor="middle" fill={COLORS.white} fontSize="22" fontWeight="800">
          Von der Idee zur Profitabilität
        </text>
        <text x={W / 2} y="58" textAnchor="middle" fill={COLORS.muted} fontSize="13">
          November 2025 → August 2026 · 10 Monate · 4 Phasen
        </text>

        {/* Phase 0 bar (Nov–Mar) */}
        <rect
          x={padL + phase0.start * barW + 4}
          y={timelineY - 12}
          width={(phase0.end - phase0.start + 1) * barW - 8}
          height={24}
          rx="6"
          fill={COLORS.teal}
          opacity="0.25"
        />
        <rect
          x={padL + phase0.start * barW + 4}
          y={timelineY - 12}
          width={(phase0.end - phase0.start + 1) * barW - 8}
          height={24}
          rx="6"
          fill="none"
          stroke={COLORS.teal}
          strokeWidth="2"
          strokeDasharray="6 3"
        />
        <text
          x={padL + ((phase0.start + phase0.end + 1) / 2) * barW}
          y={timelineY + 6}
          textAnchor="middle"
          fill={COLORS.teal}
          fontSize="11"
          fontWeight="700"
        >
          {phase0.label}
        </text>

        {/* Funding phase bars */}
        {phases.map((p, i) => (
          <g key={i}>
            <rect
              x={padL + p.start * barW + 4}
              y={timelineY - 12}
              width={(p.end - p.start + 1) * barW - 8}
              height={24}
              rx="6"
              fill={p.color}
              opacity="0.3"
            />
            <rect
              x={padL + p.start * barW + 4}
              y={timelineY - 12}
              width={(p.end - p.start + 1) * barW - 8}
              height={24}
              rx="6"
              fill="none"
              stroke={p.color}
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Reserve/Buffer zone (Jul–Aug) */}
        <rect
          x={padL + 8 * barW + 4}
          y={timelineY - 12}
          width={2 * barW - 8}
          height={24}
          rx="6"
          fill={COLORS.slateLight}
          opacity="0.15"
        />
        <text
          x={padL + 9 * barW}
          y={timelineY + 6}
          textAnchor="middle"
          fill={COLORS.slateLight}
          fontSize="10"
          fontWeight="600"
        >
          RESERVE
        </text>

        {/* Month labels & tick marks */}
        {MONTHS.map((m, i) => {
          const cx = getX(i);
          return (
            <g key={m.key}>
              <line x1={cx} y1={timelineY + 16} x2={cx} y2={timelineY + 22} stroke={COLORS.slateLight} strokeWidth="1" />
              <text x={cx} y={timelineY + 36} textAnchor="middle" fill={COLORS.muted} fontSize="10" fontWeight="500">
                {m.label}
              </text>
              {/* Dot on timeline */}
              <circle
                cx={cx}
                cy={timelineY}
                r={i <= 4 ? 6 : 5}
                fill={i <= 4 ? COLORS.teal : i <= 7 ? phases[i - 5]?.color || COLORS.slateLight : COLORS.slateLight}
                stroke={COLORS.bg}
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* TODAY marker */}
        <line x1={todayX} y1={timelineY - 30} x2={todayX} y2={timelineY + 30} stroke={COLORS.red} strokeWidth="2" strokeDasharray="4 2" />
        <rect x={todayX - 28} y={timelineY - 48} width="56" height="18" rx="4" fill={COLORS.red} />
        <text x={todayX} y={timelineY - 35} textAnchor="middle" fill={COLORS.white} fontSize="10" fontWeight="700">
          HEUTE
        </text>

        {/* Arrow: "Motor läuft → braucht Benzin" */}
        <text x={todayX + 8} y={timelineY + 55} fill={COLORS.orange} fontSize="11" fontWeight="700" textAnchor="start">
          Motor läuft → jetzt braucht er Benzin 🔥
        </text>

        {/* Milestone labels above timeline */}
        {milestones.map((ms, i) => {
          const cx = getX(ms.month);
          const isCompleted = ms.month <= 4;
          return (
            <g key={i}>
              <text x={cx} y={timelineY - 55} textAnchor="middle" fontSize="14">
                {ms.emoji}
              </text>
              <text
                x={cx}
                y={timelineY - 25}
                textAnchor="middle"
                fill={isCompleted ? COLORS.teal : COLORS.muted}
                fontSize="8.5"
                fontWeight="600"
              >
                {ms.label}
              </text>
            </g>
          );
        })}

        {/* ─── Bottom Section: Phase 0 Achievements ─── */}
        <rect x={padL} y={timelineY + 75} width={W / 2 - padL - 20} height={180} rx="10" fill={COLORS.cardBg} />
        <text x={padL + 16} y={timelineY + 98} fill={COLORS.teal} fontSize="12" fontWeight="800">
          ✅ BEREITS GELEISTET (Phase 0)
        </text>
        <text x={padL + 16} y={timelineY + 113} fill={COLORS.slateLight} fontSize="10">
          Nov 2025 – März 2026 · 5 Monate · Ohne Fremdkapital
        </text>
        {phase0Items.map((item, i) => (
          <g key={i}>
            <circle cx={padL + 26} cy={timelineY + 133 + i * 22} r="3" fill={COLORS.teal} />
            <text x={padL + 36} y={timelineY + 137 + i * 22} fill={COLORS.white} fontSize="11" fontWeight="500">
              {item}
            </text>
          </g>
        ))}
        <text x={padL + 16} y={timelineY + 245} fill={COLORS.teal} fontSize="10" fontWeight="700">
          → Eigenleistung: 500+ Stunden · CHF 0 Fremdkapital
        </text>

        {/* ─── Bottom Section: Funding Targets ─── */}
        <rect x={W / 2 + 10} y={timelineY + 75} width={W / 2 - padR - 10} height={180} rx="10" fill={COLORS.cardBg} />
        <text x={W / 2 + 26} y={timelineY + 98} fill={COLORS.orange} fontSize="12" fontWeight="800">
          🎯 FUNDING-ZIELE (Phase 1–3)
        </text>
        <text x={W / 2 + 26} y={timelineY + 113} fill={COLORS.slateLight} fontSize="10">
          Apr – Aug 2026 · 3×30 Tage · CHF 80k total
        </text>

        {fundingTargets.map((ft, phaseIdx) => {
          const baseY = timelineY + 128 + phaseIdx * 52;
          const phaseColor = [COLORS.orange, COLORS.amber, COLORS.green][phaseIdx];
          return (
            <g key={phaseIdx}>
              <rect x={W / 2 + 22} y={baseY} width={8} height={40} rx="3" fill={phaseColor} opacity="0.5" />
              <text x={W / 2 + 40} y={baseY + 13} fill={phaseColor} fontSize="10" fontWeight="700">
                F{phaseIdx + 1}: {phases[phaseIdx].sub} ({phases[phaseIdx].amount})
              </text>
              {ft.items.map((item, j) => (
                <text key={j} x={W / 2 + 40} y={baseY + 26 + j * 12} fill={COLORS.muted} fontSize="9">
                  ✓ {item}
                </text>
              ))}
            </g>
          );
        })}

        {/* ─── Bottom bar: Key message ─── */}
        <rect x={padL} y={H - 50} width={W - padL - padR} height={36} rx="8" fill={COLORS.teal} opacity="0.15" />
        <rect x={padL} y={H - 50} width={W - padL - padR} height={36} rx="8" fill="none" stroke={COLORS.teal} strokeWidth="1.5" />
        <text x={W / 2} y={H - 27} textAnchor="middle" fill={COLORS.teal} fontSize="13" fontWeight="700">
          Das hier kommt nicht aus dem Nichts. 5 Monate Aufbau. Jetzt ist die Maschine bereit — sie braucht nur noch Treibstoff.
        </text>
      </svg>
    </motion.div>
  );
});

FundingMilestoneTimeline.displayName = "FundingMilestoneTimeline";
