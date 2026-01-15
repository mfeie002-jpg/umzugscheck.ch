/**
 * CITIES DIRECTORY
 * 
 * Searchable grid of cities in a canton
 * Used on Canton pages for internal linking
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CityInCanton {
  name: string;
  slug: string;
  shortBlurb: string;
  population?: number;
}

interface CitiesDirectoryProps {
  cities: CityInCanton[];
  cantonName: string;
}

export const CitiesDirectory = memo(({ cities, cantonName }: CitiesDirectoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const displayedCities = showAll ? filteredCities : filteredCities.slice(0, 6);
  const hasMore = filteredCities.length > 6;

  return (
    <section id="gemeinden" className="py-16 md:py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Alle Gemeinden im Kanton {cantonName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Finden Sie Umzugsfirmen in Ihrer Gemeinde – mit lokalen Preisen und Tipps
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Gemeinde suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </motion.div>

        {/* Cities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {displayedCities.map((city, index) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/umzugsfirmen/${city.slug}`}
                className="block bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {city.shortBlurb}
                    </p>
                    {city.population && (
                      <span className="text-xs text-muted-foreground">
                        {city.population.toLocaleString('de-CH')} Einwohner
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Show More */}
        {hasMore && !searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="gap-2"
            >
              {showAll ? 'Weniger anzeigen' : `Alle ${cities.length} Gemeinden anzeigen`}
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                showAll && "rotate-180"
              )} />
            </Button>
          </motion.div>
        )}

        {/* No Results */}
        {filteredCities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Keine Gemeinde gefunden für "{searchTerm}"
          </div>
        )}
      </div>
    </section>
  );
});

CitiesDirectory.displayName = 'CitiesDirectory';
