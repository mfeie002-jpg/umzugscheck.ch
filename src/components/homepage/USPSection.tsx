import { motion } from "framer-motion";
import { Shield, Percent, Brain, MapPin } from "lucide-react";

const usps = [
  {
    icon: Shield,
    title: "Geprüfte Schweizer Umzugsfirmen",
    description: "Alle Partner durchlaufen unseren strengen Qualitätsprozess mit Versicherungsnachweis und Bewilligungsprüfung.",
  },
  {
    icon: Percent,
    title: "Bis zu 40% sparen",
    description: "Durch den direkten Vergleich finden Sie das beste Preis-Leistungs-Verhältnis für Ihren Umzug.",
  },
  {
    icon: Brain,
    title: "AI-gestützte Preisanalyse",
    description: "Unsere künstliche Intelligenz analysiert Ihren Umzug und findet die optimal passenden Anbieter.",
  },
  {
    icon: MapPin,
    title: "Schweizweit in allen 26 Kantonen",
    description: "Ob Zürich, Genf oder Graubünden – wir haben geprüfte Partner in der ganzen Schweiz.",
  },
];

export const USPSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Warum Umzugscheck.ch?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Die führende Schweizer Plattform für Umzugsvergleiche.
          </p>
        </div>

        {/* USP Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {usps.map((usp, index) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <usp.icon className="w-7 h-7 text-secondary" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{usp.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {usp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
