import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Cpu } from "lucide-react";

const cards = [
  {
    icon: Search,
    title: "Hoher Kundennutzen",
    stat: "200+ Firmen",
    body: "Kunden stehen unter Zeitdruck und finden kaum vergleichbare Preise. Umzugscheck löst genau das: KI-Preisrechner, geprüfte Anbieter, transparente Offerten. Wo Vergleich echten Nutzen stiftet, kann eine Plattform stark werden.",
  },
  {
    icon: ShoppingCart,
    title: "Mehrfache Servicebedürfnisse",
    stat: "AOV ↑",
    body: "Rund um einen Umzug fallen mehrere Leistungen zusammen: Räumung, Reinigung, Entsorgung, Lagerung. Pro Kunde ist dadurch mehr Wertschöpfung möglich als bei einem einzelnen Servicefall.",
  },
  {
    icon: Cpu,
    title: "Digitalisierung nicht ausgeschöpft",
    stat: "60 Flows",
    body: "Unsere 60 Flow-Varianten mit Preisvorschau, Trust-Signalen, Video-Analyse und Conversion-Optimierung zeigen: Der Markt bietet enormen Raum für effizientere Kundengewinnung und bessere Abschlussquoten.",
  },
];

export function MarketAttractivenessSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-secondary/10 text-secondary">Marktchance</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Warum gerade dieser Markt attraktiv ist
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Gross, wiederkehrend, intransparent — und mit klarem Optimierungspotenzial.
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
              className="rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{card.stat}</span>
              </div>
              <h3 className="text-lg font-black text-foreground mb-3">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
