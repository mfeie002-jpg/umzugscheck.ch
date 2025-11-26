import { ClipboardList, Mail, BarChart3, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: ClipboardList,
    number: "1",
    title: "Anfrage starten",
    description: "Umzugsdetails in 2 Minuten eingeben"
  },
  {
    icon: BarChart3,
    number: "2",
    title: "AI-Matching & Preisanalyse",
    description: "Sofortige Preisspanne & passende Firmen"
  },
  {
    icon: CheckCircle,
    number: "3",
    title: "Angebote vergleichen & buchen",
    description: "Beste Firma wählen und entspannt umziehen"
  }
];

export const RedesignHowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            So funktioniert's
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In 3 einfachen Schritten zum günstigsten Umzugsangebot
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all h-full border border-border/50">
                <div className="mb-4">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-medium">
                      {step.number}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
              
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-4" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Mini CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a href="/rechner">
            <button className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-medium">
              Jetzt starten
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
