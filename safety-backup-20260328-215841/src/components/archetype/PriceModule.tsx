/**
 * PRICE MODULE
 * 
 * Interactive price selector with savings display
 * Supports both anchors (size-based) and examples (route-based)
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Home, Building, Castle, ArrowRight, TrendingDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { PriceAnchor, PriceExample } from "@/data/archetypeConfig";
import { cn } from "@/lib/utils";

// Icon map for price anchors
const ICON_MAP: Record<string, any> = {
  Home, Building, Castle,
};

interface PriceModuleProps {
  anchors: PriceAnchor[];
  examples?: PriceExample[];
  placeName: string;
  placeKind: 'canton' | 'city';
}

export const PriceModule = memo(({ 
  anchors,
  examples,
  placeName,
  placeKind,
}: PriceModuleProps) => {
  const [selectedAnchor, setSelectedAnchor] = useState(1); // Default to medium
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';

  return (
    <section id="preise" className="py-16 md:py-20 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Umzugspreise {locationPrefix} {placeName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparente Preisübersicht • Sparen Sie bis zu 40% durch Vergleich
          </p>
        </motion.div>

        {/* Price Anchor Cards */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            {anchors.map((anchor, index) => {
              const Icon = ICON_MAP[anchor.icon || 'Home'] || Home;
              const isSelected = selectedAnchor === index;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => setSelectedAnchor(index)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative bg-card border-2 rounded-2xl p-6 text-left transition-all",
                    isSelected 
                      ? "border-primary shadow-lg scale-[1.02]" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {/* Popular Badge for medium */}
                  {index === 1 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Am häufigsten
                    </span>
                  )}
                  
                  {/* Icon + Label */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "w-6 h-6",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <span className="font-medium">{anchor.label}</span>
                  </div>
                  
                  {/* Price Range */}
                  <div className="mb-3">
                    <span className="text-3xl font-bold">
                      CHF {anchor.min.toLocaleString('de-CH')}
                    </span>
                    <span className="text-lg text-muted-foreground">
                      {" "}– {anchor.max.toLocaleString('de-CH')}
                    </span>
                  </div>
                  
                  {/* Savings Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <TrendingDown className="w-4 h-4" />
                    Sparen: {anchor.savingsText}
                  </div>
                  
                  {/* Notes */}
                  {anchor.notes && (
                    <p className="text-xs text-muted-foreground mt-3">{anchor.notes}</p>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Price Details */}
        <motion.div
          key={selectedAnchor}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 text-center mb-8"
        >
          <p className="text-muted-foreground mb-4">
            Für eine <strong>{anchors[selectedAnchor].label}</strong>-Wohnung {locationPrefix} {placeName}:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div>
              <span className="text-4xl font-bold text-primary">
                CHF {anchors[selectedAnchor].min.toLocaleString('de-CH')} – {anchors[selectedAnchor].max.toLocaleString('de-CH')}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <Check className="w-5 h-5" />
              <span className="font-semibold">{anchors[selectedAnchor].savingsText}</span>
            </div>
          </div>
        </motion.div>

        {/* Route Examples (if available) */}
        {examples && examples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              Preisbeispiele für typische Routen
            </h3>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Route</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Grösse</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Preis</th>
                  </tr>
                </thead>
                <tbody>
                  {examples.map((example, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="px-4 py-3 text-sm">{example.routeLabel}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{example.sizeLabel}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-right">{example.priceRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button size="lg" className="h-12 px-8" asChild>
            <Link to="/umzugsofferten">
              Meine Route berechnen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Exakter Preis basierend auf Ihren Angaben • 100% kostenlos
          </p>
        </motion.div>
      </div>
    </section>
  );
});

PriceModule.displayName = 'PriceModule';
