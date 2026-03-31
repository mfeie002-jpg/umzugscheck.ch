/**
 * USPFrameworkSection — 50-Point USP Framework
 * 3-Tier visual hierarchy: Whoa (10) → Core (20) → Foundation (20)
 * All USPs are Umzugscheck/Feierabend-specific
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain, ScanLine, Zap, DollarSign, Cog, Video, Scale, FileSignature, ShieldAlert, Smartphone,
  MessageSquare, Cherry, GitBranch, Newspaper, MapPin, ShoppingCart, Clock, BarChart3, Truck, Sparkles,
  Phone, Target, Users, Globe, Search, Calculator, Star, Award, Layers3, HeartHandshake,
  Shield, Lock, Receipt, Server, Monitor, CheckCircle, Home, Paintbrush, Key, FileCheck,
  BookOpen, Leaf, Headphones, RefreshCw, Wifi, Database, Eye, Handshake, Building2, Settings2,
  ChevronDown, ChevronUp, Layers, ShieldCheck
} from "lucide-react";

interface USP {
  id: number;
  title: string;
  description: string;
  trigger: string;
  icon: React.ReactNode;
}

const TIER1_USPS: USP[] = [
  { id: 1, title: "Hyper-Adaptive KI-Schnittstelle", description: "Die UI ordnet Layout und Navigation dynamisch nach dem Echtzeitverhalten des Nutzers an — personalisiert für jeden Umzugskunden.", trigger: "Arousal & Faszination", icon: <Brain className="w-6 h-6" /> },
  { id: 2, title: "LIDAR AI View Scan", description: "Erstellt via Smartphone-Video einen «Digital Twin» des Haushalts zur exakten Volumenberechnung. Keine Hausbesuche mehr nötig.", trigger: "Immersion & Technologie-Magie", icon: <ScanLine className="w-6 h-6" /> },
  { id: 3, title: "Smart Escrow (Treuhand)", description: "Sichere Zahlung via Stripe-Treuhand. Auszahlung an Firmen erst nach erfolgreicher Übergabe. Das «Stripe für Umzüge».", trigger: "Sicherheit & Vertrauen", icon: <ShieldAlert className="w-6 h-6" /> },
  { id: 4, title: "Dynamic Pricing Engine", description: "Berechnet Festpreise basierend auf Distanz, Volumen, Saison und Echtzeit-Verfügbarkeit. Keine versteckten Kosten.", trigger: "Transparenz & Erleichterung", icon: <DollarSign className="w-6 h-6" /> },
  { id: 5, title: "Prädiktive Auto-Workflows", description: "Die KI führt operative Aufgaben autonom aus: Gemeinde-Ummeldung, Strom-Abmeldung, Nachsendeauftrag. Der «Bürokratie-Butler».", trigger: "Zeitersparnis & Bequemlichkeit", icon: <Zap className="w-6 h-6" /> },
  { id: 6, title: "Zero-UI Experience", description: "Kein langes Ausfüllen von Formularen. Video hochladen → KI analysiert → Preis erhalten. Radikale Reduktion kognitiver Last.", trigger: "Simplicity & Effizienz", icon: <Video className="w-6 h-6" /> },
  { id: 7, title: "Quality-Weighted Bidding", description: "Algorithmus wählt Top-Firmen basierend auf Preis UND geprüfter Qualität aus. Senkt das Risiko schlechter Dienstleister drastisch.", trigger: "Vertrauen & Qualitätssicherung", icon: <Scale className="w-6 h-6" /> },
  { id: 8, title: "Swiss Handover Protocol", description: "Digitales Übergabeprotokoll nach OR Art. 14 mit rechtsgültiger Signatur. Fotos pro Raum, Checkliste, Kautionsschutz.", trigger: "Rechtssicherheit & Compliance", icon: <FileSignature className="w-6 h-6" /> },
  { id: 9, title: "Fixkosten-Eliminierung", description: "Automatisiertes Audit bei jedem Umzug: Telco-, Versicherungs- und Energieverträge werden optimiert. Direkter finanzieller Vorteil.", trigger: "Verlustaversion & Profit", icon: <Cog className="w-6 h-6" /> },
  { id: 10, title: "NFC Cloud Bridge", description: "Physische Schlüsselkarten oder Mailings verbinden sich direkt mit dem Onboarding-Portal. Verbindung von physischer Welt und Cloud.", trigger: "Neuheit & Reibungslosigkeit", icon: <Smartphone className="w-6 h-6" /> },
];

const TIER2_USPS: USP[] = [
  { id: 11, title: "WhatsApp Commerce", description: "Komplette Offerten-Anfrage, Preisauskunft und Buchung direkt über WhatsApp — ohne App-Download.", trigger: "Niedrigschwelliger Zugang", icon: <MessageSquare className="w-5 h-5" /> },
  { id: 12, title: "Cherry & Chaff Sorting", description: "Leads werden automatisch in «Kirschen» (Feierabend-tauglich) und «Spreu» (Marktplatz-Weiterleitung) sortiert.", trigger: "Effizienz-Maximierung", icon: <Cherry className="w-5 h-5" /> },
  { id: 13, title: "Multi-Brand Routing", description: "Intelligente Lead-Verteilung zwischen Umzugscheck-Partnern und Feierabend Services je nach Kapazität und Marge.", trigger: "Operative Intelligenz", icon: <GitBranch className="w-5 h-5" /> },
  { id: 14, title: "KI-Content-Pipeline", description: "Automatische Generierung von SEO-optimierten Ratgebern, Checklisten und Stadtseiten für 2'110 Schweizer Gemeinden.", trigger: "Skalierbare Reichweite", icon: <Newspaper className="w-5 h-5" /> },
  { id: 15, title: "2'110 Gemeinden SEO", description: "Jede Schweizer Gemeinde hat eine eigene, lokal optimierte Landingpage mit Preisen, Firmen und Regulationen.", trigger: "Lokale Dominanz", icon: <MapPin className="w-5 h-5" /> },
  { id: 16, title: "Modularer Warenkorb", description: "Cross-Selling von Reinigung, Entsorgung, Lager, Packservice — durchschnittlicher Warenkorb CHF 553 statt CHF 180.", trigger: "Revenue-Maximierung", icon: <ShoppingCart className="w-5 h-5" /> },
  { id: 17, title: "Echtzeit-Verfügbarkeit", description: "Firmen-Kalender synchronisiert — Kunden sehen sofort freie Slots und können direkt buchen.", trigger: "Sofortige Gratifikation", icon: <Clock className="w-5 h-5" /> },
  { id: 18, title: "10 Revenue Streams", description: "CPL, CPC, Subscriptions, Escrow-Fees, Affiliate, Ads, Premium-Listings, Data, White-Label, Consulting.", trigger: "Diversifizierte Monetarisierung", icon: <BarChart3 className="w-5 h-5" /> },
  { id: 19, title: "Feierabend A-Z Service", description: "Ein Anbieter für alles: Umzug + Räumung + Reinigung + Entsorgung. Kein Koordinations-Chaos.", trigger: "Convenience & Vertrauen", icon: <Truck className="w-5 h-5" /> },
  { id: 20, title: "KI-Preisrechner Suite", description: "5 spezialisierte Rechner: Umzug, Reinigung, Entsorgung, Lager, Packservice — alle mit Sofort-Ergebnis.", trigger: "Transparenz & Self-Service", icon: <Calculator className="w-5 h-5" /> },
  { id: 21, title: "Smart Reminder System", description: "Automatische Erinnerungen für Ummeldung, Kündigungsfristen, Zählerstand-Ablesung — zeitlich perfekt getaktet.", trigger: "Proaktive Fürsorge", icon: <Phone className="w-5 h-5" /> },
  { id: 22, title: "Provider Quality Score", description: "Algorithmus berechnet Qualitätsscore aus Bewertungen, Response-Zeit, Reklamationsquote und Abschlussrate.", trigger: "Datengestützte Sicherheit", icon: <Target className="w-5 h-5" /> },
  { id: 23, title: "Community Trust Engine", description: "Verifizierte Bewertungen mit Umzugsnachweis — keine Fake-Reviews, echte Erfahrungsberichte.", trigger: "Social Proof", icon: <Users className="w-5 h-5" /> },
  { id: 24, title: "Auto Multi-Language", description: "Portal automatisch in DE, FR, IT, EN — die 4 Schweizer Sprachen plus internationaler Zugang.", trigger: "Globale Kompetenz", icon: <Globe className="w-5 h-5" /> },
  { id: 25, title: "Firmen-Comparison Matrix", description: "Side-by-Side Vergleich von bis zu 5 Firmen: Preis, Bewertung, Services, Verfügbarkeit.", trigger: "Entscheidungshilfe", icon: <Layers3 className="w-5 h-5" /> },
  { id: 26, title: "Sponsored Bidding System", description: "Firmen bieten auf Premium-Platzierungen — transparentes Auktionssystem mit Qualitäts-Minimum.", trigger: "Faire Monetarisierung", icon: <Star className="w-5 h-5" /> },
  { id: 27, title: "60-Flow Testing Matrix", description: "Jeder Funnel wird in 60 Varianten getestet — A/B/C Testing auf Steroiden für maximale Conversion.", trigger: "Wissenschaftliche Optimierung", icon: <Sparkles className="w-5 h-5" /> },
  { id: 28, title: "Affiliate Partner Network", description: "Immobilien-Portale, Versicherungen und Gemeinden als Zulieferer — Zero-CAC durch organische Partnerschaften.", trigger: "Netzwerk-Effekte", icon: <HeartHandshake className="w-5 h-5" /> },
  { id: 29, title: "Proaktiver KI-Support", description: "Chatbot analysiert aktuellen Kontext und beantwortet Fragen bevor sie gestellt werden.", trigger: "Frustrations-Eliminierung", icon: <Headphones className="w-5 h-5" /> },
  { id: 30, title: "Award-Ready Case Study", description: "Das Projekt selbst als weltweiter PR-Hook: «95% KI-gebaut, im kompetitivsten Land der Erde».", trigger: "Meta-Marketing", icon: <Award className="w-5 h-5" /> },
];

const TIER3_USPS: USP[] = [
  { id: 31, title: "OR Art. 14 Compliance", description: "Alle Übergabeprotokolle entsprechen dem Schweizer Obligationenrecht.", trigger: "Rechtssicherheit", icon: <FileCheck className="w-4 h-4" /> },
  { id: 32, title: "DSG Datenschutz Native", description: "Schweizer Datenschutzgesetz und DSGVO von Anfang an integriert.", trigger: "Institutionelles Vertrauen", icon: <Shield className="w-4 h-4" /> },
  { id: 33, title: "Transparente Preise", description: "Kristallklare Aufschlüsselungen ohne versteckte Gebühren oder Nachverhandlungen.", trigger: "Ehrlichkeit", icon: <Receipt className="w-4 h-4" /> },
  { id: 34, title: "Abnahmegarantie", description: "Feierabend garantiert: Reinigung wird bis zur Vermieter-Abnahme wiederholt.", trigger: "Risiko-Eliminierung", icon: <CheckCircle className="w-4 h-4" /> },
  { id: 35, title: "Schweizer Hosting", description: "Alle Daten auf Schweizer Servern — keine Daten verlassen das Land.", trigger: "Datensouveränität", icon: <Server className="w-4 h-4" /> },
  { id: 36, title: "Mobile-First UX", description: "Fehlerfreie Parität auf Desktop, Tablet und Mobile. Touch-Targets ≥ 44px.", trigger: "Allgegenwärtiger Zugang", icon: <Monitor className="w-4 h-4" /> },
  { id: 37, title: "Kautionsschutz-System", description: "Digitale Dokumentation verhindert ungerechtfertigte Kautionsabzüge.", trigger: "Finanzieller Schutz", icon: <Home className="w-4 h-4" /> },
  { id: 38, title: "Verifizierte Firmen", description: "200+ geprüfte Schweizer Umzugsfirmen mit Handelsregister-Verifizierung.", trigger: "Qualitätskontrolle", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 39, title: "Keine Dark Patterns", description: "Alle Opt-outs sichtbar, keine versteckten Kosten, keine Manipulations-UX.", trigger: "Ethische UX", icon: <Eye className="w-4 h-4" /> },
  { id: 40, title: "Fixpreis-Option", description: "Verbindliche Festpreise statt unverbindlicher Schätzungen — Planungssicherheit.", trigger: "Budgetsicherheit", icon: <Lock className="w-4 h-4" /> },
  { id: 41, title: "Familienbetrieb seit 1980", description: "Feierabend Services als operativer Partner mit 45+ Jahren Erfahrung.", trigger: "Tradition & Vertrauen", icon: <Building2 className="w-4 h-4" /> },
  { id: 42, title: "Reinigung mit Garantie", description: "Professionelle Endreinigung mit Abnahmegarantie — oder kostenlose Nachbesserung.", trigger: "Risikofrei", icon: <Paintbrush className="w-4 h-4" /> },
  { id: 43, title: "Schlüsselübergabe-Protokoll", description: "Digitale Dokumentation der Schlüsselübergabe mit Zeitstempel und Foto.", trigger: "Lückenlose Dokumentation", icon: <Key className="w-4 h-4" /> },
  { id: 44, title: "Umzugs-Checkliste KI", description: "Personalisierte 30-Tage-Checkliste basierend auf Umzugsdatum und Situation.", trigger: "Orientierung & Struktur", icon: <BookOpen className="w-4 h-4" /> },
  { id: 45, title: "Nachhaltige Entsorgung", description: "Recycling-optimierte Räumung mit dokumentierter Entsorgung nach Schweizer Standards.", trigger: "Umweltbewusstsein", icon: <Leaf className="w-4 h-4" /> },
  { id: 46, title: "Echtzeit-Tracking", description: "Live-Status des Umzugs-Fortschritts — von Beladung bis Übergabe.", trigger: "Kontrolle & Transparenz", icon: <Wifi className="w-4 h-4" /> },
  { id: 47, title: "Kantonale Regulationen", description: "Automatische Anpassung an 26 verschiedene Kantons-Vorschriften (Fristen, Feiertage, eUmzug).", trigger: "Lokale Kompetenz", icon: <Database className="w-4 h-4" /> },
  { id: 48, title: "WhatsApp Direktkontakt", description: "Sofortige Kommunikation ohne Warteschleife — direkt per WhatsApp zum Team.", trigger: "Erreichbarkeit", icon: <Handshake className="w-4 h-4" /> },
  { id: 49, title: "Kostenlos & Unverbindlich", description: "Alle Offerten, Rechner und Vergleiche ohne Kosten und ohne Verpflichtung.", trigger: "Keine Eintrittsbarriere", icon: <RefreshCw className="w-4 h-4" /> },
  { id: 50, title: "Continuous Improvement", description: "5-Run Optimierungsmethodik: Jeder Funnel wird iterativ verbessert bis Score ≥ 85.", trigger: "Wissenschaftliche Exzellenz", icon: <Search className="w-4 h-4" /> },
];

function Tier1Card({ usp }: { usp: USP }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-2 border-primary/30 rounded-2xl p-6 hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          {usp.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary/60">#{usp.id}</span>
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
              {usp.trigger}
            </Badge>
          </div>
          <h4 className="text-base font-bold text-foreground mb-1">{usp.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{usp.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Tier2Card({ usp }: { usp: USP }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-muted/50 border border-border/50 rounded-xl p-4 hover:border-secondary/40 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
          {usp.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-muted-foreground">#{usp.id}</span>
            <span className="text-[10px] text-secondary/80 font-medium">{usp.trigger}</span>
          </div>
          <h4 className="text-sm font-semibold text-foreground">{usp.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{usp.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Tier3Card({ usp }: { usp: USP }) {
  return (
    <div className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-muted/40 transition-colors">
      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
        {usp.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-semibold text-foreground truncate">{usp.title}</h5>
        <p className="text-[10px] text-muted-foreground truncate">{usp.description}</p>
      </div>
      <span className="text-[9px] text-muted-foreground/60 hidden sm:block whitespace-nowrap">{usp.trigger}</span>
    </div>
  );
}

export function USPFrameworkSection() {
  const [showTier2, setShowTier2] = useState(false);
  const [showTier3, setShowTier3] = useState(false);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Layers className="w-3.5 h-3.5 mr-1" />
            50-Punkte USP Framework
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Die Architektur der emotionalen Resonanz
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            50 plattformspezifische USPs — von LIDAR-Scans über Smart Escrow bis zur Abnahmegarantie.
            Jede Ebene triggert spezifische kognitive Zustände: Faszination, Vertrauen, Sicherheit.
          </p>
        </motion.div>

        {/* ===== TIER 1: WHOA (10 USPs) ===== */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Sektion 1 — Die «Whoa»-Kategorie</h3>
              <p className="text-xs text-muted-foreground">10 Technologie-Innovationen mit massivem Impact · Sofortige viszerale Reaktion</p>
            </div>
            <Badge className="ml-auto bg-primary/10 text-primary text-xs">XL</Badge>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TIER1_USPS.map(usp => (
              <Tier1Card key={usp.id} usp={usp} />
            ))}
          </div>
        </div>

        {/* ===== TIER 2: CORE (20 USPs) ===== */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Sektion 2 — Plattform-Kernlogik</h3>
              <p className="text-xs text-muted-foreground">20 Funktionen · Lead-Routing, Revenue-Streams, Conversion-Optimierung</p>
            </div>
            <Badge className="ml-auto bg-secondary/10 text-secondary text-xs">M</Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTier2(!showTier2)}
            className="mb-4 min-h-[44px] w-full sm:w-auto gap-2"
          >
            {showTier2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showTier2 ? "Einklappen" : "20 Kern-USPs anzeigen"}
          </Button>

          <AnimatePresence>
            {showTier2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TIER2_USPS.map(usp => (
                    <Tier2Card key={usp.id} usp={usp} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===== TIER 3: FOUNDATION (20 USPs) ===== */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Sektion 3 — Schweizer Fundament</h3>
              <p className="text-xs text-muted-foreground">20 Funktionen · Compliance, Qualität, Vertrauen, operative Exzellenz</p>
            </div>
            <Badge className="ml-auto bg-muted text-muted-foreground text-xs">S</Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTier3(!showTier3)}
            className="mb-4 min-h-[44px] w-full sm:w-auto gap-2"
          >
            {showTier3 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showTier3 ? "Einklappen" : "20 Fundament-USPs anzeigen"}
          </Button>

          <AnimatePresence>
            {showTier3 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {TIER3_USPS.map(usp => (
                    <Tier3Card key={usp.id} usp={usp} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
