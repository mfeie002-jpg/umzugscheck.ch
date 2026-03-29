/**
 * FiveRunsMethodologySection — 5-Run Optimization Kill Switch + AI Risk Assessment
 * The final intellectual "mic drop" on the /investor page
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw, TrendingUp, XCircle, Brain, ChevronDown,
  CheckCircle2, AlertTriangle, Target, Zap, BarChart3,
} from "lucide-react";

const RUNS = [
  {
    run: 1,
    title: "Baseline messen",
    desc: "Ads starten, erste Leads generieren, CPL und Conversion messen. Rohdaten sammeln.",
    metric: "CPL, Conversion Rate, Lead-Qualität",
    action: "Daten sammeln, nichts optimieren — nur messen.",
    icon: BarChart3,
  },
  {
    run: 2,
    title: "Funnel optimieren",
    desc: "Landingpages, CTAs, Formulare und Ansprache basierend auf Run-1-Daten verbessern.",
    metric: "CPL-Reduktion, Conversion-Steigerung",
    action: "A/B-Tests, Copy-Optimierung, UX-Fixes.",
    icon: Target,
  },
  {
    run: 3,
    title: "Kanal-Mix kalibrieren",
    desc: "Budget-Allokation zwischen Google Ads, SEO, WhatsApp und Direktmarketing optimieren.",
    metric: "ROAS pro Kanal, Kanal-Attribution",
    action: "Budget auf performante Kanäle shiften.",
    icon: TrendingUp,
  },
  {
    run: 4,
    title: "Unit Economics validieren",
    desc: "Kundenwert (AOV), Marge pro Auftrag und Wiederkaufsrate endgültig validieren.",
    metric: "AOV > CHF 2'000, Marge > 30%",
    action: "Pricing anpassen, Cross-Selling aktivieren.",
    icon: Zap,
  },
  {
    run: 5,
    title: "Profitabilität oder Kill Switch",
    desc: "Wenn nach 5 Optimierungszyklen kein profitables Modell steht: Projekt wird sauber beendet.",
    metric: "Break-even erreichbar: Ja oder Nein",
    action: "Scale oder Kill. Kein 6. Versuch.",
    icon: AlertTriangle,
  },
];

export function FiveRunsMethodologySection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-amber-500/10 text-amber-600">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Risiko-Management
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            5 Runs. 5 Optimierungen. Dann Klarheit.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wir optimieren nicht endlos. Wir geben dem System exakt 5 Zyklen, 
            um sich zu beweisen. Jeder Run analysiert, verbessert und misst. 
            Wenn nach dem 5. Run kein profitables Modell steht — beenden wir alles. Sauber.
          </p>
        </motion.div>

        {/* 5 Run Cards */}
        <div className="space-y-4 mb-12">
          {RUNS.map((run, i) => (
            <motion.div
              key={run.run}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl border p-5 flex gap-4 items-start ${
                run.run === 5
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-border bg-card"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg ${
                run.run === 5
                  ? "bg-red-500/20 text-red-500"
                  : "bg-primary/10 text-primary"
              }`}>
                {run.run}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-base mb-1 ${
                  run.run === 5 ? "text-red-500" : "text-foreground"
                }`}>
                  {run.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{run.desc}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                    📊 {run.metric}
                  </span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                    ⚡ {run.action}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Kill Switch Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-red-500/20 bg-gradient-to-r from-red-500/5 to-transparent p-6 mb-12 text-center"
        >
          <XCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="font-bold text-foreground text-lg mb-2">
            Der Kill Switch ist real.
          </p>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Wenn nach 5 kompletten Optimierungszyklen kein profitables Modell steht, 
            wird das Projekt sauber abgewickelt. Kein ewiges Hoffen, kein Geld verbrennen. 
            Das ist keine leere Drohung — das ist Professionalität.
          </p>
        </motion.div>

        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-8"
        >
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            Wir sind von diesem Modell überzeugt. Aber nicht auf naive Art.{" "}
            <span className="text-foreground font-semibold">Darum bekommt es fünf echte Optimierungszyklen.</span>{" "}
            Fünfmal analysieren. Fünfmal verbessern. Fünfmal neu messen. Nicht oberflächlich, sondern systematisch.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-3">
            Wenn nach dem 5. Run trotz besserem Funnel, besserem Angebot, besserer KI-Automatisierung, 
            besserer Lead-Monetarisierung und besserem Nachfrageeingang immer noch kein profitabler 
            Kern sichtbar ist, wird das Projekt beendet.
          </p>
        </motion.div>

        {/* AI Risk Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-black text-foreground text-xl">
                Ehrliche KI-Einschätzung
              </h3>
              <p className="text-sm text-muted-foreground">
                Keine Schönfärberei. Die nüchterne Analyse.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {/* Risk Number */}
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-5">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                Risiko, dass es auch nach 5 echten Runs keinen profitablen Kern gibt:
              </p>
              <p className="text-4xl md:text-5xl font-black text-amber-600 dark:text-amber-400 mb-1">
                ca. 25–35%
              </p>
              <p className="text-xs text-muted-foreground">
                Zentral geschätzt: rund 30%
              </p>
            </div>

            {/* Success Number */}
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                Chance, dass bis spätestens Run 5 ein tragfähiges, profitables Modell entsteht:
              </p>
              <p className="text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                ca. 70%
              </p>
              <p className="text-xs text-muted-foreground">
                Nicht 100%. Nicht garantiert. Aber stark genug, dass ein konsequent geführter Versuch absolut rational ist.
              </p>
            </div>

            {/* What increases the chance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                  ✅ Was die Chance erhöht
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Dauerhafter Markt — Menschen ziehen immer um",
                    "Natürlicher Vergleichsbedarf bei Kunden",
                    "Hoher Warenkorbwert durch modulare Zusatzleistungen",
                    "WhatsApp als direkter Intake-/Vertriebskanal",
                    "KI reduziert Aufwand und erhöht Geschwindigkeit",
                    "Setup ist live, nicht nur Theorie",
                    "Gründer ist extrem committed, kein Lohn = niedriger Burn",
                    "Mehrere Optimierungshebel statt nur einer Wette",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3">
                  ⚠️ Was das Risiko real hält
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "SEO kann länger dauern als erhofft",
                    "Leadqualität kann schlechter sein als gedacht",
                    "B2B-Partner können unzuverlässig oder preissensibel sein",
                    "Paid Traffic kann anfangs zu teuer sein",
                    "Conversion und Monetarisierung können zu schwach sein",
                    "5 Runs helfen nur, wenn sie echte Hypothesen testen",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Final Statement */}
          <div className="border-t border-border pt-6 mt-6">
            <p className="text-foreground font-semibold leading-relaxed text-center text-base md:text-lg">
              Wir geben diesem Modell fünf volle Chancen, sich wirtschaftlich zu beweisen.
              <br />
              Wenn es bis dann nicht trägt, beenden wir es.
              <br />
              Wenn es trägt, skalieren wir kompromisslos.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-4 text-center italic">
              — Ehrliche KI-Schätzung basierend auf Marktanalyse, Wettbewerbsdaten und Projektinfrastruktur
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
