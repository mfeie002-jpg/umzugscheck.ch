import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Calculator,
    title: "Angaben eingeben",
    description: "Zimmer, Distanz, Etage",
    delay: 0
  },
  {
    icon: Zap,
    title: "KI analysiert",
    description: "In Sekunden berechnet",
    delay: 0.2
  },
  {
    icon: TrendingUp,
    title: "Preis-Vergleich",
    description: "Marktdaten integriert",
    delay: 0.4
  },
  {
    icon: Shield,
    title: "Offerte erhalten",
    description: "Transparent & fair",
    delay: 0.6
  }
];

export const InteractiveCalculatorDemo = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-premium text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Calculator className="w-5 h-5" />
            <span>KI-Technologie im Einsatz</span>
          </div>
          <h2 className="mb-6">So funktioniert der KI-Preisrechner</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Modernste Künstliche Intelligenz kombiniert mit Schweizer Markdaten für präzise Preis-Offerten
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                onViewportEnter={() => setActiveStep(index)}
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: activeStep === index ? 1.05 : 1,
                    boxShadow: activeStep === index ? "0 20px 50px -10px rgba(var(--primary), 0.3)" : "0 0 0 0 rgba(var(--primary), 0)"
                  }}
                  className="bg-card border-2 border-border rounded-2xl p-6 text-center hover-lift"
                >
                  <motion.div
                    animate={{
                      backgroundColor: activeStep === index ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.1)"
                    }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Icon className={`w-8 h-8 ${activeStep === index ? 'text-white' : 'text-primary'}`} />
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>

                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-y-1/2 -z-10" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Interactive demo preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-premium opacity-10 rounded-bl-[100px]" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-tr-[100px]" />

            <div className="relative z-10 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <div className="text-5xl md:text-6xl font-bold bg-gradient-premium bg-clip-text text-transparent mb-2">
                      {activeStep === 0 && "3.5 Zimmer"}
                      {activeStep === 1 && "⚡ 12 Sek."}
                      {activeStep === 2 && "CHF 1'200-1'800"}
                      {activeStep === 3 && "✓ Bereit"}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {activeStep === 0 && "Zürich → Bern, 3. Stock"}
                      {activeStep === 1 && "KI verarbeitet Ihre Daten"}
                      {activeStep === 2 && "Basiert auf 2'847 Umzügen"}
                      {activeStep === 3 && "Offerte von 3-5 Firmen"}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <Link to="/rechner">
                <Button 
                  size="lg"
                  className="bg-gradient-premium hover:opacity-90 text-white shadow-accent text-lg px-8 h-14 group"
                >
                  Jetzt selbst ausprobieren
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
