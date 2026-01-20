/**
 * Vision 10-Pillar Section
 * Two structured lists: Customer USPs & Investor USPs
 * Based on comprehensive AI feedback synthesis
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Video, Shield, FileText, Sparkles, Recycle, 
  Scale, MapPin, ShieldCheck, Headphones, Wrench,
  Brain, Landmark, TrendingUp, Building2, Plug,
  Server, Umbrella, Package, Database, Cpu,
  Users, ChevronRight
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
    color: "text-blue-600",
    bgColor: "bg-blue-50"
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
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    id: 3,
    icon: FileText,
    title: "Der «Papierkram-Roboter»",
    subtitle: "Bürokratie-Autopilot",
    description: "Ein Klick – wir melden Sie bei der Gemeinde um, kündigen Strom und bestellen Internet.",
    benefit: "Sie sparen sich Stunden in Warteschleifen und auf Ämtern.",
    unique: "Wir sind nicht nur Transport, wir sind Ihre digitale Sekretärin.",
    future: "Die KI kündigt automatisch alte Versicherungen und schliesst günstigere am neuen Ort ab.",
    color: "text-violet-600",
    bgColor: "bg-violet-50"
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
    color: "text-pink-600",
    bgColor: "bg-pink-50"
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
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
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
    color: "text-orange-600",
    bgColor: "bg-orange-50"
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
    color: "text-cyan-600",
    bgColor: "bg-cyan-50"
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
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
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
    color: "text-rose-600",
    bgColor: "bg-rose-50"
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
    color: "text-amber-600",
    bgColor: "bg-amber-50"
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
    financials: "Lizenz: 20 CHF/Scan. Spart Firmen ~150 CHF pro Besichtigung. Bei 10'000 Umzügen = 1.5 Mio CHF gespart.",
    automation: "100%",
    automationNote: "KI erkennt Inventar, berechnet Volumen (m³) und Montagezeit. Kein Mensch involviert.",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: 2,
    icon: Landmark,
    title: "Fintech & Escrow",
    subtitle: "Cashflow-Hebel",
    concept: "Wir kontrollieren den Geldfluss (GMV). Wir sind nicht nur Makler, wir sind die Bank.",
    financials: "Float & Fees: 2'000 CHF für 30 Tage (Zinsgewinn) + 1.5% Gebühr (30 CHF/Transaktion).",
    automation: "95%",
    automationNote: "Automatisierte Freigabe bei digitaler Unterschrift (Smart Contract).",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "Dynamic Pricing Engine",
    subtitle: "Yield Management",
    concept: "Wir diktieren Marktpreise basierend auf Angebot/Nachfrage (wie Uber Surge Pricing).",
    financials: "Standard: 15% Take-Rate. Peak-Zeiten: 20-25%. +10% Umsatz durch dynamische Preise.",
    automation: "100%",
    automationNote: "Algorithmus passt Preise in Echtzeit an (wie Flugtickets).",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    id: 4,
    icon: Building2,
    title: "B2B / HR-Relocation Suite",
    subtitle: "High Value LTV",
    concept: "SaaS für HR-Abteilungen (Expat-Umzüge). Hohe Warenkörbe, geringe Preissensibilität.",
    financials: "Abo 500 CHF/Monat + Provision ~3'000 CHF bei internationalen Umzügen. 10 Firmen = 500 Privatkunden.",
    automation: "90%",
    automationNote: "Automatisiertes Matching von Expats mit lokalen Services.",
    color: "text-violet-600",
    bgColor: "bg-violet-50"
  },
  {
    id: 5,
    icon: Plug,
    title: "Bureaucracy API Layer",
    subtitle: "Recurring Revenue",
    concept: "Direkte Schnittstellen zu Behörden & Versorgern. Schwer zu kopieren.",
    financials: "Service: 49 CHF/Kunde. Marge: 95% (reine Software). Affiliate: +100 CHF (Telco/Strom/Versicherung).",
    automation: "99%",
    automationNote: "Bots füllen Formulare bei Gemeinde, EWZ, Swisscom im Hintergrund aus.",
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  {
    id: 6,
    icon: Server,
    title: "Partner Operating System",
    subtitle: "Vendor Lock-in",
    concept: "Umzugsfirmen nutzen unsere Dispo-Software. Wechselkosten extrem hoch.",
    financials: "SaaS: 99 CHF/Monat + 15% Provision (225 CHF bei 1'500 CHF Umzug).",
    automation: "90%",
    automationNote: "Algorithmus matcht LKW-Leerkapazitäten mit Kundenanfragen (wie Uber).",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50"
  },
  {
    id: 7,
    icon: Umbrella,
    title: "Micro-Insurance",
    subtitle: "Insurtech Margin",
    concept: "Sekundengenaue Policen basierend auf Videodaten. Wir kennen das Risiko besser als Allianz.",
    financials: "Prämie: 50-99 CHF. Schadenquote niedrig dank KI. Marge: ~60%.",
    automation: "90%",
    automationNote: "KI vergleicht Vorher/Nachher-Video. Automatische Auszahlung bei Kleinschäden.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    id: 8,
    icon: Package,
    title: "Circular Economy Hub",
    subtitle: "Pre-Move Disposal",
    concept: "Monetarisierung von Altmöbeln. Doppelte Einnahmequelle.",
    financials: "Entsorgungsgebühr: 50-200 CHF + Resale Commission: 20% auf verkaufte Möbel.",
    automation: "80%",
    automationNote: "KI bewertet Möbelwert auf Video und postet automatisch auf Marktplätzen.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    id: 9,
    icon: Database,
    title: "Relocation Data Intelligence",
    subtitle: "Data Monetization",
    concept: "Wir wissen als Erste, wer wohin zieht und wie kaufkräftig. Gold für Banken/Telcos.",
    financials: "Lead-Verkauf: 50-150 CHF pro Kunde (3× verkaufbar: Versicherung, Internet, Strom).",
    automation: "100%",
    automationNote: "Predictive Analytics: «Wer zieht in 6 Monaten wahrscheinlich um?»",
    color: "text-rose-600",
    bgColor: "bg-rose-50"
  },
  {
    id: 10,
    icon: Cpu,
    title: "Lean Operations",
    subtitle: "Die 95/5 Formel",
    concept: "Umsatz wächst, Headcount bleibt flach. Exponentielle Profitabilität.",
    financials: "EBITDA-Ziel: >40%. 3 Support-Mitarbeiter für 10'000 Umzüge (statt 30). Spart ~2 Mio CHF/Jahr.",
    automation: "95%",
    automationNote: "Self-Healing: Fällt ein Partner aus, bucht die KI automatisch Ersatz.",
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  }
];

// Unit Economics Summary
const unitEconomics = {
  revenue: [
    { label: "Basis-Provision (15%)", value: "225 CHF" },
    { label: "Fintech/Escrow Fee", value: "30 CHF" },
    { label: "Versicherung (Upsell)", value: "99 CHF" },
    { label: "Bureaucracy Service", value: "49 CHF" },
    { label: "Lead-Verkauf (Telco/Strom)", value: "100 CHF" },
    { label: "Circular Economy", value: "50 CHF" },
  ],
  totalRevenue: "553 CHF",
  costs: [
    { label: "Marketing (CAC dank SEO)", value: "45 CHF" },
    { label: "Operative Kosten (AI-Server)", value: "5 CHF" },
  ],
  profit: ">500 CHF"
};

// Customer USP Card Component
const CustomerUSPCard = memo(({ usp, index }: { usp: typeof customerUSPs[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="group bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all"
  >
    {/* Header */}
    <div className="flex items-start gap-4 mb-4">
      <div className={`w-12 h-12 rounded-xl ${usp.bgColor} flex items-center justify-center flex-shrink-0`}>
        <usp.icon className={`w-6 h-6 ${usp.color}`} />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-muted-foreground">#{usp.id}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${usp.bgColor} ${usp.color} font-medium`}>
            {usp.subtitle}
          </span>
        </div>
        <h3 className="font-bold text-lg text-foreground">{usp.title}</h3>
      </div>
    </div>

    {/* Content */}
    <div className="space-y-3 text-sm">
      <div>
        <p className="text-muted-foreground">{usp.description}</p>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-3">
        <p className="font-medium text-foreground flex items-start gap-2">
          <span className="text-green-500 mt-0.5">✓</span>
          {usp.benefit}
        </p>
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Warum einzigartig:</span> {usp.unique}
        </p>
      </div>

      <div className="text-xs text-muted-foreground/80 italic">
        <span className="font-medium">🔮 Vision:</span> {usp.future}
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
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="group bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all"
  >
    {/* Header */}
    <div className="flex items-start gap-4 mb-4">
      <div className={`w-12 h-12 rounded-xl ${pillar.bgColor} flex items-center justify-center flex-shrink-0`}>
        <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-muted-foreground">Säule #{pillar.id}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
            {pillar.automation}% KI
          </span>
        </div>
        <h3 className="font-bold text-lg text-foreground">{pillar.title}</h3>
        <p className={`text-xs ${pillar.color} font-medium`}>{pillar.subtitle}</p>
      </div>
    </div>

    {/* Content */}
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-medium text-foreground">{pillar.concept}</p>
      </div>
      
      <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
        <p className="text-green-700 dark:text-green-400 text-xs font-medium">
          💰 {pillar.financials}
        </p>
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-primary">🤖 Automatisierung:</span> {pillar.automationNote}
        </p>
      </div>
    </div>
  </motion.div>
));

InvestorPillarCard.displayName = 'InvestorPillarCard';

// Unit Economics Component
const UnitEconomicsCard = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-6 md:p-8"
  >
    <h3 className="text-xl font-bold mb-6 text-center">
      💎 Unit Economics pro Kunde
    </h3>
    
    <div className="grid md:grid-cols-3 gap-6">
      {/* Revenue */}
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">Umsatz</h4>
        <div className="space-y-2">
          {unitEconomics.revenue.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-green-600">{item.value}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-primary/20 flex justify-between font-bold">
            <span>Total Umsatz</span>
            <span className="text-primary">{unitEconomics.totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Costs */}
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">Kosten</h4>
        <div className="space-y-2">
          {unitEconomics.costs.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-red-500">-{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="flex flex-col justify-center items-center bg-primary/10 rounded-xl p-4">
        <span className="text-sm text-muted-foreground mb-1">Deckungsbeitrag</span>
        <span className="text-4xl font-bold text-primary">{unitEconomics.profit}</span>
        <span className="text-xs text-muted-foreground mt-2">= 15× mehr als klassische Plattformen</span>
      </div>
    </div>
  </motion.div>
));

UnitEconomicsCard.displayName = 'UnitEconomicsCard';

// Main Component
export const Vision10PillarSection = memo(() => {
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Das 10-Säulen-Modell
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nicht nur Umzug. <span className="text-primary">Lebenswechsel.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            95% Künstliche Intelligenz. 100% Sorgenfrei. Wir sind das Betriebssystem für den Wohnortswechsel.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-10 h-14">
            <TabsTrigger 
              value="customers" 
              className="text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12"
            >
              <Users className="w-4 h-4 mr-2" />
              Für Kunden
            </TabsTrigger>
            <TabsTrigger 
              value="investors"
              className="text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Für Investoren
            </TabsTrigger>
          </TabsList>

          {/* Customer USPs */}
          <TabsContent value="customers" className="mt-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
                <span className="font-semibold text-foreground">Für Menschen, die Sicherheit wollen:</span> Stellen Sie sich vor, Sie ziehen um, aber müssen keine Kisten zählen, keine Formulare ausfüllen und keinem Handwerker hinterhertelefonieren.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-5">
              {customerUSPs.map((usp, index) => (
                <CustomerUSPCard key={usp.id} usp={usp} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 text-center"
            >
              <Link to="/umzugsofferten">
                <Button size="lg" className="h-14 px-8 text-base font-bold">
                  Jetzt Offerten vergleichen
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </TabsContent>

          {/* Investor Pillars */}
          <TabsContent value="investors" className="mt-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
                <span className="font-semibold text-foreground">Für Investoren:</span> Wir transformieren einen fragmentierten Low-Tech Markt in ein hochprofitables Data- & Fintech-Ökosystem. Unser Asset ist die Datenhoheit über den Lebenswechsel.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {investorPillars.map((pillar, index) => (
                <InvestorPillarCard key={pillar.id} pillar={pillar} index={index} />
              ))}
            </div>

            {/* Unit Economics */}
            <UnitEconomicsCard />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 text-center"
            >
              <Link to="/fuer-firmen">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold border-2">
                  Partner werden
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
});

Vision10PillarSection.displayName = 'Vision10PillarSection';
