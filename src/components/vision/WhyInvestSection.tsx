/**
 * WhyInvestSection — Final 50 Investment Reasons
 * Structure: Top-7 Nuclear → 5 Themed Blocks (10 each)
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Home, Package, ShieldCheck, Coins, Crown, ArrowLeftRight, GitBranch,
  Route, GitMerge, TrendingUp, Search, Shield, Monitor, MapPin, Building2,
  Globe, Trophy, Zap, LayoutGrid, MousePointerClick, Settings, Network,
  Target, Radar, Banknote, RefreshCw, Brain, Database, Eye, CircuitBoard,
  Cpu, Bot, Users, MessageCircle, LayoutList, MessageSquarePlus, Workflow,
  Flag, Crosshair, Layers, BarChart3, FlaskConical, ArrowUpCircle,
  Wrench, FileCode, Infinity, Globe2, Rocket, CheckCircle2, ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GroupStatsChart } from "./InvestorCharts";
import { ServiceChainInfographic, RevenueWaterfall } from "./InvestorInfographics";
import { NUCLEAR_VISUALS } from "./NuclearWowVisuals";

type Tier = "nuclear-wow" | "big-wow" | "deep-usp";

interface Reason {
  id: number;
  icon: LucideIcon;
  title: string;
  desc: string;
  wow: string;
  tier: Tier;
  group: string;
}

// ═══════════════════════════════════════════════════════════
// THE 50 FINAL REASONS
// ═══════════════════════════════════════════════════════════

const ALL_REASONS: Reason[] = [
  // ─── BLOCK 1: MARKT & NACHFRAGE ───
  { id: 1, icon: Home, title: "Ein Markt, der nie weggeht", desc: "Menschen ziehen immer um. Wohnungen, Häuser, Büros und Lebenssituationen ändern sich dauerhaft.", wow: "Kein Trend, kein Hype, kein kurzfristiges Produkt. Die Grundnachfrage bleibt.", tier: "nuclear-wow", group: "market" },
  { id: 2, icon: Package, title: "Der Umzug ist ein echtes Schmerzproblem", desc: "Umziehen ist stressig, zeitkritisch, emotional und organisatorisch anstrengend.", wow: "Hoher Schmerz macht die Zahlungsbereitschaft und Abschlussnähe grösser.", tier: "big-wow", group: "market" },
  { id: 3, icon: ShieldCheck, title: "Kunden zahlen für Entlastung, nicht Transport", desc: "Der Kunde kauft Zeit, Ruhe, Sicherheit und weniger Chaos.", wow: "Der wahrgenommene Wert liegt höher als der reine physische Service.", tier: "big-wow", group: "market" },
  { id: 4, icon: Coins, title: "Die Schweiz passt perfekt zu diesem Modell", desc: "Hohe Kaufkraft, hohe Qualitätsansprüche und Bereitschaft, für Komfort zu zahlen.", wow: "Der Markt belohnt Zuverlässigkeit und Bequemlichkeit überdurchschnittlich.", tier: "big-wow", group: "market" },
  { id: 5, icon: Crown, title: "Klein genug für Dominanz, stark genug für Margen", desc: "National überschaubar, wirtschaftlich stark, digital fragmentiert.", wow: "Ideal, um schrittweise die ganze Fläche abzudecken.", tier: "big-wow", group: "market" },
  { id: 6, icon: ArrowLeftRight, title: "Vergleich ist natürliches Verhalten", desc: "Menschen wollen bei Umzug, Reinigung und Räumung fast automatisch vergleichen.", wow: "Das Nutzerverhalten spielt der Plattform direkt in die Hände.", tier: "big-wow", group: "market" },
  { id: 7, icon: GitBranch, title: "Gross genug für Spezialisierung", desc: "Seniorenumzug, Firmenumzug, Expressumzug, Spezialumzug, Reinigung und mehr.", wow: "Ihr könnt in der Nische wachsen und gleichzeitig neue Nischen erschliessen.", tier: "deep-usp", group: "market" },
  { id: 8, icon: Route, title: "Der Umzug ist nur der Anfang", desc: "Nach dem Umzug folgen Reinigung, Räumung, Entsorgung, Lagerung, Montage, Halteverbotszone und mehr.", wow: "Ein Lead ist nicht das Ende, sondern der Einstieg in eine Service-Kette.", tier: "nuclear-wow", group: "market" },
  { id: 9, icon: GitMerge, title: "Cross-Selling ist natürlich, nicht erzwungen", desc: "Die Zusatzbedürfnisse entstehen logisch aus dem Umzugsprozess.", wow: "Mehr Umsatz pro Kunde ohne künstlichen Upsell.", tier: "big-wow", group: "market" },
  { id: 10, icon: TrendingUp, title: "Jeder Service erhöht den Kundenwert", desc: "Der erste Kontakt kann in mehrere Servicebuchungen übergehen.", wow: "Höherer Lifetime Value pro gewonnenem Kunden.", tier: "big-wow", group: "market" },

  // ─── BLOCK 2: SEO, SICHTBARKEIT & DOMINANZ ───
  { id: 11, icon: Search, title: "Wer SEO kontrolliert, kontrolliert den Eingang", desc: "Menschen suchen aktiv nach Umzug, Reinigung, Offerten und Vergleich.", wow: "Wer dort oben steht, sitzt direkt am Markt-Eingang.", tier: "nuclear-wow", group: "seo" },
  { id: 12, icon: Shield, title: "SEO baut einen echten Burggraben", desc: "Gute Rankings arbeiten weiter, während bezahlte Werbung stoppt, sobald das Budget stoppt.", wow: "Langfristige Sichtbarkeit ist ein struktureller Vorteil.", tier: "big-wow", group: "seo" },
  { id: 13, icon: Monitor, title: "Der Markt ist digital noch schwach", desc: "Viele Anbieter existieren operativ, aber sind in SEO, UX und Datenstrategie schwach.", wow: "Genau dort kann ein systematischer Player aufholen und vorbeiziehen.", tier: "big-wow", group: "seo" },
  { id: 14, icon: MapPin, title: "Lokale Hubs machen nationale Skalierung relevant", desc: "Gemeinden, Städte und Regionen können als eigene digitale Einstiege aufgebaut werden.", wow: "Skalierung und lokale Nähe gleichzeitig.", tier: "nuclear-wow", group: "seo" },
  { id: 15, icon: Building2, title: "Jede Gemeinde wird ein Relocation Hub", desc: "Gemeinde-spezifische Seiten, Daten und Services erhöhen Relevanz und Abdeckung.", wow: "Das geht weit über normale Landingpages hinaus.", tier: "big-wow", group: "seo" },
  { id: 16, icon: Globe, title: "Wir kartieren den ganzen Markt", desc: "Gemeinden, Anbieter, Services, Suchintentionen und Vergleiche werden systematisch abgebildet.", wow: "Andere bauen eine Website. Wir bauen eine Landkarte.", tier: "nuclear-wow", group: "seo" },
  { id: 17, icon: Trophy, title: "Wenn wir Referenz sind, orientiert sich der Markt", desc: "Nutzer und Anbieter gewöhnen sich an Umzugscheck als Startpunkt.", wow: "Dann gewinnt ihr nicht nur Klicks, sondern Deutungshoheit.", tier: "nuclear-wow", group: "seo" },
  { id: 18, icon: Zap, title: "Je länger wir laufen, desto unfairer der Vorsprung", desc: "Seiten, Daten, Tests, Rankings und Prozesse stapeln sich über Zeit.", wow: "Der Abstand zur Konkurrenz wächst kumulativ.", tier: "nuclear-wow", group: "seo" },
  { id: 19, icon: LayoutGrid, title: "Einmal gebaut, beliebig skalierbar", desc: "Content-Modelle, Seitenstrukturen und Datenmodelle lassen sich vervielfältigen.", wow: "Hoher Initialaufwand, aber sinkende Grenzkosten pro neuer Region.", tier: "nuclear-wow", group: "seo" },
  { id: 20, icon: MousePointerClick, title: "Standard sein macht alles leichter", desc: "Sobald Nutzer automatisch bei euch vergleichen, wird jede Akquise günstiger.", wow: "Nachfrage landet natürlicher bei euch statt teuer gejagt zu werden.", tier: "big-wow", group: "seo" },

  // ─── BLOCK 3: PLATTFORM, DATEN & MARKTMACHT ───
  { id: 21, icon: Settings, title: "Wir kombinieren, was andere getrennt denken", desc: "Vergleichsplattform, SEO-Maschine, KI-System, lokaler Content und eigene Services.", wow: "Diese Kombination ist schwer kopierbar.", tier: "nuclear-wow", group: "platform" },
  { id: 22, icon: Network, title: "Plattform schlägt Einzeldienstleister", desc: "Eine Plattform bündelt Nachfrage und steuert Auswahl zentral.", wow: "Ein einzelner Anbieter sieht nur seinen kleinen Ausschnitt.", tier: "big-wow", group: "platform" },
  { id: 23, icon: Target, title: "Der Vergleich gewinnt den ganzen Prozess", desc: "Wer den Nutzer im Vergleich überzeugt, bleibt zentral.", wow: "Dann seid ihr Schaltzentrale statt blosse Weiterleitung.", tier: "nuclear-wow", group: "platform" },
  { id: 24, icon: Radar, title: "Markttransparenz ist selbst ein Produkt", desc: "Ihr verkauft nicht nur Leistungen, sondern Orientierung.", wow: "Das schafft Vertrauen und wirkt grösser als reine Eigenwerbung.", tier: "big-wow", group: "platform" },
  { id: 25, icon: Banknote, title: "Die Plattform wird zum Preisanker", desc: "Wenn Nutzer regelmässig vergleichen, beeinflusst ihr Preiswahrnehmung und Erwartung.", wow: "Wer die Referenz setzt, kontrolliert mehr als Sichtbarkeit.", tier: "big-wow", group: "platform" },
  { id: 26, icon: RefreshCw, title: "Das System verbessert sich durch Nutzung", desc: "Jede Anfrage, jeder Vergleich, jede Offerte liefert neue Signale.", wow: "Wachstum bringt nicht nur Umsatz, sondern Lernvorsprung.", tier: "big-wow", group: "platform" },
  { id: 27, icon: Brain, title: "Jeder Datensatz macht das System schlauer", desc: "Mit jeder Firma, Region und Servicekombination wächst das Marktverständnis.", wow: "Das Projekt wird mit der Zeit intelligenter, nicht nur grösser.", tier: "big-wow", group: "platform" },
  { id: 28, icon: Database, title: "Die Plattform wird zum Marktgedächtnis", desc: "Anbieter, Services, Preisrahmen und Muster werden laufend strukturiert erfasst.", wow: "Das ist Marktintelligenz, nicht nur Traffic.", tier: "deep-usp", group: "platform" },
  { id: 29, icon: Eye, title: "Plattform lernt schneller als einzelne Anbieter", desc: "Eine Plattform sieht breiteres Verhalten als eine einzelne Umzugsfirma.", wow: "Mehr Sicht auf den Markt = schnellere Optimierung.", tier: "big-wow", group: "platform" },
  { id: 30, icon: CircuitBoard, title: "Jeder Teilnehmer macht das Modell wertvoller", desc: "Mehr Firmen, mehr Regionen, mehr Vergleiche machen die Plattform nützlicher.", wow: "Plattformlogik verstärkt sich selbst.", tier: "deep-usp", group: "platform" },

  // ─── BLOCK 4: KI, WHATSAPP & AUTOMATION ───
  { id: 31, icon: Cpu, title: "95% KI macht das Modell extrem skalierbar", desc: "KI übernimmt Content, Analyse, Struktur, Aktualisierung und grosse Teile der Maintenance.", wow: "Mehr Output mit weniger menschlichem Aufwand.", tier: "nuclear-wow", group: "ai" },
  { id: 32, icon: Bot, title: "KI ist hier kein Gimmick, sondern Produktionsmaschine", desc: "KI unterstützt nicht dekorativ, sondern operativ.", wow: "Sie produziert echten Vorsprung.", tier: "nuclear-wow", group: "ai" },
  { id: 33, icon: Users, title: "KI + Mensch statt KI statt Mensch", desc: "Der Mensch setzt Richtung und Qualitätskontrolle, KI vervielfacht Tempo und Abdeckung.", wow: "Genau die Kombination ist unfair stark.", tier: "nuclear-wow", group: "ai" },
  { id: 34, icon: MessageCircle, title: "WhatsApp ist bei uns Vertrieb, nicht Support", desc: "Kunden können direkt im Messenger Leistungen auswählen, anfragen und interagieren.", wow: "Ein Kanal, den die Leute sowieso nutzen, wird zum Verkaufsweg.", tier: "nuclear-wow", group: "ai" },
  { id: 35, icon: LayoutList, title: "WhatsApp-Katalog macht Einstieg sofort konkret", desc: "Bilder, Leistungen, Beschreibungen und Preise sind direkt im Chat sichtbar.", wow: "Kein abstraktes 'meld dich mal', sondern direkte Auswahl.", tier: "big-wow", group: "ai" },
  { id: 36, icon: MessageSquarePlus, title: "Kunde sagt direkt im Chat, was er braucht", desc: "Statt langen Formularen oder Mails kann die Auswahl direkt in WhatsApp passieren.", wow: "Maximale Reibungsreduktion.", tier: "big-wow", group: "ai" },
  { id: 37, icon: Workflow, title: "OpenClaw übernimmt den operativen Mittelteil", desc: "Intake, Verarbeitung, Interaktion und Vorbereitung der Offerte werden automatisiert.", wow: "Die mühsame Mitte verschwindet.", tier: "nuclear-wow", group: "ai" },
  { id: 38, icon: Bot, title: "KI macht schon heute aktives Kundenmanagement", desc: "Kommunikation, Rückfragen und Interaktion laufen bereits KI-gestützt.", wow: "Nicht Vision, sondern startklare Realität.", tier: "nuclear-wow", group: "ai" },
  { id: 39, icon: CheckCircle2, title: "Mensch bleibt nur finale Freigabeinstanz", desc: "Am Ende prüfst du nur noch Offerte oder Lead und gibst frei.", wow: "Menschliche Kontrolle ohne menschlichen Flaschenhals.", tier: "big-wow", group: "ai" },
  { id: 40, icon: Rocket, title: "Von Google → WhatsApp → vollautomatisch zur Offerte", desc: "SEO bringt Nachfrage, WhatsApp fängt ab, KI übernimmt, am Schluss nur noch Freigabe.", wow: "Sichtbarkeit, Kommunikation und Automatisierung verschmelzen.", tier: "nuclear-wow", group: "ai" },

  // ─── BLOCK 5: EXECUTION, TESTING & GRÜNDERHEBEL ───
  { id: 41, icon: Flag, title: "Die Person, die das baut, hört nicht auf", desc: "Dieses Projekt wird nicht halbherzig betrieben, sondern so lange weiterentwickelt, bis es funktioniert.", wow: "Viele Ideen scheitern nicht am Markt, sondern an fehlender Ausdauer.", tier: "nuclear-wow", group: "execution" },
  { id: 42, icon: Crosshair, title: "Grösster Sicherheitsfaktor: kompromisslose Execution", desc: "Hier arbeitet nicht jemand nebenbei, sondern fokussiert und mit persönlichem Druck.", wow: "Für den Investor ist genau das der eigentliche Vertrauenshebel.", tier: "big-wow", group: "execution" },
  { id: 43, icon: Layers, title: "20 Jahre SEO-/System-Denken", desc: "Das Wissen kommt nicht aus Theorie, sondern aus jahrelanger Praxis mit Ranking und Skalieren.", wow: "Execution-Qualität ist hier kein Zufall.", tier: "big-wow", group: "execution" },
  { id: 44, icon: BarChart3, title: "60 dokumentierte Funnel- und Flow-Varianten", desc: "Von Zero Friction bis Chat, Swiss, Video, Trust, Marketplace und Archetypen.", wow: "Das zeigt systematisches Bauen, nicht nur schöne Worte.", tier: "nuclear-wow", group: "execution" },
  { id: 45, icon: FlaskConical, title: "Testing ist hier Betriebssystem, nicht Option", desc: "Unterschiedliche Funnels, UX-Ansätze und Preislogiken werden gegeneinander getestet.", wow: "Schnellere Lernzyklen schlagen grössere, trägere Konkurrenz.", tier: "big-wow", group: "execution" },
  { id: 46, icon: ArrowUpCircle, title: "Das Modell ist kumulativ, nicht linear", desc: "Eine Erkenntnis kann in viele Seiten, Funnels und Prozesse gleichzeitig einfliessen.", wow: "Einmal lernen, mehrfach profitieren.", tier: "big-wow", group: "execution" },
  { id: 47, icon: Wrench, title: "Operative Realität schützt vor Fantasie-Business", desc: "Weil echte Services dahinterstehen, bleibt das Ganze marktnäher als reine Lead-Portale.", wow: "Weniger Bullshit, mehr Wirklichkeit.", tier: "deep-usp", group: "execution" },
  { id: 48, icon: FileCode, title: "Systemlogik statt Bauchgefühl", desc: "Nachfrage, Suchverhalten, Vergleichslogik, lokale Relevanz und Automatisierung greifen zusammen.", wow: "Das Modell steht auf Hebeln, nicht nur auf Euphorie.", tier: "big-wow", group: "execution" },
  { id: 49, icon: Infinity, title: "Nicht das Nötige, sondern das Mögliche", desc: "Alle Gemeinden, alle Services, alle Daten, alle Hebel, alle Tests, alle Kanäle.", wow: "Genau diese Radikalität macht aus einer guten Idee ein Dominanzmodell.", tier: "nuclear-wow", group: "execution" },
  { id: 50, icon: Globe2, title: "Schweiz ist nicht das Ende, sondern der Anfang", desc: "Danach sind Exit, White-Label, Länderausbau oder Systemverkauf möglich.", wow: "Die Story endet nicht bei lokalen Leads, sondern kann in Asset-Wert übergehen.", tier: "big-wow", group: "execution" },
];

const TOP_7_IDS = [1, 8, 11, 16, 31, 40, 49];

const GROUPS = [
  { key: "market", label: "Markt & Nachfrage", emoji: "📊", color: "primary" },
  { key: "seo", label: "SEO, Sichtbarkeit & Dominanz", emoji: "🔍", color: "blue-500" },
  { key: "platform", label: "Plattform, Daten & Marktmacht", emoji: "🏗️", color: "purple-500" },
  { key: "ai", label: "KI, WhatsApp & Automation", emoji: "🤖", color: "green-500" },
  { key: "execution", label: "Execution, Testing & Gründerhebel", emoji: "🎯", color: "amber-500" },
];

const tierStyles = {
  "nuclear-wow": {
    card: "border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card shadow-md",
    iconBox: "w-12 h-12 rounded-2xl bg-primary/20",
    iconCls: "w-6 h-6 text-primary",
    titleCls: "text-lg font-extrabold",
  },
  "big-wow": {
    card: "border-border bg-card",
    iconBox: "w-10 h-10 rounded-xl bg-primary/10",
    iconCls: "w-5 h-5 text-primary",
    titleCls: "text-base font-bold",
  },
  "deep-usp": {
    card: "border-border/60 bg-card/80",
    iconBox: "w-9 h-9 rounded-lg bg-muted",
    iconCls: "w-4 h-4 text-muted-foreground",
    titleCls: "text-sm font-semibold",
  },
};

function ReasonCard({ reason, index, large }: { reason: Reason; index: number; large?: boolean }) {
  const s = tierStyles[reason.tier];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className={`relative group rounded-2xl border ${large ? "p-6 md:p-7" : "p-5"} hover:shadow-xl transition-all overflow-hidden ${s.card}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className={`${s.iconBox} flex items-center justify-center mb-3`}>
          <reason.icon className={s.iconCls} />
        </div>
        <h3 className={`${s.titleCls} text-foreground mb-1.5`}>{reason.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-2">{reason.desc}</p>
        <p className="text-xs text-primary/80 font-medium italic border-t border-primary/10 pt-2 mt-2">
          💡 {reason.wow}
        </p>
      </div>
    </motion.div>
  );
}

interface WhyInvestSectionProps {
  language?: string;
}

export function WhyInvestSection({ language = "de" }: WhyInvestSectionProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const top7 = ALL_REASONS.filter((r) => TOP_7_IDS.includes(r.id));

  return (
    <section className="py-16 md:py-24 px-4" id="50-gruende">
      <div className="max-w-6xl mx-auto">
        {/* ═══ HEADER ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">Investment Thesis</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Warum das hier funktionieren muss
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-3">
            Nicht weil wir hoffen. Sondern weil Markt, Suchverhalten, Plattformlogik, KI, WhatsApp und kompromisslose Execution zusammen ein Modell ergeben, das mit genug Zeit nach oben drückt.
          </p>
          <p className="text-sm text-muted-foreground/60 italic max-w-xl mx-auto">
            Hinweis: Diese Seite ist die bewusst übertriebene Freundschafts-Version.
            Wenn dir die ersten 5 Gründe reichen, gut. Wenn nicht, haben wir noch 45 weitere.
          </p>
        </motion.div>

        {/* ═══ TOP-7 NUCLEAR WOW ═══ */}
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-bold uppercase tracking-wider mb-5">
            🔥 Die 7 härtesten Gründe
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-16 md:mb-20">
          {top7.map((r, i) => (
            <ReasonCard key={r.id} reason={r} index={i} large />
          ))}
        </div>

        {/* ═══ INFOGRAPHICS: Revenue Waterfall + Service Chain ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-2xl border border-border bg-slate-950 p-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-4 text-center uppercase tracking-wide">Revenue pro Kunde (Waterfall)</h4>
            <RevenueWaterfall />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 text-center uppercase tracking-wide">Cross-Sell Service-Kette</h4>
            <ServiceChainInfographic />
          </div>
        </div>

        {/* ═══ ALL 50 IN 5 THEMED BLOCKS ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
            Alle 50 Gründe
          </h3>
          <p className="text-muted-foreground mb-6">
            In 5 Themenblöcken — von Marktlogik bis Gründer-DNA.
          </p>
          
          {/* Group Stats Chart */}
          <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-5">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Argument-Stärke nach Themenblock</h4>
            <GroupStatsChart />
          </div>
        </motion.div>

        {GROUPS.map((group) => {
          const reasons = ALL_REASONS.filter((r) => r.group === group.key);
          const isOpen = expandedGroup === group.key;

          return (
            <div key={group.key} className="mb-6">
              <button
                onClick={() => setExpandedGroup(isOpen ? null : group.key)}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{group.emoji}</span>
                  <span className="font-bold text-foreground">{group.label}</span>
                  <Badge variant="secondary" className="text-xs">{reasons.length}</Badge>
                </span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pb-2">
                      {reasons.map((r, i) => (
                        <ReasonCard key={r.id} reason={r} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* ═══ SUMMARY ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 md:p-10 text-center max-w-4xl mx-auto mt-12"
        >
          <p className="text-lg md:text-xl font-semibold text-foreground leading-relaxed">
            50 Gründe. 5 Blöcke. 7 Nuclear-Argumente oben.
            <br className="hidden sm:block" />
            Der Schweizer Umzugsmarkt hat keinen digitalen Champion —{" "}
            <span className="text-primary">wir bauen ihn.</span>
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Kein Gründerlohn. Kompromisslose Execution. Nur Mathematik und Zeit.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
