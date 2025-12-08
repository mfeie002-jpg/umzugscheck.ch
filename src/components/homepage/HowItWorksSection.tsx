import { motion } from "framer-motion";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { StaggeredList, AnimatedIcon, RevealOnScroll } from "@/components/common";

const steps = [
  {
    icon: FileText,
    title: "Formular ausfüllen",
    description: "Geben Sie in 2 Minuten Ihre Umzugsdetails ein – von der Wohnungsgrösse bis zum Umzugsdatum.",
    animation: "bounce" as const,
  },
  {
    icon: Sparkles,
    title: "AI-Analyse & Matching",
    description: "Unsere KI analysiert Ihre Anforderungen und findet die passendsten geprüften Umzugsfirmen für Sie.",
    animation: "pulse" as const,
  },
  {
    icon: CheckCircle2,
    title: "Offerten vergleichen & wählen",
    description: "Vergleichen Sie die Angebote transparent und wählen Sie die beste Firma für Ihren Umzug.",
    animation: "float" as const,
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />
      
      <div className="container relative">
        {/* Header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Wie funktioniert der Vergleich?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            In nur 3 einfachen Schritten zu Ihren kostenlosen Umzugsofferten.
          </p>
        </RevealOnScroll>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Animated Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-secondary via-primary to-secondary"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
          </div>
          
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step Number & Icon */}
              <div className="relative mb-6">
                <motion.div 
                  className="w-24 h-24 rounded-2xl bg-card border border-border shadow-soft flex items-center justify-center relative z-10 group-hover:shadow-medium transition-shadow"
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <AnimatedIcon 
                    icon={step.icon} 
                    size={40} 
                    animation={step.animation}
                    className="text-secondary"
                  />
                </motion.div>
                {/* Step Number with Glow */}
                <motion.div 
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shadow-cta z-20"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                >
                  {index + 1}
                </motion.div>
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-secondary transition-colors">
                {step.title}
              </h3>
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
