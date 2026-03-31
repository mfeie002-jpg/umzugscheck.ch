/**
 * SwissCoverageMap — SVG Swiss territory map with coverage layers
 * Self-explanatory infographic with service legend and KPI bubbles
 */
import { motion } from "framer-motion";

// Simplified Switzerland outline path
const SWISS_PATH = "M 120,180 C 100,170 80,155 70,140 C 55,120 50,100 60,85 C 70,70 95,55 120,50 C 140,46 165,42 190,40 C 220,38 250,35 280,38 C 310,42 340,50 365,55 C 390,60 415,70 430,82 C 445,95 455,110 450,130 C 445,145 430,160 410,170 C 390,180 365,188 340,190 C 315,192 290,190 265,188 C 240,186 215,185 190,184 C 165,183 140,185 120,180 Z";

// City positions (approximate on the SVG)
const CITIES = [
  { name: "Zürich", x: 290, y: 90, status: "live" as const },
  { name: "Bern", x: 210, y: 120, status: "live" as const },
  { name: "Basel", x: 220, y: 55, status: "live" as const },
  { name: "Luzern", x: 260, y: 110, status: "building" as const },
  { name: "St. Gallen", x: 340, y: 80, status: "building" as const },
  { name: "Genf", x: 100, y: 160, status: "target" as const },
  { name: "Lausanne", x: 130, y: 145, status: "target" as const },
  { name: "Winterthur", x: 300, y: 70, status: "building" as const },
  { name: "Aarau", x: 245, y: 85, status: "building" as const },
  { name: "Thun", x: 230, y: 140, status: "target" as const },
  { name: "Chur", x: 370, y: 110, status: "target" as const },
  { name: "Lugano", x: 310, y: 175, status: "target" as const },
];

const STATUS_COLORS = {
  live: "#10b981",
  building: "#f59e0b",
  target: "#64748b",
};

const STATUS_LABELS = {
  live: "Live",
  building: "Im Aufbau",
  target: "Zielgebiet",
};

const SERVICES = [
  { label: "Umzug", color: "#008080" },
  { label: "Reinigung", color: "#6366f1" },
  { label: "Räumung", color: "#FF6B1A" },
  { label: "Entsorgung", color: "#ec4899" },
];

export function SwissCoverageMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-slate-950 p-4 md:p-6"
    >
      <svg viewBox="0 0 520 380" className="w-full h-auto" role="img" aria-label="Schweizer Marktabdeckung">
        {/* Title */}
        <text x="260" y="24" textAnchor="middle" fill="#f1f5f9" fontSize="16" fontWeight="800" fontFamily="system-ui">
          Schweizer Marktabdeckung
        </text>
        <text x="260" y="42" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui">
          2'110 Gemeinden · 26 Kantone · 4 Service-Layer
        </text>

        {/* Switzerland outline */}
        <path
          d={SWISS_PATH}
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Network connections between cities */}
        {CITIES.filter(c => c.status === "live").map((city, i) =>
          CITIES.filter(c => c.status === "live" && c.name !== city.name).map((target, j) => (
            <line
              key={`${i}-${j}`}
              x1={city.x} y1={city.y}
              x2={target.x} y2={target.y}
              stroke="#008080"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))
        )}

        {/* Building connections */}
        {CITIES.filter(c => c.status === "building").map((city, i) =>
          CITIES.filter(c => c.status === "live").slice(0, 2).map((target, j) => (
            <line
              key={`b-${i}-${j}`}
              x1={city.x} y1={city.y}
              x2={target.x} y2={target.y}
              stroke="#f59e0b"
              strokeWidth="0.5"
              opacity="0.2"
              strokeDasharray="4,4"
            />
          ))
        )}

        {/* City dots and labels */}
        {CITIES.map((city) => (
          <g key={city.name}>
            {/* Pulse ring for live */}
            {city.status === "live" && (
              <circle cx={city.x} cy={city.y} r="10" fill={STATUS_COLORS[city.status]} opacity="0.15">
                <animate attributeName="r" values="8;14;8" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={city.x}
              cy={city.y}
              r={city.status === "live" ? 5 : city.status === "building" ? 4 : 3}
              fill={STATUS_COLORS[city.status]}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            <text
              x={city.x}
              y={city.y - 9}
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="8"
              fontWeight="600"
              fontFamily="system-ui"
            >
              {city.name}
            </text>
          </g>
        ))}

        {/* KPI Bubbles */}
        {[
          { x: 80, y: 240, value: "2'110", label: "Gemeinden", color: "#008080" },
          { x: 260, y: 240, value: "4", label: "Service-Kategorien", color: "#FF6B1A" },
          { x: 440, y: 240, value: "26", label: "Kantone", color: "#6366f1" },
        ].map((kpi) => (
          <g key={kpi.label}>
            <circle cx={kpi.x} cy={kpi.y} r="28" fill={`${kpi.color}20`} stroke={kpi.color} strokeWidth="1.5" />
            <text x={kpi.x} y={kpi.y - 2} textAnchor="middle" fill="#f1f5f9" fontSize="14" fontWeight="800" fontFamily="system-ui">
              {kpi.value}
            </text>
            <text x={kpi.x} y={kpi.y + 12} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="system-ui">
              {kpi.label}
            </text>
          </g>
        ))}

        {/* Status Legend */}
        {(Object.entries(STATUS_LABELS) as [keyof typeof STATUS_COLORS, string][]).map(([key, label], i) => (
          <g key={key}>
            <circle cx={120 + i * 130} cy={300} r="5" fill={STATUS_COLORS[key]} />
            <text x={130 + i * 130} y={304} fill="#94a3b8" fontSize="9" fontFamily="system-ui">
              {label}
            </text>
          </g>
        ))}

        {/* Service Layer Legend */}
        {SERVICES.map((svc, i) => (
          <g key={svc.label}>
            <rect x={80 + i * 110} y={325} width="10" height="10" rx="2" fill={svc.color} />
            <text x={95 + i * 110} y={334} fill="#94a3b8" fontSize="9" fontFamily="system-ui">
              {svc.label}
            </text>
          </g>
        ))}

        {/* Bottom text */}
        <text x="260" y="365" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="system-ui" fontStyle="italic">
          Das ist kein einzelnes Produkt — das ist eine landesweite Abdeckungsstrategie.
        </text>
      </svg>
    </motion.div>
  );
}
