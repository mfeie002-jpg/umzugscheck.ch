import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Clock, RefreshCw, Award, Headphones } from "lucide-react";

const GUARANTEES = [
  {
    icon: Shield,
    title: "100% Kostenlos",
    description: "Unser Service ist komplett kostenlos und unverbindlich",
  },
  {
    icon: CheckCircle,
    title: "Geprüfte Partner",
    description: "Alle Firmen durchlaufen unseren strengen Qualitätscheck",
  },
  {
    icon: Award,
    title: "Beste Preise",
    description: "Garantiert die günstigsten Angebote durch Vergleich",
  },
  {
    icon: Clock,
    title: "Schnelle Antwort",
    description: "Offerten innerhalb von 24-48 Stunden",
  },
];

export const RegionGuarantees = memo(() => {
  return (
    <section className="py-10 md:py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Unsere Garantien für Sie
          </h2>
          <p className="text-muted-foreground">
            Wir stehen für Qualität, Transparenz und Kundenzufriedenheit
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {GUARANTEES.map((guarantee, index) => (
            <motion.div
              key={guarantee.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-4 md:p-5 border border-border text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <guarantee.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">{guarantee.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {guarantee.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

RegionGuarantees.displayName = 'RegionGuarantees';
