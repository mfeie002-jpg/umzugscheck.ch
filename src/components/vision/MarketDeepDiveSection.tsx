import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, AlertTriangle, Globe, Shield, Database, Smartphone,
  DollarSign, Users, Scale, Clock, Languages, FileWarning, Zap,
  CheckCircle2, XCircle, MinusCircle, ChevronDown, MapPin, Lock,
  Leaf, Building2, Heart, Camera, Calendar, FileText, Calculator,
  MessageSquare, Star, Layers, BarChart3, Search
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MarketSizeBarChart, CompetitorRadarChart, PainPointsChart } from "./InvestorCharts";

// ─── Block 1: Market Size Stats ───
const MARKET_STATS = [
  { label: "TAM Schweizer Umzugsmarkt", value: "CHF 500M–1B+", icon: TrendingUp },
  { label: "Umzüge pro Jahr (BFS 2024)", value: "697'000", icon: Users },
  { label: "Mobilitätsrate Schweiz", value: "9.3%", icon: BarChart3 },
  { label: "Professionelle Umzüge", value: "130k–200k", icon: Building2 },
  { label: "Ø Umzugskosten", value: "CHF 1'200–1'750", icon: DollarSign },
  { label: "Ø Endreinigung", value: "CHF 500–2'000", icon: Star },
];

const REGIONAL_PRICES = [
  { region: "Kanton Zug", price: ">CHF 2'000", highlight: true },
  { region: "DE-CH vs. Romandie", price: "+23% teurer", highlight: false },
  { region: "Expat-Umzugsrate", price: "15.2% vs. 8.7%", highlight: false },
  { region: "Peak Season", price: "+20–40% Aufpreis", highlight: true },
];

// ─── Block 2: Competitor Landscape ───
type Feature = "Haftungsgarantie" | "Qualitäts-Vetting" | "Echtzeit-Buchung" | "4-Sprachen" | "Gemeinde-DB" | "Dispute Resolution" | "Preisdeckel" | "App/Digital-First";

const COMPETITORS: { name: string; features: Record<Feature, "yes" | "no" | "partial"> }[] = [
  {
    name: "MOVU/MoveAgain",
    features: { "Haftungsgarantie": "no", "Qualitäts-Vetting": "partial", "Echtzeit-Buchung": "no", "4-Sprachen": "partial", "Gemeinde-DB": "no", "Dispute Resolution": "no", "Preisdeckel": "no", "App/Digital-First": "partial" }
  },
  {
    name: "Comparis",
    features: { "Haftungsgarantie": "no", "Qualitäts-Vetting": "no", "Echtzeit-Buchung": "no", "4-Sprachen": "partial", "Gemeinde-DB": "no", "Dispute Resolution": "no", "Preisdeckel": "no", "App/Digital-First": "no" }
  },
  {
    name: "Ofri",
    features: { "Haftungsgarantie": "no", "Qualitäts-Vetting": "partial", "Echtzeit-Buchung": "no", "4-Sprachen": "no", "Gemeinde-DB": "no", "Dispute Resolution": "no", "Preisdeckel": "no", "App/Digital-First": "no" }
  },
  {
    name: "Umzugscheck ✓",
    features: { "Haftungsgarantie": "yes", "Qualitäts-Vetting": "yes", "Echtzeit-Buchung": "yes", "4-Sprachen": "yes", "Gemeinde-DB": "yes", "Dispute Resolution": "yes", "Preisdeckel": "yes", "App/Digital-First": "yes" }
  },
];

const FEATURES_LIST: Feature[] = ["Haftungsgarantie", "Qualitäts-Vetting", "Echtzeit-Buchung", "4-Sprachen", "Gemeinde-DB", "Dispute Resolution", "Preisdeckel", "App/Digital-First"];

// ─── Block 3: Consumer Pain Points ───
const PAIN_POINTS = [
  { icon: DollarSign, title: "Preisopazität", stat: "30–50%", desc: "Varianz zwischen Offerten für identische Umzüge. Versteckte Zuschläge inflaten Rechnungen um 50–100%." },
  { icon: Shield, title: "Null Qualitätshaftung", stat: "CHF 17.50", desc: "Entschädigung für beschädigte Möbel. Plattformen lehnen jede Verantwortung ab." },
  { icon: AlertTriangle, title: "Wohnungsübergabe-Stress", stat: "10%", desc: "der Mieter ziehen aus stark verschmutzten Wohnungen aus. Abnahme-Garantien sind rar." },
  { icon: Clock, title: "Kurze Planungszeit", stat: "42%", desc: "der Umzügler beginnen erst <30 Tage vorher mit der Planung — zu spät zum Vergleichen." },
  { icon: Languages, title: "Sprachbarrieren", stat: "26%", desc: "der Bevölkerung sind Ausländer. FR/IT/EN-Angebote fehlen fast komplett." },
  { icon: Smartphone, title: "Keine digitalen Standards", stat: "0", desc: "Schweizer Umzugs-Apps existieren. Cash-Zahlung dominiert. Keine Echtzeit-Buchung." },
  { icon: FileWarning, title: "Keine Lizenzpflicht", stat: "~40", desc: "von tausenden Firmen haben SMA-Zertifizierung. Jeder kann eine Umzugsfirma gründen." },
];

// ─── Block 4: Digital Gaps ───
const DIGITAL_GAPS = [
  { icon: Calendar, title: "Keine Echtzeit-Verfügbarkeit", desc: "Kein Kalender-Booking wie bei Restaurants oder Hotels" },
  { icon: Database, title: "Kein Gemeinde-Daten-Hub", desc: "2'110 Gemeinden — keine zentrale Infoquelle für Anmeldung, Gebühren, Formulare" },
  { icon: Globe, title: "FR/IT/EN massiv unterversorgt", desc: "Ticino hat quasi null digitale Umzugs-Konkurrenz, Expats finden nichts" },
  { icon: DollarSign, title: "Cash-only Branche", desc: "Digitale Zahlung (TWINT) ist Ausnahme, nicht Standard" },
  { icon: Smartphone, title: "Keine App", desc: "Keine standalone Umzugs-App in der Schweiz — weder für Kunden noch für Firmen" },
];

// ─── Block 5: 21 Competitive Advantages ───
interface Advantage {
  title: string;
  desc: string;
  icon: typeof Database;
}

const ADVANTAGE_CATEGORIES: { category: string; icon: typeof Database; color: string; items: Advantage[] }[] = [
  {
    category: "Daten-Moats",
    icon: Database,
    color: "from-primary/20 to-primary/5",
    items: [
      { title: "2'110 Gemeinde-Datenbank", desc: "Strukturierte Daten zu Anmeldung, Gebühren, Formulare pro Gemeinde — massiver SEO-Moat", icon: MapPin },
      { title: "Kantons-Regulations-Navigator", desc: "26 Kantone, 42 Prämienregionen, unterschiedliche Regeln — alles strukturiert und aktuell", icon: Search },
      { title: "Verifizierte Kosten-Benchmarks", desc: "Anonymisierte echte Preisdaten nach Grösse, Route, Saison — das Glassdoor für Umzugskosten", icon: BarChart3 },
    ]
  },
  {
    category: "Trust & Garantien",
    icon: Shield,
    color: "from-green-500/20 to-green-500/5",
    items: [
      { title: "Finanzielle Qualitätsgarantie", desc: "Geld-zurück wenn Firma nicht kommt, zu spät ist oder mehr verlangt. Per Escrow abgesichert.", icon: Lock },
      { title: "Integrierte Dispute Resolution", desc: "In-Platform Streitschlichtung mit Fotobeweisen und Mediation — kein Konkurrent bietet das", icon: Scale },
      { title: "Maximaler Preisdeckel", desc: "Vertraglich garantiert: keine Zusatzkosten am Umzugstag über der vereinbarten Offerte", icon: Shield },
      { title: "Mystery Shopping Audits", desc: "Quartalsweise verdeckte Qualitätsprüfungen mit automatischer Suspendierung bei Mängeln", icon: Star },
    ]
  },
  {
    category: "Ökosystem",
    icon: Layers,
    color: "from-secondary/20 to-secondary/5",
    items: [
      { title: "One-Click Adresswechsel", desc: "Gemeinde, Post, Krankenkasse, Bank, Versicherung — alles in einer Schnittstelle", icon: Zap },
      { title: "Reinigung + Abnahmegarantie 2.0", desc: "Professionelle Reinigung mit digitaler Übergabe-Dokumentation und Nachbesserungsgarantie", icon: CheckCircle2 },
      { title: "Möbel-Lifecycle-Management", desc: "Entsorgen, Spenden, Verkaufen — verbunden mit dem Umzugs-Ökosystem und Gemeinde-Regeln", icon: Heart },
      { title: "Versicherungs-Optimierer", desc: "Krankenkassen-Prämienregion, Hausrat/Haftpflicht-Update, Moving-Gap-Versicherung", icon: Calculator },
    ]
  },
  {
    category: "Unterversorgte Segmente",
    icon: Users,
    color: "from-purple-500/20 to-purple-500/5",
    items: [
      { title: "4-Sprachen Coverage (DE/FR/IT/EN)", desc: "30%+ der Bevölkerung ist heute digital unterversorgt beim Thema Umzug", icon: Globe },
      { title: "Expat-Spezialmodul", desc: "Permit-spezifische Anleitung, Migrationsamt-Prozesse, 3-Monats-Krankenversicherungs-Deadline", icon: Users },
      { title: "Senioren-Umzug & Downsizing", desc: "Spezialisierte Inhalte, geprüfte seniorenfreundliche Umzugsfirmen, Familien-Koordination", icon: Heart },
    ]
  },
  {
    category: "Digital-First Features",
    icon: Smartphone,
    color: "from-blue-500/20 to-blue-500/5",
    items: [
      { title: "AI Video/Foto Volume-Scan", desc: "3-4 Fotos pro Raum → sofortige Volumenberechnung und bindende Offerte ohne Hausbesuch", icon: Camera },
      { title: "Echtzeit-Verfügbarkeitskalender", desc: "Live-Slots von Partnerfirmen — buchen wie ein Restaurant, nicht wie ein Rückruf", icon: Calendar },
      { title: "Digitales Übergabe-Protokoll", desc: "Raum-für-Raum Foto-Dokumentation, Lebensdauertabelle-Referenz, digitale Unterschrift", icon: FileText },
      { title: "Umzugskosten-Steuerrechner", desc: "Kantonsspezifische Steuerabzugs-Berechnung — unterversorgtes Keyword mit hoher Conversion", icon: Calculator },
      { title: "Green Moving & CO₂-Tracking", desc: "E-Fahrzeuge, Carbon-Offset, Recycling-Integration — unbesetztes Positionierungs-Feld", icon: Leaf },
      { title: "B2B Corporate Relocation", desc: "Standardisierte Firmenpakete mit HR-Dashboard und Compliance-Reporting", icon: Building2 },
      { title: "Community Knowledge Network", desc: "Verifizierte Nutzer teilen Tipps pro Gemeinde — selbst-wachsender Content-Flywheel", icon: MessageSquare },
    ]
  },
];

// ─── Status Icon Helper ───
function StatusIcon({ status }: { status: "yes" | "no" | "partial" }) {
  if (status === "yes") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (status === "partial") return <MinusCircle className="w-4 h-4 text-yellow-500" />;
  return <XCircle className="w-4 h-4 text-red-500" />;
}

// ─── Collapsible Category ───
function AdvantageCategory({ cat, defaultOpen }: { cat: typeof ADVANTAGE_CATEGORIES[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const Icon = cat.icon;

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", cat.color)}>
            <Icon className="w-5 h-5 text-foreground" />
          </div>
          <div className="text-left">
            <span className="font-bold text-foreground">{cat.category}</span>
            <span className="text-xs text-muted-foreground ml-2">({cat.items.length} Vorteile)</span>
          </div>
        </div>
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4 grid gap-3">
          {cat.items.map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                <ItemIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-sm text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  <Badge variant="outline" className="mt-1.5 text-[10px] border-primary/30 text-primary">
                    Kein Konkurrent hat das
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───
export function MarketDeepDiveSection() {
  return (
    <section className="py-16 bg-slate-950 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-red-500/20 text-red-300 border-red-500/30 text-xs">
            DEEP RESEARCH — Verifizierte Marktdaten
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            CHF 500M+ Markt mit Vertrauenskrise
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            — und 21 exploitable Lücken, die kein Konkurrent adressiert
          </p>
        </motion.div>

        {/* ── BLOCK 1: Market Size ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Marktgrösse mit harten Zahlen
          </h3>
          {/* Market Size Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Umzüge pro Jahr nach Segment</h4>
            <MarketSizeBarChart />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {MARKET_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                  <Icon className="w-5 h-5 text-primary mb-2" />
                  <div className="text-xl md:text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {REGIONAL_PRICES.map((r, i) => (
              <div key={i} className={cn(
                "rounded-lg p-3 text-center border",
                r.highlight ? "bg-secondary/10 border-secondary/30" : "bg-slate-900/50 border-slate-800"
              )}>
                <div className={cn("text-sm font-bold", r.highlight ? "text-secondary" : "text-white")}>{r.price}</div>
                <div className="text-xs text-slate-400 mt-0.5">{r.region}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── BLOCK 2: Competitor Landscape ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Wettbewerbs-Landschaft nach MOVU-MoveAgain Merger
          </h3>
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
            Sept 2025: Near-Monopol mit geerbten Problemen
          </Badge>
          
          {/* Competitor Radar Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mt-4 mb-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-2 text-center">Feature-Abdeckung im Vergleich</h4>
            <CompetitorRadarChart />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3 text-slate-400 font-medium">Feature</th>
                  {COMPETITORS.map((c, i) => (
                    <th key={i} className={cn(
                      "p-3 text-center font-bold",
                      c.name.includes("Umzugscheck") ? "text-primary bg-primary/5" : "text-slate-300"
                    )}>{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES_LIST.map((feature, fi) => (
                  <tr key={fi} className="border-b border-slate-800/50">
                    <td className="p-3 text-slate-300 text-xs font-medium">{feature}</td>
                    {COMPETITORS.map((c, ci) => (
                      <td key={ci} className={cn(
                        "p-3 text-center",
                        c.name.includes("Umzugscheck") && "bg-primary/5"
                      )}>
                        <div className="flex justify-center">
                          <StatusIcon status={c.features[feature]} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── BLOCK 3: 7 Pain Points ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            7 Schmerzpunkte der Schweizer Konsumenten
          </h3>
          
          {/* Pain Points Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Ausmass der Probleme</h4>
            <PainPointsChart />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PAIN_POINTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="bg-slate-900/80 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-red-400" />
                    <span className="font-bold text-sm text-white">{p.title}</span>
                  </div>
                  <div className="text-2xl font-black text-red-400 mb-1">{p.stat}</div>
                  <p className="text-xs text-slate-400">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── BLOCK 4: Digital Gaps ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Digitale Lücken = Unsere Chance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIGITAL_GAPS.map((g, i) => {
              const Icon = g.icon;
              return (
                <div key={i} className="bg-slate-900/80 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                  <Icon className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-white">{g.title}</div>
                    <p className="text-xs text-slate-400 mt-0.5">{g.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── BLOCK 5: 21 Competitive Advantages ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            21 Wettbewerbsvorteile — gruppiert
          </h3>
          <div className="grid gap-4">
            {ADVANTAGE_CATEGORIES.map((cat, i) => (
              <AdvantageCategory key={i} cat={cat} defaultOpen={i === 0} />
            ))}
          </div>
        </motion.div>

        {/* Footer Sources */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-slate-500">
            Quellen: BFS 2024, SRF Kassensturz, Comparis Umzugsstudie, Trustpilot Reviews, Handelszeitung, MOVU Umzugsstudie
          </p>
        </motion.div>
      </div>
    </section>
  );
}
