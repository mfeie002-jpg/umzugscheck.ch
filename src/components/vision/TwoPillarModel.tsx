/**
 * TwoPillarModel — Zwei-Säulen-Modell Infografik
 * Shows Umzugscheck (Portal) ↔ Feierabend (Dienstleister) ecosystem
 * Cherry/Chaff sorting logic, Zero CAC advantage
 * Pure SVG + Framer Motion, self-explanatory
 */
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Download, Columns2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TEAL = "#008080";
const ORANGE = "#FF6B1A";
const DARK = "#0F172A";
const SLATE = "#334155";
const LIGHT_SLATE = "#64748B";
const WHITE = "#FFFFFF";
const GREEN = "#10B981";
const RED = "#EF4444";
const CHERRY = "#DC2626";
const GOLD = "#F59E0B";
const PURPLE = "#8B5CF6";

function TwoPillarSVG() {
  return (
    <svg viewBox="0 0 960 720" className="w-full h-auto" role="img" aria-label="Zwei-Säulen-Modell: Umzugscheck Portal und Feierabend Services Ökosystem">
      {/* Background */}
      <rect x="0" y="0" width="960" height="720" rx="16" fill={DARK} />

      {/* Title bar */}
      <text x="480" y="30" textAnchor="middle" fill={WHITE} fontSize="11" fontWeight="700" opacity="0.5" letterSpacing="3">
        ZWEI-SÄULEN-MODELL
      </text>
      <text x="480" y="54" textAnchor="middle" fill={WHITE} fontSize="18" fontWeight="800">
        Das Ökosystem: Portal × Dienstleister
      </text>
      <text x="480" y="74" textAnchor="middle" fill={LIGHT_SLATE} fontSize="11">
        Ein Akquisitionskanal, zwei Profit-Center, Zero CAC
      </text>

      {/* ===== LEFT PILLAR: Umzugscheck ===== */}
      <g>
        <rect x="30" y="95" width="400" height="340" rx="14" fill="#0D3B3B" stroke={TEAL} strokeWidth="2" />
        {/* Header */}
        <rect x="30" y="95" width="400" height="42" rx="14" fill={TEAL} />
        <rect x="30" y="123" width="400" height="14" fill={TEAL} />
        <text x="230" y="122" textAnchor="middle" fill={WHITE} fontSize="15" fontWeight="800">
          SÄULE 1: UMZUGSCHECK.CH
        </text>

        {/* Subtitle */}
        <text x="230" y="160" textAnchor="middle" fill={TEAL} fontSize="11" fontWeight="700">
          🔍 DIGITALE LEAD-ENGINE
        </text>

        {/* Features */}
        <rect x="50" y="175" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="60" y="194" fill="#94A3B8" fontSize="10">SEO & Content</text>
        <text x="380" y="194" textAnchor="end" fill={WHITE} fontSize="10" fontWeight="600">43'890+ Keywords/Mt</text>

        <rect x="50" y="210" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="60" y="229" fill="#94A3B8" fontSize="10">Lokale Abdeckung</text>
        <text x="380" y="229" textAnchor="end" fill={WHITE} fontSize="10" fontWeight="600">2'110 Gemeinden</text>

        <rect x="50" y="245" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="60" y="264" fill="#94A3B8" fontSize="10">Funnel-Varianten</text>
        <text x="380" y="264" textAnchor="end" fill={WHITE} fontSize="10" fontWeight="600">60+ getestete Flows</text>

        <rect x="50" y="280" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="60" y="299" fill="#94A3B8" fontSize="10">KI-Automatisierung</text>
        <text x="380" y="299" textAnchor="end" fill={GREEN} fontSize="10" fontWeight="600">95% automatisiert</text>

        <rect x="50" y="315" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="60" y="334" fill="#94A3B8" fontSize="10">Revenue Streams</text>
        <text x="380" y="334" textAnchor="end" fill={ORANGE} fontSize="10" fontWeight="600">10 Einnahmequellen</text>

        {/* Bottom stat */}
        <rect x="50" y="355" width="360" height="34" rx="8" fill={TEAL} opacity="0.15" stroke={TEAL} strokeWidth="1" />
        <text x="230" y="377" textAnchor="middle" fill={TEAL} fontSize="12" fontWeight="700">
          💰 CHF 553 durchschn. AOV pro Lead
        </text>

        {/* Role label */}
        <rect x="130" y="400" width="200" height="24" rx="12" fill="#1E293B" stroke={TEAL} strokeWidth="1" />
        <text x="230" y="416" textAnchor="middle" fill={TEAL} fontSize="9" fontWeight="700">
          NACHFRAGE GENERIEREN (DIGITAL)
        </text>
      </g>

      {/* ===== RIGHT PILLAR: Feierabend ===== */}
      <g>
        <rect x="530" y="95" width="400" height="340" rx="14" fill="#2D1810" stroke={ORANGE} strokeWidth="2" />
        {/* Header */}
        <rect x="530" y="95" width="400" height="42" rx="14" fill={ORANGE} />
        <rect x="530" y="123" width="400" height="14" fill={ORANGE} />
        <text x="730" y="122" textAnchor="middle" fill={WHITE} fontSize="15" fontWeight="800">
          SÄULE 2: FEIERABEND SERVICES
        </text>

        {/* Subtitle */}
        <text x="730" y="160" textAnchor="middle" fill={ORANGE} fontSize="11" fontWeight="700">
          🏠 PHYSISCHER DIENSTLEISTER
        </text>

        {/* Services */}
        <rect x="550" y="175" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="560" y="194" fill="#94A3B8" fontSize="10">Privatumzug</text>
        <text x="880" y="194" textAnchor="end" fill={WHITE} fontSize="10" fontWeight="600">CHF 1'650 – 4'900+</text>

        <rect x="550" y="210" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="560" y="229" fill="#94A3B8" fontSize="10">Räumung / Entsorgung</text>
        <text x="880" y="229" textAnchor="end" fill={WHITE} fontSize="10" fontWeight="600">CHF 590 – 3'200+</text>

        <rect x="550" y="245" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="560" y="264" fill="#94A3B8" fontSize="10">Endreinigung</text>
        <text x="880" y="264" textAnchor="end" fill={WHITE} fontSize="10" fontWeight="600">CHF 450 – 1'200</text>

        <rect x="550" y="280" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="560" y="299" fill="#94A3B8" fontSize="10">KI-Video-Analyse</text>
        <text x="880" y="299" textAnchor="end" fill={GREEN} fontSize="10" fontWeight="600">60s → Preis & Volumen</text>

        <rect x="550" y="315" width="360" height="28" rx="6" fill="#1E293B" />
        <text x="560" y="334" fill="#94A3B8" fontSize="10">Premium-Fokus</text>
        <text x="880" y="334" textAnchor="end" fill={GOLD} fontSize="10" fontWeight="600">Zürich · Zug · Goldküste</text>

        {/* Bottom stat */}
        <rect x="550" y="355" width="360" height="34" rx="8" fill={ORANGE} opacity="0.15" stroke={ORANGE} strokeWidth="1" />
        <text x="730" y="377" textAnchor="middle" fill={ORANGE} fontSize="12" fontWeight="700">
          🎯 Zero CAC — Kunden via Portal gratis
        </text>

        {/* Role label */}
        <rect x="630" y="400" width="200" height="24" rx="12" fill="#1E293B" stroke={ORANGE} strokeWidth="1" />
        <text x="730" y="416" textAnchor="middle" fill={ORANGE} fontSize="9" fontWeight="700">
          NACHFRAGE BEDIENEN (PHYSISCH)
        </text>
      </g>

      {/* ===== CENTER CONNECTION: Lead Flow ===== */}
      <g>
        {/* Vertical connector from both pillars down */}
        <line x1="230" y1="435" x2="230" y2="470" stroke={TEAL} strokeWidth="2" />
        <line x1="730" y1="435" x2="730" y2="470" stroke={ORANGE} strokeWidth="2" />

        {/* Horizontal merge line */}
        <line x1="230" y1="470" x2="730" y2="470" stroke={LIGHT_SLATE} strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Down arrow to sorting */}
        <line x1="480" y1="470" x2="480" y2="495" stroke={WHITE} strokeWidth="2" />
        <polygon points="475,495 480,505 485,495" fill={WHITE} />
      </g>

      {/* ===== CHERRY & CHAFF SORTING ===== */}
      <g>
        {/* Sorting box */}
        <rect x="280" y="510" width="400" height="55" rx="12" fill="#1E293B" stroke={GOLD} strokeWidth="2" />
        <text x="480" y="530" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="700" letterSpacing="2">
          🍒 CHERRY & CHAFF SORTING
        </text>
        <text x="480" y="548" textAnchor="middle" fill={LIGHT_SLATE} fontSize="9">
          Leads werden automatisch nach Profitabilität sortiert
        </text>

        {/* Split arrows */}
        {/* Cherry arrow → left (Feierabend) */}
        <line x1="380" y1="565" x2="280" y2="605" stroke={CHERRY} strokeWidth="2" />
        <polygon points="276,601 280,611 286,603" fill={CHERRY} />

        {/* Chaff arrow → right (Marketplace) */}
        <line x1="580" y1="565" x2="680" y2="605" stroke={LIGHT_SLATE} strokeWidth="2" />
        <polygon points="674,603 680,611 684,601" fill={LIGHT_SLATE} />
      </g>

      {/* Cherry box */}
      <g>
        <rect x="120" y="605" width="270" height="95" rx="10" fill="#1E293B" stroke={CHERRY} strokeWidth="1.5" />
        <text x="255" y="627" textAnchor="middle" fill={CHERRY} fontSize="12" fontWeight="800">🍒 KIRSCHEN → Feierabend</text>
        <text x="255" y="645" textAnchor="middle" fill={WHITE} fontSize="10">Premium-Leads (Score &gt;60)</text>
        <text x="255" y="662" textAnchor="middle" fill="#94A3B8" fontSize="9">Zürich/Zug · Hoher AOV · Dringend</text>
        <rect x="140" y="672" width="230" height="20" rx="4" fill={CHERRY} opacity="0.15" />
        <text x="255" y="686" textAnchor="middle" fill={CHERRY} fontSize="10" fontWeight="700">35–45% Bruttomarge</text>
      </g>

      {/* Chaff box */}
      <g>
        <rect x="570" y="605" width="270" height="95" rx="10" fill="#1E293B" stroke={LIGHT_SLATE} strokeWidth="1.5" />
        <text x="705" y="627" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="800">🌾 SPREU → Marktplatz</text>
        <text x="705" y="645" textAnchor="middle" fill={WHITE} fontSize="10">Standard-Leads (Score &lt;60)</text>
        <text x="705" y="662" textAnchor="middle" fill="#94A3B8" fontSize="9">Andere Regionen · Auktion an Partner</text>
        <rect x="590" y="672" width="230" height="20" rx="4" fill={GOLD} opacity="0.15" />
        <text x="705" y="686" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="700">Deckt Betriebskosten</text>
      </g>

      {/* ===== BOTTOM SYNERGY BAR ===== */}
      {/* Moved up slightly since we have space */}

      {/* Subtle label at very bottom */}
      <text x="480" y="712" textAnchor="middle" fill={LIGHT_SLATE} fontSize="8" opacity="0.5">
        umzugscheck.ch/investoren — Zwei-Säulen-Modell © 2026
      </text>
    </svg>
  );
}

export function TwoPillarModel() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Columns2 className="w-3.5 h-3.5 mr-1" />
            Zwei-Säulen-Modell
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Ein Ökosystem. Zwei Profit-Center.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Umzugscheck generiert die Nachfrage digital. Feierabend Services bedient die profitabelsten Aufträge physisch. 
            Die Standard-Leads finanzieren den gesamten Betrieb.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TwoPillarSVG />
        </motion.div>

        {/* Download button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-6"
        >
          <a href="/zwei-saeulen-modell.pdf" download>
            <Button variant="outline" size="sm" className="min-h-[44px] gap-2">
              <Download className="w-4 h-4" />
              Zwei-Säulen-Modell als PDF
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
