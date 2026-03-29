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
  { icon: PlugZap, title: "1-Click Utility Switcher", description: "Kündigt den alten Strom-/Internetanbieter und schliesst vollautomatisch den günstigsten am neuen Ort ab.", whyWow: "Generiert massive Affiliate-Zusatzgewinne ohne Extrakosten." },
  { icon: Recycle, title: "Zero-Waste Eco Box Network", description: "Ein geschlossener Kreislauf für wiederverwendbare Smart-Plastikboxen, die geliefert und wieder abgeholt werden.", whyWow: "Trifft den Nerv der Zeit und löst das Karton-Entsorgungsproblem." },
  { icon: Gavel, title: "B2B Reverse Auction Lead Bidding", description: "Besonders lukrative Leads werden in Echtzeit zwischen den Handwerkern versteigert, statt zu Fixpreisen verkauft.", whyWow: "Maximiert den Profit der Plattform ins Unermessliche." },
  { icon: MapPin, title: "Real-Time Fleet GPS Tracking", description: "Kunden sehen am Umzugstag live auf der Karte, wo sich der LKW mit ihren Möbeln befindet.", whyWow: "Nimmt dem Kunden die komplette Paranoia am Umzugstag." },
  { icon: Calculator, title: "Predictive Cleaning AI", description: "Nach dem Einzug verbindet sich die App mit dem Smart Home und schickt die Reinigungsfirma automatisch bei hohem Pollenflug.", whyWow: "Aus einmaligem Umzug wird lebenslanges Abo-Modell." },
  { icon: SprayCan, title: "AI-Translated Expat Communication", description: "Google-Expats schreiben auf Englisch, die KI übersetzt in Echtzeit auf Schweizerdeutsch für das Tablet des Handwerkers.", whyWow: "Überwindet Sprachbarrieren für lukrative internationale Kunden." },
  { icon: Package, title: "Smart Packing AI (IKEA Hacker)", description: "Handy-Kamera auf den PAX-Schrank richten. Die KI erkennt ihn und zeigt das Video, wie man ihn in 3 Minuten abbaut.", whyWow: "Löst das frustrierendste Problem beim Selber-Packen." },
  { icon: Scissors, title: "Fractional Service Booking", description: "Zügelmänner nur für eine Stunde buchen — etwa nur, um das schwere Sofa in den 4. Stock zu tragen.", whyWow: "Erschliesst den gigantischen Markt der DIY-Umzieher." },
  { icon: ShieldCheck, title: "Verified Trust Score via Blockchain", description: "Bewertungen der Zügelfirmen sind an reale, krypto-verifizierte Transaktionen gebunden.", whyWow: "Fake-Reviews sind mathematisch unmöglich." },
  { icon: FileCheck, title: "Instant Automated Claim Settlement", description: "Kratzer im Parkett? Foto machen. Die KI erkennt den Schaden, prüft die Versicherung und zahlt in 3 Sekunden aus.", whyWow: "Beendet den grausamen Streit mit Haftpflichtversicherungen." },
  { icon: Gamepad2, title: "Sunk-Cost Gamification Dashboard", description: "Ein psychologisches Level-System. Jeder erledigte Schritt füllt einen Balken, der Rabatte für IKEA oder Möbelhäuser freischaltet.", whyWow: "Zwingt den Nutzer förmlich dazu, den Prozess über unsere App zu beenden." },
  { icon: Store, title: "P2P Marketplace", description: "Möbel verkaufen/verschenken direkt an den Nachmieter innerhalb der Plattform.", whyWow: "Craiglist meets Umzugsplattform." },
  { icon: Share2, title: "One-Click Social Network Sync", description: "Automatischer Vorstellungs-Post in Nachbarschafts-Apps der neuen Gemeinde.", whyWow: "Schafft Community-Feeling ab Sekunde Null." },
  { icon: Home, title: "Smart Home Pre-Conditioning", description: "API-Zugriff auf Thermostate. Wenn der Umzugswagen vorfährt, ist das Wohnzimmer bereits auf 22 Grad geheizt.", whyWow: "Luxus pur beim Betreten der neuen vier Wände." },
  { icon: PawPrint, title: "Pet-Relocation Matching AI", description: "Ein Spezial-Filter, der nur Zügelfirmen vorschlägt, die auf stressfreie Umzüge für Hunde/Katzen spezialisiert sind.", whyWow: "Haustierbesitzer zahlen für diesen Service jeden Preis." },
  { icon: LayoutDashboard, title: "Enterprise Expat Dashboard", description: "Ein SaaS-Dashboard für HR-Abteilungen von Novartis oder Google, um den Umzug ganzer Abteilungen zu managen.", whyWow: "Öffnet den extrem lukrativen Corporate-Relocation Markt." },
  { icon: Mail, title: "IoT Smart Moving Boxes", description: "Premium-Umzugskartons mit integrierten IoT-Sensoren für Temperatur, Feuchtigkeit und Erschütterung.", whyWow: "Tracking auf FedEx-Niveau für jeden privaten Umzugskarton." },
  { icon: Wifi, title: "Wi-Fi Deadzone Scanner", description: "Die AR-App scannt den neuen Grundriss und sagt exakt, wo der Router für perfekten Empfang stehen muss.", whyWow: "Das wichtigste Überlebens-Feature im Home-Office-Zeitalter." },
  { icon: MonitorPlay, title: "End-of-Tenancy Cleaning Livestream", description: "Der Kunde sitzt im Büro, während der Putztrupp per Videoanruf die saubere Wohnung zeigt.", whyWow: "Ultimative Zeitersparnis für den Endkunden." },
  { icon: Navigation, title: "No-Box-Left-Behind RFID Tracking", description: "Kunden drucken RFID-Tags/QR-Codes. Die App schlägt Alarm, wenn eine Kiste im LKW vergessen wurde.", whyWow: "100% Sicherheit für Wertsachen." },
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
