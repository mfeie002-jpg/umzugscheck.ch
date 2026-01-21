/**
 * Revenue Stream Examples Component
 * Shows detailed examples for each of the 10 revenue streams
 * Ordered from simplest/quickest to most complex
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, TrendingUp, ChevronDown, ChevronUp,
  Zap, Clock, Star, ArrowRight, CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RevenueExample {
  id: number;
  name: string;
  category: "quick" | "medium" | "complex";
  emoji: string;
  tagline: string;
  complexity: number; // 1-5
  timeToRevenue: string;
  
  // The example transaction
  example: {
    scenario: string;
    customerPays: number;
    ourCut: number;
    partnerGets?: number;
    margin: number;
  };
  
  // How it works step by step
  steps: string[];
  
  // Why it's valuable
  whyValuable: string;
}

const revenueStreams: RevenueExample[] = [
  // QUICK WINS (1-2)
  {
    id: 1,
    name: "Affiliate Telco/Energie",
    category: "quick",
    emoji: "📱",
    tagline: "Kunde wechselt Anbieter → Wir kassieren",
    complexity: 1,
    timeToRevenue: "Sofort",
    example: {
      scenario: "Familie Müller zieht um und braucht Internet am neuen Ort. Wir empfehlen Swisscom.",
      customerPays: 0,
      ourCut: 100,
      margin: 100
    },
    steps: [
      "Kunde gibt neue Adresse ein",
      "Wir zeigen passende Internet/Strom-Angebote",
      "Kunde klickt auf 'Jetzt wechseln'",
      "Anbieter zahlt uns 80-150 CHF Provision"
    ],
    whyValuable: "Zero-Cost Revenue: Wir verdienen, ohne etwas zu liefern. Pure Vermittlung."
  },
  {
    id: 2,
    name: "Lead-Verkauf (CPL)",
    category: "quick",
    emoji: "📋",
    tagline: "Umzugsfirma zahlt für qualifizierte Anfrage",
    complexity: 1,
    timeToRevenue: "24h",
    example: {
      scenario: "Herr Schmidt sucht Umzugsfirma für 3-Zimmer-Wohnung. 3 Firmen bekommen seine Anfrage.",
      customerPays: 0,
      ourCut: 75, // 25 CHF × 3 Firmen
      partnerGets: 0,
      margin: 100
    },
    steps: [
      "Kunde füllt Offerten-Formular aus",
      "Wir matchen mit 3-5 passenden Firmen",
      "Jede Firma zahlt 15-45 CHF pro Lead",
      "Firmen kontaktieren Kunde direkt"
    ],
    whyValuable: "Skaliert perfekt: Mehr Traffic = linear mehr Revenue. Kein Fulfillment nötig."
  },
  
  // MEDIUM COMPLEXITY (3-5)
  {
    id: 3,
    name: "Basis-Provision (Take-Rate)",
    category: "medium",
    emoji: "💰",
    tagline: "15% von jedem Umzug über unsere Plattform",
    complexity: 2,
    timeToRevenue: "Nach Umzug",
    example: {
      scenario: "Umzug Zürich → Bern, 30m³. Umzugsfirma berechnet CHF 1'500.",
      customerPays: 1500,
      ourCut: 225,
      partnerGets: 1275,
      margin: 15
    },
    steps: [
      "Kunde bucht Umzug über unsere Plattform",
      "Umzugsfirma führt Umzug durch",
      "Kunde zahlt an uns (Treuhand)",
      "Wir behalten 15% und zahlen 85% an Firma"
    ],
    whyValuable: "Unser Kern-Revenue: Je mehr Umzüge, desto mehr verdienen wir. Durchschnitt: CHF 225/Umzug."
  },
  {
    id: 4,
    name: "Reinigung mit Garantie",
    category: "medium",
    emoji: "✨",
    tagline: "Abnahme-Garantie = Premium-Preis",
    complexity: 2,
    timeToRevenue: "Nach Service",
    example: {
      scenario: "4-Zimmer-Wohnung, 85m². Reinigung mit Abnahme-Garantie.",
      customerPays: 450,
      ourCut: 90, // 20% Marge
      partnerGets: 360,
      margin: 20
    },
    steps: [
      "Kunde bucht 'Garantie-Reinigung'",
      "Zertifizierte Putzfirma reinigt",
      "Falls Vermieter reklamiert: kostenlose Nachbesserung",
      "Wir behalten 20% für Garantie-Risiko"
    ],
    whyValuable: "Höhere Marge als Standard wegen Garantie-Versprechen. Cross-Sell zu jedem Umzug."
  },
  {
    id: 5,
    name: "Bürokratie-Autopilot",
    category: "medium",
    emoji: "🤖",
    tagline: "Ein Klick = Alles umgemeldet",
    complexity: 3,
    timeToRevenue: "Sofort",
    example: {
      scenario: "Komplette Ummeldung: Gemeinde, Strom, Internet, Versicherung, Post.",
      customerPays: 49,
      ourCut: 49,
      margin: 98 // Fast keine Kosten da automatisiert
    },
    steps: [
      "Kunde gibt alte + neue Adresse ein",
      "Wählt Services: Gemeinde, Strom, Post, etc.",
      "Zahlt CHF 49 Pauschal",
      "Unser Bot erledigt alles automatisch"
    ],
    whyValuable: "98% Marge da vollautomatisch. Spart Kunden 5-8 Stunden Arbeit."
  },
  
  // COMPLEX / HIGH-VALUE (6-10)
  {
    id: 6,
    name: "Escrow / Treuhand-Fees",
    category: "complex",
    emoji: "🔐",
    tagline: "Wir halten das Geld = Wir verdienen am Float",
    complexity: 3,
    timeToRevenue: "Bei Buchung",
    example: {
      scenario: "Umzug für CHF 2'000. Kunde zahlt vorab an uns. Firma wird nach Abschluss bezahlt.",
      customerPays: 2000,
      ourCut: 30, // 1.5% Escrow Fee
      partnerGets: 1970,
      margin: 100 // Reine Fee
    },
    steps: [
      "Kunde bucht Umzug und zahlt an Treuhand-Konto",
      "Geld liegt 7-14 Tage bei uns",
      "Nach erfolgreichem Umzug: 'Bestätigen' klicken",
      "Firma wird ausbezahlt, wir behalten 1.5% Fee"
    ],
    whyValuable: "Doppelter Vorteil: Fee + Float-Zinsen. Bei 1'000 Umzügen/Monat = 1.5 Mio Float!"
  },
  {
    id: 7,
    name: "Circular Economy",
    category: "complex",
    emoji: "♻️",
    tagline: "Altes Zeug wird zu Geld",
    complexity: 3,
    timeToRevenue: "Vor Umzug",
    example: {
      scenario: "Kunde will altes Sofa, Schrank und Matratze loswerden.",
      customerPays: 150, // Entsorgungsgebühr
      ourCut: 80, // 50 Entsorgung + 30 Weiterverkauf
      margin: 53
    },
    steps: [
      "Kunde markiert im Video was weg soll",
      "Wir holen ab (CHF 80-200 je nach Menge)",
      "Brauchbares wird auf Ricardo/Tutti verkauft",
      "Wir behalten Entsorgungsgebühr + 20% vom Verkauf"
    ],
    whyValuable: "Doppelte Einnahme: Entsorgung bezahlt + Weiterverkauf. Reduziert auch Umzugskosten."
  },
  {
    id: 8,
    name: "Micro-Insurance",
    category: "complex",
    emoji: "🛡️",
    tagline: "Video-Beweis = Sofort-Zahlung bei Schäden",
    complexity: 4,
    timeToRevenue: "Bei Buchung",
    example: {
      scenario: "Umzugsversicherung für Hausrat im Wert von CHF 50'000.",
      customerPays: 79,
      ourCut: 47, // 60% Marge weil niedrige Schadenquote
      partnerGets: 32, // Rückversicherung
      margin: 60
    },
    steps: [
      "Kunde macht Video-Inventar vor Umzug",
      "Wählt Versicherungs-Paket (Basic/Premium)",
      "Bei Schaden: KI vergleicht Vorher/Nachher-Video",
      "Automatische Auszahlung innerhalb 48h"
    ],
    whyValuable: "60% Marge weil Video-Beweise die Schadenquote minimieren. Klassische Versicherung: 20% Marge."
  },
  {
    id: 9,
    name: "Partner SaaS (MRR)",
    category: "complex",
    emoji: "⚙️",
    tagline: "Umzugsfirmen zahlen monatlich für unsere Software",
    complexity: 4,
    timeToRevenue: "Monatlich",
    example: {
      scenario: "Umzugsfirma 'Blitz-Umzüge' nutzt unser Dispo-System.",
      customerPays: 99, // Monatlich
      ourCut: 99,
      margin: 95 // Software = hohe Marge
    },
    steps: [
      "Firma meldet sich für Partner-Portal an",
      "Nutzt Lead-Management, Kapazitätsplanung, Auto-Bidding",
      "Zahlt CHF 99/Monat Abo",
      "Zusätzlich: 15% Provision pro vermitteltem Auftrag"
    ],
    whyValuable: "Recurring Revenue! 100 Partner × 99 CHF = 10k MRR. Plus Lock-in Effekt."
  },
  {
    id: 10,
    name: "B2B HR-Relocation",
    category: "complex",
    emoji: "🏢",
    tagline: "Enterprise-Kunden mit hohen Warenkörben",
    complexity: 5,
    timeToRevenue: "Projektbasiert",
    example: {
      scenario: "Credit Suisse relociert 5 Expats von London nach Zürich.",
      customerPays: 25000, // 5 × 5'000 pro Umzug
      ourCut: 3750, // 15% Take-Rate
      partnerGets: 21250,
      margin: 15
    },
    steps: [
      "HR-Abteilung bucht Relocation-Paket",
      "Wir organisieren: Umzug, Wohnung, Schule, Behörden",
      "Monatliches Abo + Provision pro Mitarbeiter",
      "LTV pro Enterprise-Kunde: >50'000 CHF"
    ],
    whyValuable: "High-Value Segment: Ein Firmen-Kunde = 50 Privatkunden. Lange Verträge."
  }
];

export const RevenueStreamExamples = memo(() => {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "quick": return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
      case "medium": return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
      case "complex": return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300";
      default: return "bg-muted text-muted-foreground";
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "quick": return "Quick Win";
      case "medium": return "Standard";
      case "complex": return "Komplex";
      default: return category;
    }
  };

  // Calculate totals
  const totalRevenue = revenueStreams.reduce((sum, s) => sum + s.example.ourCut, 0);
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            <DollarSign className="w-3 h-3 mr-1" />
            10 Einnahmequellen im Detail
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Konkrete Beispiele: So verdienen wir Geld
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Jede Einnahmequelle erklärt mit einem echten Beispiel-Szenario.
            Von einfach (sofort umsetzbar) bis komplex (braucht Aufbau).
          </p>
        </motion.div>
        
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10"
        >
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
            <Zap className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">2</p>
            <p className="text-xs text-green-600">Quick Wins</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">3</p>
            <p className="text-xs text-blue-600">Standard</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
            <Star className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">5</p>
            <p className="text-xs text-purple-600">Komplex/High-Value</p>
          </div>
        </motion.div>

        {/* Revenue Streams List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {revenueStreams.map((stream, idx) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card 
                className={cn(
                  "overflow-hidden transition-all cursor-pointer",
                  expandedId === stream.id 
                    ? "ring-2 ring-primary shadow-lg" 
                    : "hover:shadow-md"
                )}
                onClick={() => setExpandedId(expandedId === stream.id ? null : stream.id)}
              >
                {/* Header Row */}
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    {stream.emoji}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground">#{stream.id}</span>
                      <Badge variant="outline" className={cn("text-xs", getCategoryColor(stream.category))}>
                        {getCategoryLabel(stream.category)}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-foreground truncate">{stream.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{stream.tagline}</p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-primary">+{stream.example.ourCut} CHF</p>
                    <p className="text-xs text-muted-foreground">{stream.example.margin}% Marge</p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {expandedId === stream.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === stream.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t"
                    >
                      <div className="p-4 bg-muted/30 space-y-4">
                        {/* Example Scenario */}
                        <div className="bg-white dark:bg-black/40 rounded-xl p-4 border">
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                            📌 Beispiel-Szenario
                          </p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {stream.example.scenario}
                          </p>
                        </div>
                        
                        {/* Money Flow */}
                        <div className="grid grid-cols-3 gap-3">
                          {stream.example.customerPays > 0 && (
                            <div className="bg-white dark:bg-black/40 rounded-xl p-3 text-center border">
                              <p className="text-xs text-muted-foreground mb-1">Kunde zahlt</p>
                              <p className="text-lg font-bold">{stream.example.customerPays} CHF</p>
                            </div>
                          )}
                          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 text-center border border-green-200 dark:border-green-800">
                            <p className="text-xs text-green-600 mb-1">Wir bekommen</p>
                            <p className="text-lg font-bold text-green-700 dark:text-green-400">
                              +{stream.example.ourCut} CHF
                            </p>
                          </div>
                          {stream.example.partnerGets !== undefined && stream.example.partnerGets > 0 && (
                            <div className="bg-white dark:bg-black/40 rounded-xl p-3 text-center border">
                              <p className="text-xs text-muted-foreground mb-1">Partner erhält</p>
                              <p className="text-lg font-bold">{stream.example.partnerGets} CHF</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Steps */}
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                            🔄 So funktioniert's
                          </p>
                          <div className="space-y-2">
                            {stream.steps.map((step, stepIdx) => (
                              <div key={stepIdx} className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {stepIdx + 1}
                                </span>
                                <span className="text-sm text-foreground">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Why Valuable */}
                        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Warum wertvoll
                          </p>
                          <p className="text-sm text-amber-800 dark:text-amber-300">
                            {stream.whyValuable}
                          </p>
                        </div>
                        
                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                          <span>Komplexität: {"⭐".repeat(stream.complexity)}</span>
                          <span>Time-to-Revenue: {stream.timeToRevenue}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Total Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-8"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-2 border-primary/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Summe aller Beispiel-Transaktionen:
                </p>
                <p className="text-3xl font-black text-primary">
                  {totalRevenue} CHF
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Bei einem typischen Kunden der alle Services nutzt
                </p>
              </div>
              <div className="text-right">
                <CheckCircle2 className="w-8 h-8 text-green-500 mb-2 ml-auto" />
                <p className="text-sm font-medium text-foreground">
                  10 Einnahmequellen
                </p>
                <p className="text-xs text-muted-foreground">
                  = Revenue Stacking
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
});

RevenueStreamExamples.displayName = 'RevenueStreamExamples';
