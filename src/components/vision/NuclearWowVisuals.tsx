/**
 * NuclearWowVisuals — 7 SVG mini-illustrations for the Top-7 Nuclear Wow cards
 * Each is a self-explanatory visual replacing simple icons
 */

// 1. Swiss map with moving arrows — "Ein Markt, der nie weggeht"
export function SwissMovingArrows() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-auto" role="img" aria-label="Schweizer Umzugsmarkt">
      <path d="M40,60 C30,50 25,40 30,30 C35,22 50,16 65,14 C80,12 100,10 120,12 C140,14 155,20 165,28 C175,36 178,48 175,58 C172,68 162,76 150,80 C138,84 120,86 100,85 C80,84 60,82 48,78 C36,74 30,70 40,60 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
      {/* Moving arrows */}
      <line x1="60" y1="40" x2="100" y2="55" stroke="#008080" strokeWidth="1.5" markerEnd="url(#arrowT)" />
      <line x1="140" y1="35" x2="110" y2="50" stroke="#008080" strokeWidth="1.5" markerEnd="url(#arrowT)" />
      <line x1="80" y1="70" x2="130" y2="45" stroke="#FF6B1A" strokeWidth="1.5" markerEnd="url(#arrowT)" />
      <line x1="150" y1="65" x2="90" y2="55" stroke="#FF6B1A" strokeWidth="1.5" markerEnd="url(#arrowT)" />
      <defs>
        <marker id="arrowT" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="#008080" />
        </marker>
      </defs>
      {/* Dots for cities */}
      {[[70,38],[100,50],[130,40],[90,65],[150,60]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#008080" stroke="#0f172a" strokeWidth="1" />
      ))}
      <text x="100" y="100" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="system-ui">
        Menschen ziehen immer um
      </text>
      <text x="100" y="112" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="system-ui" fontStyle="italic">
        ~450'000 Umzüge/Jahr in der Schweiz
      </text>
    </svg>
  );
}

// 2. Box with services growing out — "Der Umzug ist nur der Anfang"
export function ServiceGrowthBox() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-auto" role="img" aria-label="Service-Kette">
      {/* Main moving box */}
      <rect x="60" y="55" width="80" height="50" rx="4" fill="#1e293b" stroke="#008080" strokeWidth="2" />
      <text x="100" y="84" textAnchor="middle" fill="#008080" fontSize="9" fontWeight="700" fontFamily="system-ui">UMZUG</text>
      {/* Growing services */}
      {[
        { x: 30, y: 40, label: "Reinigung", color: "#6366f1" },
        { x: 75, y: 18, label: "Räumung", color: "#FF6B1A" },
        { x: 125, y: 18, label: "Lagerung", color: "#f59e0b" },
        { x: 170, y: 40, label: "Montage", color: "#ec4899" },
        { x: 50, y: 15, label: "Kartons", color: "#10b981" },
        { x: 150, y: 15, label: "Entsorgung", color: "#8b5cf6" },
      ].map((svc, i) => (
        <g key={i}>
          <line x1="100" y1="55" x2={svc.x} y2={svc.y + 10} stroke={svc.color} strokeWidth="1" opacity="0.5" strokeDasharray="3,2" />
          <rect x={svc.x - 22} y={svc.y} width="44" height="16" rx="3" fill={`${svc.color}25`} stroke={svc.color} strokeWidth="1" />
          <text x={svc.x} y={svc.y + 11} textAnchor="middle" fill={svc.color} fontSize="6" fontWeight="600" fontFamily="system-ui">{svc.label}</text>
        </g>
      ))}
      <text x="100" y="120" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="system-ui">
        1 Lead → 6+ Services → höherer Kundenwert
      </text>
    </svg>
  );
}

// 3. SERP view with Umzugscheck dominant — "SEO kontrolliert Eingang"
export function SERPDominance() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-auto" role="img" aria-label="SEO Dominanz">
      {/* Browser frame */}
      <rect x="20" y="10" width="160" height="100" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <rect x="20" y="10" width="160" height="16" rx="6" fill="#1e293b" />
      <circle cx="30" cy="18" r="3" fill="#ef4444" />
      <circle cx="38" cy="18" r="3" fill="#f59e0b" />
      <circle cx="46" cy="18" r="3" fill="#10b981" />
      {/* Search bar */}
      <rect x="55" y="14" width="100" height="8" rx="3" fill="#334155" />
      <text x="62" y="21" fill="#64748b" fontSize="5" fontFamily="system-ui">umzugsfirma zürich vergleich</text>
      {/* Search results */}
      <rect x="28" y="32" width="144" height="22" rx="3" fill="#008080" fillOpacity="0.2" stroke="#008080" strokeWidth="1.5" />
      <text x="34" y="41" fill="#008080" fontSize="7" fontWeight="800" fontFamily="system-ui">🏆 umzugscheck.ch — #1</text>
      <text x="34" y="50" fill="#64748b" fontSize="5" fontFamily="system-ui">Kostenlos Offerten vergleichen · 5★ · Sofort</text>
      
      {[58, 78].map((y, i) => (
        <g key={i}>
          <rect x="28" y={y} width="144" height="14" rx="2" fill="#1e293b" />
          <rect x="34" y={y + 3} width={70 - i * 10} height="3" rx="1" fill="#334155" />
          <rect x="34" y={y + 8} width={90 - i * 15} height="2" rx="1" fill="#1e293b" />
        </g>
      ))}
      <text x="100" y="115" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="system-ui">
        Wer Position 1 hat, kontrolliert den Markt-Eingang
      </text>
    </svg>
  );
}

// 4. Municipality network on Swiss silhouette — "Wir kartieren den Markt"
export function MunicipalityNetwork() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-auto" role="img" aria-label="Gemeinde-Netzwerk">
      <path d="M40,55 C32,48 28,38 32,28 C36,20 50,14 65,12 C80,10 100,8 120,10 C140,12 155,18 165,26 C175,34 178,44 175,54 C172,64 162,72 150,76 C138,80 120,82 100,81 C80,80 60,78 48,74 C36,70 32,64 40,55 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Network nodes */}
      {[[55,35],[70,25],[90,40],[110,30],[130,35],[150,40],[80,55],[100,50],[120,55],[140,55],[95,20],[60,50],[135,25]].map(([x,y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.5" fill={i < 5 ? "#008080" : i < 9 ? "#f59e0b" : "#475569"} />
        </g>
      ))}
      {/* Some connections */}
      {[[55,35,90,40],[90,40,110,30],[110,30,130,35],[130,35,150,40],[80,55,100,50],[100,50,120,55],[70,25,95,20],[95,20,135,25]].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#008080" strokeWidth="0.5" opacity="0.4" />
      ))}
      <text x="100" y="92" textAnchor="middle" fill="#f1f5f9" fontSize="10" fontWeight="700" fontFamily="system-ui">
        2'110 Gemeinden
      </text>
      <text x="100" y="104" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="system-ui">
        Jede Gemeinde = eigener Hub mit lokalen Daten
      </text>
      <text x="100" y="115" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="system-ui" fontStyle="italic">
        Andere bauen Websites. Wir bauen eine Landkarte.
      </text>
    </svg>
  );
}

// 5. Human + AI modules — "95% KI skalierbar"
export function HumanAIModules() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-auto" role="img" aria-label="KI-Skalierung">
      {/* Human figure (simple) */}
      <circle cx="45" cy="30" r="10" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
      <text cx="45" y="34" textAnchor="middle" fill="#f1f5f9" fontSize="8" x="45" fontFamily="system-ui">👤</text>
      <text x="45" y="55" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="600" fontFamily="system-ui">Mensch</text>
      <text x="45" y="64" textAnchor="middle" fill="#64748b" fontSize="5.5" fontFamily="system-ui">Strategie</text>
      <text x="45" y="72" textAnchor="middle" fill="#64748b" fontSize="5.5" fontFamily="system-ui">Qualität</text>
      <text x="45" y="80" textAnchor="middle" fill="#64748b" fontSize="5.5" fontFamily="system-ui">Freigabe</text>

      {/* Arrow */}
      <line x1="70" y1="45" x2="85" y2="45" stroke="#475569" strokeWidth="1.5" markerEnd="url(#aiArrow)" />
      <defs>
        <marker id="aiArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="#475569" />
        </marker>
      </defs>

      {/* AI Modules grid */}
      {[
        { x: 95, y: 15, label: "Content", color: "#008080" },
        { x: 145, y: 15, label: "CRM", color: "#6366f1" },
        { x: 95, y: 40, label: "Chat/WA", color: "#25D366" },
        { x: 145, y: 40, label: "Analyse", color: "#f59e0b" },
        { x: 95, y: 65, label: "Offerten", color: "#FF6B1A" },
        { x: 145, y: 65, label: "SEO", color: "#ec4899" },
      ].map((mod, i) => (
        <g key={i}>
          <rect x={mod.x} y={mod.y} width="42" height="20" rx="4" fill={`${mod.color}20`} stroke={mod.color} strokeWidth="1" />
          <text x={mod.x + 21} y={mod.y + 13} textAnchor="middle" fill={mod.color} fontSize="6.5" fontWeight="600" fontFamily="system-ui">
            🤖 {mod.label}
          </text>
        </g>
      ))}

      {/* Donut */}
      <circle cx="185" cy="45" r="16" fill="none" stroke="#334155" strokeWidth="5" />
      <circle cx="185" cy="45" r="16" fill="none" stroke="#008080" strokeWidth="5" strokeDasharray="95.5 100.5" strokeDashoffset="0" transform="rotate(-90 185 45)" />
      <text x="185" y="43" textAnchor="middle" fill="#f1f5f9" fontSize="7" fontWeight="800" fontFamily="system-ui">95%</text>
      <text x="185" y="51" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="system-ui">KI</text>

      <text x="100" y="100" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="system-ui">
        Mensch steuert. KI multipliziert.
      </text>
      <text x="100" y="112" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="system-ui" fontStyle="italic">
        Mehr Output. Weniger Flaschenhals.
      </text>
    </svg>
  );
}

// 6. Google→WhatsApp→Offerte flow — "Von Google zur Offerte"
export function GoogleToOfferFlow() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-auto" role="img" aria-label="Automatisierter Kundenflow">
      {/* Step boxes */}
      {[
        { x: 10, label: "Google", sub: "SEO / Ads", color: "#4285f4", emoji: "🔍" },
        { x: 55, label: "Landing", sub: "Funnel", color: "#008080", emoji: "📄" },
        { x: 100, label: "WhatsApp", sub: "Chat/Katalog", color: "#25D366", emoji: "💬" },
        { x: 145, label: "Offerte", sub: "Automatisch", color: "#FF6B1A", emoji: "📋" },
      ].map((step, i) => (
        <g key={i}>
          <rect x={step.x} y="20" width="40" height="40" rx="6" fill={`${step.color}15`} stroke={step.color} strokeWidth="1.5" />
          <text x={step.x + 20} y="36" textAnchor="middle" fontSize="12">{step.emoji}</text>
          <text x={step.x + 20} y="50" textAnchor="middle" fill={step.color} fontSize="6.5" fontWeight="700" fontFamily="system-ui">{step.label}</text>
          <text x={step.x + 20} y="72" textAnchor="middle" fill="#64748b" fontSize="5.5" fontFamily="system-ui">{step.sub}</text>
          {i < 3 && (
            <line x1={step.x + 42} y1="40" x2={step.x + 53} y2="40" stroke="#475569" strokeWidth="1.5" markerEnd="url(#flowArr)" />
          )}
        </g>
      ))}
      <defs>
        <marker id="flowArr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5" fill="#475569" />
        </marker>
      </defs>
      <text x="100" y="90" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="system-ui">
        Vollautomatisch: Google → Chat → Offerte in Minuten
      </text>
    </svg>
  );
}

// 7. Service stack — "Nicht nur was man muss, sondern was es gibt"
export function ServiceStackLayers() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-auto" role="img" aria-label="Service-Stack">
      {[
        { y: 12, label: "Spezialumzüge", sub: "Klavier, Tresor, Kunst", color: "#8b5cf6", w: 110 },
        { y: 30, label: "Entsorgung & Räumung", sub: "Professionell & zertifiziert", color: "#ec4899", w: 120 },
        { y: 48, label: "Lagerung & Montage", sub: "Möbel, Küche, Lampen", color: "#f59e0b", w: 130 },
        { y: 66, label: "Endreinigung", sub: "Abgabe-garantie", color: "#6366f1", w: 140 },
        { y: 84, label: "Umzug (Basis)", sub: "Privat & Firma", color: "#008080", w: 160 },
      ].map((layer, i) => (
        <g key={i}>
          <rect x={(200 - layer.w) / 2} y={layer.y} width={layer.w} height="16" rx="3" fill={`${layer.color}20`} stroke={layer.color} strokeWidth="1" />
          <text x={100 - 15} y={layer.y + 11} textAnchor="end" fill={layer.color} fontSize="6.5" fontWeight="700" fontFamily="system-ui">{layer.label}</text>
          <text x={100 - 10} y={layer.y + 11} fill="#64748b" fontSize="5.5" fontFamily="system-ui">{layer.sub}</text>
        </g>
      ))}
      <text x="100" y="112" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="system-ui">
        Nicht nur das Nötige — alles was möglich ist.
      </text>
    </svg>
  );
}

/** Map reason IDs to their visuals */
export const NUCLEAR_VISUALS: Record<number, React.FC> = {
  1: SwissMovingArrows,
  8: ServiceGrowthBox,
  11: SERPDominance,
  16: MunicipalityNetwork,
  31: HumanAIModules,
  40: GoogleToOfferFlow,
  49: ServiceStackLayers,
};
