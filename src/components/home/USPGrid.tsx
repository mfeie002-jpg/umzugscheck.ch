import { Shield, Zap, Award, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const usps = [
  {
    icon: Shield,
    title: "100% kostenlos",
    description: "Unverbindliche Offerten von bis zu 5 geprüften Umzugsfirmen ohne versteckte Kosten",
    color: "success"
  },
  {
    icon: Zap,
    title: "Schnell & einfach",
    description: "Formular in 2 Minuten ausfüllen und innerhalb von 24h Angebote erhalten",
    color: "primary"
  },
  {
    icon: Award,
    title: "Geprüfte Qualität",
    description: "Nur versicherte und zertifizierte Umzugsfirmen mit echten Kundenbewertungen",
    color: "secondary"
  },
  {
    icon: TrendingDown,
    title: "Bis 40% sparen",
    description: "Durch den direkten Vergleich finden Sie garantiert das beste Preis-Leistungs-Verhältnis",
    color: "accent"
  }
];

export const USPGrid = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Warum umzugscheck.ch?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Die clevere Art, Umzugskosten zu vergleichen und zu sparen
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {usps.map((usp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all border border-border/50 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-2xl bg-${usp.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <usp.icon className={`h-8 w-8 text-${usp.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{usp.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{usp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
