import { motion } from "framer-motion";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Formular ausfüllen",
    description: "Geben Sie in 2 Minuten Ihre Umzugsdetails ein – von der Wohnungsgrösse bis zum Umzugsdatum.",
  },
  {
    icon: Sparkles,
    title: "AI-Analyse & Matching",
    description: "Unsere KI analysiert Ihre Anforderungen und findet die passendsten geprüften Umzugsfirmen für Sie.",
  },
  {
    icon: CheckCircle2,
    title: "Offerten vergleichen & wählen",
    description: "Vergleichen Sie die Angebote transparent und wählen Sie die beste Firma für Ihren Umzug.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Wie funktioniert der Vergleich?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            In nur 3 einfachen Schritten zu Ihren kostenlosen Umzugsofferten.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-border" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step Number & Icon */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-2xl bg-card border border-border shadow-soft flex items-center justify-center relative z-10">
                  <step.icon className="w-10 h-10 text-secondary" />
                </div>
                {/* Step Number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shadow-cta z-20">
                  {index + 1}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
