/**
 * SEOContentMoatSection
 * Shows the 2,110 municipality programmatic SEO strategy
 * AI-agent pipeline, 10 content projects, rollout timeline
 */

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Globe, MapPin, Bot, Search, Database, Zap,
  FileText, BarChart3, Users, Mic, PenTool,
  Camera, Trophy, BookOpen, Shield, ArrowRight,
  CheckCircle2, Lock, Layers
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

// ═══════════════════════════════════════════════════════
// CONFIGURABLE NUMBERS
// ═══════════════════════════════════════════════════════
const MOAT = {
  totalMunicipalities: 2_110,
  cantons: 26,
  contentProjects: 10,
  automationPercent: 95,
  setupHours: 15,
};

const PIPELINE_STEPS = [
  { icon: Search, label: "Scrape", desc: "Gemeinde-Daten sammeln" },
  { icon: Database, label: "Enrich", desc: "Strukturieren & validieren" },
  { icon: PenTool, label: "Draft", desc: "AI generiert Inhalte" },
  { icon: Shield, label: "QA", desc: "Faktencheck & Qualität" },
  { icon: Globe, label: "Publish", desc: "SEO-optimiert live" },
  { icon: BarChart3, label: "Monitor", desc: "Rankings & Refresh" },
];

const TOP_PROJECTS = [
  { icon: MapPin, name: "Swiss Relocation Command Center", desc: "Kanton- & Gemeinde-Checklisten mit offiziellen Daten", priority: "high" },
  { icon: BarChart3, name: "Swiss Move Cost Index", desc: "Quartals-Report mit Umzugskosten nach Region & Saison", priority: "high" },
  { icon: FileText, name: "Personalized Move Plan Generator", desc: "Individuelle Umzugs-Timeline & Checkliste per AI", priority: "high" },
  { icon: Zap, name: "Interactive Calculators", desc: "CO₂-Rechner, Steuer-Differenz, Möbellift-Tool", priority: "high" },
  { icon: PenTool, name: "Data-driven Infographics", desc: "Teilbare Visualisierungen für Medien & Backlinks", priority: "high" },
  { icon: Mic, name: "Expert Podcast Series", desc: "Interviews mit Logistik-Experten & Partnern", priority: "medium" },
  { icon: Users, name: "User Stories & Community Hub", desc: "Echte Umzugs-Erfahrungen & Tipps", priority: "medium" },
  { icon: Camera, name: "AI Home Inventory App", desc: "Kamera-basierte Inventar-Erkennung", priority: "medium" },
  { icon: Trophy, name: "Open Data Challenge", desc: "Hackathon mit anonymisierten Umzugsdaten", priority: "low" },
  { icon: BookOpen, name: "Industry Whitepaper", desc: "Thought-Leadership & PR-Outreach", priority: "low" },
];

const ROLLOUT_PHASES = [
  {
    phase: "Phase 1",
    months: "Monat 1–3",
    color: "bg-blue-500",
    items: ["26 Kantone als Hub-Seiten", "Top 50 Gemeinden live", "Dashboard v1 + Scoring-Modell", "Interne Verlinkungsstruktur"],
  },
  {
    phase: "Phase 2",
    months: "Monat 4–6",
    color: "bg-amber-500",
    items: ["250+ Gemeinden publiziert", "Move Cost Index Launch + PR", "Backlink-Kampagne gestartet", "Search Console Integration"],
  },
  {
    phase: "Phase 3",
    months: "Monat 7–9",
    color: "bg-emerald-500",
    items: ["500+ Gemeinden indexiert", "Full Automation Pipeline", "Organischer Traffic-Flywheel", "Selbsttragende Content-Maschine"],
  },
];

const MOAT_REASONS = [
  { icon: MapPin, text: "2'110 lokale Landing Pages mit echten Gemeindedaten" },
  { icon: Bot, text: "AI-Pipeline: 15h Setup → automatische Skalierung" },
  { icon: Globe, text: "Backlinks von Gemeinden, Expat-Guides, Medien" },
  { icon: Zap, text: "Organischer Traffic-Flywheel ohne laufende Ad-Kosten" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface Props {
  language: VisionLanguage;
}

export function SEOContentMoatSection({ language }: Props) {
  const isDE = language === "de";

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* HEADER */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1.5 border-primary/30 bg-primary/5">
            <Layers className="w-3.5 h-3.5 mr-1.5" />
            Technical Moat
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            2'110 Gemeinden. 1 System.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {isDE
              ? "Programmatische SEO-Dominanz: Jede Schweizer Gemeinde bekommt eine datengestützte, AI-generierte Landing Page — vollautomatisch."
              : "Programmatic SEO dominance: Every Swiss municipality gets a data-driven, AI-generated landing page — fully automated."}
          </p>
        </motion.div>

        {/* KPI CARDS */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            { value: MOAT.totalMunicipalities.toLocaleString("de-CH"), label: "Ziel-Gemeinden", icon: MapPin, color: "text-blue-500" },
            { value: MOAT.cantons.toString(), label: "Kantone als Hubs", icon: Globe, color: "text-emerald-500" },
            { value: MOAT.contentProjects.toString(), label: "Content-Projekte", icon: FileText, color: "text-amber-500" },
            { value: `${MOAT.automationPercent}%`, label: "Automation", icon: Bot, color: "text-purple-500" },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className="bg-card border border-border rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition-shadow"
            >
              <kpi.icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 ${kpi.color}`} />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{kpi.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI PIPELINE */}
        <motion.div
          className="mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
            <Bot className="inline w-5 h-5 mr-2 text-primary" />
            {isDE ? "AI-Agent Pipeline" : "AI Agent Pipeline"}
          </h3>

          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-center justify-center gap-2">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="bg-card border border-border rounded-xl p-4 text-center min-w-[120px] hover:border-primary/50 transition-colors">
                  <step.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-sm text-foreground">{step.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{step.desc}</div>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-3">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label} className="relative">
                <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                  <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{step.label}</div>
                    <div className="text-xs text-muted-foreground">{step.desc}</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-[10px]">{i + 1}</Badge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 10 CONTENT PROJECTS */}
        <motion.div
          className="mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
            {isDE ? "10 Strategische Content-Projekte" : "10 Strategic Content Projects"}
          </h3>

          {/* Top 5 prominent */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4">
            {TOP_PROJECTS.slice(0, 5).map((project) => (
              <motion.div
                key={project.name}
                variants={fadeUp}
                className="bg-card border border-border rounded-xl p-4 md:p-5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
                    <project.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{project.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{project.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom 5 compact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
            {TOP_PROJECTS.slice(5).map((project) => (
              <div
                key={project.name}
                className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center"
              >
                <project.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-xs font-medium text-foreground/80 leading-tight">{project.name}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* COMPETITIVE MOAT */}
        <motion.div
          className="mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="text-lg md:text-xl font-bold text-foreground">
                {isDE ? "Warum das schwer kopierbar ist" : "Why this is hard to replicate"}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {MOAT_REASONS.map((reason) => (
                <div key={reason.text} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/90">{reason.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ROLLOUT TIMELINE */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
            {isDE ? "Rollout-Plan" : "Rollout Plan"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {ROLLOUT_PHASES.map((phase) => (
              <motion.div
                key={phase.phase}
                variants={fadeUp}
                className="bg-card border border-border rounded-xl p-5 md:p-6 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${phase.color}`} />
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-foreground">{phase.phase}</span>
                  <Badge variant="secondary" className="text-xs">{phase.months}</Badge>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
