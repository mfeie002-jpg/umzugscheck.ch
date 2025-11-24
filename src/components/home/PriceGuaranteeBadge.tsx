import { motion } from "framer-motion";
import { ShieldCheck, TrendingDown, Clock, Award } from "lucide-react";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Preisgarantie",
    description: "Keine versteckten Kosten",
  },
  {
    icon: TrendingDown,
    title: "Bestpreis",
    description: "Oder Geld zurück",
  },
  {
    icon: Clock,
    title: "24h-Antwort",
    description: "Schnelle Rückmeldung",
  },
  {
    icon: Award,
    title: "Qualität",
    description: "Geprüfte Partnerfirmen",
  },
];

export const PriceGuaranteeBadge = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Unsere Garantien für Sie
          </h3>
          <p className="text-muted-foreground">
            Wir stehen zu 100% hinter unseren Versprechen
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <motion.div
                key={guarantee.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-card border-2 border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors shadow-lg"
                >
                  <Icon className="w-10 h-10 text-primary" />
                </motion.div>
                <h4 className="font-bold text-foreground mb-1">
                  {guarantee.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {guarantee.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
