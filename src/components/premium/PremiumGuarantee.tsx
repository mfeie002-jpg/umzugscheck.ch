import { motion } from "framer-motion";
import { Shield, CheckCircle, Award, Clock, RefreshCw, Headphones } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    title: "100% Kostenlos",
    description: "Unser Service ist für Sie komplett kostenlos und unverbindlich",
  },
  {
    icon: CheckCircle,
    title: "Geprüfte Partner",
    description: "Alle Firmen durchlaufen unseren strengen Qualitätscheck",
  },
  {
    icon: Award,
    title: "Beste Preise",
    description: "Garantiert die günstigsten Angebote oder Geld zurück",
  },
  {
    icon: Clock,
    title: "Schnelle Antwort",
    description: "Offerten innerhalb von 24-48 Stunden",
  },
  {
    icon: RefreshCw,
    title: "Kein Risiko",
    description: "Jederzeit ohne Begründung absagen",
  },
  {
    icon: Headphones,
    title: "Persönlicher Support",
    description: "Wir begleiten Sie durch den gesamten Prozess",
  },
];

export const PremiumGuarantee = () => {
  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 bg-primary/10 rounded-full mb-4 md:mb-6">
            <Shield className="w-7 h-7 md:w-10 md:h-10 text-primary" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            Unsere Garantien für Sie
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Wir stehen für Qualität, Transparenz und Kundenzufriedenheit
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={guarantee.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4">
                <guarantee.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2">{guarantee.title}</h3>
              <p className="text-muted-foreground text-xs md:text-sm">{guarantee.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
