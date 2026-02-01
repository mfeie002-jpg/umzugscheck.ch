import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PiggyBank, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type SizeOption = "small" | "medium" | "large";

interface PricingData {
  label: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  savingsPercent: number;
}

const PRICING_DATA: Record<SizeOption, PricingData> = {
  small: {
    label: "Klein",
    description: "1-2 Zimmer",
    originalPrice: 1200,
    discountedPrice: 840,
    savings: 360,
    savingsPercent: 30,
  },
  medium: {
    label: "Mittel",
    description: "3-4 Zimmer",
    originalPrice: 1800,
    discountedPrice: 1260,
    savings: 540,
    savingsPercent: 30,
  },
  large: {
    label: "Gross",
    description: "5+ Zimmer",
    originalPrice: 2800,
    discountedPrice: 1960,
    savings: 840,
    savingsPercent: 30,
  },
};

export const SavingsCalculatorSimple = () => {
  const [selectedSize, setSelectedSize] = useState<SizeOption>("medium");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const currentPricing = PRICING_DATA[selectedSize];

  return (
    <section ref={ref} className="py-12 md:py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <PiggyBank className="w-4 h-4" />
            Sparrechner
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Wie viel könnten Sie sparen?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Wählen Sie Ihre Umzugsgrösse
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          {/* Size Pills */}
          <div className="flex justify-center gap-2 md:gap-3 mb-8">
            {(Object.keys(PRICING_DATA) as SizeOption[]).map((size) => {
              const data = PRICING_DATA[size];
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "flex-1 max-w-[140px] px-4 py-3 rounded-xl text-center transition-all duration-200",
                    "touch-manipulation border-2",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : "bg-card text-foreground border-border hover:border-primary/50"
                  )}
                >
                  <div className="font-semibold text-sm md:text-base">
                    {data.label}
                  </div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {data.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Results Card */}
          <motion.div
            key={selectedSize}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm"
          >
            <div className="space-y-4">
              {/* Original Price */}
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Durchschnittlicher Einzelpreis</span>
                <span className="text-xl line-through text-muted-foreground">
                  CHF {currentPricing.originalPrice.toLocaleString("de-CH")}
                </span>
              </div>

              {/* Savings */}
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-emerald-600 dark:text-emerald-500 font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Ihre Ersparnis
                </span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-500">
                  - CHF {currentPricing.savings.toLocaleString("de-CH")}
                </span>
              </div>

              {/* Final Price */}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg text-foreground">Mit Umzugscheck</span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary">
                    CHF {currentPricing.discountedPrice.toLocaleString("de-CH")}
                  </span>
                  <div className="text-sm text-emerald-600 dark:text-emerald-500 font-medium">
                    = {currentPricing.savingsPercent}% gespart
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button asChild className="w-full mt-6 group" size="lg">
              <Link to="/vergleich">
                Jetzt kostenlos vergleichen
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Basierend auf 15'000+ Preisvergleichen seit 2019
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SavingsCalculatorSimple;
