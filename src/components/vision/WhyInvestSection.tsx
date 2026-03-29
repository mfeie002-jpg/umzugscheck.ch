import { motion } from 'framer-motion';
import {
  Clock, Calculator, Shield, Heart, Lock, Rocket,
  Globe, Coins, TrendingUp, Trophy, Crown, ShoppingCart,
  Layers, Radar, MapPin, RefreshCw, FlaskConical, Wallet, Brain, Infinity,
  Zap, Eye, Users, BarChart3, FileCheck, Video, Search, Star,
  Building2, Phone, Target, Cpu, GitBranch, Database, Gauge,
  PiggyBank, Handshake, Scale, BadgeCheck, Network,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type WowTier = 'legendary' | 'epic' | 'strong';

interface InvestArg {
  icon: LucideIcon;
  title: string;
  stat: string;
  desc: string;
  wow: string;
  tier: WowTier;
}

const investArgs: InvestArg[] = [
  // ═══ LEGENDARY — Die absoluten Killer-Argumente ═══
  {
    icon: Infinity,
    title: 'Scheitern unmöglich',
    stat: '100% sichere Rendite',
    desc: 'Es geht nur um die Zeitdauer. Aller Profit wird reinvestiert bis zur absoluten Marktdominanz.',
    wow: 'Mathematische Gewissheit — nicht Hoffnung, sondern Iteration bis zum Ergebnis.',
    tier: 'legendary',
  },
  {
    icon: Heart,
    title: 'Skin in the Game',
    stat: 'Kein Gründerlohn',
    desc: 'Gründer arbeitet ohne Lohn. 100% des Kapitals wird direkt reinvestiert. Maximale Alignment.',
    wow: 'Totales Commitment — der Gründer muss gewinnen, es gibt keinen Plan B.',
    tier: 'legendary',
  },
  {
    icon: Trophy,
    title: 'Proven Track Record',
    stat: '5x Google #1 weltweit',
    desc: 'Gründer hat bereits globale Nr.-1-Rankings aufgebaut (USA, weltweit). Kopiert und skaliert.',
    wow: 'Kein Anfänger — bewiesene Dominanz in 5 verschiedenen Märkten.',
    tier: 'legendary',
  },
  {
    icon: Shield,
    title: 'Technical Moat',
    stat: "2'110 Gemeinde-SEO",
    desc: 'AI-Pipeline + programmatische Gemeinde-Seiten = organischer Traffic-Flywheel, der schwer kopierbar ist.',
    wow: 'Niemand wird 2\'110 Seiten manuell nachbauen — der Vorsprung ist permanent.',
    tier: 'legendary',
  },
  {
    icon: Globe,
    title: 'Evergreen Market',
    stat: 'Umziehen geht nie weg',
    desc: 'Kein Trend, kein Hype — Menschen müssen immer umziehen. Ewiger Bedarf, konjunkturunabhängig.',
    wow: 'Rezessionssicher — einer der wenigen Märkte, die NIE verschwinden.',
    tier: 'legendary',
  },
  {
    icon: Lock,
    title: 'De-Risked Structure',
    stat: 'Max CHF 15k Erstrisiko',
    desc: 'Meilenstein-basierte Tranchen. Kapital wird nur freigegeben, wenn messbare Ziele erreicht sind.',
    wow: 'Investor-Schutz eingebaut — kein blindes Vertrauen nötig.',
    tier: 'legendary',
  },

  // ═══ EPIC — Sehr starke, differenzierende Argumente ═══
  {
    icon: Crown,
    title: 'Plattform-Dominanz',
    stat: 'Platzhirsch bleibt Platzhirsch',
    desc: 'Wer einmal dominiert, wird nicht verdrängt. Google baut keine Zügel-Plattform.',
    wow: 'Winner-takes-most Dynamik — der Erste mit Netzwerkeffekt gewinnt.',
    tier: 'epic',
  },
  {
    icon: Brain,
    title: '20 Jahre SEO-Nerd',
    stat: 'Kein grösserer Experte',
    desc: '20 Jahre Vollzeit-SEO. Niemand im Schweizer Umzugsmarkt hat mehr Erfahrung investiert.',
    wow: '20 Jahre fokussierte Expertise — unmöglich aufzuholen.',
    tier: 'epic',
  },
  {
    icon: Calculator,
    title: 'Unit Economics',
    stat: 'CHF 553 Revenue/Kunde',
    desc: '90%+ Marge bei einem asset-light Plattformmodell. Kapitaleffizient ab Tag 1.',
    wow: 'Software-Margen in einem physischen Markt — das Beste aus beiden Welten.',
    tier: 'epic',
  },
  {
    icon: TrendingUp,
    title: 'Schneeball-Effekt',
    stat: 'Nur eine Frage der Zeit',
    desc: 'SEO wächst exponentiell — einmal oben, bleibt man oben. 6–9 Monate bis Break-even.',
    wow: 'Compound Growth — jeder Monat baut auf dem vorherigen auf.',
    tier: 'epic',
  },
  {
    icon: Coins,
    title: 'Kaufkraft Schweiz',
    stat: 'Reichstes Land der Welt',
    desc: 'Schweizer zahlen sofort für Convenience. Höchste Zahlungsbereitschaft weltweit.',
    wow: 'Premium-Markt mit Premium-Zahlungsbereitschaft — ideales Umfeld.',
    tier: 'epic',
  },
  {
    icon: Layers,
    title: 'Dual-Brand Strategie',
    stat: 'Umzugscheck + Feierabend',
    desc: 'Umzugscheck holt Leads via SEO, Feierabendservices.ch führt aus — systematisch immer bestes Angebot.',
    wow: 'Vertikale Integration — wir kontrollieren Nachfrage UND Angebot.',
    tier: 'epic',
  },
  {
    icon: ShoppingCart,
    title: 'Cross-Sell Engine',
    stat: 'Umzug = Foot in the Door',
    desc: 'Nach dem Umzug: Reinigung, Entsorgung, Lagerung — wir besitzen den ganzen Prozess.',
    wow: 'Ein Kunde, 5+ Services — Customer Lifetime Value multipliziert sich.',
    tier: 'epic',
  },
  {
    icon: Rocket,
    title: 'Scalability',
    stat: '95% Automation',
    desc: '6 Revenue Streams, Multi-Brand ready. Plattform, nicht Service — skaliert ohne linearen Personalaufbau.',
    wow: 'Software-Skalierung in einem Offline-Markt — der heilige Gral.',
    tier: 'epic',
  },
  {
    icon: Radar,
    title: 'Auto-Discovery',
    stat: 'Jede Firma wird gefunden',
    desc: 'Automatisches Scraping aller Umzugs-/Reinigungsfirmen in jeder Gemeinde — ob sie wollen oder nicht.',
    wow: 'Vollständige Marktabdeckung ohne Sales-Team — rein technisch.',
    tier: 'epic',
  },
  {
    icon: Wallet,
    title: '10+ Revenue Streams',
    stat: 'Diversifizierte Einnahmen',
    desc: 'CPL, CPC, Subscriptions, Sponsored, Bidding, Services, Reinigung, Lager, Entsorgung und mehr.',
    wow: 'Kein Single-Point-of-Failure — wenn ein Stream schwächelt, tragen die anderen.',
    tier: 'epic',
  },
  {
    icon: Clock,
    title: 'Timing',
    stat: "450'000 Umzüge/Jahr",
    desc: 'Kein digitaler Marktführer. Der Schweizer Umzugsmarkt ist hochfragmentiert — perfektes Fenster für eine Plattform.',
    wow: 'First-Mover-Advantage in einem CHF 2 Mrd. Markt ohne Champion.',
    tier: 'epic',
  },

  // ═══ STRONG — Solide, ergänzende Argumente ═══
  {
    icon: MapPin,
    title: 'Live Relocation Hubs',
    stat: "2'110 Gemeinden, live updated",
    desc: 'Jede Gemeinde hat einen dedizierten Hub mit gescrapten Infos — kostenlos für jeden Kunden.',
    wow: 'Einzigartiger Content-Moat den kein Konkurrent replizieren wird.',
    tier: 'strong',
  },
  {
    icon: RefreshCw,
    title: 'Vergleich ist ewig',
    stat: 'Leute vergleichen immer',
    desc: 'Der Vergleichsprozess beim Umzug ändert sich nie — unser Kern-USP bleibt für immer relevant.',
    wow: 'Das Nutzerverhalten ist fix — unser Produkt altert nicht.',
    tier: 'strong',
  },
  {
    icon: FlaskConical,
    title: 'A/B Testing Machine',
    stat: '5 Durchgänge optimiert',
    desc: 'Permanentes Testing — irgendetwas MUSS Nr. 1 sein. Wir iterieren bis es mathematisch stimmt.',
    wow: 'Datengetriebene Optimierung statt Bauchgefühl.',
    tier: 'strong',
  },
  {
    icon: Video,
    title: 'AI Video-Scanner',
    stat: 'Offerte per Handy-Video',
    desc: 'Kunden filmen ihre Wohnung, die KI erkennt Möbel und erstellt automatisch eine Inventarliste + Preisschätzung.',
    wow: 'Kein Besichtigungstermin nötig — Conversion in Sekunden statt Tagen.',
    tier: 'strong',
  },
  {
    icon: Zap,
    title: '11-Sekunden-Offerte',
    stat: 'Schnellster Vergleich der CH',
    desc: 'Von PLZ-Eingabe bis fertige Offerte in 11 Sekunden. Kein Login, kein Warten.',
    wow: 'Extrem niedrige Hürde — maximale Conversion Rate.',
    tier: 'strong',
  },
  {
    icon: Eye,
    title: 'Transparenz als USP',
    stat: 'Echter Preisvergleich',
    desc: 'Keine versteckten Kosten, keine Dark Patterns. Kunden sehen sofort, was es kostet.',
    wow: 'Vertrauen ist in diesem Markt die knappste Ressource — wir haben sie.',
    tier: 'strong',
  },
  {
    icon: Users,
    title: '48+ Partner-Firmen',
    stat: 'Netzwerk wächst organisch',
    desc: 'Bereits 48+ verifizierte Umzugsfirmen im Netzwerk — und jede Woche kommen neue dazu.',
    wow: 'Netzwerkeffekt — mehr Firmen = bessere Preise = mehr Kunden = mehr Firmen.',
    tier: 'strong',
  },
  {
    icon: BarChart3,
    title: '60+ Funnel-Varianten',
    stat: 'Mehr getestet als jeder andere',
    desc: 'Über 60 dokumentierte Flow-Varianten (V9 Zero Friction, Ultimate V7 etc.) — systematisch optimiert.',
    wow: 'Wissenschaftlicher Approach — jede Conversion-Rate ist messbar verbessert.',
    tier: 'strong',
  },
  {
    icon: FileCheck,
    title: 'Regulatorisches Know-how',
    stat: '26 Kantone abgedeckt',
    desc: 'Jeder Kanton hat eigene Regeln für Ab-/Anmeldung, Fristen, eUmzug. Wir kennen alle.',
    wow: 'Schweiz-spezifisches Wissen das kein internationaler Player mitbringt.',
    tier: 'strong',
  },
  {
    icon: Search,
    title: '43\'890+ Keywords',
    stat: 'Riesiger SEO-Markt',
    desc: '43\'890+ monatliche Suchanfragen allein im Schweizer Umzugsmarkt — und wir decken alle Cluster ab.',
    wow: 'Der organische Traffic-Kuchen ist riesig — und niemand holt sich das grösste Stück.',
    tier: 'strong',
  },
  {
    icon: Star,
    title: 'Bester Preis garantiert',
    stat: 'Systematisch günstigstes Angebot',
    desc: 'Feierabendservices.ch wird systematisch so optimiert, dass wir IMMER das beste Angebot haben.',
    wow: 'Nicht Zufall, sondern System — der beste Preis ist eine Maschine.',
    tier: 'strong',
  },
  {
    icon: Building2,
    title: 'B2B + B2C',
    stat: 'Zwei Kundengruppen',
    desc: 'Endkunden zahlen für Service, Firmen zahlen für Leads. Doppelte Monetarisierung derselben Plattform.',
    wow: 'Zwei Seiten des Marktplatzes generieren unabhängig Umsatz.',
    tier: 'strong',
  },
  {
    icon: Phone,
    title: 'WhatsApp-First',
    stat: 'Wo die Kunden sind',
    desc: 'Offerten per WhatsApp, Statusupdates per Chat. Kein App-Download, keine Registrierung nötig.',
    wow: '95% der Schweizer nutzen WhatsApp — null Adoption-Hürde.',
    tier: 'strong',
  },
  {
    icon: Target,
    title: 'Lokale SEO-Dominanz',
    stat: 'Jede Stadt, jede Gemeinde',
    desc: 'Programmatische Landingpages für jede Schweizer Gemeinde — hyper-lokaler Content der rankt.',
    wow: 'Long-Tail SEO im grossen Stil — tausende kleine Siege ergeben eine grosse Dominanz.',
    tier: 'strong',
  },
  {
    icon: Cpu,
    title: 'KI-Setup: 60% Mensch, 40% KI',
    stat: 'Effizientes Building',
    desc: 'Beim Aufbau arbeiten Mensch und KI zusammen. Im Betrieb übernimmt die KI 95% — der Mensch nur 5%.',
    wow: 'Die Maschine baut sich quasi selbst — und wird dann autonom.',
    tier: 'strong',
  },
  {
    icon: GitBranch,
    title: 'Multi-Brand Ready',
    stat: 'Kopierbare Architektur',
    desc: 'Die Plattform-Architektur kann auf andere Märkte und Brands repliziert werden (Reinigung, Handwerk etc.).',
    wow: 'Ein Playbook, unendlich viele Vertikalen — jede neue Brand ist fast gratis.',
    tier: 'strong',
  },
  {
    icon: Database,
    title: 'Daten-Flywheel',
    stat: 'Jeder Nutzer macht uns besser',
    desc: 'Jeder Vergleich, jede Offerte, jeder Auftrag = Daten die Preise, Rankings und Empfehlungen verbessern.',
    wow: 'Selbstverstärkender Kreislauf — Wettbewerber ohne Daten können nicht mithalten.',
    tier: 'strong',
  },
  {
    icon: Gauge,
    title: 'Capital Efficiency',
    stat: 'CHF 60k = Break-even',
    desc: 'Mit nur CHF 60k zur Selbsttragfähigkeit. Kein Venture-Burn, kein Millionen-Fundraise nötig.',
    wow: 'Extrem kapitaleffizient — der Investor sieht schnell Ergebnisse.',
    tier: 'strong',
  },
  {
    icon: PiggyBank,
    title: '100% Reinvestition',
    stat: 'Null Entnahme',
    desc: 'Sämtlicher Profit wird sofort reinvestiert um den Wachstumsprozess zu beschleunigen.',
    wow: 'Maximale Kapitaleffizienz — jeder Franken arbeitet für Wachstum.',
    tier: 'strong',
  },
  {
    icon: Handshake,
    title: 'DHL & Post Partnerschaften',
    stat: 'Enterprise-Partner live',
    desc: 'Bereits Partnerschaften mit DHL und Schweizerischer Post — Validierung durch grosse Namen.',
    wow: 'Enterprise-Partner in der Pre-Seed-Phase — das hat fast niemand.',
    tier: 'strong',
  },
  {
    icon: Scale,
    title: 'Asset-Light Modell',
    stat: 'Kein Lager, kein LKW',
    desc: 'Plattform-Modell ohne physische Assets. Skaliert wie Software, liefert wie Logistik.',
    wow: 'Die Marge eines SaaS mit dem Markt eines Logistikers.',
    tier: 'strong',
  },
  {
    icon: BadgeCheck,
    title: 'Verifizierte Qualität',
    stat: 'Jede Firma geprüft',
    desc: 'Alle Partner-Firmen werden verifiziert. Bewertungen, Response-Zeiten und Erfolgsquoten sind transparent.',
    wow: 'Qualitätssicherung die Vertrauen schafft — und Kunden zurückbringt.',
    tier: 'strong',
  },
  {
    icon: Network,
    title: 'Ökosystem-Effekt',
    stat: 'Alles rund ums Umziehen',
    desc: 'Nicht nur Zügeln — sondern Reinigung, Entsorgung, Lagerung, Versicherung, Adressänderung, alles.',
    wow: 'One-Stop-Shop für den gesamten Umzugsprozess — maximale Convenience.',
    tier: 'strong',
  },
];

const tierConfig = {
  legendary: {
    label: '🔥 Game-Changer',
    gridClass: 'md:col-span-2 lg:col-span-1',
    cardClass: 'border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card shadow-md',
    iconBoxClass: 'w-14 h-14 rounded-2xl bg-primary/20',
    iconClass: 'w-7 h-7 text-primary',
    titleClass: 'text-xl font-extrabold',
    showWow: true,
  },
  epic: {
    label: '⚡ Stark',
    gridClass: '',
    cardClass: 'border-border bg-card',
    iconBoxClass: 'w-11 h-11 rounded-xl bg-primary/10',
    iconClass: 'w-5 h-5 text-primary',
    titleClass: 'text-lg font-bold',
    showWow: true,
  },
  strong: {
    label: '✓ Solide',
    gridClass: '',
    cardClass: 'border-border/60 bg-card/80',
    iconBoxClass: 'w-9 h-9 rounded-lg bg-muted',
    iconClass: 'w-4 h-4 text-muted-foreground',
    titleClass: 'text-base font-semibold',
    showWow: false,
  },
};

interface WhyInvestSectionProps {
  language?: string;
}

export function WhyInvestSection({ language = 'de' }: WhyInvestSectionProps) {
  const legendary = investArgs.filter((a) => a.tier === 'legendary');
  const epic = investArgs.filter((a) => a.tier === 'epic');
  const strong = investArgs.filter((a) => a.tier === 'strong');

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Investment Thesis
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Warum jetzt investieren?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            50 Gründe, warum Umzugscheck.ch das attraktivste Pre-Seed-Investment im Schweizer Logistik-Markt ist.
          </p>
        </motion.div>

        {/* ═══ LEGENDARY TIER ═══ */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            🔥 Game-Changer Argumente
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12 md:mb-16">
          {legendary.map((arg, i) => {
            const cfg = tierConfig.legendary;
            return (
              <motion.div
                key={arg.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`relative group rounded-2xl border p-6 md:p-7 hover:shadow-xl transition-all overflow-hidden ${cfg.cardClass}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className={`${cfg.iconBoxClass} flex items-center justify-center mb-4`}>
                    <arg.icon className={cfg.iconClass} />
                  </div>
                  <h3 className={`${cfg.titleClass} text-foreground mb-1`}>{arg.title}</h3>
                  <p className="text-primary font-semibold text-sm mb-2">{arg.stat}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{arg.desc}</p>
                  <p className="text-xs text-primary/80 font-medium italic border-t border-primary/10 pt-2 mt-2">
                    💡 {arg.wow}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ═══ EPIC TIER ═══ */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/50 text-foreground text-xs font-bold uppercase tracking-wider mb-4">
            ⚡ Starke Differenzierung
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-12 md:mb-16">
          {epic.map((arg, i) => {
            const cfg = tierConfig.epic;
            return (
              <motion.div
                key={arg.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`relative group rounded-2xl border p-5 md:p-6 hover:shadow-lg transition-shadow overflow-hidden ${cfg.cardClass}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className={`${cfg.iconBoxClass} flex items-center justify-center mb-3`}>
                    <arg.icon className={cfg.iconClass} />
                  </div>
                  <h3 className={`${cfg.titleClass} text-foreground mb-1`}>{arg.title}</h3>
                  <p className="text-primary font-semibold text-xs mb-2">{arg.stat}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{arg.desc}</p>
                  <p className="text-xs text-muted-foreground/70 italic mt-2">
                    💡 {arg.wow}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ═══ STRONG TIER ═══ */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider mb-4">
            ✓ Weitere Vorteile
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
          {strong.map((arg, i) => {
            const cfg = tierConfig.strong;
            return (
              <motion.div
                key={arg.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`relative group rounded-xl border p-4 hover:shadow-md transition-shadow overflow-hidden ${cfg.cardClass}`}
              >
                <div className="relative z-10 flex gap-3 items-start">
                  <div className={`${cfg.iconBoxClass} flex-shrink-0 flex items-center justify-center`}>
                    <arg.icon className={cfg.iconClass} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`${cfg.titleClass} text-foreground leading-tight`}>{arg.title}</h3>
                    <p className="text-primary/80 font-medium text-xs mb-1">{arg.stat}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{arg.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 md:p-10 text-center max-w-4xl mx-auto"
        >
          <p className="text-lg md:text-xl font-semibold text-foreground leading-relaxed">
            CHF 60k Pre-Seed. 3 Tranchen. Klare Milestones. Break-even in 6–9 Monaten.
            <br className="hidden sm:block" />
            Kein Gründerlohn. Der Schweizer Umzugsmarkt hat keinen digitalen Champion —{' '}
            <span className="text-primary">wir bauen ihn.</span>
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            50 Argumente. Null Hoffnung. Nur Mathematik, Execution und Zeit.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
