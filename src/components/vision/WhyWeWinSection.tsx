import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Layers, Zap } from "lucide-react";

const cards = [
  {
    icon: FlaskConical,
    title: "Systematisches Testing",
    subtitle: "60 Flow-Varianten, nicht raten",
    body: "Wir iterieren strukturiert: testen, auswerten, Engpass finden, verbessern, erneut testen. Jede Hypothese durchläuft bis zu 5 Optimierungszyklen, bevor wir skalieren oder stoppen.",
  },
  {
    icon: Layers,
    title: "Nachfrage + Leistung verstanden",
    subtitle: "Portal kennt den Klick, Dienstleister den Einsatz",
    body: "Umzugscheck versteht Vergleich, Funnel und Abschluss. Feierabend Services versteht operative Qualität und Kundenerwartung im echten Alltag. Zusammen entsteht ein vollständiges Marktbild.",
  },
  {
    icon: Zap,
    title: "Schnelleres Lernen",
    subtitle: "Rückkopplung Portal ↔ Operations",
    body: "Jede Anfrage auf Umzugscheck liefert Conversion-Daten. Jede reale Ausführung liefert Qualitäts-Feedback. Diese Rückkopplung macht Optimierung schneller und das Modell schwerer kopierbar.",
  },
];

export function WhyWeWinSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">Unfairer Vorteil</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Warum wir gewinnen können
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Wir vermitteln den Markt nicht nur — wir verstehen, testen und gestalten ihn operativ mit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 md:p-8 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-black text-foreground mb-1">{card.title}</h3>
              <p className="text-sm text-primary font-semibold mb-3">{card.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
