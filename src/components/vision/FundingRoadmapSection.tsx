/**
 * FundingRoadmapSection
 * Visual funding roadmap for /investoren page
 * CHF 70k Pre-Seed in 3 milestone-based tranches
 */

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Rocket, Target, TrendingUp, Shield,
  CheckCircle2, ArrowRight, Heart, Calculator,
  Zap, BarChart3, Lock, Mail
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

const FUNDING = {
  total: 70_000,
  tranches: [
    { amount: 20_000, label: "Validation", phase: "TRANCHE 1", months: "1–4" },
    { amount: 25_000, label: "Traction", phase: "TRANCHE 2", months: "5–9" },
    { amount: 25_000, label: "Scale to Break-even", phase: "TRANCHE 3", months: "10–15" },
  ],
  maxRisk: 20_000,
  horizonMonths: "12–18",
  revenue: [
    { month: "Monat 3", amount: "CHF 500", label: "Erste Provisionen" },
    { month: "Monat 6", amount: "CHF 1'800", label: "Wachsende Leads" },
    { month: "Monat 9", amount: "CHF 3'200", label: "Nahe Break-even" },
    { month: "Monat 12–15", amount: "CHF 5'000+", label: "Selbsttragend ✓" },
  ],
};

const fmt = (n: number) =>
  new Intl.NumberFormat("de-CH", { style: "decimal" }).format(n);

const trancheConfig = [
  {
    color: "primary",
    dotClass: "bg-primary",
    borderClass: "border-primary/30",
    bgClass: "bg-primary/5",
    Icon: Rocket,
    description: "Produkt marktreif machen, erste zahlende Umzugsfirmen onboarden und die Unit Economics mit echten Leads validieren.",
    tags: ["Google Ads Setup", "Partner-Akquise", "Plattform-Feinschliff"],
    milestoneTitle: "MILESTONES FÜR FREIGABE TRANCHE 2",
    milestones: [
      "15–20 Umzugsfirmen aktiv auf der Plattform",
      "50–100 echte Leads generiert",
      "Cost per Lead unter CHF 25 validiert",
      "Erste Provisionseinnahmen erzielt",
    ],
  },
  {
    color: "amber",
    dotClass: "bg-amber-500",
    borderClass: "border-amber-500/30",
    bgClass: "bg-amber-500/5",
    Icon: TrendingUp,
    description: "Marketing skalieren, Conversion-Rate optimieren, regionale Expansion in die gesamte Deutschschweiz und erste Schritte in die Romandie.",
    tags: ["Paid Marketing skalieren", "Regionale Expansion", "SEO & Content"],
    milestoneTitle: "MILESTONES FÜR FREIGABE TRANCHE 3",
    milestones: [
      "Monatlicher Umsatz CHF 1'500–2'500",
      "200+ Leads pro Monat",
      "Wiederkehrende Partner-Firmen (Retention bestätigt)",
      "Klarer Pfad zu Break-even sichtbar",
    ],
  },
  {
    color: "emerald",
    dotClass: "bg-emerald-500",
    borderClass: "border-emerald-500/30",
    bgClass: "bg-emerald-500/5",
    Icon: Target,
    description: "Break-even erreichen, Automatisierung ausbauen, organisches Wachstum über SEO ernten und optionaler Start in der Romandie und im Tessin.",
    tags: ["Romandie & Tessin", "Automatisierung", "Organisches Wachstum"],
    milestoneTitle: "ENDZIEL",
    milestones: [
      "Monatlicher Umsatz deckt laufende Kosten (CHF 4'000–5'000)",
      "Positiver ROI auf alle Marketing-Kanäle",
      "Plattform wächst selbsttragend weiter",
    ],
  },
];

interface Props {
  language: VisionLanguage;
}

export function FundingRoadmapSection({ language }: Props) {
  return (
    <section className="py-16 md:py-24 bg-background" id="funding-roadmap">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* ── Header ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1.5 border-primary/40 text-primary">
            <Calculator className="w-3.5 h-3.5 mr-1.5" />
            FUNDING ROADMAP
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            CHF {fmt(FUNDING.total)} bis zur Selbsttragung
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Drei Tranchen, klare Milestones, begrenztes Risiko. Jede Tranche wird nur freigegeben, wenn die vorherige ihre Ziele erreicht hat.
          </p>
        </motion.div>

        {/* ── KPI Bar ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14"
        >
          {[
            { label: "GESAMTBEDARF", value: `CHF ${fmt(FUNDING.total)}`, sub: "Aufgeteilt in 3 Tranchen", icon: BarChart3 },
            { label: "MAXIMALES RISIKO", value: `CHF ${fmt(FUNDING.maxRisk)}`, sub: "Falls Tranche 1 scheitert", icon: Shield },
            { label: "ZEITHORIZONT", value: `${FUNDING.horizonMonths} Monate`, sub: "Bis Break-even", icon: Zap },
          ].map((kpi, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 text-center">
              <kpi.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">{kpi.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Tranchen Timeline ──────────────── */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 md:left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-8">
            {FUNDING.tranches.map((tranche, i) => {
              const config = trancheConfig[i];
              const isActive = i === 0;
              const Icon = config.Icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-3.5 md:left-4 top-6 w-4 h-4 rounded-full ${config.dotClass} border-2 border-background z-10 hidden md:block`} />

                  <div className={`md:ml-14 rounded-xl border ${config.borderClass} ${config.bgClass} p-4 sm:p-5 md:p-6 ${!isActive ? 'opacity-85' : ''}`}>
                    {/* Phase label + amount */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${config.bgClass} shrink-0`}>
                          <Icon className="w-5 h-5 text-foreground/70" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {tranche.phase} · Monat {tranche.months}
                          </div>
                          <div className="font-bold text-foreground text-lg sm:text-xl">
                            {tranche.label}
                          </div>
                        </div>
                      </div>
                      <div className="sm:ml-auto pl-11 sm:pl-0">
                        <span className="text-xl sm:text-2xl font-bold text-foreground">
                          CHF {fmt(tranche.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {config.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {config.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Milestones */}
                    <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        {config.milestoneTitle}
                      </div>
                      <ul className="space-y-2">
                        {config.milestones.map((m, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Risk Cards ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-14"
        >
          <div className="rounded-xl border border-border bg-card p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-foreground">Risikobegrenzung für Investoren</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Durch die Tranchenstruktur ist das maximale Verlustrisiko auf CHF {fmt(FUNDING.maxRisk)} begrenzt. 
              Tranche 2 und 3 werden nur bei nachgewiesener Traction freigegeben — keine Spekulation, nur Daten.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 border-l-4 border-l-primary">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">100% Invest — kein Gründerlohn</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Der Gründer arbeitet Vollzeit ohne Lohn. Jeder Franken fliesst direkt in Wachstum — Marketing, Tools, Content. Maximaler Skin in the Game.
            </p>
          </div>
        </motion.div>

        {/* ── Break-even Projection ───────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Weg zum Break-even</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Ziel: Monat 12–15</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FUNDING.revenue.map((r, i) => (
              <div key={i} className="bg-background/70 rounded-lg p-3 text-center border border-border/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  {r.month}
                </div>
                <div className="text-lg sm:text-xl font-bold text-foreground">{r.amount}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.label}</div>
              </div>
            ))}
          </div>

          {/* Arrow progression */}
          <div className="hidden sm:flex items-center justify-center gap-2 mt-4">
            {FUNDING.revenue.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground/60">{r.amount}</span>
                {i < FUNDING.revenue.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary)/0.9)] to-[hsl(var(--primary))] p-8 sm:p-10 text-center text-primary-foreground"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">
            Interesse an einem Gespräch?
          </h3>
          <p className="text-sm sm:text-base opacity-90 mb-6 max-w-lg mx-auto">
            Wir suchen einen strategischen Partner, der an die Zukunft des Schweizer Umzugsmarktes glaubt.
          </p>
          <a
            href="mailto:invest@umzugscheck.ch?subject=Investor%20Interesse%20Pre-Seed"
            className="inline-flex items-center gap-2 bg-background text-foreground font-semibold px-6 py-3 rounded-lg hover:bg-background/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Kontakt aufnehmen
          </a>
        </motion.div>

      </div>
    </section>
  );
}
