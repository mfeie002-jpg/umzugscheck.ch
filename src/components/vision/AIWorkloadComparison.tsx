/**
 * AIWorkloadComparison — Before/After process infographic
 * Traditional manual workflow vs Umzugscheck AI-driven workflow
 * Pure SVG, all labels embedded
 */
import { motion } from "framer-motion";

const TEAL = "#008080";
const ORANGE = "#FF6B1A";
const DARK = "#0F172A";
const RED = "#EF4444";
const GREEN = "#10B981";
const WHITE = "#FFFFFF";

const traditionalSteps = [
  "Anfrage lesen",
  "Rückfragen stellen",
  "Inventar aufnehmen",
  "Preis kalkulieren",
  "Offerte schreiben",
  "Nachfassen",
  "Koordination",
  "Bestätigung",
  "Abrechnung",
  "Nachbearbeitung",
];

const aiSteps = [
  { label: "WhatsApp Intake", type: "ai" as const },
  { label: "KI qualifiziert", type: "ai" as const },
  { label: "OpenClaw verarbeitet", type: "ai" as const },
  { label: "Mensch prüft ✓", type: "human" as const },
];

export function AIWorkloadComparison() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
            Was «95% KI» wirklich bedeutet
          </h3>
          <p className="text-muted-foreground text-sm">
            Nicht Buzzword — messbarer Workload-Shift.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <svg viewBox="0 0 800 420" className="w-full h-auto" role="img" aria-label="Vergleich: 10 manuelle Schritte traditionell vs. 4 Schritte mit KI-Automatisierung">
            <rect x="0" y="0" width="800" height="420" rx="14" fill={DARK} />

            {/* Title */}
            <text x="400" y="30" textAnchor="middle" fill={WHITE} fontSize="14" fontWeight="800" letterSpacing="1">
              WORKFLOW-VERGLEICH: TRADITIONELL vs. UMZUGSCHECK
            </text>

            {/* LEFT: Traditional */}
            <g>
              <rect x="30" y="50" width="350" height="35" rx="8" fill={RED} opacity="0.2" />
              <text x="205" y="73" textAnchor="middle" fill={RED} fontSize="12" fontWeight="800">
                ❌ TRADITIONELL — 10 MANUELLE SCHRITTE
              </text>

              {traditionalSteps.map((step, i) => {
                const y = 100 + i * 28;
                return (
                  <g key={step}>
                    <rect x="40" y={y} width="330" height="22" rx="4" fill={RED} opacity={0.15 + i * 0.02} />
                    <circle cx="55" cy={y + 11} r="4" fill={RED} opacity="0.6" />
                    <text x="68" y={y + 15} fill="#CBD5E1" fontSize="10">
                      {i + 1}. {step}
                    </text>
                    <text x="355" y={y + 15} textAnchor="end" fill={RED} fontSize="8" opacity="0.6">
                      manuell
                    </text>
                  </g>
                );
              })}

              {/* Time label */}
              <text x="205" y="395" textAnchor="middle" fill={RED} fontSize="11" fontWeight="700">
                ⏱ 45-90 Min. pro Anfrage
              </text>
            </g>

            {/* RIGHT: Umzugscheck */}
            <g>
              <rect x="420" y="50" width="350" height="35" rx="8" fill={GREEN} opacity="0.2" />
              <text x="595" y="73" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="800">
                ✅ UMZUGSCHECK — 4 TOUCHPOINTS
              </text>

              {aiSteps.map((step, i) => {
                const y = 100 + i * 55;
                const isAI = step.type === "ai";
                const color = isAI ? TEAL : ORANGE;
                return (
                  <g key={step.label}>
                    <rect x="430" y={y} width="330" height="40" rx="8" fill={color} opacity="0.2" stroke={color} strokeWidth="1" />
                    <circle cx="450" cy={y + 20} r="8" fill={color} opacity="0.8" />
                    <text x="455" y={y + 23} fill={WHITE} fontSize="8" fontWeight="800" textAnchor="middle">
                      {isAI ? "KI" : "👤"}
                    </text>
                    <text x="470" y={y + 24} fill={WHITE} fontSize="11" fontWeight="600">
                      {step.label}
                    </text>
                    <text x="745" y={y + 24} textAnchor="end" fill={color} fontSize="9" fontWeight="600">
                      {isAI ? "automatisch" : "finale Prüfung"}
                    </text>
                  </g>
                );
              })}

              {/* Time label */}
              <text x="595" y="340" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="700">
                ⏱ 2-5 Min. pro Anfrage
              </text>

              {/* Donut chart */}
              <g transform="translate(595, 378)">
                {/* AI portion: 80% = 288deg */}
                <circle cx="0" cy="0" r="22" fill="none" stroke="#1E293B" strokeWidth="8" />
                <circle cx="0" cy="0" r="22" fill="none" stroke={TEAL} strokeWidth="8"
                  strokeDasharray="110 138" strokeDashoffset="34.5" />
                <circle cx="0" cy="0" r="22" fill="none" stroke={ORANGE} strokeWidth="8"
                  strokeDasharray="27.5 220.5" strokeDashoffset="145" />
                <text x="0" y="3" textAnchor="middle" fill={WHITE} fontSize="8" fontWeight="800">80/20</text>
              </g>
              <text x="530" y="382" fill={TEAL} fontSize="8" fontWeight="600">● 80% KI</text>
              <text x="640" y="382" fill={ORANGE} fontSize="8" fontWeight="600">● 20% Mensch</text>
            </g>

            {/* Center divider */}
            <line x1="400" y1="50" x2="400" y2="410" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
            <text x="400" y="415" textAnchor="middle" fill="#475569" fontSize="9">vs.</text>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
