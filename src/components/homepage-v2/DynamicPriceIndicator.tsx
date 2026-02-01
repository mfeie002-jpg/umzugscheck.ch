/**
 * Dynamic Price Indicator V2
 * Sofortige Preisindikation nach PLZ-Eingabe
 * "Zwischen CHF 1'200 und 1'800"
 */
import { memo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, MapPin, TrendingDown, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Simulated price ranges by region
const priceRanges: Record<string, { min: number; max: number; savings: number }> = {
  '80': { min: 1400, max: 2200, savings: 35 }, // Zürich
  '30': { min: 1200, max: 1900, savings: 40 }, // Bern
  '40': { min: 1300, max: 2000, savings: 38 }, // Basel
  '60': { min: 1100, max: 1700, savings: 42 }, // Luzern
  '12': { min: 1500, max: 2400, savings: 32 }, // Genf
  '10': { min: 1400, max: 2100, savings: 36 }, // Lausanne
  default: { min: 1200, max: 1800, savings: 40 },
};

export const DynamicPriceIndicator = memo(function DynamicPriceIndicator() {
  const [plz, setPlz] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number; savings: number } | null>(null);

  const handlePlzChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setPlz(cleaned);
    setPriceRange(null);

    if (cleaned.length === 4) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const prefix = cleaned.slice(0, 2);
        const range = priceRanges[prefix] || priceRanges.default;
        setPriceRange(range);
        setIsLoading(false);
      }, 800);
    }
  }, []);

  const formatPrice = (price: number) => {
    return `CHF ${price.toLocaleString('de-CH')}`;
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          {/* Header */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Was kostet Ihr Umzug?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Geben Sie Ihre PLZ ein für eine sofortige Preisindikation
          </p>

          {/* PLZ Input */}
          <div className="relative max-w-xs mx-auto mb-6">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              inputMode="numeric"
              placeholder="PLZ eingeben (z.B. 8001)"
              value={plz}
              onChange={(e) => handlePlzChange(e.target.value)}
              className="h-14 pl-12 text-lg text-center font-mono tracking-wider"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary animate-spin" />
            )}
          </div>

          {/* Price Result */}
          <AnimatePresence mode="wait">
            {priceRange && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card rounded-2xl border border-border shadow-lg p-6 mb-6"
              >
                <div className="text-sm text-muted-foreground mb-2">
                  Geschätzte Kosten für 3-Zimmer-Wohnung
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {formatPrice(priceRange.min)} – {formatPrice(priceRange.max)}
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <TrendingDown className="w-5 h-5" />
                  <span>Durchschnittlich {priceRange.savings}% Ersparnis möglich</span>
                </div>

                {/* CTA */}
                <Link to="/umzugsofferten" className="block mt-6">
                  <Button size="lg" className="w-full h-14 text-lg font-bold">
                    Genaue Offerten erhalten
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground mt-4">
                  * Basierend auf Durchschnittswerten. Exakter Preis nach Besichtigung.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust Note */}
          {!priceRange && (
            <p className="text-sm text-muted-foreground">
              100% kostenlos • Unverbindlich • Keine Registrierung nötig
            </p>
          )}
        </div>
      </div>
    </section>
  );
});
