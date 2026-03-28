/**
 * HOW IT WORKS - 3 STEPS
 * 
 * Localized version for archetype pages
 * Used on Canton, City, and Service pages
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Search, ThumbsUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HowItWorks3StepsProps {
  placeName: string;
  placeKind: 'canton' | 'city';
  serviceName?: string;
}

export const HowItWorks3Steps = memo(({ 
  placeName, 
  placeKind,
  serviceName 
}: HowItWorks3StepsProps) => {
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';
  const contextText = serviceName 
    ? `${serviceName} ${locationPrefix} ${placeName}`
    : `Umzug ${locationPrefix} ${placeName}`;
  
  const steps = [
    {
      number: 1,
      icon: ClipboardList,
      title: "Umzugsdetails eingeben",
      description: `Füllen Sie in 2 Minuten das Formular aus – für Ihren ${contextText}.`,
      highlight: "~2 Minuten",
    },
    {
      number: 2,
      icon: Search,
      title: "Wir checken für Sie",
      description: `Wir prüfen 200+ geprüfte Firmen ${locationPrefix} ${placeName} und finden die besten Angebote.`,
      highlight: "200+ Firmen",
    },
    {
      number: 3,
      icon: ThumbsUp,
      title: "Vergleichen & sparen",
      description: "Erhalten Sie 3-5 unverbindliche Offerten. Vergleichen Sie Preise & Bewertungen.",
      highlight: "Bis 40% sparen",
    },
  ];

  return (
    <section id="so-funktionierts" className="py-16 md:py-20 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            SO FUNKTIONIERT'S
          </span>
          <h2 className="text-2xl md:text-4xl font-bold mb-3">
            In 3 Schritten zum perfekten {serviceName || 'Umzug'} {locationPrefix} {placeName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Schnell, einfach und 100% kostenlos zu den besten Angeboten
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 z-0" />
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-2xl p-6 text-center h-full shadow-sm hover:shadow-md transition-shadow">
                  {/* Step Number Circle */}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                  
                  {/* Highlight Badge */}
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {step.highlight}
                  </span>
                </div>

                {/* Arrow between cards (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-primary/40 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button size="lg" className="h-12 px-8" asChild>
            <Link to="/umzugsofferten">
              Jetzt starten – kostenlos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            100% kostenlos • Keine Verpflichtung • 3-5 Offerten in 24-48h
          </p>
        </motion.div>
      </div>
    </section>
  );
});

HowItWorks3Steps.displayName = 'HowItWorks3Steps';
