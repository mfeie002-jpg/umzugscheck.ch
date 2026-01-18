/**
 * GOLD STANDARD - Location-Aware "So funktioniert's" Section
 * ChatGPT recommendation: Include on every landing page with location-aware copy
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Video, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface LocationAwareHowItWorksProps {
  locationName: string;
  variant?: 'canton' | 'city';
  // Optional list of example cities to show in step 2
  exampleCities?: string[];
}

export const LocationAwareHowItWorks = memo(({ 
  locationName, 
  variant = 'city',
  exampleCities = []
}: LocationAwareHowItWorksProps) => {
  const flowPath = useFlowPath();
  const locationPrefix = variant === 'canton' ? 'im Kanton' : 'in';
  const titleVariant = variant === 'canton' 
    ? `In 3 Schritten zu geprüften Umzugsfirmen ${locationPrefix} ${locationName}`
    : `In 3 Schritten zur passenden Umzugsfirma in ${locationName}`;
  
  const step2Text = exampleCities.length > 0
    ? `Wir checken passende Firmen für ${exampleCities.slice(0, 3).join(', ')}${exampleCities.length > 3 ? ' …' : ''}`
    : `Wir finden passende geprüfte Firmen ${locationPrefix} ${locationName}`;

  const STEPS = [
    {
      step: 1,
      icon: MapPin,
      title: "Umzugsdaten eingeben",
      description: "Start, Ziel, Grösse & Datum – in unter 60 Sekunden.",
      color: "bg-primary",
    },
    {
      step: 2,
      icon: Sparkles,
      title: "Firmen werden gematcht",
      description: step2Text,
      color: "bg-secondary",
    },
    {
      step: 3,
      icon: CheckCircle,
      title: "Vergleichen & buchen",
      description: "Bis zu 5 Offerten in 24–48h, Sie wählen die beste.",
      color: "bg-green-600",
    },
  ];

  return (
    <section id="so-funktionierts" className="py-12 md:py-16 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {titleVariant}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Einfach, schnell und 100% kostenlos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-border" />

          {STEPS.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Step Number Circle */}
              <div className={`w-14 h-14 md:w-16 md:h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg`}>
                <step.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>

              {/* Step Number Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 bg-card border-2 border-border rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                {step.step}
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Button size="lg" className="h-14 px-8 gradient-cta text-white shadow-strong" asChild>
            <Link to={flowPath}>
              Jetzt starten – kostenlos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Umzugscheck.ch ist ein Vergleichs- & Vermittlungsservice
          </p>
        </motion.div>
      </div>
    </section>
  );
});

LocationAwareHowItWorks.displayName = 'LocationAwareHowItWorks';
