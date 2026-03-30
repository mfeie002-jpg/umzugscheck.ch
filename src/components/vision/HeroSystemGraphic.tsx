/**
 * HeroSystemGraphic — Master system flow infographic
 * Google/SEO → Umzugscheck Hub → WhatsApp/KI → Offerten/Partner
 * Pure SVG + Framer Motion, self-explanatory with embedded labels
 */
import { motion } from "framer-motion";

const TEAL = "#008080";
const ORANGE = "#FF6B1A";
const DARK = "#0F172A";
const SLATE = "#334155";
const LIGHT = "#F8FAFC";
const WHITE = "#FFFFFF";
const GREEN = "#10B981";

export function HeroSystemGraphic() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      <svg viewBox="0 0 900 340" className="w-full h-auto" role="img" aria-label="Umzugscheck System Flow: Von Google über die Plattform zu WhatsApp und Offerten">
        {/* Background */}
        <rect x="0" y="0" width="900" height="340" rx="16" fill={DARK} />
        
        {/* Title */}
        <text x="450" y="30" textAnchor="middle" fill={WHITE} fontSize="14" fontWeight="700" opacity="0.6" letterSpacing="2">
          DAS SYSTEM IN EINEM BILD
        </text>

        {/* === PHASE 1: DEMAND (left) === */}
        <g>
          {/* Google card */}
          <rect x="30" y="60" width="160" height="90" rx="10" fill="#1E293B" stroke={TEAL} strokeWidth="1.5" opacity="0.9" />
          <text x="110" y="82" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700">🔍 GOOGLE / SEO</text>
          <text x="110" y="100" textAnchor="middle" fill="#94A3B8" fontSize="9">43'890+ Keywords/Mt</text>
          <text x="110" y="114" textAnchor="middle" fill="#94A3B8" fontSize="9">Lokale Suchanfragen</text>
          <text x="110" y="128" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">✓ Organisch, kein Adspend</text>
          <rect x="30" y="140" width="160" height="4" rx="2" fill={TEAL} opacity="0.4" />
          <rect x="30" y="140" width="110" height="4" rx="2" fill={TEAL} />

          {/* Map pins card */}
          <rect x="30" y="165" width="160" height="70" rx="10" fill="#1E293B" stroke={SLATE} strokeWidth="1" />
          <text x="110" y="187" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700">📍 2'110 GEMEINDEN</text>
          <text x="110" y="205" textAnchor="middle" fill="#94A3B8" fontSize="9">Lokale Landingpages</text>
          <text x="110" y="219" textAnchor="middle" fill="#94A3B8" fontSize="9">Multi-Service Coverage</text>
        </g>

        {/* Arrow 1: Demand → Hub */}
        <g>
          <line x1="195" y1="130" x2="275" y2="130" stroke={TEAL} strokeWidth="2" strokeDasharray="6,3" />
          <polygon points="275,125 285,130 275,135" fill={TEAL} />
          <text x="240" y="120" textAnchor="middle" fill={TEAL} fontSize="8" fontWeight="600">LEADS</text>
        </g>

        {/* === PHASE 2: PLATFORM HUB (center) === */}
        <g>
          <rect x="290" y="55" width="200" height="185" rx="14" fill="#0D3B3B" stroke={TEAL} strokeWidth="2.5" />
          <rect x="290" y="55" width="200" height="35" rx="14" fill={TEAL} />
          <rect x="290" y="76" width="200" height="14" fill={TEAL} />
          <text x="390" y="78" textAnchor="middle" fill={WHITE} fontSize="14" fontWeight="800">UMZUGSCHECK</text>
          
          {/* Hub features */}
          <text x="390" y="110" textAnchor="middle" fill={WHITE} fontSize="10" fontWeight="600">⚡ Smart Router</text>
          <text x="390" y="128" textAnchor="middle" fill="#A7F3D0" fontSize="9">60 Funnel-Varianten</text>
          
          <line x1="310" y1="140" x2="470" y2="140" stroke={TEAL} strokeWidth="0.5" opacity="0.4" />
          
          <text x="390" y="158" textAnchor="middle" fill={WHITE} fontSize="10" fontWeight="600">🧠 KI-Engine (95%)</text>
          <text x="390" y="176" textAnchor="middle" fill="#A7F3D0" fontSize="9">OpenClaw · Qualification · CRM</text>
          
          <line x1="310" y1="188" x2="470" y2="188" stroke={TEAL} strokeWidth="0.5" opacity="0.4" />
          
          <text x="390" y="206" textAnchor="middle" fill={WHITE} fontSize="10" fontWeight="600">💰 10 Revenue Streams</text>
          <text x="390" y="224" textAnchor="middle" fill={ORANGE} fontSize="9" fontWeight="600">CHF 2'660 AOV / Lead</text>
        </g>

        {/* Arrow 2: Hub → WhatsApp */}
        <g>
          <line x1="495" y1="130" x2="575" y2="130" stroke={ORANGE} strokeWidth="2" strokeDasharray="6,3" />
          <polygon points="575,125 585,130 575,135" fill={ORANGE} />
          <text x="535" y="120" textAnchor="middle" fill={ORANGE} fontSize="8" fontWeight="600">CONVERSION</text>
        </g>

        {/* === PHASE 3: WHATSAPP + AI (right) === */}
        <g>
          {/* WhatsApp card */}
          <rect x="590" y="60" width="170" height="90" rx="10" fill="#1E293B" stroke="#25D366" strokeWidth="1.5" />
          <text x="675" y="82" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700">💬 WHATSAPP BUSINESS</text>
          <text x="675" y="100" textAnchor="middle" fill="#94A3B8" fontSize="9">Katalog · Chat · Auswahl</text>
          <text x="675" y="114" textAnchor="middle" fill="#94A3B8" fontSize="9">KI-Vorqualifikation</text>
          <text x="675" y="132" textAnchor="middle" fill="#25D366" fontSize="9" fontWeight="600">✓ Live & eingerichtet</text>

          {/* AI Processing card */}
          <rect x="590" y="165" width="170" height="70" rx="10" fill="#1E293B" stroke={ORANGE} strokeWidth="1" />
          <text x="675" y="187" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700">🤖 KI-PROCESSING</text>
          <text x="675" y="205" textAnchor="middle" fill="#94A3B8" fontSize="9">Offerten · Matching · Follow-up</text>
          <text x="675" y="219" textAnchor="middle" fill={ORANGE} fontSize="9" fontWeight="600">Automatisch in Sekunden</text>
        </g>

        {/* === PHASE 4: OUTPUT (bottom) === */}
        <g>
          {/* Arrow down from hub */}
          <line x1="390" y1="245" x2="390" y2="270" stroke={ORANGE} strokeWidth="2" />
          <polygon points="385,270 390,280 395,270" fill={ORANGE} />
        </g>

        {/* Output bar */}
        <rect x="120" y="280" width="660" height="46" rx="10" fill="#1E293B" stroke={ORANGE} strokeWidth="1.5" />
        
        {/* Output items */}
        <text x="195" y="300" textAnchor="middle" fill={WHITE} fontSize="10" fontWeight="700">📋 Offerten</text>
        <text x="195" y="314" textAnchor="middle" fill="#94A3B8" fontSize="8">An 3-5 Firmen</text>
        
        <line x1="280" y1="288" x2="280" y2="318" stroke={SLATE} strokeWidth="0.5" />
        
        <text x="355" y="300" textAnchor="middle" fill={WHITE} fontSize="10" fontWeight="700">🏢 Partner</text>
        <text x="355" y="314" textAnchor="middle" fill="#94A3B8" fontSize="8">Verifizierte Firmen</text>
        
        <line x1="430" y1="288" x2="430" y2="318" stroke={SLATE} strokeWidth="0.5" />
        
        <text x="510" y="300" textAnchor="middle" fill={WHITE} fontSize="10" fontWeight="700">🧹 Feierabend</text>
        <text x="510" y="314" textAnchor="middle" fill="#94A3B8" fontSize="8">Eigene Services</text>
        
        <line x1="590" y1="288" x2="590" y2="318" stroke={SLATE} strokeWidth="0.5" />
        
        <text x="675" y="300" textAnchor="middle" fill={WHITE} fontSize="10" fontWeight="700">💳 Revenue</text>
        <text x="675" y="314" textAnchor="middle" fill={ORANGE} fontSize="8" fontWeight="600">90%+ Marge</text>
      </svg>
    </motion.div>
  );
}
