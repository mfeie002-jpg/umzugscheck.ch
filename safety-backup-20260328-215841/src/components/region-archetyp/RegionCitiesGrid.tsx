/**
 * GOLD STANDARD - Cities Grid with Top 6 Cards + Expandable A-Z List
 * ChatGPT recommendation: Clean pillar → cluster interlinking
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, ChevronDown, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface City {
  name: string;
  slug: string;
  description?: string;
  isTop?: boolean;
}

interface RegionCitiesGridProps {
  regionName: string;
  regionSlug: string;
  cities: City[];
  topCitiesCount?: number;
}

// Top cities with descriptions for cards
const TOP_CITY_DESCRIPTIONS: Record<string, string> = {
  'zug': 'Hauptort, Crypto Valley, Seepromenade',
  'baar': 'Grösste Zuger Gemeinde, familienfreundlich',
  'cham': 'Am Zugersee, gute Anbindung',
  'risch-rotkreuz': 'Verkehrsknoten, wachsend',
  'steinhausen': 'Industriestandort, zentral',
  'huenenberg': 'Natur & See, ruhig',
  'zuerich': 'Grösste Stadt, 12 Stadtkreise',
  'winterthur': 'Zweitgrösste im Kanton',
  'uster': 'Zürcher Oberland',
  'dietikon': 'Limmattal, S-Bahn',
};

export const RegionCitiesGrid = memo(({ 
  regionName, 
  regionSlug,
  cities,
  topCitiesCount = 6 
}: RegionCitiesGridProps) => {
  const [showAllCities, setShowAllCities] = useState(false);
  
  // Separate top cities and rest
  const topCities = cities.slice(0, topCitiesCount);
  const remainingCities = cities.slice(topCitiesCount);

  if (cities.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Städte & Gemeinden im Kanton {regionName}
            </h2>
            <p className="text-muted-foreground">
              Wählen Sie Ihre Stadt für lokale Umzugsfirmen, Preise und Tipps
            </p>
          </div>

          {/* Top 6 Cities as Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {topCities.map((city, index) => (
              <motion.div
                key={city.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/umzugsfirmen/${city.slug}`}>
                  <Card className="p-4 hover:border-primary/50 hover:shadow-md transition-all group h-full">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-semibold">{city.name}</h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {city.description || TOP_CITY_DESCRIPTIONS[city.slug] || `Umzugsfirmen in ${city.name}`}
                    </p>
                    <p className="text-xs text-primary mt-2 font-medium">
                      Umzugsfirmen vergleichen →
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Expandable A-Z List */}
          {remainingCities.length > 0 && (
            <div className="border-t border-border pt-6">
              <Button
                variant="ghost"
                onClick={() => setShowAllCities(!showAllCities)}
                className="w-full justify-between h-12 text-base"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Alle {cities.length} Gemeinden anzeigen
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showAllCities ? 'rotate-180' : ''}`} />
              </Button>
              
              <AnimatePresence>
                {showAllCities && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-4">
                      {remainingCities.map((city) => (
                        <Link
                          key={city.slug}
                          to={`/umzugsfirmen/${city.slug}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {city.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Back to Canton Link */}
          <div className="text-center mt-8">
            <Link 
              to={`/umzugsfirmen/kanton-${regionSlug}`}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              ← Zurück zur Kantonsübersicht {regionName}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

RegionCitiesGrid.displayName = 'RegionCitiesGrid';
