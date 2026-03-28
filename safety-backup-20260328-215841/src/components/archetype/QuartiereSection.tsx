/**
 * QUARTIERE SECTION
 * 
 * Display city quarters/neighborhoods with challenges and tips
 * Used on City pages
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, AlertCircle, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { QuartierData } from "@/data/archetypeConfig";

interface QuartiereSectionProps {
  quartiere: QuartierData[];
  cityName: string;
}

export const QuartiereSection = memo(({ quartiere, cityName }: QuartiereSectionProps) => {
  const scrollToForm = () => {
    const el = document.getElementById('offerten');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="quartiere" className="py-16 md:py-20 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Quartiere & Besonderheiten in {cityName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Lokale Expertise für jeden Stadtteil – wir kennen die Herausforderungen
          </p>
        </motion.div>

        {/* Quartiere Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {quartiere.map((quartier, index) => (
            <motion.div
              key={quartier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{quartier.name}</h3>
              </div>

              {/* Challenges */}
              <div className="space-y-2 mb-4">
                {quartier.challenges.map((challenge, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{challenge}</span>
                  </div>
                ))}
              </div>

              {/* Tip */}
              {quartier.tip && (
                <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg text-sm">
                  <Lightbulb className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-green-800">{quartier.tip}</span>
                </div>
              )}

              {/* CTA */}
              <Button 
                size="sm" 
                className="w-full mt-4"
                onClick={scrollToForm}
              >
                Offerten für {cityName}
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

QuartiereSection.displayName = 'QuartiereSection';
