/**
 * FundingRoadmapSection
 * Visual funding roadmap for /investoren page
 * CHF 60k Pre-Seed in 3 milestone-based tranches
 */

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, Target, TrendingUp, Shield, Lock, 
  CheckCircle2, ArrowRight, Heart, Calculator,
  Zap, BarChart3, Users
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

// ═══════════════════════════════════════════════════════
// EASILY ADJUSTABLE NUMBERS — change here, updates everywhere
// ═══════════════════════════════════════════════════════
const FUNDING = {
  total: 60_000,
  tranches: [
    { amount: 15_000, label: "Launchpad", months: "1–3" },
    { amount: 20_000, label: "Scale-up", months: "4–6" },
    { amount: 25_000, label: "Sustainability", months: "7–9" },
  ],
  maxRisk: 15_000,
  horizonMonths: "6–8",
  marginPerJob: 1_590,
  reinvestPerJob: 990,
};

const fmt = (n: number) =>
  new Intl.NumberFormat("de-CH", { style: "decimal" }).format(n);

// ── Translations ──────────────────────────────────────
const t: Record<VisionLanguage, Record<string, string>> = {
  de: {
    badge: "Pre-Seed Funding",
    title: `CHF ${fmt(FUNDING.total)} bis zur Selbsttragfähigkeit`,
    subtitle:
      "Milestone-basiert. Risikobegrenzt. 100 % in Wachstum investiert — kein Gründerlohn.",
    kpi1: "Gesamtbedarf",
    kpi2: "Max. Erst-Risiko",
    kpi3: "Zeithorizont",
    months: "Monate",
    tranche: "Tranche",
    unlockTitle: "Freigabe-Bedingung",
    riskTitle: "Risikobegrenzung",
    riskBody: `Maximaler Verlust: CHF ${fmt(FUNDING.maxRisk)}. Tranche 2 und 3 werden nur bei nachgewiesenen Milestones freigegeben.`,
    skinTitle: "Skin in the Game",
    skinBody:
      "Gründer arbeitet Vollzeit ohne Lohn. 100 % des Kapitals fliesst direkt in Wachstum und Infrastruktur.",
    marginTitle: "Finanzierungslogik",
    marginSub: `Jeder Auftrag generiert Ø CHF ${fmt(FUNDING.marginPerJob)} Umsatz — davon ~CHF ${fmt(FUNDING.reinvestPerJob)} werden direkt reinvestiert.`,
    ctaTitle: "Interesse an einem Gespräch?",
    ctaSub: `Einstieg ab CHF ${fmt(FUNDING.tranches[0].amount)} möglich. Grössere Beteiligung über milestone-basierte Tranchen.`,
    ctaBtn: "Kontakt aufnehmen",
    active: "Aktiv",
    locked: "Milestone-gesperrt",
  },
  bg: {
    badge: "Pre-Seed Финансиране",
    title: `CHF ${fmt(FUNDING.total)} до самоиздръжка`,
    subtitle:
      "На базата на етапи. Ограничен риск. 100 % инвестирано в растеж — без заплата за основателя.",
    kpi1: "Общ бюджет",
    kpi2: "Макс. риск",
    kpi3: "Хоризонт",
    months: "месеца",
    tranche: "Транш",
    unlockTitle: "Условие за отключване",
    riskTitle: "Ограничаване на риска",
    riskBody: `Максимална загуба: CHF ${fmt(FUNDING.maxRisk)}. Транш 2 и 3 само при доказани етапи.`,
    skinTitle: "Skin in the Game",
    skinBody:
      "Основателят работи на пълен работен ден без заплата. 100 % отива директно в растеж.",
    marginTitle: "Финансова логика",
    marginSub: `Всяка поръчка генерира Ø CHF ${fmt(FUNDING.marginPerJob)} — ~CHF ${fmt(FUNDING.reinvestPerJob)} се реинвестират.`,
    ctaTitle: "Интерес за разговор?",
    ctaSub: `Вход от CHF ${fmt(FUNDING.tranches[0].amount)}. По-голямо участие чрез етапни траншове.`,
    ctaBtn: "Свържете се",
    active: "Активен",
    locked: "Заключен",
  },
  it: {
    badge: "Pre-Seed Funding",
    title: `CHF ${fmt(FUNDING.total)} fino all'autosufficienza`,
    subtitle:
      "Basato su milestone. Rischio limitato. 100 % investito nella crescita — nessuno stipendio per il fondatore.",
    kpi1: "Budget totale",
    kpi2: "Rischio max.",
    kpi3: "Orizzonte",
    months: "mesi",
    tranche: "Tranche",
    unlockTitle: "Condizione di sblocco",
    riskTitle: "Limitazione del rischio",
    riskBody: `Perdita massima: CHF ${fmt(FUNDING.maxRisk)}. Tranche 2 e 3 solo con milestone verificati.`,
    skinTitle: "Skin in the Game",
    skinBody:
      "Il fondatore lavora a tempo pieno senza stipendio. Il 100 % va nella crescita.",
    marginTitle: "Logica di finanziamento",
    marginSub: `Ogni ordine genera Ø CHF ${fmt(FUNDING.marginPerJob)} — ~CHF ${fmt(FUNDING.reinvestPerJob)} vengono reinvestiti.`,
    ctaTitle: "Interessato a parlarne?",
    ctaSub: `Ingresso da CHF ${fmt(FUNDING.tranches[0].amount)}. Partecipazione maggiore tramite tranche milestone.`,
    ctaBtn: "Contattaci",
    active: "Attivo",
    locked: "Bloccato",
  },
};

// ── Tranche details ───────────────────────────────────
const trancheDetails: Record<VisionLanguage, { tags: string[]; milestones: string[] }[]> = {
  de: [
    {
      tags: ["GmbH-Gründung", "ERP v2", "Tech-Setup", "Stripe"],
      milestones: [
        "GmbH formell gegründet",
        "Zahlungslogik end-to-end live",
        "Tracking & CRM sauber aufgesetzt",
        "Erste Partner onboarded",
      ],
    },
    {
      tags: ["Google Ads", "SEO/Content", "Partner-Akquise", "Automatisierung"],
      milestones: [
        "15+ Offerten / Monat",
        "8+ abgeschlossene Jobs",
        "Messbare CPA/CAC-Korridore",
        "Erste wiederkehrende Umsätze",
      ],
    },
    {
      tags: ["Expansion", "Vollautomatisierung", "Team-Vorbereitung"],
      milestones: [
        "CHF 15k Umsatz / Monat",
        "Deckungsbeitrag ≥ Fixkosten",
        "Organisches Wachstum messbar",
        "Seed-Ready Zustand",
      ],
    },
  ],
  bg: [
    {
      tags: ["ООД регистрация", "ERP v2", "Технически сетъп", "Stripe"],
      milestones: ["ООД основано", "Плащания live", "Tracking & CRM", "Първи партньори"],
    },
    {
      tags: ["Google Ads", "SEO/Съдържание", "Партньори", "Автоматизация"],
      milestones: ["15+ оферти/месец", "8+ завършени поръчки", "Измерими CPA", "Първи приходи"],
    },
    {
      tags: ["Експанзия", "Пълна автоматизация", "Екип"],
      milestones: ["CHF 15k приход/месец", "Break-even", "Органичен растеж", "Seed-Ready"],
    },
  ],
  it: [
    {
      tags: ["Fondazione GmbH", "ERP v2", "Setup tecnico", "Stripe"],
      milestones: ["GmbH fondata", "Pagamenti live", "Tracking & CRM", "Primi partner"],
    },
    {
      tags: ["Google Ads", "SEO/Contenuti", "Partner", "Automazione"],
      milestones: ["15+ preventivi/mese", "8+ lavori completati", "CPA misurabili", "Primi ricavi"],
    },
    {
      tags: ["Espansione", "Automazione completa", "Team"],
      milestones: ["CHF 15k ricavi/mese", "Break-even", "Crescita organica", "Seed-Ready"],
    },
  ],
};

// ── Colors per tranche ────────────────────────────────
const trancheStyles = [
  { bg: "bg-primary/10", border: "border-primary/30", dot: "bg-primary", icon: Rocket, statusColor: "text-primary" },
  { bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-500", icon: TrendingUp, statusColor: "text-amber-600" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", dot: "bg-emerald-500", icon: Target, statusColor: "text-emerald-600" },
];

// ── Component ─────────────────────────────────────────
interface Props {
  language: VisionLanguage;
}

export function FundingRoadmapSection({ language }: Props) {
  const l = t[language];
  const details = trancheDetails[language];

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
            {l.badge}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            {l.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            {l.subtitle}
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
            { label: l.kpi1, value: `CHF ${fmt(FUNDING.total)}`, icon: BarChart3 },
            { label: l.kpi2, value: `CHF ${fmt(FUNDING.maxRisk)}`, icon: Shield },
            { label: l.kpi3, value: `${FUNDING.horizonMonths} ${l.months}`, icon: Zap },
          ].map((kpi, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <kpi.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Tranchen Timeline ──────────────── */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 md:left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-8">
            {FUNDING.tranches.map((tranche, i) => {
              const style = trancheStyles[i];
              const detail = details[i];
              const isActive = i === 0;
              const Icon = style.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  {/* Timeline dot (desktop) */}
                  <div className={`absolute left-3.5 md:left-4 top-6 w-4 h-4 rounded-full ${style.dot} border-2 border-background z-10 hidden md:block`} />

                  <div className={`md:ml-14 rounded-xl border ${style.border} ${style.bg} p-4 sm:p-5 md:p-6 ${!isActive ? 'opacity-80' : ''}`}>
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${style.bg} shrink-0`}>
                          <Icon className={`w-5 h-5 ${style.statusColor}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-foreground text-base sm:text-lg">
                              {l.tranche} {i + 1} — {tranche.label}
                            </span>
                            {!isActive && <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {language === 'de' ? 'Monat' : language === 'bg' ? 'Месец' : 'Mese'} {tranche.months}
                          </div>
                        </div>
                      </div>
                      <div className="sm:ml-auto pl-11 sm:pl-0">
                        <span className="text-lg sm:text-xl font-bold text-foreground">
                          CHF {fmt(tranche.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {detail.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center gap-2 mb-3">
                      {isActive ? (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {l.active}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          <Lock className="w-3 h-3 mr-1" />
                          {l.locked}
                        </Badge>
                      )}
                    </div>

                    {/* Milestones */}
                    <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        {l.unlockTitle}
                      </div>
                      <ul className="space-y-1.5">
                        {detail.milestones.map((m, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                            <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
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
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">{l.riskTitle}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{l.riskBody}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-foreground">{l.skinTitle}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{l.skinBody}</p>
          </div>
        </motion.div>

        {/* ── Finanzierungslogik ──────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">{l.marginTitle}</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">{l.marginSub}</p>
          <div className="flex items-center justify-center gap-3 mt-4 text-lg font-semibold text-foreground">
            <span>CHF {fmt(FUNDING.marginPerJob)}</span>
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="text-primary">CHF {fmt(FUNDING.reinvestPerJob)} Reinvest</span>
          </div>
        </motion.div>

        {/* ── CTA ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-2">{l.ctaTitle}</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">{l.ctaSub}</p>
          <a
            href="mailto:invest@umzugscheck.ch?subject=Investor%20Interesse%20Pre-Seed"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            <Users className="w-4 h-4" />
            {l.ctaBtn}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
