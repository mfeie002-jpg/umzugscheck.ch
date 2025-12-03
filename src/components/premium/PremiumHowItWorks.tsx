import { FileText, Cpu, CheckSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Umzugsdetails eingeben",
    description: "Geben Sie in wenigen Schritten Ihre Umzugsdetails ein: Adressen, Wohnungsgrösse, gewünschte Services und Ihr Wunschdatum."
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI-Analyse & passende Firmen",
    description: "Unser intelligentes System analysiert Ihre Anforderungen und findet die bestpassenden, geprüften Umzugsfirmen in Ihrer Region."
  },
  {
    number: "03",
    icon: CheckSquare,
    title: "Offerten vergleichen & wählen",
    description: "Vergleichen Sie transparente Offerten, Kundenbewertungen und Leistungen – und wählen Sie die beste Firma für Ihren Umzug."
  }
];

export const PremiumHowItWorks = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            So funktioniert's
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            In 3 einfachen Schritten zum perfekten Umzug
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kein Stress, keine endlosen Telefonate – unser System macht die Arbeit für Sie.
          </p>
        </motion.div>
        
        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative"
              >
                {/* Connector Line (Desktop) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
                )}
                
                <div className="text-center">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-accent mb-6 relative">
                    <Icon className="h-10 w-10 text-primary" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Link to="/umzugsofferten">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold shadow-copper hover:shadow-lift transition-all">
              Jetzt starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Kostenlos & unverbindlich – dauert nur 2 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
};
