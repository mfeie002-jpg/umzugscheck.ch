/**
 * OverkillVisionSection — 50 Tech-USPs in 3 visual tiers
 * The "mic-drop" section showing what's technically possible
 */

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Video, Landmark, Glasses, FileCode, Bot, CreditCard,
  Target, TrendingUp, Blocks, Banknote, Leaf, Fingerprint,
  Route, Plane, Languages,
  // Tier 2
  PlugZap, Recycle, Gavel, MapPin, Calculator, SprayCan,
  Package, Scissors, ShieldCheck, FileCheck, Gamepad2, Store,
  Share2, Home, PawPrint, LayoutDashboard, Mail, Wifi,
  MonitorPlay, Navigation,
  // Tier 3
  Gift, CalendarDays, Building2, Flower2, Coins, GraduationCap,
  Dumbbell, Sun, QrCode, Palette, Car, UtensilsCrossed,
  HeartPulse, CloudRain, Music
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TechUSP {
  icon: LucideIcon;
  title: string;
  description: string;
  whyWow: string;
}

const TIER1_SCIFI: TechUSP[] = [
  { icon: Video, title: "Instant AI Inventory via Video", description: "Der Nutzer filmt sein Wohnzimmer; die KI generiert in unter 3 Sekunden ein farbcodiertes 3D-Inventar inkl. exakter Kubikmeter-Berechnung.", whyWow: "Das lästige Formular-Ausfüllen stirbt. Pure Bequemlichkeit." },
  { icon: Landmark, title: "Evorest ETF-Kautions-Investment", description: "Die Mietkaution wird über API-Anbindung an Evorest sofort in Blackrock-ETFs investiert statt auf einem Nullzins-Konto zu verstauben.", whyWow: "Der Nutzer baut beim Umziehen Vermögen auf." },
  { icon: Glasses, title: "True Holographic 3D Room Preview", description: "Nutzer projizieren via Light Field Lab-Technologie ihre Möbel als echte, schwebende Hologramme in die neue, leere Wohnung.", whyWow: "Reiner Sci-Fi-Moment. Die Hardware existiert bereits." },
  { icon: FileCode, title: "Fully Automated eUmzugCH & Swiss Post API", description: "Ein Klick, und die KI ändert die Adresse bei der alten und neuen Gemeinde (eUmzugCH) sowie bei der Schweizer Post inkl. Nachsendeauftrag.", whyWow: "Digitalisiert den Schweizer Bürokratie-Horror komplett." },
  { icon: Bot, title: "Agentic AI Relocation Concierge", description: "Eine völlig autonome KI, die selbstständig Mails an Verwaltungen schreibt, Termine koordiniert und Handwerker anweist.", whyWow: "Ersetzt einen menschlichen Personal Assistant komplett." },
  { icon: CreditCard, title: "Embedded Finance: Move Now, Pay Later", description: "Über FinTech-APIs wird der komplette Umzug in Sekunden mit einer 0%-Ratenzahlung vorfinanziert.", whyWow: "Zerstört die finanzielle Einstiegsbarriere bei Doppelmieten." },
  { icon: Target, title: "AI Lead Scoring & Ranking", description: "Die KI bewertet jeden Lead sofort nach Abschlusswahrscheinlichkeit. Firmen kaufen nur Leads mit dem höchsten Profit-Score.", whyWow: "Effizienz-Boost für Handwerker; sie werden die Plattform lieben." },
  { icon: TrendingUp, title: "Real-Time Dynamic Pricing", description: "Ein KI-Pricing-Modell, das Umzugspreise minütlich anpasst — basierend auf Auslastung, Wetter und Verkehr.", whyWow: "Uber-Surge-Pricing für die Umzugsbranche." },
  { icon: Blocks, title: "Blockchain-gestützter Digital Twin", description: "Ein fälschungssicherer 3D-Scan der Wohnung wird auf der Blockchain gespeichert, um Kautionsstreitigkeiten mathematisch unmöglich zu machen.", whyWow: "Löst das grösste juristische Problem bei Umzügen." },
  { icon: Banknote, title: "B2B Micro-Loans", description: "Wenn beim Zügelunternehmen der LKW kaputtgeht, gewährt die Plattform sofortige Mikrokredite basierend auf Lead-Historie.", whyWow: "Bindet B2B-Partner lebenslang — wir werden zur Hausbank." },
  { icon: Leaf, title: "Carbon-Neutral Routing (ESG)", description: "Die KI berechnet die exakten CO₂-Emissionen der LKW-Flotte und kompensiert in Echtzeit für Firmenumzüge.", whyWow: "Monopolisten-Status für B2B-Konzernumzüge mit ESG-Pflichten." },
  { icon: Fingerprint, title: "Smart Lock Biometric Integration", description: "API-Anbindung an smarte Gebäude. Die Putzcrew erhält per temporärer FaceID Zugang zur Wohnung.", whyWow: "Spart Stunden an Logistik, eliminiert Schlüssel-Risiko." },
  { icon: Route, title: "Exoskelette für Zügel-Crews", description: "B2B-Partner können KI-gestützte, tragbare Exoskelett-Anzüge leasen, um Klaviere und Tresore ohne Rückenschäden zu tragen.", whyWow: "Software-Plattform meets industrielle Robotik." },
  { icon: Plane, title: "Automated Drone Facade Inspection", description: "Autonome Drohne analysiert Gebäudefassaden, bevor eine Offerte für hohe Fenster erstellt wird.", whyWow: "Katapultiert die Plattform in den High-End-Gewerbemarkt." },
  { icon: Languages, title: "Swiss Tax Relocation Optimizer", description: "Integrierte Steuer-API berechnet, ob der Nutzer am 31. Dezember oder 1. Januar umziehen sollte, um tausende Franken zu sparen.", whyWow: "Die Plattform bezahlt sich durch Steuerersparnisse selbst." },
];

const TIER2_EXCELLENCE: TechUSP[] = [
  { icon: PlugZap, title: "Utility Switcher", description: "Strom, Internet, Versicherung automatisch ummelden.", whyWow: "One-Click für alles was nervt." },
  { icon: Recycle, title: "Eco Moving Boxes", description: "Wiederverwendbare Boxen per Abo — Lieferung & Abholung inklusive.", whyWow: "Circular Economy im Umzugsmarkt." },
  { icon: Gavel, title: "Reverse Auction", description: "Firmen bieten auf deinen Umzug — du wählst das beste Angebot.", whyWow: "Preistransparenz die den Markt demokratisiert." },
  { icon: MapPin, title: "GPS Live-Tracking", description: "Verfolge deinen Umzugstransporter in Echtzeit auf der Karte.", whyWow: "Uber-Erlebnis für Umzüge." },
  { icon: Calculator, title: "Tax Optimizer", description: "Automatische Erkennung steuerlich absetzbarer Umzugskosten.", whyWow: "Spart dem Kunden bis zu CHF 3'000." },
  { icon: SprayCan, title: "Predictive Cleaning", description: "KI schätzt Reinigungsaufwand anhand von Wohnungsdaten.", whyWow: "Keine bösen Überraschungen bei der Abgabe." },
  { icon: Package, title: "Smart Packing AI", description: "KI generiert optimale Packliste basierend auf Inventar-Scan.", whyWow: "Jeder Karton perfekt gepackt." },
  { icon: Scissors, title: "Fractional Service", description: "Nur die Hilfe buchen die man braucht: 2h tragen, Rest selbst.", whyWow: "Flexibilität die kein Anbieter bietet." },
  { icon: ShieldCheck, title: "Verified Trust Score", description: "Blockchain-verifizierter Qualitätsscore für jede Firma.", whyWow: "Fake-Reviews unmöglich." },
  { icon: FileCheck, title: "Auto-Claim Handler", description: "Schadensmeldung mit Foto → KI erstellt Claim automatisch.", whyWow: "Von Schaden bis Erstattung in 48h statt 3 Wochen." },
  { icon: Gamepad2, title: "Gamification Engine", description: "Punkte sammeln, Badges verdienen, Rabatte freischalten.", whyWow: "Retention-Mechanik für Wiederkehr-Kunden." },
  { icon: Store, title: "P2P Marketplace", description: "Möbel verkaufen/verschenken direkt an Nachmieter.", whyWow: "Craiglist meets Umzugsplattform." },
  { icon: Share2, title: "Social Network Sync", description: "Adressänderung automatisch an alle Kontakte senden.", whyWow: "Nie wieder 200 Leuten die neue Adresse schicken." },
  { icon: Home, title: "Smart Home Setup", description: "Philips Hue, Sonos, Nuki automatisch in der neuen Wohnung konfigurieren.", whyWow: "Am Einzugstag ist alles ready." },
  { icon: PawPrint, title: "Pet Relocation", description: "Spezialisierter Umzugsservice für Haustiere mit Tierarzt-Netzwerk.", whyWow: "Nischenservice mit Premium-Pricing." },
  { icon: LayoutDashboard, title: "Enterprise Dashboard", description: "Firmen-Relocations mit Budget-Tracking und Approval-Workflows.", whyWow: "B2B-Revenue-Stream mit hohem ACV." },
  { icon: Mail, title: "Post API Integration", description: "Automatische Nachsendeaufträge bei der Post.", whyWow: "Ein Klick statt Formular." },
  { icon: Wifi, title: "WiFi Speed Scanner", description: "Internet-Geschwindigkeit der neuen Adresse vorab prüfen.", whyWow: "Das Feature das jeder will aber niemand hat." },
  { icon: MonitorPlay, title: "Cleaning Livestream", description: "Endreinigung live per Kamera verfolgen.", whyWow: "Vertrauen durch totale Transparenz." },
  { icon: Navigation, title: "Commute Planner", description: "Pendelzeit zum Arbeitsplatz ab neuer Adresse berechnen.", whyWow: "Entscheidungshilfe die Conversion steigert." },
];

const TIER3_DETAIL: TechUSP[] = [
  { icon: Gift, title: "First-Night Kit", description: "Willkommenspaket mit Essentials für die erste Nacht.", whyWow: "Kleine Geste, riesiger Wow-Effekt." },
  { icon: CalendarDays, title: "Waste Calendar Sync", description: "Abfuhrkalender der neuen Gemeinde automatisch im Kalender.", whyWow: "Micro-Service mit Macro-Dankbarkeit." },
  { icon: Building2, title: "Elevator Booking Bot", description: "Liftreservierung im Gebäude automatisch organisieren.", whyWow: "Eliminiert den nervigsten Admin-Schritt." },
  { icon: Flower2, title: "Plant Care Guide", description: "Umzugstipps für jede Pflanze basierend auf Art und Jahreszeit.", whyWow: "Zeigt: wir denken an ALLES." },
  { icon: Coins, title: "In-App Tipping", description: "Trinkgeld digital an die Umzugshelfer senden.", whyWow: "Cashless und fair." },
  { icon: GraduationCap, title: "Schulanmeldung", description: "Automatische Schulummeldung für Kinder generieren.", whyWow: "Familien-Feature das Herzen gewinnt." },
  { icon: Dumbbell, title: "Gym Canceller", description: "Fitness-Abo automatisch kündigen oder transferieren.", whyWow: "Sonderkündigungsrecht nutzen per Klick." },
  { icon: Sun, title: "Sun Simulator", description: "Sonnenverlauf in der neuen Wohnung simulieren.", whyWow: "Kein dunkles Wohnzimmer-Risiko mehr." },
  { icon: QrCode, title: "QR Box Tracking", description: "Jeder Karton hat einen QR-Code — immer wissen wo was ist.", whyWow: "Nie wieder 'Wo ist der Karton mit den Gläsern?'" },
  { icon: Palette, title: "Farbpsychologie", description: "KI schlägt Wandfarben vor basierend auf Raumgrösse und Lichteinfall.", whyWow: "Interior Design als Gratis-Feature." },
  { icon: Car, title: "Parking Permit", description: "Halteverbotszone automatisch bei der Gemeinde beantragen.", whyWow: "Ein Formular weniger, ein Problem weniger." },
  { icon: UtensilsCrossed, title: "Kühlschrank-Rezepte", description: "Rezeptvorschläge aus Resten vor dem Umzug.", whyWow: "Kein Food Waste — und ein Schmunzler." },
  { icon: HeartPulse, title: "Erste-Hilfe-Guide", description: "Ergonomie-Tipps und Notfallanweisungen für den Umzugstag.", whyWow: "Sicherheit als USP." },
  { icon: CloudRain, title: "Wetterwarnung", description: "Automatische Warnung wenn am Umzugstag Regen droht.", whyWow: "Planung die mitdenkt." },
  { icon: Music, title: "Spotify Welcome", description: "Automatische Playlist für den Einzugstag.", whyWow: "Der emotionale Moment — powered by uns." },
];

function TierCard({ usp, tier }: { usp: TechUSP; tier: 'scifi' | 'excellence' | 'detail' }) {
  const tierStyles = {
    scifi: "bg-gradient-to-br from-primary/10 via-background to-purple-500/5 border-primary/30 hover:border-primary/60 shadow-lg hover:shadow-primary/20",
    excellence: "bg-card border-border/50 hover:border-primary/40 shadow-sm hover:shadow-md",
    detail: "bg-muted/30 border-border/30 hover:border-border/60",
  };

  const iconStyles = {
    scifi: "w-12 h-12 rounded-xl bg-primary/15 text-primary",
    excellence: "w-10 h-10 rounded-lg bg-primary/10 text-primary/80",
    detail: "w-8 h-8 rounded-md bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className={`p-4 md:p-5 rounded-xl border transition-all duration-300 ${tierStyles[tier]}`}
    >
      <div className={`${iconStyles[tier]} flex items-center justify-center mb-3`}>
        <usp.icon className={tier === 'scifi' ? 'w-6 h-6' : tier === 'excellence' ? 'w-5 h-5' : 'w-4 h-4'} />
      </div>
      <h4 className={`font-semibold text-foreground mb-1 ${tier === 'scifi' ? 'text-lg' : tier === 'excellence' ? 'text-base' : 'text-sm'}`}>
        {usp.title}
      </h4>
      <p className={`text-muted-foreground mb-2 ${tier === 'detail' ? 'text-xs' : 'text-sm'}`}>
        {usp.description}
      </p>
      <p className={`text-primary/70 italic ${tier === 'detail' ? 'text-xs' : 'text-xs'}`}>
        💡 {usp.whyWow}
      </p>
    </motion.div>
  );
}

export function OverkillVisionSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary bg-primary/5">
            🚀 TECH VISION 2026+
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            50 Features die kein Konkurrent hat
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Von KI-Video-Analyse über Blockchain-Tracking bis zur Spotify-Einzugsplaylist — 
            das ist die Zukunft des Umzugsmarkts. Und wir bauen sie.
          </p>
        </motion.div>

        {/* Tier 1 — Sci-Fi Overkill */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-primary text-primary-foreground">TIER 1</Badge>
            <h3 className="text-xl font-bold text-foreground">Sci-Fi Overkill — Game Changers</h3>
            <span className="text-sm text-muted-foreground">({TIER1_SCIFI.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {TIER1_SCIFI.map((usp, i) => (
              <TierCard key={i} usp={usp} tier="scifi" />
            ))}
          </div>
        </div>

        {/* Tier 2 — Process Excellence */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="secondary">TIER 2</Badge>
            <h3 className="text-xl font-bold text-foreground">Prozess-Exzellenz — Smart Operations</h3>
            <span className="text-sm text-muted-foreground">({TIER2_EXCELLENCE.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {TIER2_EXCELLENCE.map((usp, i) => (
              <TierCard key={i} usp={usp} tier="excellence" />
            ))}
          </div>
        </div>

        {/* Tier 3 — Detail Love */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline">TIER 3</Badge>
            <h3 className="text-xl font-bold text-foreground">Detail-Liebe — Micro-Delights</h3>
            <span className="text-sm text-muted-foreground">({TIER3_DETAIL.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {TIER3_DETAIL.map((usp, i) => (
              <TierCard key={i} usp={usp} tier="detail" />
            ))}
          </div>
        </div>

        {/* Footer gag */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20"
        >
          <p className="text-2xl font-bold text-foreground mb-2">
            Total: {TIER1_SCIFI.length + TIER2_EXCELLENCE.length + TIER3_DETAIL.length} Features
          </p>
          <p className="text-muted-foreground text-lg">
            Und ja — das ist alles heute technisch möglich. <span className="text-primary font-semibold">Willkommen in 2026.</span>
          </p>
          <p className="text-sm text-muted-foreground/60 mt-3 italic">
            «Wer 50 Gründe zum Investieren hat UND 50 Features die kein Konkurrent hat — der hat 100 Argumente und null Ausreden.»
          </p>
        </motion.div>
      </div>
    </section>
  );
}
