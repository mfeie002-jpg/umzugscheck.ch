/**
 * GOLD STANDARD - Enhanced Cities Interlinking
 * Canton → Cities pillar-cluster pattern with SEO-rich anchors
 * ChatGPT recommendation: Top 6 as cards + expandable A-Z list
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, ChevronDown, ChevronUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CITIES_MAP } from "@/data/locations";

interface City {
  name: string;
  slug: string;
  tagline?: string;
}

interface RegionCitiesInterlinkingProps {
  regionName: string;
  regionSlug: string;
  variant?: 'canton' | 'city';
}

export const RegionCitiesInterlinking = memo(({ 
  regionName, 
  regionSlug,
  variant = 'canton' 
}: RegionCitiesInterlinkingProps) => {
  const [showAll, setShowAll] = useState(false);
  
  // Get cities for this canton
  const allCities = Object.values(CITIES_MAP)
    .filter((c) => c.cantonSlug === regionSlug)
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
  
  // Top 6 featured cities (largest/most important)
  const topCities = allCities.slice(0, 6);
  const remainingCities = allCities.slice(6);
  
  if (allCities.length === 0) {
    return null;
  }

  return (
    <section id="gemeinden" className="py-12 md:py-16 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Städte & Gemeinden im Kanton {regionName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Finden Sie Umzugsfirmen in Ihrer Stadt. Jede Seite mit lokalen Preisbeispielen, 
            Tipps und geprüften Partnern.
          </p>
        </motion.div>

        {/* Top 6 Cities as Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {topCities.map((city, index) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/umzugsfirmen/${city.slug}`}
                className="group flex flex-col bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/40 transition-all h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {city.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Umzugsfirmen in {city.name} vergleichen
                </p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  <span>Firmen vergleichen</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Expandable A-Z List */}
        {remainingCities.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="w-full mb-4"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Weniger anzeigen
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Alle {allCities.length} Gemeinden anzeigen (A-Z)
                </>
              )}
            </Button>

            <AnimatePresence>
              {showAll && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-muted/30 rounded-xl p-4">
                    {allCities.map((city) => (
                      <Link
                        key={city.slug}
                        to={`/umzugsfirmen/${city.slug}`}
                        className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg hover:bg-card hover:shadow-sm transition-all text-muted-foreground hover:text-foreground"
                      >
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{city.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Link back to canton overview */}
        {variant === 'city' && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Button variant="outline" asChild>
              <Link to={`/umzugsfirmen/kanton-${regionSlug}`}>
                <MapPin className="w-4 h-4 mr-2" />
                Alle Umzugsfirmen im Kanton {regionName}
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
});

RegionCitiesInterlinking.displayName = 'RegionCitiesInterlinking';
