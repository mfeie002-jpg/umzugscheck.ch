import { motion } from "framer-motion";
import { Shield, CheckCircle, Clock, BadgeSwissFranc } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    title: "100% Versichert",
    description: "Alle Partner sind vollversichert"
  },
  {
    icon: CheckCircle,
    title: "Geprüfte Firmen",
    description: "Strenger Qualitätscheck"
  },
  {
    icon: Clock,
    title: "24h Antwort",
    description: "Schnelle Rückmeldung garantiert"
  },
  {
    icon: BadgeSwissFranc,
    title: "Bestpreis",
    description: "Günstigste Angebote finden"
  }
];

export const GuaranteeBadges = () => {
  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={guarantee.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <guarantee.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{guarantee.title}</h3>
              <p className="text-sm text-muted-foreground">{guarantee.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
