/**
 * HowItWorksSection - 4-step process explanation
 * Visual timeline on desktop, vertical on mobile
 */

import { motion } from "framer-motion";
import { FileText, Cpu, Users, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Daten eingeben",
    description: "Wohnungsgrösse, Strecke und Zusatzservices – in weniger als 2 Minuten.",
  },
  {
    icon: Cpu,
    title: "KI schätzt die Kosten",
    description: "Auf Basis tausender realer Umzüge in der Schweiz erhalten Sie eine realistische Preisspanne.",
  },
  {
    icon: Users,
    title: "Passende Firmen erhalten Ihre Anfrage",
    description: "Wir matchen Ihre Daten mit geprüften Umzugsfirmen in Ihrer Region.",
  },
  {
    icon: CheckCircle,
    title: "Offerten vergleichen & beste Firma wählen",
    description: "Sie entscheiden – nach Preis, Bewertungen und Leistungen.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            So funktioniert unser KI-Umzugsrechner
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            In vier einfachen Schritten zu Ihren persönlichen Umzugsofferten
          </p>
        </motion.div>
        
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            <div className="grid grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative text-center"
                >
                  {/* Step Number & Icon */}
                  <div className="relative z-10 mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-card border-4 border-primary/20 flex items-center justify-center mx-auto shadow-lg">
                      <step.icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex gap-4"
            >
              <div className="relative flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-primary/20 mt-2" />
                )}
              </div>
              <div className="pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Schritt {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
