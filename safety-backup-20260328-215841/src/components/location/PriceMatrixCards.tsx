/**
 * PRICE MATRIX CARDS
 * 
 * Interactive price cards showing cost ranges by apartment size
 * With savings highlight and CTA
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Home, Building2, Castle, ArrowRight, TrendingDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PriceItem {
  label: string;
  min: number;
  max: number;
  savings: string;
  icon: string;
}

interface PriceMatrixCardsProps {
  prices: {
    small: PriceItem;
    medium: PriceItem;
    large: PriceItem;
  };
  locationName: string;
  variant?: 'canton' | 'city';
  onRequestQuote?: (size: 'small' | 'medium' | 'large') => void;
  className?: string;
}

const iconMap: Record<string, typeof Home> = {
  Home,
  Building: Building2,
  Building2,
  Castle,
};

export const PriceMatrixCards = memo(({
  prices,
  locationName,
  variant = 'canton',
  onRequestQuote,
  className,
}: PriceMatrixCardsProps) => {
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');

  const priceItems = [
    { key: 'small' as const, ...prices.small },
    { key: 'medium' as const, ...prices.medium },
    { key: 'large' as const, ...prices.large },
  ];

  const handleQuoteRequest = () => {
    if (onRequestQuote) {
      onRequestQuote(selectedSize);
    } else {
      const element = document.getElementById('offerten');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="preise" className={cn("py-16 scroll-mt-20", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Preise & Sparpotential
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Umzugskosten {variant === 'canton' ? 'im Kanton' : 'in'} {locationName}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparente Preisübersicht basierend auf realen Offerten. 
              Mit dem Vergleich sparen Sie bis zu 40%.
            </p>
          </div>

          {/* Price Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {priceItems.map((item, index) => {
              const IconComponent = iconMap[item.icon] || Home;
              const isSelected = selectedSize === item.key;
              
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedSize(item.key)}
                  className={cn(
                    "relative bg-card rounded-2xl p-6 border-2 cursor-pointer transition-all",
                    isSelected
                      ? "border-primary shadow-lg scale-[1.02]"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {/* Popular Badge */}
                  {item.key === 'medium' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        Beliebt
                      </span>
                    </div>
                  )}

                  {/* Icon & Label */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}>
                      <IconComponent className={cn(
                        "w-6 h-6",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.label}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.key === 'small' ? 'Wohnung' : item.key === 'medium' ? 'Wohnung' : 'Haus/Villa'}
                      </p>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold">
                      CHF {item.min.toLocaleString('de-CH')}
                      <span className="text-muted-foreground font-normal">–</span>
                      {item.max.toLocaleString('de-CH')}
                    </div>
                  </div>

                  {/* Savings */}
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">Sparen Sie {item.savings}</span>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-primary fill-primary/20" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleQuoteRequest}
              className="h-14 px-8 text-lg"
            >
              Offerten für {priceItems.find(p => p.key === selectedSize)?.label} erhalten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              100% kostenlos & unverbindlich
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

PriceMatrixCards.displayName = 'PriceMatrixCards';
