/**
 * USPFrameworkSection — 50-Point USP Framework
 * 3-Tier visual hierarchy: Whoa (10) → Core (20) → Foundation (20)
 * Bento-grid layout with decreasing visual weight per tier
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain, Glasses, Zap, Video, Activity, Vibrate, Mic, MonitorPlay, ShieldAlert, Smartphone,
  Bell, Trophy, Puzzle, Heart, TrendingUp, Users, Hourglass, Radar, Layout, MessageSquare,
  Moon, Footprints, Globe, Maximize, Crown, Code2, MousePointerClick, Lock, Headphones, RefreshCw,
  Receipt, Server, KeyRound, DatabaseBackup, Monitor, ShieldCheck, Shield, WifiOff, Download, Webhook,
  X, Search, BookOpen, FlaskConical, UserCheck, Undo2, Paintbrush, MapPin, KeySquare, Newspaper,
  ChevronDown, ChevronUp, Sparkles, Layers, Settings2
} from "lucide-react";

interface USP {
  id: number;
  title: string;
  description: string;
  trigger: string;
  icon: React.ReactNode;
}

const TIER1_USPS: USP[] = [
  { id: 1, title: "Hyper-Adaptive KI-Schnittstelle", description: "UI ordnet Layout, Navigation und Tonfall dynamisch an, basierend auf Echtzeitverhalten und historischen Workflows.", trigger: "Arousal & Empathie", icon: <Brain className="w-6 h-6" /> },
  { id: 2, title: "AR Spatial Workspaces", description: "Verschmilzt physische und virtuelle Umgebungen — Teams projizieren 3D-Datenvisualisierungen in ihren Büroraum.", trigger: "Neuheit & Immersion", icon: <Glasses className="w-6 h-6" /> },
  { id: 3, title: "Prädiktive Autonome Workflows", description: "KI führt mehrstufige Aufgaben autonom aus, indem sie die Absicht basierend auf globalen Marktdaten vorhersagt.", trigger: "Zeitersparnis & Bequemlichkeit", icon: <Zap className="w-6 h-6" /> },
  { id: 4, title: "Generative Video-Repurposing-Engine", description: "Schneidet lange Inhalte automatisch in plattformspezifische Kurzvideos (TikTok, Reels, Shorts).", trigger: "Sofortige Wertrealisierung", icon: <Video className="w-6 h-6" /> },
  { id: 5, title: "Neurologische Sentiment-Analyse", description: "Deckt verborgene emotionale Treiber im Kundenfeedback auf und liefert Echtzeit-UX-Feedback.", trigger: "Autorität & Präzision", icon: <Activity className="w-6 h-6" /> },
  { id: 6, title: "Zero-Latency Haptic Collaboration", description: "Integriert taktiles Feedback in mobile Apps — Benutzer \"fühlen\" erfolgreiche Datenübertragungen physisch.", trigger: "Sensorisches Engagement", icon: <Vibrate className="w-6 h-6" /> },
  { id: 7, title: "Sprachgesteuerte Datenabfrage", description: "Benutzer sprechen Anfragen in natürlicher Sprache → System generiert sofort komplexe visuelle Berichte.", trigger: "Einfachheit & Effizienz", icon: <Mic className="w-6 h-6" /> },
  { id: 8, title: "Immersive Video-in-UI-Overlays", description: "Durchscheinende Video-Overlays und kaufbare Videostreams direkt im Kern-Workflow.", trigger: "Nahtlose Integration", icon: <MonitorPlay className="w-6 h-6" /> },
  { id: 9, title: "Automatisierte Fixkosten-Eliminierung", description: "KI-gesteuertes Audit-Tool identifiziert und eliminiert Überzahlungen proaktiv in allen Kategorien.", trigger: "Verlustaversion", icon: <ShieldAlert className="w-6 h-6" /> },
  { id: 10, title: "NFC Cloud Bridge", description: "Verbindet physische Hardware direkt mit der Cloud-SaaS — sofortiges Onboarding ohne App-Installation.", trigger: "Reibungslose Reziprozität", icon: <Smartphone className="w-6 h-6" /> },
];

const TIER2_USPS: USP[] = [
  { id: 11, title: "Smart Reminder Ecosystem", description: "Kontextbezogenes Benachrichtigungssystem, das zum optimalen Moment anstupst.", trigger: "Mikro-Engagement", icon: <Bell className="w-5 h-5" /> },
  { id: 12, title: "Gamifizierte Loyalitätsmeilensteine", description: "Automatische Belohnungen bei Workflow-Zielerreichung.", trigger: "Besitztumseffekt", icon: <Trophy className="w-5 h-5" /> },
  { id: 13, title: "Universelle Konnektoren", description: "4.000+ native Integrationen über visuellen If/Then-Builder.", trigger: "Interoperabilität", icon: <Puzzle className="w-5 h-5" /> },
  { id: 14, title: "Mental Health Dashboard", description: "Anonymisiertes Team-Wohlbefinden-Tracking mit Burnout-Warnsystem.", trigger: "Empathie", icon: <Heart className="w-5 h-5" /> },
  { id: 15, title: "Real-Time Revenue Attribution", description: "LTV, CAC, ARR korreliert mit spezifischen Software-Aktionen.", trigger: "Ergebnis-Rechtfertigung", icon: <TrendingUp className="w-5 h-5" /> },
  { id: 16, title: "Dynamische Social-Proof-Engine", description: "Echtzeit-Nutzungsdaten und Peer-Reviews direkt in Entscheidungsmodulen.", trigger: "Peer-Einfluss", icon: <Users className="w-5 h-5" /> },
  { id: 17, title: "Smart Scarcity Allokator", description: "Personalisierte Ressourcenlimits statt generischer Warnungen.", trigger: "Dringlichkeit", icon: <Hourglass className="w-5 h-5" /> },
  { id: 18, title: "Proaktives Visibility-Tracking", description: "KI-gesteuerte Echtzeit-Verfolgung ohne externe Tracking-IDs.", trigger: "Angstreduzierung", icon: <Radar className="w-5 h-5" /> },
  { id: 19, title: "Visueller Custom Type Builder", description: "Drag-and-Drop Architekturschnittstelle für dynamische Layouts.", trigger: "Kreative Ermächtigung", icon: <Layout className="w-5 h-5" /> },
  { id: 20, title: "Voice of the Customer Synthesizer", description: "Aggregiert Feedback und priorisiert die Produkt-Roadmap automatisch.", trigger: "Reziprozität", icon: <MessageSquare className="w-5 h-5" /> },
  { id: 21, title: "Dark Mode & Ästhetische Fluidität", description: "Kontrastreiche, barrierefreie UI-Themen per Sofort-Toggle.", trigger: "Personalisierung", icon: <Moon className="w-5 h-5" /> },
  { id: 22, title: "Interaktive Workflow-Walkthroughs", description: "Geführte In-App-Produkttouren statt statischer Dokumentation.", trigger: "Time-to-Value", icon: <Footprints className="w-5 h-5" /> },
  { id: 23, title: "Auto Multi-Language Lokalisierung", description: "Sofortige kulturelle Adaptation für globale Bereitstellung.", trigger: "Globale Kompetenz", icon: <Globe className="w-5 h-5" /> },
  { id: 24, title: "Infinite Canvas Architekturen", description: "Endloser, zoombarer Raum für Brainstorming und Projektmanagement.", trigger: "Eskapismus", icon: <Maximize className="w-5 h-5" /> },
  { id: 25, title: "Dedizierte Account-Identifikatoren", description: "Massgeschneiderte Dashboards für Enterprise-Kunden.", trigger: "Status & Autorität", icon: <Crown className="w-5 h-5" /> },
  { id: 26, title: "Reibungslose No-Code Umgebung", description: "Visuelle, blockbasierte Programmierung für Nicht-Techniker.", trigger: "Demokratisierung", icon: <Code2 className="w-5 h-5" /> },
  { id: 27, title: "Echtzeit-Kollaborations-Sync", description: "Dutzende Benutzer gleichzeitig ohne Verzögerung oder Konflikte.", trigger: "Gemeinschaft", icon: <MousePointerClick className="w-5 h-5" /> },
  { id: 28, title: "Ethische KI & Datenschutz-Leitplanken", description: "Privacy-by-Design mit integrierten Nachhaltigkeitskennzahlen.", trigger: "Authentizität", icon: <Lock className="w-5 h-5" /> },
  { id: 29, title: "Automatisierter kontextbezogener Support", description: "KI-Chatbot analysiert aktuellen Bildschirm für proaktive Lösungen.", trigger: "Frustrationseliminierung", icon: <Headphones className="w-5 h-5" /> },
  { id: 30, title: "Continuous Deployment CI/CD", description: "Nahtlose Updates ohne Ausfallzeiten unter der Haube.", trigger: "Zuverlässigkeit", icon: <RefreshCw className="w-5 h-5" /> },
];

const TIER3_USPS: USP[] = [
  { id: 31, title: "Transparente Rechnungsstellung", description: "Kristallklare Aufschlüsselungen ohne versteckte Gebühren.", trigger: "Ehrlichkeit", icon: <Receipt className="w-4 h-4" /> },
  { id: 32, title: "99,99% Uptime SLA", description: "Redundante, global verteilte Cloud-Infrastruktur.", trigger: "Risikominderung", icon: <Server className="w-4 h-4" /> },
  { id: 33, title: "Single Sign-On (SSO)", description: "Nahtlose Authentifizierung über Okta, Google, AD.", trigger: "Sicherheits-Einfachheit", icon: <KeyRound className="w-4 h-4" /> },
  { id: 34, title: "Auto Daten-Backup & Recovery", description: "Kontinuierliche Snapshots mit Ein-Klick-Wiederherstellung.", trigger: "Sicherheitspuffer", icon: <DatabaseBackup className="w-4 h-4" /> },
  { id: 35, title: "Responsive Cross-Platform", description: "Fehlerfreie Parität auf Desktop, Tablet und Mobile.", trigger: "Allgegenwärtiger Zugang", icon: <Monitor className="w-4 h-4" /> },
  { id: 36, title: "Granulare RBAC", description: "Hochgradig anpassbare rollenbasierte Zugriffskontrolle.", trigger: "Administrative Autorität", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 37, title: "SOC2 & GDPR Native", description: "Automatische Compliance mit internationalen Standards.", trigger: "Institutionelles Vertrauen", icon: <Shield className="w-4 h-4" /> },
  { id: 38, title: "Offline-Modus Sync", description: "Weiterarbeiten ohne Internet, automatische Konfliktlösung.", trigger: "Unterbrechungsfreier Fluss", icon: <WifiOff className="w-4 h-4" /> },
  { id: 39, title: "Ein-Klick Datenexport", description: "Sofortiger Export in CSV, JSON — kein Vendor Lock-In.", trigger: "Anti-Lock-In", icon: <Download className="w-4 h-4" /> },
  { id: 40, title: "Developer API & Webhooks", description: "Dokumentiertes RESTful-API-System für Custom-Integrationen.", trigger: "Skalierbarkeit", icon: <Webhook className="w-4 h-4" /> },
  { id: 41, title: "'No Thanks' UI-Klarheit", description: "Alle Opt-outs sichtbar — keine Dark Patterns.", trigger: "Ethische UX", icon: <X className="w-4 h-4" /> },
  { id: 42, title: "Echtzeit-Datenindizierung", description: "Massive Datenmengen sofort durchsuchbar und umsetzbar.", trigger: "Kognitive Entlastung", icon: <Search className="w-4 h-4" /> },
  { id: 43, title: "Educational Content Hub", description: "Eingebettete Bibliothek zugeschnitten auf Branche und Reifegrad.", trigger: "Ermächtigung", icon: <BookOpen className="w-4 h-4" /> },
  { id: 44, title: "Auto UX A/B-Testing", description: "Mehrere Workflow-Varianten gleichzeitig testen und optimieren.", trigger: "Datengesteuerte Gewissheit", icon: <FlaskConical className="w-4 h-4" /> },
  { id: 45, title: "Customer Success Manager", description: "Dedizierte menschliche Strategen für Enterprise-Kunden.", trigger: "Menschliche Verbindung", icon: <UserCheck className="w-4 h-4" /> },
  { id: 46, title: "Globale Ein-Klick Undo", description: "Universelles Sicherheitsnetz — jede Aktion sofort rückgängig.", trigger: "Angstfreie Erkundung", icon: <Undo2 className="w-4 h-4" /> },
  { id: 47, title: "Custom Domain & White-Label", description: "Branding vollständig unter eigener Unternehmensidentität.", trigger: "Markenerweiterung", icon: <Paintbrush className="w-4 h-4" /> },
  { id: 48, title: "Dynamische Content-Lokalisierung", description: "Auto-Anpassung von Währungen, Daten, Compliance per IP.", trigger: "Globale Reichweite", icon: <MapPin className="w-4 h-4" /> },
  { id: 49, title: "Zero-Knowledge Verschlüsselung", description: "Lokale Verschlüsselung vor Übertragung — selbst wir können nichts lesen.", trigger: "Absolute Privatsphäre", icon: <KeySquare className="w-4 h-4" /> },
  { id: 50, title: "Interaktives Produkt-Changelog", description: "Gamifizierter Feed zeigt wie Feedback zu Features wird.", trigger: "Community-Investition", icon: <Newspaper className="w-4 h-4" /> },
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
            50 USPs strukturiert nach psychologischer Wirkung — von viszeralem «Whoa» bis zur rationalen Absicherung. 
            Jede Ebene triggert spezifische kognitive Zustände: Arousal, Pleasure, Vertrauen.
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
              <p className="text-xs text-muted-foreground">10 Funktionen mit massivem Impact · Sofortige viszerale Reaktion</p>
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
              <h3 className="text-lg font-bold text-foreground">Sektion 2 — Kernunterscheidungsmerkmale</h3>
              <p className="text-xs text-muted-foreground">20 Funktionen · Workflow-Automatisierung, emotionale UX, Zeitspar-Mechanismen</p>
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
              <h3 className="text-lg font-bold text-foreground">Sektion 3 — Fundamentale USPs</h3>
              <p className="text-xs text-muted-foreground">20 Funktionen · Sicherheit, Compliance, Quality-of-Life</p>
            </div>
            <Badge className="ml-auto bg-muted text-muted-foreground text-xs">S</Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTier3(!showTier3)}
            className="mb-4 min-h-[44px] w-full sm:w-auto gap-2"
          >
            {showTier3 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showTier3 ? "Einklappen" : "20 Basis-USPs anzeigen"}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-muted/20 rounded-xl p-3 border border-border/30">
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
