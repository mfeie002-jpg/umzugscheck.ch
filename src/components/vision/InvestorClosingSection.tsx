/**
 * InvestorClosingSection — Investment logic + emotional closing
 */
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Rocket, Shield, Heart, CheckCircle2 } from "lucide-react";

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

        {/* Personal conviction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-card p-6 md:p-10 text-center max-w-3xl mx-auto mb-16"
        >
          <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
          <p className="text-lg md:text-xl font-semibold text-foreground leading-relaxed italic">
            «Für mich ist dieses Investment 100% safe, weil ich nicht aufhöre, bis wir oben sind.
            <br className="hidden sm:block" />
            Nicht die Logik des Modells ist offen — nur die Geschwindigkeit, mit der wir es zur Dominanz bringen.»
          </p>
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
