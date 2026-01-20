/**
 * Vision 10-Pillar Section
 * Two structured lists: Customer USPs & Investor USPs
 * Based on comprehensive AI feedback synthesis
 * Enhanced with visual comparisons and revenue stacking
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Shield, FileText, Sparkles, Recycle, 
  Scale, MapPin, ShieldCheck, Headphones, Wrench,
  Brain, Landmark, TrendingUp, Building2, Plug,
  Server, Umbrella, Package, Database, Cpu,
  Users, ChevronRight, Check, X, Zap, Target,
  ArrowRight, Star, Trophy, Rocket, Heart
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// ============================================
// LISTE 1: 10 USPs FÜR KUNDEN
// ============================================
const customerUSPs = [
  {
    id: 1,
    icon: Video,
    title: "Der «Magische Blick»",
    subtitle: "AI Video-Analyse",
    description: "Sie filmen einmal mit dem Handy durch die Wohnung. Keine fremden Leute im Haus, keine Termine.",
    benefit: "Die KI erkennt jeden Schrank und jede Kiste automatisch und berechnet exakt, wie gross der LKW sein muss.",
    unique: "Nie wieder falsche Angebote, weil jemand den Keller «vergessen» hat.",
    future: "Die KI erkennt Marke & Wert Ihrer Möbel und schlägt vor: «Das Sofa passt nicht – soll ich es für 200 CHF verkaufen?»",
    emoji: "📹",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    icon: Shield,
    title: "Der «Sicherheits-Tresor»",
    subtitle: "Treuhand-Zahlung",
    description: "Sie überweisen das Geld auf ein gesichertes Konto bei uns – nicht an die Umzugsfirma.",
    benefit: "Die Firma bekommt ihr Geld erst, wenn der Umzug fertig ist und Sie «Alles okay» klicken.",
    unique: "100% Schutz vor Betrug oder Firmen, die nach Vorkasse verschwinden.",
    future: "Smart Contracts zahlen automatisch aus, wenn das GPS des LKWs die Zieladresse bestätigt.",
    emoji: "🔐",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 3,
    icon: FileText,
    title: "Der «Bürokratie-Butler»",
    subtitle: "Autopilot für Papierkram",
    description: "Ein Klick – wir melden Sie bei der Gemeinde um, kündigen Strom und bestellen Internet.",
    benefit: "Sie sparen sich Stunden in Warteschleifen und auf Ämtern.",
    unique: "Wir sind nicht nur Transport, wir sind Ihre digitale Sekretärin.",
    future: "Die KI kündigt automatisch alte Versicherungen und schliesst günstigere am neuen Ort ab.",
    emoji: "🤖",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    id: 4,
    icon: Sparkles,
    title: "Die «Alles-Glänzt»-Garantie",
    subtitle: "Zertifizierte Endreinigung",
    description: "Wir organisieren die Putzfirma für die alte Wohnung – mit Abnahmegarantie.",
    benefit: "Wenn der Vermieter meckert, kommt die Firma kostenlos nach. Ohne Sie.",
    unique: "Sie geben nur den Schlüssel ab. Der Stress bleibt bei uns.",
    future: "Die KI analysiert das Abnahmeprotokoll auf ungerechtfertigte Forderungen.",
    emoji: "✨",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 5,
    icon: Recycle,
    title: "Der Entrümpelungs-Knopf",
    subtitle: "Circular Economy",
    description: "Vor dem Umzug markieren Sie auf dem Video, was weg kann. Wir holen es ab.",
    benefit: "Sie starten ohne Altlasten und der Umzug wird billiger (weniger Volumen).",
    unique: "Wir kümmern uns um den «Müll», bevor er eingepackt wird.",
    future: "Die KI bewertet Möbelwert und postet automatisch auf Ricardo/Tutti.",
    emoji: "♻️",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    id: 6,
    icon: Scale,
    title: "Der «Fair-Preis-Wächter»",
    subtitle: "Transparenter Marktplatz",
    description: "Sie bekommen nicht eine Offerte, sondern 5 geprüfte Angebote nebeneinander.",
    benefit: "Sie sehen sofort, wer fair ist. Kein Preis-Dschungel mehr.",
    unique: "Unsere KI filtert unrealistische Billig-Angebote sofort raus.",
    future: "Live-Auktion: Sie sehen zu, wie Firmen um Ihren Auftrag bieten.",
    emoji: "⚖️",
    gradient: "from-orange-500 to-amber-500"
  },
  {
    id: 7,
    icon: MapPin,
    title: "Der «Neue-Heimat»-Guide",
    subtitle: "Relocation Intelligence",
    description: "Eine interaktive Karte zeigt: Bester Bäcker, Müllabfuhr, nächster Arzt.",
    benefit: "Sie fühlen sich ab Tag 1 zuhause und müssen nicht suchen.",
    unique: "Wir liefern das Wissen der Nachbarn digital mit.",
    future: "Sie fragen die App «Wo gibts Pizza?» – sie reserviert einen Tisch.",
    emoji: "🗺️",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: 8,
    icon: ShieldCheck,
    title: "Versicherung, die zahlt",
    subtitle: "Smart Insurance",
    description: "Wir haben ein Video vom Zustand Ihrer Möbel – vor dem Umzug.",
    benefit: "Wenn etwas kaputt geht, zahlt die Versicherung sofort. Der Beweis ist da.",
    unique: "Keine Formular-Schlachten mit Versicherungen.",
    future: "KI vergleicht Vorher/Nachher-Video und zahlt Kleinschäden automatisch aus.",
    emoji: "🛡️",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    id: 9,
    icon: Headphones,
    title: "Immer erreichbar",
    subtitle: "Omni-Channel Concierge",
    description: "WhatsApp, Telefon oder Chat – Sie kriegen sofort Antwort. Keine Warteschleife.",
    benefit: "Wenn Sie nervös sind («Wo bleibt der LKW?»), sind wir da.",
    unique: "KI löst 95% der Probleme sofort, für den Rest ist ein Mensch da.",
    future: "Eine KI-Stimme ruft für Sie beim Internetanbieter an und wartet in der Warteschleife.",
    emoji: "🎧",
    gradient: "from-rose-500 to-pink-500"
  },
  {
    id: 10,
    icon: Wrench,
    title: "Möbel-Taxi & Montage",
    subtitle: "Handyman Service",
    description: "Lampen abmontieren, Bilder aufhängen, IKEA-Schrank aufbauen.",
    benefit: "Sie müssen am Umzugstag keinen Schraubenzieher anfassen.",
    unique: "Die KI erkennt auf dem Video: «Pax-Schrank = 45 Min Montagezeit» und plant das ein.",
    future: "«Uber für Möbel»: Der nächste freie Transporter holt das vergessene Sofa in 15 Min.",
    emoji: "🔧",
    gradient: "from-amber-500 to-orange-500"
  }
];

// ============================================
// LISTE 2: 10 SÄULEN FÜR INVESTOREN
// ============================================
const investorPillars = [
  {
    id: 1,
    icon: Brain,
    title: "Computer Vision Asset",
    subtitle: "AI Acquisition Engine",
    concept: "Proprietäre Datenbasis aus Millionen Videos – Tech-Monopol auf Inventar-Erkennung.",
    financials: "Lizenz: 20 CHF/Scan. Spart Firmen ~150 CHF pro Besichtigung.",
    keyMetric: "CAC -80%",
    automation: 100,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    icon: Landmark,
    title: "Fintech & Escrow",
    subtitle: "Cashflow-Hebel",
    concept: "Wir kontrollieren den Geldfluss (GMV). Wir sind nicht nur Makler, wir sind die Bank.",
    financials: "Float & Fees: 2'000 CHF Float + 1.5% Fee (30 CHF/Transaktion).",
    keyMetric: "Zero Leakage",
    automation: 95,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "Dynamic Pricing Engine",
    subtitle: "Yield Management",
    concept: "Wir diktieren Marktpreise basierend auf Angebot/Nachfrage (wie Uber Surge).",
    financials: "Standard: 15% Take-Rate. Peak: 20-25%. +10% Umsatz.",
    keyMetric: "+10% Revenue",
    automation: 100,
    gradient: "from-orange-500 to-amber-500"
  },
  {
    id: 4,
    icon: Building2,
    title: "B2B / HR-Relocation Suite",
    subtitle: "High Value LTV",
    concept: "SaaS für HR-Abteilungen (Expat-Umzüge). Hohe Warenkörbe.",
    financials: "Abo 500 CHF/Monat + Provision ~3'000 CHF/Umzug.",
    keyMetric: "10 Firmen = 500 Kunden",
    automation: 90,
    gradient: "from-violet-500 to-purple-500"
  },
  {
    id: 5,
    icon: Plug,
    title: "Bureaucracy API Layer",
    subtitle: "Recurring Revenue",
    concept: "Direkte Schnittstellen zu Behörden & Versorgern. Schwer kopierbar.",
    financials: "Service: 49 CHF/Kunde + 100 CHF Affiliate (Telco/Strom).",
    keyMetric: "95% Marge",
    automation: 99,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 6,
    icon: Server,
    title: "Partner Operating System",
    subtitle: "Vendor Lock-in",
    concept: "Umzugsfirmen nutzen unsere Dispo-Software. Wechselkosten extrem hoch.",
    financials: "SaaS: 99 CHF/Monat + 15% Provision (225 CHF/Umzug).",
    keyMetric: "99 CHF MRR",
    automation: 90,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: 7,
    icon: Umbrella,
    title: "Micro-Insurance",
    subtitle: "Insurtech Margin",
    concept: "Sekundengenaue Policen basierend auf Videodaten. Wir kennen das Risiko.",
    financials: "Prämie: 50-99 CHF. Schadenquote niedrig. Marge: ~60%.",
    keyMetric: "60% Marge",
    automation: 90,
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    id: 8,
    icon: Package,
    title: "Circular Economy Hub",
    subtitle: "Pre-Move Disposal",
    concept: "Monetarisierung von Altmöbeln. Doppelte Einnahmequelle.",
    financials: "Entsorgungsgebühr: 50-200 CHF + Resale: 20%.",
    keyMetric: "Double Revenue",
    automation: 80,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    id: 9,
    icon: Database,
    title: "Relocation Data Intelligence",
    subtitle: "Data Monetization",
    concept: "Wir wissen als Erste, wer wohin zieht und wie kaufkräftig.",
    financials: "Lead-Verkauf: 50-150 CHF (3× verkaufbar).",
    keyMetric: "150 CHF/Lead",
    automation: 100,
    gradient: "from-rose-500 to-pink-500"
  },
  {
    id: 10,
    icon: Cpu,
    title: "Lean Operations",
    subtitle: "Die 95/5 Formel",
    concept: "Umsatz wächst, Headcount bleibt flach. Exponentielle Profitabilität.",
    financials: "3 Mitarbeiter für 10'000 Umzüge. Spart ~2 Mio CHF/Jahr.",
    keyMetric: ">40% EBITDA",
    automation: 95,
    gradient: "from-amber-500 to-orange-500"
  }
];

// Comparison data: Classic vs. Umzugscheck
const comparisonData = [
  { feature: "Inventar-Aufnahme", classic: "Hausbesuch (2h + 150 CHF)", us: "2 Min Video-Scan", winner: "us" },
  { feature: "Preisvergleich", classic: "3 Anrufe, 3 Tage warten", us: "5 Offerten in 24h", winner: "us" },
  { feature: "Zahlungssicherheit", classic: "Vorkasse an Firma", us: "Treuhand-Konto", winner: "us" },
  { feature: "Bürokratie", classic: "Selbst erledigen", us: "1-Klick Autopilot", winner: "us" },
  { feature: "Endreinigung", classic: "Selbst organisieren", us: "Mit Garantie inklusive", winner: "us" },
  { feature: "Versicherung", classic: "Streit bei Schäden", us: "Video-Beweis = sofort Geld", winner: "us" }
];

// Revenue Stacking Data
const revenueStack = [
  { label: "Basis-Provision", value: 225, color: "bg-blue-500" },
  { label: "Escrow/Fintech", value: 30, color: "bg-green-500" },
  { label: "Versicherung", value: 99, color: "bg-violet-500" },
  { label: "Bürokratie", value: 49, color: "bg-pink-500" },
  { label: "Lead-Verkauf", value: 100, color: "bg-amber-500" },
  { label: "Circular Economy", value: 50, color: "bg-emerald-500" }
];

const totalRevenue = revenueStack.reduce((sum, item) => sum + item.value, 0);
const totalCosts = 50;
const profit = totalRevenue - totalCosts;

// Customer USP Card Component
const CustomerUSPCard = memo(({ usp, index }: { usp: typeof customerUSPs[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.03, duration: 0.4 }}
    className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300"
  >
    {/* Gradient top bar */}
    <div className={`h-1.5 bg-gradient-to-r ${usp.gradient}`} />
    
    <div className="p-5">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${usp.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <span className="text-2xl">{usp.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              #{usp.id}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium truncate">
              {usp.subtitle}
            </span>
          </div>
          <h3 className="font-bold text-lg text-foreground leading-tight">{usp.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {usp.description}
      </p>

      {/* Benefit Box */}
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-start gap-2">
          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{usp.benefit}</span>
        </p>
      </div>

      {/* Unique & Future */}
      <div className="space-y-3 text-xs">
        <div className="flex items-start gap-2">
          <Star className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Einzigartig:</span> {usp.unique}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Rocket className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground/80 italic">
            <span className="font-medium">Vision:</span> {usp.future}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
));

CustomerUSPCard.displayName = 'CustomerUSPCard';

// Investor Pillar Card Component
const InvestorPillarCard = memo(({ pillar, index }: { pillar: typeof investorPillars[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.03, duration: 0.4 }}
    className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300"
  >
    {/* Gradient top bar */}
    <div className={`h-1.5 bg-gradient-to-r ${pillar.gradient}`} />
    
    <div className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <pillar.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Säule {pillar.id}
              </span>
            </div>
            <h3 className="font-bold text-lg text-foreground leading-tight">{pillar.title}</h3>
            <p className="text-xs text-muted-foreground">{pillar.subtitle}</p>
          </div>
        </div>
        
        {/* Automation Badge */}
        <div className="flex flex-col items-end">
          <div className="text-xs font-bold text-primary">{pillar.automation}%</div>
          <div className="text-[10px] text-muted-foreground">KI-Grad</div>
          <div className="w-12 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${pillar.gradient} rounded-full`}
              style={{ width: `${pillar.automation}%` }}
            />
          </div>
        </div>
      </div>

      {/* Concept */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {pillar.concept}
      </p>

      {/* Financials Box */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-green-700 dark:text-green-400">
            💰 {pillar.financials}
          </p>
        </div>
      </div>

      {/* Key Metric */}
      <div className="flex items-center justify-center">
        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r ${pillar.gradient} text-white text-sm font-bold shadow-lg`}>
          <Zap className="w-4 h-4" />
          {pillar.keyMetric}
        </span>
      </div>
    </div>
  </motion.div>
));

InvestorPillarCard.displayName = 'InvestorPillarCard';

// Comparison Table Component
const ComparisonTable = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-card border border-border rounded-2xl overflow-hidden mb-10"
  >
    <div className="bg-muted/50 px-6 py-4 border-b border-border">
      <h3 className="font-bold text-lg text-center">
        ⚔️ Klassischer Umzug vs. Umzugscheck.ch
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-3 font-semibold">Feature</th>
            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Klassisch</th>
            <th className="text-center px-4 py-3 font-semibold text-primary">Umzugscheck.ch</th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((row, idx) => (
            <tr key={idx} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="px-4 py-3 font-medium">{row.feature}</td>
              <td className="px-4 py-3 text-center text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <X className="w-4 h-4 text-red-400" />
                  {row.classic}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                  <Check className="w-4 h-4" />
                  {row.us}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
));

ComparisonTable.displayName = 'ComparisonTable';

// Revenue Stacking Visualization
const RevenueStackingCard = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-gradient-to-br from-primary/5 via-primary/10 to-violet-500/10 border-2 border-primary/20 rounded-2xl p-6 md:p-8"
  >
    <div className="text-center mb-8">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
        <Trophy className="w-4 h-4" />
        Revenue Stacking
      </span>
      <h3 className="text-2xl font-bold">
        💎 Unit Economics pro Kunde
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        6 Umsatzströme aus einer Kundenbeziehung
      </p>
    </div>
    
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      {/* Visual Stack */}
      <div className="space-y-2">
        {revenueStack.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="relative"
          >
            <div 
              className={`h-10 ${item.color} rounded-lg flex items-center justify-between px-4 text-white text-sm font-medium shadow-md`}
              style={{ width: `${(item.value / totalRevenue) * 100}%`, minWidth: "180px" }}
            >
              <span className="truncate">{item.label}</span>
              <span className="font-bold">+{item.value} CHF</span>
            </div>
          </motion.div>
        ))}
        
        {/* Costs */}
        <div className="mt-4 pt-4 border-t-2 border-dashed border-border">
          <div className="h-10 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg flex items-center justify-between px-4 text-red-600 dark:text-red-400 text-sm font-medium" style={{ width: "60px" }}>
            <span>Kosten</span>
            <span className="font-bold">-{totalCosts} CHF</span>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <div className="text-2xl font-bold text-green-600">{totalRevenue}</div>
            <div className="text-xs text-muted-foreground">Umsatz CHF</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-500">-{totalCosts}</div>
            <div className="text-xs text-muted-foreground">Kosten CHF</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">=&nbsp;{profit}</div>
            <div className="text-xs text-muted-foreground">Profit CHF</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary to-violet-600 rounded-xl p-6 text-white">
          <div className="text-5xl font-bold mb-2">15×</div>
          <div className="text-sm opacity-90">
            mehr Gewinn pro Kunde als klassische Vermittler
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          Klassischer Vermittler: ~20 CHF Gewinn/Kunde
        </p>
      </div>
    </div>
  </motion.div>
));

RevenueStackingCard.displayName = 'RevenueStackingCard';

// Key Stats Bar
const KeyStatsBar = memo(({ type }: { type: "customer" | "investor" }) => {
  const customerStats = [
    { value: "95%", label: "KI-Automatisierung" },
    { value: "2 Min", label: "Video-Scan" },
    { value: "100%", label: "Sicherheit" },
    { value: "5+", label: "Offerten" }
  ];
  
  const investorStats = [
    { value: "553 CHF", label: "Revenue/Kunde" },
    { value: ">40%", label: "EBITDA-Ziel" },
    { value: "95%", label: "Automatisiert" },
    { value: "15×", label: "mehr Profit" }
  ];
  
  const stats = type === "customer" ? customerStats : investorStats;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
});

KeyStatsBar.displayName = 'KeyStatsBar';

// Main Component
export const Vision10PillarSection = memo(() => {
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
            <Target className="w-4 h-4" />
            Das 10-Säulen-Modell
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Nicht nur Umzug. <br className="md:hidden" />
            <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              Lebenswechsel.
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            95% Künstliche Intelligenz. 100% Sorgenfrei. <br className="hidden md:block" />
            Wir sind das <span className="font-semibold text-foreground">Betriebssystem für den Wohnortswechsel.</span>
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10 h-14 p-1 bg-muted/50 border border-border">
            <TabsTrigger 
              value="customers" 
              className="text-sm md:text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg h-12 transition-all"
            >
              <Heart className="w-4 h-4 mr-2" />
              Für Sie
            </TabsTrigger>
            <TabsTrigger 
              value="investors"
              className="text-sm md:text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg h-12 transition-all"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Für Investoren
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Customer USPs */}
            <TabsContent value="customers" className="mt-0 focus-visible:outline-none">
              <motion.div
                key="customers"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Intro */}
                <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8 text-center">
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    <span className="font-bold text-foreground text-lg">Für Menschen, die Sicherheit wollen:</span>
                    <br className="hidden md:block" />
                    Stellen Sie sich vor, Sie ziehen um, aber müssen <span className="text-primary font-semibold">keine Kisten zählen</span>, 
                    <span className="text-primary font-semibold"> keine Formulare ausfüllen</span> und 
                    <span className="text-primary font-semibold"> keinem Handwerker hinterhertelefonieren.</span>
                  </p>
                </div>
                
                {/* Stats Bar */}
                <KeyStatsBar type="customer" />
                
                {/* Comparison Table */}
                <ComparisonTable />
                
                {/* USP Grid */}
                <div className="grid md:grid-cols-2 gap-5">
                  {customerUSPs.map((usp, index) => (
                    <CustomerUSPCard key={usp.id} usp={usp} index={index} />
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12 text-center"
                >
                  <Link to="/umzugsofferten">
                    <Button size="lg" className="h-14 px-10 text-base font-bold bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-xl">
                      Jetzt Offerten vergleichen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-3">
                    100% kostenlos & unverbindlich
                  </p>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Investor Pillars */}
            <TabsContent value="investors" className="mt-0 focus-visible:outline-none">
              <motion.div
                key="investors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Intro */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-8 text-center">
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    <span className="font-bold text-foreground text-lg">Für Investoren:</span>
                    <br className="hidden md:block" />
                    Wir transformieren einen <span className="text-green-600 font-semibold">fragmentierten Low-Tech Markt</span> in ein 
                    <span className="text-green-600 font-semibold"> hochprofitables Data- & Fintech-Ökosystem.</span>
                    <br className="hidden md:block" />
                    Unser Asset ist die <span className="font-bold text-foreground">Datenhoheit über den Lebenswechsel.</span>
                  </p>
                </div>
                
                {/* Stats Bar */}
                <KeyStatsBar type="investor" />
                
                {/* Pillar Grid */}
                <div className="grid md:grid-cols-2 gap-5 mb-10">
                  {investorPillars.map((pillar, index) => (
                    <InvestorPillarCard key={pillar.id} pillar={pillar} index={index} />
                  ))}
                </div>

                {/* Revenue Stacking */}
                <RevenueStackingCard />

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12 text-center"
                >
                  <Link to="/fuer-firmen">
                    <Button size="lg" variant="outline" className="h-14 px-10 text-base font-bold border-2 border-primary hover:bg-primary hover:text-white transition-all">
                      Partner werden
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-3">
                    Werden Sie Teil des Ökosystems
                  </p>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
});

Vision10PillarSection.displayName = 'Vision10PillarSection';
