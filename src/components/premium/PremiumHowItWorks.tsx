import { FileText, Cpu, CheckSquare, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Umzugsdetails eingeben",
    description: "Geben Sie in wenigen Schritten Ihre Umzugsdetails ein: Adressen, Wohnungsgrösse, gewünschte Services und Ihr Wunschdatum.",
    highlight: "2 Minuten"
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI-Analyse & passende Firmen",
    description: "Unser intelligentes System analysiert Ihre Anforderungen und findet die bestpassenden, geprüften Umzugsfirmen in Ihrer Region.",
    highlight: "200+ Firmen"
  },
  {
    number: "03",
    icon: CheckSquare,
    title: "Offerten vergleichen & wählen",
    description: "Vergleichen Sie transparente Offerten, Kundenbewertungen und Leistungen – und wählen Sie die beste Firma für Ihren Umzug.",
    highlight: "Bis 40% sparen"
  }
];

export const PremiumHowItWorks = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm uppercase tracking-wider mb-4"
          >
            <Sparkles className="h-4 w-4" />
            So funktioniert's
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            In 3 einfachen Schritten zum perfekten Umzug
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kein Stress, keine endlosen Telefonate – unser System macht die Arbeit für Sie.
          </p>
        </motion.div>
        
        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 mb-16 relative">
          {/* Animated Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 origin-left"
            />
          </div>
          
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative group"
              >
                <div className="text-center">
                  {/* Step Number with Pulse Ring */}
                  <div className="relative inline-flex items-center justify-center w-28 h-28 mb-6">
                    {/* Pulse Ring */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                      className="absolute inset-0 rounded-2xl bg-primary/20"
                    />
                    {/* Main Icon Box */}
                    <div className="relative w-24 h-24 rounded-2xl bg-card border border-border/50 shadow-premium flex items-center justify-center group-hover:shadow-lift group-hover:border-primary/30 transition-all duration-300">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    {/* Number Badge */}
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-xl flex items-center justify-center text-sm font-bold shadow-copper cursor-default"
                    >
                      {step.number}
                    </motion.span>
                  </div>
                  
                  {/* Highlight Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.2 + 0.3 }}
                    className="inline-flex items-center px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full mb-4"
                  >
                    {step.highlight}
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
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
            <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-semibold shadow-copper hover:shadow-lift transition-all group">
              <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
              Jetzt starten
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
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
