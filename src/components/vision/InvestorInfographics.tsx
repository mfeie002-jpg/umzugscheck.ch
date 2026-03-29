/**
 * InvestorInfographics — SVG-basierte Infografik-Elemente für /investoren
 * Flywheel, Funnel Flow, Market Bubbles, Revenue Waterfall, 5-Run Progress
 */
import { motion } from "framer-motion";

// ═══ 1. PLATFORM FLYWHEEL — Zeigt den Kreislauf der Plattform ═══
export function PlatformFlywheel() {
  const segments = [
    { label: "SEO Traffic", emoji: "🔍", angle: 0, color: "hsl(217, 91%, 60%)" },
    { label: "Lead Capture", emoji: "📋", angle: 60, color: "hsl(142, 71%, 45%)" },
    { label: "KI Matching", emoji: "🤖", angle: 120, color: "hsl(263, 70%, 50%)" },
    { label: "Offerte", emoji: "💰", angle: 180, color: "hsl(38, 92%, 50%)" },
    { label: "Cross-Sell", emoji: "🔄", angle: 240, color: "hsl(188, 78%, 41%)" },
    { label: "Daten & SEO", emoji: "📊", angle: 300, color: "hsl(0, 72%, 51%)" },
  ];

  const cx = 160, cy = 160, r = 110;

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 320 320" className="w-full max-w-[320px] h-auto">
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={r + 20} fill="none" stroke="hsl(217,33%,17%)" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Arrows between segments */}
        {segments.map((_, i) => {
          const a1 = (segments[i].angle - 90) * Math.PI / 180;
          const a2 = (segments[(i + 1) % 6].angle - 90) * Math.PI / 180;
          const midAngle = (a1 + a2) / 2;
          const arrowR = r + 15;
          const ax = cx + Math.cos(midAngle) * arrowR;
          const ay = cy + Math.sin(midAngle) * arrowR;
          return (
            <motion.g key={`arrow-${i}`} initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }} transition={{ delay: i * 0.1 }}>
              <text x={ax} y={ay} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="hsl(215,20%,65%)">→</text>
            </motion.g>
          );
        })}

        {/* Center label */}
        <circle cx={cx} cy={cy} r="35" fill="hsl(0, 72%, 51%)" opacity="0.15" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9" fontWeight="bold" fill="hsl(0, 72%, 51%)">FLYWHEEL</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="7" fill="hsl(215,20%,65%)">Selbstverstärkend</text>

        {/* Segment nodes */}
        {segments.map((seg, i) => {
          const angle = (seg.angle - 90) * Math.PI / 180;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}
            >
              <circle cx={x} cy={y} r="28" fill="hsl(222,47%,11%)" stroke={seg.color} strokeWidth="2" />
              <text x={x} y={y - 5} textAnchor="middle" fontSize="14">{seg.emoji}</text>
              <text x={x} y={y + 10} textAnchor="middle" fontSize="6.5" fill="white" fontWeight="600">{seg.label}</text>
            </motion.g>
          );
        })}

        {/* Connecting lines */}
        {segments.map((seg, i) => {
          const a1 = (seg.angle - 90) * Math.PI / 180;
          const next = segments[(i + 1) % 6];
          const a2 = (next.angle - 90) * Math.PI / 180;
          const x1 = cx + Math.cos(a1) * (r - 28);
          const y1 = cy + Math.sin(a1) * (r - 28);
          const x2 = cx + Math.cos(a2) * (r - 28);
          const y2 = cy + Math.sin(a2) * (r - 28);
          return (
            <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={seg.color} strokeWidth="0.5" opacity="0.3" />
          );
        })}
      </svg>
    </div>
  );
}

// ═══ 2. FUNNEL FLOW — Google → WhatsApp → KI → Offerte ═══
export function FunnelFlowDiagram() {
  const steps = [
    { emoji: "🔍", label: "Google Suche", sub: "Organisch + Ads", width: 100, color: "hsl(217, 91%, 60%)" },
    { emoji: "📱", label: "Landing Page", sub: "Conversion-optimiert", width: 88, color: "hsl(142, 71%, 45%)" },
    { emoji: "💬", label: "WhatsApp Chat", sub: "KI-Intake", width: 76, color: "hsl(38, 92%, 50%)" },
    { emoji: "🤖", label: "KI Matching", sub: "Auto-Qualifizierung", width: 64, color: "hsl(263, 70%, 50%)" },
    { emoji: "💰", label: "Offerte", sub: "Bindend & transparent", width: 52, color: "hsl(0, 72%, 51%)" },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex flex-col items-center gap-0">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            {/* Funnel bar */}
            <div
              className="flex items-center justify-center gap-2 py-3 rounded-lg border text-center mx-auto"
              style={{
                width: `${step.width}%`,
                backgroundColor: `${step.color}15`,
                borderColor: `${step.color}40`,
              }}
            >
              <span className="text-lg">{step.emoji}</span>
              <div className="text-left">
                <div className="text-xs font-bold text-white">{step.label}</div>
                <div className="text-[10px] text-slate-400">{step.sub}</div>
              </div>
            </div>
            {/* Arrow down */}
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <svg width="20" height="16" viewBox="0 0 20 16">
                  <path d="M10 16L0 0h20z" fill={step.color} opacity="0.4" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {/* Conversion label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-4"
      >
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: "hsl(0,72%,51%,0.15)", color: "hsl(0,72%,51%)" }}>
          100% automatisiert · 0 manueller Aufwand
        </span>
      </motion.div>
    </div>
  );
}

// ═══ 3. MARKET BUBBLE PROPORTIONS ═══
export function MarketBubbles() {
  const bubbles = [
    { label: "TAM", value: "CHF 1B+", size: 120, color: "hsl(217, 91%, 60%)", sub: "Gesamtmarkt" },
    { label: "SAM", value: "165k", size: 85, color: "hsl(142, 71%, 45%)", sub: "Prof. Umzüge" },
    { label: "SOM Y1", value: "3'200", size: 50, color: "hsl(0, 72%, 51%)", sub: "2% Share" },
  ];

  return (
    <div className="flex items-end justify-center gap-6 py-4">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center"
        >
          <div
            className="rounded-full flex flex-col items-center justify-center border-2"
            style={{
              width: b.size,
              height: b.size,
              backgroundColor: `${b.color}15`,
              borderColor: `${b.color}50`,
            }}
          >
            <span className="text-xs font-black text-white">{b.value}</span>
            <span className="text-[8px] text-slate-400 mt-0.5">{b.label}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2">{b.sub}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ═══ 4. REVENUE WATERFALL ═══
export function RevenueWaterfall() {
  const items = [
    { label: "Umzug", value: 225, cumulative: 225 },
    { label: "Affiliate", value: 100, cumulative: 325 },
    { label: "Versich.", value: 99, cumulative: 424 },
    { label: "Circular", value: 50, cumulative: 474 },
    { label: "Büro.", value: 49, cumulative: 523 },
    { label: "Escrow", value: 30, cumulative: 553 },
  ];
  const max = 553;
  const colors = ["hsl(217,91%,60%)", "hsl(142,71%,45%)", "hsl(263,70%,50%)", "hsl(38,92%,50%)", "hsl(188,78%,41%)", "hsl(239,84%,67%)"];

  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5 h-[200px] justify-center">
        {items.map((item, i) => {
          const heightPct = (item.value / max) * 100;
          const bottomPct = ((item.cumulative - item.value) / max) * 100;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ originY: 1 }}
              className="flex flex-col items-center relative"
            >
              {/* Value label */}
              <span className="text-[10px] font-bold text-white mb-1">+{item.value}</span>
              {/* Bar */}
              <div className="relative w-10 sm:w-12" style={{ height: "160px" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-md"
                  style={{
                    height: `${heightPct}%`,
                    bottom: `${bottomPct}%`,
                    backgroundColor: colors[i],
                    opacity: 0.85,
                  }}
                />
              </div>
              {/* Label */}
              <span className="text-[9px] text-slate-400 mt-1.5 text-center leading-tight">{item.label}</span>
            </motion.div>
          );
        })}
        {/* Total */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.7 }}
          style={{ originY: 1 }}
          className="flex flex-col items-center ml-2"
        >
          <span className="text-xs font-black text-white mb-1">= 553</span>
          <div className="relative w-12 sm:w-14" style={{ height: "160px" }}>
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t-md border-2"
              style={{
                height: "100%",
                background: "linear-gradient(to top, hsl(0,72%,51%,0.3), hsl(0,72%,51%,0.05))",
                borderColor: "hsl(0,72%,51%,0.5)",
              }}
            />
          </div>
          <span className="text-[9px] font-bold text-white mt-1.5">CHF Total</span>
        </motion.div>
      </div>
    </div>
  );
}

// ═══ 5. FIVE-RUN PROGRESS VISUAL ═══
export function FiveRunProgress() {
  const runs = [
    { run: 1, chance: 15, label: "Baseline", color: "hsl(0, 84%, 60%)" },
    { run: 2, chance: 40, label: "Fix & Learn", color: "hsl(38, 92%, 50%)" },
    { run: 3, chance: 60, label: "Stabilize", color: "hsl(38, 92%, 50%)" },
    { run: 4, chance: 73, label: "Scale", color: "hsl(142, 71%, 45%)" },
    { run: 5, chance: 78, label: "Urteil", color: "hsl(142, 71%, 45%)" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-end gap-3 justify-center h-[180px]">
        {runs.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: i * 0.12 }}
            style={{ originY: 1 }}
            className="flex flex-col items-center flex-1"
          >
            <span className="text-[10px] font-bold mb-1" style={{ color: r.color }}>{r.chance}%</span>
            <div className="w-full relative" style={{ height: "130px" }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-lg"
                style={{
                  height: `${(r.chance / 80) * 100}%`,
                  background: `linear-gradient(to top, ${r.color}, ${r.color}40)`,
                }}
              />
            </div>
            <div className="mt-2 text-center">
              <div className="text-[10px] font-bold text-foreground">Run {r.run}</div>
              <div className="text-[8px] text-muted-foreground">{r.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(0, 84%, 60%)" }} />
          <span className="text-[10px] text-muted-foreground">Hohes Risiko</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(38, 92%, 50%)" }} />
          <span className="text-[10px] text-muted-foreground">Wendepunkt</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(142, 71%, 45%)" }} />
          <span className="text-[10px] text-muted-foreground">Tragfähig</span>
        </div>
      </div>
    </div>
  );
}

// ═══ 6. CROSS-SELL SERVICE CHAIN ═══
export function ServiceChainInfographic() {
  const services = [
    { emoji: "🏠", label: "Umzug", value: "CHF 1'500", primary: true },
    { emoji: "🧹", label: "Reinigung", value: "+CHF 800" },
    { emoji: "📦", label: "Entsorgung", value: "+CHF 400" },
    { emoji: "🔒", label: "Lagerung", value: "+CHF 200/Mt" },
    { emoji: "📮", label: "Ummeldung", value: "+CHF 49" },
    { emoji: "🛡️", label: "Versicherung", value: "+CHF 99" },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-[600px] justify-center">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center"
          >
            <div className={`flex flex-col items-center px-3 py-3 rounded-xl border ${
              s.primary
                ? "bg-primary/10 border-primary/30"
                : "bg-card border-border/50"
            }`}>
              <span className="text-2xl mb-1">{s.emoji}</span>
              <span className="text-xs font-bold text-foreground">{s.label}</span>
              <span className={`text-[10px] font-semibold mt-0.5 ${s.primary ? "text-primary" : "text-muted-foreground"}`}>{s.value}</span>
            </div>
            {i < services.length - 1 && (
              <div className="px-1">
                <svg width="20" height="12" viewBox="0 0 20 12">
                  <path d="M0 6h14M14 6l-4-4M14 6l-4 4" stroke="hsl(0,72%,51%)" strokeWidth="1.5" fill="none" opacity="0.5" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-3"
      >
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
          Ø AOV: CHF 2'389 → mit Cross-Sell: CHF 3'048+
        </span>
      </motion.div>
    </div>
  );
}

// ═══ 7. DIGITAL GAP VISUAL (filled vs empty circles) ═══
export function DigitalGapVisual() {
  const gaps = [
    { label: "Echtzeit-Buchung", filled: 0, total: 5 },
    { label: "Gemeinde-Daten", filled: 0, total: 5 },
    { label: "4-Sprachen", filled: 1, total: 5 },
    { label: "App/Mobile", filled: 0, total: 5 },
    { label: "Digitale Zahlung", filled: 1, total: 5 },
  ];

  return (
    <div className="space-y-3">
      {gaps.map((gap, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center gap-3"
        >
          <span className="text-xs text-slate-300 w-28 text-right font-medium">{gap.label}</span>
          <div className="flex gap-1">
            {Array.from({ length: gap.total }).map((_, j) => (
              <div
                key={j}
                className="w-4 h-4 rounded-full border"
                style={{
                  backgroundColor: j < gap.filled ? "hsl(38, 92%, 50%)" : "transparent",
                  borderColor: j < gap.filled ? "hsl(38, 92%, 50%)" : "hsl(217,33%,25%)",
                }}
              />
            ))}
          </div>
          <span className="text-[10px] text-red-400 font-semibold">{gap.filled}/{gap.total} abgedeckt</span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-800"
      >
        <span className="text-xs text-slate-300 w-28 text-right font-bold">Umzugscheck</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
          ))}
        </div>
        <span className="text-[10px] text-green-400 font-bold">5/5 ✓</span>
      </motion.div>
    </div>
  );
}
