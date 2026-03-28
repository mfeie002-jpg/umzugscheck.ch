import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Building2, TrendingDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CityData {
  name: string;
  price: string;
  companies: number;
  savings: number;
}

const CITY_DATA: CityData[] = [
  { name: "Zürich", price: "1'400", companies: 48, savings: 32 },
  { name: "Bern", price: "1'100", companies: 36, savings: 29 },
  { name: "Basel", price: "1'200", companies: 29, savings: 31 },
  { name: "Genf", price: "1'600", companies: 22, savings: 28 },
  { name: "Luzern", price: "950", companies: 18, savings: 34 },
  { name: "St. Gallen", price: "880", companies: 14, savings: 33 },
];

export const CityPricesSection = () => {
  const [selectedCity, setSelectedCity] = useState(CITY_DATA[0]);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Umzugspreise in Ihrer Stadt
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Durchschnittliche Preise und aktive Firmen
          </p>
        </motion.div>

        {/* City Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {CITY_DATA.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                "touch-manipulation",
                selectedCity.name === city.name
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground"
              )}
            >
              {city.name}
            </button>
          ))}
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            key={selectedCity.name}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
              {/* Price */}
              <div className="text-center md:border-r md:border-border">
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Durchschnittspreis
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  CHF {selectedCity.price}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  für einen Standardumzug
                </div>
              </div>

              {/* Companies */}
              <div className="text-center md:border-r md:border-border">
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  Aktive Firmen
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {selectedCity.companies}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  geprüfte Partner
                </div>
              </div>

              {/* Savings */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-2">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Ø Ersparnis
                </div>
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-500">
                  {selectedCity.savings}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  gegenüber Einzelangebot
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <Button asChild size="lg" className="group">
                <Link to="/vergleich">
                  Angebote in {selectedCity.name} vergleichen
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CityPricesSection;
