/**
 * FlowTestingMatrix — SVG infographic showing 60 funnel variants as a visual grid
 * Top-10 highlighted, rest as pattern tiles. Self-explanatory infographic.
 */
import { motion } from "framer-motion";

const FLOW_GROUPS = [
  { label: "SEO Funnels", count: 12, color: "#008080" },
  { label: "WhatsApp Flows", count: 8, color: "#25D366" },
  { label: "Rechner", count: 10, color: "#FF6B1A" },
  { label: "Vergleich", count: 10, color: "#6366f1" },
  { label: "Regional", count: 12, color: "#f59e0b" },
  { label: "B2B / Spezial", count: 8, color: "#ec4899" },
];

const TOP_10_POSITIONS = [0, 1, 5, 12, 13, 20, 21, 30, 40, 50];

export function FlowTestingMatrix() {
  const cols = 12;
  const cellW = 58;
  const cellH = 36;
  const gap = 4;
  const startY = 100;
  const startX = 30;
  const totalW = startX * 2 + cols * (cellW + gap);
  
  let cellIndex = 0;
  const cells: { x: number; y: number; color: string; isTop10: boolean; group: string }[] = [];
  
  FLOW_GROUPS.forEach((group) => {
    for (let i = 0; i < group.count; i++) {
      const col = cellIndex % cols;
      const row = Math.floor(cellIndex / cols);
      cells.push({
        x: startX + col * (cellW + gap),
        y: startY + row * (cellH + gap),
        color: group.color,
        isTop10: TOP_10_POSITIONS.includes(cellIndex),
        group: group.label,
      });
      cellIndex++;
    }
  });

  const totalRows = Math.ceil(cellIndex / cols);
  const gridH = totalRows * (cellH + gap);
  const legendY = startY + gridH + 20;
  const statsY = legendY + 50;
  const totalH = statsY + 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-slate-950 p-4 md:p-6 mt-10"
    >
      <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full h-auto" role="img" aria-label="60 Funnel-Varianten Testing Matrix">
        {/* Title */}
        <text x={totalW / 2} y="28" textAnchor="middle" fill="#f1f5f9" fontSize="18" fontWeight="800" fontFamily="system-ui">
          60 Funnel-Varianten. Systematisch getestet.
        </text>
        <text x={totalW / 2} y="52" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
          Jede Kachel = 1 dokumentierter Flow · Farbig nach Kategorie · ★ = Top-10 Winner
        </text>

        {/* Separator */}
        <line x1="30" y1="70" x2={totalW - 30} y2="70" stroke="#334155" strokeWidth="1" />

        {/* Grid cells */}
        {cells.map((cell, i) => (
          <g key={i}>
            <rect
              x={cell.x}
              y={cell.y}
              width={cellW}
              height={cellH}
              rx="4"
              fill={cell.isTop10 ? cell.color : `${cell.color}30`}
              stroke={cell.isTop10 ? "#f1f5f9" : cell.color}
              strokeWidth={cell.isTop10 ? 2 : 0.5}
              opacity={cell.isTop10 ? 1 : 0.6}
            />
            {cell.isTop10 && (
              <text
                x={cell.x + cellW / 2}
                y={cell.y + cellH / 2 + 4}
                textAnchor="middle"
                fill="#fff"
                fontSize="10"
                fontWeight="700"
                fontFamily="system-ui"
              >
                ★ TOP
              </text>
            )}
          </g>
        ))}

        {/* Legend */}
        {FLOW_GROUPS.map((group, i) => {
          const lx = startX + (i % 3) * ((totalW - 60) / 3);
          const ly = legendY + Math.floor(i / 3) * 22;
          return (
            <g key={group.label}>
              <rect x={lx} y={ly} width="12" height="12" rx="2" fill={group.color} />
              <text x={lx + 18} y={ly + 10} fill="#94a3b8" fontSize="10" fontFamily="system-ui">
                {group.label} ({group.count})
              </text>
            </g>
          );
        })}

        {/* Stats bar */}
        <text x={totalW / 2} y={statsY + 10} textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600" fontFamily="system-ui">
          6 Archetypen · 60 Varianten · Top-10 identifiziert · Systematische A/B-Optimierung
        </text>
      </svg>
    </motion.div>
  );
}
