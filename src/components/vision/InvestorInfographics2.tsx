/**
 * InvestorInfographics2 — Extended infographic set for /investoren
 * Investment gauge, SEO pipeline flow, Tier pyramid, Tranche waterfall, Timeline ribbon
 */
import { motion } from "framer-motion";

// ═══ 1. INVESTMENT GAUGE — Zeigt CHF 80k mit Tranchensplit ═══
export function InvestmentGauge() {
  const tranches = [
    { label: "T1", amount: 20, pct: 25, color: "hsl(0, 72%, 51%)", status: "JETZT" },
    { label: "T2", amount: 25, pct: 31.25, color: "hsl(38, 92%, 50%)", status: "NACH PROOF" },
    { label: "T3", amount: 35, pct: 43.75, color: "hsl(142, 71%, 45%)", status: "BREAK-EVEN" },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Total */}
      <div className="text-center mb-4">
        <span className="text-3xl font-black text-foreground">CHF 80'000</span>
        <p className="text-xs text-muted-foreground mt-1">Gestaffelt in 3 risikolimitierte Tranchen</p>
      </div>

      {/* Stacked bar */}
      <div className="relative h-10 rounded-full overflow-hidden bg-muted/30 border border-border mb-4">
        {tranches.map((t, i) => {
          const left = tranches.slice(0, i).reduce((s, tt) => s + tt.pct, 0);
          return (
            <motion.div
              key={i}
              initial={{ width: 0 }}
              whileInView={{ width: `${t.pct}%` }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="absolute top-0 h-full flex items-center justify-center"
              style={{ left: `${left}%`, backgroundColor: t.color }}
            >
              <span className="text-[10px] font-bold text-white drop-shadow-sm">{t.amount}k</span>
            </motion.div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {tranches.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: t.color }} />
            <span className="text-[10px] font-bold text-foreground">{t.label}</span>
            <span className="text-[9px] text-muted-foreground">{t.status}</span>
          </motion.div>
        ))}
      </div>

      {/* Max risk callout */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-4 text-center"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
          ⛨ Max. Risiko: CHF 20'000 (falls T1 scheitert)
        </span>
      </motion.div>
    </div>
  );
}

// ═══ 2. SEO PIPELINE INFOGRAPHIC — Horizontal flowing pipeline ═══
export function SEOPipelineInfographic() {
  const steps = [
    { icon: "🔍", label: "Scrape", value: "2'110", sub: "Gemeinden" },
    { icon: "🗄️", label: "Enrich", value: "95%", sub: "Automatisiert" },
    { icon: "✍️", label: "Draft", value: "AI", sub: "Generiert" },
    { icon: "✅", label: "QA", value: "Human", sub: "Qualitätskontrolle" },
    { icon: "🌐", label: "Publish", value: "Live", sub: "SEO-optimiert" },
    { icon: "📈", label: "Monitor", value: "24/7", sub: "Rank-Tracking" },
  ];

  const colors = [
    "hsl(217, 91%, 60%)",
    "hsl(263, 70%, 50%)",
    "hsl(38, 92%, 50%)",
    "hsl(142, 71%, 45%)",
    "hsl(0, 72%, 51%)",
    "hsl(188, 78%, 41%)",
  ];

  return (
    <div className="w-full">
      {/* Desktop: flowing pipeline */}
      <div className="hidden md:block">
        <svg viewBox="0 0 800 140" className="w-full h-auto">
          {/* Pipeline tube */}
          <defs>
            <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(217,91%,60%)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(142,71%,45%)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect x="40" y="55" width="720" height="30" rx="15" fill="url(#pipeGrad)" />
          
          {/* Flow arrows */}
          {[0, 1, 2, 3, 4].map(i => (
            <motion.path
              key={`arrow-${i}`}
              d={`M${130 + i * 130} 70 L${155 + i * 130} 70`}
              stroke="hsl(215,20%,65%)"
              strokeWidth="2"
              strokeDasharray="4 3"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              viewport={{ once: true }}
            />
          ))}
          
          {/* Step nodes */}
          {steps.map((step, i) => {
            const x = 70 + i * 130;
            return (
              <motion.g
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <circle cx={x} cy="70" r="24" fill="hsl(222,47%,11%)" stroke={colors[i]} strokeWidth="2.5" />
                <text x={x} y="65" textAnchor="middle" fontSize="16">{step.icon}</text>
                <text x={x} y="80" textAnchor="middle" fontSize="7" fill="white" fontWeight="700">{step.label}</text>
                <text x={x} y="115" textAnchor="middle" fontSize="11" fill={colors[i]} fontWeight="800">{step.value}</text>
                <text x={x} y="130" textAnchor="middle" fontSize="8" fill="hsl(215,20%,65%)">{step.sub}</text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Mobile: vertical pipeline */}
      <div className="md:hidden space-y-0">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 relative"
          >
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="absolute left-[22px] top-[44px] w-0.5 h-4" style={{ backgroundColor: colors[i] + "40" }} />
            )}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center border-2 flex-shrink-0 text-lg"
              style={{ borderColor: colors[i], backgroundColor: colors[i] + "15" }}
            >
              {step.icon}
            </div>
            <div className="flex-1 py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-foreground">{step.label}</span>
                <span className="text-xs font-black" style={{ color: colors[i] }}>{step.value}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{step.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══ 3. TIER PYRAMID — USP pyramid showing 50 features across 3 tiers ═══
export function TierPyramid() {
  const tiers = [
    { label: "TIER 1: Sci-Fi", count: 15, color: "hsl(0, 72%, 51%)", emoji: "🚀", width: 40 },
    { label: "TIER 2: Excellence", count: 20, color: "hsl(38, 92%, 50%)", emoji: "💪", width: 65 },
    { label: "TIER 3: Detail-Liebe", count: 15, color: "hsl(217, 91%, 60%)", emoji: "✨", width: 90 },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            viewport={{ once: true }}
            className="relative rounded-lg border-2 flex items-center justify-between px-4 py-3"
            style={{
              width: `${tier.width}%`,
              borderColor: tier.color + "60",
              backgroundColor: tier.color + "10",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{tier.emoji}</span>
              <span className="text-xs font-bold text-foreground">{tier.label}</span>
            </div>
            <span className="text-sm font-black" style={{ color: tier.color }}>{tier.count}</span>
          </motion.div>
        ))}
      </div>

      {/* Total */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        viewport={{ once: true }}
        className="text-center mt-4"
      >
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-foreground/10 text-foreground">
          = 50 Features die kein Konkurrent hat
        </span>
      </motion.div>
    </div>
  );
}

// ═══ 4. MONTHLY REVENUE TRACKER — Visual milestones ═══
export function MonthlyRevenueTracker() {
  const milestones = [
    { month: "M3", revenue: 500, target: 6000, emoji: "🌱" },
    { month: "M6", revenue: 1800, target: 6000, emoji: "🌿" },
    { month: "M9", revenue: 3200, target: 6000, emoji: "🌳" },
    { month: "M12", revenue: 5000, target: 6000, emoji: "🏔️" },
    { month: "M15", revenue: 6500, target: 6000, emoji: "🚀" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="space-y-3">
        {milestones.map((m, i) => {
          const pct = Math.min((m.revenue / m.target) * 100, 100);
          const isPastTarget = m.revenue >= m.target;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <span className="text-lg w-8">{m.emoji}</span>
              <span className="text-xs font-mono text-muted-foreground w-8">{m.month}</span>
              <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden border border-border relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="h-full rounded-full"
                  style={{
                    background: isPastTarget
                      ? "linear-gradient(90deg, hsl(142,71%,45%), hsl(142,71%,55%))"
                      : "linear-gradient(90deg, hsl(38,92%,50%), hsl(38,92%,60%))",
                  }}
                />
                {/* Target line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-foreground/30"
                  style={{ left: "100%" }}
                />
              </div>
              <span className={`text-xs font-bold w-16 text-right ${isPastTarget ? "text-green-500" : "text-foreground"}`}>
                {new Intl.NumberFormat("de-CH").format(m.revenue)}
              </span>
            </motion.div>
          );
        })}
      </div>
      
      {/* Break-even line label */}
      <div className="flex items-center justify-end mt-2 gap-2">
        <div className="w-4 h-0.5 bg-foreground/30" />
        <span className="text-[10px] text-muted-foreground">Ziel: CHF 6'000/Mt (Break-even)</span>
      </div>
    </div>
  );
}

// ═══ 5. COMPETITIVE MOAT SHIELD — Visualizes defensibility ═══
export function CompetitiveMoatShield() {
  const layers = [
    { label: "2'110 Gemeinde-Seiten", strength: 95, color: "hsl(217, 91%, 60%)" },
    { label: "KI-Pipeline (15h Setup)", strength: 90, color: "hsl(263, 70%, 50%)" },
    { label: "WhatsApp Intake live", strength: 85, color: "hsl(142, 71%, 45%)" },
    { label: "Cross-Sell Warenkörbe", strength: 80, color: "hsl(38, 92%, 50%)" },
    { label: "4-Sprachen Content", strength: 70, color: "hsl(0, 72%, 51%)" },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-2.5">
        {layers.map((layer, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">{layer.label}</span>
              <span className="text-[10px] font-bold" style={{ color: layer.color }}>{layer.strength}%</span>
            </div>
            <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden border border-border">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${layer.strength}%` }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="h-full rounded-full"
                style={{ backgroundColor: layer.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        viewport={{ once: true }}
        className="text-center text-[10px] text-muted-foreground mt-4 italic"
      >
        Kopieraufwand für Konkurrenten: 12–18 Monate + CHF 200k+
      </motion.p>
    </div>
  );
}

// ═══ 6. RISK vs REWARD SCALE — Visual balance ═══
export function RiskRewardScale() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative">
        {/* Fulcrum */}
        <div className="flex justify-center mb-2">
          <div className="w-0.5 h-4 bg-border" />
        </div>
        
        {/* Balance beam */}
        <div className="relative h-1 bg-border rounded-full mb-6">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Risk side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <span className="text-2xl">⚠️</span>
              <p className="text-lg font-black text-destructive mt-1">20–25%</p>
              <p className="text-[10px] text-muted-foreground mt-1">Risiko: Kein profitabler Kern nach 5 Runs</p>
            </div>
            <p className="text-[10px] font-bold text-destructive mt-2">MAX. VERLUST: CHF 20k</p>
          </motion.div>

          {/* Reward side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <span className="text-2xl">🚀</span>
              <p className="text-lg font-black text-primary mt-1">75–80%</p>
              <p className="text-[10px] text-muted-foreground mt-1">Chance: Tragfähiges, skalierbares Modell</p>
            </div>
            <p className="text-[10px] font-bold text-primary mt-2">ZIEL: CHF 6k+/Mt MRR</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
