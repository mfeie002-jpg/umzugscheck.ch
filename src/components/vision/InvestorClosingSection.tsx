/**
 * InvestorClosingSection — Founder Conviction + Closing
 */
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Rocket, Shield, Heart, CheckCircle2 } from "lucide-react";
import { InvestmentGauge, RiskRewardScale } from "./InvestorInfographics2";

export function InvestorClosingSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Investment Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">Investment</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Was die erste Runde finanziert
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Die erste Runde soll nicht ein unfertiges Experiment retten, sondern ein bereits logisch starkes Modell beschleunigen.
          </p>
        </motion.div>

        {/* Investment Gauge Infographic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-6 mb-10"
        >
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 text-center">Kapitalallokation auf einen Blick</h4>
          <InvestmentGauge />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Round 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-black text-foreground text-lg">Runde 1: Proof + Beschleunigung</h3>
                <p className="text-primary font-semibold text-sm">~CHF 25'000</p>
              </div>
            </div>
            <ul className="space-y-2">
              {[
                "Lokale Abdeckung ausbauen",
                "SEO-Infrastruktur verdichten",
                "Funnel weiter optimieren",
                "WhatsApp/OpenClaw/KI-Prozesse schärfen",
                "Nachfrage und Abschlusslogik beschleunigen",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Round 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-black text-foreground text-lg">Runde 2: erst nach echtem Proof</h3>
                <p className="text-muted-foreground font-semibold text-sm">Nur wenn Runde 1 liefert</p>
              </div>
            </div>
            <ul className="space-y-2">
              {[
                "Erst wenn Runde 1 messbar geliefert hat",
                "Mehr Regionen und Services",
                "Mehr Automatisierung",
                "Mehr Reichweite",
                "Investor ist vor Totalausfall geschützt",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* FOUNDER CONVICTION — Polished Version */}
        {/* ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-card p-6 md:p-10 max-w-3xl mx-auto mb-8"
        >
          <Heart className="w-8 h-8 text-primary mx-auto mb-6" />
          <h3 className="text-xl font-black text-foreground text-center mb-6">Meine ehrliche Einschätzung</h3>
          
          <div className="space-y-4 text-foreground leading-relaxed">
            <p className="text-lg font-semibold italic">
              «Für mich persönlich fühlt sich dieses Modell wie 100% an, weil ich nicht aufhöre, bis ein funktionierender profitabler Kern sichtbar ist.»
            </p>
            <p className="text-sm text-muted-foreground">
              Objektiv nenne ich es trotzdem nicht blind 100%, weil Markt, Wettbewerb, Partnerqualität, Timing und Plattformabhängigkeiten nicht vollständig kontrollierbar sind. Genau deshalb bauen wir Umzugscheck nicht auf Hoffnung, sondern auf klare Optimierungszyklen, messbare Signale und harte Disziplin.
            </p>
            <p className="text-sm text-muted-foreground">
              Jede zentrale Hypothese wird strukturiert getestet. Ein Run bedeutet immer: testen, auswerten, Engpass identifizieren, verbessern und erneut testen. Diesen Zyklus wiederholen wir bis zu fünfmal. Nicht, weil wir an blindes Weiterprobieren glauben, sondern weil ein einzelner Test fast nie die Wahrheit zeigt.
            </p>
            <p className="text-sm text-muted-foreground">
              Wenn nach fünf sauberen Optimierungszyklen keine belastbare Wirtschaftlichkeit sichtbar ist, stoppen wir konsequent. Nicht aus Zweifel, sondern aus unternehmerischer Disziplin.
            </p>
          </div>
        </motion.div>

        {/* Schlussgedanke */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 md:p-8 max-w-3xl mx-auto mb-16 text-center"
        >
          <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">Schlussgedanke an den Investor</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Ich suche kein Kapital für endloses Ausprobieren. Ich suche Kapital für einen klaren, messbaren Aufbauprozess mit echter Lernkurve, konsequenter Optimierung und sauberer Stop-Logik.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Wenn das Modell trägt, skalieren wir es entschlossen. Wenn es diesen Nachweis nicht bringt, stoppen wir konsequent.
          </p>
          <p className="text-lg font-black text-foreground leading-relaxed">
            Mein Commitment ist kompromisslos. Ich werde nicht aufhören, bis wir einen funktionierenden profitablen Kern freigelegt haben — oder die Daten eindeutig zeigen, dass er in dieser Form nicht existiert.
          </p>
        </motion.div>

        {/* Risk vs Reward Scale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-6 mb-12"
        >
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 text-center">Risiko vs. Chance</h4>
          <RiskRewardScale />
        </motion.div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Vielleicht reichen dir die ersten 5 Gründe und du sagst schon:{" "}
            <span className="font-semibold text-foreground">jaja, ist gut, hier ist das Geld.</span>
            <br />
            Falls nicht, haben wir noch 45 weitere.
          </p>
          <p className="text-sm text-muted-foreground/60 mt-6 italic">
            Das hier ist absichtlich übertrieben formuliert. Aber nur im Ton. Nicht in der Substanz.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
