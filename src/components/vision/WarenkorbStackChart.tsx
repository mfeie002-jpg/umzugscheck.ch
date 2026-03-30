/**
 * WarenkorbStackChart — Visual "Build Your Order" AOV infographic
 * Shows stacked services building up lead value
 * Pure SVG, self-explanatory with all labels embedded
 */
import { motion } from "framer-motion";

const TEAL = "#008080";
const ORANGE = "#FF6B1A";
const DARK = "#0F172A";
const WHITE = "#FFFFFF";

const services = [
  { label: "Basis-Umzug (3 Zi.)", price: 1650, color: TEAL, width: 62 },
  { label: "Endreinigung", price: 450, color: "#0EA5E9", width: 17 },
  { label: "Räumung/Entsorgung", price: 300, color: "#8B5CF6", width: 11 },
  { label: "Packservice & Kartons", price: 260, color: ORANGE, width: 10 },
];

const total = services.reduce((s, sv) => s + sv.price, 0);

export function WarenkorbStackChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto"
    >
      <svg viewBox="0 0 720 380" className="w-full h-auto" role="img" aria-label="Modularer Warenkorb: Ein Lead generiert CHF 2660 durch Cross-Selling">
        <rect x="0" y="0" width="720" height="380" rx="14" fill={DARK} />
        
        {/* Title */}
        <text x="360" y="32" textAnchor="middle" fill={WHITE} fontSize="15" fontWeight="800">
          MODULARER WARENKORB — AOV PRO LEAD
        </text>
        <text x="360" y="50" textAnchor="middle" fill="#94A3B8" fontSize="10">
          Jeder Umzugslead ist der Einstieg in eine Service-Kette
        </text>

        {/* LEFT SIDE: Stacked services */}
        {services.map((svc, i) => {
          const y = 75 + i * 68;
          return (
            <g key={svc.label}>
              {/* Service bar */}
              <rect x="30" y={y} width={svc.width * 3.6} height="48" rx="8" fill={svc.color} opacity="0.85" />
              <text x="45" y={y + 22} fill={WHITE} fontSize="11" fontWeight="700">{svc.label}</text>
              <text x="45" y={y + 38} fill={WHITE} fontSize="10" opacity="0.7">
                CHF {svc.price.toLocaleString("de-CH")}
              </text>
              
              {/* Plus sign between items */}
              {i < services.length - 1 && (
                <text x="15" y={y + 62} fill="#64748B" fontSize="16" fontWeight="700">+</text>
              )}
              
              {/* Running total arrow */}
              <line x1={svc.width * 3.6 + 40} y1={y + 24} x2="420" y2={y + 24} stroke={svc.color} strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
            </g>
          );
        })}

        {/* Equals line */}
        <line x1="30" y1="352" x2="250" y2="352" stroke={ORANGE} strokeWidth="2" />

        {/* RIGHT SIDE: Growing value bar */}
        <g>
          <text x="570" y="78" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600" letterSpacing="1.5">
            LEAD-WERT
          </text>
          
          {/* Value bar background */}
          <rect x="500" y="90" width="140" height="230" rx="10" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          
          {/* Filled portions (bottom-up) */}
          {(() => {
            let cumY = 320;
            return services.map((svc, i) => {
              const height = (svc.price / total) * 220;
              cumY -= height;
              return (
                <g key={`bar-${i}`}>
                  <rect x="505" y={cumY} width="130" height={height - 2} rx={i === services.length - 1 ? 8 : 2} fill={svc.color} opacity="0.8" />
                  <text x="570" y={cumY + height / 2 + 4} textAnchor="middle" fill={WHITE} fontSize="9" fontWeight="600">
                    CHF {svc.price.toLocaleString("de-CH")}
                  </text>
                </g>
              );
            });
          })()}
          
          {/* Total */}
          <rect x="480" y="330" width="180" height="40" rx="10" fill={ORANGE} />
          <text x="570" y="350" textAnchor="middle" fill={WHITE} fontSize="13" fontWeight="800">
            = CHF {total.toLocaleString("de-CH")} AOV
          </text>
          <text x="570" y="364" textAnchor="middle" fill={WHITE} fontSize="9" opacity="0.8">
            pro qualifizierten Lead
          </text>
        </g>

        {/* Arrow label */}
        <g>
          <text x="360" y="355" textAnchor="middle" fill={ORANGE} fontSize="20" fontWeight="800">→</text>
          <text x="360" y="372" textAnchor="middle" fill="#94A3B8" fontSize="8">CROSS-SELL</text>
        </g>

        {/* Bottom note */}
        <text x="200" y="372" textAnchor="middle" fill="#64748B" fontSize="8">
          Verkauft an 3-5 Firmen · CPL sinkt auf CHF 40-70
        </text>
      </svg>
    </motion.div>
  );
}
