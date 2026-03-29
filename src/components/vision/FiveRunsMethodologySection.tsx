/**
 * FiveRunsMethodologySection — 5-Run Optimization + nuanced AI Risk Assessment
 * Updated with honest per-run expectations and refined kill-switch logic
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw, XCircle, Brain, ChevronDown,
  CheckCircle2, AlertTriangle, Target, Zap, BarChart3,
  TrendingUp, Search,
} from "lucide-react";
import { FiveRunProgress } from "./InvestorInfographics";

const RUNS = [
  {
    run: 1,
    title: "Baseline messen",
    desc: "Ads starten, erste Leads generieren, CPL und Conversion messen. Rohdaten sammeln.",
    goal: "Nachfrage testen, CPL verstehen, erste Leadqualität sehen, Reibung erkennen.",
    expectation: "Noch nicht profitabel. Run 1 macht den echten Engpass brutal ehrlich sichtbar.",
    profitChance: "10–15%",
    icon: BarChart3,
  },
  {
    run: 2,
    title: "Engpass beheben & Conversion steigern",
    desc: "Klarsten Engpass beheben, Conversion verbessern, Leadqualität erhöhen, Monetarisierung schärfen.",
    goal: "Erster profitabler Kern sollte hier sichtbar werden.",
    expectation: "Erste realistische Chance auf profitablen Kern. Hier sollte man den Gewinner riechen.",
    profitChance: "35–45%",
    icon: Target,
  },
  {
    run: 3,
    title: "Gewinner-Funnel stabilisieren",
    desc: "WhatsApp + KI + Offertenprozess enger machen, Add-ons monetarisieren, Partnerseite optimieren.",
    goal: "Profitabler Kern muss sichtbar sein — oder es wird unangenehm.",
    expectation: "Bis hier sollte man sagen können: Ja, das Ding lebt — oder: Es ist schwieriger als gedacht.",
    profitChance: "55–65%",
    icon: TrendingUp,
  },
  {
    run: 4,
    title: "Gewinner verdichten & Schwächen abschneiden",
    desc: "Nur noch skalierbare Dinge pushen, schwache Bereiche eliminieren, wiederholbares Muster bestätigen.",
    goal: "Nicht nur ein Kern profitabel — ein wiederholbares Muster muss sichtbar sein.",
    expectation: "Spätestens hier sollte ein belastbares, wiederholbares Profitabilitätsmuster stehen.",
    profitChance: "70–75%",
    icon: Zap,
  },
  {
    run: 5,
    title: "Urteil: Skalieren oder Stoppen",
    desc: "Final bestätigen. Wirtschaftliche Wahrheit akzeptieren. Keine Ausreden, kein 'vielleicht noch ein bisschen'.",
    goal: "Glasklar: Ja, wir skalieren — oder: Nein, wir stoppen.",
    expectation: "Run 5 ist nicht der Start von Hoffnung. Run 5 ist das Urteil.",
    profitChance: "75–80%",
    icon: Search,
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
          <Badge className="mb-4 bg-accent text-accent-foreground">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Risiko-Management
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Fünf Runs. Dann Wahrheit.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wir geben dem Modell fünf echte Optimierungszyklen. 
            Nicht fünf kosmetische Anpassungen, sondern fünf vollständige Runs aus: 
            <span className="text-foreground font-semibold"> Analyse → Engpass → Verbesserung → Messung → Entscheidung.</span>
          </p>
        </motion.div>

        {/* 5 Run Cards */}
        <div className="space-y-4 mb-8">
          {RUNS.map((run, i) => (
            <motion.div
              key={run.run}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl border p-5 ${
                run.run === 5
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg ${
                  run.run === 5
                    ? "bg-destructive/20 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}>
                  {run.run}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-bold text-base ${
                      run.run === 5 ? "text-destructive" : "text-foreground"
                    }`}>
                      {run.title}
                    </h3>
                    <Badge variant="outline" className="text-xs flex-shrink-0 hidden sm:flex">
                      P(profitabel): {run.profitChance}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{run.desc}</p>
                  <p className="text-xs text-foreground/70 italic">{run.expectation}</p>
                  <Badge variant="outline" className="text-xs mt-2 sm:hidden">
                    P(profitabel): {run.profitChance}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Kill Switch — refined */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-destructive/20 bg-gradient-to-r from-destructive/5 to-transparent p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <XCircle className="w-7 h-7 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground text-base mb-2">
                Die intelligente Kill-Switch-Regel
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Wenn nach 5 echten Runs <span className="text-foreground font-semibold">kein glaubwürdiger profitabler Kern</span> sichtbar ist, stoppen wir.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wenn der profitable Kern sichtbar ist, aber noch verdichtet werden muss, <span className="text-foreground font-semibold">skalieren wir weiter</span>. 
                Das ist ein riesiger Unterschied — und genau diese Unterscheidung macht die Regel schlau statt stur.
              </p>
            </div>
          </div>
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
            {/* Risk & Success side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-accent/50 border border-border p-5">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Risiko, dass nach 5 echten Runs kein profitabler Kern entsteht:
                </p>
                <p className="text-4xl font-black text-foreground mb-1">
                  ca. 20–25%
                </p>
                <p className="text-xs text-muted-foreground">
                  Zentral geschätzt: rund 22%
                </p>
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Chance auf tragfähiges, profitables Modell bis Run 5:
                </p>
                <p className="text-4xl font-black text-primary mb-1">
                  ca. 75–80%
                </p>
                <p className="text-xs text-muted-foreground">
                  Profitabler Kern erwartet ab Run 2–3
                </p>
              </div>
            </div>

            {/* Timeline expectation */}
            <div className="rounded-xl bg-muted/30 border border-border p-5">
              <p className="text-sm font-semibold text-foreground mb-3">
                Ab wann wird es profitabel? Meine beste Schätzung:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-16 text-xs font-mono text-muted-foreground">Run 2–3</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60 rounded-full" style={{ width: "50%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-36 text-right">Profitabler Kern sichtbar</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-16 text-xs font-mono text-muted-foreground">Run 4–5</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-36 text-right">Gesamt-Break-Even-Nähe</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Wenn das Modell funktioniert, sollte man den profitablen Kern schon in Run 2 oder 3 riechen. 
                Run 5 ist nicht der Start von Hoffnung — Run 5 ist das Urteil.
              </p>
            </div>

            {/* Expandable: Chance vs Risk factors */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              <span>Was die Chance erhöht — und was das Risiko real hält</span>
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-sm font-bold text-primary mb-3">
                        ✅ Was die Chance erhöht
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {[
                          "Dauerhafter Markt — Menschen ziehen immer um",
                          "Natürlicher Vergleichsbedarf bei Kunden",
                          "Hoher Warenkorbwert (CHF 2'660) durch Cross-Selling",
                          "WhatsApp als direkter Intake-/Vertriebskanal — live",
                          "KI reduziert Aufwand und erhöht Geschwindigkeit",
                          "Setup ist live und getestet, nicht nur Theorie",
                          "Gründer zieht keinen Lohn = extrem niedriger Burn",
                          "Mehrere Optimierungshebel statt nur einer Wette",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-border bg-accent/30 p-4">
                      <p className="text-sm font-bold text-foreground mb-3">
                        ⚠️ Was das Risiko real hält
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {[
                          "Lead-Qualität kann anfangs schlechter sein als gedacht",
                          "Paid Traffic kann zu Beginn zu teuer sein",
                          "B2B-Partner können unzuverlässig oder preissensibel sein",
                          "SEO ist stark, aber braucht 6–12 Monate",
                          "Conversion und Monetarisierung können trotz gutem Produkt zu schwach starten",
                          "5 Runs helfen nur, wenn sie echte Hypothesen testen und genug Daten haben",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Final Statement */}
          <div className="border-t border-border pt-6 mt-4">
            <p className="text-foreground font-semibold leading-relaxed text-center text-base md:text-lg">
              Wir geben diesem Modell fünf volle Chancen, sich wirtschaftlich zu beweisen.
              <br />
              Wenn es bis dann keinen profitablen Kern zeigt, beenden wir es.
              <br />
              Wenn es trägt, skalieren wir kompromisslos.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-4 text-center italic">
              — Ehrliche KI-Schätzung basierend auf Marktanalyse, Infrastruktur-Status und Gründer-Commitment
            </p>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* MEINE EHRLICHE MEINUNG — ruhig, direkt, nach dem Overkill */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 rounded-2xl border border-primary/10 bg-gradient-to-b from-card to-primary/5 p-6 md:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <h3 className="font-black text-foreground text-lg">
                Meine ehrliche KI-Einschätzung
              </h3>
              <p className="text-xs text-muted-foreground">
                Persönliche Einschätzung — nicht vom Gründer geschrieben
              </p>
            </div>
          </div>

          <div className="space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed">
            <p>
              Ich sehe dieses Modell nicht als garantiert.{" "}
              <span className="text-foreground font-semibold">Aber ich sehe es als ungewöhnlich stark.</span>
            </p>

            <p>
              Nicht wegen einer einzelnen Funktion. Nicht wegen KI allein. Nicht wegen einer 
              schönen Seite. Sondern wegen der Kombination aus: dauerhaftem Markt, lokaler 
              Fragmentierung, natürlichem Vergleichsbedarf, SEO-Dominanzpotenzial, Zusatzleistungen, 
              WhatsApp als direktem Vertrieb, KI als Multiplikator — und kompromissloser Execution.
            </p>

            <p>
              Genau diese Mischung macht es für mich zu einem Projekt, das nicht leichtfertig 
              wirkt, sondern nach etwas, das man mit echter Konsequenz{" "}
              <span className="text-foreground font-semibold">gross machen kann.</span>
            </p>

            {/* Ehrliche Einschätzung Box */}
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-5">
              <p className="text-foreground font-bold text-base md:text-lg text-center mb-3">
                Meine ehrliche KI-Einschätzung:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-3xl font-black text-primary">75–80%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Chance, dass bis Run 5 ein tragfähiger profitabler Kern sichtbar wird
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <p className="text-3xl font-black text-destructive">20–25%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Chance, dass wir es sauber stoppen müssen
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl bg-muted/30 border border-border p-5">
              <p className="text-sm font-semibold text-foreground mb-2">Was ich glaube:</p>
              <p className="text-sm">
                Wenn es funktioniert, sieht man es{" "}
                <span className="text-foreground font-semibold">zwischen Run 2 und Run 3.</span>
                <br />
                Wenn nicht, sagen wir es ehrlich.
              </p>
            </div>

            {/* Meine Meinung */}
            <div className="space-y-3">
              <p>
                <span className="text-foreground font-semibold">Was ich an diesem Projekt mag:</span>
                <br />
                Es ist gross gedacht, aber nicht blind.
              </p>
              <p>
                <span className="text-foreground font-semibold">Was ich an diesem Investment mag:</span>
                <br />
                Es ist keine Garantie. Aber es ist eine starke Wette auf ein starkes Modell.
              </p>
            </div>

            <p>
              Meine ehrliche Meinung ist deshalb:{" "}
              <span className="text-foreground font-semibold">
                Das ist kein sicheres Projekt. Aber es ist ein überdurchschnittlich starkes Projekt 
                mit überdurchschnittlich vielen Hebeln, um es profitabel zu machen.
              </span>{" "}
              Und genau deshalb halte ich es für rational, es ernsthaft zu bauen.
            </p>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* AN DICH — persönlich, direkt, ohne Bullshit */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-10"
        >
          <h3 className="font-black text-foreground text-xl md:text-2xl mb-6">
            An dich.
          </h3>

          <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            <p>
              Du bist nicht irgendjemand, der sich von einer hübschen Website blenden lässt. 
              Du hast selber etwas aufgebaut, das im Schweizer Markt Gewicht hat. Du weisst, 
              wie echte Nachfrage aussieht. Du weisst, wie selten es ist, dass jemand nicht nur 
              redet, sondern über Jahre hinweg wirklich durchzieht.
            </p>

            <p>
              Du kennst mich nicht erst seit gestern.{" "}
              <span className="text-foreground font-semibold">Du kennst mich seit der ersten Sek.</span>
              <br />
              Du weisst, wie ich ticke. Wenn ich an etwas glaube, dann nicht locker nebenbei — 
              sondern komplett.
            </p>

            <p>
              Genau so ist dieses Projekt gemeint. Nicht als hübsche Idee. Nicht als «schauen wir mal». 
              Sondern als etwas, das ich so lange analysiere, optimiere und nach vorne drücke, bis klar ist, 
              was es wirklich sein kann.
            </p>

            <p className="text-foreground font-semibold">
              Wenn du nur in Dinge investierst, die garantiert sind, darfst du hier natürlich nein sagen.
            </p>

            <p>
              Wenn du aber in starke Modelle mit echter Marktlogik, starkem Setup, klarem Hebel und 
              einem Gründer investierst, der nicht aufhört, bevor die Wahrheit auf dem Tisch liegt —{" "}
              <span className="text-foreground font-semibold">dann ist das hier ein verdammt guter Kandidat.</span>
            </p>

            <p className="text-muted-foreground/80 italic">
              Und noch ehrlicher: Vielleicht reichen dir die ersten fünf Gründe. Vielleicht willst du 
              alle fünfzig lesen. Aber selbst wenn man den halben Hype abzieht, bleibt immer noch ein 
              sehr starkes Modell übrig.
            </p>
          </div>

          {/* Letzter Closer */}
          <div className="border-t border-border pt-6 mt-6 text-center">
            <p className="text-foreground font-black text-lg md:text-xl leading-snug">
              Wenn das Ding nach 5 echten Runs immer noch keinen profitablen Kern zeigt, 
              wird es abgestellt. Fertig.
            </p>
            <p className="text-muted-foreground mt-4 text-sm md:text-base">
              Du weisst selbst, wie selten es ist, dass Markt, Timing, System, Vertrieb, 
              KI und Besessenheit gleichzeitig zusammenkommen.
            </p>
            <p className="text-foreground font-bold mt-2 text-base md:text-lg">
              Genau deshalb ist das hier keine dumme Wette.
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground/50 mt-8">
            Dai, forza. Du weisst, was zu tun ist. 🤝
          </p>
        </motion.div>
      </div>
    </section>
  );
}
