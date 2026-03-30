/**
 * ProofMockups — 4 UI mockup SVGs showing live systems
 * WhatsApp Business, Katalog, KI-Chat, Backend Approval
 * Pure SVG, realistic interface style
 */
import { motion } from "framer-motion";

const TEAL = "#008080";
const ORANGE = "#FF6B1A";
const DARK = "#0F172A";
const GREEN = "#25D366";
const WHITE = "#FFFFFF";
const SLATE700 = "#334155";

function WhatsAppProfileMockup() {
  return (
    <svg viewBox="0 0 280 320" className="w-full h-auto">
      <rect x="0" y="0" width="280" height="320" rx="14" fill="#1E293B" />
      {/* Phone frame top */}
      <rect x="0" y="0" width="280" height="50" rx="14" fill={GREEN} />
      <rect x="0" y="36" width="280" height="14" fill={GREEN} />
      <text x="140" y="30" textAnchor="middle" fill={WHITE} fontSize="12" fontWeight="700">WhatsApp Business</text>
      <text x="140" y="46" textAnchor="middle" fill={WHITE} fontSize="8" opacity="0.8">Umzugscheck.ch</text>
      
      {/* Profile section */}
      <circle cx="140" cy="85" r="25" fill={TEAL} />
      <text x="140" y="90" textAnchor="middle" fill={WHITE} fontSize="16" fontWeight="800">UC</text>
      <text x="140" y="125" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700">Umzugscheck</text>
      <text x="140" y="140" textAnchor="middle" fill="#94A3B8" fontSize="8">Business Account · Verified ✓</text>
      
      {/* Info items */}
      {["📍 Schweizweit", "🕐 Antwortet in < 5 Min", "📋 Katalog verfügbar", "🇨🇭 Kostenlos & unverbindlich"].map((item, i) => (
        <g key={item}>
          <text x="30" y={170 + i * 22} fill="#CBD5E1" fontSize="9">{item}</text>
        </g>
      ))}
      
      {/* CTA Button */}
      <rect x="30" y="260" width="220" height="36" rx="18" fill={GREEN} />
      <text x="140" y="283" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700">💬 Chat starten</text>
      
      {/* Status */}
      <rect x="80" y="300" width="120" height="14" rx="7" fill={GREEN} opacity="0.2" />
      <text x="140" y="310" textAnchor="middle" fill={GREEN} fontSize="7" fontWeight="700">✓ LIVE</text>
    </svg>
  );
}

function KatalogMockup() {
  const items = [
    { name: "Privatumzug", price: "ab CHF 890", emoji: "🚛" },
    { name: "Endreinigung", price: "ab CHF 350", emoji: "🧹" },
    { name: "Räumung", price: "ab CHF 200", emoji: "🗑️" },
    { name: "Packservice", price: "ab CHF 180", emoji: "📦" },
  ];
  
  return (
    <svg viewBox="0 0 280 320" className="w-full h-auto">
      <rect x="0" y="0" width="280" height="320" rx="14" fill="#1E293B" />
      <rect x="0" y="0" width="280" height="40" rx="14" fill={SLATE700} />
      <rect x="0" y="26" width="280" height="14" fill={SLATE700} />
      <text x="140" y="26" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700">📋 Service-Katalog</text>
      
      {items.map((item, i) => {
        const y = 52 + i * 64;
        return (
          <g key={item.name}>
            <rect x="12" y={y} width="256" height="56" rx="10" fill="#0F172A" stroke={SLATE700} strokeWidth="1" />
            <text x="25" y={y + 23} fill={WHITE} fontSize="16">{item.emoji}</text>
            <text x="48" y={y + 22} fill={WHITE} fontSize="11" fontWeight="600">{item.name}</text>
            <text x="48" y={y + 38} fill="#94A3B8" fontSize="9">{item.price}</text>
            <rect x="200" y={y + 14} width="58" height="28" rx="14" fill={TEAL} />
            <text x="229" y={y + 33} textAnchor="middle" fill={WHITE} fontSize="9" fontWeight="600">Wählen</text>
          </g>
        );
      })}
      
      <rect x="80" y="310" width="120" height="0" rx="7" fill="none" />
    </svg>
  );
}

function AIChatMockup() {
  const messages = [
    { from: "user", text: "Hallo, ich ziehe von Zürich nach Bern.", y: 50 },
    { from: "ai", text: "Gerne! Wie viele Zimmer hat Ihre aktuelle Wohnung?", y: 95 },
    { from: "user", text: "3.5 Zimmer, ca. 80m²", y: 140 },
    { from: "ai", text: "Perfekt. Möchten Sie auch Endreinigung & Packservice?", y: 185 },
    { from: "user", text: "Ja, beides bitte!", y: 230 },
    { from: "ai", text: "✅ Anfrage qualifiziert. Ich erstelle Ihnen 3 passende Offerten.", y: 260 },
  ];
  
  return (
    <svg viewBox="0 0 280 320" className="w-full h-auto">
      <rect x="0" y="0" width="280" height="320" rx="14" fill="#1E293B" />
      <rect x="0" y="0" width="280" height="40" rx="14" fill={TEAL} />
      <rect x="0" y="26" width="280" height="14" fill={TEAL} />
      <text x="140" y="26" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700">🤖 KI-Qualifizierung</text>
      
      {messages.map((msg) => {
        const isUser = msg.from === "user";
        const x = isUser ? 100 : 12;
        const w = isUser ? 168 : 200;
        const bg = isUser ? "#0D3B3B" : "#0F172A";
        const border = isUser ? TEAL : SLATE700;
        return (
          <g key={msg.y}>
            <rect x={x} y={msg.y} width={w} height={msg.text.length > 40 ? 32 : 28} rx="10" fill={bg} stroke={border} strokeWidth="0.5" />
            <text x={x + 10} y={msg.y + 16} fill={isUser ? "#A7F3D0" : "#CBD5E1"} fontSize="8">
              {msg.text.substring(0, 50)}
            </text>
            {msg.text.length > 50 && (
              <text x={x + 10} y={msg.y + 27} fill={isUser ? "#A7F3D0" : "#CBD5E1"} fontSize="8">
                {msg.text.substring(50)}
              </text>
            )}
          </g>
        );
      })}
      
      {/* Status badge */}
      <rect x="60" y="298" width="160" height="16" rx="8" fill={TEAL} opacity="0.3" />
      <text x="140" y="310" textAnchor="middle" fill={TEAL} fontSize="7" fontWeight="700">KI: AUTOMATISCHE VORQUALIFIKATION</text>
    </svg>
  );
}

function BackendApprovalMockup() {
  return (
    <svg viewBox="0 0 280 320" className="w-full h-auto">
      <rect x="0" y="0" width="280" height="320" rx="14" fill="#1E293B" />
      <rect x="0" y="0" width="280" height="40" rx="14" fill={ORANGE} />
      <rect x="0" y="26" width="280" height="14" fill={ORANGE} />
      <text x="140" y="26" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700">🎛️ Backend — Finale Prüfung</text>
      
      {/* Lead summary card */}
      <rect x="12" y="52" width="256" height="100" rx="10" fill="#0F172A" stroke={SLATE700} strokeWidth="1" />
      <text x="25" y="72" fill={WHITE} fontSize="10" fontWeight="700">Lead #UC-2847</text>
      <text x="25" y="90" fill="#94A3B8" fontSize="8">Zürich → Bern · 3.5 Zi · 80m²</text>
      <text x="25" y="106" fill="#94A3B8" fontSize="8">Services: Umzug + Reinigung + Packservice</text>
      <text x="25" y="122" fill={ORANGE} fontSize="9" fontWeight="600">Geschätzter Wert: CHF 2'450</text>
      <text x="25" y="140" fill="#94A3B8" fontSize="8">KI-Score: 94/100 · Qualität: ⭐⭐⭐⭐⭐</text>
      
      {/* Matching companies */}
      <text x="25" y="172" fill={WHITE} fontSize="9" fontWeight="700">Passende Firmen (3)</text>
      {["Müller Umzüge AG — ⭐ 4.8", "SwissMove GmbH — ⭐ 4.6", "AlpenTransport — ⭐ 4.5"].map((firm, i) => (
        <g key={firm}>
          <rect x="25" y={180 + i * 26} width="230" height="20" rx="4" fill="#0F172A" stroke={SLATE700} strokeWidth="0.5" />
          <text x="35" y={194 + i * 26} fill="#CBD5E1" fontSize="8">{firm}</text>
          <rect x="215" y={183 + i * 26} width="36" height="14" rx="4" fill={TEAL} opacity="0.6" />
          <text x="233" y={193 + i * 26} textAnchor="middle" fill={WHITE} fontSize="7">Match</text>
        </g>
      ))}
      
      {/* Action buttons */}
      <rect x="15" y="270" width="120" height="34" rx="8" fill={TEAL} />
      <text x="75" y="291" textAnchor="middle" fill={WHITE} fontSize="10" fontWeight="700">✅ Freigeben</text>
      
      <rect x="145" y="270" width="120" height="34" rx="8" fill="none" stroke={SLATE700} strokeWidth="1" />
      <text x="205" y="291" textAnchor="middle" fill="#94A3B8" fontSize="10">🔄 Anpassen</text>
      
      {/* Bottom note */}
      <text x="140" y="315" textAnchor="middle" fill="#475569" fontSize="7">Einziger manueller Schritt im gesamten Prozess</text>
    </svg>
  );
}

export function ProofMockups() {
  const mockups = [
    { component: WhatsAppProfileMockup, title: "WhatsApp Business Profil", status: "Live" },
    { component: KatalogMockup, title: "Service-Katalog im Chat", status: "Live" },
    { component: AIChatMockup, title: "KI-Vorqualifikation", status: "Live" },
    { component: BackendApprovalMockup, title: "Finale Mensch-Prüfung", status: "Ready" },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {mockups.map((mockup, i) => (
        <motion.div
          key={mockup.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-colors"
        >
          <mockup.component />
        </motion.div>
      ))}
    </div>
  );
}
