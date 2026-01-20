/**
 * Family Summary Component
 * Eine verständliche Zusammenfassung für Eltern/Familie
 * Erklärt das Projekt und sein Potenzial auf einfache Weise
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, Heart, TrendingUp, Users, Shield, Sparkles,
  Building2, Globe, Award, Target, Zap, CheckCircle2,
  ArrowRight, Star, Crown, Lightbulb, MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Die 10 Kunden-Vorteile zusammengefasst
const customerBenefitsSummary = [
  { emoji: "📹", title: "Video-Analyse", short: "Handy-Video → exakte Offerte" },
  { emoji: "🔐", title: "Treuhand-Schutz", short: "Geld sicher bis Umzug fertig" },
  { emoji: "🤖", title: "Papierkram-Autopilot", short: "Ummeldung mit einem Klick" },
  { emoji: "✨", title: "Reinigungsgarantie", short: "Profis mit Nachbesserungs-Garantie" },
  { emoji: "♻️", title: "Entrümpelungs-Service", short: "Weniger mitnehmen = billiger" },
  { emoji: "⚖️", title: "Preisvergleich", short: "5 geprüfte Firmen vergleichen" },
  { emoji: "🗺️", title: "Neighborhood Guide", short: "Alle Infos zur neuen Gegend" },
  { emoji: "🛡️", title: "Smart Versicherung", short: "Video-Beweis bei Schäden" },
  { emoji: "🎧", title: "24/7 Support", short: "Sofort-Hilfe via WhatsApp" },
  { emoji: "🔧", title: "Handwerker-Service", short: "Montage alles inklusive" },
];

// Die 10 Business-Säulen zusammengefasst
const businessPillarsSummary = [
  { emoji: "🧠", title: "KI-Vision", revenue: "20 CHF/Scan", moat: "Daten-Monopol" },
  { emoji: "💰", title: "Fintech/Escrow", revenue: "30 CHF/Transaktion", moat: "Geldfluss-Kontrolle" },
  { emoji: "📊", title: "Dynamic Pricing", revenue: "15-25% Take-Rate", moat: "Preismacht" },
  { emoji: "🏢", title: "B2B Enterprise", revenue: "500 CHF/Monat", moat: "LTV >50'000 CHF" },
  { emoji: "📋", title: "Bürokratie-API", revenue: "49 CHF + Affiliate", moat: "Behörden-Lock-in" },
  { emoji: "⚙️", title: "Partner OS", revenue: "99 CHF MRR", moat: "Vendor Lock-in" },
  { emoji: "🛡️", title: "Micro-Insurance", revenue: "50-99 CHF/Police", moat: "60% Marge" },
  { emoji: "♻️", title: "Circular Economy", revenue: "50-200 CHF", moat: "Doppel-Revenue" },
  { emoji: "📈", title: "Daten-Monetarisierung", revenue: "50-150 CHF/Lead", moat: "First-Mover" },
  { emoji: "🚀", title: "Lean Operations", revenue: "553 CHF/Kunde", moat: "{'>'}40% EBITDA" },
];

// Meilensteine & Vision
const milestones = [
  { phase: "Heute", status: "active", title: "Plattform-Aufbau", description: "Technologie entwickeln, erste Kunden gewinnen" },
  { phase: "6 Monate", status: "next", title: "Marktführer Schweiz", description: "1'000+ Umzüge/Monat, Profitabilität" },
  { phase: "2 Jahre", status: "future", title: "Expansion DACH", description: "Deutschland & Österreich, 10x Wachstum" },
  { phase: "5 Jahre", status: "future", title: "Europäischer Leader", description: "IPO-Ready, 100+ Mio Umsatz" },
];

export const FamilySummary = memo(() => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <Heart className="w-4 h-4" />
            Für die Familie erklärt
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            Was ich <span className="text-primary">baue</span> 🚀
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Eine einfache Zusammenfassung für Mama, Papa und alle, die verstehen wollen, 
            <br className="hidden md:block" />
            <span className="font-semibold text-foreground">woran ich arbeite und warum es einzigartig ist.</span>
          </p>
        </motion.div>

        {/* === TEIL 1: Das Problem === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-3xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">😫</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-red-700 dark:text-red-400 mb-2">Das Problem heute</h3>
                <p className="text-red-600 dark:text-red-300 text-lg">
                  Umziehen in der Schweiz ist <strong>Stress pur</strong>
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Keine Ahnung, welche Firma seriös ist",
                "Preise variieren wild (1'000 – 5'000 CHF)",
                "Stundenlange Telefonate, keine Antwort",
                "Papierkram: Gemeinde, Strom, Internet...",
                "Angst vor Betrug und versteckten Kosten",
                "Nach dem Umzug: fremd in neuer Gegend"
              ].map((pain, idx) => (
                <div key={idx} className="flex items-center gap-3 text-red-700 dark:text-red-300">
                  <span className="text-xl">❌</span>
                  <span className="text-sm font-medium">{pain}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* === TEIL 2: Meine Lösung === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-3xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">✨</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mb-2">Meine Lösung: Umzugscheck.ch</h3>
                <p className="text-green-600 dark:text-green-300 text-lg">
                  Die <strong>intelligenteste Umzugs-Plattform</strong> der Schweiz
                </p>
              </div>
            </div>
            
            <p className="text-foreground text-lg leading-relaxed mb-6">
              Ich baue eine Plattform, die den gesamten Umzugsprozess digitalisiert und automatisiert. 
              Mit <strong>Künstlicher Intelligenz</strong> analysieren wir Videos, berechnen Preise, 
              organisieren alles – vom ersten Klick bis zum Schlüsselabgabe.
            </p>

            <div className="bg-white dark:bg-black/30 rounded-2xl p-6 border border-green-300 dark:border-green-700">
              <p className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Einfach erklärt
              </p>
              <p className="text-foreground text-lg font-medium">
                Stell dir vor: Du filmst deine Wohnung mit dem Handy → 
                Die KI erkennt alle Möbel → Du bekommst 5 faire Preise → 
                Ein Klick und <strong>alles wird organisiert</strong>: 
                Umzugsfirma, Reinigung, Ummeldung, sogar Tipps für deine neue Nachbarschaft! 🏠
              </p>
            </div>
          </div>
        </motion.div>

        {/* === TEIL 3: Die 10 Kunden-Vorteile (Kurzversion) === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              10 Vorteile für Familien
            </h3>
            <p className="text-muted-foreground">Was Kunden bei uns bekommen – alles aus einer Hand</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {customerBenefitsSummary.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-800/50 border border-border rounded-2xl p-4 text-center hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              >
                <span className="text-3xl mb-2 block">{benefit.emoji}</span>
                <p className="text-sm font-bold text-foreground mb-1">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">{benefit.short}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* === TEIL 4: Das Geschäftsmodell (Für Eltern verständlich) === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-2 border-primary/30 rounded-3xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground mb-2">Wie wir Geld verdienen 💰</h3>
                <p className="text-muted-foreground text-lg">
                  Nicht nur eine Einnahmequelle – sondern <strong>zehn verschiedene!</strong>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-black/40 rounded-2xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Pro Kunde verdienen wir:</p>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-black text-primary">553 CHF</span>
                    <span className="text-muted-foreground text-sm pb-2">durchschnittlich</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Unsere Kosten pro Kunde:</p>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-black text-red-500">50 CHF</span>
                    <span className="text-muted-foreground text-sm pb-2">fast alles automatisiert</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-2">= Gewinn pro Kunde</p>
                <span className="text-4xl font-black text-green-600 dark:text-green-400">503 CHF</span>
                <span className="ml-3 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-bold">
                  >90% Marge!
                </span>
              </div>
            </div>

            <p className="text-foreground text-base leading-relaxed">
              <strong>Warum ist das besonders?</strong> Normale Firmen haben 10-30% Marge. 
              Wir haben über 90%, weil fast alles von <strong>Künstlicher Intelligenz</strong> erledigt wird. 
              Wir brauchen nur 3-5 Mitarbeiter für Tausende von Kunden.
            </p>
          </div>
        </motion.div>

        {/* === TEIL 5: Warum es das noch nicht gibt === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-3xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-amber-700 dark:text-amber-400 mb-2">Warum gibt es das noch nicht?</h3>
                <p className="text-amber-600 dark:text-amber-300 text-lg">
                  Was uns von allen anderen unterscheidet
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "KI-Video-Technologie",
                  desc: "Wir haben eigene KI entwickelt, die Möbel in Videos erkennt. Das kann sonst niemand.",
                  icon: "🧠"
                },
                {
                  title: "Treuhand-System (Fintech)",
                  desc: "Wir kontrollieren den Geldfluss – wie eine Bank für Umzüge. Das schafft Vertrauen.",
                  icon: "🏦"
                },
                {
                  title: "Behörden-Schnittstellen",
                  desc: "Wir haben direkte Verbindungen zu Gemeinden und Versorgern aufgebaut. Extrem schwer zu kopieren.",
                  icon: "🔌"
                },
                {
                  title: "95% Automatisierung",
                  desc: "Während andere 50 Mitarbeiter brauchen, machen wir das mit 3 Leuten + KI.",
                  icon: "🤖"
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white dark:bg-black/30 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* === TEIL 6: Die Zukunft / Vision === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 flex items-center justify-center gap-3">
              <Rocket className="w-8 h-8 text-primary" />
              Was passiert, wenn wir weitermachen?
            </h3>
            <p className="text-muted-foreground">Der Weg zum Marktführer</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-blue-500 to-violet-500 rounded-full hidden md:block" />
            
            <div className="space-y-6">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.phase}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative flex items-start gap-6 ${
                    milestone.status === 'active' 
                      ? 'bg-primary/10 border-primary/50' 
                      : 'bg-muted/30 border-border'
                  } border-2 rounded-2xl p-6 md:ml-12`}
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-[3.25rem] w-6 h-6 rounded-full border-4 border-background hidden md:flex items-center justify-center ${
                    milestone.status === 'active' 
                      ? 'bg-primary' 
                      : milestone.status === 'next'
                        ? 'bg-blue-500'
                        : 'bg-muted'
                  }`}>
                    {milestone.status === 'active' && (
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </div>

                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    milestone.status === 'active' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <span className="text-sm font-bold text-center leading-tight">{milestone.phase}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold mb-1 ${
                      milestone.status === 'active' ? 'text-primary' : 'text-foreground'
                    }`}>
                      {milestone.title}
                    </h4>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>

                  {milestone.status === 'active' && (
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      Aktuell
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* === TEIL 7: Die Zahlen === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-black mb-3">Die Zahlen sprechen für sich 📊</h3>
              <p className="text-slate-400">Was wir erreichen können</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "200'000", label: "Umzüge/Jahr in der Schweiz", sublabel: "Marktgrösse" },
                { value: "3 Mrd", label: "CHF Marktvolumen", sublabel: "Potenzial" },
                { value: "10'000", label: "Umzüge/Jahr Ziel", sublabel: "5% Marktanteil" },
                { value: "5.5 Mio", label: "CHF Umsatz möglich", sublabel: "bei 10k Kunden" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-black text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-white font-medium">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.sublabel}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-700 text-center">
              <p className="text-slate-400 mb-4">Bei voller Umsetzung aller 10 Säulen:</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-bold">
                  {'>'}40% EBITDA-Marge
                </span>
                <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 font-bold">
                  95% KI-Automatisierung
                </span>
                <span className="px-4 py-2 rounded-full bg-violet-500/20 text-violet-400 font-bold">
                  IPO-Ready in 5 Jahren
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* === TEIL 8: Schlusswort === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-primary/20 via-blue-500/20 to-violet-500/20 border-2 border-primary/30 rounded-3xl p-10">
            <span className="text-6xl mb-6 block">🎯</span>
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4">
              Zusammengefasst
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Ich baue die <strong className="text-foreground">erste wirklich intelligente Umzugs-Plattform</strong> der Schweiz. 
              Mit KI-Technologie, die es so noch nicht gibt. Mit einem Geschäftsmodell, das 
              <strong className="text-foreground"> 10 verschiedene Einnahmequellen</strong> kombiniert. 
              Und mit einer Vision, die über die Schweiz hinausgeht.
            </p>
            
            <div className="flex items-center justify-center gap-3 text-lg font-bold text-primary">
              <CheckCircle2 className="w-6 h-6" />
              <span>Das ist kein kleines Projekt – das ist ein richtiges Startup.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

FamilySummary.displayName = 'FamilySummary';

export default FamilySummary;
